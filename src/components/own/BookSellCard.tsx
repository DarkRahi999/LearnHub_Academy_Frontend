import { Heart, ShoppingCart, StarIcon } from "lucide-react";
import React from "react";
import Image from "next/image";

type Book = {
  id?: string | number;
  title: string;
  author?: string;
  price: number | string;
  discountPrice?: number | string;
  rating?: number;
  img?: string;
  description?: string;
  tags?: string[];
};

type Props = {
  book: Book;
  onBuy?: (book: Book) => void;
  onWishlist?: (book: Book) => void;
};

export default function BookSellCard({ book, onBuy, onWishlist }: Props) {
  const {
    title,
    author,
    price,
    discountPrice,
    rating = 0,
    img,
    description,
    tags = [],
  } = book;

  const handleBuy = () => onBuy?.(book);
  const handleWishlist = () => onWishlist?.(book);

  return (
    <article className="max-w-2xl w-full bg-white dark:bg-slate-900 rounded-2xl shadow-lg overflow-hidden ring-1 ring-slate-200 dark:ring-slate-800 transition-transform transform hover:-translate-y-1">
      <div className="flex flex-col md:flex-row">
        {/* Image */}
        <div className="md:w-40 w-full flex-shrink-0 bg-gradient-to-b from-indigo-50 to-white dark:from-slate-800 dark:to-slate-900">
          {img ? (
            <Image
              src={img}
              alt={`${title} cover`}
              width={320}
              height={420}
              className="w-full h-56 md:h-full object-cover object-top"
            />
          ) : (
            <div className="w-full h-56 md:h-full bg-gray-200 border-2 border-dashed rounded-xl flex items-center justify-center">
              <span className="text-gray-500">No Image</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5 md:p-6 flex-1 flex flex-col gap-3">
          <header className="flex items-start justify-between">
            <div>
              <h3 className="text-lg md:text-xl font-semibold leading-tight text-slate-900 dark:text-slate-100">
                {title}
              </h3>
              {author && (
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                  by <span className="font-medium">{author}</span>
                </p>
              )}
            </div>

            <div className="flex flex-col items-end">
              {/* Price display */}
              <div className="text-right">
                {discountPrice !== undefined && discountPrice !== null && Number(discountPrice) < Number(price) ? (
                  <div className="flex flex-col items-end">
                    <span className="text-lg font-bold text-red-600 dark:text-red-400">
                      {discountPrice} TK
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500 line-through">
                        {price} TK
                      </span>
                      <span className="bg-red-100 text-red-800 text-xs font-semibold px-1 py-0.5 rounded">
                        {Math.round(((Number(price) - Number(discountPrice)) / Number(price)) * 100)}% OFF
                      </span>
                    </div>
                  </div>
                ) : (
                  <span className="text-lg font-bold text-red-600 dark:text-red-400">
                    {price} TK
                  </span>
                )}
              </div>
              <button
                onClick={handleWishlist}
                aria-label="Add to wishlist"
                className="mt-3 rounded-full p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
              >
                {/* Heart icon */}
                <Heart />
              </button>
            </div>
          </header>

          {/* Rating & tags */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <StarIcon key={i} className={i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} />
              ))}
              <span className="ml-2 text-sm text-slate-600 dark:text-slate-400">
                {rating.toFixed(1)}
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {tags.slice(0, 3).map((t) => (
                <span
                  key={t}
                  className="text-xs px-2 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-200"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-slate-700 dark:text-slate-300 line-clamp-3">
            {description ?? "No description available."}
          </p>

          <footer className="mt-auto flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <button
                onClick={handleBuy}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium shadow-md transition"
              >
                {/* Shopping cart icon */}
                <ShoppingCart />
                Buy now
              </button>

              <button
                onClick={handleWishlist}
                className="px-3 py-2 rounded-2xl border border-slate-200 dark:border-slate-800 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
              >
                Preview
              </button>
            </div>

            <div className="text-xs text-slate-500 dark:text-slate-400">
              Free delivery · 30-day returns
            </div>
          </footer>
        </div>
      </div>
    </article>
  );
}