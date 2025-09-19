'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/layouts/Header';
import { Book, bookService } from '@/services/book.service';
import BookCard from '@/components/own/BookCard';
import { Button } from '@/components/ui/button';
import Footer from '@/components/layouts/Footer';

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchBooks(page);
  }, [page]);

  const fetchBooks = async (page: number) => {
    try {
      setLoading(true);
      const response = await bookService.getAllBooks({
        page,
        limit: 8,
        sortBy: 'createdAt',
        sortOrder: 'DESC'
      });
      setBooks(response.books);
      setTotalPages(response.totalPages);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch books:', err);
      setError('Failed to load books. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  if (loading && books.length === 0) {
    return (
      <>
        <Header />
        <div className="container mx-auto py-8">
          <div className="flex justify-center items-center h-64">
            <p className="text-lg">Loading books...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="container mx-auto py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Our Books</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Discover our collection of educational books to enhance your learning journey
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {books.length === 0 && !loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No books available at the moment</p>
            <p className="text-gray-600">Check back later for new additions</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {books.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center mt-8 space-x-2">
                <Button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  variant="outline"
                >
                  Previous
                </Button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <Button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    variant={pageNum === page ? "default" : "outline"}
                  >
                    {pageNum}
                  </Button>
                ))}
                
                <Button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages}
                  variant="outline"
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
      <Footer />
    </>
  );
}