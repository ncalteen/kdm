'use client'

import {
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
  /** Selected Settlement */
  selectedSettlement: Settlement | null
  /** Set Selected Settlement */
  setSelectedSettlement: (settlement: Settlement | null) => void
  /** Update Selected Settlement */
  updateSelectedSettlement: () => void
  /** Is Creating New Settlement */
  isCreatingNewSettlement: boolean
  /** Set Is Creating New Settlement */
  setIsCreatingNewSettlement: (isCreating: boolean) => void
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
  const [isCreatingNewSettlement, setIsCreatingNewSettlement] =
    useState<boolean>(false)

  // Load selected settlement from localStorage on mount
  useEffect(() => {
    const savedSelectedSettlement = getSelectedSettlement()

    if (savedSelectedSettlement)
      setSelectedSettlementState(savedSelectedSettlement)
  }, [])

  /**
   * Set Selected Settlement
   *
   * Updates selected settlement and persists to localStorage
   */
  const setSelectedSettlement = (settlement: Settlement | null) => {
    setSelectedSettlementState(settlement)
    setSelectedSettlementInStorage(settlement?.id || null)

    // When selecting a settlement, stop creation mode
    if (settlement) setIsCreatingNewSettlement(false)
  }

  /**
   * Update Selected Settlement
   *
   * Refreshes the selected settlement from localStorage
   */
  const updateSelectedSettlement = () =>
    setSelectedSettlementState(getSelectedSettlement())

  return (
    <SettlementContext.Provider
      value={{
        selectedSettlement,
        setSelectedSettlement,
        updateSelectedSettlement,
        isCreatingNewSettlement,
        setIsCreatingNewSettlement
      }}>
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
    throw new Error(
      'Context hook useSettlement must be used within a SettlementProvider'
    )

  return context
}
