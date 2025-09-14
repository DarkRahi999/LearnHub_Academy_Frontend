"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, User, Eye, EyeOff, Clock, ExternalLink } from 'lucide-react';
import { Notice } from '@/services/notice.service';
import NoticeModal from './notice-modal';

interface NoticeCardProps {
  notice: Notice;
  onClick?: () => void;
}

const truncateText = (text: string, wordLimit: number = 7): string => {
  const words = text.split(' ');
  if (words.length <= wordLimit) {
    return text;
  }
  return words.slice(0, wordLimit).join(' ') + '...';
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) {
    return 'Yesterday';
  } else if (diffDays <= 7) {
    return `${diffDays} days ago`;
  } else {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  }
};

export function NoticeCard({ notice, onClick }: NoticeCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showModal, setShowModal] = useState(false);
  
  const handleCardClick = () => {
    setIsExpanded(!isExpanded);
    onClick?.();
  };
  
  const handleViewFullNotice = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowModal(true);
  };
  
  const truncatedHeading = truncateText(notice.subHeading, 6);
  const truncatedDescription = truncateText(notice.description, 7);
  
  const shouldTruncateHeading = notice.subHeading.split(' ').length > 6;
  const shouldTruncateDescription = notice.description.split(' ').length > 7;
  
  return (
    <>
      <Card 
        className={`group hover:shadow-xl transition-all duration-300 cursor-pointer border-l-4 ${
          notice.isRead 
            ? 'border-l-gray-400 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-850' 
            : 'border-l-blue-500 hover:border-l-blue-600 bg-gradient-to-r from-white to-blue-50 dark:from-gray-900 dark:to-blue-950'
        }`}
        onClick={handleCardClick}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1 space-y-2">
              <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                {isExpanded || !shouldTruncateHeading ? notice.subHeading : truncatedHeading}
                {!isExpanded && shouldTruncateHeading && (
                  <span className="ml-2 text-blue-500 text-sm font-normal">
                    Click to read more
                  </span>
                )}
              </CardTitle>
              
              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-blue-500" />
                  <span className="font-medium">
                    {notice.createdBy.firstName} {notice.createdBy.lastName || ''}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-green-500" />
                  <span>{formatDate(notice.createdAt)}</span>
                </div>
                
                {notice.editedAt && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-500" />
                    <span className="text-xs">
                      Edited {formatDate(notice.editedAt)}
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge 
                variant={notice.isActive ? "default" : "secondary"}
                className={notice.isActive ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" : ""}
              >
                {notice.isActive ? "Active" : "Inactive"}
              </Badge>
              
              {notice.isRead && (
                <Badge variant="outline" className="bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                  Read
                </Badge>
              )}
              
              {isExpanded ? (
                <EyeOff className="w-4 h-4 text-gray-500 group-hover:text-blue-500 transition-colors" />
              ) : (
                <Eye className="w-4 h-4 text-gray-500 group-hover:text-blue-500 transition-colors" />
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          <div className={`transition-all duration-300 ${isExpanded ? 'max-h-none' : 'max-h-20 overflow-hidden'}`}>
            <CardDescription className="text-base leading-relaxed text-gray-700 dark:text-gray-300">
              {isExpanded || !shouldTruncateDescription ? notice.description : truncatedDescription}
            </CardDescription>
          </div>
          
          {!isExpanded && shouldTruncateDescription && (
            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900 p-0 h-auto font-medium"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsExpanded(true);
                }}
              >
                Read More →
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-900 p-0 h-auto font-medium"
                onClick={handleViewFullNotice}
              >
                <ExternalLink className="w-3 h-3 mr-1" />
                Full View
              </Button>
            </div>
          )}
          
          {isExpanded && (shouldTruncateHeading || shouldTruncateDescription) && (
            <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-gray-600 hover:text-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 p-0 h-auto font-medium"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsExpanded(false);
                }}
              >
                ← Show Less
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-900 p-0 h-auto font-medium"
                onClick={handleViewFullNotice}
              >
                <ExternalLink className="w-3 h-3 mr-1" />
                Detailed View
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      <NoticeModal
        notice={notice}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </>
  );
}

export default NoticeCard;