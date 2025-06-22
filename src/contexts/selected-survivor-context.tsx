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
 * Selected Survivor Context Type
 */
interface SelectedSurvivorContextType {
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
 * Selected Survivor Context Provider Properties
 */
interface SelectedSurvivorProviderProps {
  /** Survivor */
  survivor: Survivor | null
  /** Children */
  children: ReactNode
}

/**
 * Selected Survivor Context
 */
const SelectedSurvivorContext = createContext<
  SelectedSurvivorContextType | undefined
>(undefined)

/**
 * Selected Survivor Context Provider
 *
 * @param props Selected Survivor Provider Properties
 * @returns Selected Survivor Context Provider Component
 */
export function SelectedSurvivorProvider({
  survivor,
  children
}: SelectedSurvivorProviderProps): ReactElement {
  const [selectedSurvivor, setSelectedSurvivorState] =
    useState<Survivor | null>(survivor)
  const [isCreatingNewSurvivor, setIsCreatingNewSurvivor] =
    useState<boolean>(false)

  // Load selected survivor from localStorage on mount
  useEffect(() => {
    const savedSelectedSurvivor = getSelectedSurvivor()

    if (savedSelectedSurvivor) setSelectedSurvivorState(savedSelectedSurvivor)
  }, [])

  // Listen for campaign updates to keep selected survivor in sync
  useEffect(() => {
    const handleCampaignUpdate = () => {
      if (selectedSurvivor?.id) {
        const updatedSurvivor = getSelectedSurvivor()
        if (updatedSurvivor && updatedSurvivor.id === selectedSurvivor.id) {
          setSelectedSurvivorState(updatedSurvivor)
        }
      }
    }

    // Listen for both storage events and custom campaign update events
    window.addEventListener('storage', handleCampaignUpdate)
    window.addEventListener('campaignUpdated', handleCampaignUpdate)

    return () => {
      window.removeEventListener('storage', handleCampaignUpdate)
      window.removeEventListener('campaignUpdated', handleCampaignUpdate)
    }
  }, [selectedSurvivor?.id])

  /**
   * Set Selected Survivor
   */
  const setSelectedSurvivor = (survivor: Survivor | null) => {
    // Update state
    setSelectedSurvivorState(survivor)
    // Save to localStorage
    setSelectedSurvivorInStorage(survivor?.id || null)

    // When selecting a survivor, stop creation mode
    if (survivor) setIsCreatingNewSurvivor(false)
  }

  /**
   * Update Selected Survivor
   */
  const updateSelectedSurvivor = () => {
    if (selectedSurvivor?.id) {
      const updatedSurvivor = getSelectedSurvivor()

      if (updatedSurvivor) setSelectedSurvivorState(updatedSurvivor)
    }
  }

  return (
    <SelectedSurvivorContext.Provider
      value={{
        isCreatingNewSurvivor,
        selectedSurvivor,
        setIsCreatingNewSurvivor,
        setSelectedSurvivor,
        updateSelectedSurvivor
      }}>
      {children}
    </SelectedSurvivorContext.Provider>
  )
}

/**
 * Survivor Context Hook
 */
export function useSelectedSurvivor(): SelectedSurvivorContextType {
  const context = useContext(SelectedSurvivorContext)

  if (!context)
    throw new Error(
      'Context hook useSelectedSurvivor must be used within a SelectedSurvivorProvider'
    )

  return context
}
