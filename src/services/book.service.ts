import { API_BASE_URL } from '@/config/configURL';

export interface Book {
  id: number;
  title: string;
  description: string;
  highlight: string;
  imageUrl?: string;
  price: number;
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
}

export interface UpdateBookDto {
  title?: string;
  description?: string;
  highlight?: string;
  imageUrl?: string;
  price?: number;
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

class BookService {
  private getAuthHeaders() {
    const token = localStorage.getItem('access_token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  }

  async getAllBooks(params: BookSearchParams): Promise<BookResponse> {
    const searchParams = new URLSearchParams();
    
    if (params.search) searchParams.append('search', params.search);
    searchParams.append('page', params.page.toString());
    searchParams.append('limit', params.limit.toString());
    
    // Add new filter parameters
    if (params.sortBy) searchParams.append('sortBy', params.sortBy);
    if (params.sortOrder) searchParams.append('sortOrder', params.sortOrder);
    if (params.createdBy) searchParams.append('createdBy', params.createdBy.toString());
    if (params.dateFrom) searchParams.append('dateFrom', params.dateFrom);
    if (params.dateTo) searchParams.append('dateTo', params.dateTo);

    // For GET requests, we don't need to send authentication headers
    const url = `${API_BASE_URL}/books?${searchParams.toString()}`;
    console.log('Fetching books from:', url);
    
    try {
      const response = await fetch(url);
      console.log('Response status:', response.status);
      console.log('Response headers:', [...response.headers.entries()]);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response text:', errorText);
        try {
          const errorData = JSON.parse(errorText);
          console.error('Error response JSON:', errorData);
          throw new Error(errorData.message || `Failed to fetch books: ${response.status} ${response.statusText}`);
        } catch {
          throw new Error(`Failed to fetch books: ${response.status} ${response.statusText} - ${errorText}`);
        }
      }
      
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Non-JSON response:', text);
        throw new Error('Server returned non-JSON response');
      }
      
      const data = await response.json();
      console.log('Books data:', data);
      return data;
    } catch (error) {
      console.error('Error fetching books:', error);
      throw new Error('Failed to fetch books: ' + (error as Error).message);
    }
  }

  async getBookById(id: number): Promise<Book> {
    const response = await fetch(`${API_BASE_URL}/books/${id}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to fetch book');
    }

    return response.json();
  }

  async createBook(bookData: CreateBookDto): Promise<Book> {
    const response = await fetch(`${API_BASE_URL}/books`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(bookData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to create book');
    }

    return response.json();
  }

  async updateBook(id: number, bookData: UpdateBookDto): Promise<Book> {
    const response = await fetch(`${API_BASE_URL}/books/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(bookData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to update book');
    }

    return response.json();
  }

  async deleteBook(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/books/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to delete book');
    }
  }
}

export const bookService = new BookService();
export default bookService;