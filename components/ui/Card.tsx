import { HTMLAttributes } from 'react';

export const Card = ({ className = '', children, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div className={`bg-neutral-900 rounded-xl shadow-md border border-neutral-800 ${className}`} {...props}>
    {children}
  </div>
);

export const CardHeader = ({ className = '', children, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div className={`p-6 ${className}`} {...props}>
    {children}
  </div>
);

export const CardContent = ({ className = '', children, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div className={`p-6 pt-0 ${className}`} {...props}>
    {children}
  </div>
);

export const CardTitle = ({ className = '', children, ...props }: HTMLAttributes<HTMLHeadingElement>) => (
  <h3 className={`text-2xl font-bold ${className}`} {...props}>
    {children}
  </h3>
);


