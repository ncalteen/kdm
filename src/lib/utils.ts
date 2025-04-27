'use client'

import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { Campaign } from './types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Gets the current campaign type from localStorage.
 *
 * @returns The current campaign type from localStorage.
 */
export function getCampaign(): Campaign | undefined {
  const campaign = localStorage.getItem('campaign')

  if (!campaign) return undefined
  else return JSON.parse(campaign)
}

/**
 * Gets the next survivor ID based on the existing survivors in localStorage.
 *
 * @returns The next survivor ID based on the existing survivors.
 */
export function getNextSurvivorId(): number {
  const survivors = JSON.parse(
    window.localStorage.getItem('survivors') || '[]'
  ) as {
    id: number
  }[]

  if (survivors.length === 0) return 1

  return Math.max(...survivors.map((survivor) => survivor.id)) + 1
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
