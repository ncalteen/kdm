'use client'

import { TabType } from '@/lib/enums'
import {
  getSelectedTab,
  setSelectedTab as setSelectedTabInStorage
} from '@/lib/utils'
import {
  createContext,
  ReactElement,
  ReactNode,
  useContext,
  useState
} from 'react'

/**
 * Selected Tab Context Type
 */
interface SelectedTabContextType {
  /** Selected Tab */
  selectedTab: TabType
  /** Set Selected Tab */
  setSelectedTab: (tab: TabType) => void
}

/**
 * Selected Tab Context Provider Properties
 */
interface SelectedTabProviderProps {
  /** Tab */
  tab: TabType
  /** Children */
  children: ReactNode
}

/**
 * Selected Tab Context
 */
const SelectedTabContext = createContext<SelectedTabContextType | undefined>(
  undefined
)

/**
 * Selected Tab Context Provider
 *
 * @param props Selected Tab Provider Properties
 * @returns Selected Tab Context Provider Component
 */
export function SelectedTabProvider({
  tab,
  children
}: SelectedTabProviderProps): ReactElement {
  const [selectedTab, setSelectedTabState] = useState<TabType>(() =>
    typeof window === 'undefined' ? tab : getSelectedTab() || tab
  )

  /**
   * Set Selected Tab
   *
   * @param tab Selected Tab
   */
  const setSelectedTab = (tab: TabType) => {
    setSelectedTabState(tab)
    setSelectedTabInStorage(tab)
  }

  return (
    <SelectedTabContext.Provider value={{ selectedTab, setSelectedTab }}>
      {children}
    </SelectedTabContext.Provider>
  )
}

/**
 * Tab Context Hook
 */
export function useSelectedTab(): SelectedTabContextType {
  const context = useContext(SelectedTabContext)

  if (!context)
    throw new Error(
      'Context hook useSelectedTab must be used within a SelectedTabProvider'
    )

  return context
}
