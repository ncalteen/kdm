'use client'

import { ShowdownMonsterCard } from '@/components/showdown/showdown-monster/showdown-monster-card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Showdown } from '@/schemas/showdown'
import { ArrowLeftIcon, ArrowRightIcon, SkullIcon } from 'lucide-react'
import { ReactElement } from 'react'

/**
 * Showdown Monsters Card Component Properties
 */
interface ShowdownMonstersCardProps {
  /** Save Selected Showdown */
  saveSelectedShowdown: (
    updateData: Partial<Showdown>,
    successMsg?: string
  ) => void
  /** Selected Showdown */
  selectedShowdown: Showdown | null
  /** Selected Showdown Monster Index */
  selectedShowdownMonsterIndex: number
  /** Set Selected Showdown Monster Index */
  setSelectedShowdownMonsterIndex: (index: number) => void
}

/**
 * Showdown Monsters Card Component
 *
 * @param props Showdown Monsters Card Properties
 * @returns Monsters Card Component
 */
export function ShowdownMonstersCard({
  saveSelectedShowdown,
  selectedShowdown,
  selectedShowdownMonsterIndex,
  setSelectedShowdownMonsterIndex
}: ShowdownMonstersCardProps): ReactElement {
  const handlePrevious = () => {
    const length = selectedShowdown?.monsters?.length ?? 0
    if (length === 0) return

    const newIndex = (selectedShowdownMonsterIndex - 1 + length) % length
    setSelectedShowdownMonsterIndex(newIndex)
  }

  const handleNext = () => {
    const length = selectedShowdown?.monsters?.length ?? 0
    if (length === 0) return

    const newIndex = (selectedShowdownMonsterIndex + 1) % length
    setSelectedShowdownMonsterIndex(newIndex)
  }

  const handleDotClick = (index: number) => {
    if (!selectedShowdown?.monsters?.[index]) return

    setSelectedShowdownMonsterIndex(index)
  }

  return (
    <div className="p-0 w-full">
      {selectedShowdown && selectedShowdown.monsters.length > 1 && (
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
            {selectedShowdown.monsters.map((monster, index) => {
              const isSelected = index === selectedShowdownMonsterIndex

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

      <ShowdownMonsterCard
        saveSelectedShowdown={saveSelectedShowdown}
        selectedShowdown={selectedShowdown}
        selectedShowdownMonsterIndex={selectedShowdownMonsterIndex}
      />
    </div>
  )
}
