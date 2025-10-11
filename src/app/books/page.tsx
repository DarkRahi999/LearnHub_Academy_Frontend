"use client";

import { useState, useEffect } from "react";
import Header from "@/components/layouts/Header";
import { Book, bookService } from "@/services/book.service";
import BookCard from "@/components/own/BookCard";
import { Button } from "@/components/ui/button";
import Footer from "@/components/layouts/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { NotebookText } from "lucide-react";

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchBooks(page);
  }, [page]);

  const fetchBooks = async (page: number) => {
    try {
      setLoading(true);
      const response = await bookService.getAllBooks({
        page,
        limit: 8,
        sortBy: "createdAt",
        sortOrder: "DESC",
      });
      setBooks(response.books);
      setTotalPages(response.totalPages);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch books:", err);
      setError("Failed to load books. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // fetchBooks(searchTerm);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  if (loading && books.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-rose-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900">
        <Header />
        <div className="container mx-auto py-8">
          <div className="flex justify-center items-center h-64">
            <p className="text-lg">Loading books...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-rose-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900">
      <Header />
      <div className="container mx-auto p-5">
        <h1 className="text-3xl font-bold text-red-700 mb-4">Our Books</h1>

        {/* Search Bar */}
        <div className="mb-8">
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              placeholder="Search Books..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
            />
            <Button
              type="button"
              variant="outline"
              // onClick={handleReset}
              className="border-red-700 text-red-700 hover:bg-red-700 hover:text-white"
            >
              Reset
            </Button>
            <Button
              type="submit"
              className="bg-red-700 hover:bg-red-800 text-white"
            >
              Search
            </Button>
          </form>
        </div>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {books.length === 0 && !loading ? (
          <Card className="dark:bg-gray-800 dark:border-gray-900">
            <CardContent className="text-center py-12">
              <div className="text-muted-foreground">
                <NotebookText className="w-12 h-12 mx-auto text-red-700 opacity-70" />
                <h3 className="text-xl font-semibold mb-2">Our Books</h3>
                <p>No books available at the moment.</p>
                <p>Check back later for new additions.</p>
              </div>
            </CardContent>
          </Card>
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

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (pageNum) => (
                    <Button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      variant={pageNum === page ? "default" : "outline"}
                    >
                      {pageNum}
                    </Button>
                  )
                )}

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
    </div>
  );
}
