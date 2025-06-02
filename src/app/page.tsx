'use client'

import { CollectiveCognitionRewardsCard } from '@/components/settlement/arc/collective-cognition-rewards-card'
import { CollectiveCognitionVictoriesCard } from '@/components/settlement/arc/collective-cognition-victories-card'
import { KnowledgesCard } from '@/components/settlement/arc/knowledges-card'
import { PhilosophiesCard } from '@/components/settlement/arc/philosophies-card'
import { CreateSettlementForm } from '@/components/settlement/create-settlement-form'
import { DepartingBonusesCard } from '@/components/settlement/departing-bonuses/departing-bonuses-card'
import { GearCard } from '@/components/settlement/gear/gear-card'
import { InnovationsCard } from '@/components/settlement/innovations/innovations-card'
import { LocationsCard } from '@/components/settlement/locations/locations-card'
import { MilestonesCard } from '@/components/settlement/milestones/milestones-card'
import { MonsterVolumesCard } from '@/components/settlement/monster-volumes/monster-volumes-card'
import { NemesesCard } from '@/components/settlement/nemeses/nemeses-card'
import { NotesCard } from '@/components/settlement/notes/notes-card'
import { OverviewCard } from '@/components/settlement/overview/overview-card'
import { PatternsCard } from '@/components/settlement/patterns/patterns-card'
import { SeedPatternsCard } from '@/components/settlement/patterns/seed-patterns-card'
import { PrinciplesCard } from '@/components/settlement/principles/principles-card'
import { QuarriesCard } from '@/components/settlement/quarries/quarries-card'
import { ResourcesCard } from '@/components/settlement/resources/resources-card'
import { SquireProgressionCards } from '@/components/settlement/squires/squire-progression-cards'
import { SquireSuspicionsCard } from '@/components/settlement/squires/squire-suspicions-card'
import { SettlementSurvivorsCard } from '@/components/settlement/survivors/settlement-survivors-card'
import { TimelineCard } from '@/components/settlement/timeline/timeline-card'
import { Form } from '@/components/ui/form'
import { useSettlement } from '@/contexts/settlement-context'
import { useTab } from '@/contexts/tab-context'
import { CampaignType, SurvivorType } from '@/lib/enums'
import { Settlement, SettlementSchema } from '@/schemas/settlement'
import { zodResolver } from '@hookform/resolvers/zod'
import { ReactElement, Suspense, useEffect } from 'react'
import { Resolver, useForm } from 'react-hook-form'

/**
 * Main Page Component (with Suspense Boundary)
 *
 * @returns Main Page Component
 */
export default function Page(): ReactElement {
  return (
    <Suspense fallback={<Loading />}>
      <MainPage />
    </Suspense>
  )
}

/**
 * Loading Component
 *
 * @returns Loading Component
 */
function Loading(): ReactElement {
  return (
    <div className="grid grid-rows-[1fr] items-center justify-items-center sm:p-8 pb-20 gap-8 sm:gap-16 font-[family-name:var(--font-geist-sans)]">
      <h1 className="text-3xl sm:text-4xl font-bold pt-[20px] text-center">
        Loading...
      </h1>
      <p className="text-md text-center">
        All seeing eyes pierce the darkness, looking for settlements.
      </p>
    </div>
  )
}

/**
 * Main Page Component
 *
 * @returns Main Page Component
 */
function MainPage(): ReactElement {
  // Get settlement from context
  const { selectedSettlement } = useSettlement()

  // Get selected tab from context
  const { selectedTab } = useTab()

  // Initialize the form with settlement data from the context
  const form = useForm<Settlement>({
    resolver: zodResolver(SettlementSchema) as Resolver<Settlement>,
    defaultValues: selectedSettlement || undefined
  })

  useEffect(() => {
    // Reset form with new settlement data
    if (selectedSettlement) form.reset(selectedSettlement)
  }, [selectedSettlement, form])

  // If no settlement is selected, display the create settlement form
  if (!selectedSettlement) return <CreateSettlementForm />

  return (
    <Form {...form}>
      <div className="flex flex-col gap-2 py-2 md:gap-4 md:py-4">
        <OverviewCard {...form} />
        {/* Timeline */}
        {selectedTab === 'timeline' && <TimelineCard {...form} />}

        {/* Monsters (Nemeses and Quarries) */}
        {selectedTab === 'monsters' && (
          <>
            <QuarriesCard {...form} />
            <NemesesCard {...form} />
          </>
        )}

        {/* Squires of the Citadel (Suspicions and Progression) */}
        {selectedTab === 'squires' &&
          selectedSettlement.campaignType ===
            CampaignType.SQUIRES_OF_THE_CITADEL && (
            <>
              <SquireSuspicionsCard {...form} />
              <SquireProgressionCards />
            </>
          )}

        {/* Survivors */}
        {selectedTab === 'survivors' &&
          selectedSettlement.campaignType !==
            CampaignType.SQUIRES_OF_THE_CITADEL && (
            <>
              {/* Departing Bonuses */}
              <DepartingBonusesCard {...form} />

              {/* Monster Volumes (PotL and PotSun) */}
              {(selectedSettlement.campaignType ===
                CampaignType.PEOPLE_OF_THE_LANTERN ||
                selectedSettlement.campaignType ===
                  CampaignType.PEOPLE_OF_THE_SUN) && (
                <MonsterVolumesCard {...form} />
              )}

              {/* Survivors */}
              <SettlementSurvivorsCard {...form} />
            </>
          )}

        {/* Society */}
        {selectedTab === 'society' &&
          selectedSettlement.campaignType !==
            CampaignType.SQUIRES_OF_THE_CITADEL && (
            <>
              <MilestonesCard {...form} />
              <PrinciplesCard {...form} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <InnovationsCard {...form} />
                <LocationsCard {...form} />
              </div>
            </>
          )}

        {/* Society - Squires of the Citadel */}
        {selectedTab === 'society' &&
          selectedSettlement.campaignType ===
            CampaignType.SQUIRES_OF_THE_CITADEL && <LocationsCard {...form} />}

        {/* Crafting */}
        {selectedTab === 'crafting' && (
          <>
            {selectedSettlement.campaignType !==
              CampaignType.SQUIRES_OF_THE_CITADEL && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <SeedPatternsCard {...form} />
                <PatternsCard {...form} />
              </div>
            )}
            <ResourcesCard {...form} />
            <GearCard {...form} />
          </>
        )}

        {/* Arc */}
        {selectedTab === 'arc' &&
          selectedSettlement.survivorType === SurvivorType.ARC && (
            <>
              <CollectiveCognitionVictoriesCard {...form} />
              <CollectiveCognitionRewardsCard {...form} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <PhilosophiesCard {...form} />
                <KnowledgesCard {...form} />
              </div>
            </>
          )}

        {/* Notes */}
        {selectedTab === 'notes' && <NotesCard {...form} />}
      </div>
    </Form>
  )
}
