'use client'

import { SettlementPhaseActionsCard } from '@/components/settlement-phase/settlement-phase-actions/settlement-phase-actions-card'
import { SettlementPhaseBoard } from '@/components/settlement-phase/settlement-phase-board/settlement-phase-board'
import { SettlementPhaseResultsCard } from '@/components/settlement-phase/settlement-phase-results/settlement-phase-results-card'
import { SettlementPhaseSurvivorsCard } from '@/components/settlement-phase/settlement-phase-survivors/settlement-phase-survivors-card'
import { KnowledgesCard } from '@/components/settlement/arc/knowledges-card'
import { ArrivalBonusesCard } from '@/components/settlement/arrival-bonuses/arrival-bonuses-card'
import { DepartingBonusesCard } from '@/components/settlement/departing-bonuses/departing-bonuses-card'
import { GearCard } from '@/components/settlement/gear/gear-card'
import { InnovationsCard } from '@/components/settlement/innovations/innovations-card'
import { LocationsCard } from '@/components/settlement/locations/locations-card'
import { MilestonesCard } from '@/components/settlement/milestones/milestones-card'
import { PrinciplesCard } from '@/components/settlement/principles/principles-card'
import { ResourcesCard } from '@/components/settlement/resources/resources-card'
import { TimelineCard } from '@/components/settlement/timeline/timeline-card'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle
} from '@/components/ui/empty'
import { settlementPhaseSteps } from '@/lib/common'
import { SettlementPhaseStep, SurvivorType, TabType } from '@/lib/enums'
import { SETTLEMENT_PHASE_STEP_UPDATED_MESSAGE } from '@/lib/messages'
import { Campaign } from '@/schemas/campaign'
import { Settlement } from '@/schemas/settlement'
import { SettlementPhase } from '@/schemas/settlement-phase'
import { Survivor } from '@/schemas/survivor'
import { CircleOffIcon } from 'lucide-react'
import { ReactElement, useCallback } from 'react'

/**
 * Settlement Phase Card Properties
 */
interface SettlementPhaseCardProps {
  /** Campaign */
  campaign: Campaign
  /** Save Selected Settlement */
  saveSelectedSettlement: (
    updateData: Partial<Settlement>,
    successMsg?: string
  ) => void
  /** Save Selected Settlement Phase */
  saveSelectedSettlementPhase: (
    updateData: Partial<SettlementPhase>,
    successMsg?: string
  ) => void
  /** Save Selected Survivor */
  saveSelectedSurvivor: (
    updateData: Partial<Survivor>,
    successMsg?: string
  ) => void
  /** Selected Settlement */
  selectedSettlement: Settlement | null
  /** Selected Settlement Phase */
  selectedSettlementPhase: SettlementPhase | null
  /** Selected Survivor */
  selectedSurvivor: Survivor | null
  /** Set Selected Survivor */
  setSelectedSurvivor: (survivor: Survivor | null) => void
  /** Set Selected Tab */
  setSelectedTab: (tab: TabType) => void
  /** Update Campaign */
  updateCampaign: (campaign: Campaign) => void
}

/**
 * Settlement Phase Card Component
 *
 * Displays settlement phase management interface.
 */
