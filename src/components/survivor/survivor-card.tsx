'use client'

import { AbilitiesAndImpairmentsCard } from '@/components/survivor/abilities-and-impairments/abilities-and-impairments-card'
import { AttributeCard } from '@/components/survivor/attributes/attribute-card'
import { CombatCard } from '@/components/survivor/combat/combat-card'
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
import { Form } from '@/components/ui/form'
import { useSettlement } from '@/contexts/settlement-context'
import { SurvivorType } from '@/lib/enums'
import { getCampaign, saveCampaignToLocalStorage } from '@/lib/utils'
import { Survivor, SurvivorSchema } from '@/schemas/survivor'
import { ReactElement, useCallback, useEffect, useRef } from 'react'
import { UseFormReturn } from 'react-hook-form'
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
export function SurvivorCard({
  ...form
}: UseFormReturn<Survivor>): ReactElement {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const settlement = useSettlement().selectedSettlement

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
    }
  }, [])

  /**
   * Save survivor to localStorage with debouncing, with Zod validation and
   * toast feedback.
   *
   * @param values Survivor values
   * @param successMsg Success Message
   * @param immediate Whether to save immediately or use debouncing
   */
  const saveToLocalStorageDebounced = useCallback(
    (values: Survivor, successMsg?: string, immediate: boolean = true) => {
      const saveFunction = () => {
        try {
          // Find the survivor in the campaign
          const campaign = getCampaign()
          const survivorIndex = campaign.survivors.findIndex(
            (s) => s.id === values.id
          )

          if (survivorIndex !== -1) {
            // Create an updated survivor with the new values
            const currentSurvivor = campaign.survivors[survivorIndex]
            const updatedSurvivor = {
              ...currentSurvivor,
              ...values
            }

            // Skip validation for immediate updates to improve performance
            // Only validate on explicit saves or form submission
            if (!immediate) {
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
            }

            // Update campaign with the updated survivor - create a new array
            // only once
            const updatedSurvivors = [...campaign.survivors]
            updatedSurvivors[survivorIndex] = updatedSurvivor

            saveCampaignToLocalStorage({
              ...campaign,
              survivors: updatedSurvivors
            })

            if (successMsg) toast.success(successMsg)
          } else {
            toast.error(
              'Could not find the survivor to update. Please try again.'
            )
          }
        } catch (error) {
          console.error('Survivor Update Error:', error)
          toast.error('The darkness swallows your words. Please try again.')
        }
      }

      if (immediate) {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
          timeoutRef.current = null
        }
        saveFunction()
      } else {
        if (timeoutRef.current) clearTimeout(timeoutRef.current)

        timeoutRef.current = setTimeout(saveFunction, 300)
      }
    },
    []
  )

  /**
   * Handles form submission
   *
   * @param values Form Values
   */
  const onSubmit = useCallback(
    (values: Survivor) => {
      // Use immediate save (true) on explicit form submission
      saveToLocalStorageDebounced(
        values,
        'The survivor has returned, forever changed by their trials.',
        true
      )
    },
    [saveToLocalStorageDebounced]
  )

  return (
    <div className="grid justify-items-center sm:p-4">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Form {...form}>
          <Card className="pt-1 mx-auto">
            <CardContent>
              <div className="flex flex-col md:flex-row gap-2">
                {/* First column - essential stats */}
                <div className="w-[435px]">
                  <StatusCard {...form} />
                  <SurvivalCard {...form} />
                  <AttributeCard {...form} />
                  <SanityCard {...form} />
                  <CombatCard {...form} />
                  <NextDepartureCard {...form} />
                  <OncePerLifetimeCard {...form} />
                </div>

                {/* Second column - ability cards */}
                <div className="w-[500px]">
                  <HuntXPCard {...form} />
                  <WeaponProficiencyCard {...form} />
                  <CourageUnderstandingCard {...form} />
                  <FightingArtsCard {...form} />
                  <DisordersCard {...form} />
                  <AbilitiesAndImpairmentsCard {...form} />
                </div>

                {/* Third column - ARC cards */}
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
