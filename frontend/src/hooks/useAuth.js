import { useState } from 'react';
import useAuthStore from '../store/authStore';
import { authService } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import { socketService } from '../services/socketService';

export const useAuth = () => {
  const navigate = useNavigate();
  const { user, login: storeLogin, register: storeRegister, logout: storeLogout, setError, setLoading, isLoading, error } = useAuthStore();
  const [localError, setLocalError] = useState(null);

  const login = async (email, password) => {
    setLoading(true);
    setLocalError(null);
    try {
      const data = await authService.login(email, password);
      storeLogin(data.user, data.token);
      socketService.connect(data.user._id);
      navigate('/');
      return true;
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed';
      setError(msg);
      setLocalError(msg);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email, password, name, username) => {
    setLoading(true);
    setLocalError(null);
    try {
      const data = await authService.register(email, password, name, username);
      storeRegister(data.user, data.token);
      socketService.connect(data.user._id);
      navigate('/');
      return true;
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed';
      setError(msg);
      setLocalError(msg);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    storeLogout();
    authService.logout();
    socketService.disconnect();
    navigate('/login');
  };

  return {
    user,
    isLoading,
    error: localError || error,
    login,
    register,
    logout
  };
};
