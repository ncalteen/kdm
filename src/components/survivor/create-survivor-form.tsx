'use client'

import { SelectSettlement } from '@/components/menu/select-settlement'
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
  getCampaign,
  getNextSurvivorId,
  getSettlement
} from '@/lib/utils'
import {
  BaseSurvivorSchema,
  Survivor,
  SurvivorSchema
} from '@/schemas/survivor'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter, useSearchParams } from 'next/navigation'
import { ReactElement, useEffect, useState } from 'react'
import { Resolver, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { ZodError } from 'zod'

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
export function CreateSurvivorForm(): ReactElement {
  const router = useRouter()

  // If present, get the settlementId from the URL.
  const searchParams = useSearchParams()
  const settlementIdParam = searchParams.get('settlementId')

  const [settlementId, setSettlementId] = useState<number>(
    settlementIdParam ? parseInt(settlementIdParam, 10) : 0
  )

  const form = useForm<Survivor>({
    // Need to set the type here directly, because the schema includes a lot of
    // fields with default values that are not resolved in the type.
    resolver: zodResolver(SurvivorSchema) as Resolver<Survivor>,
    defaultValues: BaseSurvivorSchema.parse({})
  })

  // Set the form values when the component mounts
  useEffect(() => {
    // Get campaign data for the campaign type.
    const settlement = getSettlement(settlementId)

    if (!settlement) return

    const updatedValues = {
      settlementId,
      canDash: canDash(settlementId),
      canFistPump: canFistPump(settlementId),
      canEncourage: canEncourage(settlementId),
      canEndure: canEndure(settlementId),
      canSurge: canSurge(settlementId),
      huntXPRankUp:
        settlement.survivorType !== SurvivorType.ARC
          ? [1, 5, 9, 14] // Core
          : [1], // Arc
      id: getNextSurvivorId(),
      understanding: bornWithUnderstanding(settlementId) ? 1 : 0
    }

    // Reset form with updated values while preserving user-entered fields
    form.reset({
      ...form.getValues(),
      ...updatedValues
    })
  }, [form, settlementId])

  /**
   * Handles form submission
   *
   * @param values Form Values
   */
  function onSubmit(values: Survivor) {
    try {
      // Validate the survivor data
      try {
        SurvivorSchema.parse(values)
      } catch (error) {
        if (error instanceof ZodError && error.errors[0]?.message)
          return toast.error(error.errors[0].message)
        else
          return toast.error(
            'The darkness swallows your words. Please try again.'
          )
      }

      // Get existing campaign
      const campaign = getCampaign()

      // Add the new survivor
      campaign.survivors.push(values)

      // Save the updated campaign to localStorage
      localStorage.setItem('campaign', JSON.stringify(campaign))

      // Show success message
      toast.success(
        'A lantern approaches. A new survivor emerges from the darkness.'
      )

      // Redirect to the survivor page
      router.push(
        `/survivor?settlementId=${values.settlementId}&survivorId=${values.id}`
      )
    } catch (error) {
      console.error('Survivor Create Error:', error)
      toast.error('The darkness swallows your words. Please try again.')
    }
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit, () => {
        toast.error('The darkness swallows your words. Please try again.')
      })}
      className="space-y-6">
      <Form {...form}>
        <Card className="max-w-[500px] mx-auto">
          <CardContent className="w-full p-4 space-y-2">
            {/* Settlement */}
            <FormField
              control={form.control}
              name="settlementId"
              render={() => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel className="text-left whitespace-nowrap min-w-[120px]">
                      Settlement
                    </FormLabel>
                    <FormControl>
                      <SelectSettlement
                        onChange={(value) => {
                          setSettlementId(parseInt(value, 10))
                          form.setValue('settlementId', parseInt(value, 10))
                        }}
                        value={settlementId.toString()}
                      />
                    </FormControl>
                  </div>
                </FormItem>
              )}
            />

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

      <Button type="submit" className="mx-auto block">
        Create Survivor
      </Button>
    </form>
  )
}
