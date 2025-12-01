'use client'

import { ShowdownSurvivorCard } from '@/components/showdown/showdown-survivors/showdown-survivor-card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { getColorStyle, getSurvivorColorChoice } from '@/lib/utils'
import { Settlement } from '@/schemas/settlement'
import { Showdown } from '@/schemas/showdown'
import { Survivor } from '@/schemas/survivor'
import { ArrowLeftIcon, ArrowRightIcon } from 'lucide-react'
import { ReactElement, useMemo } from 'react'

/**
 * Showdown Survivors Card Properties
 */
interface ShowdownSurvivorsCardProps {
  /** Save Selected Showdown */
  saveSelectedShowdown: (
    updateData: Partial<Showdown>,
    successMsg?: string
  ) => void
  /** Save Selected Survivor */
  saveSelectedSurvivor: (
    updateData: Partial<Survivor>,
    successMsg?: string
  ) => void
  /** Selected Showdown */
  selectedShowdown: Showdown | null
  /** Selected Settlement */
  selectedSettlement: Settlement | null
  /** Selected Survivor */
  selectedSurvivor: Survivor | null
  /** Set Selected Survivor */
  setSelectedSurvivor: (survivor: Survivor | null) => void
  /** Set Survivors */
  setSurvivors: (survivors: Survivor[]) => void
  /** Survivors */
  survivors: Survivor[] | null
}

/**
 * Showdown Survivors Card Component
 *
 * @param props Showdown Survivors Card Properties
 * @returns Showdown Survivors Card Component
 */
export function ShowdownSurvivorsCard({
  saveSelectedShowdown,
  saveSelectedSurvivor,
  selectedShowdown,
  selectedSettlement,
  selectedSurvivor,
  setSelectedSurvivor,
  setSurvivors,
  survivors
}: ShowdownSurvivorsCardProps): ReactElement {
  const showdownSurvivors = useMemo(() => {
    let s: number[] = []

    if (selectedShowdown?.survivors) s = [...s, ...selectedShowdown.survivors]
    if (selectedShowdown?.scout) s = [...s, selectedShowdown.scout]

    return s
  }, [selectedShowdown?.survivors, selectedShowdown?.scout])

  // Get filtered survivors for mapping
  const filteredSurvivors = survivors?.filter((s) =>
    showdownSurvivors.includes(s.id)
  )

  // When the selected survivor changes, set the carousel to that survivor (if
  // they exist in the filtered survivors). If not, set the selected survivor to
  // the first survivor in the filtered list.
  useMemo(() => {
    if (!selectedSurvivor) setSelectedSurvivor(filteredSurvivors?.[0] || null)
  }, [filteredSurvivors, setSelectedSurvivor, selectedSurvivor])

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

  if (showdownSurvivors.length === 0 || !selectedSettlement) return <></>

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
            const survivorColor = getSurvivorColorChoice(
              selectedShowdown,
              survivor.id
            )
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

      <ShowdownSurvivorCard
        saveSelectedShowdown={saveSelectedShowdown}
        saveSelectedSurvivor={saveSelectedSurvivor}
        selectedSettlement={selectedSettlement}
        selectedShowdown={selectedShowdown}
        selectedSurvivor={selectedSurvivor}
        setSurvivors={setSurvivors}
        survivors={survivors}
      />
    </div>
  )
}
