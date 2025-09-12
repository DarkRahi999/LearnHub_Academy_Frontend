"use client";

import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/context/store';
import { initializeAuth, logout, setAuthLoading } from '@/context/reduxSlice/userSlice';
import { getCurrentUser } from '@/services/auth.service';
import { API_BASE_URL } from '@/config/configURL';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user, token, isLoading } = useSelector((state: RootState) => state.user.auth);

  useEffect(() => {
    const initializeAuthState = async () => {
      dispatch(setAuthLoading(true));
      
      try {
        const storedUser = getCurrentUser();
        const storedToken = localStorage.getItem('access_token');
        
        if (storedUser && storedToken) {
          // Check if token is expired before making API call
          try {
            const tokenPayload = JSON.parse(atob(storedToken.split('.')[1]));
            const currentTime = Math.floor(Date.now() / 1000);
            
            if (tokenPayload.exp && tokenPayload.exp > currentTime) {
              // Token is not expired, use it directly
              dispatch(initializeAuth({ user: storedUser, token: storedToken }));
              return;
            }
          } catch {
            // Invalid token format, clear storage
            localStorage.removeItem('access_token');
            localStorage.removeItem('user');
            localStorage.removeItem('user_data');
            dispatch(initializeAuth({ user: null, token: null }));
            return;
          }
          
          // Token is expired, validate with server
          const response = await fetch(`${API_BASE_URL}/auth/validate`, {
            headers: {
              'Authorization': `Bearer ${storedToken}`,
            },
          });
          
          if (response.ok) {
            dispatch(initializeAuth({ user: storedUser, token: storedToken }));
          } else {
            // Token is invalid, clear storage
            localStorage.removeItem('access_token');
            localStorage.removeItem('user');
            localStorage.removeItem('user_data');
            dispatch(initializeAuth({ user: null, token: null }));
          }
        } else {
          dispatch(initializeAuth({ user: null, token: null }));
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        // Clear storage on error
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        localStorage.removeItem('user_data');
        dispatch(initializeAuth({ user: null, token: null }));
      }
    };

    initializeAuthState();
  }, [dispatch]);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    localStorage.removeItem('user_data');
    dispatch(logout());
  };

  return {
    isAuthenticated,
    user,
    token,
    isLoading,
    logout: handleLogout,
  };
};
