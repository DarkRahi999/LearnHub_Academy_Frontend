"use client";

import { useEffect, useState, useCallback, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Search, Filter, Plus } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { noticeService, Notice } from '@/services/notice.service';
import { useNotificationBadge } from '@/hooks/useNotificationBadge';
import { NoticeCard } from '@/components/ui/notice-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UserRole } from '@/interface/user';
import Link from 'next/link';

// Custom hook for debounced values
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default function NoticesPage() {
  const { user, isLoading: authLoading } = useAuth();
  const { markAsRead } = useNotificationBadge();
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showActiveOnly, setShowActiveOnly] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  
  // Debounce search term to avoid too many API calls
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const fetchNotices = useCallback(async (search?: string) => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);
      const data = await noticeService.getAllNotices(search);
      setNotices(data.notices);
      setTotalCount(data.total || data.notices.length);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching notices');
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Initial fetch when user is ready
  useEffect(() => {
    if (!authLoading && user) {
      fetchNotices();
    }
  }, [authLoading, user, fetchNotices]);

  // Fetch notices when search term changes (debounced)
  useEffect(() => {
    if (!authLoading && user) {
      fetchNotices(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm, authLoading, user, fetchNotices]);

  // Client-side filter for active status only (since search is now server-side)
  const displayNotices = useMemo(() => {
    return notices.filter(notice => showActiveOnly ? notice.isActive : true);
  }, [notices, showActiveOnly]);

  const canCreateNotice = user?.role === UserRole.ADMIN || user?.role === UserRole.SUPER_ADMIN;

  const handleNoticeClick = async (notice: Notice) => {
    if (!notice.isRead) {
      await markAsRead(notice.id);
      // Update local state optimistically
      setNotices(prev => prev.map(n =>
        n.id === notice.id ? { ...n, isRead: true } : n
      ));
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  // Show loading only during auth or when fetching notices
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-100 dark:from-gray-900 dark:to-gray-800">
        <Card className="max-w-md mx-4">
          <CardContent className="text-center py-12">
            <div className="text-red-600 dark:text-red-400 mb-4">
              <Calendar className="w-16 h-16 mx-auto mb-4" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Access Denied
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Please log in to view notices.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-100 dark:from-gray-900 dark:to-gray-800">
        <Card className="max-w-md mx-4">
          <CardContent className="text-center py-12">
            <div className="text-red-600 dark:text-red-400 mb-4">
              <Calendar className="w-16 h-16 mx-auto mb-4" />
            </div>
            <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
            <p className="text-gray-600 dark:text-gray-400">{error}</p>
            <Button onClick={() => fetchNotices(debouncedSearchTerm)} className="mt-4">
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-400 to-gray-900 bg-clip-text text-transparent mb-2">
                📢 Notices
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Stay updated with the latest announcements and important information.
              </p>
            </div>

            {canCreateNotice && (
              <Link href="/admin/notices">
                <Button
                  className="bg-black hover:to-gray-700 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Notice
                </Button>
              </Link>
            )}
          </div>

          {/* Search and Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search notices by title, content, or author..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="pl-10 bg-white/80 backdrop-blur-sm border-gray-200 focus:border-blue-400"
              />
            </div>

            <Button
              variant={showActiveOnly ? "default" : "outline"}
              onClick={() => setShowActiveOnly(!showActiveOnly)}
              className="min-w-fit"
            >
              <Filter className="w-4 h-4 mr-2" />
              {showActiveOnly ? 'Active Only' : 'Show All'}
            </Button>
          </div>

          {/* Stats */}
          <div className="flex gap-4 text-sm text-gray-600 dark:text-gray-400">
            <span className="bg-white/80 dark:bg-gray-800/80 px-3 py-1 rounded-full">
              Total: {totalCount} notices
            </span>
            <span className="bg-white/80 dark:bg-gray-800/80 px-3 py-1 rounded-full">
              Showing: {displayNotices.length} notices
            </span>
            {searchTerm && (
              <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full">
                Search: &quot;{searchTerm}&quot;
              </span>
            )}
            {loading && (
              <span className="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-3 py-1 rounded-full">
                🔍 Searching...
              </span>
            )}
          </div>
        </div>

        {/* Loading Indicator */}
        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading notices...</p>
          </div>
        )}

        {/* Notices Grid */}
        {!loading && (
          <>
            {displayNotices.length === 0 ? (
              <Card className="bg-white/80 backdrop-blur-sm border-gray-200">
                <CardContent className="text-center py-16">
                  <div className="text-gray-500 dark:text-gray-400">
                    <Calendar className="w-16 h-16 mx-auto mb-6 opacity-50" />
                    <h3 className="text-xl font-semibold mb-3">
                      {searchTerm ? 'No matching notices found' : 'No notices available'}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                      {searchTerm
                        ? `No notices match your search term &quot;${searchTerm}&quot;. Try different keywords.`
                        : 'There are no notices to display at the moment. Check back later for updates.'
                      }
                    </p>
                    {searchTerm && (
                      <Button
                        variant="ghost"
                        onClick={clearSearch}
                        className="mt-4"
                      >
                        Clear Search
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                {displayNotices.map((notice) => (
                  <NoticeCard
                    key={notice.id}
                    notice={notice}
                    onClick={() => handleNoticeClick(notice)}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}