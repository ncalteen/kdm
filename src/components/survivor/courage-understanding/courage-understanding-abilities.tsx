'use client'

import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Survivor } from '@/schemas/survivor'
import { ReactElement } from 'react'
import { UseFormReturn } from 'react-hook-form'

/**
 * Courage Understanding Card Props
 */
interface CourageUnderstandingAbilitiesProps {
  /** Survivor form instance */
  form: UseFormReturn<Survivor>
  /** Function to save survivor data */
  saveSurvivor: (data: Partial<Survivor>, successMsg?: string) => void
}

/**
 * Courage/Understanding Abilities Component
 *
 * Displays the abilities that a survivor has based on their courage and
 * understanding.
 *
 * @param form Form
 * @returns Courage/Understanding Abilities Component
 */
export function CourageUnderstandingAbilities({
  form,
  saveSurvivor
}: CourageUnderstandingAbilitiesProps): ReactElement {
  /**
   * Handles the change of the ability in the courage group.
   *
   * @param value Value
   */
  const handleCourageGroupChange = (
    value: 'stalwart' | 'prepared' | 'matchmaker'
  ) =>
    saveSurvivor(
      {
        hasStalwart: value === 'stalwart',
        hasPrepared: value === 'prepared',
        hasMatchmaker: value === 'matchmaker'
      },
      "The survivor's inner strength grows brighter."
    )

  /**
   * Handles the change of the ability in the understanding group.
   *
   * @param value Value
   */
  const handleUnderstandingGroupChange = (
    value: 'analyze' | 'explore' | 'tinker'
  ) =>
    saveSurvivor(
      {
        hasAnalyze: value === 'analyze',
        hasExplore: value === 'explore',
        hasTinker: value === 'tinker'
      },
      "The survivor's inner strength grows brighter."
    )

  const courageGroupValue = form.watch('hasStalwart')
    ? 'stalwart'
    : form.watch('hasPrepared')
      ? 'prepared'
      : form.watch('hasMatchmaker')
        ? 'matchmaker'
        : ''

  const understandingGroupValue = form.watch('hasAnalyze')
    ? 'analyze'
    : form.watch('hasExplore')
      ? 'explore'
      : form.watch('hasTinker')
        ? 'tinker'
        : ''

  return (
    <div className="flex flex-row items-start justify-between mx-2">
      {/* Courage Abilities */}
      <div className="flex flex-col w-[45%]">
        <RadioGroup
          value={courageGroupValue}
          onValueChange={handleCourageGroupChange}>
          <div className="flex gap-2 text-xs">
            <RadioGroupItem value="stalwart" id="stalwart" />
            <div>
              <strong>Stalwart:</strong> Can&apos;t be knocked down by brain
              trauma or intimidate.
            </div>
          </div>
          <hr className="mt-0 mb-0" />
          <div className="flex gap-2 text-xs">
            <RadioGroupItem value="prepared" id="prepared" />
            <div>
              <strong>Prepared:</strong> Add Hunt XP to your roll when
              determining a straggler.
            </div>
          </div>
          <hr />
          <div className="flex gap-2 text-xs">
            <RadioGroupItem value="matchmaker" id="matchmaker" />
            <div>
              <strong>Matchmaker:</strong> Spend 1 endeavour to trigger Intimacy
              story event.
            </div>
          </div>
        </RadioGroup>
      </div>

      {/* Vertical Divider */}
      <div className="h-36 w-px bg-gray-800" />

      <div className="flex flex-col w-[45%]">
        <RadioGroup
          value={understandingGroupValue}
          onValueChange={handleUnderstandingGroupChange}>
          <div className="flex gap-2 text-xs">
            <RadioGroupItem value="analyze" id="analyze" />
            <div>
              <strong>Analyze:</strong> Look at the top AI card and return it to
              the top of the deck.
            </div>
          </div>
          <hr />
          <div className="flex gap-2 text-xs">
            <RadioGroupItem value="explore" id="explore" />
            <div>
              <strong>Explore:</strong> Add +2 to your Investigate roll results.
            </div>
          </div>
          <hr />
          <div className="flex gap-2 text-xs">
            <RadioGroupItem value="tinker" id="tinker" />
            <div>
              <strong>Tinker:</strong> +1 endeavour when a returning survivor.
            </div>
          </div>
        </RadioGroup>
      </div>
    </div>
  )
}
