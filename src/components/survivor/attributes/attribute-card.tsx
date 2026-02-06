'use client'

import { NumericInput } from '@/components/menu/numeric-input'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { SurvivorCardMode, SurvivorType } from '@/lib/enums'
import {
  SURVIVOR_ACCURACY_UPDATED_MESSAGE,
  SURVIVOR_EVASION_UPDATED_MESSAGE,
  SURVIVOR_LUCK_UPDATED_MESSAGE,
  SURVIVOR_LUMI_UPDATED_MESSAGE,
  SURVIVOR_MOVEMENT_UPDATED_MESSAGE,
  SURVIVOR_SPEED_UPDATED_MESSAGE,
  SURVIVOR_STRENGTH_UPDATED_MESSAGE
} from '@/lib/messages'
import { Hunt } from '@/schemas/hunt'
import { Settlement } from '@/schemas/settlement'
import { Showdown } from '@/schemas/showdown'
import { Survivor } from '@/schemas/survivor'
import { ReactElement, useMemo } from 'react'

/**
 * Attribute Card Properties
 */
interface AttributeCardProps {
  /** Mode */
  mode: SurvivorCardMode
  /** Save Selected Hunt */
  saveSelectedHunt?: (data: Partial<Hunt>, successMsg?: string) => void
  /** Save Selected Showdown */
  saveSelectedShowdown?: (data: Partial<Showdown>, successMsg?: string) => void
  /** Save Selected Survivor */
  saveSelectedSurvivor?: (data: Partial<Survivor>, successMsg?: string) => void
  /** Selected Hunt */
  selectedHunt: Hunt | null
  /** Selected Settlemenet */
  selectedSettlement: Settlement | null
  /** Selected Showdown */
  selectedShowdown: Showdown | null
  /** Selected Survivor */
  selectedSurvivor: Survivor | null
  /** Disabled */
  disabled?: boolean
}

/**
 * Survivor Attribute Card Component
 *
 * This component displays the survivor's core attributes (movement, accuracy,
 * strength, etc.) and allows them to be edited. For Arc survivors, it also
 * shows the Lumi attribute.
 *
 * @param props Attribute Card Properties
 * @returns Attribute Card Component
 */
