'use client'

import { NumericInput } from '@/components/menu/numeric-input'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { FormControl } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useIsMobile } from '@/hooks/use-mobile'
import { COMBAT_ARMS_UPDATED_MESSAGE } from '@/lib/messages'
import { cn } from '@/lib/utils'
import { Survivor } from '@/schemas/survivor'
import { HandMetalIcon, Shield } from 'lucide-react'
import { ReactElement } from 'react'

/**
 * Arms Card Properties
 */
interface ArmsCardProps {
  /** Save Selected Survivor */
  saveSelectedSurvivor: (data: Partial<Survivor>, successMsg: string) => void
  /** Selected Survivor */
  selectedSurvivor: Partial<Survivor> | null
}

/**
 * Arms Card Component
 *
 * This component displays the survivor's arms status. It includes armor points,
 * severe injuries, and light/heavy damage.
 *
 * @param props Arms Card Properties
 * @returns Arms Card Component
 */
export function ArmsCard({
  saveSelectedSurvivor,
  selectedSurvivor
}: ArmsCardProps): ReactElement {
  const isMobile = useIsMobile()

  /**
   * Save to Local Storage
   *
   * @param attrName Attribute name
   * @param value New value
   */
  const saveToLocalStorage = (
    attrName:
      | 'armArmor'
      | 'armBroken'
      | 'armContracture'
      | 'armDismembered'
      | 'armRupturedMuscle'
      | 'armLightDamage'
      | 'armHeavyDamage',
    value: number | boolean
  ) =>
    saveSelectedSurvivor(
      {
        [attrName]: value
      },
      COMBAT_ARMS_UPDATED_MESSAGE()
    )

  return (
    <Card className="p-2 border-0">
      <CardContent className="p-0 h-[80px]">
        <div className="flex flex-row">
          {/* Arm Armor */}
          <div className="relative flex items-center">
            <Shield
              className="h-14 w-14 text-muted-foreground"
              strokeWidth={1}
            />
            <NumericInput
              value={selectedSurvivor?.armArmor ?? 0}
              min={0}
              label="Arm Armor"
              onChange={(value) => saveToLocalStorage('armArmor', value)}
              readOnly={false}>
              <Input
                placeholder="1"
                type="number"
                className="absolute top-[50%] left-7 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 text-xl sm:text-xl md:text-xl text-center p-0 !bg-transparent border-none no-spinners focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                value={selectedSurvivor?.armArmor ?? '0'}
                readOnly={isMobile}
                onChange={
                  !isMobile
                    ? (e) =>
                        saveToLocalStorage(
                          'armArmor',
                          parseInt(e.target.value, 10)
                        )
                    : undefined
                }
                name="arm-armor"
                id="arm-armor"
              />
            </NumericInput>
          </div>

          <div className="mx-2 w-px bg-border h-[80px]" />

          <div className="flex flex-row items-start w-full">
            <div className="text-md font-bold flex flex-row gap-1 w-[70px]">
              <HandMetalIcon /> Arms
            </div>
            <div className="flex flex-col items-start gap-1 ml-2">
              {/* Severe Injuries - Broken Arm */}
              <div className="flex flex-row gap-2">
                <div className="flex gap-1 items-center">
                  {[...Array(2)].map((_, index) => (
                    <Checkbox
                      key={index}
                      checked={(selectedSurvivor?.armBroken || 0) > index}
                      onCheckedChange={(checked) => {
                        let newValue = selectedSurvivor?.armBroken || 0
                        if (checked) newValue = index + 1
                        else if (
                          (selectedSurvivor?.armBroken || 0) ===
                          index + 1
                        )
                          newValue = index

                        saveToLocalStorage('armBroken', newValue)
                      }}
                    />
                  ))}
                </div>
                <span className="text-xs">Broken Arm</span>
              </div>

              {/* Severe Injuries - Ruptured Muscle */}
              <div className="space-y-0 flex flex-row items-center gap-2">
                <Checkbox
                  className="h-4 w-4 rounded-sm"
                  checked={selectedSurvivor?.armRupturedMuscle}
                  onCheckedChange={(checked) =>
                    saveToLocalStorage('armRupturedMuscle', !!checked)
                  }
                />
                <label className="text-xs">Ruptured Muscle</label>
              </div>

              {/* Severe Injuries - Dismembered Arm */}
              <div className="flex flex-row gap-2">
                <div className="flex gap-1 items-center">
                  {[...Array(2)].map((_, index) => (
                    <Checkbox
                      key={index}
                      checked={(selectedSurvivor?.armDismembered || 0) > index}
                      onCheckedChange={(checked) => {
                        let newValue = selectedSurvivor?.armDismembered || 0
                        if (checked) newValue = index + 1
                        else if (
                          (selectedSurvivor?.armDismembered || 0) ===
                          index + 1
                        )
                          newValue = index

                        saveToLocalStorage('armDismembered', newValue)
                      }}
                    />
                  ))}
                </div>
                <span className="text-xs">Dismembered Arm</span>
              </div>

              {/* Severe Injuries - Contracture */}
              <div className="space-y-0 flex flex-row items-center gap-2">
                <div className="flex flex-row gap-1">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <Checkbox
                      key={value}
                      className="h-4 w-4 rounded-sm"
                      checked={(selectedSurvivor?.armContracture || 0) >= value}
                      onCheckedChange={(checked) => {
                        const newValue = checked ? value : value - 1
                        const safeValue = Math.max(0, Math.min(5, newValue))

                        saveToLocalStorage('armContracture', safeValue)
                      }}
                    />
                  ))}
                </div>
                <label className="text-xs">Contracture</label>
              </div>
            </div>

            {/* Light and Heavy Damage */}
            <div className="flex flex-row gap-2 ml-auto">
              {/* Light Damage */}
              <div className="space-y-0 flex flex-col items-center">
                <FormControl>
                  <Checkbox
                    className={cn(
                      'h-4 w-4 rounded-sm',
                      !selectedSurvivor?.armLightDamage &&
                        'border-2 border-primary',
                      !selectedSurvivor?.armLightDamage &&
                        'border-2 border-primary'
                    )}
                    checked={selectedSurvivor?.armLightDamage}
                    onCheckedChange={(checked) =>
                      saveToLocalStorage('armLightDamage', !!checked)
                    }
                  />
                </FormControl>
                <label className="text-xs mt-1">L</label>
              </div>

              {/* Heavy Damage */}
              <div className="space-y-0 flex flex-col items-center">
                <Checkbox
                  className={cn(
                    'h-4 w-4 rounded-sm',
                    !selectedSurvivor?.armHeavyDamage &&
                      'border-2 border-primary',
                    !selectedSurvivor?.armHeavyDamage &&
                      'border-4 border-primary'
                  )}
                  checked={selectedSurvivor?.armHeavyDamage}
                  onCheckedChange={(checked) =>
                    saveToLocalStorage('armHeavyDamage', !!checked)
                  }
                />
                <label className="text-xs mt-1">H</label>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
