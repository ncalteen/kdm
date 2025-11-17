'use client'

import { NumericInput } from '@/components/menu/numeric-input'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Settlement } from '@/schemas/settlement'
import { Showdown } from '@/schemas/showdown'
import { Survivor } from '@/schemas/survivor'
import { ReactElement } from 'react'

/**
 * Showdown Survivor Attributes Component Properties
 */
interface ShowdownSurvivorAttributesProps {
  /** Survivor */
  survivor: Partial<Survivor>
  /** Selected Showdown */
  selectedShowdown: Partial<Showdown> | null
  /** Selected Settlement */
  selectedSettlement: Partial<Settlement> | null
  /** Is Mobile */
  isMobile: boolean
  /** Update Survival */
  updateSurvival: (val: string) => void
  /** Update Insanity */
  updateInsanity: (val: string) => void
  /** Save Attribute Token */
  saveAttributeToken: (attributeName: string, value: number) => void
  /** Save Survivor Base Attributes */
  saveSurvivorBaseAttribute: (
    attributeName: keyof Survivor,
    value: number | boolean
  ) => void
}

/**
 * Showdown Survivor Attributes Component
 *
 * Displays the survivor attributes grid with base values, tokens, and totals
 * for Movement, Accuracy, Strength, Evasion, Luck, Speed, and optionally Lumi.
 *
 * @param props Showdown Survivor Attributes Properties
 * @returns Showdown Survivor Attributes Component
 */
