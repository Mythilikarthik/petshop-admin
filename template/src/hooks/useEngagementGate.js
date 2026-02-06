// hooks/useEngagementGate.js
import { useEffect, useState } from "react";
import { getListingViews } from "../utils/engagementTracker";

export const useEngagementGate = (user) => {
  const [showGate, setShowGate] = useState(false);

  useEffect(() => {
    if (user) return; // already logged in

    const views = getListingViews();
    const entry = Number(localStorage.getItem("entryTime") || 0);
    const timeSpent = Date.now() - entry;

    if (views >= 3 || timeSpent >= 120000) {
      setShowGate(true);
    }
  }, [user]);

  return showGate;
};
