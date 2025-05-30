// CourageUnderstandingCard.tsx
'use client'

import { CourageUnderstandingAbilities } from '@/components/survivor/courage-understanding/courage-understanding-abilities'
import { FacesInTheSky } from '@/components/survivor/courage-understanding/faces-in-the-sky'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { CampaignType } from '@/lib/enums'
import { getCampaign, getSettlement } from '@/lib/utils'
import { Survivor, SurvivorSchema } from '@/schemas/survivor'
import { BookOpenIcon } from 'lucide-react'
import { ReactElement, useEffect, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'
import { ZodError } from 'zod'

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
export function CourageUnderstandingCard({
  ...form
}: UseFormReturn<Survivor>): ReactElement {
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
   * Save a courage/understanding stat change to localStorage for the current survivor.
   *
   * @param attrName Attribute name
   * @param value New value
   */
  const saveToLocalStorage = (
    attrName: 'courage' | 'understanding',
    value: number
  ) => {
    try {
      const formValues = form.getValues()
      const campaign = getCampaign()
      const survivorIndex = campaign.survivors.findIndex(
        (s: { id: number }) => s.id === formValues.id
      )

      if (survivorIndex !== -1) {
        const updatedSurvivor = {
          ...campaign.survivors[survivorIndex],
          [attrName]: value
        }

        try {
          SurvivorSchema.parse(updatedSurvivor)
        } catch (error) {
          if (error instanceof ZodError && error.errors[0]?.message)
            return toast.error(error.errors[0].message)
          else
            return toast.error(
              'The darkness swallows your words. Please try again.'
            )
        }

        campaign.survivors[survivorIndex][attrName] = value
        localStorage.setItem('campaign', JSON.stringify(campaign))

        toast.success(
          attrName === 'courage'
            ? 'Courage burns brighter in the darkness.'
            : 'Understanding illuminates the path forward.'
        )
      }
    } catch (error) {
      console.error('Courage/Understanding Save Error:', error)
      toast.error('The darkness swallows your words. Please try again.')
    }
  }

  /**
   * Handles the change of the courage checkbox.
   *
   * @param index Index
   * @param checked Checked
   */
  const handleCourageChange = (index: number, checked: boolean) => {
    const newValue = checked ? index + 1 : index
    form.setValue('courage', newValue)
    saveToLocalStorage('courage', newValue)
  }

  /**
   * Handles the change of the understanding checkbox.
   *
   * @param index Index
   * @param checked Checked
   */
  const handleUnderstandingChange = (index: number, checked: boolean) => {
    const newValue = checked ? index + 1 : index
    form.setValue('understanding', newValue)
    saveToLocalStorage('understanding', newValue)
  }

  // Determine the label texts based on campaign type. Currently only People of
  // the Stars has different labels.
  const courageMilestoneText =
    campaignType === CampaignType.PEOPLE_OF_THE_STARS ? 'Awake' : 'Bold'
  const understandingMilestoneText =
    campaignType === CampaignType.PEOPLE_OF_THE_STARS ? 'Awake' : 'Insight'

  return (
    <Card className="p-0 pb-1 mt-1 border-3">
      <CardContent className="py-2 px-0">
        <div className="flex flex-wrap justify-between mx-2">
          {/* Courage Section */}
          <div className="flex flex-col">
            <div className="font-bold text-sm mb-1">Courage</div>

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

            <hr className="my-2" />

            <div className="flex flex-row justify-between">
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

          {/* Vertical Divider */}
          <div className="h-18 w-px bg-gray-800" />

          {/* Understanding Section */}
          <div className="flex flex-col">
            <div className="font-bold text-sm mb-1">Understanding</div>

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

            <hr className="my-2" />

            <div className="flex flex-row justify-between">
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

        <hr className="my-2 mx-1" />

        {campaignType !== CampaignType.PEOPLE_OF_THE_STARS ? (
          <CourageUnderstandingAbilities {...form} />
        ) : (
          <FacesInTheSky {...form} />
        )}
      </CardContent>
    </Card>
  )
}
