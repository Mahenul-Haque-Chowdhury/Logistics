"use client";
import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string | ReactNode;
  actions?: ReactNode;
  align?: 'left' | 'center';
  className?: string;
}

export function PageHeader({ eyebrow, title, description, actions, align='left', className='' }: PageHeaderProps) {
  const isCenter = align === 'center';
  return (
    <motion.header
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.4,0.2,0.2,1] }}
      className={`space-y-5 ${isCenter ? 'text-center mx-auto' : ''} ${className}`}
    >
      {eyebrow && <p className="eyebrow tracking-wider text-brand-600 dark:text-brand-400">{eyebrow}</p>}
      <h1 className={`font-heading font-semibold tracking-tight text-4xl md:text-5xl leading-[1.1] max-w-[22ch] ${isCenter ? 'mx-auto' : ''}`}>{title}</h1>
      {description && (
        <div className={`text-muted-foreground leading-relaxed text-base md:text-lg max-w-2xl ${isCenter ? 'mx-auto' : ''}`}>{description}</div>
      )}
      {actions && <div className={`flex flex-col sm:flex-row gap-3 ${isCenter ? 'justify-center' : ''}`}>{actions}</div>}
    </motion.header>
  );
}