export function AttributeCard({
  mode,
  saveSelectedHunt,
  saveSelectedShowdown,
  saveSelectedSurvivor,
  selectedHunt,
  selectedSettlement,
  selectedShowdown,
  selectedSurvivor,
  disabled = false
}: AttributeCardProps): ReactElement {
  /**
   * Save Tokens
   *
   * Saves to either hunt or showdown based on mode
   *
   * @param tokenName Token attribute name
   * @param value New value
   */
  const saveTokens = (
    tokenName:
      | 'accuracyTokens'
      | 'evasionTokens'
      | 'luckTokens'
      | 'movementTokens'
      | 'speedTokens'
      | 'strengthTokens',
    value: number
  ) => {
    if (!selectedSurvivor?.id) return

    if (mode === SurvivorCardMode.SHOWDOWN_CARD) {
      if (!saveSelectedShowdown || !selectedShowdown) return

      // Get current survivor details or create new one
      const updatedDetails = [...selectedShowdown.survivorDetails]
      const survivorDetailIndex = selectedShowdown.survivorDetails.findIndex(
        (sd) => sd.id === selectedSurvivor.id
      )

      if (survivorDetailIndex >= 0)
        // Update existing survivor details
        updatedDetails[survivorDetailIndex] = {
          ...updatedDetails[survivorDetailIndex],
          [tokenName]: value
        }
      else
        // Create new survivor details entry
        updatedDetails.push({
          accuracyTokens: 0,
          bleedingTokens: 0,
          blockTokens: 0,
          deflectTokens: 0,
          evasionTokens: 0,
          id: selectedSurvivor.id!,
          insanityTokens: 0,
          knockedDown: false,
          luckTokens: 0,
          movementTokens: 0,
          notes: '',
          priorityTarget: false,
          speedTokens: 0,
          strengthTokens: 0,
          survivalTokens: 0,
          [tokenName]: value
        })

      saveSelectedShowdown({
        survivorDetails: updatedDetails
      })
    } else if (mode === SurvivorCardMode.HUNT_CARD) {
      if (!saveSelectedHunt || !selectedHunt) return

      // Get current survivor details or create new one
      const updatedDetails = [...selectedHunt.survivorDetails]
      const survivorDetailIndex = selectedHunt.survivorDetails.findIndex(
        (sd) => sd.id === selectedSurvivor.id
      )

      if (survivorDetailIndex >= 0)
        // Update existing survivor details
        updatedDetails[survivorDetailIndex] = {
          ...updatedDetails[survivorDetailIndex],
          [tokenName]: value
        }
      else
        // Create new survivor details entry
        updatedDetails.push({
          accuracyTokens: 0,
          evasionTokens: 0,
          id: selectedSurvivor.id!,
          insanityTokens: 0,
          luckTokens: 0,
          movementTokens: 0,
          notes: '',
          speedTokens: 0,
          strengthTokens: 0,
          survivalTokens: 0,
          [tokenName]: value
        })

      saveSelectedHunt({
        survivorDetails: updatedDetails
      })
    }
  }

  const columnCount = useMemo(() => {
    return selectedSettlement?.survivorType === SurvivorType.ARC
      ? mode === SurvivorCardMode.SHOWDOWN_CARD ||
        mode === SurvivorCardMode.HUNT_CARD
        ? 'grid-cols-8'
        : 'grid-cols-7'
      : mode === SurvivorCardMode.SHOWDOWN_CARD ||
          mode === SurvivorCardMode.HUNT_CARD
        ? 'grid-cols-7'
        : 'grid-cols-6'
  }, [selectedSettlement?.survivorType, mode])

  const survivorDetails = useMemo(
    () =>
      selectedShowdown?.survivorDetails?.find(
        (sd) => sd.id === selectedSurvivor?.id
      ) ?? {
        accuracyTokens: 0,
        bleedingTokens: 0,
        blockTokens: 0,
        deflectTokens: 0,
        evasionTokens: 0,
        id: 0,
        insanityTokens: 0,
        knockedDown: false,
        luckTokens: 0,
        movementTokens: 0,
        notes: '',
        priorityTarget: false,
        speedTokens: 0,
        strengthTokens: 0,
        survivalTokens: 0
      },
    [selectedShowdown, selectedSurvivor?.id]
  )

  return (
    <Card className="p-2 border-0">
      <CardContent className={`grid ${columnCount} gap-2 p-0`}>
        {/* Label Row */}
        {(mode === SurvivorCardMode.SHOWDOWN_CARD ||
          mode === SurvivorCardMode.HUNT_CARD) && <div className="max-w-12" />}
        <div className="flex items-center justify-center">
          <Label className="text-xs">Movement</Label>
        </div>
        <div className="flex items-center justify-center">
          <Label className="text-xs">Accuracy</Label>
        </div>
        <div className="flex items-center justify-center">
          <Label className="text-xs">Strength</Label>
        </div>
        <div className="flex items-center justify-center">
          <Label className="text-xs">Evasion</Label>
        </div>
        <div className="flex items-center justify-center">
          <Label className="text-xs">Luck</Label>
        </div>
        <div className="flex items-center justify-center">
          <Label className="text-xs">Speed</Label>
        </div>
        {selectedSettlement?.survivorType === SurvivorType.ARC && (
          <div className="flex items-center justify-center">
            <Label className="text-xs">Lumi</Label>
          </div>
        )}

        {(mode === SurvivorCardMode.SHOWDOWN_CARD ||
          mode === SurvivorCardMode.HUNT_CARD) && (
          <Label className="text-xs flex items-center justify-center max-w-12">
            Base
          </Label>
        )}

        {/* Movement */}
        <div className="flex flex-col items-center gap-1">
          <NumericInput
            label="Movement"
            value={selectedSurvivor?.movement ?? 1}
            min={1}
            onChange={(value) => {
              if (saveSelectedSurvivor)
                saveSelectedSurvivor(
                  {
                    movement: value
                  },
                  SURVIVOR_MOVEMENT_UPDATED_MESSAGE()
                )
            }}
            className="w-12 h-12 text-xl sm:text-xl md:text-xl focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
            disabled={disabled}
          />
        </div>

        {/* Accuracy */}
        <div className="flex flex-col items-center gap-1">
          <NumericInput
            label="Accuracy"
            value={selectedSurvivor?.accuracy ?? 0}
            onChange={(value) => {
              if (saveSelectedSurvivor)
                saveSelectedSurvivor(
                  {
                    accuracy: value
                  },
                  SURVIVOR_ACCURACY_UPDATED_MESSAGE()
                )
            }}
            className="w-12 h-12 text-xl sm:text-xl md:text-xl focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
            disabled={disabled}
          />
        </div>

        {/* Strength */}
        <div className="flex flex-col items-center gap-1">
          <NumericInput
            label="Strength"
            value={selectedSurvivor?.strength ?? 0}
            onChange={(value) => {
              if (saveSelectedSurvivor)
                saveSelectedSurvivor(
                  {
                    strength: value
                  },
                  SURVIVOR_STRENGTH_UPDATED_MESSAGE()
                )
            }}
            className="w-12 h-12 text-xl sm:text-xl md:text-xl focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
            disabled={disabled}
          />
        </div>

        {/* Evasion */}
        <div className="flex flex-col items-center gap-1">
          <NumericInput
            label="Evasion"
            value={selectedSurvivor?.evasion ?? 0}
            onChange={(value) => {
              if (saveSelectedSurvivor)
                saveSelectedSurvivor(
                  {
                    evasion: value
                  },
                  SURVIVOR_EVASION_UPDATED_MESSAGE()
                )
            }}
            className="w-12 h-12 text-xl sm:text-xl md:text-xl focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
            disabled={disabled}
          />
        </div>

        {/* Luck */}
        <div className="flex flex-col items-center gap-1">
          <NumericInput
            label="Luck"
            value={selectedSurvivor?.luck ?? 0}
            onChange={(value) => {
              if (saveSelectedSurvivor)
                saveSelectedSurvivor(
                  {
                    luck: value
                  },
                  SURVIVOR_LUCK_UPDATED_MESSAGE()
                )
            }}
            className="w-12 h-12 text-xl sm:text-xl md:text-xl focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
            disabled={disabled}
          />
        </div>

        {/* Speed */}
        <div className="flex flex-col items-center gap-1">
          <NumericInput
            label="Speed"
            value={selectedSurvivor?.speed ?? 0}
            onChange={(value) => {
              if (saveSelectedSurvivor)
                saveSelectedSurvivor(
                  {
                    speed: value
                  },
                  SURVIVOR_SPEED_UPDATED_MESSAGE()
                )
            }}
            className="w-12 h-12 text-xl sm:text-xl md:text-xl focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
            disabled={disabled}
          />
        </div>

        {/* Lumi (Arc) */}
        {selectedSettlement?.survivorType === SurvivorType.ARC && (
          <div className="flex flex-col items-center gap-1">
            <NumericInput
              label="Lumi"
              value={selectedSurvivor?.lumi ?? 0}
              min={0}
              onChange={(value) => {
                if (saveSelectedSurvivor)
                  saveSelectedSurvivor(
                    {
                      lumi: value
                    },
                    SURVIVOR_LUMI_UPDATED_MESSAGE()
                  )
              }}
              className="w-12 h-12 text-xl sm:text-xl md:text-xl focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
              disabled={disabled}
            />
          </div>
        )}

        {(mode === SurvivorCardMode.SHOWDOWN_CARD ||
          mode === SurvivorCardMode.HUNT_CARD) && (
          <>
            <Label className="text-xs text-center flex items-center justify-center max-w-12">
              Tokens
            </Label>

            {/* Movement Tokens */}
            <div className="flex flex-col items-center gap-1">
              <NumericInput
                label="Movement Tokens"
                value={survivorDetails.movementTokens}
                onChange={(value) => saveTokens('movementTokens', value)}
                className="w-12 h-12 text-xl sm:text-xl md:text-xl focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-muted!"
                disabled={disabled}
              />
            </div>

            {/* Accuracy Tokens */}
            <div className="flex flex-col items-center gap-1">
              <NumericInput
                label="Accuracy Tokens"
                value={survivorDetails.accuracyTokens}
                onChange={(value) => saveTokens('accuracyTokens', value)}
                className="w-12 h-12 text-xl sm:text-xl md:text-xl focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-muted!"
                disabled={disabled}
              />
            </div>

            {/* Strength Tokens */}
            <div className="flex flex-col items-center gap-1">
              <NumericInput
                label="Strength Tokens"
                value={survivorDetails.strengthTokens}
                onChange={(value) => saveTokens('strengthTokens', value)}
                className="w-12 h-12 text-xl sm:text-xl md:text-xl focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-muted!"
                disabled={disabled}
              />
            </div>

            {/* Evasion Tokens */}
            <div className="flex flex-col items-center gap-1">
              <NumericInput
                label="Evasion Tokens"
                value={survivorDetails.evasionTokens}
                onChange={(value) => saveTokens('evasionTokens', value)}
                className="w-12 h-12 text-xl sm:text-xl md:text-xl focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-muted!"
                disabled={disabled}
              />
            </div>

            {/* Luck Tokens */}
            <div className="flex flex-col items-center gap-1">
              <NumericInput
                label="Luck Tokens"
                value={survivorDetails.luckTokens}
                onChange={(value) => saveTokens('luckTokens', value)}
                className="w-12 h-12 text-xl sm:text-xl md:text-xl focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-muted!"
                disabled={disabled}
              />
            </div>

            {/* Speed Tokens */}
            <div className="flex flex-col items-center gap-1">
              <NumericInput
                label="Speed Tokens"
                value={survivorDetails.speedTokens}
                onChange={(value) => saveTokens('speedTokens', value)}
                className="w-12 h-12 text-xl sm:text-xl md:text-xl focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-muted!"
                disabled={disabled}
              />
            </div>

            {/* Lumi (Arc) - No Tokens */}
            {selectedSettlement?.survivorType === SurvivorType.ARC && <div />}
          </>
        )}
      </CardContent>
    </Card>
  )
}
