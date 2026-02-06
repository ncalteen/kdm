'use client'

import { NumericInput } from '@/components/menu/numeric-input'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { COMBAT_LEGS_UPDATED_MESSAGE } from '@/lib/messages'
import { cn } from '@/lib/utils'
import { Survivor } from '@/schemas/survivor'
import { FootprintsIcon, Shield } from 'lucide-react'
import { ReactElement } from 'react'

/**
 * Legs Card Properties
 */
interface LegsCardProps {
  /** Save Selected Survivor */
  saveSelectedSurvivor: (data: Partial<Survivor>, successMsg: string) => void
  /** Selected Survivor */
  selectedSurvivor: Survivor | null
}

/**
 * Legs Card Component
 *
 * This component displays the survivor's legs status. It includes armor points,
 * severe injuries, and light/heavy damage.
 *
 * @param props Legs Card Properties
 * @returns Legs Card Component
 */
export function LegsCard({
  saveSelectedSurvivor,
  selectedSurvivor
}: LegsCardProps): ReactElement {
  /**
   * Save to Local Storage
   *
   * @param attrName Attribute name
   * @param value New value
   */
  const saveToLocalStorage = (
    attrName:
      | 'legArmor'
      | 'legHamstrung'
      | 'legBroken'
      | 'legDismembered'
      | 'legLightDamage'
      | 'legHeavyDamage',
    value: number | boolean
  ) =>
    saveSelectedSurvivor(
      {
        [attrName]: value
      },
      COMBAT_LEGS_UPDATED_MESSAGE()
    )

  return (
    <Card className="p-2 border-0">
      <CardContent className="p-0 h-19">
        <div className="flex flex-row">
          {/* Leg Armor */}
          <div className="relative flex items-center">
            <Shield
              className="h-14 w-14 text-muted-foreground"
              strokeWidth={1}
            />
            <NumericInput
              label="Leg Armor"
              value={selectedSurvivor?.legArmor ?? 0}
              min={0}
              onChange={(value) => saveToLocalStorage('legArmor', value)}
              className="absolute top-[50%] left-7 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 text-xl sm:text-xl md:text-xl text-center p-0 !bg-transparent border-none no-spinners focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>

          <div className="mx-2 w-px bg-border h-19" />

          <div className="flex flex-row items-start w-full">
            <div className="text-sm font-bold flex flex-row gap-1 w-18">
              <FootprintsIcon className="h-5 w-5" /> Legs
            </div>
            <div className="flex flex-col gap-1 ml-2">
              {/* Severe Injuries */}
              <div className="space-y-0 flex flex-row items-center gap-2">
                <Checkbox
                  className="h-4 w-4 rounded-sm"
                  checked={selectedSurvivor?.legHamstrung}
                  onCheckedChange={(checked) =>
                    saveToLocalStorage('legHamstrung', !!checked)
                  }
                  name="leg-hamstrung"
                  id="leg-hamstrung"
                />
                <Label className="text-xs">Hamstrung</Label>
              </div>

              <div className="flex flex-row gap-2">
                <div className="flex gap-1 items-center">
                  {[...Array(2)].map((_, index) => (
                    <Checkbox
                      key={index}
                      checked={(selectedSurvivor?.legBroken ?? 0) > index}
                      onCheckedChange={(checked) => {
                        let newValue = selectedSurvivor?.legBroken ?? 0
                        if (checked) newValue = index + 1
                        else if (
                          (selectedSurvivor?.legBroken ?? 0) ===
                          index + 1
                        )
                          newValue = index

                        saveToLocalStorage('legBroken', newValue)
                      }}
                      name={`leg-broken-${index + 1}`}
                      id={`leg-broken-${index + 1}`}
                    />
                  ))}
                </div>
                <span className="text-xs">Broken Leg</span>
              </div>

              <div className="flex flex-row gap-2">
                <div className="flex gap-1 items-center">
                  {[...Array(2)].map((_, index) => (
                    <Checkbox
                      key={index}
                      checked={(selectedSurvivor?.legDismembered ?? 0) > index}
                      onCheckedChange={(checked) => {
                        let newValue = selectedSurvivor?.legDismembered ?? 0
                        if (checked) newValue = index + 1
                        else if (
                          (selectedSurvivor?.legDismembered ?? 0) ===
                          index + 1
                        )
                          newValue = index

                        saveToLocalStorage('legDismembered', newValue)
                      }}
                      name={`leg-dismembered-${index + 1}`}
                      id={`leg-dismembered-${index + 1}`}
                    />
                  ))}
                </div>
                <span className="text-xs">Dismembered Leg</span>
              </div>
            </div>

            {/* Light and Heavy Damage */}
            <div className="flex flex-row gap-2 ml-auto">
              {/* Light Damage */}
              <div className="flex flex-col items-center">
                <Checkbox
                  className={cn(
                    'h-4 w-4 rounded-sm',
                    !selectedSurvivor?.legLightDamage &&
                      'border-2 border-primary',
                    !selectedSurvivor?.legLightDamage &&
                      'border-2 border-primary'
                  )}
                  checked={selectedSurvivor?.legLightDamage}
                  onCheckedChange={(checked) =>
                    saveToLocalStorage('legLightDamage', !!checked)
                  }
                  name="leg-light-damage"
                  id="leg-light-damage"
                />
                <Label className="text-xs mt-1">L</Label>
              </div>

              {/* Heavy Damage */}
              <div className="flex flex-col items-center">
                <Checkbox
                  className={cn(
                    'h-4 w-4 rounded-sm',
                    !selectedSurvivor?.legHeavyDamage &&
                      'border-2 border-primary',
                    !selectedSurvivor?.legHeavyDamage &&
                      'border-4 border-primary'
                  )}
                  checked={selectedSurvivor?.legHeavyDamage}
                  onCheckedChange={(checked) =>
                    saveToLocalStorage('legHeavyDamage', !!checked)
                  }
                  name="leg-heavy-damage"
                  id="leg-heavy-damage"
                />
                <Label className="text-xs mt-1">H</Label>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
