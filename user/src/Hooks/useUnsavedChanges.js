import { useEffect, useRef, useState } from "react";

/**
 * useUnsavedChanges(formData, options)
 *
 * options:
 *  - excludeKeys: array of keys to ignore when comparing (e.g. ['photos', 'files'])
 *
 * Returns:
 *  - shouldBlockNavigation (boolean)
 *  - confirmLeave() -> boolean (shows window.confirm if unsaved)
 *  - markAsSaved() -> void
 *  - resetInitialSnapshot() -> void  // call after async load to set initial state
 */
export default function useUnsavedChanges(formData, options = {}) {
  const { excludeKeys = ["photos"] } = options;
  const [isSaved, setIsSaved] = useState(false);
  const initialRef = useRef(null);

  // helper to produce a JSON-safe comparable object with excluded keys removed
  const normalize = (obj) => {
    if (!obj) return obj;
    // shallow clone then remove excluded keys
    const clone = Array.isArray(obj) ? [...obj] : { ...obj };
    excludeKeys.forEach((key) => {
      if (clone && Object.prototype.hasOwnProperty.call(clone, key)) {
        clone[key] = Array.isArray(clone[key]) ? [] : null;
      }
    });
    return clone;
  };

  // set initial snapshot once (but also allow resetInitialSnapshot to override)
  useEffect(() => {
  // only set once if not already manually reset
  if (!initialRef.current && formData && Object.keys(formData).length > 0) {
    try {
      initialRef.current = JSON.stringify(normalize(formData));
    } catch (e) {
      initialRef.current = null;
    }
  }
}, [formData]);

  const resetInitialSnapshot = () => {
    try {
      initialRef.current = JSON.stringify(normalize(formData));
    } catch (e) {
      initialRef.current = null;
    }
  };

  const isFormChanged = () => {
    if (!initialRef.current) return false;
    try {
      const current = JSON.stringify(normalize(formData));
      return initialRef.current !== current;
    } catch (e) {
      return false;
    }
  };

  // browser/tab close native dialog
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isFormChanged() && !isSaved) {
        e.preventDefault();
        e.returnValue = ""; // required by some browsers to show dialog
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [formData, isSaved]); // formData in deps so latest state considered

  // to be called by UI navigation handlers (Go Back, Cancel, etc.)
  const confirmLeave = () => {
    if (isFormChanged() && !isSaved) {
      return window.confirm("You have unsaved changes. Do you really want to leave?");
    }
    return true;
  };

  const markAsSaved = () => setIsSaved(true);

  return {
    shouldBlockNavigation: isFormChanged() && !isSaved,
    confirmLeave,
    markAsSaved,
    resetInitialSnapshot,
  };
}
