import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { authService } from '@/services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bootstrapAuth = async () => {
      try {
        const token = localStorage.getItem('pawlx_token');
        const storedUser = localStorage.getItem('pawlx_user');

        if (token && storedUser) {
          try {
            setUser(JSON.parse(storedUser));
          } catch (parseError) {
            // Corrupted/stale localStorage from a previous session — wipe it and
            // fall through to a clean logged-out state instead of hanging forever.
            localStorage.removeItem('pawlx_token');
            localStorage.removeItem('pawlx_user');
            setLoading(false);
            return;
          }

          try {
            const { data } = await authService.getMe();
            setUser(data);
            localStorage.setItem('pawlx_user', JSON.stringify(data));
          } catch (error) {
            // Interceptor already clears storage + redirects on 401
          }
        }
      } catch (error) {
        // Never let bootstrap failures leave the app stuck on a loading spinner
        console.error('Auth bootstrap failed:', error);
      } finally {
        setLoading(false);
      }
    };

    bootstrapAuth();
  }, []);

  const login = useCallback(async (credentials) => {
    const { data } = await authService.login(credentials);
    localStorage.setItem('pawlx_token', data.token);
    localStorage.setItem('pawlx_user', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  }, []);

  const register = useCallback(async (payload) => {
    const { data } = await authService.register(payload);
    localStorage.setItem('pawlx_token', data.token);
    localStorage.setItem('pawlx_user', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('pawlx_token');
    localStorage.removeItem('pawlx_user');
    setUser(null);
  }, []);

  const updateUserInContext = useCallback((updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('pawlx_user', JSON.stringify(updatedUser));
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, isAuthenticated: !!user, login, register, logout, updateUserInContext }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
