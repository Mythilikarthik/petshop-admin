import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../features/authSlice';
import { useNavigate } from 'react-router-dom';

const useSessionTimeout = (timeoutMinutes = 30) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    let logoutTimer;
    let events = ['click', 'mousemove', 'keydown', 'scroll', 'touchstart'];
      let isMounted = true;

    const resetTimer = () => {
      clearTimeout(logoutTimer);
      logoutTimer = setTimeout(handleLogout, timeoutMinutes * 60 * 1000); // Convert minutes → ms
    };

    const handleLogout = () => {
            if (!isMounted) return; // don’t navigate after unmount
        localStorage.clear();
        dispatch(logout());

        try {
            navigate('/', { replace: true });
        } catch (err) {
            console.warn("Navigation failed (probably due to context):", err);
            window.location.href = '/'; // fallback hard redirect
        }

        alert('Session expired. Please log in again.');
        };

    // Add listeners to reset timer on user activity
    events.forEach((event) => window.addEventListener(event, resetTimer));

    resetTimer(); // start initial timer

    return () => {
            isMounted = false;
      clearTimeout(logoutTimer);
      events.forEach((event) => window.removeEventListener(event, resetTimer));
    };
  }, [dispatch, navigate, timeoutMinutes]);
};

export default useSessionTimeout;
