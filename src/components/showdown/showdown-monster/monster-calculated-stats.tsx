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
 * Monster Calculated Stats Properties
 */
interface MonsterCalculatedStatsProps {
  /** Selected Showdown */
  selectedShowdown: Showdown | null
  /** Selected Showdown Monster Index */
  selectedShowdownMonsterIndex: number
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
 * Monster Calculated Stats Component
 *
 * Displays calculated combat statistics for the monster during a showdown,
 * showing base values, tokens, and modifiers from the monster, as well as
 * adjustments based on the selected survivor.
 *
 * @param props Monster Calculated Stats Properties
 * @returns Monster Calculated Stats Component
 */
export function MonsterCalculatedStats({
  selectedShowdown,
  selectedShowdownMonsterIndex,
  selectedSurvivor
}: MonsterCalculatedStatsProps): ReactElement {
  // Get survivor showdown details (for tokens)
  const survivorDetails = selectedShowdown?.survivorDetails.find(
    (sd) => sd.id === selectedSurvivor?.id
  )

  const monster = selectedShowdown?.monsters?.[selectedShowdownMonsterIndex]

  return (
    <>
      <CalculatedStatRow
        label="Damage"
        baseValue={monster?.damage ?? 0}
        tokens={monster?.damageTokens ?? 0}
        tooltip="(Monster Damage + Tokens)"
      />
      <Separator />
      <CalculatedStatRow
        label="Movement"
        baseValue={monster?.movement ?? 0}
        tokens={monster?.movementTokens ?? 0}
        tooltip="(Monster Movement + Tokens)"
      />
      <Separator />
      <CalculatedStatRow
        label="Accuracy"
        baseValue={monster?.accuracy ?? 0}
        tokens={monster?.accuracyTokens ?? 0}
        modifierLabel="Survivor Evasion"
        modifierValue={selectedSurvivor?.evasion ?? 0}
        modifierTokens={survivorDetails?.evasionTokens ?? 0}
        tooltip="(Monster Accuracy + Tokens) - (Survivor Evasion + Tokens)"
      />
      <Separator />
      <CalculatedStatRow
        label="Strength"
        baseValue={monster?.strength ?? 0}
        tokens={monster?.strengthTokens ?? 0}
        tooltip="(Monster Strength + Tokens)"
      />
      <Separator />
      <CalculatedStatRow
        label="Evasion"
        baseValue={monster?.evasion ?? 0}
        tokens={monster?.evasionTokens ?? 0}
        modifierLabel="Survivor Accuracy"
        modifierValue={selectedSurvivor?.accuracy ?? 0}
        modifierTokens={survivorDetails?.accuracyTokens ?? 0}
        tooltip="(Monster Evasion + Tokens) - (Survivor Accuracy + Tokens)"
      />
      <Separator />
      <CalculatedStatRow
        label="Luck"
        baseValue={monster?.luck ?? 0}
        tokens={monster?.luckTokens ?? 0}
        modifierLabel="Survivor Luck"
        modifierValue={selectedSurvivor?.luck ?? 0}
        modifierTokens={survivorDetails?.luckTokens ?? 0}
        tooltip="(Monster Luck + Tokens) - (Survivor Luck + Tokens)"
      />
      <Separator />
      <CalculatedStatRow
        label="Speed"
        baseValue={monster?.speed ?? 0}
        tokens={monster?.speedTokens ?? 0}
        tooltip="(Monster Speed + Tokens)"
      />
    </>
  )
}
