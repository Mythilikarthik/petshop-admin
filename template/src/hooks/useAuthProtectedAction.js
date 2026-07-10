const { useAuth } = require("../contexts/AuthContext");
const { useState } = require("react");

export const useAuthProtectedAction = () => {
  const { user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  const executeProtectedAction = (actionCallback) => {
    if (user) {
      // User is logged in, fire the action right away
      actionCallback();
    } else {
      // User is anonymous, save the intent and show the login wall
      setPendingAction(() => actionCallback);
      setShowAuthModal(true);
    }
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    if (pendingAction) {
      pendingAction(); // Execute the click they originally wanted to do
      setPendingAction(null);
    }
  };

  return {
    showAuthModal,
    setShowAuthModal,
    executeProtectedAction,
    handleAuthSuccess
  };
};