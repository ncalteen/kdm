'use client'

import { SelectSettlement } from '@/components/menu/select-settlement'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Form,
  FormControl,
  FormDescription,
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
import { BaseSurvivorSchema, SurvivorSchema } from '@/schemas/survivor'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter, useSearchParams } from 'next/navigation'
import { ReactElement, useEffect, useState } from 'react'
import { Resolver, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

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

  const form = useForm<z.infer<typeof SurvivorSchema>>({
    // Need to set the type here directly, because the schema includes a lot of
    // fields with default values that are not resolved in the type.
    resolver: zodResolver(SurvivorSchema) as Resolver<
      z.infer<typeof SurvivorSchema>
    >,
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
  function onSubmit(values: z.infer<typeof SurvivorSchema>) {
    try {
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
      toast.error('The darkness binds the new survivor. Please try again.')
    }
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit, () => {
        toast.error(
          'The chronicles remain incomplete - fill in the missing fragments.'
        )
      })}
      className="space-y-6">
      <Form {...form}>
        <Card className="max-w-[800px] min-w-[560px] mx-auto">
          <CardContent className="w-full pt-6 pb-6">
            {/* Settlement */}
            <Card className="mb-2">
              <CardContent className="pt-2 pb-2">
                <div className="flex flex-row justify-between items-center">
                  <FormField
                    control={form.control}
                    name="settlementId"
                    render={() => (
                      <FormItem className="w-full">
                        <div className="flex items-center justify-between">
                          <FormLabel className="text-left pr-2">
                            Settlement
                          </FormLabel>
                          <FormControl>
                            <SelectSettlement
                              onChange={(value) => {
                                setSettlementId(parseInt(value, 10))
                                form.setValue(
                                  'settlementId',
                                  parseInt(value, 10)
                                )
                              }}
                              value={settlementId.toString()}
                            />
                          </FormControl>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Survivor Name */}
            <Card className="mb-2">
              <CardContent className="pt-2 pb-2">
                <div className="flex flex-col justify-between">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <div className="flex items-center justify-between">
                          <FormLabel className="text-left pr-2">Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Survivor name..."
                              className="w-[75%]"
                              {...field}
                              value={field.value ?? ''}
                              onChange={(e) => {
                                form.setValue(field.name, e.target.value)
                              }}
                            />
                          </FormControl>
                        </div>
                      </FormItem>
                    )}
                  />

                  <hr className="mt-2" />

                  <FormDescription className="mt-2 text-xs">
                    When you name your survivor, gain +1{' '}
                    <strong>survival</strong>.
                  </FormDescription>
                </div>
              </CardContent>
            </Card>

            {/* Survivor Gender */}
            <Card className="mb-2">
              <CardContent className="pt-2 pb-2">
                <div className="flex flex-col justify-between">
                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <div className="flex items-center justify-between">
                          <FormLabel className="text-left pr-2 w-[25%]">
                            Gender
                          </FormLabel>
                          <div className="w-[75%] flex items-center space-x-1 justify-start">
                            <div className="flex items-center space-x-1">
                              <label
                                htmlFor="male-checkbox"
                                className="text-sm font-medium leading-none cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                M
                              </label>
                              <Checkbox
                                id="male-checkbox"
                                checked={field.value === Gender.MALE}
                                onCheckedChange={(checked) => {
                                  if (checked)
                                    form.setValue('gender', Gender.MALE)
                                }}
                              />
                            </div>
                            <div className="flex items-center space-x-1">
                              <label
                                htmlFor="female-checkbox"
                                className="text-sm font-medium leading-none cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                F
                              </label>
                              <Checkbox
                                id="female-checkbox"
                                checked={field.value === Gender.FEMALE}
                                onCheckedChange={(checked) => {
                                  if (checked)
                                    form.setValue('gender', Gender.FEMALE)
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </Form>

      <Button type="submit" className="mx-auto block">
        Create Survivor
      </Button>
    </form>
  )
}
