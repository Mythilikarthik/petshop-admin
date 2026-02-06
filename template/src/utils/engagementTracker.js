// utils/engagementTracker.js
export const incrementListingViews = () => {
  const count = Number(localStorage.getItem("listingViews") || 0);
  localStorage.setItem("listingViews", count + 1);
};

export const getListingViews = () =>
  Number(localStorage.getItem("listingViews") || 0);

export const resetEngagement = () => {
  localStorage.removeItem("listingViews");
  localStorage.removeItem("entryTime");
};
