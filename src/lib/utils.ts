'use client'

import {
  CustomCampaignData,
  PeopleOfTheDreamKeeperCampaignData,
  PeopleOfTheLanternCampaignData,
  PeopleOfTheStarsCampaignData,
  PeopleOfTheSunCampaignData,
  SquiresOfTheCitadelCampaignData
} from '@/lib/common'
import { CampaignType, ColorChoice } from '@/lib/enums'
import type { CampaignData } from '@/lib/types'
import { Campaign } from '@/schemas/campaign'
import { Hunt } from '@/schemas/hunt'
import { Settlement, TimelineYear } from '@/schemas/settlement'
import { Showdown } from '@/schemas/showdown'
import { Survivor } from '@/schemas/survivor'
import { clsx, type ClassValue } from 'clsx'
import { CSSProperties } from 'react'
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
export function invalidateCampaignCache() {
  cachedCampaign = null
  lastCacheUpdate = 0
}

/**
 * Save Campaign to Local Storage
 *
 * @param campaign Campaign Data
 */
export function saveCampaignToLocalStorage(campaign: Campaign) {
  localStorage.setItem('campaign', JSON.stringify(campaign))
  invalidateCampaignCache()

  // Dispatch custom event to notify components of campaign changes
  window.dispatchEvent(new CustomEvent('campaignUpdated'))
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
export function setSelectedSettlement(settlementId: number | null) {
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
export function setSelectedSurvivor(survivorId: number | null) {
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
export function setSelectedTab(tab: string | null) {
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
export function setSelectedHunt(huntId: number | null) {
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
export function setSelectedShowdown(showdownId: number | null) {
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
 * This is true if the settlement has the Destiny innovation.
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

  if (!settlement) return false

  return (
    settlement.innovations.find((innovation) =>
      innovation.toLowerCase().includes('destiny')
    ) !== undefined
  )
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

/**
 * Get Color Style for Display
 */
export function getColorStyle(
  color: ColorChoice,
  type: 'bg' | 'border' | 'border-hover' | 'header' = 'bg'
): string {
  const colorMap: Record<ColorChoice, Record<string, string>> = {
    [ColorChoice.NEUTRAL]: {
      bg: 'bg-neutral-500',
      border: 'border-neutral-300/50',
      'border-hover': 'border-neutral-400/70',
      header: 'bg-neutral-100/30 border-neutral-300/40'
    },
    [ColorChoice.STONE]: {
      bg: 'bg-stone-500',
      border: 'border-stone-300/50',
      'border-hover': 'border-stone-400/70',
      header: 'bg-stone-100/30 border-stone-300/40'
    },
    [ColorChoice.ZINC]: {
      bg: 'bg-zinc-500',
      border: 'border-zinc-300/50',
      'border-hover': 'border-zinc-400/70',
      header: 'bg-zinc-100/30 border-zinc-300/40'
    },
    [ColorChoice.SLATE]: {
      bg: 'bg-slate-500',
      border: 'border-slate-300/50',
      'border-hover': 'border-slate-400/70',
      header: 'bg-slate-100/30 border-slate-300/40'
    },
    [ColorChoice.GRAY]: {
      bg: 'bg-gray-500',
      border: 'border-gray-300/50',
      'border-hover': 'border-gray-400/70',
      header: 'bg-gray-100/30 border-gray-300/40'
    },
    [ColorChoice.RED]: {
      bg: 'bg-red-500',
      border: 'border-red-300/50',
      'border-hover': 'border-red-400/70',
      header: 'bg-red-100/30 border-red-300/40'
    },
    [ColorChoice.ORANGE]: {
      bg: 'bg-orange-500',
      border: 'border-orange-300/50',
      'border-hover': 'border-orange-400/70',
      header: 'bg-orange-100/30 border-orange-300/40'
    },
    [ColorChoice.AMBER]: {
      bg: 'bg-amber-500',
      border: 'border-amber-300/50',
      'border-hover': 'border-amber-400/70',
      header: 'bg-amber-100/30 border-amber-300/40'
    },
    [ColorChoice.YELLOW]: {
      bg: 'bg-yellow-500',
      border: 'border-yellow-300/50',
      'border-hover': 'border-yellow-400/70',
      header: 'bg-yellow-100/30 border-yellow-300/40'
    },
    [ColorChoice.LIME]: {
      bg: 'bg-lime-500',
      border: 'border-lime-300/50',
      'border-hover': 'border-lime-400/70',
      header: 'bg-lime-100/30 border-lime-300/40'
    },
    [ColorChoice.GREEN]: {
      bg: 'bg-green-500',
      border: 'border-green-300/50',
      'border-hover': 'border-green-400/70',
      header: 'bg-green-100/30 border-green-300/40'
    },
    [ColorChoice.EMERALD]: {
      bg: 'bg-emerald-500',
      border: 'border-emerald-300/50',
      'border-hover': 'border-emerald-400/70',
      header: 'bg-emerald-100/30 border-emerald-300/40'
    },
    [ColorChoice.TEAL]: {
      bg: 'bg-teal-500',
      border: 'border-teal-300/50',
      'border-hover': 'border-teal-400/70',
      header: 'bg-teal-100/30 border-teal-300/40'
    },
    [ColorChoice.CYAN]: {
      bg: 'bg-cyan-500',
      border: 'border-cyan-300/50',
      'border-hover': 'border-cyan-400/70',
      header: 'bg-cyan-100/30 border-cyan-300/40'
    },
    [ColorChoice.SKY]: {
      bg: 'bg-sky-500',
      border: 'border-sky-300/50',
      'border-hover': 'border-sky-400/70',
      header: 'bg-sky-100/30 border-sky-300/40'
    },
    [ColorChoice.BLUE]: {
      bg: 'bg-blue-500',
      border: 'border-blue-300/50',
      'border-hover': 'border-blue-400/70',
      header: 'bg-blue-100/30 border-blue-300/40'
    },
    [ColorChoice.INDIGO]: {
      bg: 'bg-indigo-500',
      border: 'border-indigo-300/50',
      'border-hover': 'border-indigo-400/70',
      header: 'bg-indigo-100/30 border-indigo-300/40'
    },
    [ColorChoice.VIOLET]: {
      bg: 'bg-violet-500',
      border: 'border-violet-300/50',
      'border-hover': 'border-violet-400/70',
      header: 'bg-violet-100/30 border-violet-300/40'
    },
    [ColorChoice.PURPLE]: {
      bg: 'bg-purple-500',
      border: 'border-purple-300/50',
      'border-hover': 'border-purple-400/70',
      header: 'bg-purple-100/30 border-purple-300/40'
    },
    [ColorChoice.FUCHSIA]: {
      bg: 'bg-fuchsia-500',
      border: 'border-fuchsia-300/50',
      'border-hover': 'border-fuchsia-400/70',
      header: 'bg-fuchsia-100/30 border-fuchsia-300/40'
    },
    [ColorChoice.PINK]: {
      bg: 'bg-pink-500',
      border: 'border-pink-300/50',
      'border-hover': 'border-pink-400/70',
      header: 'bg-pink-100/30 border-pink-300/40'
    },
    [ColorChoice.ROSE]: {
      bg: 'bg-rose-500',
      border: 'border-rose-300/50',
      'border-hover': 'border-rose-400/70',
      header: 'bg-rose-100/30 border-rose-300/40'
    }
  }

  return (
    colorMap[color]?.[type] ||
    colorMap[ColorChoice.SLATE][type] ||
    'bg-slate-500'
  )
}

/**
 * Get Color-specific CSS Variables for a Card
 *
 * @param color Color Choice
 * @returns CSS Properties for Card Colors
 */
export function getCardColorStyles(color: ColorChoice): CSSProperties {
  const colorMap: Record<
    ColorChoice,
    { border: string; borderHover: string; header: string }
  > = {
    [ColorChoice.NEUTRAL]: {
      border: 'rgb(163 163 163 / 0.5)',
      borderHover: 'rgb(163 163 163 / 0.7)',
      header: 'rgb(245 245 245 / 0.3)'
    },
    [ColorChoice.STONE]: {
      border: 'rgb(168 162 158 / 0.5)',
      borderHover: 'rgb(168 162 158 / 0.7)',
      header: 'rgb(245 245 244 / 0.3)'
    },
    [ColorChoice.ZINC]: {
      border: 'rgb(161 161 170 / 0.5)',
      borderHover: 'rgb(161 161 170 / 0.7)',
      header: 'rgb(244 244 245 / 0.3)'
    },
    [ColorChoice.SLATE]: {
      border: 'rgb(148 163 184 / 0.5)',
      borderHover: 'rgb(148 163 184 / 0.7)',
      header: 'rgb(241 245 249 / 0.3)'
    },
    [ColorChoice.GRAY]: {
      border: 'rgb(156 163 175 / 0.5)',
      borderHover: 'rgb(156 163 175 / 0.7)',
      header: 'rgb(243 244 246 / 0.3)'
    },
    [ColorChoice.RED]: {
      border: 'rgb(252 165 165 / 0.5)',
      borderHover: 'rgb(248 113 113 / 0.7)',
      header: 'rgb(254 226 226 / 0.3)'
    },
    [ColorChoice.ORANGE]: {
      border: 'rgb(253 186 116 / 0.5)',
      borderHover: 'rgb(251 146 60 / 0.7)',
      header: 'rgb(255 237 213 / 0.3)'
    },
    [ColorChoice.AMBER]: {
      border: 'rgb(252 211 77 / 0.5)',
      borderHover: 'rgb(245 158 11 / 0.7)',
      header: 'rgb(254 243 199 / 0.3)'
    },
    [ColorChoice.YELLOW]: {
      border: 'rgb(254 240 138 / 0.5)',
      borderHover: 'rgb(250 204 21 / 0.7)',
      header: 'rgb(254 249 195 / 0.3)'
    },
    [ColorChoice.LIME]: {
      border: 'rgb(190 242 100 / 0.5)',
      borderHover: 'rgb(163 230 53 / 0.7)',
      header: 'rgb(236 252 203 / 0.3)'
    },
    [ColorChoice.GREEN]: {
      border: 'rgb(134 239 172 / 0.5)',
      borderHover: 'rgb(74 222 128 / 0.7)',
      header: 'rgb(220 252 231 / 0.3)'
    },
    [ColorChoice.EMERALD]: {
      border: 'rgb(110 231 183 / 0.5)',
      borderHover: 'rgb(52 211 153 / 0.7)',
      header: 'rgb(209 250 229 / 0.3)'
    },
    [ColorChoice.TEAL]: {
      border: 'rgb(94 234 212 / 0.5)',
      borderHover: 'rgb(45 212 191 / 0.7)',
      header: 'rgb(204 251 241 / 0.3)'
    },
    [ColorChoice.CYAN]: {
      border: 'rgb(103 232 249 / 0.5)',
      borderHover: 'rgb(34 211 238 / 0.7)',
      header: 'rgb(207 250 254 / 0.3)'
    },
    [ColorChoice.SKY]: {
      border: 'rgb(125 211 252 / 0.5)',
      borderHover: 'rgb(56 189 248 / 0.7)',
      header: 'rgb(224 242 254 / 0.3)'
    },
    [ColorChoice.BLUE]: {
      border: 'rgb(147 197 253 / 0.5)',
      borderHover: 'rgb(96 165 250 / 0.7)',
      header: 'rgb(219 234 254 / 0.3)'
    },
    [ColorChoice.INDIGO]: {
      border: 'rgb(165 180 252 / 0.5)',
      borderHover: 'rgb(129 140 248 / 0.7)',
      header: 'rgb(224 231 255 / 0.3)'
    },
    [ColorChoice.VIOLET]: {
      border: 'rgb(196 181 253 / 0.5)',
      borderHover: 'rgb(167 139 250 / 0.7)',
      header: 'rgb(237 233 254 / 0.3)'
    },
    [ColorChoice.PURPLE]: {
      border: 'rgb(196 181 253 / 0.5)',
      borderHover: 'rgb(167 139 250 / 0.7)',
      header: 'rgb(243 232 255 / 0.3)'
    },
    [ColorChoice.FUCHSIA]: {
      border: 'rgb(240 171 252 / 0.5)',
      borderHover: 'rgb(232 121 249 / 0.7)',
      header: 'rgb(253 244 255 / 0.3)'
    },
    [ColorChoice.PINK]: {
      border: 'rgb(244 164 196 / 0.5)',
      borderHover: 'rgb(236 72 153 / 0.7)',
      header: 'rgb(252 231 243 / 0.3)'
    },
    [ColorChoice.ROSE]: {
      border: 'rgb(251 113 133 / 0.5)',
      borderHover: 'rgb(244 63 94 / 0.7)',
      header: 'rgb(255 228 230 / 0.3)'
    }
  }

  const colors = colorMap[color] || colorMap[ColorChoice.SLATE]
  return {
    '--card-border-color': colors.border,
    '--card-border-hover-color': colors.borderHover,
    '--card-header-bg': colors.header
  } as CSSProperties
}
