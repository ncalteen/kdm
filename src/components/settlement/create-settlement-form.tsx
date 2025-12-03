'use client'

import { SelectCampaignType } from '@/components/menu/select-campaign-type'
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
import { ERROR_MESSAGE, SETTLEMENT_CREATED_MESSAGE } from '@/lib/messages'
import {
  getCampaign,
  getCampaignData,
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
import { Resolver, useForm, useWatch } from 'react-hook-form'
import { toast } from 'sonner'

/**
 * Create Settlement Form Properties
 */
interface CreateSettlementFormProps {
  /** Set Selected Settlement */
  setSelectedSettlement: (settlement: Settlement | null) => void
}

/**
 * Create Settlement Form Component
 *
 * This component is responsible for rendering the form that allows users to
 * name and create a settlement. It includes fields for selecting the campaign
 * type, survivor type, and the settlement name.
 *
 * @param props Create Settlement Form Properties
 * @returns Create Settlement Form Component
 */
export function CreateSettlementForm({
  setSelectedSettlement
}: CreateSettlementFormProps): ReactElement {
  const form = useForm<Settlement>({
    resolver: zodResolver(SettlementSchema) as Resolver<Settlement>,
    defaultValues: BaseSettlementSchema.parse({})
  })

  const watchedCampaignType = useWatch({
    control: form.control,
    name: 'campaignType'
  })
  const watchedSurvivorType = useWatch({
    control: form.control,
    name: 'survivorType'
  })

  // Set the form values when the component mounts.
  useEffect(() => {
    console.debug('[CreateSettlementForm] Initializing Form Values')

    // Get campaign data for the campaign type.
    const campaignData = getCampaignData(
      watchedCampaignType || CampaignType.PEOPLE_OF_THE_LANTERN
    )

    form.setValue('id', getNextSettlementId())
    form.setValue('lostSettlements', 0)
    form.setValue('innovations', campaignData.innovations)
    form.setValue('locations', campaignData.locations)
    form.setValue('milestones', campaignData.milestones)
    form.setValue('nemeses', campaignData.nemeses)
    form.setValue('principles', campaignData.principles)
    form.setValue('quarries', campaignData.quarries)
    form.setValue('timeline', campaignData.timeline)
    form.setValue(
      'campaignType',
      watchedCampaignType || CampaignType.PEOPLE_OF_THE_LANTERN
    )

    /** Squires of the Citadel */
    if (watchedCampaignType === CampaignType.SQUIRES_OF_THE_CITADEL)
      // Survivor type must be Core.
      form.setValue('survivorType', SurvivorType.CORE)

    /** People of the Dream Keeper */
    if (watchedCampaignType === CampaignType.PEOPLE_OF_THE_DREAM_KEEPER)
      // Survivor type must be Arc.
      form.setValue('survivorType', SurvivorType.ARC)

    // - For Squires of the Citadel, set it to 6.
    // - For all other campaigns, set it to 1.
    form.setValue(
      'survivalLimit',
      watchedCampaignType === CampaignType.SQUIRES_OF_THE_CITADEL ? 6 : 1
    )

    // Get current locations
    const currentLocations = form.getValues('locations') || []
    const forumLocationIndex = currentLocations.findIndex(
      (loc) => loc.name === 'Forum'
    )

    // Changing to Arc survivors...add "Forum" location
    if (watchedSurvivorType === SurvivorType.ARC && forumLocationIndex === -1)
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
  }, [form, watchedCampaignType, watchedSurvivorType])

  function onSubmit(values: Settlement) {
    try {
      // Get campaign data based on the selected campaign type
      const campaignData = getCampaignData(values.campaignType)

      // Arc Survivor Settlements
      if (values.survivorType === SurvivorType.ARC)
        values.ccRewards = campaignData.ccRewards

      // Squires of the Citadel Campaigns
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
      toast.success(SETTLEMENT_CREATED_MESSAGE())
    } catch (error) {
      console.error('Settlement Create Error:', error)
      toast.error(ERROR_MESSAGE())
    }
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit, () => {
        toast.error(ERROR_MESSAGE())
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
                        className="w-full max-w-[250px]"
                      />
                    </FormControl>
                  </div>
                </FormItem>
              )}
            />

            <hr className="my-0" />

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
                      <SelectCampaignType
                        {...field}
                        value={
                          field.value || CampaignType.PEOPLE_OF_THE_LANTERN
                        }
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
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel className="text-left whitespace-nowrap min-w-[120px]">
                      Survivor Type
                    </FormLabel>
                    <FormControl>
                      <SelectSurvivorType
                        value={
                          watchedCampaignType ===
                          CampaignType.PEOPLE_OF_THE_DREAM_KEEPER
                            ? SurvivorType.ARC
                            : watchedCampaignType ===
                                CampaignType.SQUIRES_OF_THE_CITADEL
                              ? SurvivorType.CORE
                              : watchedSurvivorType
                        }
                        onChange={field.onChange}
                        disabled={
                          watchedCampaignType ===
                            CampaignType.PEOPLE_OF_THE_DREAM_KEEPER ||
                          watchedCampaignType ===
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
