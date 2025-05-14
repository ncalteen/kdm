// WeaponProficiencyCard.tsx
'use client'

import { SelectWeaponType } from '@/components/menu/select-weapon-type'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { SurvivorSchema } from '@/schemas/survivor'
import { UseFormReturn } from 'react-hook-form'
import { z } from 'zod'

/**
 * Weapon Proficiency Card Component
 *
 * This component displays the weapon proficiency options for a survivor. It
 * includes a dropdown to select the weapon type and checkboxes to set the
 * proficiency level. The proficiency level can be set from 0 to 8, with
 * special notes for levels 3 and 8.
 *
 * @param form Form
 * @returns Weapon Proficiency Card Component
 */
export function WeaponProficiencyCard(
  form: UseFormReturn<z.infer<typeof SurvivorSchema>>
) {
  const weaponProficiency = form.watch('weaponProficiency') || 0
  const weaponProficiencyType = form.watch('weaponProficiencyType')

  // Handle proficiency checkbox change
  const handleProficiencyChange = (index: number, checked: boolean) => {
    if (checked) form.setValue('weaponProficiency', index + 1)
    else form.setValue('weaponProficiency', index)
  }

  return (
    <Card className="mt-2">
      <CardContent className="py-4 min-w-[600px]">
        <div className="flex flex-wrap gap-8 items-start justify-between">
          <div className="font-bold text-l whitespace-nowrap flex flex-col">
            Weapon Proficiency
            <SelectWeaponType
              value={weaponProficiencyType || ''}
              onChange={(type: string) =>
                form.setValue(
                  'weaponProficiencyType',
                  type as unknown as z.infer<
                    typeof SurvivorSchema
                  >['weaponProficiencyType']
                )
              }
            />
          </div>
          <div className="flex flex-col">
            <div className="flex flex-row gap-3 mb-1">
              {Array.from({ length: 8 }, (_, i) => (
                <div
                  key={i}
                  className="w-4 h-4 flex items-center justify-center">
                  <Checkbox
                    checked={weaponProficiency > i}
                    onCheckedChange={(checked) =>
                      handleProficiencyChange(i, !!checked)
                    }
                    className={
                      'h-4 w-4 rounded-sm' +
                      (i === 2 || i === 7 ? ' border-2 border-primary' : '')
                    }
                  />
                </div>
              ))}
            </div>
            <hr className="mt-2 mb-2" />
            <div className="flex flex-row gap-3 justify-between">
              {Array.from({ length: 2 }, (_, i) => (
                <div key={i} className="flex items-center gap-1">
                  {Array.from({ length: i + 1 }, (_, j) => (
                    <Checkbox
                      key={j}
                      disabled
                      className="!bg-white border border-gray-300 h-3 w-3"
                    />
                  ))}
                  {i === 0 ? (
                    <span className="text-sm">Specialist</span>
                  ) : (
                    <span className="text-sm">Master</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
