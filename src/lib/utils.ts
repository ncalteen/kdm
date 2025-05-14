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
import type {
  Campaign,
  CampaignData,
  Settlement,
  Survivor,
  TimelineEvent
} from '@/lib/types'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Gets the user's campaign from localStorage.
 *
 * @returns Campaign
 */
export function getCampaign(): Campaign {
  return JSON.parse(
    localStorage.getItem('campaign') ||
      JSON.stringify({
        settlements: [],
        survivors: []
      })
  ) as Campaign
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
export function getSurvivors(settlementId: number): Survivor[] {
  return getCampaign().survivors.filter(
    (survivor) => survivor.settlementId === settlementId
  )
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
  ) as Settlement
}

/**
 * Calculates the current timeline year for a settlement.
 *
 * This is calculated as the last completed timeline entry plus one.
 *
 * @param timeline Timeline
 * @returns Current Year
 */
export function getCurrentYear(timeline: TimelineEvent[]): number {
  return timeline.filter((entry) => entry.completed).length + 1
}

/**
 * Checks if the settlement has innovated the Encourage action.
 *
 * @returns True if the settlement has the Language innovation.
 */
export function canEncourage(): boolean {
  const settlement = getCampaign().settlements.find(
    (settlement) => settlement.id === 1
  ) as Settlement

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
 * @returns True if the settlement has the Inner Lantern innovation.
 */
export function canSurge(): boolean {
  const settlement = getCampaign().settlements.find(
    (settlement) => settlement.id === 1
  ) as Settlement

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
 * @returns True if the settlement has the Paint innovation.
 */
export function canDash(): boolean {
  const settlement = getCampaign().settlements.find(
    (settlement) => settlement.id === 1
  ) as Settlement

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
 * @returns True if the settlement has silent dialect innovation.
 */
export function canFistPump(): boolean {
  const settlement = getCampaign().settlements.find(
    (settlement) => settlement.id === 1
  ) as Settlement

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
 * @returns True if the settlement has innovated the Endure action.
 */
export function canEndure(): boolean {
  // TODO
  return false
}

/**
 * Checks if new survivors are born with +1 understanding.
 *
 * @returns True if the settlement has the Graves innovation.
 */
export function bornWithUnderstanding(): boolean {
  const settlement = getCampaign().settlements.find(
    (settlement) => settlement.id === 1
  ) as Settlement

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
