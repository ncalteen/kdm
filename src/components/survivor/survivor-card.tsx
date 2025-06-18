'use client'

import { AbilitiesAndImpairmentsCard } from '@/components/survivor/abilities-and-impairments/abilities-and-impairments-card'
import { AttributeCard } from '@/components/survivor/attributes/attribute-card'
import { ArmsCard } from '@/components/survivor/combat/arms-card'
import { BodyCard } from '@/components/survivor/combat/body-card'
import { HeadCard } from '@/components/survivor/combat/head-card'
import { LegsCard } from '@/components/survivor/combat/legs-card'
import { WaistCard } from '@/components/survivor/combat/waist-card'
import { CourageUnderstandingCard } from '@/components/survivor/courage-understanding/courage-understanding-card'
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
import { SurvivorType } from '@/lib/enums'
import { Settlement } from '@/schemas/settlement'
import { Survivor } from '@/schemas/survivor'
import { ReactElement } from 'react'
import { UseFormReturn } from 'react-hook-form'

/**
 * Survivor Card Props
 */
interface SurvivorCardProps extends Partial<Survivor> {
  /** Survivor Form */
  form: UseFormReturn<Survivor>
  /** Save Selected Survivor */
  saveSelectedSurvivor: (data: Partial<Survivor>, successMsg?: string) => void
  /** Selected Settlement */
  selectedSettlement: Partial<Settlement> | null
}

/**
 * Survivor Form Component
 *
 * This component is used to display/edit a survivor.
 */
export function SurvivorCard({
  form,
  saveSelectedSurvivor,
  selectedSettlement
}: SurvivorCardProps): ReactElement {
  return (
    <Card className="w-full py-2 border-0 bg-secondary">
      <CardContent className="px-2">
        {/* Desktop Layout */}
        <div className="hidden lg:flex lg:flex-row lg:flex-wrap gap-2 w-full">
          {/* First Column - Essential Stats */}
          <div className="flex flex-col flex-1 gap-1 min-w-[450px]">
            <StatusCard
              form={form}
              saveSelectedSurvivor={saveSelectedSurvivor}
            />
            <SurvivalCard
              form={form}
              saveSelectedSurvivor={saveSelectedSurvivor}
              selectedSettlement={selectedSettlement}
            />
            <AttributeCard
              form={form}
              saveSelectedSurvivor={saveSelectedSurvivor}
              selectedSettlement={selectedSettlement}
            />
            <SanityCard
              form={form}
              saveSelectedSurvivor={saveSelectedSurvivor}
              selectedSettlement={selectedSettlement}
            />
            <HeadCard form={form} saveSelectedSurvivor={saveSelectedSurvivor} />
            <ArmsCard form={form} saveSelectedSurvivor={saveSelectedSurvivor} />
            <BodyCard form={form} saveSelectedSurvivor={saveSelectedSurvivor} />
            <WaistCard
              form={form}
              saveSelectedSurvivor={saveSelectedSurvivor}
            />
            <LegsCard form={form} saveSelectedSurvivor={saveSelectedSurvivor} />
            <NextDepartureCard
              form={form}
              saveSelectedSurvivor={saveSelectedSurvivor}
            />
          </div>

          {/* Second Column - Abilities */}
          <div className="flex flex-col flex-1 gap-1 min-w-[450px]">
            <HuntXPCard
              form={form}
              selectedSettlement={selectedSettlement}
              saveSelectedSurvivor={saveSelectedSurvivor}
            />
            <WeaponProficiencyCard
              form={form}
              saveSelectedSurvivor={saveSelectedSurvivor}
            />
            <CourageUnderstandingCard
              form={form}
              selectedSettlement={selectedSettlement}
              saveSelectedSurvivor={saveSelectedSurvivor}
            />
            <FightingArtsCard
              form={form}
              selectedSettlement={selectedSettlement}
              saveSelectedSurvivor={saveSelectedSurvivor}
            />
            <DisordersCard
              form={form}
              saveSelectedSurvivor={saveSelectedSurvivor}
            />
            <AbilitiesAndImpairmentsCard
              form={form}
              saveSelectedSurvivor={saveSelectedSurvivor}
            />
            <OncePerLifetimeCard
              form={form}
              saveSelectedSurvivor={saveSelectedSurvivor}
            />
          </div>

          {/* Third Column - ARC */}
          {selectedSettlement?.survivorType === SurvivorType.ARC && (
            <div className="flex flex-col flex-1 gap-1 min-w-[450px]">
              <PhilosophyCard
                form={form}
                saveSelectedSurvivor={saveSelectedSurvivor}
              />
              <KnowledgeCard
                form={form}
                saveSelectedSurvivor={saveSelectedSurvivor}
              />
            </div>
          )}
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden flex flex-col gap-2 w-full">
          {/* Core Identity & Status */}
          <StatusCard form={form} saveSelectedSurvivor={saveSelectedSurvivor} />
          <HuntXPCard
            form={form}
            selectedSettlement={selectedSettlement}
            saveSelectedSurvivor={saveSelectedSurvivor}
          />

          {/* Core Stats */}
          <SurvivalCard
            form={form}
            selectedSettlement={selectedSettlement}
            saveSelectedSurvivor={saveSelectedSurvivor}
          />
          <AttributeCard
            form={form}
            selectedSettlement={selectedSettlement}
            saveSelectedSurvivor={saveSelectedSurvivor}
          />
          <SanityCard
            form={form}
            selectedSettlement={selectedSettlement}
            saveSelectedSurvivor={saveSelectedSurvivor}
          />

          {/* Equipment */}
          <HeadCard form={form} saveSelectedSurvivor={saveSelectedSurvivor} />
          <ArmsCard form={form} saveSelectedSurvivor={saveSelectedSurvivor} />
          <BodyCard form={form} saveSelectedSurvivor={saveSelectedSurvivor} />
          <WaistCard form={form} saveSelectedSurvivor={saveSelectedSurvivor} />
          <LegsCard form={form} saveSelectedSurvivor={saveSelectedSurvivor} />

          {/* Development */}
          <WeaponProficiencyCard
            form={form}
            saveSelectedSurvivor={saveSelectedSurvivor}
          />
          <CourageUnderstandingCard
            form={form}
            selectedSettlement={selectedSettlement}
            saveSelectedSurvivor={saveSelectedSurvivor}
          />

          {/* Abilities & Traits */}
          <FightingArtsCard
            form={form}
            selectedSettlement={selectedSettlement}
            saveSelectedSurvivor={saveSelectedSurvivor}
          />
          <DisordersCard
            form={form}
            saveSelectedSurvivor={saveSelectedSurvivor}
          />
          <AbilitiesAndImpairmentsCard
            form={form}
            saveSelectedSurvivor={saveSelectedSurvivor}
          />
          <OncePerLifetimeCard
            form={form}
            saveSelectedSurvivor={saveSelectedSurvivor}
          />

          {/* ARC-specific cards */}
          {selectedSettlement?.survivorType === SurvivorType.ARC && (
            <>
              <PhilosophyCard
                form={form}
                saveSelectedSurvivor={saveSelectedSurvivor}
              />
              <KnowledgeCard
                form={form}
                saveSelectedSurvivor={saveSelectedSurvivor}
              />
            </>
          )}

          {/* Administrative */}
          <NextDepartureCard
            form={form}
            saveSelectedSurvivor={saveSelectedSurvivor}
          />
        </div>
      </CardContent>
    </Card>
  )
}
