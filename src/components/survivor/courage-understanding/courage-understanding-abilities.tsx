'use client'

import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { SURVIVOR_COURAGE_UNDERSTANDING_ABILITY_UPDATED_MESSAGE } from '@/lib/messages'
import { Survivor } from '@/schemas/survivor'
import { ReactElement } from 'react'

/**
 * Courage Understanding Card Properties
 */
interface CourageUnderstandingAbilitiesProps {
  /** Save Selected Survivor */
  saveSelectedSurvivor: (data: Partial<Survivor>, successMsg?: string) => void
  /** Selected Survivor */
  selectedSurvivor: Partial<Survivor> | null
}

/**
 * Courage/Understanding Abilities Component
 *
 * Displays the abilities that a survivor has based on their courage and
 * understanding.
 *
 * @param props Courage Understanding Abilities Properties
 * @returns Courage/Understanding Abilities Component
 */
export function CourageUnderstandingAbilities({
  saveSelectedSurvivor,
  selectedSurvivor
}: CourageUnderstandingAbilitiesProps): ReactElement {
  /**
   * Handles the change of the ability in the courage group.
   *
   * @param value Value
   */
  const handleCourageGroupChange = (
    value: 'stalwart' | 'prepared' | 'matchmaker'
  ) =>
    saveSelectedSurvivor(
      {
        hasStalwart: value === 'stalwart',
        hasPrepared: value === 'prepared',
        hasMatchmaker: value === 'matchmaker'
      },
      SURVIVOR_COURAGE_UNDERSTANDING_ABILITY_UPDATED_MESSAGE()
    )

  /**
   * Handles the change of the ability in the understanding group.
   *
   * @param value Value
   */
  const handleUnderstandingGroupChange = (
    value: 'analyze' | 'explore' | 'tinker'
  ) =>
    saveSelectedSurvivor(
      {
        hasAnalyze: value === 'analyze',
        hasExplore: value === 'explore',
        hasTinker: value === 'tinker'
      },
      SURVIVOR_COURAGE_UNDERSTANDING_ABILITY_UPDATED_MESSAGE()
    )

  // Ability descriptions
  const courageAbilities = {
    stalwart: "Can't be knocked down by brain trauma or intimidate.",
    prepared: 'Add Hunt XP to your roll when determining a straggler.',
    matchmaker: 'Spend 1 endeavour to trigger Intimacy story event.'
  }

  const understandingAbilities = {
    analyze: 'Look at the top AI card and return it to the top of the deck.',
    explore: 'Add +2 to your Investigate roll results.',
    tinker: '+1 endeavour when a returning survivor.'
  }

  return (
    <div className="mx-2">
      {/* Desktop Layout - Radio Groups */}
      <div className="hidden lg:flex flex-row items-start justify-between">
        {/* Courage Abilities */}
        <div className="flex flex-col w-[45%]">
          <RadioGroup
            value={
              selectedSurvivor?.hasStalwart
                ? 'stalwart'
                : selectedSurvivor?.hasPrepared
                  ? 'prepared'
                  : selectedSurvivor?.hasMatchmaker
                    ? 'matchmaker'
                    : ''
            }
            onValueChange={handleCourageGroupChange}>
            <div className="flex gap-2 text-xs">
              <RadioGroupItem value="stalwart" id="stalwart" />
              <div>
                <strong>Stalwart:</strong> {courageAbilities.stalwart}
              </div>
            </div>
            <hr className="mt-0 mb-0" />
            <div className="flex gap-2 text-xs">
              <RadioGroupItem value="prepared" id="prepared" />
              <div>
                <strong>Prepared:</strong> {courageAbilities.prepared}
              </div>
            </div>
            <hr />
            <div className="flex gap-2 text-xs">
              <RadioGroupItem value="matchmaker" id="matchmaker" />
              <div>
                <strong>Matchmaker:</strong> {courageAbilities.matchmaker}
              </div>
            </div>
          </RadioGroup>
        </div>

        {/* Vertical Divider */}
        <div className="h-36 w-px bg-gray-800" />

        <div className="flex flex-col w-[45%]">
          <RadioGroup
            value={
              selectedSurvivor?.hasAnalyze
                ? 'analyze'
                : selectedSurvivor?.hasExplore
                  ? 'explore'
                  : selectedSurvivor?.hasTinker
                    ? 'tinker'
                    : ''
            }
            onValueChange={handleUnderstandingGroupChange}>
            <div className="flex gap-2 text-xs">
              <RadioGroupItem value="analyze" id="analyze" />
              <div>
                <strong>Analyze:</strong> {understandingAbilities.analyze}
              </div>
            </div>
            <hr />
            <div className="flex gap-2 text-xs">
              <RadioGroupItem value="explore" id="explore" />
              <div>
                <strong>Explore:</strong> {understandingAbilities.explore}
              </div>
            </div>
            <hr />
            <div className="flex gap-2 text-xs">
              <RadioGroupItem value="tinker" id="tinker" />
              <div>
                <strong>Tinker:</strong> {understandingAbilities.tinker}
              </div>
            </div>
          </RadioGroup>
        </div>
      </div>

      {/* Mobile Layout - Select Dropdowns */}
      <div className="lg:hidden flex flex-col gap-4">
        {/* Courage Abilities */}
        <div className="flex flex-col gap-2">
          <label className="font-bold text-sm">Courage Ability</label>
          <Select
            value={
              selectedSurvivor?.hasStalwart
                ? 'stalwart'
                : selectedSurvivor?.hasPrepared
                  ? 'prepared'
                  : selectedSurvivor?.hasMatchmaker
                    ? 'matchmaker'
                    : ''
            }
            onValueChange={handleCourageGroupChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a courage ability" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="stalwart">Stalwart</SelectItem>
              <SelectItem value="prepared">Prepared</SelectItem>
              <SelectItem value="matchmaker">Matchmaker</SelectItem>
            </SelectContent>
          </Select>
          {(selectedSurvivor?.hasStalwart
            ? 'stalwart'
            : selectedSurvivor?.hasPrepared
              ? 'prepared'
              : selectedSurvivor?.hasMatchmaker
                ? 'matchmaker'
                : '') && (
            <div className="text-xs p-2 rounded border">
              {
                courageAbilities[
                  selectedSurvivor?.hasStalwart
                    ? 'stalwart'
                    : selectedSurvivor?.hasPrepared
                      ? 'prepared'
                      : selectedSurvivor?.hasMatchmaker
                        ? 'matchmaker'
                        : ('' as keyof typeof courageAbilities)
                ]
              }
            </div>
          )}
        </div>

        {/* Understanding Abilities */}
        <div className="flex flex-col gap-2">
          <label className="font-bold text-sm">Understanding Ability</label>
          <Select
            value={
              selectedSurvivor?.hasAnalyze
                ? 'analyze'
                : selectedSurvivor?.hasExplore
                  ? 'explore'
                  : selectedSurvivor?.hasTinker
                    ? 'tinker'
                    : ''
            }
            onValueChange={handleUnderstandingGroupChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select an understanding ability" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="analyze">Analyze</SelectItem>
              <SelectItem value="explore">Explore</SelectItem>
              <SelectItem value="tinker">Tinker</SelectItem>
            </SelectContent>
          </Select>
          {(selectedSurvivor?.hasAnalyze
            ? 'analyze'
            : selectedSurvivor?.hasExplore
              ? 'explore'
              : selectedSurvivor?.hasTinker
                ? 'tinker'
                : '') && (
            <div className="text-xs p-2 rounded border">
              {
                understandingAbilities[
                  selectedSurvivor?.hasAnalyze
                    ? 'analyze'
                    : selectedSurvivor?.hasExplore
                      ? 'explore'
                      : selectedSurvivor?.hasTinker
                        ? 'tinker'
                        : ('' as keyof typeof understandingAbilities)
                ]
              }
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
