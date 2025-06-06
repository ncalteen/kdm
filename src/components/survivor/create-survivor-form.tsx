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
 * Create Survivor Form Props
 */
interface CreateSurvivorFormProps extends Partial<Survivor> {
  /** Selected settlement */
  settlement: Settlement | null
  /** Function to set selected survivor */
  setSelectedSurvivor: (survivor: Survivor) => void
  /** Function to set creating new survivor state */
  setIsCreatingNewSurvivor: (isCreating: boolean) => void
  /** Function to save the survivor */
  saveSurvivor: (survivor: Survivor, successMsg?: string) => void
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
  settlement,
  setSelectedSurvivor,
  setIsCreatingNewSurvivor,
  saveSurvivor
}: CreateSurvivorFormProps): ReactElement {
  const form = useForm<Survivor>({
    // Need to set the type here directly, because the schema includes a lot of
    // fields with default values that are not resolved in the type.
    resolver: zodResolver(SurvivorSchema) as Resolver<Survivor>,
    defaultValues: BaseSurvivorSchema.parse({})
  })

  // Set the form values when the component mounts
  useEffect(() => {
    if (!settlement) return

    const updatedValues = {
      settlementId: settlement.id,
      canDash: canDash(settlement.id),
      canFistPump: canFistPump(settlement.id),
      canEncourage: canEncourage(settlement.id),
      canEndure: canEndure(settlement.id),
      canSurge: canSurge(settlement.id),
      huntXPRankUp:
        settlement.survivorType !== SurvivorType.ARC
          ? [1, 5, 9, 14] // Core
          : [1], // Arc
      id: getNextSurvivorId(),
      understanding: bornWithUnderstanding(settlement.id) ? 1 : 0
    }

    // Reset form with updated values while preserving user-entered fields
    form.reset({
      ...form.getValues(),
      ...updatedValues
    })
  }, [form, settlement])

  /**
   * Handles form submission
   *
   * @param values Form Values
   */
  function onSubmit(values: Survivor) {
    saveSurvivor(
      values,
      'A lantern approaches. A new survivor emerges from the darkness.'
    )
    setSelectedSurvivor(values)
    setIsCreatingNewSurvivor(false)
  }

  /**
   * Handles back navigation to settlement
   */
  const handleBackToSettlement = useCallback(() => {
    setIsCreatingNewSurvivor(false)
  }, [setIsCreatingNewSurvivor])

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit, () => {
        toast.error('The darkness swallows your words. Please try again.')
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
