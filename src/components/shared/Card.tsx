import clsx from 'clsx'
import React from 'react'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  variant?: 'default' | 'bordered' | 'elevated'
}

export function Card({
  children,
  variant = 'default',
  className,
  ...props
}: CardProps) {
  return (
    <div
      className={clsx(
        'bg-gg-card rounded-xl overflow-hidden',
        variant === 'bordered' && 'border border-gg-border',
        variant === 'elevated' && 'border border-gg-border shadow-lg shadow-black/30',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

interface CardSectionProps {
  children: React.ReactNode
  className?: string
}

export function CardSection({ children, className }: CardSectionProps) {
  return <div className={clsx('p-4', className)}>{children}</div>
}
