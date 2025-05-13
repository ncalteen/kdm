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
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Form } from '@/components/ui/form'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CampaignType, SurvivorType } from '@/lib/enums'
import { Settlement } from '@/lib/types'
import { getCampaign, getSettlement } from '@/lib/utils'
import { SettlementSchema } from '@/schemas/settlement'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

export default function Page() {
  const searchParams = useSearchParams()
  const settlementIdParam = searchParams.get('settlementId')

  // Track if the component is mounted
  const isMounted = useRef(false)

  // Store the settlement data
  const [settlement, setSettlement] = useState<Settlement | undefined>(
    undefined
  )

  useEffect(() => {
    // Mark component as mounted
    isMounted.current = true

    if (settlementIdParam && isMounted.current) {
      // Parse the settlement ID parameter
      const settlementId = parseInt(settlementIdParam, 10)

      // Get the settlement data from localStorage
      try {
        const fetchedSettlement = getSettlement(settlementId)
        setSettlement(fetchedSettlement)
      } catch (error) {
        console.error('Error fetching settlement:', error)
      }
    }

    return () => {
      isMounted.current = false
    }
  }, [settlementIdParam])

  if (!settlementIdParam) {
    // If no settlement ID is provided, display a message
    return (
      <div className="grid grid-rows-[0px_1fr_0px] grid-rows-[1fr] items-center justify-items-center sm:p-8 pb-20 gap-8 sm:gap-16 font-[family-name:var(--font-geist-sans)]">
        <h1 className="text-4xl sm:text-5xl font-bold pt-[20px] text-center">
          Settlement Not Found
        </h1>
        <p className="text-xl text-center">
          No settlement ID was specified. Please go to the settlements list or
          create a new settlement.
        </p>
        <div className="mt-6">
          <Button
            onClick={() => (window.location.href = '/kdm/settlement/create')}
            variant="default">
            Create a Settlement
          </Button>
        </div>
      </div>
    )
  }

  // If settlement data is still loading or not found
  if (!settlement) {
    return (
      <div className="grid grid-rows-[0px_1fr_0px] grid-rows-[1fr] items-center justify-items-center sm:p-8 pb-20 gap-8 sm:gap-16 font-[family-name:var(--font-geist-sans)]">
        <h1 className="text-4xl sm:text-5xl font-bold pt-[20px] text-center">
          {isMounted.current ? 'Settlement Not Found' : 'Loading Settlement...'}
        </h1>
        <p className="text-xl text-center">
          {isMounted.current
            ? `No settlement was found with the ID: ${settlementIdParam}`
            : 'Loading Settlement...'}
        </p>
        {isMounted.current && (
          <div className="mt-6">
            <Button
              onClick={() => (window.location.href = '/kdm/settlement/create')}
              variant="default">
              Create a Settlement
            </Button>
          </div>
        )}
      </div>
    )
  }

  // If we have a valid settlement, render the form
  return <SettlementForm initialSettlement={settlement} />
}

function SettlementForm({
  initialSettlement
}: {
  initialSettlement: z.infer<typeof SettlementSchema>
}) {
  // Tracks the selected tab in the settlement creation form.
  const [selectedTab, setSelectedTab] = useState<string>('timeline')

  // Initialize the form with the settlement schema and loaded settlement data
  const form = useForm<z.infer<typeof SettlementSchema>>({
    resolver: zodResolver(SettlementSchema),
    defaultValues: initialSettlement
  })

  /** Campaign Type */
  const campaignType = form.watch('campaignType')

  /** Survivor Type */
  const survivorType = form.watch('survivorType')

  /** True for Arc Survivor Campaigns */
  const isArcCampaign = survivorType === SurvivorType.ARC

  /** True for Squires of the Citadel Campaigns */
  const isSquiresCampaign = campaignType === CampaignType.SQUIRES_OF_THE_CITADEL

  // Define a submit handler with the correct schema type
  function onSubmit(values: z.infer<typeof SettlementSchema>) {
    try {
      // Get existing campaign data from localStorage
      const campaign = getCampaign()

      // Find the settlement index and update it
      const settlementIndex = campaign.settlements.findIndex(
        (s: Settlement) => s.id === initialSettlement.id
      )

      if (settlementIndex !== -1) {
        campaign.settlements[settlementIndex] = values
        localStorage.setItem('campaign', JSON.stringify(campaign))
        toast.success('Settlement updated successfully!')
      } else {
        toast.error('Settlement not found')
      }
    } catch (error) {
      console.error('Error updating settlement:', error)
      toast.error(
        'Failed to update settlement: ' +
          (error instanceof Error ? error.message : String(error))
      )
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
                <TabsContent value="timeline">
                  <TimelineCard {...form} />
                </TabsContent>
                <TabsContent value="monsters">
                  <QuarriesCard {...form} />
                  <NemesesCard {...form} />
                </TabsContent>
                {isSquiresCampaign ? (
                  <TabsContent value="squires">
                    <SquireSuspicionsCard {...form} />
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
    </div>
  )
}
