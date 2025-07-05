interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
}

export function LoadingSpinner({ size = 'md', message }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12', 
    lg: 'h-16 w-16'
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className={`${sizeClasses[size]} brutal-border bg-accent animate-subtle-bounce brutal-shadow-accent rounded-md`}>
        <div className="h-full w-full bg-gradient-accent brutal-border-2 rounded-md" />
      </div>
      {message && (
        <div className="text-lg font-bold text-foreground font-space brutal-border bg-card px-4 py-2 brutal-shadow rounded-md">
          {message}
        </div>
      )}
    </div>
  );
}