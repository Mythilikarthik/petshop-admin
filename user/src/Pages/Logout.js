import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {logout} from "../features/authSlice"

const Logout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(logout());
    // Clear any stored login/session info
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem("user");
    localStorage.removeItem('isPublicAuth');

    // Redirect to login
    navigate('/');
  }, [dispatch, navigate]);

  return null; // or a loading message if needed
};

export default Logout;
