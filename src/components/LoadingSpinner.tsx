interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
}

export function LoadingSpinner({ size = 'md', message }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      <div className={`${sizeClasses[size]} animate-spin`}>
        <div className="h-full w-full border-2 border-lightning/30 border-t-lightning rounded-full" />
      </div>
      {message && (
        <div className="text-sm text-muted-foreground animate-pulse">
          {message}
        </div>
      )}
    </div>
  );
}