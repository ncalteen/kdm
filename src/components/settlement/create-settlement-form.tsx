'use client'

import { SelectCampaign } from '@/components/menu/select-campaign'
import { SelectSurvivorType } from '@/components/menu/select-survivor-type'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { DefaultSquiresSuspicion } from '@/lib/common'
import { CampaignType, SurvivorType } from '@/lib/enums'
import {
  getCampaign,
  getCampaignData,
  getLostSettlementCount,
  getNextSettlementId,
  saveCampaignToLocalStorage
} from '@/lib/utils'
import {
  BaseSettlementSchema,
  Settlement,
  SettlementSchema
} from '@/schemas/settlement'
import { zodResolver } from '@hookform/resolvers/zod'
import { ReactElement, useEffect } from 'react'
import { Resolver, useForm } from 'react-hook-form'
import { toast } from 'sonner'

/**
 * Create Settlement Form Props
 */
interface CreateSettlementFormProps {
  settlement: Settlement | null
  setSelectedSettlement: (settlement: Settlement | null) => void
}

/**
 * Create Settlement Form Component
 *
 * This component is responsible for rendering the form that allows users to
 * name and create a settlement. It includes fields for selecting the campaign
 * type, survivor type, and the settlement name.
 *
 * @returns Create Settlement Form Component
 */
export function CreateSettlementForm({
  settlement,
  setSelectedSettlement
}: CreateSettlementFormProps): ReactElement {
  const form = useForm<Settlement>({
    // Need to set the type here directly, because the schema includes a lot of
    // fields with default values that are not resolved in the type.
    resolver: zodResolver(SettlementSchema) as Resolver<Settlement>,
    defaultValues: BaseSettlementSchema.parse({})
  })

  // Set the form values when the component mounts.
  useEffect(() => {
    // Get campaign data for the campaign type.
    const campaignData = getCampaignData(
      settlement?.campaignType || CampaignType.PEOPLE_OF_THE_LANTERN
    )

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
  }, [form, settlement?.campaignType])

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

      // Set the newly created settlement as selected
      campaign.selectedSettlementId = values.id

      // Save the updated campaign to localStorage
      saveCampaignToLocalStorage(campaign)

      // Update the selected settlement in the context
      setSelectedSettlement(values)

      // Show success message
      toast.success('A lantern pierces the darkness. A new settlement is born.')
    } catch (error) {
      console.error('Settlement Create Error:', error)
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
        <Card className="max-w-[500px] mt-10 mx-auto">
          <CardContent className="flex flex-col gap-2 w-full">
            {/* Settlement Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel className="text-left whitespace-nowrap min-w-[120px]">
                      Settlement
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Settlement Name"
                        {...field}
                        value={field.value ?? ''}
                        onChange={(e) =>
                          form.setValue(field.name, e.target.value)
                        }
                        className="w-[300px]"
                      />
                    </FormControl>
                  </div>
                </FormItem>
              )}
            />

            <hr className="my-0" />

            <div className="text-xs text-muted-foreground">
              When the settlement is named for the first time,{' '}
              <strong>returning survivors</strong> gain +1 survival.
            </div>

            {/* Campaign Type */}
            <FormField
              control={form.control}
              name="campaignType"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel className="text-left whitespace-nowrap min-w-[120px]">
                      Campaign Type
                    </FormLabel>
                    <FormControl>
                      <SelectCampaign
                        {...field}
                        value={settlement?.campaignType}
                        onChange={handleCampaignChange}
                      />
                    </FormControl>
                  </div>
                </FormItem>
              )}
            />

            {/* Survivor Type */}
            <FormField
              control={form.control}
              name="survivorType"
              render={() => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel className="text-left whitespace-nowrap min-w-[120px]">
                      Survivor Type
                    </FormLabel>
                    <FormControl>
                      <SelectSurvivorType
                        value={settlement?.survivorType}
                        onChange={handleSurvivorTypeChange}
                        disabled={
                          settlement?.campaignType ===
                            CampaignType.PEOPLE_OF_THE_DREAM_KEEPER ||
                          settlement?.campaignType ===
                            CampaignType.SQUIRES_OF_THE_CITADEL
                        }
                      />
                    </FormControl>
                  </div>
                </FormItem>
              )}
            />

            {/* Uses Scouts */}
            <FormField
              control={form.control}
              name="usesScouts"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel className="text-left whitespace-nowrap min-w-[120px]">
                      Use Scouts
                    </FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </div>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
      </Form>

      <Button type="submit" className="mx-auto block">
        Create Settlement
      </Button>
    </form>
  )
}
