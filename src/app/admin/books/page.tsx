"use client";

import { useState, useEffect, useCallback } from "react";
import RoleGuard from "@/components/auth/RoleGuard";
import { UserRole } from "@/interface/user";
import { Button } from "@/components/ui/button";
import { bookService, Book } from "@/services/book.service";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Edit, Trash2, Eye, NotebookText } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Permission } from "@/interface/permission";

export default function BooksManagementPage() {
  const { toast } = useToast();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("DESC");
  const [createdBy, setCreatedBy] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const fetchBooks = useCallback(async () => {
    try {
      setLoading(true);
      const response = await bookService.getAllBooks({
        page: currentPage,
        limit: 10,
        search: searchTerm,
        sortBy,
        sortOrder,
        createdBy: createdBy ? parseInt(createdBy) : undefined,
        dateFrom,
        dateTo,
      });

      setBooks(response.books);
      setTotalPages(response.totalPages);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch books:", err);
      setError("Failed to load books. Please try again.");
      toast({
        title: "Error",
        description: "Failed to load books. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [
    currentPage,
    searchTerm,
    sortBy,
    sortOrder,
    createdBy,
    dateFrom,
    dateTo,
    toast,
  ]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this book?")) {
      return;
    }

    try {
      await bookService.deleteBook(id);
      toast({
        title: "Success",
        description: "Book deleted successfully",
      });
      // Refresh the list
      fetchBooks();
    } catch (err) {
      console.error("Failed to delete book:", err);
      toast({
        title: "Error",
        description: "Failed to delete book. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchBooks();
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setSortBy("createdAt");
    setSortOrder("DESC");
    setCreatedBy("");
    setDateFrom("");
    setDateTo("");
    setCurrentPage(1);
  };

  if (loading && books.length === 0) {
    return (
      <RoleGuard allowedRoles={[UserRole.ADMIN, UserRole.SUPER_ADMIN]}>
        <div className="container mx-auto py-8">
          <div className="flex justify-center items-center h-64">
            <p className="text-lg">Loading books...</p>
          </div>
        </div>
      </RoleGuard>
    );
  }

  return (
    <RoleGuard
      allowedRoles={[UserRole.ADMIN, UserRole.SUPER_ADMIN]}
      requiredPermissions={[
        Permission.CREATE_BOOK,
        Permission.UPDATE_BOOK,
        Permission.DELETE_BOOK,
      ]}
    >
      <div>
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Book Management</h1>
            <p className="text-gray-600">Manage all books in the system</p>
          </div>
          <Link href="/admin/books/create">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add New Book
            </Button>
          </Link>
        </div>

        {/* -=> Search and Filters */}
        <div className="mb-6 bg-white dark:bg-slate-800 rounded-lg shadow p-4">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label
                  htmlFor="search"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Search
                </label>
                <input
                  type="text"
                  id="search"
                  placeholder="Search books..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              <div>
                <label
                  htmlFor="sortBy"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Sort By
                </label>
                <select
                  id="sortBy"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="createdAt">Created At</option>
                  <option value="title">Title</option>
                  <option value="highlight">Highlight</option>
                  <option value="price">Price</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="sortOrder"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Sort Order
                </label>
                <select
                  id="sortOrder"
                  value={sortOrder}
                  onChange={(e) =>
                    setSortOrder(e.target.value as "ASC" | "DESC")
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="DESC">Descending</option>
                  <option value="ASC">Ascending</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="createdBy"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Created By (User ID)
                </label>
                <input
                  type="number"
                  id="createdBy"
                  placeholder="User ID"
                  value={createdBy}
                  onChange={(e) => setCreatedBy(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:border-gray-600 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="dateFrom"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Date From
                </label>
                <input
                  type="date"
                  id="dateFrom"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              <div>
                <label
                  htmlFor="dateTo"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Date To
                </label>
                <input
                  type="date"
                  id="dateTo"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:border-gray-600 dark:text-white"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                onClick={handleResetFilters}
                variant="outline"
              >
                Reset Filters
              </Button>
              <Button type="submit">Apply Filters</Button>
            </div>
          </form>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <div className="bg-white dark:bg-slate-800 rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : books.length === 0 ? (
            <Card className="bg-transparent">
              <CardContent className="text-center py-12">
                <div className="text-muted-foreground">
                  <NotebookText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">
                    No Books are found
                  </h3>
                  <p>Create your first Book to get started.</p>
                  <div className="mt-6">
                    <Link href="/admin/books/create">
                      <Button className="flex items-center gap-2 mx-auto">
                        <Plus className="w-4 h-4" />
                        Create New Book
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
                  <thead className="bg-gray-50 dark:bg-slate-700">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-300 uppercase tracking-wider"
                      >
                        Book
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-300 uppercase tracking-wider"
                      >
                        Price
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-300 uppercase tracking-wider"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-300 uppercase tracking-wider"
                      >
                        Created
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-slate-300 uppercase tracking-wider"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
                    {books.map((book) => (
                      <tr
                        key={book.id}
                        className="hover:bg-gray-50 dark:hover:bg-slate-700"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {book.imageUrl ? (
                              <Image
                                src={book.imageUrl}
                                alt={book.title}
                                width={40}
                                height={40}
                                className="rounded-md object-cover mr-3"
                              />
                            ) : (
                              <div className="bg-gray-200 border-2 border-dashed rounded-md w-10 h-10 mr-3" />
                            )}
                            <div>
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {book.title}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-slate-400 line-clamp-1">
                                {book.highlight}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {book.price.toFixed(2)} TK
                          {book.discountPrice !== undefined && book.discountPrice !== null && (
                            <div className="text-xs text-gray-500 line-through">
                              {book.discountPrice.toFixed(2)} TK
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              book.isActive
                                ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                                : "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"
                            }`}
                          >
                            {book.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-slate-400">
                          {new Date(book.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <Link href={`/books/${book.id}`}>
                              <Button variant="outline" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                            </Link>
                            <Link href={`/admin/books/edit?id=${book.id}`}>
                              <Button variant="outline" size="sm">
                                <Edit className="w-4 h-4" />
                              </Button>
                            </Link>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(book.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="bg-white dark:bg-slate-800 px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 sm:px-6">
                  <div className="flex-1 flex justify-between sm:hidden">
                    <Button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <Button
                      onClick={() =>
                        setCurrentPage(Math.min(totalPages, currentPage + 1))
                      }
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        Page <span className="font-medium">{currentPage}</span> of{" "}
                        <span className="font-medium">{totalPages}</span>
                      </p>
                    </div>
                    <div>
                      <nav
                        className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                        aria-label="Pagination"
                      >
                        <Button
                          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                          disabled={currentPage === 1}
                          className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                        >
                          Previous
                        </Button>
                        {[...Array(totalPages)].map((_, i) => (
                          <Button
                            key={i + 1}
                            onClick={() => setCurrentPage(i + 1)}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                              currentPage === i + 1
                                ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                                : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                            }`}
                          >
                            {i + 1}
                          </Button>
                        ))}
                        <Button
                          onClick={() =>
                            setCurrentPage(Math.min(totalPages, currentPage + 1))
                          }
                          disabled={currentPage === totalPages}
                          className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                        >
                          Next
                        </Button>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </RoleGuard>
  );
}