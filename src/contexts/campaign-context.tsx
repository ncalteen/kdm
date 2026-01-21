'use client'

import { TabType } from '@/lib/enums'
import {
  getCampaign,
  newCampaign,
  saveCampaignToLocalStorage
} from '@/lib/utils'
import { Campaign } from '@/schemas/campaign'
import { Hunt } from '@/schemas/hunt'
import { Settlement } from '@/schemas/settlement'
import { Showdown } from '@/schemas/showdown'
import { Survivor } from '@/schemas/survivor'
import {
  createContext,
  ReactElement,
  ReactNode,
  useContext,
  useState
} from 'react'

/**
 * Campaign Context Type
 */
interface CampaignContextType {
  /** Campaign Data */
  campaign: Campaign

  /** Is Creating New Hunt */
  isCreatingNewHunt: boolean
  /** Is Creating New Settlement */
  isCreatingNewSettlement: boolean
  /** Is Creating New Showdown */
  isCreatingNewShowdown: boolean
  /** Is Creating New Survivor */
  isCreatingNewSurvivor: boolean

  /** Selected Hunt */
  selectedHunt: Hunt | null
  /** Selected Hunt Monster Index */
  selectedHuntMonsterIndex: number
  /** Selected Settlement */
  selectedSettlement: Settlement | null
  /** Selected Showdown */
  selectedShowdown: Showdown | null
  /** Selected Showdown Monster Index */
  selectedShowdownMonsterIndex: number
  /** Selected Survivor */
  selectedSurvivor: Survivor | null
  /** Selected Tab */
  selectedTab: TabType

  /** Set Is Creating New Hunt */
  setIsCreatingNewHunt: (isCreating: boolean) => void
  /** Set Is Creating New Settlement */
  setIsCreatingNewSettlement: (isCreating: boolean) => void
  /** Set Is Creating New Showdown */
  setIsCreatingNewShowdown: (isCreating: boolean) => void
  /** Set Is Creating New Survivor */
  setIsCreatingNewSurvivor: (isCreating: boolean) => void

  /** Set Selected Hunt */
  setSelectedHunt: (hunt: Hunt | null) => void
  /** Set Selected Hunt Monster Index */
  setSelectedHuntMonsterIndex: (index: number) => void
  /** Set Selected Settlement */
  setSelectedSettlement: (settlement: Settlement | null) => void
  /** Set Selected Showdown */
  setSelectedShowdown: (showdown: Showdown | null) => void
  /** Set Selected Showdown Monster Index */
  setSelectedShowdownMonsterIndex: (index: number) => void
  /** Set Selected Survivor */
  setSelectedSurvivor: (survivor: Survivor | null) => void
  /** Set Selected Tab */
  setSelectedTab: (tab: TabType) => void
  /** Set Campaign Schema Version */
  setVersion: (version: string) => void

  /** Set Survivors */
  setSurvivors: (survivors: Survivor[]) => void
  /** Survivors */
  survivors: Survivor[] | null

  /** Update Campaign */
  updateCampaign: (campaign: Campaign) => void
  /** Update Selected Hunt */
  updateSelectedHunt: () => void
  /** Update Selected Settlement */
  updateSelectedSettlement: () => void
  /** Update Selected Showdown */
  updateSelectedShowdown: () => void
  /** Update Selected Survivor */
  updateSelectedSurvivor: () => void

  /** Campaign Schema Version */
  version: string
}

/**
 * Campaign Context Provider Properties
 */
interface CampaignProviderProps {
  /** Children */
  children: ReactNode
}

/**
 * Campaign Context
 */
const CampaignContext = createContext<CampaignContextType | undefined>(
  undefined
)

/**
 * Campaign Context Provider
 *
 * @param props Campaign Provider Properties
 * @returns Campaign Context Provider Component
 */
