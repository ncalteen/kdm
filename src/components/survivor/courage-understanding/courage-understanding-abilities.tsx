'use client'

import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { CampaignType } from '@/lib/enums'
import { getSettlement } from '@/lib/utils'
import { SurvivorSchema } from '@/schemas/survivor'
import { useEffect, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { z } from 'zod'

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
  form: UseFormReturn<z.infer<typeof SurvivorSchema>>
) {
  const settlementId = form.watch('settlementId')
  const hasStalwart = form.watch('hasStalwart')
  const hasPrepared = form.watch('hasPrepared')
  const hasMatchmaker = form.watch('hasMatchmaker')
  const hasAnalyze = form.watch('hasAnalyze')
  const hasExplore = form.watch('hasExplore')
  const hasTinker = form.watch('hasTinker')

  // Get the survivor type from the settlement data.
  const [campaignType, setCampaignType] = useState<CampaignType | undefined>(
    undefined
  )

  // Set the survivor type when the component mounts.
  useEffect(
    () => setCampaignType(getSettlement(settlementId)?.campaignType),
    [settlementId]
  )

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
    <div className="flex flex-wrap items-start justify-between">
      <div className="flex flex-col w-[45%]">
        <RadioGroup
          value={courageGroupValue}
          onValueChange={handleCourageGroupChange}>
          <div className="flex gap-2 text-xs">
            <RadioGroupItem value="stalwart" id="stalwart" />
            <strong>Stalwart:</strong> Can&apos;t be knocked down by brain
            trauma or intimidate.
          </div>
          <hr />
          <div className="flex gap-2 text-xs">
            <RadioGroupItem value="prepared" id="prepared" />
            <strong>Prepared:</strong> Add Hunt XP to your roll when determining
            a straggler.
          </div>
          <hr />
          <div className="flex gap-2 text-xs">
            <RadioGroupItem value="matchmaker" id="matchmaker" />
            <strong>Matchmaker:</strong> Spend 1 endeavour to trigger Intimacy
            story event.
          </div>
        </RadioGroup>
      </div>

      {/* Vertical divider */}
      <div className="h-38 w-px bg-gray-300" />

      <div className="flex flex-col w-[45%]">
        <RadioGroup
          value={understandingGroupValue}
          onValueChange={handleUnderstandingGroupChange}>
          <div className="flex gap-2 text-xs">
            <RadioGroupItem value="analyze" id="analyze" />
            <strong>Analyze:</strong> Look at the top AI card and return it to
            the top of the deck.
          </div>
          <hr />
          <div className="flex gap-2 text-xs">
            <RadioGroupItem value="explore" id="explore" />
            <strong>Explore:</strong> Add +2 to your Investigate roll results.
          </div>
          <hr />
          <div className="flex gap-2 text-xs">
            <RadioGroupItem value="tinker" id="tinker" />
            <strong>Tinker:</strong> +1 endeavour when a returning survivor.
          </div>
        </RadioGroup>
      </div>
    </div>
  )
}
