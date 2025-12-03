'use client'

import {
  getSelectedHunt,
  setSelectedHunt as setSelectedHuntInStorage
} from '@/lib/utils'
import { Hunt } from '@/schemas/hunt'
import {
  createContext,
  ReactElement,
  ReactNode,
  useContext,
  useState
} from 'react'

/**
 * Selected Hunt Context Type
 */
interface SelectedHuntContextType {
  /** Is Creating New Hunt */
  isCreatingNewHunt: boolean
  /** Selected Hunt */
  selectedHunt: Hunt | null
  /** Set Is Creating New Hunt */
  setIsCreatingNewHunt: (isCreating: boolean) => void
  /** Set Selected Hunt */
  setSelectedHunt: (hunt: Hunt | null) => void
  /** Update Selected Hunt */
  updateSelectedHunt: () => void
}

/**
 * Selected Hunt Context Provider Properties
 */
interface SelectedHuntProviderProps {
  /** Hunt */
  hunt: Hunt | null
  /** Children */
  children: ReactNode
}

/**
 * Selected Hunt Context
 */
const SelectedHuntContext = createContext<SelectedHuntContextType | undefined>(
  undefined
)

/**
 * Selected Hunt Context Provider
 *
 * @param props Selected Hunt Provider Properties
 * @returns Selected Hunt Context Provider Component
 */
export function SelectedHuntProvider({
  hunt,
  children
}: SelectedHuntProviderProps): ReactElement {
  const [selectedHunt, setSelectedHuntState] = useState<Hunt | null>(() =>
    typeof window === 'undefined' ? hunt : getSelectedHunt() || hunt
  )
  const [isCreatingNewHunt, setIsCreatingNewHunt] = useState<boolean>(false)

  /**
   * Set Selected Hunt
   */
  const setSelectedHunt = (hunt: Hunt | null) => {
    setSelectedHuntState(hunt)
    setSelectedHuntInStorage(hunt?.id || null)

    // When selecting a hunt, stop creation mode
    if (hunt) setIsCreatingNewHunt(false)
  }

  /**
   * Update Selected Hunt
   */
  const updateSelectedHunt = () => setSelectedHuntState(getSelectedHunt())

  return (
    <SelectedHuntContext.Provider
      value={{
        isCreatingNewHunt,
        selectedHunt,
        setIsCreatingNewHunt,
        setSelectedHunt,
        updateSelectedHunt
      }}>
      {children}
    </SelectedHuntContext.Provider>
  )
}

/**
 * Selected Hunt Context Hook
 */
export function useSelectedHunt(): SelectedHuntContextType {
  const context = useContext(SelectedHuntContext)

  if (!context)
    throw new Error(
      'Context hook useSelectedHunt must be used within an SelectedHuntProvider'
    )

  return context
}
