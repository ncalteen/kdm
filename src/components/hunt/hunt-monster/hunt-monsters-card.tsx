'use client'

import { HuntMonsterCard } from '@/components/hunt/hunt-monster/hunt-monster-card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Hunt } from '@/schemas/hunt'
import { ArrowLeftIcon, ArrowRightIcon, SkullIcon } from 'lucide-react'
import { ReactElement } from 'react'

/**
 * Hunt Monsters Card Properties
 */
interface HuntMonstersCardProps {
  /** Save Selected Hunt */
  saveSelectedHunt: (updateData: Partial<Hunt>, successMsg?: string) => void
  /** Selected Hunt */
  selectedHunt: Hunt | null
  /** Selected Hunt Monster Index */
  selectedHuntMonsterIndex: number
  /** Set Selected Hunt Monster Index */
  setSelectedHuntMonsterIndex: (index: number) => void
}

/**
 * Hunt Monsters Card Component
 *
 * @param props Hunt Monsters Card Properties
 * @returns Hunt Monsters Card Component
 */
export function HuntMonstersCard({
  saveSelectedHunt,
  selectedHunt,
  selectedHuntMonsterIndex,
  setSelectedHuntMonsterIndex
}: HuntMonstersCardProps): ReactElement {
  const handlePrevious = () => {
    const length = selectedHunt?.monsters?.length ?? 0
    if (length === 0) return

    const newIndex = (selectedHuntMonsterIndex - 1 + length) % length
    setSelectedHuntMonsterIndex(newIndex)
  }

  const handleNext = () => {
    const length = selectedHunt?.monsters?.length ?? 0
    if (length === 0) return

    const newIndex = (selectedHuntMonsterIndex + 1) % length
    setSelectedHuntMonsterIndex(newIndex)
  }

  const handleDotClick = (index: number) => {
    if (!selectedHunt?.monsters?.[index]) return

    setSelectedHuntMonsterIndex(index)
  }

  return (
    <div className="p-0">
      {selectedHunt && selectedHunt.monsters.length > 1 && (
        <div className="monster_carousel_controls pb-2">
          <div className="monster_carousel_buttons">
            <Button
              className="h-8 w-8"
              variant="ghost"
              size="icon"
              onClick={handlePrevious}>
              <ArrowLeftIcon className="size-8" />
            </Button>

            <Button
              className="h-8 w-8"
              variant="ghost"
              size="icon"
              onClick={handleNext}>
              <ArrowRightIcon className="size-8" />
            </Button>
          </div>

          <div className="monster_carousel_dots">
            {selectedHunt.monsters.map((monster, index) => {
              const isSelected = index === selectedHuntMonsterIndex

              return (
                <Avatar
                  key={index}
                  className={`monster_carousel_dot${isSelected ? ' monster_carousel_dot--selected' : ''} bg-red-500 items-center justify-center cursor-pointer`}
                  style={{
                    ['--dot-color' as string]: isSelected
                      ? 'hsl(var(--foreground))'
                      : 'transparent',
                    ['--dot-bg' as string]: 'hsl(var(--destructive))'
                  }}
                  onClick={() => handleDotClick(index)}>
                  <AvatarFallback className="bg-transparent">
                    <SkullIcon className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              )
            })}
          </div>
        </div>
      )}

      <HuntMonsterCard
        saveSelectedHunt={saveSelectedHunt}
        selectedHunt={selectedHunt}
        selectedHuntMonsterIndex={selectedHuntMonsterIndex}
      />
    </div>
  )
}
