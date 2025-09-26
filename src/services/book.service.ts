import axios from 'axios';
import { API_BASE_URL } from '@/config/configURL';

export interface Book {
  id: number;
  title: string;
  description: string;
  highlight: string;
  imageUrl?: string;
  price: number;
  discountPrice?: number;
  isActive: boolean;
  createdAt: string;
  editedAt?: string;
  createdBy: {
    id: number;
    firstName: string;
    lastName?: string;
  };
}

export interface CreateBookDto {
  title: string;
  description: string;
  highlight: string;
  imageUrl?: string;
  price: number;
  discountPrice?: number;
}

export interface UpdateBookDto {
  title?: string;
  description?: string;
  highlight?: string;
  imageUrl?: string;
  price?: number;
  discountPrice?: number;
  isActive?: boolean;
}

export interface BookSearchParams {
  search?: string;
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  createdBy?: number;
  dateFrom?: string;
  dateTo?: string;
}

export interface BookResponse {
  books: Book[];
  total: number;
  page: number;
  totalPages: number;
}

// Create axios instance with proper configuration
const bookApi = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Add request interceptor to include auth token
bookApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

class BookService {
  async getAllBooks(params: BookSearchParams): Promise<BookResponse> {
    try {
      const response = await bookApi.get<BookResponse>('/api/books', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching books:', error);
      throw new Error('Failed to fetch books: ' + (error as Error).message);
    }
  }

  async getBookById(id: number): Promise<Book> {
    try {
      const response = await bookApi.get<Book>(`/api/books/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching book:', error);
      throw new Error('Failed to fetch book: ' + (error as Error).message);
    }
  }

  async createBook(bookData: CreateBookDto): Promise<Book> {
    try {
      const response = await bookApi.post<Book>('/api/books', bookData);
      return response.data;
    } catch (error) {
      console.error('Error creating book:', error);
      throw new Error('Failed to create book: ' + (error as Error).message);
    }
  }

  async updateBook(id: number, bookData: UpdateBookDto): Promise<Book> {
    try {
      const response = await bookApi.put<Book>(`/api/books/${id}`, bookData);
      return response.data;
    } catch (error) {
      console.error('Error updating book:', error);
      throw new Error('Failed to update book: ' + (error as Error).message);
    }
  }

  async deleteBook(id: number): Promise<void> {
    try {
      await bookApi.delete(`/api/books/${id}`);
    } catch (error) {
      console.error('Error deleting book:', error);
      throw new Error('Failed to delete book: ' + (error as Error).message);
    }
  }
}

export const bookService = new BookService();
export default bookService;