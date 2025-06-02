'use client'

import { Settlement } from '@/schemas/settlement'
import {
  createContext,
  ReactElement,
  ReactNode,
  useContext,
  useState
} from 'react'

/**
 * Settlement Context Shape
 */
interface SettlementContextType {
  selectedSettlement: Settlement | null
  setSelectedSettlement: (settlement: Settlement | null) => void
}

/**
 * Settlement Context
 */
const SettlementContext = createContext<SettlementContextType | undefined>(
  undefined
)

/**
 * Settlement Provider
 */
export function SettlementProvider({
  settlement,
  children
}: {
  settlement: Settlement | null
  children: ReactNode
}): ReactElement {
  const [selectedSettlement, setSelectedSettlement] =
    useState<Settlement | null>(settlement)

  return (
    <SettlementContext.Provider
      value={{ selectedSettlement, setSelectedSettlement }}>
      {children}
    </SettlementContext.Provider>
  )
}

/**
 * Settlement Context Hook
 */
export function useSettlement(): SettlementContextType {
  const context = useContext(SettlementContext)
  if (!context)
    throw new Error('useSettlement must be used within a SettlementProvider')

  return context
}
