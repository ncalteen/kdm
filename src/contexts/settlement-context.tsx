'use client'

import {
  getCampaign,
  getSelectedSettlement,
  setSelectedSettlement as setSelectedSettlementInStorage
} from '@/lib/utils'
import { Settlement } from '@/schemas/settlement'
import {
  createContext,
  ReactElement,
  ReactNode,
  useContext,
  useEffect,
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
  const [selectedSettlement, setSelectedSettlementState] =
    useState<Settlement | null>(settlement)

  // Load selected settlement from localStorage on mount
  useEffect(() => {
    const savedSelectedSettlement = getSelectedSettlement()
    if (savedSelectedSettlement)
      setSelectedSettlementState(savedSelectedSettlement)
    else {
      // If no selected settlement found, clear any stale localStorage reference
      const campaign = getCampaign()

      if (campaign.selectedSettlementId) {
        campaign.selectedSettlementId = undefined
        setSelectedSettlementInStorage(null)
      }
    }
  }, [])

  // Function to update selected settlement and persist to localStorage
  const setSelectedSettlement = (settlement: Settlement | null) => {
    setSelectedSettlementState(settlement)
    setSelectedSettlementInStorage(settlement?.id || null)
  }

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
