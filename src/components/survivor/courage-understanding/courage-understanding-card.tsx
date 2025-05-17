// CourageUnderstandingCard.tsx
'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { CampaignType } from '@/lib/enums'
import { getSettlement } from '@/lib/utils'
import { Survivor } from '@/schemas/survivor'
import { BookOpenIcon } from 'lucide-react'
import { ReactElement, useEffect, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { CourageUnderstandingAbilities } from './courage-understanding-abilities'
import { FacesInTheSky } from './faces-in-the-sky'

/**
 * Courage and Understanding Card Component
 *
 * This component displays the courage and understanding stats for a survivor.
 * It includes checkboxes to set the level of each stat from 0 to 9. The two
 * stats are displayed side by side, separated by a vertical divider.
 *
 * @param form Form
 * @returns Courage and Understanding Card Component
 */
export function CourageUnderstandingCard(
  form: UseFormReturn<Survivor>
): ReactElement {
  const courage = form.watch('courage') || 0
  const understanding = form.watch('understanding') || 0
  const settlementId = form.watch('settlementId')

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
   * Handles the change of the courage checkbox.
   *
   * @param index Index
   * @param checked Checked
   */
  const handleCourageChange = (index: number, checked: boolean) => {
    if (checked) form.setValue('courage', index + 1)
    else form.setValue('courage', index)
  }

  /**
   * Handles the change of the understanding checkbox.
   *
   * @param index Index
   * @param checked Checked
   */
  const handleUnderstandingChange = (index: number, checked: boolean) => {
    if (checked) form.setValue('understanding', index + 1)
    else form.setValue('understanding', index)
  }

  // Determine the label texts based on campaign type. Currently only People of
  // the Stars has different labels.
  const courageMilestoneText =
    campaignType === CampaignType.PEOPLE_OF_THE_STARS ? 'Awake' : 'Bold'
  const understandingMilestoneText =
    campaignType === CampaignType.PEOPLE_OF_THE_STARS ? 'Awake' : 'Insight'

  return (
    <Card className="mt-2">
      <CardContent className="py-4 min-w-[600px]">
        <div className="flex flex-wrap gap-2 items-start justify-between">
          <div className="flex flex-col">
            <div className="font-bold text-sm mb-2">Courage</div>
            <div className="flex flex-row gap-2">
              {Array.from({ length: 9 }, (_, i) => (
                <div key={i} className="w-4 h-4 flex items-center">
                  <Checkbox
                    checked={courage > i}
                    onCheckedChange={(checked) =>
                      handleCourageChange(i, !!checked)
                    }
                    className={
                      'h-4 w-4 rounded-sm' +
                      (i === 2 || i === 8 ? ' border-2 border-primary' : '')
                    }
                  />
                </div>
              ))}
            </div>

            <hr className="mt-2 mb-2" />

            <div className="flex flex-row gap-3 justify-between">
              {Array.from({ length: 2 }, (_, i) => (
                <div key={i} className="flex items-center gap-1">
                  {Array.from({ length: i + 1 }, (_, j) => (
                    <Checkbox
                      key={j}
                      disabled
                      className="!bg-white border border-gray-300 h-3 w-3"
                    />
                  ))}
                  {i === 0 ? (
                    <span className="text-xs flex items-center gap-1">
                      <BookOpenIcon className="h-4 w-4" />{' '}
                      {courageMilestoneText}
                    </span>
                  ) : (
                    <span className="text-xs flex items-center gap-1">
                      <BookOpenIcon className="h-4 w-4" /> See the Truth
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Vertical divider */}
          <div className="h-20 w-px bg-gray-300" />

          <div className="flex flex-col">
            <div className="font-bold text-sm mb-2">Understanding</div>
            <div className="flex flex-row gap-2">
              {Array.from({ length: 9 }, (_, i) => (
                <div key={i} className="w-4 h-4 flex items-center">
                  <Checkbox
                    checked={understanding > i}
                    onCheckedChange={(checked) =>
                      handleUnderstandingChange(i, !!checked)
                    }
                    className={
                      'h-4 w-4 rounded-sm' +
                      (i === 2 || i === 8 ? ' border-2 border-primary' : '')
                    }
                  />
                </div>
              ))}
            </div>

            {/* Horizontal Divider */}
            <hr className="mt-2 mb-2" />

            <div className="flex flex-row gap-3 justify-between">
              {Array.from({ length: 2 }, (_, i) => (
                <div key={i} className="flex items-center gap-1">
                  {Array.from({ length: i + 1 }, (_, j) => (
                    <Checkbox
                      key={j}
                      disabled
                      className="!bg-white border border-gray-300 h-3 w-3"
                    />
                  ))}
                  {i === 0 ? (
                    <span className="text-xs flex items-center gap-1">
                      <BookOpenIcon className="h-4 w-4" />{' '}
                      {understandingMilestoneText}
                    </span>
                  ) : (
                    <span className="text-xs flex items-center gap-1">
                      <BookOpenIcon className="h-4 w-4" /> White Secret
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Horizontal Divider */}
        <hr className="mt-2 mb-2" />

        {/* Abilities Section (Non-PotStars Campaigns) */}
        {campaignType !== CampaignType.PEOPLE_OF_THE_STARS ? (
          <CourageUnderstandingAbilities {...form} />
        ) : (
          <FacesInTheSky {...form} />
        )}
      </CardContent>
    </Card>
  )
}
