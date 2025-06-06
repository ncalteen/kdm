'use client'

import { AppSidebar } from '@/components/app-sidebar'
import { CollectiveCognitionRewardsCard } from '@/components/settlement/arc/collective-cognition-rewards-card'
import { CollectiveCognitionVictoriesCard } from '@/components/settlement/arc/collective-cognition-victories-card'
import { KnowledgesCard } from '@/components/settlement/arc/knowledges-card'
import { PhilosophiesCard } from '@/components/settlement/arc/philosophies-card'
import { ArrivalBonusesCard } from '@/components/settlement/arrival-bonuses/arrival-bonuses-card'
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
import { SiteHeader } from '@/components/side-header'
import { CreateSurvivorForm } from '@/components/survivor/create-survivor-form'
import { SurvivorCard } from '@/components/survivor/survivor-card'
import { Form } from '@/components/ui/form'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { useSettlement } from '@/contexts/settlement-context'
import { useSurvivor } from '@/contexts/survivor-context'
import { useTab } from '@/contexts/tab-context'
import { useSettlementSave } from '@/hooks/use-settlement-save'
import { useSurvivorSave } from '@/hooks/use-survivor-save'
import { CampaignType, SurvivorType } from '@/lib/enums'
import { Settlement, SettlementSchema } from '@/schemas/settlement'
import { Survivor, SurvivorSchema } from '@/schemas/survivor'
import { zodResolver } from '@hookform/resolvers/zod'
import { ReactElement, Suspense, useEffect, useRef, useState } from 'react'
import { Resolver, useForm } from 'react-hook-form'

/**
 * Main Page Component (with Suspense Boundary)
 *
 * @returns Main Page Component
 */
export default function Page(): ReactElement {
  return (
    <Suspense fallback={<MainPageLoading />}>
      <MainPageContent />
    </Suspense>
  )
}

/**
 * Loading Component for Suspense Boundary
 *
 * @returns Loading Component
 */
function MainPageLoading(): ReactElement {
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
 * Main Page Content Component
 *
 * @returns Main Page Content Component
 */
function MainPageContent(): ReactElement {
  // Track if the component is mounted and loading state
  const isMounted = useRef(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Mark component as mounted
    isMounted.current = true

    // Simulate async behavior to show loading state briefly
    setTimeout(() => {
      if (isMounted.current) {
        setIsLoading(false)
      }
    }, 100) // Brief delay to ensure contexts are initialized

    return () => {
      isMounted.current = false
    }
  }, [])

  // Show loading state while initializing
  if (isLoading) {
    return (
      <div className="grid grid-rows-[1fr] items-center justify-items-center gap-8">
        <h1 className="text-3xl sm:text-4xl font-bold pt-[20px] text-center">
          Initializing...
        </h1>
        <p className="text-md text-center">
          Preparing the settlement records and survivor chronicles...
        </p>
      </div>
    )
  }

  return <MainPage />
}

/**
 * Main Page Component
 *
 * @returns Main Page Component
 */
