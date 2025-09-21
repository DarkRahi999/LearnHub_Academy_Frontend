'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/layouts/Header';
import RoleGuard from '@/components/auth/RoleGuard';
import { UserRole, Permission } from '@/interface/user';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { bookService } from '@/services/book.service';
import { toast } from '@/hooks/use-toast';

export default function CreateBookPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [highlight, setHighlight] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [price, setPrice] = useState('');
  const [discountPrice, setDiscountPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !description || !highlight || !price) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      
      await bookService.createBook({
        title: title.trim(),
        description: description.trim(),
        highlight: highlight.trim(),
        imageUrl: imageUrl.trim() || undefined,
        price: parseFloat(price),
        discountPrice: discountPrice ? parseFloat(discountPrice) : undefined
      });

      toast({
        title: "Success",
        description: "Book created successfully",
      });
      
      router.push('/admin/books');
    } catch (error) {
      console.error('Failed to create book:', error);
      toast({
        title: "Error",
        description: "Failed to create book. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <RoleGuard 
      allowedRoles={[UserRole.ADMIN, UserRole.SUPER_ADMIN]}
      requiredPermissions={[Permission.CREATE_BOOK]}
    >
      <Header />
      <div className="container mx-auto py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">Create New Book</h1>
              <p className="text-gray-600">Add a new book to the system</p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => router.push('/admin/books')}
            >
              Back to Books
            </Button>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter book title"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter book description"
                  rows={4}
                  required
                />
              </div>

              <div>
                <Label htmlFor="highlight">Highlight *</Label>
                <Input
                  id="highlight"
                  value={highlight}
                  onChange={(e) => setHighlight(e.target.value)}
                  placeholder="Enter book highlight"
                  required
                />
              </div>

              <div>
                <Label htmlFor="price">Price *</Label>
                <Input
                  id="price"
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Enter book price"
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div>
                <Label htmlFor="discountPrice">Discount Price (Optional)</Label>
                <Input
                  id="discountPrice"
                  type="number"
                  value={discountPrice}
                  onChange={(e) => setDiscountPrice(e.target.value)}
                  placeholder="Enter discount price (optional)"
                  min="0"
                  step="0.01"
                />
              </div>

              <div>
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input
                  id="imageUrl"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Enter image URL (optional)"
                />
              </div>

              <div className="flex justify-end space-x-3">
                <Button 
                  variant="outline" 
                  onClick={() => router.push('/admin/books')}
                  type="button"
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Creating...' : 'Create Book'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}