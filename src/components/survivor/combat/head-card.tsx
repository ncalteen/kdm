'use client'

import { NumericInput } from '@/components/menu/numeric-input'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { useIsMobile } from '@/hooks/use-mobile'
import { cn } from '@/lib/utils'
import { Survivor } from '@/schemas/survivor'
import { HardHatIcon, Shield } from 'lucide-react'
import { ReactElement } from 'react'

/**
 * Head Card Properties
 */
interface HeadCardProps {
  /** Save Selected Survivor */
  saveSelectedSurvivor: (data: Partial<Survivor>, successMsg?: string) => void
  /** Selected Survivor */
  selectedSurvivor: Partial<Survivor> | null
}

/**
 * Head Card Component
 *
 * This component displays the survivor's head status. It includes armor points,
 * severe injuries, and light/heavy damage.
 *
 * @param props Head Card Properties
 * @returns Head Card Component
 */
export function HeadCard({
  saveSelectedSurvivor,
  selectedSurvivor
}: HeadCardProps): ReactElement {
  const isMobile = useIsMobile()

  /**
   * Save to Local Storage
   *
   * @param attrName Attribute name
   * @param value New value
   */
  const saveToLocalStorage = (
    attrName:
      | 'headArmor'
      | 'headDeaf'
      | 'headBlind'
      | 'headShatteredJaw'
      | 'headIntracranialHemorrhage'
      | 'headHeavyDamage',
    value: number | boolean
  ) =>
    saveSelectedSurvivor(
      {
        [attrName]: value
      },
      'The flesh endures what the mind cannot.'
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
              value={selectedSurvivor?.headArmor ?? 0}
              min={0}
              label="Head Armor"
              onChange={(value) => saveToLocalStorage('headArmor', value)}
              readOnly={false}>
              <Input
                placeholder="1"
                type="number"
                className="absolute top-[50%] left-7 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 text-xl sm:text-xl md:text-xl text-center p-0 bg-transparent border-none no-spinners focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                value={selectedSurvivor?.headArmor ?? '0'}
                readOnly={isMobile}
                onChange={
                  !isMobile
                    ? (e) =>
                        saveToLocalStorage(
                          'headArmor',
                          parseInt(e.target.value, 10)
                        )
                    : undefined
                }
                name="head-armor"
                id="head-armor"
              />
            </NumericInput>
          </div>

          <div className="mx-2 w-px bg-border h-[80px]" />

          {/* Body part label and severe injuries in a single row */}
          <div className="flex flex-row items-start w-full">
            <div className="text-md font-bold flex flex-row gap-1 w-[70px]">
              <HardHatIcon /> Head
            </div>
            <div className="flex flex-col items-start gap-1 ml-2">
              {/* Severe Injuries - Deaf */}
              <div className="space-y-0 flex flex-row items-center gap-2">
                <Checkbox
                  className="h-4 w-4 rounded-sm"
                  checked={selectedSurvivor?.headDeaf}
                  onCheckedChange={(checked) =>
                    saveToLocalStorage('headDeaf', !!checked)
                  }
                />
                <label className="text-xs">Deaf</label>
              </div>

              {/* Severe Injuries - Blind */}
              <div className="flex flex-row gap-2">
                <div className="flex gap-1 items-center">
                  {[...Array(2)].map((_, index) => (
                    <Checkbox
                      key={index}
                      checked={(selectedSurvivor?.headBlind || 0) > index}
                      onCheckedChange={(checked) => {
                        let newValue = selectedSurvivor?.headBlind || 0
                        if (checked) newValue = index + 1
                        else if (
                          (selectedSurvivor?.headBlind || 0) ===
                          index + 1
                        )
                          newValue = index

                        saveToLocalStorage('headBlind', newValue)
                      }}
                    />
                  ))}
                </div>
                <span className="text-xs">Blind</span>
              </div>

              {/* Severe Injuries - Shattered Jaw */}
              <div className="space-y-0 flex flex-row items-center gap-2">
                <Checkbox
                  className="h-4 w-4 rounded-sm"
                  checked={selectedSurvivor?.headShatteredJaw}
                  onCheckedChange={(checked) =>
                    saveToLocalStorage('headShatteredJaw', !!checked)
                  }
                />
                <label className="text-xs">Shattered Jaw</label>
              </div>

              {/* Severe Injuries - Intracranial Hemorrhage */}
              <div className="space-y-0 flex flex-row items-center gap-2">
                <Checkbox
                  className="h-4 w-4 rounded-sm"
                  checked={selectedSurvivor?.headIntracranialHemorrhage}
                  onCheckedChange={(checked) =>
                    saveToLocalStorage('headIntracranialHemorrhage', !!checked)
                  }
                />
                <label className="text-xs">Intracranial Hemorrhage</label>
              </div>
            </div>

            {/* Heavy Head Damage */}
            <div className="flex flex-col items-center ml-auto">
              <div className="space-y-0 flex flex-col items-center">
                <Checkbox
                  className={cn(
                    'h-4 w-4 rounded-sm',
                    !selectedSurvivor?.headHeavyDamage &&
                      'border-2 border-primary',
                    !selectedSurvivor?.headHeavyDamage &&
                      'border-4 border-primary'
                  )}
                  checked={selectedSurvivor?.headHeavyDamage}
                  onCheckedChange={(checked) =>
                    saveToLocalStorage('headHeavyDamage', !!checked)
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
