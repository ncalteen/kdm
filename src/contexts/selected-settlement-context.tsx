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
 * Selected Settlement Context Type
 */
interface SelectedSettlementContextType {
  /** Is Creating New Settlement */
  isCreatingNewSettlement: boolean
  /** Selected Settlement */
  selectedSettlement: Settlement | null
  /** Set Selected Settlement */
  setSelectedSettlement: (settlement: Settlement | null) => void
  /** Update Selected Settlement */
  updateSelectedSettlement: () => void
  /** Set Is Creating New Settlement */
  setIsCreatingNewSettlement: (isCreating: boolean) => void
}

/**
 * Selected Settlement Context Provider Properties
 */
interface SelectedSettlementProviderProps {
  /** Settlement */
  settlement: Settlement | null
  /** Children */
  children: ReactNode
}

/**
 * Selected Settlement Context
 */
const SelectedSettlementContext = createContext<
  SelectedSettlementContextType | undefined
>(undefined)

/**
 * Selected Settlement Context Provider
 *
 * @param props Selected Settlement Provider Properties
 * @returns Selected Settlement Context Provider Component
 */
export function SelectedSettlementProvider({
  settlement,
  children
}: SelectedSettlementProviderProps): ReactElement {
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
   */
  const setSelectedSettlement = (settlement: Settlement | null) => {
    setSelectedSettlementState(settlement)
    setSelectedSettlementInStorage(settlement?.id || null)

    // When selecting a settlement, stop creation mode
    if (settlement) setIsCreatingNewSettlement(false)
  }

  /**
   * Update Selected Settlement
   */
  const updateSelectedSettlement = () =>
    setSelectedSettlementState(getSelectedSettlement())

  return (
    <SelectedSettlementContext.Provider
      value={{
        isCreatingNewSettlement,
        selectedSettlement,
        setIsCreatingNewSettlement,
        setSelectedSettlement,
        updateSelectedSettlement
      }}>
      {children}
    </SelectedSettlementContext.Provider>
  )
}

/**
 * Selected Settlement Context Hook
 */
export function useSelectedSettlement(): SelectedSettlementContextType {
  const context = useContext(SelectedSettlementContext)

  if (!context)
    throw new Error(
      'Context hook useSelectedSettlement must be used within a SelectedSettlementProvider'
    )

  return context
}
