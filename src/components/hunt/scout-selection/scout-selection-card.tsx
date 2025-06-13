'use client'

import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { CardContent } from '@/components/ui/card'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger
} from '@/components/ui/hover-card'
import { Survivor } from '@/schemas/survivor'
import { AvatarFallback } from '@radix-ui/react-avatar'
import { UserCheckIcon, UsersIcon } from 'lucide-react'
import { ReactElement } from 'react'

/**
 * Scout Selection Card Props
 */
interface ScoutSelectionCardProps extends Survivor {
  /** Handle Toggle Function */
  handleSurvivorToggle: (survivorId: number) => void
  /** Survivor Selected as Scout */
  isCurrentlySelected: boolean
  /** Survivor is Selected for Hunt Party */
  isSelectedAsSurvivor: boolean
}

/**
 * Scout Selection Card Component
 *
 * This component is used to display a survivor for selection during a hunt.
 */
export function ScoutSelectionCard({
  handleSurvivorToggle,
  isCurrentlySelected,
  isSelectedAsSurvivor,
  ...survivor
}: ScoutSelectionCardProps): ReactElement {
  return (
    <HoverCard>
      <HoverCardTrigger className="w-[200px] h-[280px]">
        <Button
          key={survivor.id}
          variant={isCurrentlySelected ? 'default' : 'outline'}
          className="justify-start flex flex-col p-0 w-full h-full items-stretch relative overflow-hidden"
          onClick={() => handleSurvivorToggle(survivor.id)}
          disabled={isSelectedAsSurvivor}>
          {/* Header with Avatar and Name */}
          <div className="bg-muted/20 p-3 border-b border-border/20">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 border-1 border-background items-center justify-center">
                <AvatarFallback className="font-bold text-lg">
                  {survivor.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div className="text-left flex-1 min-w-0">
                <div className="font-semibold text-sm truncate">
                  {survivor.name}
                </div>
                <div className="text-xs text-muted-foreground">
                  {survivor.gender}
                </div>
              </div>
            </div>
          </div>

          {/* Main Stats Grid */}
          <div className="flex-1 p-3 space-y-3">
            {/* Primary Stats */}
            <div className="grid grid-cols-1 text-xs">
              <div className="bg-background/60 rounded px-2 py-1 text-center">
                <div>Hunt XP</div>
                <div className="font-bold text-lg">{survivor.huntXP}</div>
              </div>
            </div>

            {/* Secondary Stats */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-background/40 rounded px-2 py-1 text-center">
                <div>Survival</div>
                <div className="font-bold text-lg">{survivor.survival}</div>
              </div>
              <div className="bg-background/40 rounded px-2 py-1 text-center">
                <div>Insanity</div>
                <div className="font-bold text-lg">{survivor.insanity}</div>
              </div>
            </div>

            {/* Tertiary Stats */}
            {survivor.weaponProficiencyType && (
              <div className="grid grid-cols-1 text-xs">
                <div className="bg-background/20 rounded px-2 py-1 text-center">
                  <div className="text-xs truncate">
                    {survivor.weaponProficiencyType}
                  </div>
                  <div className="font-semibold">
                    {survivor.weaponProficiency}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Selection Indicators */}
          {isSelectedAsSurvivor && (
            <div className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1">
              <UsersIcon className="h-3 w-3" />
            </div>
          )}

          {isCurrentlySelected && (
            <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1">
              <UserCheckIcon className="h-3 w-3" />
            </div>
          )}
        </Button>
      </HoverCardTrigger>

      <HoverCardContent className="p-0 w-auto w-[400px] border-1 bg-gradient-to-br from-background to-background/95">
        <div className="bg-muted/30 border-b border-border/30 p-2">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-background bg-muted/30 shadow-lg items-center justify-center">
              <AvatarFallback className="font-bold text-xl bg-muted/30 from-primary/20 to-primary/10 flex">
                {survivor.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-md leading-tight truncate">
                {survivor.name}
              </h3>
              <p className="text-sm text-muted-foreground">{survivor.gender}</p>
            </div>
          </div>
        </div>

        <CardContent className="p-4 space-y-4">
          {/* Core Stats Section */}
          <div className="grid grid-cols-4 gap-3">
            <div className="bg-gradient-to-br from-blue-950/30 to-blue-900/20 rounded-lg p-3 text-center border border-blue-800/30">
              <div className="text-xs font-medium text-blue-300">Hunt XP</div>
              <div className="text-xl font-bold text-blue-100">
                {survivor.huntXP}
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-950/30 to-green-900/20 rounded-lg p-3 text-center border border-green-800/30">
              <div className="text-xs font-medium text-green-300">Survival</div>
              <div className="text-xl font-bold text-green-100">
                {survivor.survival}
              </div>
            </div>
            <div className="bg-gradient-to-br from-red-950/30 to-red-900/20 rounded-lg p-3 text-center border border-red-800/30">
              <div className="text-xs font-medium text-red-300">Insanity</div>
              <div className="text-xl font-bold text-red-100">
                {survivor.insanity}
              </div>
            </div>
            {survivor.weaponProficiencyType && (
              <div className="bg-gradient-to-br from-purple-950/30 to-purple-900/20 rounded-lg p-3 text-center border border-purple-800/30">
                <div className="text-xs font-medium text-purple-300 truncate">
                  {survivor.weaponProficiencyType}
                </div>
                <div className="text-xl font-bold text-purple-100">
                  {survivor.weaponProficiency}
                </div>
              </div>
            )}
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Fighting Arts */}
            {(survivor.fightingArts.length > 0 ||
              survivor.secretFightingArts.length > 0) && (
              <div className="bg-muted/20 rounded-lg border border-border/30 overflow-hidden">
                <div className="bg-muted/40 px-3 py-2 border-b border-border/30">
                  <h4 className="text-sm font-semibold">Fighting Arts</h4>
                </div>
                <div className="p-3 space-y-1 max-h-32 overflow-y-auto">
                  {survivor.fightingArts.map((art, index) => (
                    <div
                      key={index}
                      className="text-xs bg-gradient-to-r from-yellow-900/30 to-yellow-800/20 border border-yellow-700/30 rounded px-2 py-1">
                      {art}
                    </div>
                  ))}
                  {survivor.secretFightingArts.map((art, index) => (
                    <div
                      key={index}
                      className="text-xs bg-gradient-to-r from-yellow-900/30 to-yellow-800/20 border border-yellow-700/30 rounded px-2 py-1">
                      {art}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Disorders */}
            {survivor.disorders.length > 0 && (
              <div className="bg-muted/20 rounded-lg border border-border/30 overflow-hidden">
                <div className="bg-muted/40 px-3 py-2 border-b border-border/30">
                  <h4 className="text-sm font-semibold">Disorders</h4>
                </div>
                <div className="p-3 space-y-1 max-h-32 overflow-y-auto">
                  {survivor.disorders.map((disorder, index) => (
                    <div
                      key={index}
                      className="text-xs bg-red-950/30 border border-red-800/30 rounded px-2 py-1">
                      {disorder}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Abilities & Impairments */}
            {survivor.abilitiesAndImpairments.length > 0 && (
              <div className="bg-muted/20 rounded-lg border border-border/30 overflow-hidden">
                <div className="bg-muted/40 px-3 py-2 border-b border-border/30">
                  <h4 className="text-sm font-semibold">
                    Abilities & Impairments
                  </h4>
                </div>
                <div className="p-3 space-y-1 max-h-32 overflow-y-auto">
                  {survivor.abilitiesAndImpairments.map((ability, index) => (
                    <div
                      key={index}
                      className="text-xs bg-background/60 rounded px-2 py-1">
                      {ability}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Philosophy */}
            {survivor.philosophy && (
              <div className="bg-muted/20 rounded-lg border border-border/30 overflow-hidden">
                <div className="bg-muted/40 px-3 py-2 border-b border-border/30">
                  <h4 className="text-sm font-semibold">Philosophy</h4>
                </div>
                <div className="p-3 space-y-2">
                  <div className="bg-background/60 rounded px-2 py-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-medium">{survivor.philosophy}</span>
                      <span className="text-muted-foreground">
                        Rank {survivor.philosophyRank}
                      </span>
                    </div>
                  </div>
                  {survivor.tenetKnowledge && (
                    <div className="text-xs bg-blue-950/30 border border-blue-800/30 rounded px-2 py-1">
                      {survivor.tenetKnowledge}
                    </div>
                  )}
                  {survivor.neurosis && (
                    <div className="text-xs bg-orange-950/30 border border-orange-800/30 rounded px-2 py-1">
                      {survivor.neurosis}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Knowledge */}
            {(survivor.knowledge1 || survivor.knowledge2) && (
              <div className="bg-muted/20 rounded-lg border border-border/30 overflow-hidden">
                <div className="bg-muted/40 px-3 py-2 border-b border-border/30">
                  <h4 className="text-sm font-semibold">Knowledge</h4>
                </div>
                <div className="p-3 space-y-1">
                  {survivor.knowledge1 && (
                    <div className="text-xs bg-blue-950/30 border border-blue-800/30 rounded px-2 py-1">
                      {survivor.knowledge1}
                    </div>
                  )}
                  {survivor.knowledge2 && (
                    <div className="text-xs bg-blue-950/30 border border-blue-800/30 rounded px-2 py-1">
                      {survivor.knowledge2}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </HoverCardContent>
    </HoverCard>
  )
}
