interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
}

export function LoadingSpinner({ size = 'md', message }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-6 w-6 sm:h-8 sm:w-8',
    md: 'h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12', 
    lg: 'h-10 w-10 sm:h-12 sm:w-12 md:h-16 md:w-16'
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-3 sm:space-y-4">
      <div className={`${sizeClasses[size]} brutal-border bg-accent animate-subtle-bounce brutal-shadow-accent rounded-md`}>
        <div className="h-full w-full bg-gradient-accent brutal-border-2 rounded-md" />
      </div>
      {message && (
        <div className="text-sm sm:text-base md:text-lg font-bold text-foreground font-space brutal-border bg-card px-3 sm:px-4 py-2 brutal-shadow rounded-md text-center">
          {message}
        </div>
      )}
    </div>
  );
}