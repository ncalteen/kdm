'use client'

import { NumericInput } from '@/components/menu/numeric-input'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { useIsMobile } from '@/hooks/use-mobile'
import { ColorChoice, SurvivorCardMode, SurvivorType } from '@/lib/enums'
import {
  INSANITY_MINIMUM_ERROR_MESSAGE,
  SURVIVOR_ATTRIBUTE_TOKEN_UPDATED_MESSAGE,
  SURVIVOR_BRAIN_LIGHT_DAMAGE_UPDATED_MESSAGE,
  SURVIVOR_INSANITY_UPDATED_MESSAGE,
  SURVIVOR_TORMENT_UPDATED_MESSAGE,
  TORMENT_MINIMUM_ERROR_MESSAGE
} from '@/lib/messages'
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
  /** Save Selected Showdown */
  saveSelectedShowdown?: (data: Partial<Showdown>, successMsg?: string) => void
  /** Save Selected Survivor */
  saveSelectedSurvivor: (data: Partial<Survivor>, successMsg: string) => void
  /** Selected Settlemenet */
  selectedSettlement: Partial<Settlement> | null
  /** Selected Showdown */
  selectedShowdown?: Partial<Showdown> | null
  /** Selected Survivor */
  selectedSurvivor: Partial<Survivor> | null
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
  saveSelectedShowdown,
  saveSelectedSurvivor,
  selectedSettlement,
  selectedShowdown,
  selectedSurvivor
}: SanityCardProps): ReactElement {
  const isMobile = useIsMobile()

  /**
   * Save Token to Showdown Details
   *
   * @param tokenName Token attribute name
   * @param value New value
   */
  const saveTokenToShowdown = (tokenName: 'insanityTokens', value: number) => {
    if (!saveSelectedShowdown || !selectedSurvivor?.id || !selectedShowdown)
      return

    // Get current survivor details or create new one
    const currentDetails = selectedShowdown.survivorDetails || []
    const survivorDetailIndex = currentDetails.findIndex(
      (sd) => sd.id === selectedSurvivor.id
    )

    let updatedDetails
    if (survivorDetailIndex >= 0) {
      // Update existing survivor details
      updatedDetails = [...currentDetails]
      updatedDetails[survivorDetailIndex] = {
        ...updatedDetails[survivorDetailIndex],
        [tokenName]: value
      }
    } else {
      // Create new survivor details entry
      updatedDetails = [
        ...currentDetails,
        {
          id: selectedSurvivor.id!,
          accuracyTokens: 0,
          bleedingTokens: 0,
          blockTokens: 0,
          color: ColorChoice.SLATE,
          deflectTokens: 0,
          evasionTokens: 0,
          knockedDown: false,
          luckTokens: 0,
          movementTokens: 0,
          notes: '',
          priorityTarget: false,
          speedTokens: 0,
          strengthTokens: 0,
          survivalTokens: 0,
          [tokenName]: value
        }
      ]
    }

    saveSelectedShowdown(
      {
        survivorDetails: updatedDetails
      },
      SURVIVOR_ATTRIBUTE_TOKEN_UPDATED_MESSAGE('insanity')
    )
  }

  const survivorDetails = useMemo(
    () =>
      selectedShowdown?.survivorDetails?.find(
        (sd) => sd.id === selectedSurvivor?.id
      ) || {
        accuracyTokens: 0,
        bleedingTokens: 0,
        blockTokens: 0,
        color: ColorChoice.SLATE,
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

  /**
   * Update Insanity
   */
  const updateInsanity = (val: string) => {
    let value = parseInt(val) || 0

    // Enforce minimum value of 0
    if (value < 0) {
      value = 0
      return toast.error(INSANITY_MINIMUM_ERROR_MESSAGE())
    }

    saveSelectedSurvivor(
      {
        insanity: value
      },
      SURVIVOR_INSANITY_UPDATED_MESSAGE(selectedSurvivor?.insanity || 0, value)
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
  const updateTorment = (val: string) => {
    let value = parseInt(val) || 0

    // Enforce minimum value of 0
    if (value < 0) {
      value = 0
      return toast.error(TORMENT_MINIMUM_ERROR_MESSAGE())
    }

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
                value={selectedSurvivor?.insanity ?? 0}
                min={0}
                label="Insanity"
                onChange={(value) => updateInsanity(value.toString())}
                readOnly={false}>
                <Input
                  placeholder="1"
                  type="number"
                  className="absolute top-[50%] left-7 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 text-xl sm:text-xl md:text-xl text-center p-0 !bg-transparent border-none no-spinners focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                  value={selectedSurvivor?.insanity ?? '0'}
                  readOnly={isMobile}
                  onChange={
                    !isMobile
                      ? (e) => updateInsanity(e.target.value)
                      : undefined
                  }
                  name="insanity"
                  id="insanity"
                />
              </NumericInput>
            </div>
            {displayText && <label className="text-xs">Insanity</label>}
          </div>

          {/* Insanity Tokens (Showdown) */}
          {mode === SurvivorCardMode.SHOWDOWN_CARD && (
            <div className="flex flex-col items-center gap-2 pt-1">
              <NumericInput
                value={survivorDetails.insanityTokens}
                label="Insanity Tokens"
                onChange={(value) =>
                  saveTokenToShowdown('insanityTokens', value)
                }
                readOnly={false}>
                <Input
                  key={`insanity-tokens-${selectedSurvivor?.id || 'new'}`}
                  placeholder="0"
                  type="number"
                  className="w-12 h-12 text-center no-spinners text-xl sm:text-xl md:text-xl focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-muted!"
                  value={survivorDetails.insanityTokens}
                  readOnly={isMobile}
                  onChange={
                    !isMobile
                      ? (e) =>
                          saveTokenToShowdown(
                            'insanityTokens',
                            parseInt(e.target.value, 10)
                          )
                      : undefined
                  }
                  name="insanity-tokens"
                  id="insanity-tokens"
                />
              </NumericInput>
              <label className="text-xs text-muted-foreground uppercase tracking-wide">
                Tokens
              </label>
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
                <label className="text-xs mt-1">L</label>
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
                <label className="text-xs">Torment</label>
                <NumericInput
                  value={selectedSurvivor?.torment ?? 0}
                  min={0}
                  label="Torment"
                  onChange={(value) => updateTorment(value.toString())}
                  readOnly={false}>
                  <Input
                    placeholder="0"
                    type="number"
                    className="w-12 h-12 text-center no-spinners text-xl sm:text-xl md:text-xl focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                    value={selectedSurvivor?.torment ?? '0'}
                    readOnly={isMobile}
                    onChange={
                      !isMobile
                        ? (e) => updateTorment(e.target.value)
                        : undefined
                    }
                    name="torment"
                    id="torment"
                  />
                </NumericInput>
              </div>
            )}
        </div>
      </CardContent>
    </Card>
  )
}