export function SettlementPhaseCard({
  campaign,
  saveSelectedSettlement,
  saveSelectedSettlementPhase,
  saveSelectedSurvivor,
  selectedSettlement,
  selectedSettlementPhase,
  selectedSurvivor,
  setSelectedSurvivor,
  setSelectedTab,
  updateCampaign
}: SettlementPhaseCardProps): ReactElement {
  /**
   * Handle Position Update
   *
   * @param tokenPosition Token Position
   */
  const handlePositionUpdate = useCallback(
    (tokenPosition: number) =>
      saveSelectedSettlementPhase(
        { step: settlementPhaseSteps[tokenPosition].step },
        SETTLEMENT_PHASE_STEP_UPDATED_MESSAGE(
          settlementPhaseSteps[tokenPosition].step
        )
      ),
    [saveSelectedSettlementPhase]
  )

  if (!selectedSettlementPhase)
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <CircleOffIcon />
          </EmptyMedia>
          <EmptyTitle>No Settlement Phase in Progress</EmptyTitle>
          <EmptyDescription>
            The settlement phase can only be started by returning from a
            showdown.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    )

  return (
    <>
      {/*
        Settlement Phase Results

        Displays information about the returning and dead survivors.
      */}
      <SettlementPhaseResultsCard
        campaign={campaign}
        selectedSettlementPhase={selectedSettlementPhase}
      />

      {/*
        Settlement Phase Board

        Displays the settlement phase steps and current position in the
        settlement phase. Also allows for updating the current settlement phase
        step by dragging and dropping the token to the desired position.
      */}
      <SettlementPhaseBoard
        onPositionUpdate={handlePositionUpdate}
        selectedSettlementPhase={selectedSettlementPhase}
      />

      {/*
        Actions Card

        Dynamically updates to show available actions in each step in the
        settlement phase.
      */}
      <SettlementPhaseActionsCard
        campaign={campaign}
        selectedSettlement={selectedSettlement}
        selectedSettlementPhase={selectedSettlementPhase}
        setSelectedTab={setSelectedTab}
        updateCampaign={updateCampaign}
      />

      {/* 
        Depending on the settlement phase step, display additional components as
        needed by the user.
      */}

      {/*
        Set Up the Settlement

        Manual setup. No additional components needed.
      */}
      {selectedSettlementPhase?.step ===
        SettlementPhaseStep.SET_UP_SETTLEMENT && (
        <div className="text-center text-sm text-muted-foreground">
          Set up the settlement phase board, location cards, innovation decks,
          and so on.
        </div>
      )}

      {/*
        Survivors Return

        Displays arrival bonuses and settlement principles, which may be
        relevant to this step when survivors return to the settlement.
      */}
      {selectedSettlementPhase?.step ===
        SettlementPhaseStep.SURVIVORS_RETURN && (
        <>
          <ArrivalBonusesCard
            saveSelectedSettlement={saveSelectedSettlement}
            selectedSettlement={selectedSettlement}
          />

          <PrinciplesCard
            saveSelectedSettlement={saveSelectedSettlement}
            selectedSettlement={selectedSettlement}
          />
        </>
      )}

      {/*
        Gain Endeavors

        Endeavors are gained based on settlement principles and returning
        survivors (dead or alive).
      */}
      {selectedSettlementPhase?.step === SettlementPhaseStep.GAIN_ENDEAVORS && (
        <PrinciplesCard
          saveSelectedSettlement={saveSelectedSettlement}
          selectedSettlement={selectedSettlement}
        />
      )}

      {/*
        Update Timeline

        Timeline is advanced by 1 lantern year. A story event should be
        resolved, followed by any timeline events.

        TODO: If the timeline has a special showdown, this will interrupt the
        settlement phase.
      */}
      {selectedSettlementPhase?.step ===
        SettlementPhaseStep.UPDATE_TIMELINE && (
        <TimelineCard
          saveSelectedSettlement={saveSelectedSettlement}
          selectedSettlement={selectedSettlement}
        />
      )}

      {/*
        Update Death Count

        No additional components are needed. This is updated whenever a
        survivor's death status is updated.
      */}
      {selectedSettlementPhase?.step ===
        SettlementPhaseStep.UPDATE_DEATH_COUNT && (
        <div className="text-center text-sm text-muted-foreground">
          Death count is updated automatically as survivor data is updated.
        </div>
      )}

      {/* Check Milestones */}
      {selectedSettlementPhase?.step ===
        SettlementPhaseStep.CHECK_MILESTONES && (
        <MilestonesCard
          saveSelectedSettlement={saveSelectedSettlement}
          selectedSettlement={selectedSettlement}
        />

        // TODO: Strain Milestones card
      )}

      {/*
        Develop

        Displays components related to improving the settlement, such as
        innovations, locations, resources, etc.
      */}
      {selectedSettlementPhase?.step === SettlementPhaseStep.DEVELOP && (
        <>
          <InnovationsCard
            saveSelectedSettlement={saveSelectedSettlement}
            selectedSettlement={selectedSettlement}
          />

          <LocationsCard
            saveSelectedSettlement={saveSelectedSettlement}
            selectedSettlement={selectedSettlement}
          />

          <ResourcesCard
            saveSelectedSettlement={saveSelectedSettlement}
            selectedSettlement={selectedSettlement}
          />

          <GearCard
            saveSelectedSettlement={saveSelectedSettlement}
            selectedSettlement={selectedSettlement}
          />

          {selectedSettlement?.survivorType === SurvivorType.ARC && (
            <KnowledgesCard
              saveSelectedSettlement={saveSelectedSettlement}
              selectedSettlement={selectedSettlement}
            />
          )}
        </>
      )}

      {/*
        Prepare Departing Survivors

        No additional components are needed. This is done when the user creates
        a hunt or showdown.
      */}
      {selectedSettlementPhase?.step ===
        SettlementPhaseStep.PREPARE_DEPARTING_SURVIVORS && (
        <div className="text-center text-sm text-muted-foreground">
          Survivors are prepared for departure when creating a hunt or showdown.
        </div>
      )}

      {/* Special Showdown */}
      {selectedSettlementPhase?.step ===
        SettlementPhaseStep.SPECIAL_SHOWDOWN && (
        <div className="text-center text-sm text-muted-foreground">
          Survivors are prepared for departure when creating a hunt or showdown.
        </div>
      )}
      {/* On showdown create UI, add indicator this is special showdown */}

      {/* Record and Archive Resources */}
      {selectedSettlementPhase?.step ===
        SettlementPhaseStep.RECORD_AND_ARCHIVE_RESOURCES && (
        <ResourcesCard
          saveSelectedSettlement={saveSelectedSettlement}
          selectedSettlement={selectedSettlement}
        />
      )}

      {/* End Settlement Phase */}
      {selectedSettlementPhase?.step ===
        SettlementPhaseStep.END_SETTLEMENT_PHASE && (
        <>
          <DepartingBonusesCard
            saveSelectedSettlement={saveSelectedSettlement}
            selectedSettlement={selectedSettlement}
          />

          <PrinciplesCard
            saveSelectedSettlement={saveSelectedSettlement}
            selectedSettlement={selectedSettlement}
          />
        </>
      )}

      {/*
        Returning Survivors

        Conditionally displayed based on the current settlement phase step.
        Shows all returning survivors, dead or alive.
      */}
      {[
        SettlementPhaseStep.SURVIVORS_RETURN,
        SettlementPhaseStep.GAIN_ENDEAVORS,
        SettlementPhaseStep.CHECK_MILESTONES
      ].includes(selectedSettlementPhase?.step) && (
        <SettlementPhaseSurvivorsCard
          campaign={campaign}
          saveSelectedSurvivor={saveSelectedSurvivor}
          selectedSettlement={selectedSettlement}
          selectedSettlementPhase={selectedSettlementPhase}
          selectedSurvivor={selectedSurvivor}
          setSelectedSurvivor={setSelectedSurvivor}
        />
      )}
    </>
  )
}
