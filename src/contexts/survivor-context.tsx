'use client'

import {
  getSelectedSurvivor,
  setSelectedSurvivor as setSelectedSurvivorInStorage
} from '@/lib/utils'
import { Survivor } from '@/schemas/survivor'
import {
  createContext,
  ReactElement,
  ReactNode,
  useContext,
  useEffect,
  useState
} from 'react'

/**
 * Survivor Context Shape
 */
interface SurvivorContextType {
  /** Selected Survivor */
  selectedSurvivor: Survivor | null
  /** Set Selected Survivor */
  setSelectedSurvivor: (survivor: Survivor | null) => void
  /** Update Selected Survivor */
  updateSelectedSurvivor: () => void
  /** Is Creating New Survivor */
  isCreatingNewSurvivor: boolean
  /** Set Is Creating New Survivor */
  setIsCreatingNewSurvivor: (isCreating: boolean) => void
}

/**
 * Survivor Context
 */
const SurvivorContext = createContext<SurvivorContextType | undefined>(
  undefined
)

/**
 * Survivor Provider
 */
export function SurvivorProvider({
  survivor,
  children
}: {
  survivor: Survivor | null
  children: ReactNode
}): ReactElement {
  // State to hold the selected survivor and creation mode
  const [selectedSurvivor, setSelectedSurvivorState] =
    useState<Survivor | null>(survivor)
  const [isCreatingNewSurvivor, setIsCreatingNewSurvivor] =
    useState<boolean>(false)

  // Load selected survivor from localStorage on mount
  useEffect(() => {
    const savedSelectedSurvivor = getSelectedSurvivor()

    if (savedSelectedSurvivor) setSelectedSurvivorState(savedSelectedSurvivor)
  }, [])

  /**
   * Set Selected Survivor
   *
   * Updates selected survivor and persists to localStorage
   */
  const setSelectedSurvivor = (survivor: Survivor | null) => {
    setSelectedSurvivorState(survivor)
    setSelectedSurvivorInStorage(survivor?.id || null)

    // When selecting a survivor, stop creation mode
    if (survivor) setIsCreatingNewSurvivor(false)
  }

  /**
   * Update Selected Survivor
   *
   * Refreshes the selected survivor from localStorage
   */
  const updateSelectedSurvivor = () => {
    if (selectedSurvivor?.id) {
      const updatedSurvivor = getSelectedSurvivor()

      if (updatedSurvivor) setSelectedSurvivorState(updatedSurvivor)
    }
  }

  return (
    <SurvivorContext.Provider
      value={{
        selectedSurvivor,
        setSelectedSurvivor,
        updateSelectedSurvivor,
        isCreatingNewSurvivor,
        setIsCreatingNewSurvivor
      }}>
      {children}
    </SurvivorContext.Provider>
  )
}

/**
 * Survivor Context Hook
 */
export function useSurvivor(): SurvivorContextType {
  const context = useContext(SurvivorContext)

  if (!context)
    throw new Error(
      'Context hook useSurvivor must be used within a SurvivorProvider'
    )

  return context
}
