'use client'

import { HuntCard } from '@/components/hunt/hunt-card'
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
import { SettingsCard } from '@/components/settlement/settings/settings-card'
import { SquireProgressionCards } from '@/components/settlement/squires/squire-progression-cards'
import { SquireSuspicionsCard } from '@/components/settlement/squires/squire-suspicions-card'
import { SettlementSurvivorsCard } from '@/components/settlement/survivors/settlement-survivors-card'
import { TimelineCard } from '@/components/settlement/timeline/timeline-card'
import { CreateSurvivorForm } from '@/components/survivor/create-survivor-form'
import { SurvivorCard } from '@/components/survivor/survivor-card'
import { CampaignType, SurvivorType } from '@/lib/enums'
import { Hunt } from '@/schemas/hunt'
import { Settlement } from '@/schemas/settlement'
import { Survivor } from '@/schemas/survivor'
import { ReactElement } from 'react'
import { UseFormReturn } from 'react-hook-form'

/**
 * Settlement Form Props
 */
interface SettlementFormProps {
  /** New Hunt Being Created */
  isCreatingNewHunt: boolean
  /** New Survivor Being Created */
  isCreatingNewSurvivor: boolean
  /** Save Selected Hunt */
  saveSelectedHunt: (updateData: Partial<Hunt>, successMsg?: string) => void
  /** Save Selected Settlement */
  saveSelectedSettlement: (
    updateData: Partial<Settlement>,
    successMsg?: string
  ) => void
  /** Save Selected Survivor */
  saveSelectedSurvivor: (
    updateData: Partial<Survivor>,
    successMsg?: string
  ) => void
  /** Selected Hunt */
  selectedHunt: Hunt | null
  /** Selected Settlement */
  selectedSettlement: Settlement | null
  /** Selected Survivor */
  selectedSurvivor: Survivor | null
  /** Selected Tab */
  selectedTab: string
  /** Set New Hunt Being Created */
  setIsCreatingNewHunt: (isCreating: boolean) => void
  /** Set New Survivor Being Created */
  setIsCreatingNewSurvivor: (isCreating: boolean) => void
  /** Set Selected Hunt */
  setSelectedHunt: (hunt: Hunt | null) => void
  /** Set Selected Settlement */
  setSelectedSettlement: (settlement: Settlement | null) => void
  /** Set Selected Survivor */
  setSelectedSurvivor: (survivor: Survivor | null) => void
  /** Set Survivors */
  setSurvivors: (survivors: Survivor[]) => void
  /** Settlement Form */
  settlementForm: UseFormReturn<Settlement>
  /** Survivors */
  survivors: Survivor[] | null
  /** Update Selected Hunt */
  updateSelectedHunt: (hunt: Hunt | null) => void
  /** Update Selected Settlement */
  updateSelectedSettlement: () => void
  /** Update Selected Survivor */
  updateSelectedSurvivor: () => void
}

/**
 * Main Page Component
 *
 * @returns Main Page Component
 */
