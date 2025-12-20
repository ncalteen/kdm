// CourageUnderstandingCard.tsx
'use client'

import { CourageUnderstandingAbilities } from '@/components/survivor/courage-understanding/courage-understanding-abilities'
import { FacesInTheSky } from '@/components/survivor/courage-understanding/faces-in-the-sky'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { CampaignType } from '@/lib/enums'
import {
  SURVIVOR_COURAGE_UPDATED_MESSAGE,
  SURVIVOR_UNDERSTANDING_UPDATED_MESSAGE
} from '@/lib/messages'
import { Settlement } from '@/schemas/settlement'
import { Survivor } from '@/schemas/survivor'
import { BookOpenIcon } from 'lucide-react'
import { ReactElement } from 'react'

/**
 * Courage Understanding Card Properties
 */
interface CourageUnderstandingCardProps {
  /** Save Selected Survivor */
  saveSelectedSurvivor: (data: Partial<Survivor>, successMsg?: string) => void
  /** Selected Settlemenet */
  selectedSettlement: Settlement | null
  /** Selected Survivor */
  selectedSurvivor: Survivor | null
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
  saveSelectedSurvivor,
  selectedSettlement,
  selectedSurvivor
}: CourageUnderstandingCardProps): ReactElement {
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
        <div className="flex flex-row justify-between">
          {/* Courage */}
          <div className="flex flex-col w-[45%] gap-2">
            <Label className="font-bold text-left text-sm">Courage</Label>
            <div className="flex flex-row justify-between">
              {Array.from({ length: 9 }, (_, i) => (
                <div key={i} className="w-4 h-4 flex items-center">
                  <Checkbox
                    checked={(selectedSurvivor?.courage || 0) > i}
                    onCheckedChange={(checked) =>
                      saveSelectedSurvivor(
                        {
                          courage: !!checked ? i + 1 : i
                        },
                        SURVIVOR_COURAGE_UPDATED_MESSAGE()
                      )
                    }
                    className={
                      'h-4 w-4 rounded-sm' +
                      (i === 2 || i === 8 ? ' border-2 border-primary' : '')
                    }
                  />
                </div>
              ))}
            </div>

            <hr className="hidden lg:flex" />

            <div className="hidden lg:flex flex-row justify-between">
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
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <BookOpenIcon className="h-4 w-4" />{' '}
                      {courageMilestoneText}
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <BookOpenIcon className="h-4 w-4" /> See the Truth
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Understanding Section */}
          <div className="flex flex-col w-[45%] gap-2">
            <Label className="font-bold text-left text-sm">Understanding</Label>
            <div className="flex flex-row justify-between">
              {Array.from({ length: 9 }, (_, i) => (
                <div key={i} className="w-4 h-4 flex items-center">
                  <Checkbox
                    checked={(selectedSurvivor?.understanding || 0) > i}
                    onCheckedChange={(checked) =>
                      saveSelectedSurvivor(
                        {
                          understanding: !!checked ? i + 1 : i
                        },
                        SURVIVOR_UNDERSTANDING_UPDATED_MESSAGE()
                      )
                    }
                    className={
                      'h-4 w-4 rounded-sm' +
                      (i === 2 || i === 8 ? ' border-2 border-primary' : '')
                    }
                  />
                </div>
              ))}
            </div>

            <hr className="hidden lg:flex" />

            <div className="hidden lg:flex flex-row justify-between">
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
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <BookOpenIcon className="h-4 w-4" />{' '}
                      {understandingMilestoneText}
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <BookOpenIcon className="h-4 w-4" /> White Secret
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {selectedSettlement?.campaignType !==
        CampaignType.PEOPLE_OF_THE_STARS ? (
          <CourageUnderstandingAbilities
            saveSelectedSurvivor={saveSelectedSurvivor}
            selectedSurvivor={selectedSurvivor}
          />
        ) : (
          <>
            <hr className="my-2 mx-1" />

            <FacesInTheSky
              saveSelectedSurvivor={saveSelectedSurvivor}
              selectedSurvivor={selectedSurvivor}
            />
          </>
        )}
      </CardContent>
    </Card>
  )
}
