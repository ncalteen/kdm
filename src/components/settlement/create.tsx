'use client'

import { SelectCampaign } from '@/components/menu/select-campaign'
import { SelectSurvivorType } from '@/components/menu/select-survivor-type'
import { CollectiveCognitionCard } from '@/components/settlement/arc/collective-cognition-card'
import { CollectiveCognitionRewardsCard } from '@/components/settlement/arc/collective-cognition-rewards-card'
import { CollectiveCognitionVictoriesCard } from '@/components/settlement/arc/collective-cognition-victories-card'
import { KnowledgesCard } from '@/components/settlement/arc/knowledges-card'
import { PhilosophiesCard } from '@/components/settlement/arc/philosophies-card'
import { DepartingBonusesCard } from '@/components/settlement/departing-bonuses/departing-bonuses-card'
import { GearCard } from '@/components/settlement/gear/gear-card'
import { InnovationsCard } from '@/components/settlement/innovations/innovations-card'
import { LanternResearchLevelCard } from '@/components/settlement/lantern-research/lantern-research-level-card'
import { LocationsCard } from '@/components/settlement/locations/locations-card'
import { MilestonesCard } from '@/components/settlement/milestones/milestones-card'
import { MonsterVolumesCard } from '@/components/settlement/monster-volumes/monster-volumes-card'
import { NemesesCard } from '@/components/settlement/nemeses/nemeses-card'
import { NotesCard } from '@/components/settlement/notes-card'
import { PatternsCard } from '@/components/settlement/patterns/patterns-card'
import { SeedPatternsCard } from '@/components/settlement/patterns/seed-patterns-card'
import { PopulationCard } from '@/components/settlement/population-card'
import { PrinciplesCard } from '@/components/settlement/principles/principles-card'
import { QuarriesCard } from '@/components/settlement/quarries/quarries-card'
import { ResourcesCard } from '@/components/settlement/resources/resources-card'
import { SettlementNameCard } from '@/components/settlement/settlement-name-card'
import { SquireProgressionCards } from '@/components/settlement/squires/squire-progression-cards'
import { SquireSuspicionsCard } from '@/components/settlement/squires/squire-suspicions-card'
import { TimelineCard } from '@/components/settlement/timeline/timeline-card'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Form } from '@/components/ui/form'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  DefaultSquiresSuspicion,
  PeopleOfTheLanternCampaignData
} from '@/lib/common'
import { CampaignType, SurvivorType } from '@/lib/enums'
import {
  getCampaignData,
  getLostSettlementCount,
  getNextSettlementId
} from '@/lib/utils'
import { SettlementSchema } from '@/schemas/settlement'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

