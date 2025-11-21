'use client'

import { AbilitiesAndImpairmentsCard } from '@/components/survivor/abilities-and-impairments/abilities-and-impairments-card'
import { AttributeCard } from '@/components/survivor/attributes/attribute-card'
import { ArmsCard } from '@/components/survivor/combat/arms-card'
import { BodyCard } from '@/components/survivor/combat/body-card'
import { HeadCard } from '@/components/survivor/combat/head-card'
import { LegsCard } from '@/components/survivor/combat/legs-card'
import { WaistCard } from '@/components/survivor/combat/waist-card'
import { CourageUnderstandingCard } from '@/components/survivor/courage-understanding/courage-understanding-card'
import { CursedGearCard } from '@/components/survivor/cursed-gear/cursed-gear-card'
import { DisordersCard } from '@/components/survivor/disorders/disorders-card'
import { FightingArtsCard } from '@/components/survivor/fighting-arts/fighting-arts-card'
import { HuntXPCard } from '@/components/survivor/hunt-xp/hunt-xp-card'
import { KnowledgeCard } from '@/components/survivor/knowledge/knowledge-card'
import { NextDepartureCard } from '@/components/survivor/next-departure/next-departure-card'
import { OncePerLifetimeCard } from '@/components/survivor/once-per-lifetime/once-per-lifetime-card'
import { PhilosophyCard } from '@/components/survivor/philosophy/philosophy-card'
import { SanityCard } from '@/components/survivor/sanity/sanity-card'
import { StatusCard } from '@/components/survivor/status/status-card'
import { SurvivalCard } from '@/components/survivor/survival/survival-card'
import { WeaponProficiencyCard } from '@/components/survivor/weapon-proficiency/weapon-proficiency-card'
import { Card, CardContent } from '@/components/ui/card'
import { SurvivorCardMode, SurvivorType } from '@/lib/enums'
import { Settlement } from '@/schemas/settlement'
import { Showdown } from '@/schemas/showdown'
import { Survivor } from '@/schemas/survivor'
import { ReactElement } from 'react'

/**
 * Survivor Card Props
 */
interface SurvivorCardProps extends Partial<Survivor> {
  /** Mode */
  mode: SurvivorCardMode
  /** Save Selected Showdown */
  saveSelectedShowdown: (data: Partial<Showdown>, successMsg?: string) => void
  /** Save Selected Survivor */
  saveSelectedSurvivor: (data: Partial<Survivor>, successMsg?: string) => void
  /** Selected Settlement */
  selectedSettlement: Partial<Settlement> | null
  /** Selected Showdown */
  selectedShowdown: Partial<Showdown> | null
  /** Selected Survivor */
  selectedSurvivor: Partial<Survivor> | null
  /** Set Survivors */
  setSurvivors: (survivors: Survivor[]) => void
  /** Survivors */
  survivors: Survivor[] | null
}

/**
 * Survivor Form Component
 *
 * This component is used to display/edit a survivor.
 */