export function SettlementForm({
  isCreatingNewSurvivor,
  saveSelectedHunt,
  saveSelectedSettlement,
  saveSelectedSurvivor,
  selectedHunt,
  selectedSettlement,
  selectedSurvivor,
  selectedTab,
  setIsCreatingNewSurvivor,
  setSelectedHunt,
  setSelectedSettlement,
  setSelectedSurvivor,
  setSurvivors,
  survivors,
  updateSelectedHunt,
  updateSelectedSettlement,
  updateSelectedSurvivor
}: SettlementFormProps): ReactElement {
  return (
    <>
      <OverviewCard
        saveSelectedSettlement={saveSelectedSettlement}
        selectedSettlement={selectedSettlement}
        survivors={survivors}
      />

      <hr className="pt-2" />

      <div className="flex flex-1 flex-col h-full">
        <div className="flex flex-col gap-2 py-2 px-2 flex-1">
          {/* Create Settlement Form */}
          {!selectedSettlement && (
            <CreateSettlementForm
              setSelectedSettlement={setSelectedSettlement}
            />
          )}

          {/* Timeline */}
          {selectedSettlement && selectedTab === 'timeline' && (
            <div className="flex flex-col lg:flex-row gap-2">
              {/* Mobile + Tablet: Bonuses Above Timeline */}
              <div className="lg:hidden flex flex-col gap-2">
                {/* Mobile: Stacked */}
                <div className="md:hidden flex flex-col gap-2">
                  <DepartingBonusesCard
                    saveSelectedSettlement={saveSelectedSettlement}
                    selectedSettlement={selectedSettlement}
                  />
                  <ArrivalBonusesCard
                    saveSelectedSettlement={saveSelectedSettlement}
                    selectedSettlement={selectedSettlement}
                  />
                </div>

                {/* Tablet (md): Side by Side */}
                <div className="hidden md:flex md:flex-row gap-2">
                  <div className="flex-1">
                    <DepartingBonusesCard
                      saveSelectedSettlement={saveSelectedSettlement}
                      selectedSettlement={selectedSettlement}
                    />
                  </div>
                  <div className="flex-1">
                    <ArrivalBonusesCard
                      saveSelectedSettlement={saveSelectedSettlement}
                      selectedSettlement={selectedSettlement}
                    />
                  </div>
                </div>
              </div>

              {/* Desktop/Mobile/Tablet: Timeline */}
              <div className="flex-1">
                <TimelineCard
                  saveSelectedSettlement={saveSelectedSettlement}
                  selectedSettlement={selectedSettlement}
                />
              </div>

              {/* Desktop: Bonuses on right */}
              <div className="hidden lg:flex lg:flex-col lg:flex-1 gap-2">
                <DepartingBonusesCard
                  saveSelectedSettlement={saveSelectedSettlement}
                  selectedSettlement={selectedSettlement}
                />
                <ArrivalBonusesCard
                  saveSelectedSettlement={saveSelectedSettlement}
                  selectedSettlement={selectedSettlement}
                />
              </div>
            </div>
          )}

          {/* Monsters (Nemeses and Quarries) */}
          {selectedSettlement && selectedTab === 'monsters' && (
            <div className="flex flex-col pl-2 gap-2">
              {/* Desktop Layout */}
              <div className="hidden lg:flex lg:flex-row gap-2">
                <div className="flex-1">
                  <QuarriesCard
                    saveSelectedSettlement={saveSelectedSettlement}
                    selectedSettlement={selectedSettlement}
                  />
                </div>
                <div className="flex-1">
                  <NemesesCard
                    saveSelectedSettlement={saveSelectedSettlement}
                    selectedSettlement={selectedSettlement}
                  />
                </div>
              </div>

              {/* Mobile Layout */}
              <div className="lg:hidden flex flex-col gap-2">
                <QuarriesCard
                  saveSelectedSettlement={saveSelectedSettlement}
                  selectedSettlement={selectedSettlement}
                />
                <NemesesCard
                  saveSelectedSettlement={saveSelectedSettlement}
                  selectedSettlement={selectedSettlement}
                />
              </div>

              {/* Monster Volumes (PotL and PotSun) */}
              {(selectedSettlement?.campaignType ===
                CampaignType.PEOPLE_OF_THE_LANTERN ||
                selectedSettlement?.campaignType ===
                  CampaignType.PEOPLE_OF_THE_SUN) && (
                <MonsterVolumesCard
                  saveSelectedSettlement={saveSelectedSettlement}
                  selectedSettlement={selectedSettlement}
                />
              )}
            </div>
          )}

          {/* Squires of the Citadel (Suspicions and Progression) */}
          {selectedSettlement &&
            selectedTab === 'squires' &&
            selectedSettlement.campaignType ===
              CampaignType.SQUIRES_OF_THE_CITADEL && (
              <>
                <SquireSuspicionsCard
                  saveSelectedSettlement={saveSelectedSettlement}
                  selectedSettlement={selectedSettlement}
                />
                <SquireProgressionCards />
              </>
            )}

          {/* Survivors */}
          {selectedSettlement &&
            selectedTab === 'survivors' &&
            selectedSettlement.campaignType !==
              CampaignType.SQUIRES_OF_THE_CITADEL && (
              <div className="pl-2">
                {/* Survivors */}
                <SettlementSurvivorsCard
                  selectedHunt={selectedHunt}
                  selectedSettlement={selectedSettlement}
                  selectedShowdown={null}
                  selectedSurvivor={selectedSurvivor}
                  setIsCreatingNewSurvivor={setIsCreatingNewSurvivor}
                  setSelectedSurvivor={setSelectedSurvivor}
                  setSurvivors={setSurvivors}
                  survivors={survivors}
                  updateSelectedHunt={updateSelectedHunt}
                  updateSelectedSettlement={updateSelectedSettlement}
                  updateSelectedSurvivor={updateSelectedSurvivor}
                />
                {selectedSurvivor && !isCreatingNewSurvivor && (
                  <SurvivorCard
                    saveSelectedSurvivor={saveSelectedSurvivor}
                    selectedSettlement={selectedSettlement}
                    selectedSurvivor={selectedSurvivor}
                    setSurvivors={setSurvivors}
                    survivors={survivors}
                  />
                )}
                {isCreatingNewSurvivor && (
                  <CreateSurvivorForm
                    saveSelectedSurvivor={saveSelectedSurvivor}
                    selectedSettlement={selectedSettlement}
                    setIsCreatingNewSurvivor={setIsCreatingNewSurvivor}
                    setSelectedSurvivor={setSelectedSurvivor}
                  />
                )}
              </div>
            )}

          {/* Society */}
          {selectedSettlement &&
            selectedTab === 'society' &&
            selectedSettlement.campaignType !==
              CampaignType.SQUIRES_OF_THE_CITADEL && (
              <div className="flex flex-col gap-2 pl-2">
                {/* Desktop Layout */}
                <div className="hidden lg:flex lg:flex-row gap-2">
                  <div className="flex-1">
                    <MilestonesCard
                      saveSelectedSettlement={saveSelectedSettlement}
                      selectedSettlement={selectedSettlement}
                    />
                  </div>
                  <div className="flex-1">
                    <PrinciplesCard
                      saveSelectedSettlement={saveSelectedSettlement}
                      selectedSettlement={selectedSettlement}
                    />
                  </div>
                </div>

                {/* Mobile Layout */}
                <div className="lg:hidden flex flex-col gap-2">
                  <MilestonesCard
                    saveSelectedSettlement={saveSelectedSettlement}
                    selectedSettlement={selectedSettlement}
                  />
                  <PrinciplesCard
                    saveSelectedSettlement={saveSelectedSettlement}
                    selectedSettlement={selectedSettlement}
                  />
                </div>

                {/* Mobile: Stacked */}
                <div className="md:hidden flex flex-col gap-2">
                  <InnovationsCard
                    saveSelectedSettlement={saveSelectedSettlement}
                    selectedSettlement={selectedSettlement}
                  />
                  <LocationsCard
                    saveSelectedSettlement={saveSelectedSettlement}
                    selectedSettlement={selectedSettlement}
                  />
                </div>

                {/* Tablet and Desktop: Side by side */}
                <div className="hidden md:flex md:flex-row gap-2">
                  <div className="flex-1">
                    <InnovationsCard
                      saveSelectedSettlement={saveSelectedSettlement}
                      selectedSettlement={selectedSettlement}
                    />
                  </div>
                  <div className="flex-1">
                    <LocationsCard
                      saveSelectedSettlement={saveSelectedSettlement}
                      selectedSettlement={selectedSettlement}
                    />
                  </div>
                </div>
              </div>
            )}

          {/* Society - Squires of the Citadel */}
          {selectedSettlement &&
            selectedTab === 'society' &&
            selectedSettlement.campaignType ===
              CampaignType.SQUIRES_OF_THE_CITADEL && (
              <LocationsCard
                saveSelectedSettlement={saveSelectedSettlement}
                selectedSettlement={selectedSettlement}
              />
            )}

          {/* Crafting */}
          {selectedSettlement && selectedTab === 'crafting' && (
            <div className="flex flex-col gap-2 pl-2">
              {/* Desktop Layout */}
              <div className="hidden lg:flex lg:flex-col gap-2">
                <ResourcesCard
                  saveSelectedSettlement={saveSelectedSettlement}
                  selectedSettlement={selectedSettlement}
                />
                <GearCard
                  saveSelectedSettlement={saveSelectedSettlement}
                  selectedSettlement={selectedSettlement}
                />
              </div>

              {/* Mobile Layout */}
              <div className="lg:hidden flex flex-col gap-2">
                <ResourcesCard
                  saveSelectedSettlement={saveSelectedSettlement}
                  selectedSettlement={selectedSettlement}
                />
                <GearCard
                  saveSelectedSettlement={saveSelectedSettlement}
                  selectedSettlement={selectedSettlement}
                />
              </div>

              {/* Pattern Cards for non-Squires campaigns */}
              {selectedSettlement?.campaignType !==
                CampaignType.SQUIRES_OF_THE_CITADEL && (
                <>
                  {/* Mobile: Stacked */}
                  <div className="md:hidden flex flex-col gap-2">
                    <SeedPatternsCard
                      saveSelectedSettlement={saveSelectedSettlement}
                      selectedSettlement={selectedSettlement}
                    />
                    <PatternsCard
                      saveSelectedSettlement={saveSelectedSettlement}
                      selectedSettlement={selectedSettlement}
                    />
                  </div>

                  {/* Tablet and Desktop: Side by side */}
                  <div className="hidden md:flex md:flex-row gap-2">
                    <div className="flex-1">
                      <SeedPatternsCard
                        saveSelectedSettlement={saveSelectedSettlement}
                        selectedSettlement={selectedSettlement}
                      />
                    </div>
                    <div className="flex-1">
                      <PatternsCard
                        saveSelectedSettlement={saveSelectedSettlement}
                        selectedSettlement={selectedSettlement}
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Arc */}
          {selectedSettlement &&
            selectedTab === 'arc' &&
            selectedSettlement.survivorType === SurvivorType.ARC && (
              <div className="flex flex-col gap-2 pl-2">
                {/* Desktop Layout */}
                <div className="hidden lg:grid lg:grid-cols-1 md:lg:grid-cols-2 gap-2">
                  <CollectiveCognitionVictoriesCard
                    saveSelectedSettlement={saveSelectedSettlement}
                    selectedSettlement={selectedSettlement}
                  />
                  <CollectiveCognitionRewardsCard
                    saveSelectedSettlement={saveSelectedSettlement}
                    selectedSettlement={selectedSettlement}
                  />
                </div>

                {/* Desktop Layout */}
                <div className="hidden lg:grid lg:grid-cols-1 md:lg:grid-cols-2 gap-2">
                  <PhilosophiesCard
                    saveSelectedSettlement={saveSelectedSettlement}
                    selectedSettlement={selectedSettlement}
                  />
                  <KnowledgesCard
                    saveSelectedSettlement={saveSelectedSettlement}
                    selectedSettlement={selectedSettlement}
                  />
                </div>

                {/* Mobile Layout */}
                <div className="lg:hidden flex flex-col gap-2">
                  <CollectiveCognitionVictoriesCard
                    saveSelectedSettlement={saveSelectedSettlement}
                    selectedSettlement={selectedSettlement}
                  />
                  <CollectiveCognitionRewardsCard
                    saveSelectedSettlement={saveSelectedSettlement}
                    selectedSettlement={selectedSettlement}
                  />
                  <PhilosophiesCard
                    saveSelectedSettlement={saveSelectedSettlement}
                    selectedSettlement={selectedSettlement}
                  />
                  <KnowledgesCard
                    saveSelectedSettlement={saveSelectedSettlement}
                    selectedSettlement={selectedSettlement}
                  />
                </div>
              </div>
            )}

          {/* Notes */}
          {selectedSettlement && selectedTab === 'notes' && (
            <NotesCard
              saveSelectedSettlement={saveSelectedSettlement}
              selectedSettlement={selectedSettlement}
            />
          )}

          {/* Settlement Settings */}
          {selectedSettlement && selectedTab === 'settings' && (
            <SettingsCard
              saveSelectedSettlement={saveSelectedSettlement}
              selectedHunt={selectedHunt}
              selectedSettlement={selectedSettlement}
              selectedShowdown={null}
              setSelectedHunt={setSelectedHunt}
              setSelectedSettlement={setSelectedSettlement}
              setSelectedShowdown={() => {}}
              setSelectedSurvivor={setSelectedSurvivor}
            />
          )}

          {/* Hunt */}
          {selectedSettlement && selectedTab === 'hunt' && (
            <HuntCard
              saveSelectedHunt={saveSelectedHunt}
              selectedHunt={selectedHunt}
              selectedSettlement={selectedSettlement}
              selectedSurvivor={selectedSurvivor}
              setSelectedHunt={setSelectedHunt}
              setSurvivors={setSurvivors}
              survivors={survivors}
              updateSelectedSurvivor={updateSelectedSurvivor}
            />
          )}

          {/* Showdown */}
        </div>
      </div>
    </>
  )
}
