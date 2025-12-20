'use client'

import { NumericInput } from '@/components/menu/numeric-input'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { useIsMobile } from '@/hooks/use-mobile'
import { ColorChoice, SurvivorCardMode, SurvivorType } from '@/lib/enums'
import {
  SURVIVAL_LIMIT_EXCEEDED_ERROR_MESSAGE,
  SURVIVAL_MINIMUM_ERROR_MESSAGE,
  SURVIVOR_ATTRIBUTE_TOKEN_UPDATED_MESSAGE,
  SURVIVOR_CAN_DASH_UPDATED_MESSAGE,
  SURVIVOR_CAN_DODGE_UPDATED_MESSAGE,
  SURVIVOR_CAN_ENCOURAGE_UPDATED_MESSAGE,
  SURVIVOR_CAN_ENDURE_UPDATED_MESSAGE,
  SURVIVOR_CAN_FIST_PUMP_UPDATED_MESSAGE,
  SURVIVOR_CAN_SPEND_SURVIVAL_UPDATED_MESSAGE,
  SURVIVOR_CAN_SURGE_UPDATED_MESSAGE,
  SURVIVOR_SURVIVAL_UPDATED_MESSAGE,
  SURVIVOR_SYSTEMIC_PRESSURE_UPDATED_MESSAGE,
  SYSTEMIC_PRESSURE_MINIMUM_ERROR_MESSAGE
} from '@/lib/messages'
import { cn } from '@/lib/utils'
import { Hunt } from '@/schemas/hunt'
import { Settlement } from '@/schemas/settlement'
import { Showdown } from '@/schemas/showdown'
import { Survivor } from '@/schemas/survivor'
import { LockIcon } from 'lucide-react'
import { ReactElement, useMemo } from 'react'
import { toast } from 'sonner'

/**
 * Survival Card Properties
 */
interface SurvivalCardProps {
  /** Mode */
  mode: SurvivorCardMode
  /** Save Selected Hunt */
  saveSelectedHunt?: (data: Partial<Hunt>, successMsg?: string) => void
  /** Save Selected Showdown */
  saveSelectedShowdown?: (data: Partial<Showdown>, successMsg?: string) => void
  /** Save Selected Survivor */
  saveSelectedSurvivor: (data: Partial<Survivor>, successMsg?: string) => void
  /** Selected Hunt */
  selectedHunt: Hunt | null
  /** Selected Settlement */
  selectedSettlement: Settlement | null
  /** Selected Showdown */
  selectedShowdown: Showdown | null
  /** Selected Survivor */
  selectedSurvivor: Survivor | null
}

/**
 * Survivor Survival Card Component
 *
 * This component displays the survivor's survival points and available survival
 * actions. It includes a survival points counter, a "cannot spend survival"
 * checkbox, and  checkboxes for each available survival action. For Arc
 * survivors, it also shows  the Systemic Pressure attribute and Fist Pump
 * instead of Endure.
 *
 * @param props Survival Card Properties
 * @returns Survival Card Component
 */
