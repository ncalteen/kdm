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
import { Campaign } from '@/schemas/campaign'
import { Hunt } from '@/schemas/hunt'
import { Settlement, TimelineYear } from '@/schemas/settlement'
import { Showdown } from '@/schemas/showdown'
import { Survivor } from '@/schemas/survivor'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

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
 * Get Cached Campaign from Local Storage
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
        hunts: [],
        selectedHuntId: undefined,
        selectedShowdownId: undefined,
        selectedSettlementId: undefined,
        selectedSurvivorId: undefined,
        selectedTab: undefined,
        settlements: [],
        showdowns: [],
        survivors: []
      })
  )

  // Ensure backwards compatibility for existing campaign data
  const needsReload =
    !('hunts' in storedCampaign) ||
    !('selectedHuntId' in storedCampaign) ||
    !('selectedSettlementId' in storedCampaign) ||
    !('selectedShowdownId' in storedCampaign) ||
    !('selectedSurvivorId' in storedCampaign) ||
    !('selectedTab' in storedCampaign) ||
    !('settlements' in storedCampaign) ||
    !('survivors' in storedCampaign) ||
    !('showdowns' in storedCampaign)

  const campaign: Campaign = {
    hunts: storedCampaign.hunts || [],
    selectedHuntId: storedCampaign.selectedHuntId || null,
    selectedShowdownId: storedCampaign.selectedShowdownId || null,
    selectedSettlementId: storedCampaign.selectedSettlementId || null,
    selectedSurvivorId: storedCampaign.selectedSurvivorId || null,
    selectedTab: storedCampaign.selectedTab || null,
    settlements: storedCampaign.settlements || [],
    survivors: storedCampaign.survivors || [],
    showdowns: storedCampaign.showdowns || []
  }

  // Save the campaign back to localStorage
  if (needsReload) localStorage.setItem('campaign', JSON.stringify(campaign))

  cachedCampaign = campaign
  lastCacheUpdate = now

  return campaign
}

/**
 * Invalidate Cached Campaign
 */
export function invalidateCampaignCache(): void {
  cachedCampaign = null
  lastCacheUpdate = 0
}

/**
 * Save Campaign to Local Storage
 *
 * @param campaign Campaign Data
 */
export function saveCampaignToLocalStorage(campaign: Campaign): void {
  localStorage.setItem('campaign', JSON.stringify(campaign))
  invalidateCampaignCache()
}

/**
 * Calculate Next Settlement ID
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
 * Calculate Next Survivor ID
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
 * Calculate Next Hunt ID
 *
 * @returns Next Hunt ID
 */
export function getNextHuntId(): number {
  const campaign = getCampaign()

  if (!campaign.hunts) return 1

  return campaign.hunts.length === 0
    ? 1
    : Math.max(...campaign.hunts.map((hunt) => hunt.id)) + 1
}

/**
 * Calculate Next Showdown ID
 *
 * @returns Next Showdown ID
 */
export function getNextShowdownId(): number {
  const campaign = getCampaign()

  if (!campaign.showdowns) return 1

  return campaign.showdowns.length === 0
    ? 1
    : Math.max(...campaign.showdowns.map((showdown) => showdown.id)) + 1
}

/**
 * Get Lost Settlement Count
 *
 * @returns Lost Settlement Count
 */
export function getLostSettlementCount(): number {
  return getCampaign().settlements.filter(
    (settlement) =>
      settlement.milestones.filter(
        (m) => m.complete && m.name === 'Population reaches 0'
      ).length > 0
  ).length
}

/**
 * Get Survivors from Local Storage
 *
 * If a settlement ID is provided, it filters survivors by that settlement.
 *
 * @param settlementId Settlement ID
 * @returns Survivors
 */
export function getSurvivors(settlementId?: number): Survivor[] {
  return settlementId
    ? getCampaign().survivors.filter(
        (survivor) => survivor.settlementId === settlementId
      )
    : getCampaign().survivors
}

/**
 * Get a Survivor by ID from Local Storage
 *
 * @param survivorId Survivor ID
 * @returns Survivor
 */
export function getSurvivor(survivorId: number): Survivor | null {
  return (
    getCampaign().survivors.find((survivor) => survivor.id === survivorId) ||
    null
  )
}

/**
 * Get a Settlement by ID from Local Storage
 *
 * @param settlementId Settlement ID
 * @returns Settlement
 */
export function getSettlement(settlementId: number): Settlement | null {
  return (
    getCampaign().settlements.find(
      (settlement) => settlement.id === settlementId
    ) || null
  )
}

