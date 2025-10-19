'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import RoleGuard from '@/components/auth/RoleGuard';
import { UserRole, Permission } from '@/interface/user';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { bookService } from '@/services/book.service';
import { useToast } from '@/hooks/use-toast';
import { useCloudinaryUpload } from '@/hooks/useCloudinaryUpload';

export default function EditBookPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [highlight, setHighlight] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [price, setPrice] = useState('');
  const [discountPrice, setDiscountPrice] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookId = searchParams.get('id');
  const { toast } = useToast();
  const { uploadImage, uploadImageFromUrl, uploading: cloudinaryUploading, error: uploadError } = useCloudinaryUpload();

  useEffect(() => {
    if (bookId) {
      fetchBook(parseInt(bookId));
    } else {
      setError('No book ID provided');
      setLoading(false);
    }
  }, [bookId]);

  const fetchBook = async (id: number) => {
    try {
      setLoading(true);
      const book = await bookService.getBookById(id);
      
      setTitle(book.title);
      setDescription(book.description);
      setHighlight(book.highlight);
      setImageUrl(book.imageUrl || '');
      setPrice(book.price.toString());
      setDiscountPrice(book.discountPrice?.toString() || '');
      
      setError(null);
    } catch (err) {
      console.error('Failed to fetch book:', err);
      setError('Failed to load book details');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const result = await uploadImage(file);
      setImageUrl(result.secure_url);
      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  // const handleUrlUpload = async () => {
  //   if (!imageUrl) {
  //     toast({
  //       title: "Error",
  //       description: "Please enter a valid URL",
  //       variant: "destructive",
  //     });
  //     return;
  //   }

  //   setUploading(true);
  //   try {
  //     const result = await uploadImageFromUrl(imageUrl);
  //     setImageUrl(result.secure_url);
  //     toast({
  //       title: "Success",
  //       description: "Image processed successfully",
  //     });
  //   } catch {
  //     toast({
  //       title: "Error",
  //       description: "Failed to process image URL",
  //       variant: "destructive",
  //     });
  //   } finally {
  //     setUploading(false);
  //   }
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!bookId) {
      toast({
        title: "Error",
        description: "No book ID provided",
        variant: "destructive",
      });
      return;
    }

    if (!title || !description || !highlight || !price) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      setSaving(true);
      
      // If imageUrl is provided but hasn't been processed through Cloudinary, process it now
      let processedImageUrl = imageUrl;
      if (imageUrl && !imageUrl.includes('cloudinary')) {
        try {
          const result = await uploadImageFromUrl(imageUrl);
          processedImageUrl = result.secure_url;
        } catch (error) {
          console.error('Failed to process image URL:', error);
          // If URL processing fails, we'll use the original URL
        }
      }
      
      await bookService.updateBook(parseInt(bookId), {
        title: title.trim(),
        description: description.trim(),
        highlight: highlight.trim(),
        imageUrl: processedImageUrl.trim() || undefined,
        price: parseFloat(price),
        discountPrice: discountPrice ? parseFloat(discountPrice) : undefined
      });

      toast({
        title: "Success",
        description: "Book updated successfully",
      });
      
      router.push('/admin/books');
    } catch (error) {
      console.error('Failed to update book:', error);
      toast({
        title: "Error",
        description: "Failed to update book. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <RoleGuard 
        allowedRoles={[UserRole.ADMIN, UserRole.SUPER_ADMIN]}
        requiredPermissions={[Permission.UPDATE_BOOK]}
      >
        <div className="container mx-auto py-8">
          <div className="flex justify-center items-center h-64">
            <p className="text-lg">Loading book details...</p>
          </div>
        </div>
      </RoleGuard>
    );
  }

  if (error) {
    return (
      <RoleGuard 
        allowedRoles={[UserRole.ADMIN, UserRole.SUPER_ADMIN]}
        requiredPermissions={[Permission.UPDATE_BOOK]}
      >
        <div className="container mx-auto py-8">
          <div className="max-w-2xl mx-auto">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
            <Button onClick={() => router.push('/admin/books')}>
              Back to Books
            </Button>
          </div>
        </div>
      </RoleGuard>
    );
  }

  return (
    <RoleGuard 
      allowedRoles={[UserRole.ADMIN, UserRole.SUPER_ADMIN]}
      requiredPermissions={[Permission.UPDATE_BOOK]}
    >
      <div className="">
        <div className="">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">Edit Book</h1>
              <p className="text-gray-600">Update book details</p>
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
                <Label>Image Upload</Label>
                <div className="flex items-center gap-4">
                  <Input
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="Enter image URL or upload an image"
                    className="flex-1"
                  />
                  {/* <Button
                    type="button"
                    onClick={handleUrlUpload}
                    disabled={uploading || cloudinaryUploading}
                  >
                    {uploading || cloudinaryUploading ? 'Processing...' : 'Process URL'}
                  </Button> */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <Button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading || cloudinaryUploading}
                  >
                    {uploading || cloudinaryUploading ? 'Uploading...' : 'Upload Image'}
                  </Button>
                </div>
                {uploadError && (
                  <p className="text-sm text-red-500 mt-1">{uploadError}</p>
                )}
              </div>

              <div className="flex justify-end space-x-3">
                <Button 
                  variant="outline" 
                  onClick={() => router.push('/admin/books')}
                  type="button"
                  disabled={saving || uploading || cloudinaryUploading}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={saving || uploading || cloudinaryUploading}
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}