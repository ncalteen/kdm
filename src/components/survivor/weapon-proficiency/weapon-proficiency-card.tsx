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
    <Card>
      <CardContent className="py-4 min-w-[600px]">
        <div className="flex flex-wrap gap-8 items-center">
          <div className="font-bold text-l whitespace-nowrap flex flex-col">
            <span>Weapon Proficiency</span>
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
          <div className="flex flex-row gap-3 items-center">
            {Array.from({ length: 8 }, (_, i) => (
              <Checkbox
                key={i}
                checked={weaponProficiency > i}
                onCheckedChange={(checked) =>
                  handleProficiencyChange(i, !!checked)
                }
                className={
                  'h-4 w-4 rounded-sm' +
                  (i === 2 || i === 7 ? ' border-2 border-primary' : '')
                }
              />
            ))}
          </div>
        </div>
        <div className="flex flex-row gap-4 items-center mt-2">
          <div className="flex items-center gap-1">
            <Checkbox
              className="h-3 w-3 bg-white border border-gray-300"
              disabled
            />
            <span className="text-xs">Specialist</span>
          </div>
          <div className="flex items-center gap-1">
            <Checkbox
              className="h-3 w-3 bg-white border border-gray-300"
              disabled
            />
            <span className="text-xs">Master</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
