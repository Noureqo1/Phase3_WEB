import { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = Cookies.get('token');
        if (!token) {
          setLoading(false);
          return;
        }

        const response = await axios.get('/api/v1/users/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(response.data.data);
      } catch (err: any) {
        console.error('Failed to fetch user:', err);
        // Clear invalid token
        Cookies.remove('token');
        setError(err.message || 'Failed to authenticate');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const login = (token: string, userData: any) => {
    Cookies.set('token', token, { expires: 7 });
    setUser(userData);
  };

  const logout = () => {
    Cookies.remove('token');
    setUser(null);
  };

  const isAuthenticated = !!user;

  return {
    user,
    loading,
    error,
    isAuthenticated,
    login,
    logout,
  };
};
