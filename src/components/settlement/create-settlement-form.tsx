'use client'

import { SelectCampaign } from '@/components/menu/select-campaign'
import { SelectSurvivorType } from '@/components/menu/select-survivor-type'
import { SettlementNameCard } from '@/components/settlement/settlement-name/settlement-name-card'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel
} from '@/components/ui/form'
import { DefaultSquiresSuspicion } from '@/lib/common'
import { CampaignType, SurvivorType } from '@/lib/enums'
import {
  getCampaign,
  getCampaignData,
  getLostSettlementCount,
  getNextSettlementId
} from '@/lib/utils'
import {
  BaseSettlementSchema,
  Settlement,
  SettlementSchema
} from '@/schemas/settlement'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Resolver, useForm } from 'react-hook-form'
import { toast } from 'sonner'

/**
 * Create Settlement Form Component
 *
 * This component is responsible for rendering the form that allows users to
 * name and create a settlement. It includes fields for selecting the campaign
 * type, survivor type, and the settlement name.
 *
 * @returns Create Settlement Form
 */
export function CreateSettlementForm() {
  const router = useRouter()

  const form = useForm<Settlement>({
    // Need to set the type here directly, because the schema includes a lot of
    // fields with default values that are not resolved in the type.
    resolver: zodResolver(SettlementSchema) as Resolver<Settlement>,
    defaultValues: BaseSettlementSchema.parse({})
  })

  const campaignType = form.watch('campaignType')
  const survivorType = form.watch('survivorType')

  // Set the form values when the component mounts.
  useEffect(() => {
    // Get campaign data for the campaign type.
    const campaignData = getCampaignData(campaignType)

    // Calculate the next settlement ID based on the latest in localStorage.
    form.setValue('id', getNextSettlementId())

    // Calculate the lost settlement count based on the number of settlements
    // present in localStorage.
    form.setValue('lostSettlements', getLostSettlementCount())

    // Set all the required settlement fields with default values that will be
    // used when the form is submitted.
    form.setValue('innovations', campaignData.innovations)
    form.setValue('locations', campaignData.locations)
    form.setValue('milestones', campaignData.milestones)
    form.setValue('nemeses', campaignData.nemeses)
    form.setValue('principles', campaignData.principles)
    form.setValue('quarries', campaignData.quarries)
    form.setValue('timeline', campaignData.timeline)
  }, [form, campaignType])

  /**
   * Handles the user changing the campaign type.
   *
   * @param value Campaign Type
   */
  const handleCampaignChange = (value: CampaignType) => {
    // Update the form with the selected campaign type.
    form.setValue('campaignType', value)

    /** Squires of the Citadel */
    if (value === CampaignType.SQUIRES_OF_THE_CITADEL)
      // Survivor type must be Core.
      form.setValue('survivorType', SurvivorType.CORE)

    /** People of the Dream Keeper */
    if (value === CampaignType.PEOPLE_OF_THE_DREAM_KEEPER)
      // Survivor type must be Arc.
      form.setValue('survivorType', SurvivorType.ARC)

    // Set the initial survival limit.
    // - For Squires of the Citadel, set it to 6.
    // - For all other campaigns, set it to 1.
    form.setValue(
      'survivalLimit',
      value === CampaignType.SQUIRES_OF_THE_CITADEL ? 6 : 1
    )
  }

  /**
   * Handles the user changing the survivor type.
   *
   * @param value Survivor Type
   */
  const handleSurvivorTypeChange = (value: SurvivorType) => {
    // Update the survivorType in the form
    form.setValue('survivorType', value)

    // Get current locations
    const currentLocations = form.getValues('locations') || []
    const forumLocationIndex = currentLocations.findIndex(
      (loc) => loc.name === 'Forum'
    )

    // Changing to Arc survivors...add "Forum" location
    if (value === SurvivorType.ARC && forumLocationIndex === -1)
      form.setValue('locations', [
        ...currentLocations,
        { name: 'Forum', unlocked: false }
      ])
    // Changing from Arc survivors...remove "Forum" location
    else if (forumLocationIndex !== -1)
      form.setValue(
        'locations',
        currentLocations.filter((loc) => loc.name !== 'Forum')
      )
  }

  // Define a submit handler with the correct schema type
  function onSubmit(values: Settlement) {
    try {
      console.log('Form values at submission:', values)

      // Get campaign data based on the selected campaign type
      const campaignData = getCampaignData(values.campaignType)

      /*
       * Arc Survivor Settlements
       */
      if (values.survivorType === SurvivorType.ARC)
        values.ccRewards = campaignData.ccRewards

      /*
       * Squires of the Citadel Campaigns
       */
      if (values.campaignType === CampaignType.SQUIRES_OF_THE_CITADEL)
        values.suspicions = DefaultSquiresSuspicion

      // Get existing campaign data from localStorage or initialize new
      const campaign = getCampaign()

      // Add the new settlement to the campaign
      campaign.settlements.push(values)

      // Save the updated campaign to localStorage
      localStorage.setItem('campaign', JSON.stringify(campaign))

      // Show success message
      toast.success(
        'A lantern pierces the overwhelming darkness. A new settlement is born.'
      )

      // Redirect to the settlement page, passing the ID via query parameters
      router.push(`/settlement?settlementId=${values.id}`)
    } catch (error) {
      console.error('Settlement Create Error:', error)
      toast.error('The darkness refuses your offering. Please try again.')
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
            {/* Campaign Type */}
            <Card className="mb-2">
              <CardContent className="pt-2 pb-2">
                <div className="flex flex-row justify-between items-center">
                  <FormField
                    control={form.control}
                    name="campaignType"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <div className="flex items-center justify-between">
                          <FormLabel className="text-left pr-2">
                            Campaign Type
                          </FormLabel>
                          <FormControl>
                            <SelectCampaign
                              {...field}
                              value={campaignType}
                              onChange={handleCampaignChange}
                            />
                          </FormControl>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Survivor Type */}
            <Card className="mb-2">
              <CardContent className="pt-2 pb-2">
                <div className="flex flex-row justify-between items-center">
                  <FormField
                    control={form.control}
                    name="survivorType"
                    render={() => (
                      <FormItem className="w-full">
                        <div className="flex items-center justify-between">
                          <FormLabel className="text-left pr-2">
                            Survivor Type
                          </FormLabel>
                          <FormControl>
                            <SelectSurvivorType
                              value={survivorType}
                              onChange={handleSurvivorTypeChange}
                              disabled={
                                campaignType ===
                                  CampaignType.PEOPLE_OF_THE_DREAM_KEEPER ||
                                campaignType ===
                                  CampaignType.SQUIRES_OF_THE_CITADEL
                              }
                            />
                          </FormControl>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Settlement Name */}
            <SettlementNameCard {...form} />
          </CardContent>
        </Card>
      </Form>

      <Button type="submit" className="mx-auto block">
        Create Settlement
      </Button>
    </form>
  )
}
