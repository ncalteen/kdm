// CourageUnderstandingCard.tsx
'use client'

import { CourageUnderstandingAbilities } from '@/components/survivor/courage-understanding/courage-understanding-abilities'
import { FacesInTheSky } from '@/components/survivor/courage-understanding/faces-in-the-sky'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { CampaignType } from '@/lib/enums'
import { Settlement } from '@/schemas/settlement'
import { Survivor } from '@/schemas/survivor'
import { BookOpenIcon } from 'lucide-react'
import { ReactElement } from 'react'
import { UseFormReturn } from 'react-hook-form'

/**
 * Courage Understanding Card Properties
 */
interface CourageUnderstandingCardProps {
  /** Survivor Form */
  form: UseFormReturn<Survivor>
  /** Save Selected Survivor */
  saveSelectedSurvivor: (data: Partial<Survivor>, successMsg?: string) => void
  /** Selected Settlemenet */
  selectedSettlement: Partial<Settlement> | null
}

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
  form,
  saveSelectedSurvivor,
  selectedSettlement
}: CourageUnderstandingCardProps): ReactElement {
  const courage = form.watch('courage')
  const understanding = form.watch('understanding')
  /**
   * Save to Local Storage
   *
   * @param attrName Attribute name
   * @param value New value
   */
  const saveToLocalStorage = (
    attrName: 'courage' | 'understanding',
    value: number
  ) =>
    saveSelectedSurvivor(
      {
        [attrName]: value
      },
      attrName === 'courage'
        ? 'Courage burns brighter in the darkness.'
        : 'Understanding illuminates the path forward.'
    )

  /**
   * Update Courage
   *
   * @param index Index
   * @param checked Checked
   */
  const updateCourage = (index: number, checked: boolean) =>
    saveToLocalStorage('courage', checked ? index + 1 : index)

  /**
   * Update Understanding
   *
   * @param index Index
   * @param checked Checked
   */
  const updateUnderstanding = (index: number, checked: boolean) =>
    saveToLocalStorage('understanding', checked ? index + 1 : index)

  // Determine the label texts based on campaign type. Currently only People of
  // the Stars has different labels.
  const courageMilestoneText =
    selectedSettlement?.campaignType === CampaignType.PEOPLE_OF_THE_STARS
      ? 'Awake'
      : 'Bold'
  const understandingMilestoneText =
    selectedSettlement?.campaignType === CampaignType.PEOPLE_OF_THE_STARS
      ? 'Awake'
      : 'Insight'

  return (
    <Card className="p-2 border-0">
      <CardContent className="p-0">
        {/* Desktop Layout */}
        <div className="hidden lg:flex flex-wrap justify-between mx-2">
          {/* Courage Section */}
          <div className="flex flex-col">
            <div className="font-bold text-sm mb-1">Courage</div>

            <div className="flex flex-row gap-1 lg:gap-2">
              {Array.from({ length: 9 }, (_, i) => (
                <div key={i} className="w-4 h-4 flex items-center">
                  <Checkbox
                    checked={(courage || 0) > i}
                    onCheckedChange={(checked) => updateCourage(i, !!checked)}
                    className={
                      'h-4 w-4 rounded-sm' +
                      (i === 2 || i === 8 ? ' border-2 border-primary' : '')
                    }
                  />
                </div>
              ))}
            </div>

            <hr className="my-2" />

            <div className="flex flex-row justify-between gap-1">
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

            <div className="flex flex-row gap-1 lg:gap-2">
              {Array.from({ length: 9 }, (_, i) => (
                <div key={i} className="w-4 h-4 flex items-center">
                  <Checkbox
                    checked={(understanding || 0) > i}
                    onCheckedChange={(checked) =>
                      updateUnderstanding(i, !!checked)
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

            <div className="flex flex-row justify-between gap-1">
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

        {/* Mobile Layout */}
        <div className="lg:hidden flex flex-col gap-4 mx-2">
          {/* Courage Section */}
          <div className="flex flex-col w-full">
            <div className="font-bold text-sm mb-1">Courage</div>

            <div className="flex flex-row justify-evenly gap-1">
              {Array.from({ length: 9 }, (_, i) => (
                <div key={i} className="w-4 h-4 flex items-center">
                  <Checkbox
                    checked={(courage || 0) > i}
                    onCheckedChange={(checked) => updateCourage(i, !!checked)}
                    className={
                      'h-4 w-4 rounded-sm' +
                      (i === 2 || i === 8 ? ' border-2 border-primary' : '')
                    }
                  />
                </div>
              ))}
            </div>

            <hr className="my-2" />

            <div className="flex flex-row justify-between gap-1">
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

          {/* Understanding Section */}
          <div className="flex flex-col w-full">
            <div className="font-bold text-sm mb-1">Understanding</div>

            <div className="flex flex-row gap-1 justify-evenly">
              {Array.from({ length: 9 }, (_, i) => (
                <div key={i} className="w-4 h-4 flex items-center">
                  <Checkbox
                    checked={(understanding || 0) > i}
                    onCheckedChange={(checked) =>
                      updateUnderstanding(i, !!checked)
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

            <div className="flex flex-row justify-between gap-1">
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

        {selectedSettlement?.campaignType !==
        CampaignType.PEOPLE_OF_THE_STARS ? (
          <CourageUnderstandingAbilities
            form={form}
            saveSelectedSurvivor={saveSelectedSurvivor}
          />
        ) : (
          <FacesInTheSky
            form={form}
            saveSelectedSurvivor={saveSelectedSurvivor}
          />
        )}
      </CardContent>
    </Card>
  )
}
