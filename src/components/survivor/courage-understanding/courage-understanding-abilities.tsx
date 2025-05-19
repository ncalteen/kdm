'use client'

import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Survivor } from '@/schemas/survivor'
import { ReactElement } from 'react'
import { UseFormReturn } from 'react-hook-form'

/**
 * Courage/Understanding Abilities Component
 *
 * Displays the abilities that a survivor has based on their courage and
 * understanding.
 *
 * @param form Form
 * @returns Courage/Understanding Abilities Component
 */
export function CourageUnderstandingAbilities(
  form: UseFormReturn<Survivor>
): ReactElement {
  const hasStalwart = form.watch('hasStalwart')
  const hasPrepared = form.watch('hasPrepared')
  const hasMatchmaker = form.watch('hasMatchmaker')
  const hasAnalyze = form.watch('hasAnalyze')
  const hasExplore = form.watch('hasExplore')
  const hasTinker = form.watch('hasTinker')

  /**
   * Handles the change of the ability in the courage group.
   *
   * @param value Value
   */
  const handleCourageGroupChange = (value: string) => {
    // Reset all values first
    form.setValue('hasStalwart', false)
    form.setValue('hasPrepared', false)
    form.setValue('hasMatchmaker', false)

    // Set the selected value
    switch (value) {
      case 'stalwart':
        form.setValue('hasStalwart', true)
        break
      case 'prepared':
        form.setValue('hasPrepared', true)
        break
      case 'matchmaker':
        form.setValue('hasMatchmaker', true)
        break
    }
  }

  /**
   * Handles the change of the ability in the understanding group.
   *
   * @param value Value
   */
  const handleUnderstandingGroupChange = (value: string) => {
    // Reset all values first
    form.setValue('hasAnalyze', false)
    form.setValue('hasExplore', false)
    form.setValue('hasTinker', false)

    // Set the selected value
    switch (value) {
      case 'analyze':
        form.setValue('hasAnalyze', true)
        break
      case 'explore':
        form.setValue('hasExplore', true)
        break
      case 'tinker':
        form.setValue('hasTinker', true)
        break
    }
  }

  const courageGroupValue = hasStalwart
    ? 'stalwart'
    : hasPrepared
      ? 'prepared'
      : hasMatchmaker
        ? 'matchmaker'
        : ''

  const understandingGroupValue = hasAnalyze
    ? 'analyze'
    : hasExplore
      ? 'explore'
      : hasTinker
        ? 'tinker'
        : ''

  return (
    <div className="flex flex-wrap items-start justify-evenly">
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
