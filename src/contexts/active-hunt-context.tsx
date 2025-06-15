'use client'

import { getSelectedActiveHunt } from '@/lib/utils'
import { ActiveHunt } from '@/schemas/active-hunt'
import {
  createContext,
  ReactElement,
  ReactNode,
  useContext,
  useEffect,
  useState
} from 'react'

/**
 * Active Hunt Context Shape
 */
interface ActiveHuntContextType {
  /** Selected Active Hunt */
  selectedActiveHunt: ActiveHunt | null
  /** Update Active Hunt */
  updateSelectedActiveHunt: () => void
}

/**
 * Active Hunt Context
 */
const ActiveHuntContext = createContext<ActiveHuntContextType | undefined>(
  undefined
)

/**
 * Active Hunt Provider
 */
export function ActiveHuntProvider({
  activeHunt,
  children
}: {
  activeHunt: ActiveHunt | null
  children: ReactNode
}): ReactElement {
  const [selectedActiveHunt, setSelectedActiveHuntState] =
    useState<ActiveHunt | null>(activeHunt)

  // Load selected active hunt from localStorage on mount
  useEffect(() => {
    const savedSelectedActiveHunt = getSelectedActiveHunt()

    if (savedSelectedActiveHunt)
      setSelectedActiveHuntState(savedSelectedActiveHunt)
  }, [])

  /**
   * Update Selected Active Hunt
   *
   * Refreshes the selected active hunt from localStorage
   */
  const updateSelectedActiveHunt = () => {
    const updatedActiveHunt = getSelectedActiveHunt()
    setSelectedActiveHuntState(updatedActiveHunt)
  }

  return (
    <ActiveHuntContext.Provider
      value={{
        selectedActiveHunt,
        updateSelectedActiveHunt
      }}>
      {children}
    </ActiveHuntContext.Provider>
  )
}

/**
 * Active Hunt Context Hook
 */
export function useActiveHunt(): ActiveHuntContextType {
  const context = useContext(ActiveHuntContext)

  if (!context)
    throw new Error(
      'Context hook useActiveHunt must be used within an ActiveHuntProvider'
    )

  return context
}
