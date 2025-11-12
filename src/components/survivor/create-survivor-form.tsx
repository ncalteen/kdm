'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Gender, SurvivorType } from '@/lib/enums'
import { ERROR_MESSAGE, SURVIVOR_CREATED_MESSAGE } from '@/lib/messages'
import {
  bornWithUnderstanding,
  canDash,
  canEncourage,
  canEndure,
  canFistPump,
  canSurge,
  getNextSurvivorId
} from '@/lib/utils'
import { Settlement } from '@/schemas/settlement'
import {
  BaseSurvivorSchema,
  Survivor,
  SurvivorSchema
} from '@/schemas/survivor'
import { zodResolver } from '@hookform/resolvers/zod'
import { ReactElement, useCallback, useEffect } from 'react'
import { Resolver, useForm } from 'react-hook-form'
import { toast } from 'sonner'

/**
 * Create Survivor Form Properties
 */
interface CreateSurvivorFormProps {
  /** Save Selected Survivor */
  saveSelectedSurvivor: (survivor: Survivor, successMsg?: string) => void
  /** Selected Settlement */
  selectedSettlement: Settlement | null
  /** Set Is Creating New Survivor */
  setIsCreatingNewSurvivor: (isCreating: boolean) => void
  /** Set Selected Survivor */
  setSelectedSurvivor: (survivor: Survivor) => void
}

/**
 * Create Survivor Form Component
 *
 * This component is responsible for rendering the form that allows users to
 * name and create a new survivor. It includes fields for selecting the
 * settlement, survivor name, and gender.
 *
 * The chosen settlement will determine the available options and defaults.
 *
 * @returns Create Survivor Form
 */
export function CreateSurvivorForm({
  saveSelectedSurvivor,
  selectedSettlement,
  setIsCreatingNewSurvivor,
  setSelectedSurvivor
}: CreateSurvivorFormProps): ReactElement {
  const form = useForm<Survivor>({
    // Need to set the type here directly, because the schema includes a lot of
    // fields with default values that are not resolved in the type.
    resolver: zodResolver(SurvivorSchema) as Resolver<Survivor>,
    defaultValues: BaseSurvivorSchema.parse({})
  })

  // Set the form values when the component mounts
  useEffect(() => {
    console.debug('[CreateSurvivorForm] Initializing Form Values')

    if (!selectedSettlement?.id) return

    const updatedValues = {
      settlementId: selectedSettlement.id,
      canDash: canDash(selectedSettlement.id),
      canFistPump: canFistPump(selectedSettlement.id),
      canEncourage: canEncourage(selectedSettlement.id),
      canEndure: canEndure(selectedSettlement.id),
      canSurge: canSurge(selectedSettlement.id),
      huntXPRankUp:
        selectedSettlement?.survivorType !== SurvivorType.ARC
          ? [2, 6, 10, 15] // Core
          : [2], // Arc
      id: getNextSurvivorId(),
      understanding: bornWithUnderstanding(selectedSettlement.id) ? 1 : 0
    }

    // Reset form with updated values while preserving user-entered fields
    form.reset({
      ...form.getValues(),
      ...updatedValues
    })
  }, [form, selectedSettlement?.id, selectedSettlement?.survivorType])

  /**
   * Handles form submission
   *
   * @param values Form Values
   */
  function onSubmit(values: Survivor) {
    saveSelectedSurvivor(values, SURVIVOR_CREATED_MESSAGE())
    setSelectedSurvivor(values)
    setIsCreatingNewSurvivor(false)
  }

  /**
   * Handles back navigation to settlement
   */
  const handleBackToSettlement = useCallback(
    () => setIsCreatingNewSurvivor(false),
    [setIsCreatingNewSurvivor]
  )

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit, () => {
        toast.error(ERROR_MESSAGE())
      })}
      className="py-3 space-y-6">
      <Form {...form}>
        <Card className="max-w-[500px] mx-auto">
          <CardContent className="w-full space-y-2">
            {/* Survivor Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel className="text-left whitespace-nowrap min-w-[120px]">
                      Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Survivor name..."
                        {...field}
                        value={field.value ?? ''}
                        onChange={(e) => {
                          form.setValue('name', e.target.value)
                        }}
                      />
                    </FormControl>
                  </div>
                </FormItem>
              )}
            />

            {/* Survivor Gender */}
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel className="text-left whitespace-nowrap min-w-[120px]">
                      Gender
                    </FormLabel>
                    <div className="flex w-[75%] items-center gap-2">
                      <Checkbox
                        id="male-checkbox"
                        checked={field.value === Gender.MALE}
                        onCheckedChange={(checked) => {
                          if (checked) form.setValue('gender', Gender.MALE)
                        }}
                      />
                      <label htmlFor="male-checkbox" className="text-sm">
                        M
                      </label>
                      <Checkbox
                        id="female-checkbox"
                        checked={field.value === Gender.FEMALE}
                        onCheckedChange={(checked) => {
                          if (checked) form.setValue('gender', Gender.FEMALE)
                        }}
                      />
                      <label htmlFor="female-checkbox" className="text-sm">
                        F
                      </label>
                    </div>
                  </div>
                </FormItem>
              )}
            />

            <hr className="my-2" />

            <div className="text-xs text-muted-foreground">
              When you name your survivor, gain +1 <strong>survival</strong>.
            </div>
          </CardContent>
        </Card>
      </Form>

      <div className="flex gap-2 justify-center">
        <Button
          type="button"
          variant="outline"
          onClick={handleBackToSettlement}>
          Cancel
        </Button>
        <Button type="submit">Create Survivor</Button>
      </div>
    </form>
  )
}
