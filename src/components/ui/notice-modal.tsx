"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, User, Clock, X, Share2, Bookmark } from 'lucide-react';
import { Notice } from '@/services/notice.service';

interface NoticeModalProps {
  notice: Notice;
  isOpen: boolean;
  onClose: () => void;
}

const formatFullDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    weekday: 'long',
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export function NoticeModal({ notice, isOpen, onClose }: NoticeModalProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  
  if (!isOpen) return null;
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: notice.subHeading,
        text: notice.description,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(
        `${notice.subHeading}

${notice.description}

From: ${notice.createdBy.firstName} ${notice.createdBy.lastName}`
      );
      alert('Notice copied to clipboard!');
    }
  };
  
  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    const bookmarks = JSON.parse(localStorage.getItem('bookmarked_notices') || '[]');
    if (!isBookmarked) {
      bookmarks.push(notice.id);
    } else {
      const index = bookmarks.indexOf(notice.id);
      if (index > -1) bookmarks.splice(index, 1);
    }
    localStorage.setItem('bookmarked_notices', JSON.stringify(bookmarks));
  };
  
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="max-w-4xl w-full max-h-[90vh] overflow-hidden bg-white dark:bg-gray-900 shadow-2xl">
        <CardHeader className="border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
          <div className="flex items-start justify-between">
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-3">
                <Badge 
                  variant={notice.isActive ? "default" : "secondary"}
                  className={notice.isActive ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" : ""}
                >
                  {notice.isActive ? "🟢 Active" : "⚫ Inactive"}
                </Badge>
                <span className="text-sm text-gray-500 dark:text-gray-400">Notice #{notice.id}</span>
              </div>
              
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">
                {notice.subHeading}
              </CardTitle>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-blue-500" />
                  <span className="font-medium">
                    {notice.createdBy.firstName} {notice.createdBy.lastName || ''}
                  </span>
                  <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                    Author
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-green-500" />
                  <span>{formatFullDate(notice.createdAt)}</span>
                </div>
                
                {notice.editedAt && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-500" />
                    <span>Edited {formatFullDate(notice.editedAt)}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBookmark}
                className={`hover:bg-white/80 ${isBookmarked ? 'text-yellow-600' : 'text-gray-600'}`}
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleShare}
                className="hover:bg-white/80 text-gray-600"
              >
                <Share2 className="w-4 h-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="hover:bg-red-50 hover:text-red-600 text-gray-600"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <div className="text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap">
              {notice.description}
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-4">
                <span>📧 Contact: {notice.createdBy.email}</span>
                <span>📅 Published: {new Date(notice.createdAt).toLocaleDateString()}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.print()}
                  className="text-gray-600 hover:text-gray-800"
                >
                  🖨️ Print
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default NoticeModal;