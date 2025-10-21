import { useState, useEffect, useCallback, useRef } from 'react';
import { noticeService } from '@/services/notice.service';
import { useAuth } from '@/hooks/useAuth';

type NotificationContextType = {
  unreadCount: number;
  loading: boolean;
  markAsRead: (noticeId: number) => Promise<void>;
  refreshCount: () => Promise<void>;
};

export function useNotificationBadge(): NotificationContextType {
  const { user, isLoading: authLoading } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const isInitialized = useRef(false);

  const fetchUnreadCount = useCallback(async () => {
    // Don't fetch if user is not authenticated
    if (!user || authLoading) {
      setUnreadCount(0);
      return;
    }

    try {
      setLoading(true);
      const response = await noticeService.getUnreadNoticesCount();
      setUnreadCount(response.unreadCount);
      isInitialized.current = true;
    } catch (error) {
      console.error('Failed to fetch unread count:', error);
      setUnreadCount(0);
      // Reset initialization flag on error to allow retry
      isInitialized.current = false;
    } finally {
      setLoading(false);
    }
  }, [user, authLoading]);

  const markAsRead = useCallback(async (noticeId: number) => {
    if (!user) return;
    
    try {
      await noticeService.markNoticeAsRead(noticeId);
      // After marking as read, refresh the count from the server to ensure accuracy
      await fetchUnreadCount();
    } catch (error) {
      console.error('Failed to mark notice as read:', error);
      // If there's an error, refresh to get accurate count
      await fetchUnreadCount();
    }
  }, [fetchUnreadCount, user]);

  const refreshCount = useCallback(async () => {
    if (user && !authLoading) {
      await fetchUnreadCount();
    }
  }, [fetchUnreadCount, user, authLoading]);

  // Expose a function to manually set the unread count (for optimistic updates)
  const setUnreadCountDirect = useCallback((count: number) => {
    setUnreadCount(count);
  }, []);

  useEffect(() => {
    // Reset state when user changes (login/logout)
    if (!user) {
      setUnreadCount(0);
      isInitialized.current = false;
      return;
    }

    // Only fetch once when user is authenticated and not loading
    if (user && !authLoading && !isInitialized.current) {
      fetchUnreadCount();
    }
  }, [user, authLoading, fetchUnreadCount]);

  useEffect(() => {
    // Set up an interval to periodically refresh the count (only when authenticated)
    if (!user || authLoading) {
      return;
    }

    const interval = setInterval(() => {
      if (user && !authLoading && isInitialized.current) {
        fetchUnreadCount();
      }
    }, 10000); // Refresh every 10 seconds for better responsiveness
    
    return () => clearInterval(interval);
  }, [fetchUnreadCount, user, authLoading]);

  return {
    unreadCount,
    loading,
    markAsRead,
    refreshCount,
  };
}