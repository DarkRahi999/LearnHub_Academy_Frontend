import { Heart, ShoppingCart, StarIcon } from "lucide-react";
import React from "react";
import Image from "next/image";
import Link from "next/link";

type Book = {
  id?: string | number;
  title: string;
  author?: string;
  highlight: string;
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
    id,
    title,
    // author,
    // highlight,
    price,
    discountPrice,
    rating = 0,
    img,
    // description,
    tags = [],
  } = book;

  const handleBuy = () => onBuy?.(book);
  const handleWishlist = () => onWishlist?.(book);

  return (
    // <article className="max-w-2xl w-full bg-white dark:bg-slate-900 rounded-2xl overflow-hidden ring-1 ring-slate-200 dark:ring-slate-800 transition-transform transform hover:-translate-y-1 dark:border h-auto">
    //   <div className="flex flex-row items-center h-full">
    //     {/* Image */}
    //     <Link href={`/books/${id}`} className="md:w-32 flex-shrink-0 bg-gradient-to-b from-indigo-50 to-white dark:from-slate-800 dark:to-slate-900 cursor-pointer">
    //       {img ? (
    //         <Image
    //           src={img}
    //           alt={`${title} cover`}
    //           width={320}
    //           height={420}
    //           className="w-full h-48 md:h-full object-cover object-center flex"
    //         />
    //       ) : (
    //         <div className="w-full h-48 md:h-full bg-gray-200 border-2 border-dashed rounded-xl flex items-center justify-center">
    //           <span className="text-gray-500">No Image</span>
    //         </div>
    //       )}
    //     </Link>

    //     {/* Content */}
    //     <div className="p-4 md:p-5 flex-1 flex flex-col gap-1 sm:gap-2">
    //       <header className="flex items-start justify-between">
    //         <div>
    //           <Link href={`/books/${id}`} className="cursor-pointer">
    //             <h3 className="text-base md:text-lg font-semibold leading-tight text-slate-900 dark:text-slate-100 hover:text-red-700 transition-colors">
    //               {title}
    //             </h3>
    //           </Link>
    //           {author && (
    //             <p className="mt-1 text-xs md:text-sm text-slate-600 dark:text-slate-400">
    //               by <span className="font-medium">{author}</span>
    //             </p>
    //           )}
    //         </div>

    //         <div className="flex flex-col items-end">
    //           {/* Price display */}
    //           <div className="text-right">
    //             {discountPrice !== undefined && discountPrice !== null && Number(discountPrice) < Number(price) ? (
    //               <div className="flex flex-col items-end">
    //                 <span className="text-base font-bold text-red-600 dark:text-red-400">
    //                   {discountPrice} TK
    //                 </span>
    //                 <div className="flex items-center gap-1">
    //                   <span className="text-xs text-gray-500 line-through">
    //                     {price} TK
    //                   </span>
    //                   <span className="bg-red-100 text-red-800 text-[0.6rem] font-semibold px-1 py-0.5 rounded">
    //                     {Math.round(((Number(price) - Number(discountPrice)) / Number(price)) * 100)}% OFF
    //                   </span>
    //                 </div>
    //               </div>
    //             ) : (
    //               <span className="text-base font-bold text-red-600 dark:text-red-400">
    //                 {price} TK
    //               </span>
    //             )}
    //           </div>
    //           <button
    //             onClick={handleWishlist}
    //             aria-label="Add to wishlist"
    //             className="rounded-full sm:p-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
    //           >
    //             {/* Heart icon */}
    //             <Heart width={14} />
    //           </button>
    //         </div>
    //       </header>

    //       {/* Rating & tags */}
    //       <div className="sm:flex items-center gap-1 sm:gap-2">
    //         <div className="flex items-center sm:gap-1">
    //           {Array.from({ length: 5 }).map((_, i) => (
    //             <StarIcon
    //               key={i}
    //               width={14}
    //               className={`${i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
    //             />
    //           ))}
    //           <span className="ml-1 text-xs text-slate-600 dark:text-slate-400">
    //             {rating.toFixed(1)}
    //           </span>
    //         </div>

    //         <div className="flex flex-wrap gap-1 mt-1 sm:mt-0">
    //           {tags.slice(0, 2).map((t) => (
    //             <span
    //               key={t}
    //               className="text-[0.6rem] px-1.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-200"
    //             >
    //               {t}
    //             </span>
    //           ))}
    //         </div>
    //       </div>

    //       <footer className="mt-auto flex items-center justify-between gap-2 pt-2">
    //         <div className="flex gap-1">
    //           <button
    //             onClick={handleBuy}
    //             className="secondary-btn text-xs py-1.5 px-3 flex items-center"
    //           >
    //             <ShoppingCart className="w-3 h-3 mr-1" />
    //             Add
    //           </button>

    //           <Link href={`/books/${id}`} className="primary-btn text-xs py-1.5 px-3 flex items-center">
    //             <Eye className="w-3 h-3 mr-1" />
    //             Preview
    //           </Link>
    //         </div>

    //         <div className="text-[0.6rem] text-slate-500 dark:text-slate-400 whitespace-nowrap">
    //           Free delivery
    //         </div>
    //       </footer>
    //     </div>
    //   </div>
    // </article>
    // <article className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1 ring-1 ring-slate-200 dark:ring-slate-800 overflow-hidden">
    //   <div className="flex flex-col md:flex-row">
    //     {/* Book Image */}
    //     <Link
    //       href={`/books/${id}`}
    //       className="md:w-36 flex-shrink-0 bg-gradient-to-b from-indigo-50 to-white dark:from-slate-800 dark:to-slate-900 cursor-pointer"
    //     >
    //       {img ? (
    //         <Image
    //           src={img}
    //           alt={`${title} cover`}
    //           width={320}
    //           height={420}
    //           className="w-full h-48 md:h-full object-cover rounded-l-3xl"
    //         />
    //       ) : (
    //         <div className="w-full h-48 md:h-full bg-gray-200 border-2 border-dashed rounded-l-3xl flex items-center justify-center">
    //           <span className="text-gray-500">No Image</span>
    //         </div>
    //       )}
    //     </Link>

    //     {/* Content */}
    //     <div className="p-4 md:p-5 flex-1 flex flex-col gap-2">
    //       {/* Title & Author */}
    //       <header className="flex justify-between items-start">
    //         <div>
    //           <Link href={`/books/${id}`}>
    //             <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 hover:text-indigo-600 transition-colors">
    //               {title}
    //             </h3>
    //           </Link>
    //           {author && (
    //             <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
    //               by <span className="font-medium">{author}</span>
    //             </p>
    //           )}
    //         </div>

    //         {/* Wishlist */}
    //         <button
    //           onClick={handleWishlist}
    //           aria-label="Add to wishlist"
    //           className="rounded-full p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
    //         >
    //           <Heart width={16} className="text-red-500" />
    //         </button>
    //       </header>

    //       {/* Rating & Tags */}
    //       <div className="flex items-center justify-between mt-2">
    //         <div className="flex items-center gap-1">
    //           {Array.from({ length: 5 }).map((_, i) => (
    //             <StarIcon
    //               key={i}
    //               width={16}
    //               className={`${i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
    //             />
    //           ))}
    //           <span className="ml-1 text-sm text-slate-600 dark:text-slate-400">
    //             {rating.toFixed(1)}
    //           </span>
    //         </div>

    //         <div className="flex flex-wrap gap-1">
    //           {tags.slice(0, 2).map((t) => (
    //             <span
    //               key={t}
    //               className="text-xs px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-200"
    //             >
    //               {t}
    //             </span>
    //           ))}
    //         </div>
    //       </div>

    //       {/* Price & Actions */}
    //       <footer className="mt-auto flex items-center justify-between gap-2 pt-3">
    //         <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
    //           {discountPrice && discountPrice < price ? (
    //             <div className="flex flex-col items-start md:items-end text-right">
    //               <span className="text-lg font-bold text-red-600 dark:text-red-400">
    //                 {discountPrice} TK
    //               </span>
    //               <div className="flex items-center gap-1 text-sm text-gray-500 line-through">
    //                 {price} TK
    //               </div>
    //               <span className="bg-red-100 text-red-800 text-[0.6rem] font-semibold px-1 py-0.5 rounded">
    //                {price && discountPrice ? Math.round(((Number(price) - Number(discountPrice)) / Number(price)) * 100) + "% OFF" : null}

    //               </span>
    //             </div>
    //           ) : (
    //             <span className="text-lg font-bold text-red-600 dark:text-red-400">
    //               {price} TK
    //             </span>
    //           )}

    //           <div className="flex gap-2">
    //             <button
    //               onClick={handleBuy}
    //               className="secondary-btn text-xs py-1.5 px-3 flex items-center"
    //             >
    //               <ShoppingCart className="w-3 h-3 mr-1" /> Add
    //             </button>

    //             <Link
    //               href={`/books/${id}`}
    //               className="primary-btn text-xs py-1.5 px-3 flex items-center"
    //             >
    //               <Eye className="w-3 h-3 mr-1" /> Preview
    //             </Link>
    //           </div>
    //         </div>

    //         <div className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
    //           Free delivery
    //         </div>
    //       </footer>
    //     </div>
    //   </div>
    // </article>
    <article className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1 ring-1 ring-slate-200 dark:ring-slate-800 overflow-hidden">
      <div className="flex flex-col md:flex-row">
        {/* Book Image */}
        <Link
          href={`/books/${id}`}
          className="md:w-44 flex-shrink-0 bg-gradient-to-b from-indigo-50 to-white dark:from-slate-800 dark:to-slate-900 cursor-pointer"
        >
          {img ? (
            <Image
              src={img}
              alt={`${title} cover`}
              width={320}
              height={420}
              className="w-full h-48 md:h-full object-cover rounded-l-3xl"
            />
          ) : (
            <div className="w-full h-48 md:h-full bg-gray-200 border-2 border-dashed rounded-l-3xl flex items-center justify-center">
              <span className="text-gray-500">No Image</span>
            </div>
          )}
        </Link>

        {/* Content */}
        <div className="p-4 md:p-5 flex-1 flex flex-col gap-2">
          {/* Title & Author */}
          <header className="flex justify-between items-start">
            <div>
              <Link href={`/books/${id}`}>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 hover:text-indigo-600 transition-colors">
                  {title}
                </h3>
                <p>{`highlight`}</p>
              </Link>
            </div>

            {/* Wishlist */}
            <button
              onClick={handleWishlist}
              aria-label="Add to wishlist"
              className="rounded-full p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
            >
              <Heart width={16} className="text-red-500" />
            </button>
          </header>

          {/* Rating & Tags */}
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <StarIcon
                  key={i}
                  width={16}
                  className={`${i < Math.floor(rating) ? "fill-red-500 text-red-500" : "text-gray-300"}`}
                />
              ))}
              <span className="ml-1 text-sm text-slate-600 dark:text-slate-400">
                {rating.toFixed(1)}
              </span>
            </div>
            <div className="flex flex-wrap gap-1">
              {tags.slice(0, 2).map((t) => (
                <span
                  key={t}
                  className="text-xs px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-200"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div className="grid justify-start mt-2">
            {discountPrice && discountPrice < price ? (
              <div className="flex items-start md:items-end text-right gap-2">
                <span className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {discountPrice}<sub>tk</sub> 
                </span>
                <span className="text-lg relative inline-block opacity-60">
                  {price}<sub>tk</sub>
                  <span className="absolute inset-0 rotate-[-15deg] border-t-1 border-black  dark:border-white translate-y-[13px]"></span>
                </span>
                <span className="bg-red-100 text-red-800 text-[0.8rem] font-semibold px-1 py-0.5 rounded">
                  {price && discountPrice
                    ? Math.round(
                        ((Number(price) - Number(discountPrice)) /
                          Number(price)) *
                          100
                      ) + "% OFF"
                    : null}
                </span>
              </div>
            ) : (
              <span className="text-2xl font-bold text-red-600 dark:text-red-400">
                {price}<sub>tk</sub>
              </span>
            )}
          </div>
          {/* Price & Actions */}
          <footer className="mt-auto flex items-center justify-between gap-2 pt-3">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
              <div className="flex gap-2">
                <button
                  onClick={handleBuy}
                  className="secondary-btn text-xs flex items-center"
                >
                  <ShoppingCart className="w-3 h-3 mr-1" /> Add
                </button>

                {/* <Link
                  href={`/books/${id}`}
                  className="primay-btn text-xs py-1.5 px-3 flex items-center"
                >
                  <Eye className="w-3 h-3 mr-1" /> Preview
                </Link> */}
              </div>
            </div>

            <div className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
              Free delivery
            </div>
          </footer>
        </div>
      </div>
    </article>
  );
}
