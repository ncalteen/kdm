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
  /** Survivor form instance */
  form: UseFormReturn<Survivor>
  settlement: Settlement
  saveSurvivor: (data: Partial<Survivor>, successMsg?: string) => void
}

/**
 * Survivor Form Component
 *
 * This component is used to display/edit a survivor.
 */
export function SurvivorCard({
  form,
  settlement,
  saveSurvivor
}: SurvivorCardProps): ReactElement {
  return (
    <Card className="w-full py-2 border-0 bg-secondary">
      <CardContent className="px-2">
        {/* Desktop Layout */}
        <div className="hidden lg:flex lg:flex-row gap-2 w-full">
          {/* First Column - Essential Stats */}
          <div className="flex flex-col flex-1 gap-1 min-w-[500px]">
            <StatusCard {...form} form={form} saveSurvivor={saveSurvivor} />
            <SurvivalCard
              {...form}
              form={form}
              settlement={settlement}
              saveSurvivor={saveSurvivor}
            />
            <AttributeCard
              {...form}
              form={form}
              settlement={settlement}
              saveSurvivor={saveSurvivor}
            />
            <SanityCard
              {...form}
              form={form}
              settlement={settlement}
              saveSurvivor={saveSurvivor}
            />
            <HeadCard {...form} form={form} saveSurvivor={saveSurvivor} />
            <ArmsCard {...form} form={form} saveSurvivor={saveSurvivor} />
            <BodyCard {...form} form={form} saveSurvivor={saveSurvivor} />
            <WaistCard {...form} form={form} saveSurvivor={saveSurvivor} />
            <LegsCard {...form} form={form} saveSurvivor={saveSurvivor} />
            <NextDepartureCard
              {...form}
              form={form}
              saveSurvivor={saveSurvivor}
            />
          </div>

          {/* Second Column - Abilities */}
          <div className="flex flex-col flex-1 gap-1 min-w-[500px]">
            <HuntXPCard
              {...form}
              form={form}
              settlement={settlement}
              saveSurvivor={saveSurvivor}
            />
            <WeaponProficiencyCard form={form} saveSurvivor={saveSurvivor} />
            <CourageUnderstandingCard
              {...form}
              form={form}
              settlement={settlement}
              saveSurvivor={saveSurvivor}
            />
            <FightingArtsCard
              {...form}
              form={form}
              settlement={settlement}
              saveSurvivor={saveSurvivor}
            />
            <DisordersCard {...form} form={form} saveSurvivor={saveSurvivor} />
            <AbilitiesAndImpairmentsCard
              {...form}
              form={form}
              saveSurvivor={saveSurvivor}
            />
            <OncePerLifetimeCard
              {...form}
              form={form}
              saveSurvivor={saveSurvivor}
            />
          </div>

          {/* Third Column - ARC */}
          {settlement.survivorType === SurvivorType.ARC && (
            <div className="flex flex-col flex-1 gap-1 min-w-[500px]">
              <PhilosophyCard
                {...form}
                form={form}
                saveSurvivor={saveSurvivor}
              />
              <KnowledgeCard
                {...form}
                form={form}
                saveSurvivor={saveSurvivor}
              />
            </div>
          )}
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden flex flex-col gap-2 w-full">
          {/* Core Identity & Status */}
          <StatusCard {...form} form={form} saveSurvivor={saveSurvivor} />
          <HuntXPCard
            {...form}
            form={form}
            settlement={settlement}
            saveSurvivor={saveSurvivor}
          />

          {/* Core Stats */}
          <SurvivalCard
            {...form}
            form={form}
            settlement={settlement}
            saveSurvivor={saveSurvivor}
          />
          <AttributeCard
            {...form}
            form={form}
            settlement={settlement}
            saveSurvivor={saveSurvivor}
          />
          <SanityCard
            {...form}
            form={form}
            settlement={settlement}
            saveSurvivor={saveSurvivor}
          />

          {/* Equipment */}
          <HeadCard {...form} form={form} saveSurvivor={saveSurvivor} />
          <ArmsCard {...form} form={form} saveSurvivor={saveSurvivor} />
          <BodyCard {...form} form={form} saveSurvivor={saveSurvivor} />
          <WaistCard {...form} form={form} saveSurvivor={saveSurvivor} />
          <LegsCard {...form} form={form} saveSurvivor={saveSurvivor} />

          {/* Development */}
          <WeaponProficiencyCard form={form} saveSurvivor={saveSurvivor} />
          <CourageUnderstandingCard
            {...form}
            form={form}
            settlement={settlement}
            saveSurvivor={saveSurvivor}
          />

          {/* Abilities & Traits */}
          <FightingArtsCard
            {...form}
            form={form}
            settlement={settlement}
            saveSurvivor={saveSurvivor}
          />
          <DisordersCard {...form} form={form} saveSurvivor={saveSurvivor} />
          <AbilitiesAndImpairmentsCard
            {...form}
            form={form}
            saveSurvivor={saveSurvivor}
          />
          <OncePerLifetimeCard
            {...form}
            form={form}
            saveSurvivor={saveSurvivor}
          />

          {/* ARC-specific cards */}
          {settlement.survivorType === SurvivorType.ARC && (
            <>
              <PhilosophyCard
                {...form}
                form={form}
                saveSurvivor={saveSurvivor}
              />
              <KnowledgeCard
                {...form}
                form={form}
                saveSurvivor={saveSurvivor}
              />
            </>
          )}

          {/* Administrative */}
          <NextDepartureCard
            {...form}
            form={form}
            saveSurvivor={saveSurvivor}
          />
        </div>
      </CardContent>
    </Card>
  )
}
