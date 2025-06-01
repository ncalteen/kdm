'use client'

import { SelectWeaponType } from '@/components/menu/select-weapon-type'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { WeaponType } from '@/lib/enums'
import { getCampaign, saveCampaignToLocalStorage } from '@/lib/utils'
import { Survivor, SurvivorSchema } from '@/schemas/survivor'
import { SwordsIcon } from 'lucide-react'
import { ReactElement, useCallback, useEffect, useRef } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'
import { ZodError } from 'zod'

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
  form: UseFormReturn<Survivor>
): ReactElement {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const weaponProficiency = form.watch('weaponProficiency') || 0
  const weaponProficiencyType = form.watch('weaponProficiencyType')

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
    }
  }, [])

  /**
   * Save weapon proficiency data to localStorage for the current survivor with debouncing,
   * with Zod validation and toast feedback.
   *
   * @param updatedProficiency Updated weapon proficiency level
   * @param updatedType Updated weapon proficiency type
   * @param immediate Whether to save immediately or use debouncing
   */
  const saveToLocalStorageDebounced = useCallback(
    (
      updatedProficiency: number,
      updatedType?: WeaponType,
      immediate = false
    ) => {
      const saveFunction = () => {
        try {
          const formValues = form.getValues()
          const campaign = getCampaign()
          const survivorIndex = campaign.survivors.findIndex(
            (s: { id: number }) => s.id === formValues.id
          )

          if (survivorIndex !== -1) {
            try {
              SurvivorSchema.shape.weaponProficiency.parse(
                updatedProficiency || weaponProficiency
              )
              SurvivorSchema.shape.weaponProficiencyType.parse(
                updatedType || weaponProficiencyType
              )
            } catch (error) {
              if (error instanceof ZodError && error.errors[0]?.message)
                return toast.error(error.errors[0].message)
              else
                return toast.error(
                  'The darkness swallows your words. Please try again.'
                )
            }

            // Use the optimized utility function to save to localStorage
            saveCampaignToLocalStorage({
              ...campaign,
              survivors: campaign.survivors.map((s) =>
                s.id === formValues.id
                  ? {
                      ...s,
                      weaponProficiency:
                        updatedProficiency || weaponProficiency,
                      weaponProficiencyType:
                        updatedType || weaponProficiencyType
                    }
                  : s
              )
            })

            if (updatedProficiency === 3)
              toast.success('The survivor becomes a specialist in their craft.')
            else if (updatedProficiency === 8)
              toast.success(
                'The survivor achieves mastery beyond mortal limits.'
              )
          }
        } catch (error) {
          console.error('Weapon Proficiency Save Error:', error)
          toast.error('The darkness swallows your words. Please try again.')
        }
      }

      if (immediate) {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
          timeoutRef.current = null
        }
        saveFunction()
      } else {
        if (timeoutRef.current) clearTimeout(timeoutRef.current)

        timeoutRef.current = setTimeout(saveFunction, 300)
      }
    },
    [form, weaponProficiency, weaponProficiencyType]
  )

  /**
   * Handle weapon proficiency level checkbox change
   *
   * @param index Checkbox index (0-7)
   * @param checked Whether the checkbox is checked
   */
  const handleProficiencyChange = useCallback(
    (index: number, checked: boolean) => {
      const newProficiency = checked ? index + 1 : index
      form.setValue('weaponProficiency', newProficiency)
      saveToLocalStorageDebounced(newProficiency, undefined, true)
    },
    [form, saveToLocalStorageDebounced]
  )

  /**
   * Handle weapon type selection change
   *
   * @param type Selected weapon type
   */
  const handleWeaponTypeChange = useCallback(
    (type: string) => {
      const weaponType = type as WeaponType
      form.setValue('weaponProficiencyType', weaponType)
      saveToLocalStorageDebounced(weaponProficiency, weaponType, true)
      toast.success('The survivor turns their focus to a new weapon.')
    },
    [form, weaponProficiency, saveToLocalStorageDebounced]
  )

  return (
    <Card className="p-0 pb-1 mt-2 border-3">
      <CardContent className="p-2 pb-0">
        <div className="flex flex-row justify-between">
          <div className="flex flex-col gap-1">
            <CardTitle className="text-md flex flex-row items-center gap-1">
              <SwordsIcon className="h-4 w-4" />
              Weapon Proficiency
            </CardTitle>
            <SelectWeaponType
              value={weaponProficiencyType}
              onChange={handleWeaponTypeChange}
            />
          </div>
          <div className="flex flex-col pt-2">
            <div className="flex flex-row gap-2">
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

            <hr className="mt-3 mb-2" />

            <div className="flex flex-row justify-between gap-2">
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
