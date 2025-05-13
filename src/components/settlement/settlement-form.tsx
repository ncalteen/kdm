'use client'

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
import { Card, CardContent } from '@/components/ui/card'
import { Form } from '@/components/ui/form'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CampaignType, SurvivorType } from '@/lib/enums'
import type { Settlement } from '@/lib/types'
import { getCampaign } from '@/lib/utils'
import { SettlementSchema } from '@/schemas/settlement'
import { zodResolver } from '@hookform/resolvers/zod'
import { type ReactElement, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

/**
 * Settlement Form Component Properties
 */
export interface SettlementFormProps {
  /** Initial Settlement Data */
  initialSettlement: z.infer<typeof SettlementSchema>
}

/**
 * Settlement Form Component
 *
 * This component is responsible for rendering the settlement creation/editing
 * form.
 *
 * When creating a new settlement, the user must choose the campaign/survivor
 * type and provide a name for the settlement. The remainder of the settlement
 * data is filled in automatically based on the selected campaign type.
 *
 * When editing an existing settlement, the user can modify the settlement
 * details, including the name, population, timeline, society, crafting,
 * survivors, and monsters.
 */
export function SettlementForm({
  initialSettlement
}: SettlementFormProps): ReactElement {
  // Tracks the selected tab in the settlement creation form.
  const [selectedTab, setSelectedTab] = useState<string>('timeline')

  // Initialize the form with the settlement schema and loaded settlement data
  const form = useForm<z.infer<typeof SettlementSchema>>({
    resolver: zodResolver(SettlementSchema),
    defaultValues: initialSettlement
  })

  const campaignType = form.watch('campaignType')
  const survivorType = form.watch('survivorType')
  const isArcCampaign = survivorType === SurvivorType.ARC
  const isSquiresCampaign = campaignType === CampaignType.SQUIRES_OF_THE_CITADEL

  /**
   * Callback function to handle form submission.
   *
   * This function is called when the form is submitted and validates the form
   * data. If the data is valid, it updates the settlement data in localStorage
   * and displays a success message. If there is an error, it displays an error
   * message.
   *
   * @param values Settlement Form Values
   */
  function onSubmit(values: z.infer<typeof SettlementSchema>) {
    try {
      const campaign = getCampaign()
      const settlementIndex = campaign.settlements.findIndex(
        (s: Settlement) => s.id === initialSettlement.id
      )

      if (settlementIndex !== -1) {
        campaign.settlements[settlementIndex] = values
        localStorage.setItem('campaign', JSON.stringify(campaign))
        toast.success(
          'In the vast darkness, a new settlement flickers to life.'
        )
      } else {
        console.error(`Settlement Not Found: ${initialSettlement.id}`)
        toast.error('Your settlement is lost to the void.')
      }
    } catch (error) {
      console.error('Settlement Create Error:', error)
      toast.error('The darkness rejects your offering. Please try again.')
    }
  }

  return (
    <div className="grid grid-rows-[0px_1fr_0px] grid-rows-[1fr] items-center justify-items-center sm:p-8 pb-20 gap-8 sm:gap-16 font-[family-name:var(--font-geist-sans)]">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Form {...form}>
          {/* Settlement Overview */}
          <Card className="min-w-[800px] max-w-[800px] mx-auto">
            <CardContent className="w-full pt-6">
              <SettlementNameCard {...form} />
              <PopulationCard {...form} />
            </CardContent>
          </Card>

          {/* Settlement Tabs */}
          <Card className="min-w-[800px] max-w-[800px] mx-auto">
            <CardContent className="w-full pt-2">
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
                {/* Timeline */}
                <TabsContent value="timeline">
                  <TimelineCard {...form} />
                </TabsContent>

                {/* Monsters */}
                <TabsContent value="monsters">
                  <QuarriesCard {...form} />
                  <NemesesCard {...form} />
                </TabsContent>

                {isSquiresCampaign ? (
                  // Squires of the Citadel - Suspicions and Progression
                  <TabsContent value="squires">
                    <SquireSuspicionsCard {...form} />
                    <SquireProgressionCards />
                  </TabsContent>
                ) : (
                  // Survivors - Departing Bonuses and Lantern Research
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

                {/* Society */}
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

                {/* Crafting */}
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

                {/* Arc Surviors */}
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

                {/* Settlement Notes */}
                <TabsContent value="notes">
                  <NotesCard {...form} />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </Form>
      </form>
    </div>
  )
}
