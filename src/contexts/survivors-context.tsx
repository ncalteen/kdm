'use client'

/**
 * Use this in the Hunt components for saving and managing all of the survivors in a settlement.
 */

import { getSurvivors } from '@/lib/utils'
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
 * Survivors Context Type
 */
interface SurvivorsContextType {
  /** Set Survivors */
  setSurvivors: (survivors: Survivor[]) => void
  /** Survivors */
  survivors: Survivor[] | null
}

/**
 * Survivors Context Provider Properties
 */
interface SurvivorsProviderProps {
  /** Survivors */
  survivors: Survivor[] | null
  /** Children */
  children: ReactNode
}

/**
 * Survivors Context
 */
const SurvivorsContext = createContext<SurvivorsContextType | undefined>(
  undefined
)

/**
 * Survivors Context Provider
 *
 * @param props Survivors Provider Properties
 * @returns Survivors Context Provider Component
 */
export function SurvivorsProvider({
  survivors,
  children
}: SurvivorsProviderProps): ReactElement {
  const [survivorsState, setSurvivorsState] = useState<Survivor[] | null>(
    survivors
  )

  // Load survivors from localStorage on mount
  useEffect(() => {
    const savedSurvivors = getSurvivors()

    if (savedSurvivors) setSurvivorsState(savedSurvivors)
  }, [])

  // Listen for campaign updates to keep survivors in sync
  useEffect(() => {
    const handleCampaignUpdate = () => setSurvivorsState(getSurvivors())

    // Listen for both storage events and custom campaign update events
    window.addEventListener('storage', handleCampaignUpdate)
    window.addEventListener('campaignUpdated', handleCampaignUpdate)

    return () => {
      window.removeEventListener('storage', handleCampaignUpdate)
      window.removeEventListener('campaignUpdated', handleCampaignUpdate)
    }
  }, [])

  /**
   * Set Survivors
   */
  const setSurvivors = (survivors: Survivor[]) => setSurvivorsState(survivors)

  return (
    <SurvivorsContext.Provider
      value={{
        setSurvivors,
        survivors: survivorsState
      }}>
      {children}
    </SurvivorsContext.Provider>
  )
}

/**
 * Survivors Context Hook
 */
export function useSurvivors(): SurvivorsContextType {
  const context = useContext(SurvivorsContext)

  if (!context)
    throw new Error(
      'Context hook useSurvivors must be used within a SurvivorsProvider'
    )

  return context
}
