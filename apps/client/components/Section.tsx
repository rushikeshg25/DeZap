import { cn } from '@/lib/utils';
import React, { ReactNode } from 'react';

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  heading: ReactNode;
  description: ReactNode;
}
export const Section: React.FC<SectionProps> = ({
  heading,
  description,
  children,
  className,
  ...props
}) => {
  return (
    <section
      className={cn(
        'text-white/90 max-w-screen-lg text-center mx-auto gap-8 grid py-24',
        className
      )}
      {...props}
    >
      {typeof heading === 'string' ? (
        <h1 className="text-5xl font-semibold">{heading}</h1>
      ) : (
        heading
      )}
      {typeof description === 'string' ? (
        <p className="mx-auto text-lg text-primary/60 px-8">{description}</p>
      ) : (
        description
      )}
      {children}
    </section>
  );
};
