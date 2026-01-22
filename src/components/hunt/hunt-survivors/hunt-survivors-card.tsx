'use client'

import { HuntSurvivorCard } from '@/components/hunt/hunt-survivors/hunt-survivor-card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { getColorStyle, getSurvivorColorChoice } from '@/lib/utils'
import { Campaign } from '@/schemas/campaign'
import { Hunt } from '@/schemas/hunt'
import { Settlement } from '@/schemas/settlement'
import { Survivor } from '@/schemas/survivor'
import { ArrowLeftIcon, ArrowRightIcon } from 'lucide-react'
import { ReactElement, useMemo } from 'react'

/**
 * Hunt Survivors Card Properties
 */
interface HuntSurvivorsCardProps {
  /** Campaign */
  campaign: Campaign
  /** Save Selected Hunt */
  saveSelectedHunt: (updateData: Partial<Hunt>, successMsg?: string) => void
  /** Save Selected Survivor */
  saveSelectedSurvivor: (
    updateData: Partial<Survivor>,
    successMsg?: string
  ) => void
  /** Selected Hunt */
  selectedHunt: Hunt | null
  /** Selected Settlement */
  selectedSettlement: Settlement | null
  /** Selected Survivor */
  selectedSurvivor: Survivor | null
  /** Set Selected Survivor */
  setSelectedSurvivor: (survivor: Survivor | null) => void
}

/**
 * Hunt Survivors Card Component
 *
 * @param props Hunt Survivors Card Properties
 * @returns Hunt Survivors Card Component
 */
export function HuntSurvivorsCard({
  campaign,
  saveSelectedHunt,
  saveSelectedSurvivor,
  selectedHunt,
  selectedSettlement,
  selectedSurvivor,
  setSelectedSurvivor
}: HuntSurvivorsCardProps): ReactElement {
  const huntSurvivors = useMemo(() => {
    let s: number[] = []

    if (selectedHunt?.survivors) s = [...s, ...selectedHunt.survivors]
    if (selectedHunt?.scout) s = [...s, selectedHunt.scout]

    return s
  }, [selectedHunt])

  // Get filtered survivors for mapping
  const filteredSurvivors = campaign.survivors.filter((s) =>
    huntSurvivors.includes(s.id)
  )

  // Get current survivor index
  const currentIndex =
    filteredSurvivors?.findIndex((s) => s.id === selectedSurvivor?.id) ?? 0

  // Navigation handlers
  const handlePrevious = () => {
    if (!filteredSurvivors || filteredSurvivors.length === 0) return
    const newIndex =
      (currentIndex - 1 + filteredSurvivors.length) % filteredSurvivors.length
    setSelectedSurvivor(filteredSurvivors[newIndex])
  }

  const handleNext = () => {
    if (!filteredSurvivors || filteredSurvivors.length === 0) return
    const newIndex = (currentIndex + 1) % filteredSurvivors.length
    setSelectedSurvivor(filteredSurvivors[newIndex])
  }

  const handleDotClick = (index: number) => {
    if (!filteredSurvivors || !filteredSurvivors[index]) return
    setSelectedSurvivor(filteredSurvivors[index])
  }

  if (huntSurvivors.length === 0 || !selectedSettlement) return <></>

  return (
    <div className="p-0">
      <div className="survivor_carousel_controls min-w-[430px]">
        <div className="survivor_carousel_buttons">
          <Button
            className="h-12 w-12"
            variant="ghost"
            size="icon"
            onClick={handlePrevious}>
            <ArrowLeftIcon className="size-8" />
          </Button>

          <Button
            className="h-12 w-12"
            variant="ghost"
            size="icon"
            onClick={handleNext}>
            <ArrowRightIcon className="size-8" />
          </Button>
        </div>

        <div className="survivor_carousel_dots">
          {filteredSurvivors?.map((survivor, index) => {
            const survivorColor = getSurvivorColorChoice(campaign, survivor.id)
            const isSelected = index === currentIndex

            return (
              <Avatar
                key={index}
                className={`survivor_carousel_dot${isSelected ? ' survivor_carousel_dot--selected' : ''}  ${getColorStyle(survivorColor, 'bg')} items-center justify-center cursor-pointer`}
                style={{
                  ['--dot-color' as string]: isSelected
                    ? 'hsl(var(--foreground))'
                    : 'transparent',
                  ['--dot-bg' as string]: `var(--color-${survivorColor.toLowerCase()}-500)`
                }}
                onClick={() => handleDotClick(index)}>
                <AvatarFallback className="font-bold text-lg text-white bg-transparent">
                  {survivor.name
                    ? survivor.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .slice(0, 2)
                    : '??'}
                </AvatarFallback>
              </Avatar>
            )
          })}
        </div>
      </div>

      <HuntSurvivorCard
        saveSelectedHunt={saveSelectedHunt}
        saveSelectedSurvivor={saveSelectedSurvivor}
        selectedHunt={selectedHunt}
        selectedSettlement={selectedSettlement}
        selectedSurvivor={selectedSurvivor}
      />
    </div>
  )
}
