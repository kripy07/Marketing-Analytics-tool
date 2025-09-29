import { ReactNode } from 'react';
import { Card } from '@/components/ui/card';

interface FloatingCardProps {
  children: ReactNode;
  className?: string;
  delay?: string;
}

export function FloatingCard({ children, className = '', delay = '0s' }: FloatingCardProps) {
  return (
    <Card 
      className={`animate-float shadow-xl bg-white/90 backdrop-blur-sm border-white/20 ${className}`}
      style={{ animationDelay: delay }}
    >
      {children}
    </Card>
  );
}