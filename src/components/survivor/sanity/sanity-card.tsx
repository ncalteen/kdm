'use client'

import { NumericInput } from '@/components/menu/numeric-input'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { SurvivorCardMode, SurvivorType } from '@/lib/enums'
import {
  INSANITY_MINIMUM_ERROR_MESSAGE,
  SURVIVOR_ATTRIBUTE_TOKEN_UPDATED_MESSAGE,
  SURVIVOR_BRAIN_LIGHT_DAMAGE_UPDATED_MESSAGE,
  SURVIVOR_INSANITY_UPDATED_MESSAGE,
  SURVIVOR_TORMENT_UPDATED_MESSAGE,
  TORMENT_MINIMUM_ERROR_MESSAGE
} from '@/lib/messages'
import { Hunt } from '@/schemas/hunt'
import { Settlement } from '@/schemas/settlement'
import { Showdown } from '@/schemas/showdown'
import { Survivor } from '@/schemas/survivor'
import { BrainIcon, Shield } from 'lucide-react'
import { ReactElement, useMemo } from 'react'
import { toast } from 'sonner'

/**
 * Sanity Card Properties
 */
interface SanityCardProps {
  /** Display Text */
  displayText: boolean
  /** Display Torment Input */
  displayTormentInput: boolean
  /** Mode */
  mode: SurvivorCardMode
  /** Save Selected Hunt */
  saveSelectedHunt?: (data: Partial<Hunt>, successMsg?: string) => void
  /** Save Selected Showdown */
  saveSelectedShowdown?: (data: Partial<Showdown>, successMsg?: string) => void
  /** Save Selected Survivor */
  saveSelectedSurvivor: (data: Partial<Survivor>, successMsg: string) => void
  /** Selected Hunt */
  selectedHunt: Hunt | null
  /** Selected Settlemenet */
  selectedSettlement: Settlement | null
  /** Selected Showdown */
  selectedShowdown: Showdown | null
  /** Selected Survivor */
  selectedSurvivor: Survivor | null
}

/**
 * Survivor Sanity Card Component
 *
 * This component displays the survivor's insanity level and brain state. It
 * includes an insanity counter and a checkbox for light brain damage. For Arc
 * survivors, it also shows the Torment attribute.
 *
 * @param props Sanity Card Properties
 * @returns Sanity Card Component
 */
