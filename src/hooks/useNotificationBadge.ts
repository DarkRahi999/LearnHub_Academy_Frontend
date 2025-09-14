import { useState, useEffect, useCallback, useRef } from 'react';
import { noticeService } from '@/services/notice.service';

type NotificationContextType = {
  unreadCount: number;
  loading: boolean;
  markAsRead: (noticeId: number) => Promise<void>;
  refreshCount: () => void;
};

export function useNotificationBadge(): NotificationContextType {
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const isInitialized = useRef(false);

  const fetchUnreadCount = useCallback(async () => {
    try {
      setLoading(true);
      const response = await noticeService.getUnreadNoticesCount();
      setUnreadCount(response.unreadCount);
      isInitialized.current = true;
    } catch (error) {
      console.error('Failed to fetch unread count:', error);
      setUnreadCount(0);
    } finally {
      setLoading(false);
    }
  }, []);

  const markAsRead = useCallback(async (noticeId: number) => {
    try {
      await noticeService.markNoticeAsRead(noticeId);
      // Immediately update the count optimistically
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark notice as read:', error);
      // If there's an error, refresh to get accurate count
      await fetchUnreadCount();
    }
  }, [fetchUnreadCount]);

  const refreshCount = useCallback(() => {
    fetchUnreadCount();
  }, [fetchUnreadCount]);

  useEffect(() => {
    // Only fetch once on mount
    if (!isInitialized.current) {
      fetchUnreadCount();
    }
    
    // Set up an interval to periodically refresh the count (less frequent)
    const interval = setInterval(() => {
      if (isInitialized.current) {
        fetchUnreadCount();
      }
    }, 60000); // Refresh every 60 seconds instead of 30
    
    return () => clearInterval(interval);
  }, [fetchUnreadCount]);

  return {
    unreadCount,
    loading,
    markAsRead,
    refreshCount,
  };
}