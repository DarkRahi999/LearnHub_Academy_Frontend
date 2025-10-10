"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import BookSellCard from "./BookSellCard";
import { Book } from "@/services/book.service";
import { useEffect, useState } from "react";
import { bookService } from "@/services/book.service";

const BooksSlider = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await bookService.getAllBooks({
          page: 1,
          limit: 6,
          sortBy: 'createdAt',
          sortOrder: 'DESC'
        });
        setBooks(response.books);
        setLoading(false);
      } catch (err) {
        console.error("Failed to load books:", err);
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  if (loading) {
    return (
      <div className="py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-center items-center h-64">
            <p className="text-lg text-slate-700 dark:text-slate-300">Loading books...</p>
          </div>
        </div>
      </div>
    );
  }

  // Map Book service data to BookSellCard expected format
  const mapBookToSellCard = (book: Book) => ({
    id: book.id,
    title: book.title,
    author: book.createdBy?.firstName + (book.createdBy?.lastName ? ` ${book.createdBy?.lastName}` : '') || 'Unknown Author',
    price: book.price,
    discountPrice: book.discountPrice,
    rating: 4.5, // Default rating
    img: book.imageUrl,
    description: book.description,
    tags: ['Featured'] // Default tag
  });

  return (
    <div className="py-8">
      <div className="container mx-auto px-5">
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          plugins={[
            Autoplay({
              delay: 300000000000000,
            }),
          ]}
          className="w-full"
        >
          <CarouselContent>
            {books.map((book) => (
              <CarouselItem
                key={book.id}
                className="md:basis-1/2 lg:basis-1/3 flex justify-center"
              >
                <BookSellCard
                  book={mapBookToSellCard(book)}
                  onBuy={(b) => console.log("buy", b)}
                  onWishlist={(b) => console.log("wishlist", b)}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </div>
  );
};

export default BooksSlider;