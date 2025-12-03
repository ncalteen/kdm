'use client'

import {
  getSelectedShowdown,
  setSelectedShowdown as setSelectedShowdownInStorage
} from '@/lib/utils'
import { Showdown } from '@/schemas/showdown'
import {
  createContext,
  ReactElement,
  ReactNode,
  useContext,
  useState
} from 'react'

/**
 * Selected Showdown Context Type
 */
interface SelectedShowdownContextType {
  /** Is Creating New Showdown */
  isCreatingNewShowdown: boolean
  /** Selected Showdown */
  selectedShowdown: Showdown | null
  /** Set Is Creating New Showdown */
  setIsCreatingNewShowdown: (isCreating: boolean) => void
  /** Set Selected Showdown */
  setSelectedShowdown: (showdown: Showdown | null) => void
  /** Update Selected Showdown */
  updateSelectedShowdown: () => void
}

/**
 * Selected Showdown Context Provider Properties
 */
interface SelectedShowdownProviderProps {
  /** Showdown */
  showdown: Showdown | null
  /** Children */
  children: ReactNode
}

/**
 * Selected Showdown Context
 */
const SelectedShowdownContext = createContext<
  SelectedShowdownContextType | undefined
>(undefined)

/**
 * Selected Showdown Context Provider
 *
 * @param props Selected Showdown Provider Properties
 * @returns Selected Showdown Context Provider Component
 */
export function SelectedShowdownProvider({
  showdown,
  children
}: SelectedShowdownProviderProps): ReactElement {
  const [selectedShowdown, setSelectedShowdownState] =
    useState<Showdown | null>(() =>
      typeof window === 'undefined'
        ? showdown
        : getSelectedShowdown() || showdown
    )
  const [isCreatingNewShowdown, setIsCreatingNewShowdown] =
    useState<boolean>(false)

  /**
   * Set Selected Showdown
   */
  const setSelectedShowdown = (showdown: Showdown | null) => {
    setSelectedShowdownState(showdown)
    setSelectedShowdownInStorage(showdown?.id || null)

    // When selecting a showdown, stop creation mode
    if (showdown) setIsCreatingNewShowdown(false)
  }

  /**
   * Update Selected Showdown
   */
  const updateSelectedShowdown = () =>
    setSelectedShowdownState(getSelectedShowdown())

  return (
    <SelectedShowdownContext.Provider
      value={{
        isCreatingNewShowdown,
        selectedShowdown,
        setIsCreatingNewShowdown,
        setSelectedShowdown,
        updateSelectedShowdown
      }}>
      {children}
    </SelectedShowdownContext.Provider>
  )
}

/**
 * Selected Showdown Context Hook
 */
export function useSelectedShowdown(): SelectedShowdownContextType {
  const context = useContext(SelectedShowdownContext)

  if (!context)
    throw new Error(
      'Context hook useSelectedShowdown must be used within an SelectedShowdownProvider'
    )

  return context
}