export function CampaignProvider({
  children
}: CampaignProviderProps): ReactElement {
  const [campaign, setCampaignState] = useState<Campaign>(() =>
    typeof window === 'undefined' ? newCampaign : getCampaign()
  )

  const [selectedHunt, setSelectedHuntState] = useState<Hunt | null>(
    () =>
      campaign.hunts?.find((hunt) => hunt.id === campaign.selectedHuntId) ||
      null
  )
  const [selectedHuntMonsterIndex, setSelectedHuntMonsterIndexState] =
    useState<number>(() => campaign.selectedHuntMonsterIndex ?? 0)
  const [selectedSettlement, setSelectedSettlementState] =
    useState<Settlement | null>(
      () =>
        campaign.settlements.find(
          (settlement) => settlement.id === campaign.selectedSettlementId
        ) || null
    )
  const [selectedShowdown, setSelectedShowdownState] =
    useState<Showdown | null>(
      () =>
        campaign.showdowns?.find(
          (showdown) => showdown.id === campaign.selectedShowdownId
        ) || null
    )
  const [selectedShowdownMonsterIndex, setSelectedShowdownMonsterIndexState] =
    useState<number>(() => campaign.selectedShowdownMonsterIndex ?? 0)
  const [selectedSurvivor, setSelectedSurvivorState] =
    useState<Survivor | null>(
      () =>
        campaign.survivors.find(
          (survivor) => survivor.id === campaign.selectedSurvivorId
        ) || null
    )
  const [selectedTab, setSelectedTabState] = useState<TabType>(
    () => campaign?.selectedTab || TabType.TIMELINE
  )

  const [survivorsState, setSurvivorsState] = useState<Survivor[] | null>(
    () => campaign.survivors
  )

  const [isCreatingNewHunt, setIsCreatingNewHunt] = useState<boolean>(false)
  const [isCreatingNewSettlement, setIsCreatingNewSettlement] =
    useState<boolean>(false)
  const [isCreatingNewShowdown, setIsCreatingNewShowdown] =
    useState<boolean>(false)
  const [isCreatingNewSurvivor, setIsCreatingNewSurvivor] =
    useState<boolean>(false)

  // Note: 0.12.0 is the first version with the version field. If there is no
  // version, assume 0.12.0
  const [version, setVersionState] = useState<string>(
    campaign.version ?? '0.12.0'
  )

  /**
   * Set Selected Hunt
   */
  const setSelectedHunt = (hunt: Hunt | null) => {
    setSelectedHuntState(hunt)
    setCampaignState((campaign) => {
      const updatedCampaign = {
        ...campaign,
        selectedHuntId: hunt?.id || null,
        selectedHuntMonsterIndex: 0
      }

      saveCampaignToLocalStorage(updatedCampaign)

      return updatedCampaign
    })

    // When selecting a hunt, stop creation mode
    if (hunt) setIsCreatingNewHunt(false)
  }

  /**
   * Set Selected Hunt Monster Index
   */
  const setSelectedHuntMonsterIndex = (index: number) => {
    setSelectedHuntMonsterIndexState(index)
    setCampaignState((campaign) => {
      const updatedCampaign = {
        ...campaign,
        selectedHuntMonsterIndex: index
      }

      saveCampaignToLocalStorage(updatedCampaign)

      return updatedCampaign
    })
  }

  /**
   * Set Selected Settlement
   */
  const setSelectedSettlement = (settlement: Settlement | null) => {
    setCampaignState((campaign) => {
      const currentSettlementId = campaign.selectedSettlementId
      const updatedCampaign = {
        ...campaign,
        selectedSettlementId: settlement?.id || null
      }

      saveCampaignToLocalStorage(updatedCampaign)

      // If the selected settlement changed, also clear selected showdown
      if (currentSettlementId !== settlement?.id) {
        setSelectedHuntState(null)
        setSelectedHuntMonsterIndexState(0)
        setSelectedShowdownState(null)
        setSelectedShowdownMonsterIndexState(0)
        setSelectedSurvivorState(null)
      }

      return updatedCampaign
    })

    setSelectedSettlementState(settlement)

    // Stop creation mode
    if (settlement) setIsCreatingNewSettlement(false)
  }

  /**
   * Set Selected Showdown
   */
  const setSelectedShowdown = (showdown: Showdown | null) => {
    setSelectedShowdownState(showdown)
    setCampaignState((campaign) => {
      const updatedCampaign = {
        ...campaign,
        selectedShowdownId: showdown?.id || null,
        selectedShowdownMonsterIndex: 0
      }

      saveCampaignToLocalStorage(updatedCampaign)

      return updatedCampaign
    })

    // When selecting a showdown, stop creation mode
    if (showdown) setIsCreatingNewShowdown(false)
  }

  /**
   * Set Selected Showdown Monster Index
   */
  const setSelectedShowdownMonsterIndex = (index: number) => {
    setSelectedShowdownMonsterIndexState(index)
    setCampaignState((campaign) => {
      const updatedCampaign = {
        ...campaign,
        selectedShowdownMonsterIndex: index
      }

      saveCampaignToLocalStorage(updatedCampaign)

      return updatedCampaign
    })
  }

  /**
   * Set Selected Survivor
   */
  const setSelectedSurvivor = (survivor: Survivor | null) => {
    setSelectedSurvivorState(survivor)
    setCampaignState((campaign) => {
      const updatedCampaign = {
        ...campaign,
        selectedSurvivorId: survivor?.id || null
      }

      saveCampaignToLocalStorage(updatedCampaign)

      return updatedCampaign
    })

    // When selecting a survivor, stop creation mode
    if (survivor) setIsCreatingNewSurvivor(false)
  }

  /**
   * Set Selected Tab
   *
   * @param tab Selected Tab
   */
  const setSelectedTab = (tab: TabType) => {
    setSelectedTabState(tab)
    setCampaignState((campaign) => {
      const updatedCampaign = {
        ...campaign,
        selectedTab: tab
      }

      saveCampaignToLocalStorage(updatedCampaign)

      return updatedCampaign
    })
  }

  /**
   * Set Survivors
   */
  const setSurvivors = (survivors: Survivor[]) => {
    setSurvivorsState(survivors)
    setCampaignState((campaign) => {
      const updatedCampaign = { ...campaign, survivors }

      saveCampaignToLocalStorage(updatedCampaign)

      return updatedCampaign
    })
  }

  /**
   * Set Version
   */
  const setVersion = (v: string) => {
    setVersionState(v)
    setCampaignState((campaign) => {
      const updatedCampaign = {
        ...campaign,
        version: v
      }

      saveCampaignToLocalStorage(updatedCampaign)

      return updatedCampaign
    })
  }

  /**
   * Update Campaign
   */
  const updateCampaign = (campaign: Campaign) => {
    saveCampaignToLocalStorage(campaign)
    setCampaignState(campaign)
  }

  /**
   * Update Selected Hunt
   */
  const updateSelectedHunt = () => {
    setSelectedHuntState(
      campaign.hunts?.find((hunt) => hunt.id === campaign.selectedHuntId) ||
        null
    )
    setSelectedHuntMonsterIndexState(0)
  }

  /**
   * Update Selected Settlement
   */
  const updateSelectedSettlement = () =>
    setSelectedSettlementState(
      campaign.settlements.find(
        (settlement) => settlement.id === campaign.selectedSettlementId
      ) || null
    )

  /**
   * Update Selected Showdown
   */
  const updateSelectedShowdown = () => {
    setSelectedShowdownState(
      campaign.showdowns?.find(
        (showdown) => showdown.id === campaign.selectedShowdownId
      ) || null
    )
    setSelectedShowdownMonsterIndexState(0)
  }

  /**
   * Update Selected Survivor
   */
  const updateSelectedSurvivor = () => {
    setSelectedSurvivorState(
      campaign.survivors.find(
        (survivor) => survivor.id === campaign.selectedSurvivorId
      ) || null
    )
  }

  return (
    <CampaignContext.Provider
      value={{
        campaign,
        isCreatingNewHunt,
        isCreatingNewSettlement,
        isCreatingNewShowdown,
        isCreatingNewSurvivor,

        selectedHunt,
        selectedHuntMonsterIndex,
        selectedSettlement,
        selectedShowdown,
        selectedShowdownMonsterIndex,
        selectedSurvivor,
        selectedTab,

        setIsCreatingNewHunt,
        setIsCreatingNewSettlement,
        setIsCreatingNewShowdown,
        setIsCreatingNewSurvivor,

        setSelectedHunt,
        setSelectedHuntMonsterIndex,
        setSelectedSettlement,
        setSelectedShowdown,
        setSelectedShowdownMonsterIndex,
        setSelectedSurvivor,
        setSelectedTab,
        setSurvivors,
        setVersion,

        survivors: survivorsState,

        updateCampaign,
        updateSelectedHunt,
        updateSelectedSettlement,
        updateSelectedShowdown,
        updateSelectedSurvivor,

        version
      }}>
      {children}
    </CampaignContext.Provider>
  )
}

/**
 * Campaign Context Hook
 */
export function useCampaign(): CampaignContextType {
  const context = useContext(CampaignContext)

  if (!context)
    throw new Error(
      'Context hook useCampaign must be used within a CampaignProvider'
    )

  return context
}
