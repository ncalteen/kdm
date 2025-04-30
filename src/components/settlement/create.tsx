'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Form } from '@/components/ui/form'
import {
  DefaultCcNemesisVictories,
  DefaultCcQuarryVictories,
  EmptyTimeline,
  PotDKMilestones,
  PotLMilestones,
  PotStarsMilestones,
  PotSunMilestones,
  SquiresTimeline
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
import { SettlementNameCard } from '../ui/settlement/settlement-name-card'
import { SettlementSurvivorsCard } from '../ui/settlement/settlement-survivors-card'
import { SquireCards } from '../ui/settlement/squire-cards'
import { SquireSuspicionsCard } from '../ui/settlement/squire-suspicions-card'
import { TimelineCard } from '../ui/settlement/timeline-card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'

export function CreateSettlementForm() {
  const [defaultValues, setDefaultValues] = useState<
    Partial<z.infer<typeof SettlementSchema>>
  >({})

  const form = useForm<z.infer<typeof SettlementSchema>>({
    resolver: zodResolver(SettlementSchema),
    defaultValues
  })

  const campaignType = form.watch('campaignType')
  const survivorType = form.watch('survivorType')

  // Check if Arc-specific content should be shown
  const showArcContent = survivorType === SurvivorType.ARC

  // Check if this is a Squires of the Citadel campaign
  const isSquiresCampaign = campaignType === CampaignType.SQUIRES_OF_THE_CITADEL

  // Handle campaign type change from the combobox
  const handleCampaignChange = (value: CampaignType) => {
    form.setValue('campaignType', value)

    // If People of the Dream Keeper is selected, set survivor type to Arc and disable editing
    if (value === CampaignType.PEOPLE_OF_THE_DREAM_KEEPER) {
      form.setValue('survivorType', SurvivorType.ARC)
    }

    // If Squires of the Citadel is selected, set survivor type to Core and disable editing
    if (value === CampaignType.SQUIRES_OF_THE_CITADEL) {
      form.setValue('survivorType', SurvivorType.CORE)
    }
  }

  // Handle survivor type change from the combobox
  const handleSurvivorTypeChange = (value: SurvivorType) => {
    form.setValue('survivorType', value)
  }

  // Check if a campaign that requires a specific survivor type is selected
  const isSpecificSurvivorRequired =
    campaignType === CampaignType.PEOPLE_OF_THE_DREAM_KEEPER ||
    campaignType === CampaignType.SQUIRES_OF_THE_CITADEL

  useEffect(() => {
    setDefaultValues({
      id: getNextSettlementId(),
      campaignType: CampaignType.PEOPLE_OF_THE_LANTERN,
      survivorType: SurvivorType.ARC,
      survivalLimit: 1,
      lostSettlements: getLostSettlementCount(),

      // Timeline
      // TODO: Pre-populate based on the campaign type?
      timeline:
        campaignType !== CampaignType.SQUIRES_OF_THE_CITADEL
          ? EmptyTimeline
          : SquiresTimeline,

      quarries: [],
      nemesis: [],
      milestones:
        campaignType === CampaignType.SQUIRES_OF_THE_CITADEL
          ? []
          : campaignType === CampaignType.PEOPLE_OF_THE_DREAM_KEEPER
            ? PotDKMilestones
            : campaignType === CampaignType.PEOPLE_OF_THE_LANTERN
              ? PotLMilestones
              : campaignType === CampaignType.PEOPLE_OF_THE_STARS
                ? PotStarsMilestones
                : campaignType === CampaignType.PEOPLE_OF_THE_SUN
                  ? PotSunMilestones
                  : [],
      departingBonuses: [],
      deathCount: 0,
      principles: [],
      patterns: [],
      innovations:
        campaignType === CampaignType.PEOPLE_OF_THE_LANTERN
          ? ['Language']
          : campaignType === CampaignType.PEOPLE_OF_THE_STARS
            ? ['Dragon Speech']
            : campaignType === CampaignType.PEOPLE_OF_THE_SUN
              ? ['Sun Language']
              : [],
      locations: [], // TODO: Pre-populate based on the campaign type?
      resources: [],
      gear: [],
      notes: undefined,
      population: 0,

      // Arc Survivor Settlements
      ccQuarryVictories:
        survivorType !== SurvivorType.ARC
          ? undefined
          : DefaultCcQuarryVictories,
      ccNemesisVictories:
        survivorType !== SurvivorType.ARC
          ? undefined
          : DefaultCcNemesisVictories,
      ccRewards: survivorType !== SurvivorType.ARC ? undefined : [], // TODO: Pre-populate based on the campaign type?
      philosophies: survivorType !== SurvivorType.ARC ? undefined : [],
      knowledges: survivorType !== SurvivorType.ARC ? undefined : [],

      /**
       * People of the Lantern and People of the Sun
       */
      lanternResearchLevel:
        campaignType === CampaignType.PEOPLE_OF_THE_LANTERN ||
        campaignType === CampaignType.PEOPLE_OF_THE_SUN
          ? 0
          : undefined,
      monsterVolumes:
        campaignType === CampaignType.PEOPLE_OF_THE_LANTERN ||
        campaignType === CampaignType.PEOPLE_OF_THE_SUN
          ? []
          : undefined,

      /**
       * Squires of the Citadel
       */
      suspicions:
        campaignType === CampaignType.SQUIRES_OF_THE_CITADEL
          ? [
              {
                name: 'Cain',
                level1: false,
                level2: false,
                level3: false,
                level4: false
              }
            ]
          : undefined
    })
  }, [campaignType, survivorType])

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
              defaultValue="timeline"
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
                  <SquireSuspicionsCard {...form} />
                  <SquireCards />
                </TabsContent>
              ) : (
                <TabsContent value="survivors">
                  <DepartingBonusesCard {...form} />
                  <SettlementSurvivorsCard {...form} />
                </TabsContent>
              )}
              <TabsContent value="society">
                {!isSquiresCampaign && (
                  <>
                    <MilestonesCard {...form} />
                    <PrinciplesCard {...form} />
                  </>
                )}
                <InnovationsCard {...form} />
              </TabsContent>
              <TabsContent value="crafting">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <SeedPatternsCard {...form} />
                  <PatternsCard {...form} />
                </div>
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
