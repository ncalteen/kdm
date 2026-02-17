'use client'

import { SettlementPhaseSurvivorCard } from '@/components/settlement-phase/settlement-phase-survivors/settlement-phase-survivor-card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { getColorStyle, getSurvivorColorChoice } from '@/lib/utils'
import { Campaign } from '@/schemas/campaign'
import { Settlement } from '@/schemas/settlement'
import { SettlementPhase } from '@/schemas/settlement-phase'
import { Survivor } from '@/schemas/survivor'
import { ArrowLeftIcon, ArrowRightIcon } from 'lucide-react'
import { ReactElement, useEffect, useMemo } from 'react'

/**
 * Settlement Phase Survivors Card Properties
 */
interface SettlementPhaseSurvivorsCardProps {
  /** Campaign */
  campaign: Campaign
  /** Save Selected Survivor */
  saveSelectedSurvivor: (
    updateData: Partial<Survivor>,
    successMsg?: string
  ) => void
  /** Selected Settlement Phase */
  selectedSettlementPhase: SettlementPhase | null
  /** Selected Settlement */
  selectedSettlement: Settlement | null
  /** Selected Survivor */
  selectedSurvivor: Survivor | null
  /** Set Selected Survivor */
  setSelectedSurvivor: (survivor: Survivor | null) => void
}

/**
 * Settlement Phase Survivors Card Component
 *
 * @param props Settlement Phase Survivors Card Properties
 * @returns Settlement Phase Survivors Card Component
 */
export function SettlementPhaseSurvivorsCard({
  campaign,
  saveSelectedSurvivor,
  selectedSettlementPhase,
  selectedSettlement,
  selectedSurvivor,
  setSelectedSurvivor
}: SettlementPhaseSurvivorsCardProps): ReactElement {
  const settlementPhaseSurvivors = useMemo(() => {
    let s: number[] = []

    if (selectedSettlementPhase?.returningSurvivors)
      s = [...s, ...selectedSettlementPhase.returningSurvivors]
    if (selectedSettlementPhase?.returningScout)
      s = [...s, selectedSettlementPhase.returningScout]

    return s
  }, [selectedSettlementPhase])

  // Get filtered survivors for mapping
  const filteredSurvivors = campaign.survivors.filter((s) =>
    settlementPhaseSurvivors.includes(s.id)
  )

  // When the selected survivor changes, set the carousel to that survivor (if
  // they exist in the filtered survivors). If not, set the selected survivor to
  // the first survivor in the filtered list.
  useEffect(() => {
    if (!selectedSurvivor && filteredSurvivors?.[0])
      setSelectedSurvivor(filteredSurvivors[0])
  }, [filteredSurvivors, selectedSurvivor, setSelectedSurvivor])

  // Get current survivor index
  const currentIndex =
    filteredSurvivors?.findIndex((s) => s.id === selectedSurvivor?.id) ?? 0

  /**
   * Handle Previous Survivor
   */
  const handlePrevious = () => {
    if (!filteredSurvivors || filteredSurvivors.length === 0) return
    const newIndex =
      (currentIndex - 1 + filteredSurvivors.length) % filteredSurvivors.length
    setSelectedSurvivor(filteredSurvivors[newIndex])
  }

  /**
   * Handle Next Survivor
   */
  const handleNext = () => {
    if (!filteredSurvivors || filteredSurvivors.length === 0) return
    const newIndex = (currentIndex + 1) % filteredSurvivors.length
    setSelectedSurvivor(filteredSurvivors[newIndex])
  }

  /**
   * Handle Survivor Dot Click
   *
   * @param index Dot Index
   */
  const handleDotClick = (index: number) => {
    if (!filteredSurvivors || !filteredSurvivors[index]) return
    setSelectedSurvivor(filteredSurvivors[index])
  }

  return (
    <div className="p-0">
      <div className="survivor_carousel_controls min-w-[430px] grid-cols-3">
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

      <SettlementPhaseSurvivorCard
        saveSelectedSurvivor={saveSelectedSurvivor}
        selectedSettlement={selectedSettlement}
        selectedSurvivor={selectedSurvivor}
      />
    </div>
  )
}
