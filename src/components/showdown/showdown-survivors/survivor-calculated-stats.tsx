'use client'

import { Separator } from '@/components/ui/separator'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { Showdown } from '@/schemas/showdown'
import { Survivor } from '@/schemas/survivor'
import { ReactElement } from 'react'

/**
 * Survivor Calculated Stats Properties
 */
interface SurvivorCalculatedStatsProps {
  /** Selected Showdown */
  selectedShowdown: Showdown | null
  /** Selected Survivor */
  selectedSurvivor: Survivor | null
}

/**
 * Calculated Stat Row Component
 *
 * Displays a single row of calculated stats including base value, tokens,
 * modifiers, and final value.
 */
function CalculatedStatRow({
  label,
  baseValue,
  tokens,
  tooltip,
  modifierLabel,
  modifierValue,
  modifierTokens
}: {
  label: string
  baseValue: number
  tokens: number
  tooltip: string
  modifierLabel?: string
  modifierValue?: number
  modifierTokens?: number
}): ReactElement {
  const finalValue =
    baseValue +
    tokens -
    (modifierValue !== undefined && modifierTokens !== undefined
      ? modifierValue + modifierTokens
      : 0)

  return (
    <div className="flex items-center justify-between">
      <Tooltip>
        <TooltipTrigger className="text-sm">{label}</TooltipTrigger>
        <TooltipContent>{tooltip}</TooltipContent>
      </Tooltip>
      <div className="flex items-center gap-2 text-sm">
        {/* Display as (base + tokens) */}
        <span className="text-muted-foreground">
          ({baseValue}
          {(tokens >= 0 && ' + ') || ' - '}
          {Math.abs(tokens)})
        </span>

        {/* Only display if there is a monster modifier */}
        {modifierLabel && (
          <>
            <span className="text-muted-foreground">-</span>
            <span className="text-muted-foreground">
              ({modifierValue}
              {(modifierTokens! > 0 && ' + ') || ' - '}
              {Math.abs(modifierTokens!)})
            </span>
          </>
        )}
        <span className="font-bold min-w-[2ch] text-right">=</span>
        <span
          className={`font-bold min-w-[3ch] text-right ${
            finalValue > 0
              ? 'text-green-500'
              : finalValue < 0
                ? 'text-red-500'
                : ''
          }`}>
          {(finalValue < 0 && ' - ') || ' + '}
          {Math.abs(finalValue)}
        </span>
      </div>
    </div>
  )
}

/**
 * Survivor Calculated Stats Component
 *
 * Displays calculated combat statistics for a survivor during a showdown,
 * showing base values, tokens, and modifiers from the monster.
 *
 * @param props Survivor Calculated Stats Properties
 * @returns Survivor Calculated Stats Component
 */
export function SurvivorCalculatedStats({
  selectedShowdown,
  selectedSurvivor
}: SurvivorCalculatedStatsProps): ReactElement {
  // Get survivor showdown details (for tokens)
  const survivorDetails = selectedShowdown?.survivorDetails?.find(
    (sd) => sd.id === selectedSurvivor?.id
  )

  // Get monster stats
  const monster = selectedShowdown?.monster

  return (
    <>
      <CalculatedStatRow
        label="Accuracy"
        baseValue={selectedSurvivor?.accuracy || 0}
        tokens={survivorDetails?.accuracyTokens || 0}
        modifierLabel="Monster Evasion"
        modifierValue={monster?.evasion || 0}
        modifierTokens={monster?.evasionTokens || 0}
        tooltip="(Survivor Accuracy + Tokens) - (Monster Evasion + Tokens)"
      />
      <Separator />
      <CalculatedStatRow
        label="Strength"
        baseValue={selectedSurvivor?.strength || 0}
        tokens={survivorDetails?.strengthTokens || 0}
        tooltip="(Survivor Strength + Tokens)"
      />
      <Separator />
      <CalculatedStatRow
        label="Evasion"
        baseValue={selectedSurvivor?.evasion || 0}
        tokens={survivorDetails?.evasionTokens || 0}
        modifierLabel="Monster Accuracy"
        modifierValue={monster?.accuracy || 0}
        modifierTokens={monster?.accuracyTokens || 0}
        tooltip="(Survivor Evasion + Tokens) - (Monster Accuracy + Tokens)"
      />
      <Separator />
      <CalculatedStatRow
        label="Luck"
        baseValue={selectedSurvivor?.luck || 0}
        tokens={survivorDetails?.luckTokens || 0}
        modifierLabel="Monster Luck"
        modifierValue={monster?.luck || 0}
        modifierTokens={monster?.luckTokens || 0}
        tooltip="(Survivor Luck + Tokens) - (Monster Luck + Tokens)"
      />
      <Separator />
      <CalculatedStatRow
        label="Speed"
        baseValue={selectedSurvivor?.speed || 0}
        tokens={survivorDetails?.speedTokens || 0}
        tooltip="(Survivor Speed + Tokens)"
      />
    </>
  )
}
