'use client'

import { AbilitiesAndImpairmentsCard } from '@/components/survivor/abilities-and-impairments/abilities-and-impairments-card'
import { AttributeCard } from '@/components/survivor/attributes/attribute-card'
import { CombatCard } from '@/components/survivor/combat/combat-card'
import { CourageUnderstandingCard } from '@/components/survivor/courage-understanding/courage-understanding-card'
import { DisordersCard } from '@/components/survivor/disorders/disorders-card'
import { FightingArtsCard } from '@/components/survivor/fighting-arts/fighting-arts-card'
import { HuntXPCard } from '@/components/survivor/hunt-xp/hunt-xp-card'
import { KnowledgeCard } from '@/components/survivor/knowledge/knowledge-card'
import { NameGenderCard } from '@/components/survivor/name-gender/name-gender-card'
import { OncePerLifetimeCard } from '@/components/survivor/once-per-lifetime/once-per-lifetime-card'
import { PhilosophyCard } from '@/components/survivor/philosophy/philosophy-card'
import { SanityCard } from '@/components/survivor/sanity/sanity-card'
import { SurvivalCard } from '@/components/survivor/survival/survival-card'
import { WeaponProficiencyCard } from '@/components/survivor/weapon-proficiency/weapon-proficiency-card'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Form } from '@/components/ui/form'
import { SurvivorType } from '@/lib/enums'
import { getCampaign, getSettlement } from '@/lib/utils'
import { Settlement } from '@/schemas/settlement'
import { Survivor, SurvivorSchema } from '@/schemas/survivor'
import { zodResolver } from '@hookform/resolvers/zod'
import { ReactElement, useEffect, useState } from 'react'
import { Resolver, useForm } from 'react-hook-form'
import { toast } from 'sonner'

/**
 * Survivor Form Component Properties
 */
export interface SurvivorFormProps {
  /** Survivor Data */
  survivor: Survivor
}

/**
 * Survivor Form Component
 *
 * This component is used to display/edit a survivor.
 */
export function SurvivorForm({ survivor }: SurvivorFormProps): ReactElement {
  const [settlement, setSettlement] = useState<Settlement | undefined>()

  useEffect(() => {
    if (survivor.settlementId) {
      const fetchedSettlement = getSettlement(survivor.settlementId)
      setSettlement(fetchedSettlement)
    }
  }, [survivor.settlementId])

  const form = useForm<Survivor>({
    resolver: zodResolver(SurvivorSchema) as Resolver<Survivor>,
    defaultValues: survivor
  })

  /**
   * Handles form submission
   *
   * @param values Form Values
   */
  function onSubmit(values: Survivor) {
    try {
      // Get existing campaign
      const campaign = getCampaign()

      // Find the survivor in the campaign and update it
      const survivorIndex = campaign.survivors.findIndex(
        (s) => s.id === values.id
      )

      if (survivorIndex !== -1) {
        // Get the existing survivor to merge with updates
        const existingSurvivor = campaign.survivors[survivorIndex]

        // Create an updated survivor with all fields
        const updatedSurvivor = {
          ...existingSurvivor, // Start with all existing values
          ...values, // Override with new values from the form

          // Explicitly set specific optional booleans to their default values if undefined
          canSpendSurvival: values.canSpendSurvival ?? true,
          canDodge: values.canDodge ?? true,
          canDash: values.canDash ?? true,
          canEncourage: values.canEncourage ?? true,
          canFistPump: values.canFistPump ?? true,
          canSurge: values.canSurge ?? true,
          canUseFightingArtsOrKnowledges:
            values.canUseFightingArtsOrKnowledges ?? true,

          // Set false defaults
          dead: values.dead ?? false,
          hasAnalyze: values.hasAnalyze ?? false,
          hasExplore: values.hasExplore ?? false,
          hasMatchmaker: values.hasMatchmaker ?? false,
          hasPrepared: values.hasPrepared ?? false,
          hasStalwart: values.hasStalwart ?? false,
          hasTinker: values.hasTinker ?? false,
          rerollUsed: values.rerollUsed ?? false,
          retired: values.retired ?? false,
          skipNextHunt: values.skipNextHunt ?? false,

          // People of the stars booleans
          hasAbsoluteReaper: values.hasAbsoluteReaper ?? false,
          hasAbsoluteRust: values.hasAbsoluteRust ?? false,
          hasAbsoluteStorm: values.hasAbsoluteStorm ?? false,
          hasAbsoluteWitch: values.hasAbsoluteWitch ?? false,
          hasGamblerReaper: values.hasGamblerReaper ?? false
        }

        // Update the survivor in the campaign
        campaign.survivors[survivorIndex] = updatedSurvivor

        // Save the updated campaign to localStorage
        localStorage.setItem('campaign', JSON.stringify(campaign))

        // Show success message
        toast.success(
          'The survivor has returned, forever changed by their trials.'
        )
      } else {
        toast.error('Could not find the survivor to update. Please try again.')
      }
    } catch (error) {
      console.error('Survivor Update Error:', error)
      toast.error('The darkness resists your changes. Please try again.')
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <Form {...form}>
        <Card className="mb-2">
          <CardContent className="w-full pt-6 pb-6">
            <div className="flex justify-between items-center">
              <div className="font-bold text-xl">
                {survivor.name} - Edit Survivor
              </div>
              <Button type="submit">Save Changes</Button>
            </div>
            <hr className="mt-2 mb-2" />

            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <NameGenderCard {...form} />
                <SurvivalCard {...form} />
                <AttributeCard {...form} />
                <SanityCard {...form} />
                <CombatCard {...form} />
              </div>
              <div className="flex-1">
                <HuntXPCard {...form} />
                <WeaponProficiencyCard {...form} />
                <CourageUnderstandingCard {...form} />
                <FightingArtsCard {...form} />
                <DisordersCard {...form} />
                <AbilitiesAndImpairmentsCard {...form} />
                <OncePerLifetimeCard {...form} />
              </div>
              {settlement?.survivorType === SurvivorType.ARC && (
                <div className="flex-1">
                  <PhilosophyCard {...form} />
                  <KnowledgeCard {...form} />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </Form>
    </form>
  )
}
