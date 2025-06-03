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
 * Tab Context Shape
 */
interface TabContextType {
  selectedTab: string
  setSelectedTab: (tab: string) => void
}

const TabContext = createContext<TabContextType | undefined>(undefined)

/**
 * Tab Context Provider
 */
export function TabProvider({
  initialTab,
  children
}: {
  initialTab: string
  children: ReactNode
}): ReactElement {
  const [selectedTab, setSelectedTabState] = useState<string>(initialTab)

  // Load selected tab from localStorage on mount
  useEffect(() => {
    const savedSelectedTab = getSelectedTab()
    if (savedSelectedTab) setSelectedTabState(savedSelectedTab)
  }, [])

  // Function to update selected tab and persist to localStorage
  const setSelectedTab = (tab: string) => {
    setSelectedTabState(tab)
    setSelectedTabInStorage(tab)
  }

  return (
    <TabContext.Provider value={{ selectedTab, setSelectedTab }}>
      {children}
    </TabContext.Provider>
  )
}

/**
 * Tab Context Hook
 */
export function useTab(): TabContextType {
  const context = useContext(TabContext)
  if (!context) throw new Error('useTab must be used within a TabProvider')

  return context
}