export function SurvivalCard({
  mode,
  saveSelectedHunt,
  saveSelectedShowdown,
  saveSelectedSurvivor,
  selectedHunt,
  selectedSettlement,
  selectedShowdown,
  selectedSurvivor
}: SurvivalCardProps): ReactElement {
  const isMobile = useIsMobile()

  /**
   * Save Survival Tokens
   *
   * Saves to either hunt or showdown based on mode
   *
   * @param value New value
   */
  const saveSurvivalTokens = (value: number) => {
    if (!selectedSurvivor?.id) return

    if (mode === SurvivorCardMode.SHOWDOWN_CARD) {
      if (!saveSelectedShowdown || !selectedShowdown) return

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
          survivalTokens: value
        }
      } else {
        // Create new survivor details entry
        updatedDetails = [
          ...currentDetails,
          {
            accuracyTokens: 0,
            bleedingTokens: 0,
            blockTokens: 0,
            color: ColorChoice.SLATE,
            deflectTokens: 0,
            evasionTokens: 0,
            id: selectedSurvivor.id,
            insanityTokens: 0,
            knockedDown: false,
            luckTokens: 0,
            movementTokens: 0,
            notes: '',
            priorityTarget: false,
            speedTokens: 0,
            strengthTokens: 0,
            survivalTokens: value
          }
        ]
      }

      saveSelectedShowdown(
        {
          survivorDetails: updatedDetails
        },
        SURVIVOR_ATTRIBUTE_TOKEN_UPDATED_MESSAGE('survival')
      )
    } else if (mode === SurvivorCardMode.HUNT_CARD) {
      if (!saveSelectedHunt || !selectedHunt) return

      // Get current survivor details or create new one
      const currentDetails = selectedHunt.survivorDetails || []
      const survivorDetailIndex = currentDetails.findIndex(
        (sd) => sd.id === selectedSurvivor.id
      )

      let updatedDetails
      if (survivorDetailIndex >= 0) {
        // Update existing survivor details
        updatedDetails = [...currentDetails]
        updatedDetails[survivorDetailIndex] = {
          ...updatedDetails[survivorDetailIndex],
          survivalTokens: value
        }
      } else {
        // Create new survivor details entry
        updatedDetails = [
          ...currentDetails,
          {
            accuracyTokens: 0,
            color: ColorChoice.SLATE,
            evasionTokens: 0,
            id: selectedSurvivor.id,
            insanityTokens: 0,
            luckTokens: 0,
            movementTokens: 0,
            notes: '',
            speedTokens: 0,
            strengthTokens: 0,
            survivalTokens: value
          }
        ]
      }

      saveSelectedHunt(
        {
          survivorDetails: updatedDetails
        },
        SURVIVOR_ATTRIBUTE_TOKEN_UPDATED_MESSAGE('survival')
      )
    }
  }

  const survivorShowdownDetails = useMemo(
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

  const survivorHuntDetails = useMemo(
    () =>
      selectedHunt?.survivorDetails?.find(
        (sd) => sd.id === selectedSurvivor?.id
      ) || {
        accuracyTokens: 0,
        color: ColorChoice.SLATE,
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
   * Update Survival Points
   */
  const updateSurvival = (val: string) => {
    const value = parseInt(val) || 0

    // Enforce minimum value of 0
    if (value < 0) return toast.error(SURVIVAL_MINIMUM_ERROR_MESSAGE())

    // Enforce maximum value of survivalLimit
    if (value > (selectedSettlement?.survivalLimit || 1))
      return toast.error(
        SURVIVAL_LIMIT_EXCEEDED_ERROR_MESSAGE(
          selectedSettlement?.survivalLimit || 1
        )
      )

    saveSelectedSurvivor(
      { survival: value },
      SURVIVOR_SURVIVAL_UPDATED_MESSAGE(selectedSurvivor?.survival || 0, value)
    )
  }

  /**
   * Update Can Spend Survival Flag
   */
  const updateCanSpendSurvival = (checked: boolean) =>
    saveSelectedSurvivor(
      { canSpendSurvival: !checked },
      SURVIVOR_CAN_SPEND_SURVIVAL_UPDATED_MESSAGE(!checked)
    )

  /**
   * Update Can Dodge Flag
   */
  const updateCanDodge = (checked: boolean) =>
    saveSelectedSurvivor(
      { canDodge: !!checked },
      SURVIVOR_CAN_DODGE_UPDATED_MESSAGE(!!checked)
    )

  /**
   * Update Can Encourage Flag
   */
  const updateCanEncourage = (checked: boolean) =>
    saveSelectedSurvivor(
      { canEncourage: !!checked },
      SURVIVOR_CAN_ENCOURAGE_UPDATED_MESSAGE(!!checked)
    )

  /**
   * Update Can Surge Flag
   */
  const updateCanSurge = (checked: boolean) =>
    saveSelectedSurvivor(
      { canSurge: !!checked },
      SURVIVOR_CAN_SURGE_UPDATED_MESSAGE(!!checked)
    )

  /**
   * Update Can Dash Flag
   */
  const updateCanDash = (checked: boolean) =>
    saveSelectedSurvivor(
      { canDash: !!checked },
      SURVIVOR_CAN_DASH_UPDATED_MESSAGE(!!checked)
    )

  /**
   * Update Can Fist Pump Flag (Arc-specific)
   */
  const updateCanFistPump = (checked: boolean) =>
    saveSelectedSurvivor(
      { canFistPump: !!checked },
      SURVIVOR_CAN_FIST_PUMP_UPDATED_MESSAGE(!!checked)
    )

  /**
   * Update Systemic Pressure (Arc-specific)
   */
  const updateSystemicPressure = (val: string) => {
    let value = parseInt(val) || 0

    // Enforce minimum value of 0
    if (value < 0) {
      value = 0
      return toast.error(SYSTEMIC_PRESSURE_MINIMUM_ERROR_MESSAGE())
    }

    saveSelectedSurvivor(
      { systemicPressure: value },
      SURVIVOR_SYSTEMIC_PRESSURE_UPDATED_MESSAGE()
    )
  }

  /**
   * Update Can Endure Flag
   */
  const updateCanEndure = (checked: boolean) =>
    saveSelectedSurvivor(
      { canEndure: !!checked },
      SURVIVOR_CAN_ENDURE_UPDATED_MESSAGE(!!checked)
    )

  return (
    <Card className="p-2 border-0">
      <CardContent className="p-0">
        <div className="flex">
          {/* Survival */}
          <div className="flex-1 flex flex-col justify-between">
            <div className="flex flex-col">
              {/* Survival Base */}
              <Label className="font-bold pb-2">Survival</Label>
              <div className="flex flex-row items-center gap-2">
                <div className="flex flex-col items-center gap-1">
                  {(mode === SurvivorCardMode.SHOWDOWN_CARD ||
                    mode === SurvivorCardMode.HUNT_CARD) && (
                    <Label className="text-xs text-muted-foreground uppercase tracking-wide">
                      Base
                    </Label>
                  )}
                  <NumericInput
                    value={selectedSurvivor?.survival ?? 1}
                    min={0}
                    max={selectedSettlement?.survivalLimit || 1}
                    label="Survival"
                    onChange={(value) => updateSurvival(value.toString())}
                    readOnly={false}>
                    <Input
                      placeholder="1"
                      type="number"
                      className={cn(
                        'w-16 h-12 text-center no-spinners text-2xl sm:text-2xl md:text-2xl focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0'
                      )}
                      value={selectedSurvivor?.survival ?? '1'}
                      readOnly={isMobile}
                      onChange={
                        !isMobile
                          ? (e) => updateSurvival(e.target.value)
                          : undefined
                      }
                      name="survival"
                      id="survival"
                    />
                  </NumericInput>
                </div>

                {/* Survival Tokens */}
                {(mode === SurvivorCardMode.SHOWDOWN_CARD ||
                  mode === SurvivorCardMode.HUNT_CARD) && (
                  <div className="flex flex-col items-center gap-1">
                    <Label className="text-xs text-muted-foreground uppercase tracking-wide">
                      Tokens
                    </Label>
                    <NumericInput
                      value={
                        mode === SurvivorCardMode.SHOWDOWN_CARD
                          ? survivorShowdownDetails.survivalTokens
                          : mode === SurvivorCardMode.HUNT_CARD
                            ? survivorHuntDetails.survivalTokens
                            : 0
                      }
                      label="Survival Tokens"
                      onChange={(value) => saveSurvivalTokens(value)}
                      readOnly={false}>
                      <Input
                        placeholder="0"
                        type="number"
                        className="w-12 h-12 text-center no-spinners text-2xl sm:text-2xl md:text-2xl focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-muted!"
                        value={
                          mode === SurvivorCardMode.SHOWDOWN_CARD
                            ? survivorShowdownDetails.survivalTokens
                            : mode === SurvivorCardMode.HUNT_CARD
                              ? survivorHuntDetails.survivalTokens
                              : 0
                        }
                        readOnly={isMobile}
                        onChange={
                          !isMobile
                            ? (e) =>
                                saveSurvivalTokens(parseInt(e.target.value, 10))
                            : undefined
                        }
                        name="survival-tokens"
                        id="survival-tokens"
                      />
                    </NumericInput>
                  </div>
                )}
              </div>
            </div>

            {/* Cannot Spend Survival */}
            <div className="flex gap-2 pt-2">
              <Checkbox
                checked={!selectedSurvivor?.canSpendSurvival}
                onCheckedChange={(checked) => updateCanSpendSurvival(!!checked)}
                name="cannot-spend-survival"
                id="cannot-spend-survival"
              />
              <Label
                className="text-xs font-medium leading-none flex items-center"
                htmlFor="cannot-spend-survival">
                <LockIcon className="inline h-3 w-3" /> Cannot Spend Survival
              </Label>
            </div>
          </div>

          {/* Survival Actions */}
          <div className="flex">
            <div className="flex flex-col gap-1 justify-evenly">
              {/* Dodge */}
              <div className="flex gap-2">
                <Checkbox
                  checked={selectedSurvivor?.canDodge}
                  onCheckedChange={(checked) => updateCanDodge(!!checked)}
                  name="can-dodge"
                  id="can-dodge"
                />
                <Label className="text-xs" htmlFor="can-dodge">
                  Dodge
                </Label>
              </div>

              {/* Encourage */}
              <div className="flex gap-2">
                <Checkbox
                  checked={selectedSurvivor?.canEncourage}
                  onCheckedChange={(checked) => updateCanEncourage(!!checked)}
                  name="can-encourage"
                  id="can-encourage"
                />
                <Label className="text-xs" htmlFor="can-encourage">
                  Encourage
                </Label>
              </div>

              {/* Surge */}
              <div className="flex gap-2">
                <Checkbox
                  checked={selectedSurvivor?.canSurge}
                  onCheckedChange={(checked) => updateCanSurge(!!checked)}
                  name="can-surge"
                  id="can-surge"
                />
                <Label className="text-xs" htmlFor="can-surge">
                  Surge
                </Label>
              </div>

              {/* Dash */}
              <div className="flex gap-2">
                <Checkbox
                  checked={selectedSurvivor?.canDash}
                  onCheckedChange={(checked) => updateCanDash(!!checked)}
                  name="can-dash"
                  id="can-dash"
                />
                <Label className="text-xs" htmlFor="can-dash">
                  Dash
                </Label>
              </div>

              {/* Conditional rendering for Arc-specific attributes */}
              {selectedSettlement?.survivorType === SurvivorType.ARC ? (
                <div className="flex gap-2">
                  <Checkbox
                    checked={selectedSurvivor?.canFistPump}
                    onCheckedChange={(checked) => updateCanFistPump(!!checked)}
                    name="can-fist-pump"
                    id="can-fist-pump"
                  />
                  <Label className="text-xs" htmlFor="can-fist-pump">
                    Fist Pump
                  </Label>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Checkbox
                    checked={selectedSurvivor?.canEndure}
                    onCheckedChange={(checked) => updateCanEndure(!!checked)}
                    name="can-endure"
                    id="can-endure"
                  />
                  <Label className="text-xs" htmlFor="can-endure">
                    Endure
                  </Label>
                </div>
              )}
            </div>

            {/* Right - (Arc) Systemic pressure */}
            {selectedSettlement?.survivorType === SurvivorType.ARC && (
              <>
                <Separator orientation="vertical" className="mx-2.5" />

                {/* Systemic Pressure */}
                <div className="flex flex-col items-center justify-center gap-2">
                  <Label className="text-xs">
                    Systemic
                    <br />
                    Pressure
                  </Label>

                  <NumericInput
                    value={selectedSurvivor?.systemicPressure ?? 0}
                    min={0}
                    label="Systemic Pressure"
                    onChange={(value) =>
                      updateSystemicPressure(value.toString())
                    }
                    readOnly={false}>
                    <Input
                      placeholder="0"
                      type="number"
                      className="w-12 h-12 text-center no-spinners text-xl sm:text-xl md:text-xl focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                      value={selectedSurvivor?.systemicPressure ?? '0'}
                      readOnly={isMobile}
                      onChange={
                        !isMobile
                          ? (e) => updateSystemicPressure(e.target.value)
                          : undefined
                      }
                      name="systemic-pressure"
                      id="systemic-pressure"
                    />
                  </NumericInput>
                </div>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
