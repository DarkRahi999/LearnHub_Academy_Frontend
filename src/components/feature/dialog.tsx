"use client";

interface DialogProps {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

interface DialogContentProps {
  children: React.ReactNode;
  onClose?: () => void;
}

interface DialogHeaderProps {
  children: React.ReactNode;
  onClose?: () => void;
}

interface DialogTitleProps {
  children: React.ReactNode;
}

export function Dialog({ open, children }: DialogProps) {
  // Remove internal state and directly use the open prop
  if (!open) return null;
  
  // Prevent closing when clicking outside
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      // Don't close on backdrop click
      // User must explicitly click close button or cancel
    }
  };
  
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={handleBackdropClick}
    >
      <div className="fixed inset-0 bg-black/30 backdrop-blur-md" />
      {children}
    </div>
  );
}

export function DialogContent({ children }: DialogContentProps) {
  return (
    <div className="relative z-10 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
      {children}
    </div>
  );
}

export function DialogHeader({ children, onClose }: DialogHeaderProps) {
  return (
    <div className="mb-4 flex justify-between items-center">
      <div>{children}</div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}

export function DialogTitle({ children }: DialogTitleProps) {
  return (
    <h3 className="text-lg font-semibold">
      {children}
    </h3>
  );
}