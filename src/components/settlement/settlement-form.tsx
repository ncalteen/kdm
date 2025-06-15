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
import { ActiveHunt } from '@/schemas/active-hunt'
import { Settlement } from '@/schemas/settlement'
import { Survivor } from '@/schemas/survivor'
import { ReactElement } from 'react'
import { UseFormReturn } from 'react-hook-form'

/**
 * Settlement Form Props
 */
interface SettlementFormProps {
  /** New Survivor Being Created */
  isCreatingNewSurvivor: boolean
  /** Function to Update Selected Survivor */
  updateSelectedSurvivor: () => void
  /** Function to Save Survivor */
  saveSurvivor: (updateData: Partial<Survivor>, successMsg?: string) => void
  /** Function to Set Selected Survivor */
  setSelectedSurvivor: (survivor: Survivor | null) => void
  /** Selected Survivor */
  survivor: Survivor | null
  /** Survivor Form Data */
  survivorForm: UseFormReturn<Survivor>
  /** Selected Settlement */
  settlement: Settlement | null
  /** Settlement Form Data */
  settlementForm: UseFormReturn<Settlement>
  /** Function to Save Settlement */
  saveSettlement: (updateData: Partial<Settlement>, successMsg?: string) => void
  /** Function to Set Selected Settlement */
  setSelectedSettlement: (settlement: Settlement | null) => void
  /** Selected Tab */
  selectedTab: string
  /** Function to Set Whether a New Survivor is Being Created */
  setIsCreatingNewSurvivor: (isCreating: boolean) => void
  /** Active Hunt Form Data */
  activeHuntForm: UseFormReturn<ActiveHunt>
  /** Selected Active Hunt */
  activeHunt: ActiveHunt | null
  /** Function to Save Active Hunt */
  saveActiveHunt: (updateData: Partial<ActiveHunt>, successMsg?: string) => void
}

/**
 * Main Page Component
 *
 * @returns Main Page Component
 */
