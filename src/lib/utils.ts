'use client'

import {
  CustomCampaignData,
  PeopleOfTheDreamKeeperCampaignData,
  PeopleOfTheLanternCampaignData,
  PeopleOfTheStarsCampaignData,
  PeopleOfTheSunCampaignData,
  SquiresOfTheCitadelCampaignData
} from '@/lib/common'
import { CampaignType } from '@/lib/enums'
import type { CampaignData } from '@/lib/types'
import { ActiveHunt } from '@/schemas/active-hunt'
import { Campaign } from '@/schemas/campaign'
import { Settlement, TimelineYear } from '@/schemas/settlement'
import { Survivor, SurvivorSchema } from '@/schemas/survivor'
import { clsx, type ClassValue } from 'clsx'
import { UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'
import { twMerge } from 'tailwind-merge'
import { ZodError } from 'zod'

/**
 * Duration to cache the loaded campaign in milliseconds.
 *
 * This is used to reduce the number of reads from localStorage
 * and improve performance when accessing campaign data frequently.
 */
const CACHE_DURATION = 5000

let cachedCampaign: Campaign | null = null
let lastCacheUpdate: number = 0

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Gets the user's campaign from localStorage.
 *
 * @returns Campaign
 */
export function getCampaign(): Campaign {
  const now = Date.now()

  // Return cached campaign if available and recent
  if (cachedCampaign && now - lastCacheUpdate < CACHE_DURATION)
    return cachedCampaign

  const storedCampaign = JSON.parse(
    localStorage.getItem('campaign') ||
      JSON.stringify({
        settlements: [],
        survivors: []
      })
  )

  // Ensure backwards compatibility for existing campaign data
  const campaign: Campaign = {
    settlements: storedCampaign.settlements || [],
    survivors: storedCampaign.survivors || [],
    // If selectedSettlementId is not present, add it as undefined
    selectedSettlementId: storedCampaign.selectedSettlementId || undefined,
    selectedSurvivorId: storedCampaign.selectedSurvivorId || undefined,
    selectedTab: storedCampaign.selectedTab || undefined
  }

  cachedCampaign = campaign
  lastCacheUpdate = now

  return campaign
}

/**
 * Invalidates the campaign cache to force fresh data on next getCampaign call
 */
export function invalidateCampaignCache(): void {
  cachedCampaign = null
  lastCacheUpdate = 0
}

/**
 * Saves campaign data to localStorage and invalidates cache
 *
 * @param campaign Campaign data to save
 */
export function saveCampaignToLocalStorage(campaign: Campaign): void {
  localStorage.setItem('campaign', JSON.stringify(campaign))
  invalidateCampaignCache()
}

/**
 * Calculates the next settlement ID.
 *
 * @returns Next Settlement ID
 */
export function getNextSettlementId(): number {
  const campaign = getCampaign()

  // If this is the first settlement, return 1. Otherwise, return the latest
  // settlement ID + 1.
  return campaign.settlements.length === 0
    ? 1
    : Math.max(...campaign.settlements.map((settlement) => settlement.id)) + 1
}

/**
 * Calculates the next survivor ID.
 *
 * @returns Next Survivor ID
 */
export function getNextSurvivorId(): number {
  const campaign = getCampaign()

  // If this is the first survivor, return 1. Otherwise, return the latest
  // survivor ID + 1.
  return campaign.survivors.length === 0
    ? 1
    : Math.max(...campaign.survivors.map((survivor) => survivor.id)) + 1
}

/**
 * Gets the number of lost settlements from localStorage.
 *
 * @returns Lost Settlement Count
 */
export function getLostSettlementCount(): number {
  const campaign = getCampaign()

  // If the user is creating their first settlement, return 0. Otherwise, return
  // the number of lost settlements. This is determined by counting the number
  // of settlements that have the "Population reaches 0" milestone completed.
  return campaign.settlements.length === 0
    ? 0
    : campaign.settlements.filter(
        (settlement) =>
          settlement.milestones.filter(
            (m) => m.complete && m.name === 'Population reaches 0'
          ).length > 0
      ).length
}

/**
 * Gets the current survivors of a settlement from localStorage.
 *
 * @param settlementId Settlement ID
 * @returns Survivors
 */
export function getSurvivors(settlementId?: number): Survivor[] {
  if (!settlementId) return getCampaign().survivors

  return getCampaign().survivors.filter(
    (survivor) => survivor.settlementId === settlementId
  )
}

/**
 * Gets a specific survivor localStorage.
 *
 * @param survivorId Survivor ID
 * @returns Survivor
 */
export function getSurvivor(survivorId: number): Survivor | undefined {
  return getCampaign().survivors.find((survivor) => survivor.id === survivorId)
}

/**
 * Gets a settlement from localStorage.
 *
 * @param settlementId Settlement ID
 * @returns Settlement
 */
export function getSettlement(settlementId: number): Settlement | undefined {
  return getCampaign().settlements.find(
    (settlement) => settlement.id === settlementId
  )
}

/**
 * Gets the currently selected settlement from localStorage.
 *
 * @returns Selected Settlement or null if none is selected or not found
 */
export function getSelectedSettlement(): Settlement | null {
  const campaign = getCampaign()

  if (!campaign.selectedSettlementId) return null

  const settlement = campaign.settlements.find(
    (s) => s.id === campaign.selectedSettlementId
  )

  return settlement || null
}

/**
 * Sets the currently selected settlement in localStorage.
 *
 * @param settlementId Settlement ID to select, or null to clear selection
 */
export function setSelectedSettlement(settlementId: number | null): void {
  const campaign = getCampaign()

  campaign.selectedSettlementId = settlementId || undefined

  saveCampaignToLocalStorage(campaign)
}

/**
 * Gets the currently selected survivor from localStorage.
 *
 * @returns Selected Survivor or null if none is selected or not found
 */
export function getSelectedSurvivor(): Survivor | null {
  const campaign = getCampaign()

  if (!campaign.selectedSurvivorId) return null

  const survivor = campaign.survivors.find(
    (s) => s.id === campaign.selectedSurvivorId
  )

  return survivor || null
}

/**
 * Sets the currently selected survivor in localStorage.
 *
 * @param survivorId Survivor ID to select, or null to clear selection
 */
export function setSelectedSurvivor(survivorId: number | null): void {
  const campaign = getCampaign()

  campaign.selectedSurvivorId = survivorId || undefined

  saveCampaignToLocalStorage(campaign)
}

/**
 * Gets the currently selected tab from localStorage.
 *
 * @returns Selected Tab or null if none is selected
 */
export function getSelectedTab(): string | null {
  const campaign = getCampaign()

  return campaign.selectedTab || null
}

/**
 * Sets the currently selected tab in localStorage.
 *
 * @param tab Tab to select, or null to clear selection
 */
export function setSelectedTab(tab: string | null): void {
  const campaign = getCampaign()

  campaign.selectedTab = tab || undefined

  saveCampaignToLocalStorage(campaign)
}

/**
 * Gets the currently active hunt from localStorage.
 *
 * @returns Active Hunt or null if no settlement is selected or hunt is not
 */
export function getSelectedActiveHunt(): ActiveHunt | null {
  const campaign = getCampaign()

  // If no settlement is selected, return null
  if (!campaign.selectedSettlementId) return null

  const settlement = campaign.settlements.find(
    (s) => s.id === campaign.selectedSettlementId
  )

  // If the settlement does not have an active hunt, return null
  if (!settlement || !settlement.hunt) return null

  // Get the full details of the survivors and scout involved in the hunt
  // based on the selected settlement ID
  const allSurvivors = getSurvivors(campaign.selectedSettlementId)

  const survivors = allSurvivors.filter((survivor) =>
    settlement.hunt?.survivors.includes(survivor.id)
  )
  const scout = allSurvivors.find(
    (survivor) => settlement.hunt?.scout === survivor.id
  )

  return {
    quarryName: settlement.hunt.quarryName,
    quarryLevel: settlement.hunt.quarryLevel,
    survivors: survivors,
    scout: scout,
    survivorPosition: settlement.hunt.survivorPosition,
    quarryPosition: settlement.hunt.quarryPosition,
    ambush: settlement.hunt.ambush || false
  }
}

/**
 * Calculates the current timeline year for a settlement.
 *
 * This is calculated as the last completed timeline entry plus one.
 *
 * @param timeline Timeline
 * @returns Current Year
 */
export function getCurrentYear(timeline: TimelineYear[]): number {
  return timeline.filter((entry) => entry.completed).length + 1
}

/**
 * Checks if the settlement has innovated the Encourage action.
 *
 * @param settlementId Settlement ID
 * @returns True if the settlement has the Language innovation.
 */
export function canEncourage(settlementId: number): boolean {
  const settlement = getCampaign().settlements.find(
    (settlement) => settlement.id === settlementId
  )

  if (!settlement) return false

  return (
    settlement.innovations.find((innovation) =>
      innovation.toLowerCase().includes('language')
    ) !== undefined
  )
}

/**
 * Checks if the settlement has innovated the Surge action.
 *
 * @param settlementId Settlement ID
 * @returns True if the settlement has the Inner Lantern innovation.
 */
export function canSurge(settlementId: number): boolean {
  const settlement = getCampaign().settlements.find(
    (settlement) => settlement.id === settlementId
  )

  if (!settlement) return false

  return (
    settlement.innovations.find((innovation) =>
      innovation.toLowerCase().includes('inner lantern')
    ) !== undefined
  )
}

/**
 * Checks if the settlement has innovated the Dash action.
 *
 * @param settlementId Settlement ID
 * @returns True if the settlement has the Paint innovation.
 */
export function canDash(settlementId: number): boolean {
  const settlement = getCampaign().settlements.find(
    (settlement) => settlement.id === settlementId
  )

  if (!settlement) return false

  return (
    settlement.innovations.find(
      (innovation) => innovation.toLowerCase() === 'paint'
    ) !== undefined
  )
}

/**
 * Checks if the settlement has innovated the Fist Pump action.
 *
 * @param settlementId Settlement ID
 * @returns True if the settlement has silent dialect innovation.
 */
export function canFistPump(settlementId: number): boolean {
  const settlement = getCampaign().settlements.find(
    (settlement) => settlement.id === settlementId
  )

  if (!settlement) return false

  return (
    settlement.innovations.find((innovation) =>
      innovation.toLowerCase().includes('silent dialect')
    ) !== undefined
  )
}

/**
 * Checks if the settlement has innovated the Endure action.
 *
 * @param settlementId Settlement ID
 * @returns True if the settlement has innovated the Endure action.
 */
export function canEndure(settlementId: number): boolean {
  const settlement = getCampaign().settlements.find(
    (settlement) => settlement.id === settlementId
  )
  // TODO
  console.log('canEndure', settlementId, settlement)

  return false
}

/**
 * Checks if new survivors are born with +1 understanding.
 *
 * @param settlementId Settlement ID
 * @returns True if the settlement has the Graves innovation.
 */
export function bornWithUnderstanding(settlementId: number): boolean {
  const settlement = getCampaign().settlements.find(
    (settlement) => settlement.id === settlementId
  )

  if (!settlement) return false

  return (
    settlement.innovations.find((innovation) =>
      innovation.toLowerCase().includes('graves')
    ) !== undefined
  )
}

/**
 * Returns the campaign data based on the campaign type.
 *
 * @param campaignType Campaign Type
 * @returns Campaign Data
 */
export function getCampaignData(campaignType: CampaignType) {
  const campaignData: CampaignData =
    campaignType === CampaignType.PEOPLE_OF_THE_LANTERN
      ? PeopleOfTheLanternCampaignData
      : campaignType === CampaignType.PEOPLE_OF_THE_DREAM_KEEPER
        ? PeopleOfTheDreamKeeperCampaignData
        : campaignType === CampaignType.PEOPLE_OF_THE_STARS
          ? PeopleOfTheStarsCampaignData
          : campaignType === CampaignType.PEOPLE_OF_THE_SUN
            ? PeopleOfTheSunCampaignData
            : campaignType === CampaignType.SQUIRES_OF_THE_CITADEL
              ? SquiresOfTheCitadelCampaignData
              : CustomCampaignData

  return campaignData
}

/**
 * Saves a survivor's data to localStorage, with Zod validation and toast
 * feedback.
 *
 * @param fieldName Field Name
 * @param value Field Value
 * @param successMsg Success Message
 * @param onUpdate Optional callback to execute after successful update
 */
export function saveSurvivorToLocalStorage(
  form: UseFormReturn<Survivor>,
  fieldName: keyof Survivor,
  value: string | number,
  successMsg?: string,
  onUpdate?: () => void
): string | number | void {
  try {
    const formValues = form.getValues()
    const campaign = getCampaign()
    const survivorIndex = campaign.survivors.findIndex(
      (s: { id: number }) => s.id === formValues.id
    )

    if (survivorIndex !== -1) {
      try {
        SurvivorSchema.shape[fieldName].parse(value)
      } catch (error) {
        if (error instanceof ZodError && error.errors[0]?.message)
          return toast.error(error.errors[0].message)
        else
          return toast.error(
            'The darkness swallows your words. Please try again.'
          )
      }

      // Update campaign with the updated survivor
      saveCampaignToLocalStorage({
        ...campaign,
        survivors: campaign.survivors.map((s) =>
          s.id === formValues.id
            ? {
                ...s,
                [fieldName]: value
              }
            : s
        )
      })

      if (successMsg) toast.success(successMsg)

      // Call the update callback if provided
      if (onUpdate) onUpdate()
    }
  } catch (error) {
    console.error(`[${fieldName}] Save Error:`, error)
    toast.error('The darkness swallows your words. Please try again.')
  }
}
