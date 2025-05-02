'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Form } from '@/components/ui/form'
import {
  CustomCampaignData,
  DefaultCcNemesisVictories,
  DefaultCcQuarryVictories,
  DefaultSquiresSuspicion,
  PeopleOfTheDreamKeeperCampaignData,
  PeopleOfTheLanternCampaignData,
  PeopleOfTheStarsCampaignData,
  PeopleOfTheSunCampaignData,
  SquiresOfTheCitadelCampaignData
} from '@/lib/common'
import { CampaignType, SurvivorType } from '@/lib/enums'
import { getLostSettlementCount, getNextSettlementId } from '@/lib/utils'
import { SettlementSchema } from '@/schemas/settlement'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { SelectCampaignCombobox } from '../ui/menu/select-campaign-combobox'
import { SelectSurvivorTypeCombobox } from '../ui/menu/select-survivor-type-combobox'
import { CcCard } from '../ui/settlement/cc-card'
import { CcRewardsCard } from '../ui/settlement/cc-rewards-card'
import { CcVictoriesCard } from '../ui/settlement/cc-victories-card'
import { DepartingBonusesCard } from '../ui/settlement/departing-bonuses-card'
import { GearCard } from '../ui/settlement/gear-card'
import { InnovationsCard } from '../ui/settlement/innovations-card'
import { KnowledgesCard } from '../ui/settlement/knowledges-card'
import { MilestonesCard } from '../ui/settlement/milestones-card'
import { NemesisCard } from '../ui/settlement/nemesis-card'
import { PatternsCard } from '../ui/settlement/patterns-card'
import { PhilosophiesCard } from '../ui/settlement/philosophies-card'
import { PopulationCard } from '../ui/settlement/population-card'
import { PrinciplesCard } from '../ui/settlement/principles-card'
import { QuarryCard } from '../ui/settlement/quarry-card'
import { ResourcesCard } from '../ui/settlement/resources-card'
import { SeedPatternsCard } from '../ui/settlement/seed-patterns-card'
import { SettlementLocationsCard } from '../ui/settlement/settlement-locations-card'
import { SettlementNameCard } from '../ui/settlement/settlement-name-card'
import { SettlementSurvivorsCard } from '../ui/settlement/settlement-survivors-card'
import { SquireCards } from '../ui/settlement/squire-cards'
import { SquireSuspicionsCard } from '../ui/settlement/squire-suspicions-card'
import { TimelineCard } from '../ui/settlement/timeline-card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'