export function SettlementForm({
  isCreatingNewSurvivor,
  updateSelectedSurvivor,
  saveSurvivor,
  setSelectedSurvivor,
  survivor,
  survivorForm,
  settlement,
  settlementForm,
  saveSettlement,
  setSelectedSettlement,
  selectedTab,
  setIsCreatingNewSurvivor,
  activeHuntForm,
  activeHunt,
  saveActiveHunt
}: SettlementFormProps): ReactElement {
  return (
    <>
      {!['hunt', 'showdown'].includes(selectedTab) && (
        <OverviewCard
          {...settlement}
          form={settlementForm}
          saveSettlement={saveSettlement}
        />
      )}

      <hr className="pt-2" />

      <div className="flex flex-1 flex-col h-full">
        <div className="flex flex-col gap-2 py-2 px-2 flex-1">
          {/* Create Settlement Form */}
          {!settlement && (
            <CreateSettlementForm
              settlement={settlement}
              setSelectedSettlement={setSelectedSettlement}
            />
          )}
          {/* Timeline */}
          {settlement && selectedTab === 'timeline' && (
            <div className="flex flex-row gap-2">
              <div className="flex-1">
                <TimelineCard
                  {...settlement}
                  form={settlementForm}
                  saveSettlement={saveSettlement}
                />
              </div>
              <div className="flex-1 flex flex-col gap-2">
                <DepartingBonusesCard
                  {...settlement}
                  form={settlementForm}
                  saveSettlement={saveSettlement}
                />
                <ArrivalBonusesCard
                  {...settlement}
                  form={settlementForm}
                  saveSettlement={saveSettlement}
                />
              </div>
            </div>
          )}

          {/* Monsters (Nemeses and Quarries) */}
          {settlement && selectedTab === 'monsters' && (
            <div className="flex flex-col pl-2 gap-2">
              {/* Quarries and Nemeses */}
              <div className="flex flex-row gap-2">
                <div className="flex-1">
                  <QuarriesCard
                    {...settlement}
                    form={settlementForm}
                    saveSettlement={saveSettlement}
                  />
                </div>
                <div className="flex-1">
                  <NemesesCard
                    {...settlement}
                    form={settlementForm}
                    saveSettlement={saveSettlement}
                  />
                </div>
              </div>
              {/* Monster Volumes (PotL and PotSun) */}
              {(settlement.campaignType ===
                CampaignType.PEOPLE_OF_THE_LANTERN ||
                settlement.campaignType === CampaignType.PEOPLE_OF_THE_SUN) && (
                <MonsterVolumesCard
                  {...settlement}
                  form={settlementForm}
                  saveSettlement={saveSettlement}
                />
              )}
            </div>
          )}

          {/* Squires of the Citadel (Suspicions and Progression) */}
          {settlement &&
            selectedTab === 'squires' &&
            settlement.campaignType === CampaignType.SQUIRES_OF_THE_CITADEL && (
              <>
                <SquireSuspicionsCard
                  {...settlement}
                  saveSettlement={saveSettlement}
                />
                <SquireProgressionCards />
              </>
            )}

          {/* Survivors */}
          {settlement &&
            selectedTab === 'survivors' &&
            settlement.campaignType !== CampaignType.SQUIRES_OF_THE_CITADEL && (
              <div className="pl-2">
                {/* Survivors */}
                <SettlementSurvivorsCard
                  {...settlement}
                  updateSelectedSurvivor={updateSelectedSurvivor}
                  setSelectedSurvivor={setSelectedSurvivor}
                  setIsCreatingNewSurvivor={setIsCreatingNewSurvivor}
                  selectedSurvivor={survivor}
                />
                {survivor && !isCreatingNewSurvivor && (
                  <SurvivorCard
                    form={survivorForm}
                    settlement={settlement}
                    saveSurvivor={saveSurvivor}
                  />
                )}
                {isCreatingNewSurvivor && (
                  <CreateSurvivorForm
                    settlement={settlement}
                    setSelectedSurvivor={setSelectedSurvivor}
                    setIsCreatingNewSurvivor={setIsCreatingNewSurvivor}
                    saveSurvivor={saveSurvivor}
                  />
                )}
              </div>
            )}

          {/* Society */}
          {settlement &&
            selectedTab === 'society' &&
            settlement.campaignType !== CampaignType.SQUIRES_OF_THE_CITADEL && (
              <div className="flex flex-col gap-2 pl-2">
                <div className="flex flex-row gap-2">
                  <div className="flex-1">
                    <MilestonesCard
                      {...settlement}
                      form={settlementForm}
                      saveSettlement={saveSettlement}
                    />
                  </div>
                  <div className="flex-1">
                    <PrinciplesCard
                      {...settlement}
                      saveSettlement={saveSettlement}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <InnovationsCard
                    {...settlement}
                    form={settlementForm}
                    saveSettlement={saveSettlement}
                  />
                  <LocationsCard
                    {...settlement}
                    form={settlementForm}
                    saveSettlement={saveSettlement}
                  />
                </div>
              </div>
            )}

          {/* Society - Squires of the Citadel */}
          {settlement &&
            selectedTab === 'society' &&
            settlement.campaignType === CampaignType.SQUIRES_OF_THE_CITADEL && (
              <LocationsCard
                {...settlement}
                form={settlementForm}
                saveSettlement={saveSettlement}
              />
            )}

          {/* Crafting */}
          {settlement && selectedTab === 'crafting' && (
            <div className="flex flex-col gap-2 pl-2">
              {settlement.campaignType !==
                CampaignType.SQUIRES_OF_THE_CITADEL && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <SeedPatternsCard
                    {...settlement}
                    form={settlementForm}
                    saveSettlement={saveSettlement}
                  />
                  <PatternsCard
                    {...settlement}
                    form={settlementForm}
                    saveSettlement={saveSettlement}
                  />
                </div>
              )}
              <ResourcesCard
                {...settlement}
                form={settlementForm}
                saveSettlement={saveSettlement}
              />
              <GearCard
                {...settlement}
                form={settlementForm}
                saveSettlement={saveSettlement}
              />
            </div>
          )}

          {/* Arc */}
          {settlement &&
            selectedTab === 'arc' &&
            settlement.survivorType === SurvivorType.ARC && (
              <div className="flex flex-col gap-2 pl-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <CollectiveCognitionVictoriesCard
                    {...settlement}
                    form={settlementForm}
                    saveSettlement={saveSettlement}
                  />
                  <CollectiveCognitionRewardsCard
                    {...settlement}
                    saveSettlement={saveSettlement}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <PhilosophiesCard
                    {...settlement}
                    form={settlementForm}
                    saveSettlement={saveSettlement}
                  />
                  <KnowledgesCard
                    {...settlement}
                    form={settlementForm}
                    saveSettlement={saveSettlement}
                  />
                </div>
              </div>
            )}

          {/* Notes */}
          {settlement && selectedTab === 'notes' && (
            <NotesCard {...settlement} saveSettlement={saveSettlement} />
          )}

          {/* Settlement Settings */}
          {settlement && selectedTab === 'settings' && (
            <SettingsCard
              {...settlement}
              setSelectedSettlement={setSelectedSettlement}
              setSelectedSurvivor={setSelectedSurvivor}
            />
          )}

          {/* Hunt */}
          {settlement && selectedTab === 'hunt' && (
            <HuntCard
              form={activeHuntForm}
              activeHunt={activeHunt}
              saveActiveHunt={saveActiveHunt}
            />
          )}

          {/* Showdown */}
        </div>
      </div>
    </>
  )
}
