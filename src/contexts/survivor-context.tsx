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
  selectedSurvivor: Survivor | null
  setSelectedSurvivor: (survivor: Survivor | null) => void
  isCreatingNewSurvivor: boolean
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
  const [selectedSurvivor, setSelectedSurvivorState] =
    useState<Survivor | null>(survivor)
  const [isCreatingNewSurvivor, setIsCreatingNewSurvivor] =
    useState<boolean>(false)

  // Load selected survivor from localStorage on mount
  useEffect(() => {
    const savedSelectedSurvivor = getSelectedSurvivor()
    if (savedSelectedSurvivor) setSelectedSurvivorState(savedSelectedSurvivor)
  }, [])

  // Function to update selected survivor and persist to localStorage
  const setSelectedSurvivor = (survivor: Survivor | null) => {
    setSelectedSurvivorState(survivor)
    setSelectedSurvivorInStorage(survivor?.id || null)
    // When selecting a survivor, stop creating mode
    if (survivor) setIsCreatingNewSurvivor(false)
  }

  return (
    <SurvivorContext.Provider
      value={{
        selectedSurvivor,
        setSelectedSurvivor,
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
    throw new Error('useSurvivor must be used within a SurvivorProvider')

  return context
}
