'use client'

import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { Campaign, Settlement, Survivor } from './types.js'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Calculates the next settlement ID.
 *
 * @returns Next Settlement ID
 */
export function getNextSettlementId(): number {
  const campaign = JSON.parse(
    window.localStorage.getItem('campaign') ||
      JSON.stringify({
        settlements: [],
        survivors: []
      })
  ) as Campaign

  // If this is the first settlement, return 1.
  if (campaign.settlements.length === 0) return 1

  // Otherwise, return the latest settlement ID + 1.
  return (
    Math.max(...campaign.settlements.map((settlement) => settlement.id)) + 1
  )
}

/**
 * Calculates the next survivor ID.
 *
 * @returns Next Survivor ID
 */
export function getNextSurvivorId(): number {
  const campaign = JSON.parse(
    window.localStorage.getItem('campaign') ||
      JSON.stringify({
        settlements: [],
        survivors: []
      })
  ) as Campaign

  // If this is the first survivor, return 1.
  if (campaign.survivors.length === 0) return 1

  // Otherwise, return the latest survivor ID + 1.
  // This is done by getting the survivors from localStorage and finding the
  // maximum ID.
  return Math.max(...campaign.survivors.map((survivor) => survivor.id)) + 1
}

/**
 * Gets the number of lost settlements from localStorage.
 *
 * @returns Lost Settlement Count
 */
export function getLostSettlementCount(): number {
  const campaign = JSON.parse(
    window.localStorage.getItem('campaign') ||
      JSON.stringify({
        settlements: [],
        survivors: []
      })
  ) as Campaign

  // If the user is creating their first settlement, return 0.
  if (campaign.settlements.length === 0) return 0

  // Otherwise, return the number of lost settlements. This is determined by
  // counting the number of settlements that have the "Population reaches 0"
  // milestone completed.
  return campaign.settlements.filter(
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
  const campaign = JSON.parse(
    window.localStorage.getItem('campaign') ||
      JSON.stringify({
        settlements: [],
        survivors: []
      })
  ) as Campaign

  return campaign.survivors.filter(
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
  const campaign = JSON.parse(
    window.localStorage.getItem('campaign') ||
      JSON.stringify({
        settlements: [],
        survivors: []
      })
  ) as Campaign

  return campaign.settlements.find(
    (settlement) => settlement.id === settlementId
  ) as Settlement
}

/**
 * Checks if the settlement has innovated the Encourage action.
 *
 * @returns True if the settlement has innovated the Encourage action.
 */
export function canEncourage(): boolean {
  // TODO
  return false
}

/**
 * Checks if the settlement has innovated the Surge action.
 *
 * @returns True if the settlement has innovated the Surge action.
 */
export function canSurge(): boolean {
  // TODO
  return false
}

/**
 * Checks if the settlement has innovated the Dash action.
 *
 * @returns True if the settlement has innovated the Dash action.
 */
export function canDash(): boolean {
  // TODO
  return false
}

/**
 * Checks if the settlement has innovated the Fist Pump action.
 *
 * @returns True if the settlement has innovated the Fist Pump action.
 */
export function canFistPump(): boolean {
  // TODO
  return false
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
 * @returns True if new survivors are born with +1 understanding.
 */
export function bornWithUnderstanding(): boolean {
  // TODO
  return false
}