export function ShowdownSurvivorAttributes({
  survivor,
  selectedShowdown,
  selectedSettlement,
  isMobile,
  updateSurvival,
  updateInsanity,
  saveAttributeToken,
  saveSurvivorBaseAttribute
}: ShowdownSurvivorAttributesProps): ReactElement {
  // Get current survivor's showdown details for token values
  const survivorShowdownDetails = selectedShowdown?.survivorDetails?.find(
    (detail) => detail.id === survivor?.id
  )

  const movementTokens = survivorShowdownDetails?.movementTokens ?? 0
  const accuracyTokens = survivorShowdownDetails?.accuracyTokens ?? 0
  const strengthTokens = survivorShowdownDetails?.strengthTokens ?? 0
  const evasionTokens = survivorShowdownDetails?.evasionTokens ?? 0
  const luckTokens = survivorShowdownDetails?.luckTokens ?? 0
  const speedTokens = survivorShowdownDetails?.speedTokens ?? 0
  const survivalTokens = survivorShowdownDetails?.survivalTokens ?? 0
  const insanityTokens = survivorShowdownDetails?.insanityTokens ?? 0

  return (
    <div className="flex flex-col justify-between gap-1 p-2">
      {/* Header */}
      <div className="flex flex-row items-center gap-2">
        <div className="w-20"></div>
        <label className="text-xs flex-1 text-center">Base</label>
        <label className="text-xs flex-1 text-center">Tokens</label>
        <label className="text-xs flex-1 text-center">Total</label>
      </div>

      {/* Survival */}
      <div className="flex flex-row items-center gap-2">
        <label className="text-xs w-20">Survival</label>

        <NumericInput
          label="Survival Base"
          value={survivor.survival ?? 0}
          onChange={(value) => updateSurvival(value.toString())}
          min={0}
          max={selectedSettlement?.survivalLimit || 1}
          readOnly={false}>
          <Input
            id={`survival-base-${survivor.id}`}
            type="number"
            value={survivor.survival}
            readOnly={isMobile}
            onChange={(e) => updateSurvival(e.target.value)}
            className={`flex-1 h-12 text-center no-spinners text-xl ${
              !survivor.canSpendSurvival
                ? 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                : ''
            }`}
            min="0"
            max={selectedSettlement?.survivalLimit || 1}
            name={`survival-base-${survivor.id}`}
          />
        </NumericInput>

        <NumericInput
          label="Survival Tokens"
          value={survivalTokens}
          onChange={(value) => saveAttributeToken('survivalTokens', value)}
          readOnly={false}>
          <Input
            id={`survival-tokens-${survivor.id}`}
            type="number"
            value={survivalTokens}
            onChange={(e) =>
              saveAttributeToken(
                'survivalTokens',
                parseInt(e.target.value) || 0
              )
            }
            className={`flex-1 h-12 text-center no-spinners text-xl ${
              !survivor.canSpendSurvival
                ? 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                : ''
            }`}
            name={`survival-tokens-${survivor.id}`}
          />
        </NumericInput>

        <Input
          id={`survival-total-${survivor.id}`}
          type="number"
          value={(survivor.survival ?? 0) + survivalTokens}
          className={`flex-1 h-12 text-center no-spinners text-xl ${
            !survivor.canSpendSurvival
              ? 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400'
              : ''
          }`}
          name={`survival-total-${survivor.id}`}
          readOnly={true}
          disabled={true}
        />
      </div>

      {/* Insanity */}
      <div className="flex flex-row items-center gap-2">
        <label className="text-xs w-20">Insanity</label>

        <NumericInput
          label="Insanity Base"
          value={survivor.insanity ?? 0}
          onChange={(value) => updateInsanity(value.toString())}
          min={0}
          readOnly={false}>
          <Input
            id={`insanity-base-${survivor.id}`}
            type="number"
            value={survivor.insanity}
            readOnly={isMobile}
            onChange={(e) => updateInsanity(e.target.value)}
            className="flex-1 h-12 text-center no-spinners text-xl"
            min="0"
            name={`insanity-base-${survivor.id}`}
          />
        </NumericInput>

        <NumericInput
          label="Insanity Tokens"
          value={insanityTokens}
          onChange={(value) => saveAttributeToken('insanityTokens', value)}
          readOnly={false}>
          <Input
            id={`insanity-tokens-${survivor.id}`}
            type="number"
            value={insanityTokens}
            onChange={(e) =>
              saveAttributeToken(
                'insanityTokens',
                parseInt(e.target.value) || 0
              )
            }
            className="flex-1 h-12 text-center no-spinners text-xl"
            name={`insanity-tokens-${survivor.id}`}
          />
        </NumericInput>

        <Input
          id={`insanity-total-${survivor.id}`}
          type="number"
          value={(survivor.insanity ?? 0) + insanityTokens}
          className="flex-1 h-12 text-center no-spinners text-xl"
          name={`insanity-total-${survivor.id}`}
          readOnly={true}
          disabled={true}
        />
      </div>

      <Separator className="my-1" />

      {/* Movement */}
      <div className="flex flex-row items-center gap-2">
        <label className="text-xs w-20">Movement</label>

        <NumericInput
          label="Movement Base"
          value={survivor.movement ?? 0}
          onChange={(value) => saveSurvivorBaseAttribute('movement', value)}
          min={0}
          readOnly={false}>
          <Input
            id={`movement-base-${survivor.id}`}
            type="number"
            value={survivor.movement}
            onChange={(e) =>
              saveSurvivorBaseAttribute(
                'movement',
                parseInt(e.target.value) || 0
              )
            }
            className="flex-1 h-12 text-center no-spinners text-xl"
            min="0"
            name={`movement-base-${survivor.id}`}
          />
        </NumericInput>

        <NumericInput
          label="Movement Tokens"
          value={movementTokens}
          onChange={(value) => saveAttributeToken('movementTokens', value)}
          readOnly={false}>
          <Input
            id={`movement-tokens-${survivor.id}`}
            type="number"
            value={movementTokens}
            onChange={(e) =>
              saveAttributeToken(
                'movementTokens',
                parseInt(e.target.value) || 0
              )
            }
            className="flex-1 h-12 text-center no-spinners text-xl"
            name={`movement-tokens-${survivor.id}`}
          />
        </NumericInput>

        <Input
          id={`movement-total-${survivor.id}`}
          type="number"
          value={(survivor.movement ?? 0) + movementTokens}
          className="flex-1 h-12 text-center no-spinners text-xl"
          name={`movement-total-${survivor.id}`}
          readOnly={true}
          disabled={true}
        />
      </div>

      {/* Accuracy */}
      <div className="flex flex-row items-center gap-2">
        <label className="text-xs w-20">Accuracy</label>

        <NumericInput
          label="Accuracy Base"
          value={survivor.accuracy ?? 0}
          onChange={(value) => saveSurvivorBaseAttribute('accuracy', value)}
          min={0}
          readOnly={false}>
          <Input
            id={`accuracy-base-${survivor.id}`}
            type="number"
            value={survivor.accuracy}
            onChange={(e) =>
              saveSurvivorBaseAttribute(
                'accuracy',
                parseInt(e.target.value) || 0
              )
            }
            className="flex-1 h-12 text-center no-spinners text-xl"
            min="0"
            name={`accuracy-base-${survivor.id}`}
          />
        </NumericInput>

        <NumericInput
          label="Accuracy Tokens"
          value={accuracyTokens}
          onChange={(value) => saveAttributeToken('accuracyTokens', value)}
          readOnly={false}>
          <Input
            id={`accuracy-tokens-${survivor.id}`}
            type="number"
            value={accuracyTokens}
            onChange={(e) =>
              saveAttributeToken(
                'accuracyTokens',
                parseInt(e.target.value) || 0
              )
            }
            className="flex-1 h-12 text-center no-spinners text-xl"
            name={`accuracy-tokens-${survivor.id}`}
          />
        </NumericInput>

        <Input
          id={`accuracy-total-${survivor.id}`}
          type="number"
          value={(survivor.accuracy ?? 0) + accuracyTokens}
          className="flex-1 h-12 text-center no-spinners text-xl"
          name={`accuracy-total-${survivor.id}`}
          readOnly={true}
          disabled={true}
        />
      </div>

      {/* Strength */}
      <div className="flex flex-row items-center gap-2">
        <label className="text-xs w-20">Strength</label>

        <NumericInput
          label="Strength Base"
          value={survivor.strength ?? 0}
          onChange={(value) => saveSurvivorBaseAttribute('strength', value)}
          min={0}
          readOnly={false}>
          <Input
            id={`strength-base-${survivor.id}`}
            type="number"
            value={survivor.strength}
            onChange={(e) =>
              saveSurvivorBaseAttribute(
                'strength',
                parseInt(e.target.value) || 0
              )
            }
            className="flex-1 h-12 text-center no-spinners text-xl"
            min="0"
            name={`strength-base-${survivor.id}`}
          />
        </NumericInput>

        <NumericInput
          label="Strength Tokens"
          value={strengthTokens}
          onChange={(value) => saveAttributeToken('strengthTokens', value)}
          readOnly={false}>
          <Input
            id={`strength-tokens-${survivor.id}`}
            type="number"
            value={strengthTokens}
            onChange={(e) =>
              saveAttributeToken(
                'strengthTokens',
                parseInt(e.target.value) || 0
              )
            }
            className="flex-1 h-12 text-center no-spinners text-xl"
            name={`strength-tokens-${survivor.id}`}
          />
        </NumericInput>

        <Input
          id={`strength-total-${survivor.id}`}
          type="number"
          value={(survivor.strength ?? 0) + strengthTokens}
          className="flex-1 h-12 text-center no-spinners text-xl"
          name={`strength-total-${survivor.id}`}
          readOnly={true}
          disabled={true}
        />
      </div>

      {/* Evasion */}
      <div className="flex flex-row items-center gap-2">
        <label className="text-xs w-20">Evasion</label>

        <NumericInput
          label="Evasion Base"
          value={survivor.evasion ?? 0}
          onChange={(value) => saveSurvivorBaseAttribute('evasion', value)}
          min={0}
          readOnly={false}>
          <Input
            id={`evasion-base-${survivor.id}`}
            type="number"
            value={survivor.evasion}
            onChange={(e) =>
              saveSurvivorBaseAttribute(
                'evasion',
                parseInt(e.target.value) || 0
              )
            }
            className="flex-1 h-12 text-center no-spinners text-xl"
            min="0"
            name={`evasion-base-${survivor.id}`}
          />
        </NumericInput>

        <NumericInput
          label="Evasion Tokens"
          value={evasionTokens}
          onChange={(value) => saveAttributeToken('evasionTokens', value)}
          readOnly={false}>
          <Input
            id={`evasion-tokens-${survivor.id}`}
            type="number"
            value={evasionTokens}
            onChange={(e) =>
              saveAttributeToken('evasionTokens', parseInt(e.target.value) || 0)
            }
            className="flex-1 h-12 text-center no-spinners text-xl"
            name={`evasion-tokens-${survivor.id}`}
          />
        </NumericInput>

        <Input
          id={`evasion-total-${survivor.id}`}
          type="number"
          value={(survivor.evasion ?? 0) + evasionTokens}
          className="flex-1 h-12 text-center no-spinners text-xl"
          name={`evasion-total-${survivor.id}`}
          readOnly={true}
          disabled={true}
        />
      </div>

      {/* Luck */}
      <div className="flex flex-row items-center gap-2">
        <label className="text-xs w-20">Luck</label>

        <NumericInput
          label="Luck Base"
          value={survivor.luck ?? 0}
          onChange={(value) => saveSurvivorBaseAttribute('luck', value)}
          min={0}
          readOnly={false}>
          <Input
            id={`luck-base-${survivor.id}`}
            type="number"
            value={survivor.luck}
            onChange={(e) =>
              saveSurvivorBaseAttribute('luck', parseInt(e.target.value) || 0)
            }
            className="flex-1 h-12 text-center no-spinners text-xl"
            min="0"
            name={`luck-base-${survivor.id}`}
          />
        </NumericInput>

        <NumericInput
          label="Luck Tokens"
          value={luckTokens}
          onChange={(value) => saveAttributeToken('luckTokens', value)}
          readOnly={false}>
          <Input
            id={`luck-tokens-${survivor.id}`}
            type="number"
            value={luckTokens}
            onChange={(e) =>
              saveAttributeToken('luckTokens', parseInt(e.target.value) || 0)
            }
            className="flex-1 h-12 text-center no-spinners text-xl"
            name={`luck-tokens-${survivor.id}`}
          />
        </NumericInput>

        <Input
          id={`luck-total-${survivor.id}`}
          type="number"
          value={(survivor.luck ?? 0) + luckTokens}
          className="flex-1 h-12 text-center no-spinners text-xl"
          name={`luck-total-${survivor.id}`}
          readOnly={true}
          disabled={true}
        />
      </div>

      {/* Speed */}
      <div className="flex flex-row items-center gap-2">
        <label className="text-xs w-20">Speed</label>

        <NumericInput
          label="Speed Base"
          value={survivor.speed ?? 0}
          onChange={(value) => saveSurvivorBaseAttribute('speed', value)}
          min={0}
          readOnly={false}>
          <Input
            id={`speed-base-${survivor.id}`}
            type="number"
            value={survivor.speed}
            onChange={(e) =>
              saveSurvivorBaseAttribute('speed', parseInt(e.target.value) || 0)
            }
            className="flex-1 h-12 text-center no-spinners text-xl"
            min="0"
            name={`speed-base-${survivor.id}`}
          />
        </NumericInput>

        <NumericInput
          label="Speed Tokens"
          value={speedTokens}
          onChange={(value) => saveAttributeToken('speedTokens', value)}
          readOnly={false}>
          <Input
            id={`speed-tokens-${survivor.id}`}
            type="number"
            value={speedTokens}
            onChange={(e) =>
              saveAttributeToken('speedTokens', parseInt(e.target.value) || 0)
            }
            className="flex-1 h-12 text-center no-spinners text-xl"
            name={`speed-tokens-${survivor.id}`}
          />
        </NumericInput>

        <Input
          id={`speed-total-${survivor.id}`}
          type="number"
          value={(survivor.speed ?? 0) + speedTokens}
          className="flex-1 h-12 text-center no-spinners text-xl"
          name={`speed-total-${survivor.id}`}
          readOnly={true}
          disabled={true}
        />
      </div>
    </div>
  )
}
