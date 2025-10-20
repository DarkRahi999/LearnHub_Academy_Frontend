"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Book } from "@/services/book.service";
import { useEffect, useState } from "react";
import { bookService } from "@/services/book.service";
import Loading from "../layouts/Loading";
import Error from "../layouts/Error";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { NotebookText } from "lucide-react";
import BookSellCard2 from "./BookSellCard2";

const BooksSlider = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
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
        setError("Failed to load books: " + (err as Error).message);
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  if (loading) {
    return <Loading title="Top Books" />;
  }

  if (error) {
    return <Error error={error} />;
  }

  if (books.length === 0) {
    return (
      <>
        <div className="py-8">
          <div className="max-w-4xl mx-auto px-4">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-white/50 dark:border-slate-700/50 p-8 text-center">
              <div className="flex justify-center mb-6">
                <div className="bg-red-100 dark:bg-red-900/30 p-4 rounded-full">
                  <NotebookText className="h-12 w-12 text-red-600 dark:text-red-400" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-3">
                No Books Available
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-md mx-auto">
                We don&#39;t have any books available at the moment. Check back
                soon for exciting new books!
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/books">
                  <Button className="bg-red-700 hover:bg-red-800 text-white px-6 py-3 rounded-lg font-medium">
                    Browse All Books
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button
                    variant="outline"
                    className="border-2 border-red-700 text-red-700 hover:bg-red-700 hover:text-white px-6 py-3 rounded-lg font-medium"
                  >
                    Contact Us
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Map Book service data to BookSellCard expected format
  const mapBookToSellCard = (book: Book) => ({
    id: book.id,
    title: book.title,
    author: book.createdBy?.firstName + (book.createdBy?.lastName ? ` ${book.createdBy?.lastName}` : '') || 'Unknown Author',
    highlight: book.highlight,
    price: book.price,
    discountPrice: book.discountPrice,
    rating: 4.5, // Default rating
    img: book.imageUrl,
    description: book.description,
    tags: ['Featured'] // Default tag
  });

  return (
    <div className="pt-8 pb-12">
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
              className="lg:basis-1/2 xl:basis-1/3 gap-2 flex justify-center"
            >
              <BookSellCard2
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
  );
};

export default BooksSlider;