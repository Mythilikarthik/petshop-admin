import { useEffect, useRef, useState } from "react";

export default function useUnsavedChanges(formData) {
  const [isSaved, setIsSaved] = useState(false);
  const initialRef = useRef(null);

  // Save initial form data
  useEffect(() => {
    if (!initialRef.current && formData) {
      initialRef.current = JSON.stringify(formData);
    }
  }, [formData]);

  // Check if data changed
  const isFormChanged = () => {
    if (!initialRef.current) return false;
    const current = JSON.stringify({
      ...formData,
      photos: [], // exclude file/blob fields
    });
    return initialRef.current !== current;
  };

  // Warn before tab/browser close
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isFormChanged() && !isSaved) {
        e.preventDefault();
        e.returnValue = ""; // Chrome requires this
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [formData, isSaved]);

  // Handle manual navigation (like Go Back button)
  const confirmLeave = () => {
    if (isFormChanged() && !isSaved) {
      return window.confirm(
        "You have unsaved changes. Do you really want to leave this page?"
      );
    }
    return true;
  };

  return {
    shouldBlockNavigation: isFormChanged() && !isSaved,
    confirmLeave,
    markAsSaved: () => setIsSaved(true),
  };
}
