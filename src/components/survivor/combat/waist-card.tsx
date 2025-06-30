'use client'

import { NumericInput } from '@/components/menu/numeric-input'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { Survivor } from '@/schemas/survivor'
import { RibbonIcon, Shield } from 'lucide-react'
import { ReactElement } from 'react'

/**
 * Waist Card Properties
 */
interface WaistCardProps {
  /** Save Selected Survivor */
  saveSelectedSurvivor: (data: Partial<Survivor>, successMsg?: string) => void
  /** Selected Survivor */
  selectedSurvivor: Partial<Survivor> | null
}

/**
 * Waist Card Component
 *
 * This component displays the survivor's waist status. It includes armor
 * points, severe injuries, and light/heavy damage.
 *
 * @param props Waist Card Properties
 * @returns Waist Card Component
 */
export function WaistCard({
  saveSelectedSurvivor,
  selectedSurvivor
}: WaistCardProps): ReactElement {
  /**
   * Save to Local Storage
   *
   * @param attrName Attribute name
   * @param value New value
   */
  const saveToLocalStorage = (
    attrName:
      | 'waistArmor'
      | 'waistBrokenHip'
      | 'waistIntestinalProlapse'
      | 'waistDestroyedGenitals'
      | 'waistWarpedPelvis'
      | 'waistLightDamage'
      | 'waistHeavyDamage',
    value: number | boolean
  ) =>
    saveSelectedSurvivor(
      {
        [attrName]: value
      },
      'The core withstands the relentless onslaught.'
    )

  return (
    <Card className="p-2 border-0">
      <CardContent className="p-0 h-[80px]">
        <div className="flex flex-row">
          <div className="relative flex items-center">
            <Shield
              className="h-14 w-14 text-muted-foreground"
              strokeWidth={1}
            />
            <NumericInput
              value={selectedSurvivor?.waistArmor ?? 0}
              min={0}
              label="Waist Armor"
              onChange={(value) => saveToLocalStorage('waistArmor', value)}>
              <Input
                key={`waistArmor-${selectedSurvivor?.id || 'new'}`}
                placeholder="1"
                type="number"
                className="absolute top-[50%] left-7 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 text-xl sm:text-xl md:text-xl text-center p-0 bg-transparent border-none no-spinners focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                value={selectedSurvivor?.waistArmor ?? 0}
                readOnly
                name="waist-armor-mobile"
                id="waist-armor-mobile"
              />
            </NumericInput>
          </div>

          <div className="mx-2 w-px bg-border h-[80px]" />

          <div className="flex flex-row items-start w-full">
            <div className="text-md font-bold flex flex-row gap-1 w-[70px]">
              <RibbonIcon /> Waist
            </div>
            <div className="flex flex-col items-start gap-1 ml-2">
              {/* Severe Injuries */}
              <div className="space-y-0 flex flex-row items-center gap-2">
                <Checkbox
                  className="h-4 w-4 rounded-sm"
                  checked={selectedSurvivor?.waistBrokenHip}
                  onCheckedChange={(checked) =>
                    saveToLocalStorage('waistBrokenHip', !!checked)
                  }
                  name="waist-broken-hip"
                  id="waist-broken-hip"
                />
                <label className="text-xs">Broken Hip</label>
              </div>

              <div className="space-y-0 flex flex-row items-center gap-2">
                <Checkbox
                  className="h-4 w-4 rounded-sm"
                  checked={selectedSurvivor?.waistIntestinalProlapse}
                  onCheckedChange={(checked) =>
                    saveToLocalStorage('waistIntestinalProlapse', !!checked)
                  }
                  name="waist-intestinal-prolapse"
                  id="waist-intestinal-prolapse"
                />
                <label className="text-xs">Intestinal Prolapse</label>
              </div>

              <div className="space-y-0 flex flex-row items-center gap-2">
                <Checkbox
                  className="h-4 w-4 rounded-sm"
                  checked={selectedSurvivor?.waistDestroyedGenitals}
                  onCheckedChange={(checked) =>
                    saveToLocalStorage('waistDestroyedGenitals', !!checked)
                  }
                  name="waist-destroyed-genitals"
                  id="waist-destroyed-genitals"
                />
                <label className="text-xs">Destroyed Genitals</label>
              </div>

              <div className="space-y-0 flex flex-row items-center gap-2">
                <div className="flex flex-row gap-1">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <Checkbox
                      key={value}
                      className="h-4 w-4 rounded-sm"
                      checked={
                        (selectedSurvivor?.waistWarpedPelvis || 0) >= value
                      }
                      onCheckedChange={(checked) => {
                        const newValue = checked ? value : value - 1
                        const safeValue = Math.max(0, Math.min(5, newValue))

                        saveToLocalStorage('waistWarpedPelvis', safeValue)
                      }}
                      name={`waist-warped-pelvis-${value}`}
                      id={`waist-warped-pelvis-${value}`}
                    />
                  ))}
                </div>
                <label className="text-xs">Warped Pelvis</label>
              </div>
            </div>

            {/* Light and Heavy Damage */}
            <div className="flex flex-row gap-2 ml-auto">
              {/* Light Damage */}
              <div className="space-y-0 flex flex-col items-center">
                <Checkbox
                  className={cn(
                    'h-4 w-4 rounded-sm',
                    !selectedSurvivor?.waistLightDamage &&
                      'border-2 border-primary',
                    !selectedSurvivor?.waistLightDamage &&
                      'border-2 border-primary'
                  )}
                  checked={selectedSurvivor?.waistLightDamage}
                  onCheckedChange={(checked) =>
                    saveToLocalStorage('waistLightDamage', !!checked)
                  }
                  name="waist-light-damage"
                  id="waist-light-damage"
                />
                <label className="text-xs mt-1">L</label>
              </div>

              {/* Heavy Damage */}
              <div className="space-y-0 flex flex-col items-center">
                <Checkbox
                  className={cn(
                    'h-4 w-4 rounded-sm',
                    !selectedSurvivor?.waistHeavyDamage &&
                      'border-2 border-primary',
                    !selectedSurvivor?.waistHeavyDamage &&
                      'border-4 border-primary'
                  )}
                  checked={selectedSurvivor?.waistHeavyDamage}
                  onCheckedChange={(checked) =>
                    saveToLocalStorage('waistHeavyDamage', !!checked)
                  }
                  name="waist-heavy-damage"
                  id="waist-heavy-damage"
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
