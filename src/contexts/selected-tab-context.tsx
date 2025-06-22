'use client'

import {
  getSelectedTab,
  setSelectedTab as setSelectedTabInStorage
} from '@/lib/utils'
import {
  createContext,
  ReactElement,
  ReactNode,
  useContext,
  useEffect,
  useState
} from 'react'

/**
 * Selected Tab Context Type
 */
interface SelectedTabContextType {
  /** Selected Tab */
  selectedTab: string
  /** Set Selected Tab */
  setSelectedTab: (tab: string) => void
}

/**
 * Selected Tab Context Provider Properties
 */
interface SelectedTabProviderProps {
  /** Tab */
  tab: string
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
  const [selectedTab, setSelectedTabState] = useState<string>(tab)

  // Load selected tab from localStorage on mount
  useEffect(() => {
    const savedSelectedTab = getSelectedTab()

    if (savedSelectedTab) setSelectedTabState(savedSelectedTab)
  }, [])

  /**
   * Set Selected Tab
   *
   * @param tab Selected Tab
   */
  const setSelectedTab = (tab: string) => {
    // Update state
    setSelectedTabState(tab)
    // Save to localStorage
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
