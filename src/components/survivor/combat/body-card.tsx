'use client'

import { NumericInput } from '@/components/menu/numeric-input'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { useIsMobile } from '@/hooks/use-mobile'
import { cn } from '@/lib/utils'
import { Survivor } from '@/schemas/survivor'
import { Shield, ShirtIcon } from 'lucide-react'
import { ReactElement } from 'react'

/**
 * Body Card Properties
 */
interface BodyCardProps {
  /** Save Selected Survivor */
  saveSelectedSurvivor: (data: Partial<Survivor>, successMsg?: string) => void
  /** Selected Survivor */
  selectedSurvivor?: Partial<Survivor> | null
}

/**
 * Body Card Component
 *
 * This component displays the survivor's body status. It includes armor points,
 * severe injuries, and light/heavy damage.
 *
 * @param props Body Card Properties
 * @returns Body Card Component
 */
export function BodyCard({
  saveSelectedSurvivor,
  selectedSurvivor
}: BodyCardProps): ReactElement {
  const isMobile = useIsMobile()

  /**
   * Save to Local Storage
   *
   * @param attrName Attribute name
   * @param value New value
   */
  const saveToLocalStorage = (
    attrName:
      | 'bodyArmor'
      | 'bodyDestroyedBack'
      | 'bodyBrokenRib'
      | 'bodyGapingChestWound'
      | 'bodyLightDamage'
      | 'bodyHeavyDamage',
    value: number | boolean
  ) =>
    saveSelectedSurvivor(
      {
        [attrName]: value
      },
      'The body persists through torment and pain.'
    )

  return (
    <Card className="p-2 border-0">
      <CardContent className="p-0 h-[80px]">
        <div className="flex flex-row">
          {/* Body Armor */}
          <div className="relative flex items-center">
            <Shield
              className="h-14 w-14 text-muted-foreground"
              strokeWidth={1}
            />
            <NumericInput
              value={selectedSurvivor?.bodyArmor ?? 0}
              min={0}
              label="Body Armor"
              onChange={(value) => saveToLocalStorage('bodyArmor', value)}
              readOnly={false}>
              <Input
                placeholder="1"
                type="number"
                className="absolute top-[50%] left-7 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 text-xl sm:text-xl md:text-xl text-center p-0 bg-transparent border-none no-spinners focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                value={selectedSurvivor?.bodyArmor ?? '0'}
                readOnly={isMobile}
                onChange={
                  !isMobile
                    ? (e) =>
                        saveToLocalStorage(
                          'bodyArmor',
                          parseInt(e.target.value, 10)
                        )
                    : undefined
                }
                name="body-armor"
                id="body-armor"
              />
            </NumericInput>
          </div>

          <div className="mx-2 w-px bg-border h-[80px]" />

          <div className="flex flex-row items-start w-full">
            <div className="text-md font-bold flex flex-row gap-1 w-[70px]">
              <ShirtIcon /> Body
            </div>
            <div className="flex flex-col items-start gap-1 ml-2">
              {/* Severe Injuries - Destroyed Back */}
              <div className="space-y-0 flex flex-row items-center gap-2">
                <Checkbox
                  className="h-4 w-4 rounded-sm"
                  checked={selectedSurvivor?.bodyDestroyedBack}
                  onCheckedChange={(checked) =>
                    saveToLocalStorage('bodyDestroyedBack', !!checked)
                  }
                />
                <label className="text-xs">Destroyed Back</label>
              </div>

              {/* Severe Injuries - Broken Rib */}
              <div className="space-y-0 flex flex-row items-center gap-2">
                <div className="flex flex-row gap-1">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <Checkbox
                      key={value}
                      className="h-4 w-4 rounded-sm"
                      checked={(selectedSurvivor?.bodyBrokenRib || 0) >= value}
                      onCheckedChange={(checked) => {
                        const newValue = checked ? value : value - 1
                        const safeValue = Math.max(0, Math.min(5, newValue))

                        saveToLocalStorage('bodyBrokenRib', safeValue)
                      }}
                    />
                  ))}
                </div>
                <label className="text-xs">Broken Rib</label>
              </div>

              {/* Severe Injuries - Gaping Chest Wound */}
              <div className="space-y-0 flex flex-row items-center gap-2">
                <div className="flex flex-row gap-1">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <Checkbox
                      key={value}
                      className="h-4 w-4 rounded-sm"
                      checked={
                        (selectedSurvivor?.bodyGapingChestWound || 0) >= value
                      }
                      onCheckedChange={(checked) => {
                        const newValue = checked ? value : value - 1
                        const safeValue = Math.max(0, Math.min(5, newValue))

                        saveToLocalStorage('bodyGapingChestWound', safeValue)
                      }}
                    />
                  ))}
                </div>
                <label className="text-xs">Gaping Chest Wound</label>
              </div>
            </div>

            {/* Light and Heavy Damage */}
            <div className="flex flex-row gap-2 ml-auto">
              {/* Light Damage */}
              <div className="space-y-0 flex flex-col items-center">
                <Checkbox
                  className={cn(
                    'h-4 w-4 rounded-sm',
                    !selectedSurvivor?.bodyLightDamage &&
                      'border-2 border-primary',
                    !selectedSurvivor?.bodyLightDamage &&
                      'border-2 border-primary'
                  )}
                  checked={selectedSurvivor?.bodyLightDamage}
                  onCheckedChange={(checked) =>
                    saveToLocalStorage('bodyLightDamage', !!checked)
                  }
                />
                <label className="text-xs mt-1">L</label>
              </div>

              {/* Heavy Damage */}
              <div className="space-y-0 flex flex-col items-center">
                <Checkbox
                  className={cn(
                    'h-4 w-4 rounded-sm',
                    !selectedSurvivor?.bodyHeavyDamage &&
                      'border-2 border-primary',
                    !selectedSurvivor?.bodyHeavyDamage &&
                      'border-4 border-primary'
                  )}
                  checked={selectedSurvivor?.bodyHeavyDamage}
                  onCheckedChange={(checked) =>
                    saveToLocalStorage('bodyHeavyDamage', !!checked)
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