export function SurvivorCard({
  mode,
  saveSelectedShowdown,
  saveSelectedSurvivor,
  selectedSettlement,
  selectedShowdown,
  selectedSurvivor,
  setSurvivors,
  survivors
}: SurvivorCardProps): ReactElement {
  return (
    <Card className="w-full py-2 border-0 bg-secondary">
      <CardContent className="px-2">
        <div className="flex flex-col xl:flex-row xl:flex-wrap gap-2 w-full">
          {/* First Column - Essential Stats */}
          <div className="flex flex-col flex-1 gap-1 xl:min-w-[450px]">
            {mode === SurvivorCardMode.SURVIVOR_CARD && (
              <StatusCard
                saveSelectedSurvivor={saveSelectedSurvivor}
                selectedSurvivor={selectedSurvivor}
                setSurvivors={setSurvivors}
                survivors={survivors}
              />
            )}
            <HuntXPCard
              saveSelectedSurvivor={saveSelectedSurvivor}
              selectedSettlement={selectedSettlement}
              selectedSurvivor={selectedSurvivor}
            />
            <SurvivalCard
              mode={mode}
              saveSelectedShowdown={saveSelectedShowdown}
              saveSelectedSurvivor={saveSelectedSurvivor}
              selectedSettlement={selectedSettlement}
              selectedShowdown={selectedShowdown}
              selectedSurvivor={selectedSurvivor}
            />
            <WeaponProficiencyCard
              saveSelectedSurvivor={saveSelectedSurvivor}
              selectedSurvivor={selectedSurvivor}
            />
            <CourageUnderstandingCard
              saveSelectedSurvivor={saveSelectedSurvivor}
              selectedSettlement={selectedSettlement}
              selectedSurvivor={selectedSurvivor}
            />
            <DisordersCard
              saveSelectedSurvivor={saveSelectedSurvivor}
              selectedSurvivor={selectedSurvivor}
            />
            <AbilitiesAndImpairmentsCard
              saveSelectedSurvivor={saveSelectedSurvivor}
              selectedSurvivor={selectedSurvivor}
            />
            <OncePerLifetimeCard
              saveSelectedSurvivor={saveSelectedSurvivor}
              selectedSurvivor={selectedSurvivor}
            />
          </div>

          {/* Second Column - Combat */}
          <div className="flex flex-col flex-1 gap-1 xl:min-w-[450px]">
            <AttributeCard
              mode={mode}
              saveSelectedShowdown={saveSelectedShowdown}
              saveSelectedSurvivor={saveSelectedSurvivor}
              selectedSettlement={selectedSettlement}
              selectedShowdown={selectedShowdown}
              selectedSurvivor={selectedSurvivor}
              readOnly={false}
            />
            <SanityCard
              displayText={true}
              displayTormentInput={true}
              mode={mode}
              saveSelectedShowdown={saveSelectedShowdown}
              saveSelectedSurvivor={saveSelectedSurvivor}
              selectedSettlement={selectedSettlement}
              selectedShowdown={selectedShowdown}
              selectedSurvivor={selectedSurvivor}
            />
            <HeadCard
              saveSelectedSurvivor={saveSelectedSurvivor}
              selectedSurvivor={selectedSurvivor}
            />
            <ArmsCard
              saveSelectedSurvivor={saveSelectedSurvivor}
              selectedSurvivor={selectedSurvivor}
            />
            <BodyCard
              saveSelectedSurvivor={saveSelectedSurvivor}
              selectedSurvivor={selectedSurvivor}
            />
            <WaistCard
              saveSelectedSurvivor={saveSelectedSurvivor}
              selectedSurvivor={selectedSurvivor}
            />
            <LegsCard
              saveSelectedSurvivor={saveSelectedSurvivor}
              selectedSurvivor={selectedSurvivor}
            />
            <FightingArtsCard
              saveSelectedSurvivor={saveSelectedSurvivor}
              selectedSettlement={selectedSettlement}
              selectedSurvivor={selectedSurvivor}
            />
            <CursedGearCard
              saveSelectedSurvivor={saveSelectedSurvivor}
              selectedSurvivor={selectedSurvivor}
            />
            {mode === SurvivorCardMode.SURVIVOR_CARD && (
              <NextDepartureCard
                saveSelectedSurvivor={saveSelectedSurvivor}
                selectedSurvivor={selectedSurvivor}
              />
            )}
          </div>

          {/* Third Column - ARC */}
          {selectedSettlement?.survivorType === SurvivorType.ARC && (
            <div className="flex flex-col flex-1 gap-1 xl:min-w-[450px] order-3">
              <PhilosophyCard
                saveSelectedSurvivor={saveSelectedSurvivor}
                selectedSurvivor={selectedSurvivor}
                setSurvivors={setSurvivors}
                survivors={survivors}
              />
              <KnowledgeCard
                saveSelectedSurvivor={saveSelectedSurvivor}
                selectedSurvivor={selectedSurvivor}
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
