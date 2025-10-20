'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Book, bookService } from '@/services/book.service';
import Image from 'next/image';
import { ArrowLeft, ShoppingCart, Eye, BookOpen, Info, User } from 'lucide-react';

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
      <div className="container mx-auto py-16 text-center text-lg">
        Loading book details...
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="container mx-auto py-16 text-center">
        <p className="text-red-600 mb-6">{error || 'Book not found.'}</p>
        <button
          onClick={() => window.history.back()}
          className="primary-btn flex items-center justify-center mx-auto"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Books
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4 lg:px-8">
      <button
        onClick={() => window.history.back()}
        className="primary-btn mb-6 flex items-center"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Books
      </button>

      {/* --- Book Overview Section --- */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden">
        <div className="md:flex">
          {/* --- Image --- */}
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
              <div className="bg-gray-200 border-2 border-dashed h-96 flex items-center justify-center text-gray-500">
                No Image
              </div>
            )}
          </div>

          {/* --- Book Details --- */}
          <div className="p-8 md:w-3/5">
            <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-4">
              {book.title}
            </h1>

            <p className="text-slate-600 dark:text-slate-300 mb-2 text-sm">
              by <span className="font-semibold">{book.author || 'Unknown Author'}</span>
            </p>

            <div className="mb-6">
              {book.discountPrice && book.discountPrice < book.price ? (
                <div className="flex items-center gap-3">
                  <p className="text-red-700 dark:text-red-400 text-2xl font-bold">
                    {book.discountPrice.toFixed(2)} TK
                  </p>
                  <p className="text-gray-500 line-through">{book.price.toFixed(2)} TK</p>
                  <span className="bg-red-100 text-red-800 text-sm font-semibold px-2 py-1 rounded">
                    {Math.round(((book.price - book.discountPrice) / book.price) * 100)}% OFF
                  </span>
                </div>
              ) : (
                <p className="text-red-700 dark:text-red-400 text-2xl font-bold">
                  {book.price.toFixed(2)} TK
                </p>
              )}
            </div>

            <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
              {book.description || 'No description available.'}
            </p>

            <div className="flex flex-wrap gap-4">
              <button className="secondary-btn px-6 py-3 text-lg flex items-center">
                <ShoppingCart className="w-5 h-5 mr-2" />
                Add to Cart
              </button>
              <button className="primary-btn px-6 py-3 text-lg flex items-center">
                <Eye className="w-5 h-5 mr-2" />
                Preview
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* --- Book Info Section --- */}
      <section className="mt-12 bg-white dark:bg-slate-800 rounded-2xl shadow-md p-8">
        <div className="flex items-center mb-6">
          <Info className="w-6 h-6 text-orange-600 mr-2" />
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
            Book Information
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4 text-slate-700 dark:text-slate-300">
          <p><strong>Publisher:</strong> {book.publisher || 'Not specified'}</p>
          <p><strong>ISBN:</strong> {book.isbn || 'N/A'}</p>
          <p><strong>Category:</strong> {book.category || 'General'}</p>
          <p><strong>Language:</strong> {book.language || 'English'}</p>
          <p><strong>Pages:</strong> {book.pageCount || 'N/A'}</p>
          <p><strong>Binding:</strong> {book.binding || 'Paperback'}</p>
          <p><strong>Publication Year:</strong> {book.publicationYear || 'N/A'}</p>
          <p><strong>Weight:</strong> {book.weight ? `${book.weight}g` : 'N/A'}</p>
          <p><strong>Dimensions:</strong> {book.dimensions || 'Standard'}</p>
        </div>
      </section>

      {/* --- Summary Section --- */}
      <section className="mt-12 bg-white dark:bg-slate-800 rounded-2xl shadow-md p-8">
        <div className="flex items-center mb-6">
          <BookOpen className="w-6 h-6 text-orange-600 mr-2" />
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
            Book Summary
          </h2>
        </div>
        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
          {book.summary ||
            'This book offers a deep insight into its subject, filled with compelling ideas, rich storytelling, and detailed context. It’s a must-read for anyone interested in expanding their understanding of the topic.'}
        </p>
      </section>

      {/* --- Author Section --- */}
      <section className="mt-12 bg-white dark:bg-slate-800 rounded-2xl shadow-md p-8">
        <div className="flex items-center mb-6">
          <User className="w-6 h-6 text-orange-600 mr-2" />
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
            About the Author
          </h2>
        </div>
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          <div className="w-32 h-32 bg-gray-200 rounded-full overflow-hidden flex-shrink-0">
            <Image
              src={"https://randomuser.me/api/portraits/men/36.jpg"}
              alt={book.author || 'Author'}
              width={128}
              height={128}
              className="object-cover"
            />
          </div>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            {book.authorBio ||
              `${book.author || 'The author'} is a renowned writer known for captivating storytelling and a deep understanding of character development. Their works continue to inspire readers worldwide.`}
          </p>
        </div>
      </section>

      {/* --- Related Books Section --- */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">
          Related Books
        </h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((_, i) => (
            <div
              key={i}
              className="bg-white dark:bg-slate-800 rounded-lg shadow hover:shadow-lg transition p-4"
            >
              <div className="h-52 w-full bg-gray-100 dark:bg-gray-700 rounded-lg mb-3 overflow-hidden">
                <Image
                  src={`https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c`}
                  alt={`Related Book ${i + 1}`}
                  width={300}
                  height={400}
                  className="object-cover w-full h-full"
                />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white">
                Related Book {i + 1}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">by Author {i + 1}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
