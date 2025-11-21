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
import { ShowdownCard } from '@/components/showdown/showdown-card'
import { CreateSurvivorForm } from '@/components/survivor/create-survivor-form'
import { SurvivorCard } from '@/components/survivor/survivor-card'
import {
  CampaignType,
  SurvivorCardMode,
  SurvivorType,
  TabType
} from '@/lib/enums'
import { Hunt } from '@/schemas/hunt'
import { Settlement } from '@/schemas/settlement'
import { Showdown } from '@/schemas/showdown'
import { Survivor } from '@/schemas/survivor'
import { ReactElement } from 'react'
import { UseFormReturn } from 'react-hook-form'

/**
 * Settlement Form Props
 */
interface SettlementFormProps {
  /** New Hunt Being Created */
  isCreatingNewHunt: boolean
  /** New Showdown Being Created */
  isCreatingNewShowdown: boolean
  /** New Survivor Being Created */
  isCreatingNewSurvivor: boolean
  /** Save Selected Hunt */
  saveSelectedHunt: (updateData: Partial<Hunt>, successMsg?: string) => void
  /** Save Selected Settlement */
  saveSelectedSettlement: (
    updateData: Partial<Settlement>,
    successMsg?: string
  ) => void
  /** Save Selected Showdown */
  saveSelectedShowdown: (
    updateData: Partial<Showdown>,
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
  /** Selected Showdown */
  selectedShowdown: Showdown | null
  /** Selected Survivor */
  selectedSurvivor: Survivor | null
  /** Selected Tab */
  selectedTab: string
  /** Set New Hunt Being Created */
  setIsCreatingNewHunt: (isCreating: boolean) => void
  /** Set New Showdown Being Created */
  setIsCreatingNewShowdown: (isCreating: boolean) => void
  /** Set New Survivor Being Created */
  setIsCreatingNewSurvivor: (isCreating: boolean) => void
  /** Set Selected Hunt */
  setSelectedHunt: (hunt: Hunt | null) => void
  /** Set Selected Settlement */
  setSelectedSettlement: (settlement: Settlement | null) => void
  /** Set Selected Showdown */
  setSelectedShowdown: (showdown: Showdown | null) => void
  /** Set Selected Survivor */
  setSelectedSurvivor: (survivor: Survivor | null) => void
  /** Set Selected Tab */
  setSelectedTab: (tab: TabType) => void
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
  /** Update Selected Showdown */
  updateSelectedShowdown: () => void
  /** Update Selected Survivor */
  updateSelectedSurvivor: () => void
}

/**
 * Main Page Component
 *
 * @returns Main Page Component
 */
export function SettlementForm({
  // isCreatingNewHunt,
  // isCreatingNewShowdown,
  isCreatingNewSurvivor,
  saveSelectedHunt,
  saveSelectedSettlement,
  saveSelectedShowdown,
  saveSelectedSurvivor,
  selectedHunt,
  selectedSettlement,
  selectedShowdown,
  selectedSurvivor,
  selectedTab,
  // setIsCreatingNewHunt,
  // setIsCreatingNewShowdown,
  setIsCreatingNewSurvivor,
  setSelectedHunt,
  setSelectedSettlement,
  setSelectedShowdown,
  setSelectedSurvivor,
  setSelectedTab,
  setSurvivors,
  // settlementForm,
  survivors,
  updateSelectedHunt,
  updateSelectedSettlement,
  updateSelectedShowdown,
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

          {/* Timeline Tab */}
          {selectedSettlement && selectedTab === 'timeline' && (
            <div className="flex flex-col lg:flex-row gap-2">
              {/* Timeline */}
              <div className="flex-1 order-2 lg:order-1">
                <TimelineCard
                  saveSelectedSettlement={saveSelectedSettlement}
                  selectedSettlement={selectedSettlement}
                />
              </div>

              {/* Departure/Arrival Bonuses */}
              <div className="flex flex-col gap-2 order-1 lg:order-2 lg:flex-1">
                <div className="flex flex-col md:flex-row lg:flex-col gap-2">
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
            </div>
          )}

          {/* Monsters Tab */}
          {selectedSettlement && selectedTab === 'monsters' && (
            <div className="flex flex-col pl-2 gap-2">
              <div className="flex flex-col lg:flex-row gap-2">
                {/* Quarries */}
                <div className="flex-1">
                  <QuarriesCard
                    saveSelectedSettlement={saveSelectedSettlement}
                    selectedSettlement={selectedSettlement}
                  />
                </div>
                {/* Nemeses */}
                <div className="flex-1">
                  <NemesesCard
                    saveSelectedSettlement={saveSelectedSettlement}
                    selectedSettlement={selectedSettlement}
                  />
                </div>
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

          {/* Squires of the Citadel Tab */}
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

          {/* Survivors Tab */}
          {selectedSettlement &&
            selectedTab === 'survivors' &&
            selectedSettlement.campaignType !==
              CampaignType.SQUIRES_OF_THE_CITADEL && (
              <div className="pl-2">
                {/* Survivors Table */}
                <SettlementSurvivorsCard
                  selectedHunt={selectedHunt}
                  selectedSettlement={selectedSettlement}
                  selectedShowdown={selectedShowdown}
                  selectedSurvivor={selectedSurvivor}
                  setIsCreatingNewSurvivor={setIsCreatingNewSurvivor}
                  setSelectedSurvivor={setSelectedSurvivor}
                  setSurvivors={setSurvivors}
                  survivors={survivors}
                  updateSelectedHunt={updateSelectedHunt}
                  updateSelectedSettlement={updateSelectedSettlement}
                  updateSelectedShowdown={updateSelectedShowdown}
                  updateSelectedSurvivor={updateSelectedSurvivor}
                />
                {/* Selected Survivor */}
                {selectedSurvivor && !isCreatingNewSurvivor && (
                  <SurvivorCard
                    mode={SurvivorCardMode.SURVIVOR_CARD}
                    saveSelectedShowdown={saveSelectedShowdown}
                    saveSelectedSurvivor={saveSelectedSurvivor}
                    selectedSettlement={selectedSettlement}
                    selectedShowdown={selectedShowdown}
                    selectedSurvivor={selectedSurvivor}
                    setSurvivors={setSurvivors}
                    survivors={survivors}
                  />
                )}
                {/* Create Survivor */}
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

          {/* Society Tab */}
          {selectedSettlement &&
            selectedTab === 'society' &&
            selectedSettlement.campaignType !==
              CampaignType.SQUIRES_OF_THE_CITADEL && (
              <div className="flex flex-col gap-2 pl-2">
                <div className="flex flex-col lg:flex-row gap-2">
                  {/* Milestones */}
                  <div className="flex-1">
                    <MilestonesCard
                      saveSelectedSettlement={saveSelectedSettlement}
                      selectedSettlement={selectedSettlement}
                    />
                  </div>
                  {/* Principles */}
                  <div className="flex-1">
                    <PrinciplesCard
                      saveSelectedSettlement={saveSelectedSettlement}
                      selectedSettlement={selectedSettlement}
                    />
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-2">
                  {/* Innovations */}
                  <div className="flex-1">
                    <InnovationsCard
                      saveSelectedSettlement={saveSelectedSettlement}
                      selectedSettlement={selectedSettlement}
                    />
                  </div>
                  {/* Locations */}
                  <div className="flex-1">
                    <LocationsCard
                      saveSelectedSettlement={saveSelectedSettlement}
                      selectedSettlement={selectedSettlement}
                    />
                  </div>
                </div>
              </div>
            )}

          {/* Society Tab - Squires of the Citadel */}
          {selectedSettlement &&
            selectedTab === 'society' &&
            selectedSettlement.campaignType ===
              CampaignType.SQUIRES_OF_THE_CITADEL && (
              <LocationsCard
                saveSelectedSettlement={saveSelectedSettlement}
                selectedSettlement={selectedSettlement}
              />
            )}

          {/* Crafting Tab */}
          {selectedSettlement && selectedTab === 'crafting' && (
            <div className="flex flex-col gap-2 pl-2">
              {/* Resources */}
              <ResourcesCard
                saveSelectedSettlement={saveSelectedSettlement}
                selectedSettlement={selectedSettlement}
              />
              {/* Gear */}
              <GearCard
                saveSelectedSettlement={saveSelectedSettlement}
                selectedSettlement={selectedSettlement}
              />

              {/* Patterns/Seed Patterns */}
              {selectedSettlement?.campaignType !==
                CampaignType.SQUIRES_OF_THE_CITADEL && (
                <div className="flex flex-col md:flex-row gap-2">
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
              )}
            </div>
          )}

          {/* Arc Tab */}
          {selectedSettlement &&
            selectedTab === 'arc' &&
            selectedSettlement.survivorType === SurvivorType.ARC && (
              <div className="flex flex-col gap-2 pl-2">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                  {/* Collective Cognition Victories */}
                  <CollectiveCognitionVictoriesCard
                    saveSelectedSettlement={saveSelectedSettlement}
                    selectedSettlement={selectedSettlement}
                  />
                  {/* Collective Cognition Rewards */}
                  <CollectiveCognitionRewardsCard
                    saveSelectedSettlement={saveSelectedSettlement}
                    selectedSettlement={selectedSettlement}
                  />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                  {/* Philosophies */}
                  <PhilosophiesCard
                    saveSelectedSettlement={saveSelectedSettlement}
                    selectedSettlement={selectedSettlement}
                  />
                  {/* Knowledges */}
                  <KnowledgesCard
                    saveSelectedSettlement={saveSelectedSettlement}
                    selectedSettlement={selectedSettlement}
                  />
                </div>
              </div>
            )}

          {/* Notes Tab */}
          {selectedSettlement && selectedTab === 'notes' && (
            <NotesCard
              saveSelectedSettlement={saveSelectedSettlement}
              selectedSettlement={selectedSettlement}
            />
          )}

          {/* Settings Tab */}
          {selectedSettlement && selectedTab === 'settings' && (
            <SettingsCard
              saveSelectedSettlement={saveSelectedSettlement}
              selectedHunt={selectedHunt}
              selectedSettlement={selectedSettlement}
              selectedShowdown={selectedShowdown}
              setSelectedHunt={setSelectedHunt}
              setSelectedSettlement={setSelectedSettlement}
              setSelectedShowdown={() => {}}
              setSelectedSurvivor={setSelectedSurvivor}
            />
          )}

          {/* Hunt Tab */}
          {selectedSettlement && selectedTab === 'hunt' && (
            <HuntCard
              saveSelectedHunt={saveSelectedHunt}
              saveSelectedSurvivor={saveSelectedSurvivor}
              selectedHunt={selectedHunt}
              selectedSettlement={selectedSettlement}
              selectedSurvivor={selectedSurvivor}
              setSelectedHunt={setSelectedHunt}
              setSelectedShowdown={setSelectedShowdown}
              setSelectedSurvivor={setSelectedSurvivor}
              setSelectedTab={setSelectedTab}
              setSurvivors={setSurvivors}
              survivors={survivors}
            />
          )}

          {/* Showdown Tab */}
          {selectedSettlement && selectedTab === 'showdown' && (
            <ShowdownCard
              saveSelectedShowdown={saveSelectedShowdown}
              saveSelectedSurvivor={saveSelectedSurvivor}
              selectedShowdown={selectedShowdown}
              selectedSettlement={selectedSettlement}
              selectedSurvivor={selectedSurvivor}
              setSelectedShowdown={setSelectedShowdown}
              setSelectedSurvivor={setSelectedSurvivor}
              setSurvivors={setSurvivors}
              survivors={survivors}
            />
          )}
        </div>
      </div>
    </>
  )
}
