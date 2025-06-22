'use client'

import { Avatar } from '@/components/ui/avatar'
import { CardContent } from '@/components/ui/card'
import { Survivor } from '@/schemas/survivor'
import { AvatarFallback } from '@radix-ui/react-avatar'
import { ReactElement } from 'react'

/**
 * Survivor Details Panel Props
 */
interface SurvivorDetailsPanelProps {
  /** Survivor to Display */
  survivor: Survivor | null
  /** Survivors */
  survivors: Survivor[] | null
}

/**
 * Survivor Details Panel Component
 *
 * This component displays detailed information about a survivor.
 *
 * @parma props Survivor Details Panel Properties
 * @returns Survivor Details Panel Component
 */
export function SurvivorDetailsPanel({
  survivor,
  survivors
}: SurvivorDetailsPanelProps): ReactElement {
  if (!survivor)
    return (
      <div className="w-[450px] h-full flex items-center justify-center text-muted-foreground">
        <div className="text-center">
          {survivors && survivors.length > 0 ? (
            <>
              <p className="text-lg font-medium">Hover over a survivor</p>
              <p className="text-sm">to view their details</p>
            </>
          ) : (
            <>
              <p className="text-lg font-medium">No survivors available</p>
            </>
          )}
        </div>
      </div>
    )

  return (
    <div className="w-[450px] h-full bg-gradient-to-br from-background to-background/95 border-2 border-border rounded-lg">
      {/* Professional Header */}
      <div className="bg-muted/30 border-b border-border/30 p-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 border-2 border-background shadow-lg items-center justify-center">
            <AvatarFallback className="font-bold text-xl from-primary/20 to-primary/10 flex items-center justify-center">
              {survivor.name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-lg leading-tight truncate text-primary">
              {survivor.name}
            </h3>
            <p className="text-sm text-muted-foreground">{survivor.gender}</p>
          </div>
        </div>
      </div>

      <CardContent className="p-4 space-y-4 max-h-[calc(60vh-120px)] overflow-y-auto">
        {/* Core Stats Section */}
        <div className="grid grid-cols-4 gap-3">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/20 rounded-lg p-3 text-center border border-blue-200/50 dark:border-blue-800/30">
            <div className="text-xs font-medium text-blue-700 dark:text-blue-300">
              Hunt XP
            </div>
            <div className="text-xl font-bold text-blue-900 dark:text-blue-100">
              {survivor.huntXP}
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/20 rounded-lg p-3 text-center border border-green-200/50 dark:border-green-800/30">
            <div className="text-xs font-medium text-green-700 dark:text-green-300">
              Survival
            </div>
            <div className="text-xl font-bold text-green-900 dark:text-green-100">
              {survivor.survival}
            </div>
          </div>
          <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/30 dark:to-red-900/20 rounded-lg p-3 text-center border border-red-200/50 dark:border-red-800/30">
            <div className="text-xs font-medium text-red-700 dark:text-red-300">
              Insanity
            </div>
            <div className="text-xl font-bold text-red-900 dark:text-red-100">
              {survivor.insanity}
            </div>
          </div>
          {survivor.weaponProficiencyType && (
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-900/20 rounded-lg p-3 text-center border border-purple-200/50 dark:border-purple-800/30">
              <div className="text-xs font-medium text-purple-700 dark:text-purple-300 truncate">
                {survivor.weaponProficiencyType}
              </div>
              <div className="text-xl font-bold text-purple-900 dark:text-purple-100">
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
                    className="text-xs bg-background/60 rounded px-2 py-1">
                    {art}
                  </div>
                ))}
                {survivor.secretFightingArts.map((art, index) => (
                  <div
                    key={index}
                    className="text-xs bg-gradient-to-r from-yellow-100 to-yellow-50 dark:from-yellow-900/30 dark:to-yellow-800/20 border border-yellow-200/50 dark:border-yellow-700/30 rounded px-2 py-1">
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
                    className="text-xs bg-red-50 dark:bg-red-950/30 border border-red-200/50 dark:border-red-800/30 rounded px-2 py-1">
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
                  <div className="text-xs bg-background/40 rounded px-2 py-1">
                    {survivor.tenetKnowledge}
                  </div>
                )}
                {survivor.neurosis && (
                  <div className="text-xs bg-orange-50 dark:bg-orange-950/30 border border-orange-200/50 dark:border-orange-800/30 rounded px-2 py-1">
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
                  <div className="text-xs bg-blue-50 dark:bg-blue-950/30 border border-blue-200/50 dark:border-blue-800/30 rounded px-2 py-1">
                    {survivor.knowledge1}
                  </div>
                )}
                {survivor.knowledge2 && (
                  <div className="text-xs bg-blue-50 dark:bg-blue-950/30 border border-blue-200/50 dark:border-blue-800/30 rounded px-2 py-1">
                    {survivor.knowledge2}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </div>
  )
}
