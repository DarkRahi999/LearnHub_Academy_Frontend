import React, { useState } from 'react';
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart } from 'lucide-react';
import { Book } from '@/services/book.service';

interface BookCardProps {
  book: Book;
}

export default function BookCard({ book }: BookCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);

  const discountPercent =
    book.discountPrice && book.price
      ? Math.round(((book.price - book.discountPrice) / book.price) * 100)
      : null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700 group">
      {/* Image */}
      <Link href={`/books/${book.id}`} className="block relative w-full h-80 overflow-hidden">
        {book.imageUrl ? (
          <Image
            src={book.imageUrl}
            alt={book.title}
            fill
            className="object-cover object-top group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-700">
            <span className="text-gray-500">No Image</span>
          </div>
        )}

        {/* Discount or Tag */}
        {discountPercent && (
          <div className="absolute top-0 right-0 bg-red-600 text-white text-xs font-semibold px-3 py-1 rounded-bl-lg shadow-md">
            -{discountPercent}%
          </div>
        )}
      </Link>

      {/* Card Content */}
      <div className="p-5 flex flex-col items-center text-center">
        <Link href={`/books/${book.id}`}>
          <h3 className="text-lg font-bold text-gray-800 dark:text-white line-clamp-2 hover:text-red-600 transition-colors">
            {book.title}
          </h3>
        </Link>

        {book.highlight && (
          <p className="text-sm text-red-600 dark:text-red-400 font-medium mt-2 line-clamp-2">
            {book.highlight}
          </p>
        )}

        {book.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-3">
            {book.description}
          </p>
        )}

        {/* Price Section */}
        <div className="flex items-baseline justify-center gap-2 mt-4 mb-4">
          {book.discountPrice && book.discountPrice < book.price ? (
            <>
              <span className="text-gray-500 line-through text-base dark:text-gray-400">
                {book.price}৳
              </span>
              <span className="text-2xl font-extrabold text-red-600 dark:text-red-400">
                {book.discountPrice}৳
              </span>
            </>
          ) : (
            <span className="text-2xl font-extrabold text-red-600 dark:text-red-400">
              {book.price}৳
            </span>
          )}
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-3 w-full">
          {/* Wishlist */}
          <button
            onClick={() => setIsWishlisted(!isWishlisted)}
            className={`p-2 rounded-full border transition-all duration-300 ${
              isWishlisted
                ? 'text-red-500 bg-red-50 border-red-200 hover:bg-red-100 dark:bg-gray-700'
                : 'text-gray-500 border-gray-300 hover:text-red-500 dark:text-gray-400 dark:border-gray-600 dark:hover:text-red-400'
            }`}
          >
            <Heart className="w-5 h-5" />
          </button>

          {/* Add to Cart */}
          <button className="flex-grow flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2.5 rounded-lg shadow-lg shadow-orange-500/30 transition-all">
            <ShoppingCart className="w-5 h-5" />
            Buy Now
          </button>
        </div>

        {/* Details Button */}
        <Link
          href={`/books/${book.id}`}
          className="mt-4 text-sm font-medium text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300"
        >
          See Details →
        </Link>
      </div>
    </div>
  );
}