export function SanityCard({
  displayText,
  displayTormentInput,
  mode,
  saveSelectedHunt,
  saveSelectedShowdown,
  saveSelectedSurvivor,
  selectedHunt,
  selectedSettlement,
  selectedShowdown,
  selectedSurvivor
}: SanityCardProps): ReactElement {
  /**
   * Save Insanity Tokens
   *
   * Saves to hunt or showdown based on the mode.
   *
   * @param value New value
   */
  const saveInsanityTokens = (value: number) => {
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
          insanityTokens: value
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
          insanityTokens: value,
          knockedDown: false,
          luckTokens: 0,
          movementTokens: 0,
          notes: '',
          priorityTarget: false,
          speedTokens: 0,
          strengthTokens: 0,
          survivalTokens: 0
        })

      saveSelectedShowdown(
        {
          survivorDetails: updatedDetails
        },
        SURVIVOR_ATTRIBUTE_TOKEN_UPDATED_MESSAGE('insanity')
      )
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
          insanityTokens: value
        }
      else
        // Create new survivor details entry
        updatedDetails.push({
          accuracyTokens: 0,
          evasionTokens: 0,
          id: selectedSurvivor.id!,
          insanityTokens: value,
          luckTokens: 0,
          movementTokens: 0,
          notes: '',
          speedTokens: 0,
          strengthTokens: 0,
          survivalTokens: 0
        })

      saveSelectedHunt(
        {
          survivorDetails: updatedDetails
        },
        SURVIVOR_ATTRIBUTE_TOKEN_UPDATED_MESSAGE('insanity')
      )
    }
  }

  const survivorShowdownDetails = useMemo(
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

  const survivorHuntDetails = useMemo(
    () =>
      selectedHunt?.survivorDetails?.find(
        (sd) => sd.id === selectedSurvivor?.id
      ) ?? {
        accuracyTokens: 0,
        evasionTokens: 0,
        id: 0,
        insanityTokens: 0,
        luckTokens: 0,
        movementTokens: 0,
        notes: '',
        speedTokens: 0,
        strengthTokens: 0,
        survivalTokens: 0
      },
    [selectedHunt, selectedSurvivor?.id]
  )

  /**
   * Update Insanity
   */
  const updateInsanity = (value: number) => {
    // Enforce minimum value of 0
    if (value < 0) return toast.error(INSANITY_MINIMUM_ERROR_MESSAGE())

    saveSelectedSurvivor(
      {
        insanity: value
      },
      SURVIVOR_INSANITY_UPDATED_MESSAGE(selectedSurvivor?.insanity ?? 0, value)
    )
  }

  /**
   * Update Brain Light Damage
   */
  const updateBrainLightDamage = (checked: boolean) =>
    saveSelectedSurvivor(
      {
        brainLightDamage: !!checked
      },
      SURVIVOR_BRAIN_LIGHT_DAMAGE_UPDATED_MESSAGE(!!checked)
    )

  /**
   * Update Torment (Arc)
   */
  const updateTorment = (value: number) => {
    // Enforce minimum value of 0
    if (value < 0) return toast.error(TORMENT_MINIMUM_ERROR_MESSAGE())

    saveSelectedSurvivor(
      {
        torment: value
      },
      SURVIVOR_TORMENT_UPDATED_MESSAGE()
    )
  }

  return (
    <Card className="p-2 border-0">
      <CardContent className="p-0 h-19">
        <div className="flex flex-row">
          {/* Insanity */}
          <div className="flex flex-col items-center gap-1">
            <div className="relative flex items-center">
              <Shield
                className="h-14 w-14 text-muted-foreground"
                strokeWidth={1}
              />
              <NumericInput
                label="Insanity"
                value={selectedSurvivor?.insanity ?? 0}
                min={0}
                onChange={(value) => updateInsanity(value)}
                className="absolute top-[50%] left-7 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 text-xl sm:text-xl md:text-xl text-center p-0 !bg-transparent border-none no-spinners focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
            {displayText && <Label className="text-xs">Insanity</Label>}
          </div>

          {/* Insanity Tokens (Showdown) */}
          {mode === SurvivorCardMode.SHOWDOWN_CARD && (
            <div className="flex flex-col items-center gap-2 pt-1">
              <NumericInput
                label="Insanity Tokens"
                value={
                  mode === SurvivorCardMode.SHOWDOWN_CARD
                    ? survivorShowdownDetails.insanityTokens
                    : mode === SurvivorCardMode.HUNT_CARD
                      ? survivorHuntDetails.insanityTokens
                      : 0
                }
                min={0}
                onChange={(value) => saveInsanityTokens(value)}
                className="w-12 h-12 text-xl sm:text-xl md:text-xl focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-muted!"
              />
              <Label className="text-xs text-muted-foreground uppercase tracking-wide">
                Tokens
              </Label>
            </div>
          )}

          <div className="mx-2 w-px bg-border h-19" />

          {/* Brain */}
          <div className="relative flex-1 flex flex-col justify-between">
            <div className="text-sm font-bold flex gap-1 items-center">
              <BrainIcon className="h-5 w-5" />
              Brain
            </div>
            <div className="absolute top-0 right-0 pr-2 flex items-center">
              <div className="space-y-0 flex flex-col items-center">
                <Checkbox
                  checked={selectedSurvivor?.brainLightDamage ?? false}
                  onCheckedChange={(checked) =>
                    updateBrainLightDamage(!!checked)
                  }
                  name="brain-light-damage"
                  id="brain-light-damage"
                />
                <Label className="text-xs mt-1">L</Label>
              </div>
            </div>
            {displayText && (
              <div className="text-xs text-muted-foreground">
                If your insanity is 3+, you are <strong>insane</strong>.
              </div>
            )}
          </div>

          {/* Torment (Arc) */}
          {selectedSettlement?.survivorType === SurvivorType.ARC &&
            displayTormentInput && (
              <div className="flex flex-col items-center gap-1">
                <Label className="text-xs">Torment</Label>
                <NumericInput
                  label="Torment"
                  value={selectedSurvivor?.torment ?? 0}
                  min={0}
                  onChange={(value) => updateTorment(value)}
                  className="w-12 h-12 text-xl sm:text-xl md:text-xl focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>
            )}
        </div>
      </CardContent>
    </Card>
  )
}
