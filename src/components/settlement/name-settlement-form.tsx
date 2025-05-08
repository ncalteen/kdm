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

export function NameSettlementForm() {
  const router = useRouter()

  // Set the default campaign and survivor type.
  const [defaultValues] = useState<Partial<z.infer<typeof SettlementSchema>>>(
    () => ({
      campaignType: CampaignType.PEOPLE_OF_THE_LANTERN,
      survivorType: SurvivorType.CORE,
      name: ''
    })
  )

  // Sets/tracks the settlement ID and lost settlement count.
  const [settlementId, setSettlementId] = useState(1)
  const [lostSettlementCount, setLostSettlementCount] = useState(0)

  // Initialize the form with the settlement schema and default values.
  const form = useForm<z.infer<typeof SettlementSchema>>({
    resolver: zodResolver(SettlementSchema),
    defaultValues: {
      ...defaultValues,
      id: settlementId,
      survivalLimit: 1,
      lostSettlements: lostSettlementCount,
      campaignType: CampaignType.PEOPLE_OF_THE_LANTERN,
      survivorType: SurvivorType.CORE
    }
  })

  useEffect(() => {
    // Get campaign data for the default campaign type
    const campaignData = getCampaignData(
      defaultValues.campaignType || CampaignType.PEOPLE_OF_THE_LANTERN
    )

    // Calculate the next settlement ID based on the latest in localStorage.
    setSettlementId(getNextSettlementId())
    defaultValues.id = getNextSettlementId()

    // Calculate the lost settlement count based on the number of settlements
    // present in localStorage.
    setLostSettlementCount(getLostSettlementCount())
    defaultValues.lostSettlements = getLostSettlementCount()

    // Set essential form fields
    form.setValue('id', getNextSettlementId())
    form.setValue('lostSettlements', getLostSettlementCount())
    form.setValue('name', '')

    // Set all the required fields with default values that will be used on submit
    form.setValue('timeline', campaignData.timeline)
    form.setValue('quarries', campaignData.quarries)
    form.setValue('nemesis', campaignData.nemesis)
    form.setValue('milestones', campaignData.milestones)
    form.setValue('departingBonuses', [])
    form.setValue('deathCount', 0)
    form.setValue('principles', campaignData.principles)
    form.setValue('patterns', [])
    form.setValue('seedPatterns', [])
    form.setValue('innovations', campaignData.innovations)
    form.setValue('locations', campaignData.locations)
    form.setValue('resources', [])
    form.setValue('gear', [])
    form.setValue('notes', '')
    form.setValue('population', 0)
  }, [form, defaultValues])

  /** Campaign Type */
  const campaignType = form.watch('campaignType')

  /** Survivor Type */
  const survivorType = form.watch('survivorType')

  /**
   * Handles the user changing the campaign type.
   *
   * @param value Campaign Type
   */
  const handleCampaignChange = (value: CampaignType) => {
    // Update the form with the selected campaign type.
    console.log('Setting campaign type to:', value)
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
    form.setValue('survivorType', value)
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
        // Set default campaign data
        timeline: campaignData.timeline,
        quarries: campaignData.quarries,
        nemesis: campaignData.nemesis,
        milestones: campaignData.milestones,
        innovations: campaignData.innovations,
        locations: campaignData.locations,
        principles: campaignData.principles,

        // Initialize empty collections
        departingBonuses: [],
        deathCount: 0,
        patterns: [],
        seedPatterns: [],
        resources: [],
        gear: [],
        population: 0,
        ccValue: 0,
        notes: '',

        // Set campaign-specific properties
        suspicions:
          values.campaignType === CampaignType.SQUIRES_OF_THE_CITADEL
            ? DefaultSquiresSuspicion
            : undefined,

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

        // Set Arc-specific properties
        ccRewards:
          values.survivorType === SurvivorType.ARC
            ? campaignData.ccRewards || []
            : undefined,

        philosophies: values.survivorType === SurvivorType.ARC ? [] : undefined,
        knowledges: values.survivorType === SurvivorType.ARC ? [] : undefined
      }

      // Get existing campaign data from localStorage or initialize new
      const campaign = JSON.parse(
        localStorage.getItem('campaign') ||
          JSON.stringify({
            settlements: [],
            survivors: []
          })
      )

      // Add the new settlement to the campaign
      campaign.settlements.push(settlement)

      // Save the updated campaign to localStorage
      localStorage.setItem('campaign', JSON.stringify(campaign))

      // Show success message
      toast.success('Settlement created successfully!')

      // Redirect to the settlement page, passing the ID via query parameters
      router.push(`/settlement?settlementId=${settlement.id}`)
    } catch (error) {
      console.error('Error creating settlement:', error)
      toast.error(
        'Failed to create settlement: ' +
          (error instanceof Error ? error.message : String(error))
      )
    }
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit, (errors) => {
        console.error('Form validation errors:', errors)
        toast.error('Please fill all required fields')
      })}
      className="space-y-6">
      <Form {...form}>
        <Card className="max-w-[800px] ml-[15px] mr-[15px]">
          <CardContent className="w-full pt-6 pb-6">
            <Card className="mb-2">
              <CardContent className="pt-2 pb-2">
                <div className="flex flex-row flex-wrap gap-4">
                  <FormField
                    control={form.control}
                    name="campaignType"
                    render={({ field }) => (
                      <FormItem className="flex-1 w-max">
                        <div className="flex items-center gap-2">
                          <FormLabel className="w-max text-left">
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
            <Card className="mb-2">
              <CardContent className="pt-2 pb-2">
                <div className="flex flex-row flex-wrap gap-4">
                  <FormField
                    control={form.control}
                    name="survivorType"
                    render={() => (
                      <FormItem className="flex-1 w-max">
                        <div className="flex items-center gap-2">
                          <FormLabel className="w-max text-left">
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
            <SettlementNameCard {...form} />
          </CardContent>
        </Card>
      </Form>

      <Button type="submit" className="ml-[15px]">
        Create Settlement
      </Button>
    </form>
  )
}
