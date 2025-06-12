'use client'

import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CardContent, CardHeader } from '@/components/ui/card'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger
} from '@/components/ui/hover-card'
import { Survivor } from '@/schemas/survivor'
import { AvatarFallback } from '@radix-ui/react-avatar'
import { UserCheckIcon, UserSearchIcon } from 'lucide-react'
import { ReactElement } from 'react'

/**
 * Survivor Selection Card Props
 */
interface SurvivorSelectionCardProps extends Survivor {
  /** Survivor Selected as Scout */
  isSelectedAsScout: boolean
  /** Survivor is Disabled */
  isDisabled: boolean
  /** Handle Toggle Function */
  handleSurvivorToggle: (survivorId: number) => void
  /** Temporary Selection State */
  tempSelection: number[]
}

/**
 * Survivor Selection Card Component
 *
 * This component is used to display a survivor for selection during a hunt.
 */
export function SurvivorSelectionCard({
  handleSurvivorToggle,
  isSelectedAsScout,
  isDisabled,
  tempSelection,
  ...survivor
}: SurvivorSelectionCardProps): ReactElement {
  const isSelected = tempSelection.includes(survivor.id)

  return (
    <HoverCard>
      <HoverCardTrigger className="w-[195px] h-[140px]">
        <Button
          key={survivor.id}
          variant={tempSelection.includes(survivor.id) ? 'default' : 'outline'}
          className="justify-start flex flex-col h-12 p-3 w-full h-full items-start relative"
          onClick={() => handleSurvivorToggle(survivor.id)}
          disabled={isDisabled}>
          <div className="flex flex-row items-center gap-2">
            <Avatar
              className={
                'h-8 w-8 items-center justify-center' +
                (isDisabled ? ' bg-muted' : ' bg-muted/50')
              }>
              <AvatarFallback>{survivor.name[0]}</AvatarFallback>
            </Avatar>
          </div>

          <div className="flex flex-row justify-between gap-2 w-full">
            <Badge
              className="text-xs w-[80px]"
              variant={isSelected ? 'secondary' : 'default'}>
              <strong>Hunt XP:</strong> {survivor.huntXP}
            </Badge>

            <Badge
              className="text-xs w-[80px]"
              variant={isSelected ? 'secondary' : 'default'}>
              <strong>Gender:</strong> {survivor.gender}
            </Badge>
          </div>

          <div className="flex flex-row justify-between gap-2 w-full">
            <Badge
              className="text-xs w-[80px]"
              variant={isSelected ? 'secondary' : 'default'}>
              <strong>Survival:</strong> {survivor.survival}
            </Badge>

            <Badge
              className="text-xs w-[80px]"
              variant={isSelected ? 'secondary' : 'default'}>
              <strong>Insanity:</strong> {survivor.insanity}
            </Badge>
          </div>

          {isSelectedAsScout && (
            <span className="text-xs text-red-500 ml-1 absolute bottom-2 right-2 flex gap-1 items-center">
              <UserSearchIcon className="h-4 w-4 " />
              Scout
            </span>
          )}

          {isSelected && (
            <span className="text-xs ml-1 absolute bottom-2 right-2 flex gap-1 items-center">
              <UserCheckIcon className="h-4 w-4" />
            </span>
          )}
        </Button>
      </HoverCardTrigger>
      {/* Card width should always fit the header and content width */}
      <HoverCardContent className="p-0">
        <CardHeader className="p-0 px-4 bg-muted text-center text-sm font-semibold w-full">
          {survivor.name}
        </CardHeader>
        <CardContent className="flex flex-row flex-wrap px-0">
          <div className="flex-1 flex flex-col gap-1 p-2 pb-0">
            <div className="text-xs flex justify-between border-b">
              <strong>Hunt XP</strong>
              {survivor.huntXP}
            </div>
            <div className="text-xs flex justify-between border-b">
              <strong>Gender</strong>
              {survivor.gender}
            </div>
            <div className="text-xs flex justify-between border-b">
              <strong>Survival</strong>
              {survivor.survival}
            </div>
            <div className="text-xs flex justify-between border-b">
              <strong>Insanity</strong>
              {survivor.insanity}
            </div>
            {survivor.weaponProficiencyType && (
              <div className="text-xs flex justify-between border-b">
                <strong>{survivor.weaponProficiencyType} Proficiency</strong>
                {survivor.weaponProficiency}
              </div>
            )}
          </div>

          {(survivor.fightingArts.length > 0 ||
            survivor.secretFightingArts.length > 0) && (
            <div className="flex-1 border-l p-2">
              <div className="text-xs font-semibold bg-muted p-2 text-center">
                Fighting Arts
              </div>
              <div className="text-xs">
                {survivor.fightingArts.map((art, index) => (
                  <div key={index} className="border-b p-1">
                    {art}
                  </div>
                ))}
                {survivor.secretFightingArts.map((art, index) => (
                  <div key={index} className="border-b p-1">
                    {art}
                  </div>
                ))}
              </div>
            </div>
          )}

          {survivor.disorders.length > 0 && (
            <div className="flex-1 border-l p-2">
              <div className="text-xs font-semibold bg-muted p-2 text-center">
                Disorders
              </div>
              <div className="text-xs">
                {survivor.disorders.map((disorder, index) => (
                  <div key={index} className="border-b p-1">
                    {disorder}
                  </div>
                ))}
              </div>
            </div>
          )}

          {survivor.abilitiesAndImpairments.length > 0 && (
            <div className="flex-1 border-l p-2">
              <div className="text-xs font-semibold bg-muted p-2 text-center">
                Abilities & Impairments
              </div>
              <div className="text-xs">
                {survivor.abilitiesAndImpairments.map(
                  (abilitiyOrImpairment, index) => (
                    <div key={index} className="border-b p-1">
                      {abilitiyOrImpairment}
                    </div>
                  )
                )}
              </div>
            </div>
          )}
        </CardContent>
      </HoverCardContent>
    </HoverCard>
  )
}
