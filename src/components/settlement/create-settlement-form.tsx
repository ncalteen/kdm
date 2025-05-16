'use client'

import { SelectCampaign } from '@/components/menu/select-campaign'
import { SelectSurvivorType } from '@/components/menu/select-survivor-type'
import { SettlementNameCard } from '@/components/settlement/settlement-name-card'
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
import { SettlementSchema } from '@/schemas/settlement'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

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

  // Set the default campaign and survivor type.
  const [defaultValues] = useState<Partial<z.infer<typeof SettlementSchema>>>(
    () => ({
      campaignType: CampaignType.PEOPLE_OF_THE_LANTERN,
      survivorType: SurvivorType.CORE
    })
  )

  // Sets/tracks the settlement ID and lost settlement count.
  const [settlementId, setSettlementId] = useState(1)
  const [lostSettlements, setLostSettlements] = useState(0)

  // Initialize the form with the settlement schema and default values.
  const form = useForm<z.infer<typeof SettlementSchema>>({
    resolver: zodResolver(SettlementSchema),
    defaultValues: {
      ...defaultValues,
      id: settlementId,
      survivalLimit: 1,
      lostSettlements
    }
  })

  /** Campaign Type */
  const campaignType = form.watch('campaignType')

  /** Survivor Type */
  const survivorType = form.watch('survivorType')

  // Set the initial values for the form fields when the component mounts.
  useEffect(() => {
    // Get campaign data for the campaign type.
    const campaignData = getCampaignData(
      defaultValues.campaignType || CampaignType.PEOPLE_OF_THE_LANTERN
    )

    // Calculate the next settlement ID based on the latest in localStorage.
    setSettlementId(getNextSettlementId())
    defaultValues.id = getNextSettlementId()

    // Calculate the lost settlement count based on the number of settlements
    // present in localStorage.
    setLostSettlements(getLostSettlementCount())
    defaultValues.lostSettlements = getLostSettlementCount()

    // Update the essential form fields.
    form.setValue('id', getNextSettlementId())
    form.setValue('lostSettlements', getLostSettlementCount())

    // Set all the required settlement fields with default values that will be
    // used when the form is submitted.
    form.setValue('deathCount', 0)
    form.setValue('departingBonuses', [])
    form.setValue('gear', [])
    form.setValue('innovations', campaignData.innovations)
    form.setValue('locations', campaignData.locations)
    form.setValue('milestones', campaignData.milestones)
    form.setValue('nemeses', campaignData.nemeses)
    form.setValue('patterns', [])
    form.setValue('population', 0)
    form.setValue('principles', campaignData.principles)
    form.setValue('quarries', campaignData.quarries)
    form.setValue('resources', [])
    form.setValue('seedPatterns', [])
    form.setValue('timeline', campaignData.timeline)
  }, [form, defaultValues])

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
  function onSubmit(values: z.infer<typeof SettlementSchema>) {
    try {
      console.log('Form values at submission:', values)

      // Get campaign data based on the selected campaign type
      const campaignData = getCampaignData(values.campaignType)

      // Create a complete settlement object with all required fields
      const settlement = {
        ...values,
        // Set values from the default campaign data.
        innovations: campaignData.innovations,
        locations: campaignData.locations,
        milestones: campaignData.milestones,
        nemeses: campaignData.nemeses,
        principles: campaignData.principles,
        quarries: campaignData.quarries,
        timeline: campaignData.timeline,

        // Initialize empty properties.
        deathCount: 0,
        departingBonuses: [],
        gear: [],
        notes: undefined,
        patterns: [],
        population: 0,
        resources: [],
        seedPatterns: [],

        /*
         * Arc Survivor Settlements
         */
        ccRewards:
          values.survivorType === SurvivorType.ARC
            ? campaignData.ccRewards || []
            : undefined,
        ccValue: values.survivorType === SurvivorType.ARC ? 0 : undefined,
        knowledges: values.survivorType === SurvivorType.ARC ? [] : undefined,
        philosophies: values.survivorType === SurvivorType.ARC ? [] : undefined,

        /*
         * People of the Lantern/Sun Campaigns
         */
        lanternResearchLevel:
          values.campaignType === CampaignType.PEOPLE_OF_THE_LANTERN ||
          values.campaignType === CampaignType.PEOPLE_OF_THE_SUN
            ? 0
            : undefined,
        monsterVolumes:
          values.campaignType === CampaignType.PEOPLE_OF_THE_LANTERN ||
          values.campaignType === CampaignType.PEOPLE_OF_THE_SUN
            ? []
            : undefined,

        /*
         * Squires of the Citadel Campaigns
         */
        suspicions:
          values.campaignType === CampaignType.SQUIRES_OF_THE_CITADEL
            ? DefaultSquiresSuspicion
            : undefined
      }

      // Get existing campaign data from localStorage or initialize new
      const campaign = getCampaign()

      // Add the new settlement to the campaign
      campaign.settlements.push(settlement)

      // Save the updated campaign to localStorage
      localStorage.setItem('campaign', JSON.stringify(campaign))

      // Show success message
      toast.success(
        'A lantern pierces the overwhelming darkness. A new settlement is born!'
      )

      // Redirect to the settlement page, passing the ID via query parameters
      router.push(`/settlement?settlementId=${settlement.id}`)
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