export function CreateSettlementForm() {
  // Use lazy initialization for the default values
  const [defaultValues] = useState<Partial<z.infer<typeof SettlementSchema>>>(
    () => ({
      campaignType: CampaignType.PEOPLE_OF_THE_LANTERN,
      survivorType: SurvivorType.CORE
    })
  )

  const [selectedTab, setSelectedTab] = useState<string>('timeline')

  // Use state to store the ID and lost settlement count to ensure they're only calculated on the client side
  const [settlementId, setSettlementId] = useState(1)
  const [lostSettlementCount, setLostSettlementCount] = useState(0)

  const form = useForm<z.infer<typeof SettlementSchema>>({
    resolver: zodResolver(SettlementSchema),
    defaultValues: {
      ...defaultValues,
      id: settlementId,
      survivalLimit: 1,
      lostSettlements: lostSettlementCount,
      timeline: PeopleOfTheLanternCampaignData.timeline,
      quarries: PeopleOfTheLanternCampaignData.quarries,
      nemesis: PeopleOfTheLanternCampaignData.nemesis,
      milestones: PeopleOfTheLanternCampaignData.milestones,
      departingBonuses: [],
      deathCount: 0,
      principles: PeopleOfTheLanternCampaignData.principles,
      patterns: [],
      innovations: PeopleOfTheLanternCampaignData.innovations,
      locations: PeopleOfTheLanternCampaignData.locations, // Add Forum if using ARC survivors
      resources: [],
      gear: [],
      population: 0,
      lanternResearchLevel: 0,
      monsterVolumes: []
    }
  })

  useEffect(() => {
    // Get the next settlement ID from localStorage
    setSettlementId(getNextSettlementId())
    defaultValues.id = getNextSettlementId()
    form.setValue('id', getNextSettlementId())

    // Get the lost settlement count from localStorage
    setLostSettlementCount(getLostSettlementCount())
    defaultValues.lostSettlements = getLostSettlementCount()
    form.setValue('lostSettlements', getLostSettlementCount())
  }, [form, defaultValues])

  const campaignType = form.watch('campaignType')
  const survivorType = form.watch('survivorType')

  // Check if Arc-specific content should be shown
  const showArcContent = survivorType === SurvivorType.ARC

  // Check if this is a Squires of the Citadel campaign
  const isSquiresCampaign = campaignType === CampaignType.SQUIRES_OF_THE_CITADEL

  // Handle campaign type change from the combobox
  const handleCampaignChange = (value: CampaignType) => {
    form.setValue('campaignType', value)
    setSelectedTab('timeline') // Reset to timeline tab when campaign type changes

    // Set survival limit
    form.setValue(
      'survivalLimit',
      value === CampaignType.SQUIRES_OF_THE_CITADEL ? 6 : 1
    )

    // If People of the Dream Keeper is selected, set survivor type to Arc and disable editing
    if (value === CampaignType.PEOPLE_OF_THE_DREAM_KEEPER) {
      form.setValue('survivorType', SurvivorType.ARC)
    }

    // Set appropriate timeline based on campaign type (without deep nesting)
    form.setValue(
      'timeline',
      value === CampaignType.SQUIRES_OF_THE_CITADEL
        ? SquiresOfTheCitadelCampaignData.timeline
        : value === CampaignType.PEOPLE_OF_THE_DREAM_KEEPER
          ? PeopleOfTheDreamKeeperCampaignData.timeline
          : value === CampaignType.PEOPLE_OF_THE_LANTERN
            ? PeopleOfTheLanternCampaignData.timeline
            : value === CampaignType.PEOPLE_OF_THE_STARS
              ? PeopleOfTheStarsCampaignData.timeline
              : value === CampaignType.PEOPLE_OF_THE_SUN
                ? PeopleOfTheSunCampaignData.timeline
                : CustomCampaignData.timeline
    )

    // Set appropriate milestones
    form.setValue(
      'milestones',
      value === CampaignType.SQUIRES_OF_THE_CITADEL
        ? SquiresOfTheCitadelCampaignData.milestones
        : value === CampaignType.PEOPLE_OF_THE_DREAM_KEEPER
          ? PeopleOfTheDreamKeeperCampaignData.milestones
          : value === CampaignType.PEOPLE_OF_THE_LANTERN
            ? PeopleOfTheLanternCampaignData.milestones
            : value === CampaignType.PEOPLE_OF_THE_STARS
              ? PeopleOfTheStarsCampaignData.milestones
              : value === CampaignType.PEOPLE_OF_THE_SUN
                ? PeopleOfTheSunCampaignData.milestones
                : CustomCampaignData.milestones
    )

    // Set appropriate innovations
    form.setValue(
      'innovations',
      value === CampaignType.SQUIRES_OF_THE_CITADEL
        ? SquiresOfTheCitadelCampaignData.innovations
        : value === CampaignType.PEOPLE_OF_THE_DREAM_KEEPER
          ? PeopleOfTheDreamKeeperCampaignData.innovations
          : value === CampaignType.PEOPLE_OF_THE_LANTERN
            ? PeopleOfTheLanternCampaignData.innovations
            : value === CampaignType.PEOPLE_OF_THE_STARS
              ? PeopleOfTheStarsCampaignData.innovations
              : value === CampaignType.PEOPLE_OF_THE_SUN
                ? PeopleOfTheSunCampaignData.innovations
                : CustomCampaignData.innovations
    )

    // Set suspicions for Squires campaign
    if (value === CampaignType.SQUIRES_OF_THE_CITADEL) {
      form.setValue('suspicions', DefaultSquiresSuspicion)
    }

    // Set lantern research for appropriate campaigns
    const hasLanternResearch =
      value === CampaignType.PEOPLE_OF_THE_LANTERN ||
      value === CampaignType.PEOPLE_OF_THE_SUN

    form.setValue('lanternResearchLevel', hasLanternResearch ? 0 : undefined)
    form.setValue('monsterVolumes', hasLanternResearch ? [] : undefined)

    if (value === CampaignType.SQUIRES_OF_THE_CITADEL) {
      form.setValue('survivorType', SurvivorType.CORE)
    }
  }

  // Handle survivor type change from the combobox
  const handleSurvivorTypeChange = (value: SurvivorType) => {
    form.setValue('survivorType', value)
    setSelectedTab('timeline')

    // Set Arc-specific data when survivor type is Arc
    if (value === SurvivorType.ARC) {
      form.setValue('ccQuarryVictories', DefaultCcQuarryVictories)
      form.setValue('ccNemesisVictories', DefaultCcNemesisVictories)
      form.setValue('ccRewards', [])
      form.setValue('philosophies', [])
      form.setValue('knowledges', [])
    } else {
      form.setValue('ccQuarryVictories', undefined)
      form.setValue('ccNemesisVictories', undefined)
      form.setValue('ccRewards', undefined)
      form.setValue('philosophies', undefined)
      form.setValue('knowledges', undefined)
    }
  }

  // Check if a campaign that requires a specific survivor type is selected
  const isSpecificSurvivorRequired =
    campaignType === CampaignType.PEOPLE_OF_THE_DREAM_KEEPER ||
    campaignType === CampaignType.SQUIRES_OF_THE_CITADEL

  // Define a submit handler with the correct schema type
  function onSubmit(values: z.infer<typeof SettlementSchema>) {
    // Do something with the form values.
    console.log(values)
    toast.success('Settlement created successfully!')
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex justify-center gap-4 mb-4">
        <SelectCampaignCombobox
          value={campaignType}
          onChange={handleCampaignChange}
        />
        <SelectSurvivorTypeCombobox
          value={survivorType}
          onChange={handleSurvivorTypeChange}
          disabled={isSpecificSurvivorRequired}
        />
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
                {showArcContent && (
                  <TabsTrigger value="arc" className="flex-1">
                    Arc
                  </TabsTrigger>
                )}
              </TabsList>
              <TabsContent value="timeline">
                <TimelineCard {...form} />
              </TabsContent>
              <TabsContent value="monsters">
                <QuarryCard {...form} />
                <NemesisCard {...form} />
              </TabsContent>
              {isSquiresCampaign ? (
                <TabsContent value="squires">
                  <SquireSuspicionsCard
                    control={form.control}
                    setValue={form.setValue}
                    watch={form.watch}
                  />
                  <SquireCards />
                </TabsContent>
              ) : (
                <TabsContent value="survivors">
                  <DepartingBonusesCard {...form} />
                  <SettlementSurvivorsCard {...form} />
                </TabsContent>
              )}
              <TabsContent value="society">
                <InnovationsCard {...form} />
                {!isSquiresCampaign && (
                  <>
                    <MilestonesCard {...form} />
                    <PrinciplesCard {...form} />
                    <SettlementLocationsCard {...form} />
                  </>
                )}
              </TabsContent>
              <TabsContent value="crafting">
                {!isSquiresCampaign && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <SeedPatternsCard {...form} />
                    <PatternsCard {...form} />
                  </div>
                )}
                <ResourcesCard {...form} />
                <GearCard {...form} />
              </TabsContent>
              {showArcContent && (
                <TabsContent value="arc">
                  <CcCard {...form} />
                  <CcVictoriesCard {...form} />
                  <CcRewardsCard {...form} />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <PhilosophiesCard {...form} />
                    <KnowledgesCard {...form} />
                  </div>
                </TabsContent>
              )}
            </Tabs>
          </CardContent>
          <CardFooter>
            <Button type="submit">Create Settlement</Button>
          </CardFooter>
        </Card>
      </Form>
    </form>
  )
}
