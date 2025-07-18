'use client'

import { NumericInput } from '@/components/menu/numeric-input'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { useIsMobile } from '@/hooks/use-mobile'
import { SurvivorType } from '@/lib/enums'
import { cn } from '@/lib/utils'
import { Settlement } from '@/schemas/settlement'
import { Survivor } from '@/schemas/survivor'
import { LockIcon } from 'lucide-react'
import { ReactElement } from 'react'
import { toast } from 'sonner'

/**
 * Survival Card Properties
 */
interface SurvivalCardProps {
  /** Save Selected Survivor */
  saveSelectedSurvivor: (data: Partial<Survivor>, successMsg?: string) => void
  /** Selected Settlement */
  selectedSettlement: Partial<Settlement> | null
  /** Selected Survivor */
  selectedSurvivor: Partial<Survivor> | null
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
  saveSelectedSurvivor,
  selectedSettlement,
  selectedSurvivor
}: SurvivalCardProps): ReactElement {
  const isMobile = useIsMobile()

  /**
   * Update Survival Points
   */
  const updateSurvival = (val: string) => {
    const value = parseInt(val) || 0

    // Enforce minimum value of 0
    if (value < 0) return toast.error('Survival cannot be negative.')

    // Enforce maximum value of survivalLimit
    if (value > (selectedSettlement?.survivalLimit || 1))
      return toast.error(
        `Survival cannot exceed the settlement's limit of ${selectedSettlement?.survivalLimit || 1}.`
      )

    saveSelectedSurvivor({ survival: value }, 'Survival updated successfully.')
  }

  /**
   * Update Can Spend Survival Flag
   */
  const updateCanSpendSurvival = (checked: boolean) =>
    saveSelectedSurvivor(
      { canSpendSurvival: !checked },
      !checked
        ? 'The survivor can once again spend survival.'
        : 'The survivor freezes - survival cannot be spent.'
    )

  /**
   * Update Can Dodge Flag
   */
  const updateCanDodge = (checked: boolean) =>
    saveSelectedSurvivor(
      { canDodge: !!checked },
      !!checked
        ? 'The survivor learns to dodge with grace.'
        : 'The survivor loses the ability to dodge.'
    )

  /**
   * Update Can Encourage Flag
   */
  const updateCanEncourage = (checked: boolean) =>
    saveSelectedSurvivor(
      { canEncourage: !!checked },
      !!checked
        ? 'The survivor finds their voice to inspire others.'
        : 'The survivor falls silent, unable to encourage.'
    )

  /**
   * Update Can Surge Flag
   */
  const updateCanSurge = (checked: boolean) =>
    saveSelectedSurvivor(
      { canSurge: !!checked },
      !!checked
        ? 'The survivor feels a surge of power within.'
        : 'The survivor loses their ability to surge.'
    )

  /**
   * Update Can Dash Flag
   */
  const updateCanDash = (checked: boolean) =>
    saveSelectedSurvivor(
      { canDash: !!checked },
      !!checked
        ? 'The survivor gains swift feet to dash ahead.'
        : 'The survivor loses their speed, unable to dash.'
    )

  /**
   * Update Can Fist Pump Flag (Arc-specific)
   */
  const updateCanFistPump = (checked: boolean) =>
    saveSelectedSurvivor(
      { canFistPump: !!checked },
      !!checked
        ? 'The survivor raises their fist in triumph.'
        : 'The survivor loses their fighting spirit.'
    )

  /**
   * Update Systemic Pressure (Arc-specific)
   */
  const updateSystemicPressure = (val: string) => {
    let value = parseInt(val) || 0

    // Enforce minimum value of 0
    if (value < 0) {
      value = 0
      return toast.error('Systemic pressure cannot be negative.')
    }

    saveSelectedSurvivor(
      { systemicPressure: value },
      'Systemic pressure updated successfully.'
    )
  }

  /**
   * Update Can Endure Flag
   */
  const updateCanEndure = (checked: boolean) =>
    saveSelectedSurvivor(
      { canEndure: !!checked },
      !!checked
        ? 'The survivor finds strength to endure the darkness.'
        : 'The survivor loses their resilience to endure.'
    )

  return (
    <Card className="p-2 border-0">
      <CardContent className="p-0">
        <div className="flex">
          {/* Left - Survival and cannot spend survival inputs */}
          <div className="flex-1 flex flex-col justify-between">
            {/* Survival Input */}
            <div className="flex items-center gap-2">
              <NumericInput
                value={selectedSurvivor?.survival ?? 1}
                min={0}
                max={selectedSettlement?.survivalLimit || 1}
                label="Survival"
                onChange={(value) => updateSurvival(value.toString())}>
                <Input
                  key={`survival-${selectedSurvivor?.id || 'new'}`}
                  placeholder="1"
                  type="number"
                  className={cn(
                    'w-14 h-14 text-center no-spinners text-2xl sm:text-2xl md:text-2xl focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0'
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
              <label className="font-bold text-left">Survival</label>
            </div>

            {/* Cannot Spend Survival Checkbox */}
            <div className="flex gap-2">
              <Checkbox
                checked={!selectedSurvivor?.canSpendSurvival}
                onCheckedChange={(checked) => updateCanSpendSurvival(!!checked)}
                name="cannot-spend-survival"
                id="cannot-spend-survival"
              />
              <div className="text-xs font-medium leading-none flex items-center">
                <LockIcon className="inline h-3 w-3 mr-1" /> Cannot spend
                survival
              </div>
            </div>
          </div>

          {/* Middle - Survival Actions */}
          <div className="flex">
            <div className="flex flex-col gap-1">
              {/* Dodge */}
              <div className="flex gap-2">
                <Checkbox
                  checked={selectedSurvivor?.canDodge}
                  onCheckedChange={(checked) => updateCanDodge(!!checked)}
                  name="can-dodge"
                  id="can-dodge"
                />
                <label className="text-xs">Dodge</label>
              </div>

              {/* Encourage */}
              <div className="flex gap-2">
                <Checkbox
                  checked={selectedSurvivor?.canEncourage}
                  onCheckedChange={(checked) => updateCanEncourage(!!checked)}
                  name="can-encourage"
                  id="can-encourage"
                />
                <label className="text-xs">Encourage</label>
              </div>

              {/* Surge */}
              <div className="flex gap-2">
                <Checkbox
                  checked={selectedSurvivor?.canSurge}
                  onCheckedChange={(checked) => updateCanSurge(!!checked)}
                  name="can-surge"
                  id="can-surge"
                />
                <label className="text-xs">Surge</label>
              </div>

              {/* Dash */}
              <div className="flex gap-2">
                <Checkbox
                  checked={selectedSurvivor?.canDash}
                  onCheckedChange={(checked) => updateCanDash(!!checked)}
                  name="can-dash"
                  id="can-dash"
                />
                <label className="text-xs">Dash</label>
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
                  <label className="text-xs">Fist Pump</label>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Checkbox
                    checked={selectedSurvivor?.canEndure}
                    onCheckedChange={(checked) => updateCanEndure(!!checked)}
                    name="can-endure"
                    id="can-endure"
                  />
                  <label className="text-xs">Endure</label>
                </div>
              )}
            </div>

            {/* Right - (Arc) Systemic pressure */}
            {selectedSettlement?.survivorType === SurvivorType.ARC && (
              <>
                <Separator orientation="vertical" className="mx-2.5" />

                {/* Systemic Pressure */}
                <div className="flex flex-col items-center">
                  <NumericInput
                    value={selectedSurvivor?.systemicPressure ?? 0}
                    min={0}
                    label="Systemic Pressure"
                    onChange={(value) =>
                      updateSystemicPressure(value.toString())
                    }>
                    <Input
                      key={`systemicPressure-${selectedSurvivor?.id || 'new'}`}
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
                  <label className="text-xs">
                    Systemic
                    <br />
                    Pressure
                  </label>
                </div>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
