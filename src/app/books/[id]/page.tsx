'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Header from '@/components/layouts/Header';
import { Book, bookService } from '@/services/book.service';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { ArrowLeft, ShoppingCart } from 'lucide-react';

export default function BookDetailPage() {
  const params = useParams();
  const { id } = params;
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchBook(parseInt(id as string));
    }
  }, [id]);

  const fetchBook = async (id: number) => {
    try {
      setLoading(true);
      const bookData = await bookService.getBookById(id);
      setBook(bookData);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch book:', err);
      setError('Failed to load book details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="container mx-auto py-8">
          <div className="flex justify-center items-center h-64">
            <p className="text-lg">Loading book details...</p>
          </div>
        </div>
      </>
    );
  }

  if (error || !book) {
    return (
      <>
        <Header />
        <div className="container mx-auto py-8">
          <div className="max-w-2xl mx-auto">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error || 'Book not found'}
            </div>
            <Button onClick={() => window.history.back()}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Books
            </Button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="container mx-auto py-8">
        <Button 
          onClick={() => window.history.back()} 
          variant="outline" 
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Books
        </Button>

        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden">
          <div className="md:flex">
            <div className="md:w-2/5">
              {book.imageUrl ? (
                <div className="relative h-96 w-full">
                  <Image
                    src={book.imageUrl}
                    alt={book.title}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="bg-gray-200 border-2 border-dashed rounded-t-2xl w-full h-96 flex items-center justify-center md:rounded-l-2xl md:rounded-t-none">
                  <span className="text-gray-500">No Image</span>
                </div>
              )}
            </div>
            
            <div className="p-8 md:w-3/5">
              <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-4">
                {book.title}
              </h1>
              
              <p className="text-red-700 dark:text-red-400 text-xl font-semibold mb-6">
                ${book.price.toFixed(2)}
              </p>
              
              <p className="text-slate-600 dark:text-slate-300 mb-6">
                {book.description}
              </p>
              
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-3">
                  Key Highlights
                </h2>
                <p className="text-slate-600 dark:text-slate-300">
                  {book.highlight}
                </p>
              </div>
              
              <div className="flex flex-wrap gap-4">
                <Button className="bg-red-700 hover:bg-red-800 text-white px-6 py-3 rounded-lg text-lg">
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add to Cart
                </Button>
                <Button variant="outline" className="border-2 border-red-700 text-red-700 hover:bg-red-700 hover:text-white px-6 py-3 rounded-lg text-lg">
                  Buy Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}