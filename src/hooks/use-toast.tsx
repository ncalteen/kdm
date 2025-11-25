'use client'

import { getCampaign } from '@/lib/utils'
import { toast as sonnerToast, ExternalToast } from 'sonner'
import { useCallback, useMemo } from 'react'

/**
 * useToast Custom Hook
 *
 * Provides wrapped toast functions that respect the disableToasts setting
 * from the campaign configuration. Success/info messages are suppressed
 * when toasts are disabled, but error messages are always shown.
 *
 * @returns Wrapped toast functions
 */
export function useToast() {
  /**
   * Check if toasts are disabled
   *
   * @returns True if toasts are disabled
   */
  const areToastsDisabled = useCallback(() => {
    try {
      return getCampaign().disableToasts === true
    } catch {
      return false
    }
  }, [])

  /**
   * Success Toast
   *
   * Shows a success toast message unless toasts are disabled.
   *
   * @param message Toast message
   * @param options Toast options
   */
  const success = useCallback(
    (message: string, options?: ExternalToast) => {
      if (!areToastsDisabled()) {
        sonnerToast.success(message, options)
      }
    },
    [areToastsDisabled]
  )

  /**
   * Error Toast
   *
   * Always shows error toast messages, regardless of toast settings.
   *
   * @param message Toast message
   * @param options Toast options
   */
  const error = useCallback(
    (message: string, options?: ExternalToast) => {
      sonnerToast.error(message, options)
    },
    []
  )

  /**
   * Info Toast
   *
   * Shows an info toast message unless toasts are disabled.
   *
   * @param message Toast message
   * @param options Toast options
   */
  const info = useCallback(
    (message: string, options?: ExternalToast) => {
      if (!areToastsDisabled()) {
        sonnerToast.info(message, options)
      }
    },
    [areToastsDisabled]
  )

  /**
   * Warning Toast
   *
   * Shows a warning toast message unless toasts are disabled.
   *
   * @param message Toast message
   * @param options Toast options
   */
  const warning = useCallback(
    (message: string, options?: ExternalToast) => {
      if (!areToastsDisabled()) {
        sonnerToast.warning(message, options)
      }
    },
    [areToastsDisabled]
  )

  const toast = useMemo(
    () => ({
      success,
      error,
      info,
      warning
    }),
    [success, error, info, warning]
  )

  return { toast }
}
