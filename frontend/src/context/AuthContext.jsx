import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { authApi } from '../api/services';

const AuthContext = createContext(null);

const storedUser = () => {
  try {
    return JSON.parse(localStorage.getItem('ttm_user'));
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(storedUser);
  const [booting, setBooting] = useState(true);

  const saveSession = useCallback((token, nextUser) => {
    localStorage.setItem('ttm_token', token);
    localStorage.setItem('ttm_user', JSON.stringify(nextUser));
    setUser(nextUser);
  }, []);

  const clearSession = useCallback(() => {
    localStorage.removeItem('ttm_token');
    localStorage.removeItem('ttm_user');
    setUser(null);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('ttm_token');
    if (!token) {
      setBooting(false);
      return;
    }

    authApi
      .me()
      .then(({ data }) => {
        localStorage.setItem('ttm_user', JSON.stringify(data.user));
        setUser(data.user);
      })
      .catch(clearSession)
      .finally(() => setBooting(false));
  }, [clearSession]);

  const login = useCallback(async (payload) => {
    const { data } = await authApi.login(payload);
    saveSession(data.token, data.user);
    toast.success('Welcome back');
  }, [saveSession]);

  const register = useCallback(async (payload) => {
    const { data } = await authApi.register(payload);
    saveSession(data.token, data.user);
    toast.success('Account created');
  }, [saveSession]);

  const logout = useCallback(() => {
    clearSession();
    toast.success('Logged out');
  }, [clearSession]);

  const value = useMemo(
    () => ({
      user,
      booting,
      isAdmin: user?.role === 'ADMIN',
      login,
      register,
      logout
    }),
    [user, booting, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
