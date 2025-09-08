import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface PageContainerProps {
  children: ReactNode;
  className?: string;
  title?: string;
  description?: string;
}

export function PageContainer({ children, className, title, description }: PageContainerProps) {
  return (
    <div className={cn('container mx-auto py-6', className)}>
      {(title || description) && (
        <div className="mb-8">
          {title && (
            <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">
              {title}
            </h1>
          )}
          {description && (
            <p className="text-muted-foreground text-lg">
              {description}
            </p>
          )}
        </div>
      )}
      {children}
    </div>
  );
}