/**
 * Get Selected Settlement from Local Storage
 *
 * @returns Selected Settlement
 */
export function getSelectedSettlement(): Settlement | null {
  const campaign = getCampaign()

  if (!campaign.selectedSettlementId) return null

  return (
    campaign.settlements.find((s) => s.id === campaign.selectedSettlementId) ||
    null
  )
}

/**
 * Set Selected Settlement in Local Storage
 *
 * @param settlementId Settlement ID
 */
export function setSelectedSettlement(settlementId: number | null): void {
  const campaign = getCampaign()

  campaign.selectedSettlementId = settlementId || undefined

  saveCampaignToLocalStorage(campaign)
}

/**
 * Get Selected Survivor from Local Storage
 *
 * @returns Selected Survivor
 */
export function getSelectedSurvivor(): Survivor | null {
  const campaign = getCampaign()

  if (!campaign.selectedSurvivorId) return null

  return (
    campaign.survivors.find((s) => s.id === campaign.selectedSurvivorId) || null
  )
}

/**
 * Set Selected Survivor in Local Storage
 *
 * @param survivorId Survivor ID
 */
export function setSelectedSurvivor(survivorId: number | null): void {
  const campaign = getCampaign()

  campaign.selectedSurvivorId = survivorId || undefined

  saveCampaignToLocalStorage(campaign)
}

/**
 * Get Selected Tab from Local Storage
 *
 * @returns Selected Tab
 */
export function getSelectedTab(): string | null {
  return getCampaign().selectedTab || null
}

/**
 * Set Selected Tab in Local Storage
 *
 * @param tab Tab Name
 */
export function setSelectedTab(tab: string | null): void {
  const campaign = getCampaign()

  campaign.selectedTab = tab || undefined

  saveCampaignToLocalStorage(campaign)
}

/**
 * Get Selected Hunt from Local Storage
 *
 * @returns Selected Hunt
 */
export function getSelectedHunt(): Hunt | null {
  const campaign = getCampaign()

  if (!campaign.selectedHuntId) return null

  return campaign.hunts?.find((h) => h.id === campaign.selectedHuntId) || null
}

/**
 * Set Selected Hunt in Local Storage
 *
 * @param huntId Hunt ID
 */
export function setSelectedHunt(huntId: number | null): void {
  const campaign = getCampaign()

  campaign.selectedHuntId = huntId || undefined

  saveCampaignToLocalStorage(campaign)
}

/**
 * Get Selected Showdown from Local Storage
 *
 * @returns Selected Showdown
 */
export function getSelectedShowdown(): Showdown | null {
  const campaign = getCampaign()

  if (!campaign.selectedShowdownId) return null

  return (
    campaign.showdowns?.find((h) => h.id === campaign.selectedShowdownId) ||
    null
  )
}

/**
 * Set Selected Showdown in Local Storage
 *
 * @param showdownId Showdown ID
 */
export function setSelectedShowdown(showdownId: number | null): void {
  const campaign = getCampaign()

  campaign.selectedShowdownId = showdownId || undefined

  saveCampaignToLocalStorage(campaign)
}

/**
 * Calculate Current Timeline Year
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
 * Check if Settlement Can Encourage
 *
 * This is true if the settlement has the Language innovation.
 *
 * @param settlementId Settlement ID
 * @returns Settlement Can Encourage
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
 * Check if Settlement Can Surge
 *
 * This is true if the settlement has the Inner Lantern innovation.
 *
 * @param settlementId Settlement ID
 * @returns Settlement Can Surge
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
 * Check if Settlement Can Dash
 *
 * This is true if the settlement has the Paint innovation.
 *
 * @param settlementId Settlement ID
 * @returns Settlement Can Dash
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
 * Check if Settlement Can Fist Pump
 *
 * This is true if the settlement has the Silent Dialect innovation.
 *
 * @param settlementId Settlement ID
 * @returns Settlement Can Fist Pump
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
 * Check if Settlement Can Endure
 *
 * @todo Not implemented yet.
 *
 * @param settlementId Settlement ID
 * @returns Settlement Can Endure
 */
export function canEndure(settlementId: number): boolean {
  const settlement = getCampaign().settlements.find(
    (settlement) => settlement.id === settlementId
  )

  console.log('canEndure', settlementId, settlement)

  return false
}

/**
 * Check if Settlement Survivors are Born with Understanding
 *
 * This is true if the settlement has the Graves innovation.
 *
 * @param settlementId Settlement ID
 * @returns Settlement Survivors Born with Understanding
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
 * Get Campaign Data by Type
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
