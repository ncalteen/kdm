'use client'

import { useTheme } from 'next-themes'
import { Toaster as Sonner, ToasterProps } from 'sonner'

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme()
  const isDark = theme === 'dark'

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className="toaster group"
      position="top-right"
      closeButton
      richColors
      expand={false}
      duration={4000}
      style={
        {
          // Default toast styling
          '--normal-bg': 'var(--popover)',
          '--normal-text': 'var(--popover-foreground)',
          '--normal-border': 'var(--border)',

          // Success toast styling - green
          '--success-bg': isDark ? 'hsl(142, 76%, 10%)' : 'hsl(142, 76%, 97%)',
          '--success-text': isDark
            ? 'hsl(142, 70%, 70%)'
            : 'hsl(142, 70%, 25%)',
          '--success-border': isDark
            ? 'hsl(142, 70%, 30%)'
            : 'hsl(142, 70%, 90%)',

          // Error toast styling - muted red
          '--error-bg': isDark ? 'hsl(359, 65%, 12%)' : 'hsl(359, 85%, 97%)',
          '--error-text': isDark ? 'hsl(359, 65%, 75%)' : 'hsl(359, 65%, 40%)',
          '--error-border': isDark
            ? 'hsl(359, 65%, 25%)'
            : 'hsl(359, 65%, 90%)',

          // Warning toast styling - amber/yellow
          '--warning-bg': isDark ? 'hsl(38, 92%, 10%)' : 'hsl(38, 92%, 95%)',
          '--warning-text': isDark ? 'hsl(38, 92%, 75%)' : 'hsl(38, 92%, 30%)',
          '--warning-border': isDark
            ? 'hsl(38, 92%, 25%)'
            : 'hsl(38, 92%, 85%)',

          // Info toast styling - blue
          '--info-bg': isDark ? 'hsl(208, 100%, 12%)' : 'hsl(208, 100%, 97%)',
          '--info-text': isDark ? 'hsl(208, 100%, 75%)' : 'hsl(208, 100%, 35%)',
          '--info-border': isDark
            ? 'hsl(208, 100%, 30%)'
            : 'hsl(208, 100%, 90%)',

          // Customize other aspects
          '--border-radius': 'var(--radius)',
          '--font-size': 'var(--text-sm)',
          '--shadow': isDark
            ? '0 2px 10px rgba(0, 0, 0, 0.3)'
            : '0 4px 12px rgba(0, 0, 0, 0.1)',

          // Animation speed and timing
          '--transition-duration': '200ms',
          '--transition-timing-function': 'cubic-bezier(0.4, 0, 0.2, 1)',

          // Toast dimensions and spacing
          '--width': 'calc(var(--container-lg) * 0.8)',
          '--height': 'auto',
          '--padding': 'calc(var(--spacing) * 3)',
          '--gap': 'calc(var(--spacing) * 1.5)',
          '--icon-size': 'calc(var(--spacing) * 5)'
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
