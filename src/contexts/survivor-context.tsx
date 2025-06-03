'use client'

import { Survivor } from '@/schemas/survivor'
import {
  createContext,
  ReactElement,
  ReactNode,
  useContext,
  useState
} from 'react'

/**
 * Survivor Context Shape
 */
interface SurvivorContextType {
  selectedSurvivor: Survivor | null
  setSelectedSurvivor: (survivor: Survivor | null) => void
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
  const [selectedSurvivor, setSelectedSurvivor] = useState<Survivor | null>(
    survivor
  )

  return (
    <SurvivorContext.Provider value={{ selectedSurvivor, setSelectedSurvivor }}>
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
