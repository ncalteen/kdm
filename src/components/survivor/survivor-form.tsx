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
import { NextDepartureCard } from '@/components/survivor/next-departure/next-departure-card'
import { OncePerLifetimeCard } from '@/components/survivor/once-per-lifetime/once-per-lifetime-card'
import { PhilosophyCard } from '@/components/survivor/philosophy/philosophy-card'
import { SanityCard } from '@/components/survivor/sanity/sanity-card'
import { SurvivalCard } from '@/components/survivor/survival/survival-card'
import { WeaponProficiencyCard } from '@/components/survivor/weapon-proficiency/weapon-proficiency-card'
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
import { ZodError } from 'zod'

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
        // Create an updated survivor with the new values
        const updatedSurvivor = {
          ...campaign.survivors[survivorIndex],
          ...values
        }

        try {
          SurvivorSchema.parse(updatedSurvivor)
        } catch (error) {
          if (error instanceof ZodError && error.errors[0]?.message)
            return toast.error(error.errors[0].message)
          else
            return toast.error(
              'The darkness swallows your words. Please try again.'
            )
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
      toast.error('The darkness swallows your words. Please try again.')
    }
  }

  return (
    <div className="grid grid-rows-[0px_1fr_0px] grid-rows-[1fr] items-center justify-items-center sm:p-8 pb-20 gap-8 sm:gap-16 font-[family-name:var(--font-geist-sans)]">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Form {...form}>
          <Card className="pt-2 min-w-[500px]">
            <CardContent>
              <div className="flex flex-col md:flex-row gap-1">
                <div className="w-[500px]">
                  <NameGenderCard {...form} />
                  <SurvivalCard {...form} />
                  <AttributeCard {...form} />
                  <SanityCard {...form} />
                  <CombatCard {...form} />
                </div>
                <div className="w-[500px]">
                  <HuntXPCard {...form} />
                  <WeaponProficiencyCard {...form} />
                  <CourageUnderstandingCard {...form} />
                  <NextDepartureCard {...form} />
                  <FightingArtsCard {...form} />
                  <DisordersCard {...form} />
                  <AbilitiesAndImpairmentsCard {...form} />
                  <OncePerLifetimeCard {...form} />
                </div>
                {settlement?.survivorType === SurvivorType.ARC && (
                  <div className="w-[500px]">
                    <PhilosophyCard {...form} />
                    <KnowledgeCard {...form} />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </Form>
      </form>
    </div>
  )
}
