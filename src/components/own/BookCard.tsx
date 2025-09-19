import React from 'react';
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Book } from '@/services/book.service';

interface BookCardProps {
  book: Book;
}

export default function BookCard({ book }: BookCardProps) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-lg border border-white/50 dark:border-slate-700/50 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 h-full flex flex-col">
      {book.imageUrl ? (
        <div className="relative h-48 w-full">
          <Image
            src={book.imageUrl}
            alt={book.title}
            fill
            className="object-cover"
          />
        </div>
      ) : (
        <div className="bg-gray-200 border-2 border-dashed rounded-t-2xl w-full h-48 flex items-center justify-center">
          <span className="text-gray-500">No Image</span>
        </div>
      )}
      
      <div className="p-6 flex flex-col flex-grow">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2 line-clamp-2">
          {book.title}
        </h2>
        
        {/* Price display */}
        <div className="text-2xl font-bold text-red-700 dark:text-red-400 mb-3">
          {book.price} <span className="text-lg">TK</span>
        </div>
        
        <p className="text-red-700 dark:text-red-400 font-medium mb-3 line-clamp-2">
          {book.highlight}
        </p>
        
        <p className="text-slate-600 dark:text-slate-400 text-sm mb-6 line-clamp-3 flex-grow">
          {book.description}
        </p>
        
        <div className="flex gap-3 mt-auto">
          <Link href={`/books/${book.id}`} className="flex-1">
            <Button className="w-full bg-red-700 hover:bg-[#9a0000] text-white rounded-lg">
              See Details
            </Button>
          </Link>
          <Button className="flex-1 border-2 border-red-700 text-red-700 hover:bg-red-700 hover:text-white rounded-lg">
            Buy Now
          </Button>
        </div>
      </div>
    </div>
  );
}