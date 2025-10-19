import React from 'react';
import Image from "next/image";
import Link from "next/link";
import { Book } from '@/services/book.service';

interface BookCardProps {
  book: Book;
}

export default function BookCard({ book }: BookCardProps) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-lg border border-white/50 dark:border-slate-700/50 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 h-full flex flex-col">
      <Link href={`/books/${book.id}`} className="cursor-pointer">
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
      </Link>
      
      <div className="p-6 flex flex-col flex-grow">
        <Link href={`/books/${book.id}`} className="cursor-pointer">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2 line-clamp-2 hover:text-red-700 transition-colors">
            {book.title}
          </h2>
        </Link>
        
        {/* Price display */}
        <div className="mb-3">
          {book.discountPrice !== undefined && book.discountPrice !== null && book.discountPrice < book.price ? (
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-red-700 dark:text-red-400">
                {book.discountPrice} <span className="text-lg">TK</span>
              </span>
              <span className="text-lg text-gray-500 line-through">
                {book.price} TK
              </span>
              <span className="bg-red-100 text-red-800 text-xs font-semibold px-2 py-1 rounded">
                {Math.round(((book.price - book.discountPrice) / book.price) * 100)}% OFF
              </span>
            </div>
          ) : (
            <div className="text-2xl font-bold text-red-700 dark:text-red-400">
              {book.price} <span className="text-lg">TK</span>
            </div>
          )}
        </div>
        
        <p className="text-red-700 dark:text-red-400 font-medium mb-3 line-clamp-2">
          {book.highlight}
        </p>
        
        <p className="text-slate-600 dark:text-slate-400 text-sm mb-6 line-clamp-3 flex-grow">
          {book.description}
        </p>
        
        <div className="flex gap-3 mt-auto">
          <Link href={`/books/${book.id}`} className="flex-1">
            <button className="secondary-btn w-full py-2.5 text-sm">
              See Details
            </button>
          </Link>
          <button className="primary-btn flex-1 py-2.5 text-sm">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}