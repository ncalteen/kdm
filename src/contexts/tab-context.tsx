'use client'

import {
  createContext,
  ReactElement,
  ReactNode,
  useContext,
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
  const [selectedTab, setSelectedTab] = useState<string>(initialTab)

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