export function CreateSettlementForm() {
  // Tracks the selected tab in the settlement creation form.
  const [selectedTab, setSelectedTab] = useState<string>('timeline')

  // Set the default campaign and survivor type.
  const [defaultValues] = useState<Partial<z.infer<typeof SettlementSchema>>>(
    () => ({
      campaignType: CampaignType.PEOPLE_OF_THE_LANTERN,
      survivorType: SurvivorType.CORE
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
      timeline: PeopleOfTheLanternCampaignData.timeline,
      quarries: PeopleOfTheLanternCampaignData.quarries,
      nemeses: PeopleOfTheLanternCampaignData.nemeses,
      milestones: PeopleOfTheLanternCampaignData.milestones,
      departingBonuses: [],
      deathCount: 0,
      principles: PeopleOfTheLanternCampaignData.principles,
      patterns: [],
      innovations: PeopleOfTheLanternCampaignData.innovations,
      locations: PeopleOfTheLanternCampaignData.locations,
      resources: [],
      gear: [],
      population: 0,
      lanternResearchLevel: 0,
      monsterVolumes: []
    }
  })

  useEffect(() => {
    // Calculate the next settlement ID based on the latest in localStorage.
    setSettlementId(getNextSettlementId())
    defaultValues.id = getNextSettlementId()
    form.setValue('id', getNextSettlementId())

    // Calculate the lost settlement count based on the number of settlements
    // present in localStorage.
    setLostSettlementCount(getLostSettlementCount())
    defaultValues.lostSettlements = getLostSettlementCount()
    form.setValue('lostSettlements', getLostSettlementCount())
  }, [form, defaultValues])

  /** Campaign Type */
  const campaignType = form.watch('campaignType')

  /** Survivor Type */
  const survivorType = form.watch('survivorType')

  /** True for Arc Survivor Campaigns */
  const isArcCampaign = survivorType === SurvivorType.ARC

  /** True for Squires of the Citadel Campaigns */
  const isSquiresCampaign = campaignType === CampaignType.SQUIRES_OF_THE_CITADEL

  /**
   * Handles the user changing the campaign type.
   *
   * @param value Campaign Type
   */
  const handleCampaignChange = (value: CampaignType) => {
    const campaignData = getCampaignData(value)

    // Update the form with the selected campaign type.
    form.setValue('campaignType', value)

    // Reset the campaign data based on selected campaign type.
    // NOTE: This clears all user-editable collections to start fresh with the
    //       new campaign.
    form.setValue('timeline', campaignData.timeline)
    form.setValue('quarries', campaignData.quarries)
    form.setValue('nemeses', campaignData.nemeses)
    form.setValue('milestones', campaignData.milestones)
    form.setValue('innovations', campaignData.innovations)
    form.setValue('locations', campaignData.locations)
    form.setValue('principles', campaignData.principles)

    /** Squires of the Citadel */
    if (value === CampaignType.SQUIRES_OF_THE_CITADEL) {
      // Survivor type must be Core.
      form.setValue('survivorType', SurvivorType.CORE)

      // Suspicions must be set.
      form.setValue('suspicions', DefaultSquiresSuspicion)
    } else form.setValue('suspicions', undefined)

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

    // If there are default Collective Cognition rewards, set them.
    if (campaignData.ccRewards && campaignData.ccRewards.length > 0)
      form.setValue('ccRewards', campaignData.ccRewards)
    else if (form.watch('survivorType') === SurvivorType.ARC)
      form.setValue('ccRewards', [])
    else form.setValue('ccRewards', undefined)

    // If the campaign requires Lantern Research, set the initial values.
    const hasLanternResearch =
      campaignType === CampaignType.PEOPLE_OF_THE_LANTERN ||
      campaignType === CampaignType.PEOPLE_OF_THE_SUN

    form.setValue('lanternResearchLevel', hasLanternResearch ? 0 : undefined)
    form.setValue('monsterVolumes', hasLanternResearch ? [] : undefined)

    // Clear user-editable collections to start fresh with the new campaign.
    form.setValue('departingBonuses', [])
    form.setValue('patterns', [])
    form.setValue('seedPatterns', [])
    form.setValue('resources', [])
    form.setValue('gear', [])
    form.setValue('deathCount', 0)
    form.setValue('population', 0)
    form.setValue('ccValue', 0)
  }

  /**
   * Handles the user changing the survivor type.
   *
   * @param value Survivor Type
   */
  const handleSurvivorTypeChange = (value: SurvivorType) => {
    const campaignData = getCampaignData(form.watch('campaignType'))

    form.setValue('survivorType', value)

    // Reset the selected tab, since the user could be on one of the tabs that
    // are specific to a survivor type.
    setSelectedTab('timeline')

    // Set/unset Arc-specific data.
    if (value === SurvivorType.ARC) {
      form.setValue('ccRewards', campaignData.ccRewards || [])
      form.setValue('philosophies', [])
      form.setValue('knowledges', [])
    } else {
      form.setValue('ccRewards', undefined)
      form.setValue('philosophies', undefined)
      form.setValue('knowledges', undefined)
    }
  }

  // Define a submit handler with the correct schema type
  function onSubmit(values: z.infer<typeof SettlementSchema>) {
    // Do something with the form values.
    console.log(values)
    toast.success('Settlement created successfully!')
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex justify-between items-center gap-4 mb-4">
        <div className="flex gap-4">
          <SelectCampaign
            value={campaignType}
            onChange={handleCampaignChange}
          />
          <SelectSurvivorType
            value={survivorType}
            onChange={handleSurvivorTypeChange}
            disabled={
              campaignType === CampaignType.PEOPLE_OF_THE_DREAM_KEEPER ||
              campaignType === CampaignType.SQUIRES_OF_THE_CITADEL
            }
          />
        </div>
        <Button type="submit">Create Settlement</Button>
      </div>

      <Form {...form}>
        <Card className="min-w-[800px] max-w-[800px] mx-auto">
          <CardContent className="w-full pt-2">
            <SettlementNameCard {...form} />
            <PopulationCard {...form} />
            <Tabs
              value={selectedTab}
              onValueChange={setSelectedTab}
              className="text-center pt-2 pb-4 w-full">
              <TabsList className="w-full">
                <TabsTrigger value="timeline" className="flex-1">
                  Timeline
                </TabsTrigger>
                {!isSquiresCampaign && (
                  <TabsTrigger value="monsters" className="flex-1">
                    Monsters
                  </TabsTrigger>
                )}
                {isSquiresCampaign ? (
                  <TabsTrigger value="squires" className="flex-1">
                    Squires
                  </TabsTrigger>
                ) : (
                  <TabsTrigger value="survivors" className="flex-1">
                    Survivors
                  </TabsTrigger>
                )}
                <TabsTrigger value="society" className="flex-1">
                  Society
                </TabsTrigger>
                <TabsTrigger value="crafting" className="flex-1">
                  Crafting
                </TabsTrigger>
                {isArcCampaign && (
                  <TabsTrigger value="arc" className="flex-1">
                    Arc
                  </TabsTrigger>
                )}
                <TabsTrigger value="notes" className="flex-1">
                  Notes
                </TabsTrigger>
              </TabsList>
              <TabsContent value="timeline">
                <TimelineCard {...form} />
              </TabsContent>
              <TabsContent value="monsters">
                <QuarriesCard {...form} />
                <NemesesCard {...form} />
              </TabsContent>
              {isSquiresCampaign ? (
                <TabsContent value="squires">
                  <SquireSuspicionsCard
                    control={form.control}
                    setValue={form.setValue}
                    watch={form.watch}
                  />
                  <SquireProgressionCards />
                </TabsContent>
              ) : (
                <TabsContent value="survivors">
                  <DepartingBonusesCard {...form} />
                  {(campaignType === CampaignType.PEOPLE_OF_THE_LANTERN ||
                    campaignType === CampaignType.PEOPLE_OF_THE_SUN) && (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <LanternResearchLevelCard {...form} />
                        <MonsterVolumesCard {...form} />
                      </div>
                    </>
                  )}
                </TabsContent>
              )}
              <TabsContent value="society">
                {(!isSquiresCampaign && (
                  <>
                    <MilestonesCard {...form} />
                    <PrinciplesCard {...form} />
                    <InnovationsCard {...form} />
                    <LocationsCard {...form} />
                  </>
                )) || <InnovationsCard {...form} />}
              </TabsContent>
              <TabsContent value="crafting">
                {!isSquiresCampaign && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <SeedPatternsCard {...form} />
                    <PatternsCard {...form} />
                  </div>
                )}
                <ResourcesCard {...form} />
                <GearCard {...form} />
              </TabsContent>
              {isArcCampaign && (
                <TabsContent value="arc">
                  <CollectiveCognitionCard {...form} />
                  <CollectiveCognitionVictoriesCard {...form} />
                  <CollectiveCognitionRewardsCard {...form} />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <PhilosophiesCard {...form} />
                    <KnowledgesCard {...form} />
                  </div>
                </TabsContent>
              )}
              <TabsContent value="notes">
                <NotesCard {...form} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </Form>
    </form>
  )
}