function MainPage(): ReactElement {
  const {
    selectedSettlement,
    updateSelectedSettlement,
    setSelectedSettlement
  } = useSettlement()
  const {
    selectedSurvivor,
    setSelectedSurvivor,
    isCreatingNewSurvivor,
    updateSelectedSurvivor,
    setIsCreatingNewSurvivor
  } = useSurvivor()
  const { selectedTab } = useTab()

  // Initialize the settlement form data from the context
  const settlementForm = useForm<Settlement>({
    resolver: zodResolver(SettlementSchema) as Resolver<Settlement>,
    defaultValues: selectedSettlement || undefined
  })
  const { saveSettlement } = useSettlementSave(
    settlementForm,
    updateSelectedSettlement
  )

  // Initialize the survivor form data from the context
  const survivorForm = useForm<Survivor>({
    resolver: zodResolver(SurvivorSchema) as Resolver<Survivor>,
    defaultValues: selectedSurvivor || undefined
  })
  const { saveSurvivor } = useSurvivorSave(survivorForm, updateSelectedSurvivor)

  const selectedSurvivorSettlementId = selectedSurvivor?.settlementId

  useEffect(() => {
    // If the settlement changes, reset the settlement form with the selected
    // settlement data. Clear the selected survivor only if it doesn't belong
    // to the current settlement.
    if (selectedSettlement) {
      settlementForm.reset(selectedSettlement)

      // Clear selected survivor if it doesn't belong to current settlement
      if (selectedSurvivorSettlementId !== selectedSettlement.id)
        setSelectedSurvivor(null)
    }
  }, [
    selectedSettlement,
    selectedSurvivorSettlementId,
    setSelectedSurvivor,
    settlementForm
  ])

  useEffect(() => {
    // Reset the survivor form when the selected survivor changes
    if (selectedSurvivor) survivorForm.reset(selectedSurvivor)
  }, [selectedSurvivor, survivorForm])

  // If no settlement is selected, display the create settlement form
  if (!selectedSettlement)
    return (
      <CreateSettlementForm
        settlement={selectedSettlement}
        setSelectedSettlement={setSelectedSettlement}
      />
    )

  return (
    <div className="[--header-height:calc(--spacing(14))]">
      <SidebarProvider className="flex flex-col">
        {/* Header requires the settlement form to display high-level data */}
        <SiteHeader />

        <div className="flex flex-1">
          <AppSidebar
            settlement={selectedSettlement}
            setSelectedSettlement={setSelectedSettlement}
          />
          <SidebarInset>
            <Form {...settlementForm}>
              <Form {...survivorForm}>
                <OverviewCard
                  {...selectedSettlement}
                  form={settlementForm}
                  saveSettlement={saveSettlement}
                />

                <hr className="pt-2" />

                <div className="flex flex-1 flex-col h-full">
                  <div className="flex flex-col gap-2 py-2 px-2 flex-1">
                    {/* Timeline */}
                    {selectedTab === 'timeline' && (
                      <div className="flex flex-row gap-2">
                        <div className="flex-1">
                          <TimelineCard
                            {...selectedSettlement}
                            form={settlementForm}
                            saveSettlement={saveSettlement}
                          />
                        </div>
                        <div className="flex-1 flex flex-col gap-2">
                          <DepartingBonusesCard
                            {...selectedSettlement}
                            form={settlementForm}
                            saveSettlement={saveSettlement}
                          />
                          <ArrivalBonusesCard
                            {...selectedSettlement}
                            form={settlementForm}
                            saveSettlement={saveSettlement}
                          />
                        </div>
                      </div>
                    )}

                    {/* Monsters (Nemeses and Quarries) */}
                    {selectedTab === 'monsters' && (
                      <div className="flex flex-col pl-2 gap-2">
                        {/* Quarries and Nemeses */}
                        <div className="flex flex-row gap-2">
                          <div className="flex-1">
                            <QuarriesCard
                              {...selectedSettlement}
                              form={settlementForm}
                              saveSettlement={saveSettlement}
                            />
                          </div>
                          <div className="flex-1">
                            <NemesesCard
                              {...selectedSettlement}
                              form={settlementForm}
                              saveSettlement={saveSettlement}
                            />
                          </div>
                        </div>
                        {/* Monster Volumes (PotL and PotSun) */}
                        {(selectedSettlement.campaignType ===
                          CampaignType.PEOPLE_OF_THE_LANTERN ||
                          selectedSettlement.campaignType ===
                            CampaignType.PEOPLE_OF_THE_SUN) && (
                          <MonsterVolumesCard
                            {...selectedSettlement}
                            form={settlementForm}
                            saveSettlement={saveSettlement}
                          />
                        )}
                      </div>
                    )}

                    {/* Squires of the Citadel (Suspicions and Progression) */}
                    {selectedTab === 'squires' &&
                      selectedSettlement.campaignType ===
                        CampaignType.SQUIRES_OF_THE_CITADEL && (
                        <>
                          <SquireSuspicionsCard
                            {...selectedSettlement}
                            saveSettlement={saveSettlement}
                          />
                          <SquireProgressionCards />
                        </>
                      )}

                    {/* Survivors */}
                    {selectedTab === 'survivors' &&
                      selectedSettlement.campaignType !==
                        CampaignType.SQUIRES_OF_THE_CITADEL && (
                        <div className="pl-2">
                          {/* Survivors */}
                          <SettlementSurvivorsCard
                            {...selectedSettlement}
                            updateSelectedSurvivor={updateSelectedSurvivor}
                            setSelectedSurvivor={setSelectedSurvivor}
                            setIsCreatingNewSurvivor={setIsCreatingNewSurvivor}
                            selectedSurvivor={selectedSurvivor}
                          />
                          {selectedSurvivor && !isCreatingNewSurvivor && (
                            <SurvivorCard
                              form={survivorForm}
                              settlement={selectedSettlement}
                              saveSurvivor={saveSurvivor}
                            />
                          )}
                          {isCreatingNewSurvivor && (
                            <CreateSurvivorForm
                              settlement={selectedSettlement}
                              setSelectedSurvivor={setSelectedSurvivor}
                              setIsCreatingNewSurvivor={
                                setIsCreatingNewSurvivor
                              }
                              saveSurvivor={saveSurvivor}
                            />
                          )}
                        </div>
                      )}

                    {/* Society */}
                    {selectedTab === 'society' &&
                      selectedSettlement.campaignType !==
                        CampaignType.SQUIRES_OF_THE_CITADEL && (
                        <div className="flex flex-col gap-2 pl-2">
                          <div className="flex flex-row gap-2">
                            <div className="flex-1">
                              <MilestonesCard
                                {...selectedSettlement}
                                form={settlementForm}
                                saveSettlement={saveSettlement}
                              />
                            </div>
                            <div className="flex-1">
                              <PrinciplesCard
                                {...selectedSettlement}
                                saveSettlement={saveSettlement}
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            <InnovationsCard
                              {...selectedSettlement}
                              form={settlementForm}
                              saveSettlement={saveSettlement}
                            />
                            <LocationsCard
                              {...selectedSettlement}
                              form={settlementForm}
                              saveSettlement={saveSettlement}
                            />
                          </div>
                        </div>
                      )}

                    {/* Society - Squires of the Citadel */}
                    {selectedTab === 'society' &&
                      selectedSettlement.campaignType ===
                        CampaignType.SQUIRES_OF_THE_CITADEL && (
                        <LocationsCard
                          {...selectedSettlement}
                          form={settlementForm}
                          saveSettlement={saveSettlement}
                        />
                      )}

                    {/* Crafting */}
                    {selectedTab === 'crafting' && (
                      <div className="flex flex-col gap-2 pl-2">
                        {selectedSettlement.campaignType !==
                          CampaignType.SQUIRES_OF_THE_CITADEL && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            <SeedPatternsCard
                              {...selectedSettlement}
                              form={settlementForm}
                              saveSettlement={saveSettlement}
                            />
                            <PatternsCard
                              {...selectedSettlement}
                              form={settlementForm}
                              saveSettlement={saveSettlement}
                            />
                          </div>
                        )}
                        <ResourcesCard
                          {...selectedSettlement}
                          form={settlementForm}
                          saveSettlement={saveSettlement}
                        />
                        <GearCard
                          {...selectedSettlement}
                          form={settlementForm}
                          saveSettlement={saveSettlement}
                        />
                      </div>
                    )}

                    {/* Arc */}
                    {selectedTab === 'arc' &&
                      selectedSettlement.survivorType === SurvivorType.ARC && (
                        <div className="flex flex-col gap-2 pl-2">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            <CollectiveCognitionVictoriesCard
                              {...selectedSettlement}
                              form={settlementForm}
                              saveSettlement={saveSettlement}
                            />
                            <CollectiveCognitionRewardsCard
                              {...selectedSettlement}
                              saveSettlement={saveSettlement}
                            />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            <PhilosophiesCard
                              {...selectedSettlement}
                              form={settlementForm}
                              saveSettlement={saveSettlement}
                            />
                            <KnowledgesCard
                              {...selectedSettlement}
                              form={settlementForm}
                              saveSettlement={saveSettlement}
                            />
                          </div>
                        </div>
                      )}

                    {/* Notes */}
                    {selectedTab === 'notes' && (
                      <NotesCard
                        {...selectedSettlement}
                        saveSettlement={saveSettlement}
                      />
                    )}
                  </div>
                </div>
              </Form>
            </Form>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  )
}
