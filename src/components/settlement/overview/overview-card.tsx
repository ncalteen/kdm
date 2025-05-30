'use client'

import { Card, CardContent } from '@/components/ui/card'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { CampaignType, SurvivorType } from '@/lib/enums'
import { getCampaign, getLostSettlementCount, getSurvivors } from '@/lib/utils'
import { Settlement, SettlementSchema } from '@/schemas/settlement'
import { ReactElement, useEffect, useMemo } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'
import { ZodError } from 'zod'

/**
 * Population Card Component
 *
 * Displays and manages population statistics for the settlement including
 * survival limit, population count, death count, and lost settlements.
 *
 * @param form Settlement form instance
 * @returns Population Card Component
 */
export function OverviewCard(form: UseFormReturn<Settlement>): ReactElement {
  const settlementId = form.watch('id')
  const survivorType = form.watch('survivorType')
  const campaignType = form.watch('campaignType')
  const isArcCampaign = survivorType === SurvivorType.ARC
  const isLanternCampaign =
    campaignType === CampaignType.PEOPLE_OF_THE_LANTERN ||
    campaignType === CampaignType.PEOPLE_OF_THE_SUN

  // Watch for changes to nemesis victories, quarry victories for ARC campaigns
  const nemeses = useMemo(() => form.watch('nemeses') || [], [form])
  const quarries = useMemo(() => form.watch('quarries') || [], [form])

  useEffect(() => {
    const survivors = getSurvivors(settlementId)

    form.setValue(
      'population',
      survivors ? survivors.filter((survivor) => !survivor.dead).length : 0
    )
    form.setValue(
      'deathCount',
      survivors ? survivors.filter((survivor) => survivor.dead).length : 0
    )
    form.setValue('lostSettlements', getLostSettlementCount())
  }, [settlementId, form])

  // Calculate collective cognition for ARC campaigns
  useEffect(() => {
    if (!isArcCampaign) return

    let totalCc = 0

    // Calculate CC from nemesis victories. Each nemesis victory gives 3 CC.
    for (const nemesis of nemeses) {
      if (nemesis.ccLevel1) totalCc += 3
      if (nemesis.ccLevel2) totalCc += 3
      if (nemesis.ccLevel3) totalCc += 3
    }

    // Calculate CC from quarry victories.
    for (const quarry of quarries) {
      // Prologue Monster (1 CC)
      if (quarry.ccPrologue) totalCc += 1

      // Level 1 Monster (1 CC)
      if (quarry.ccLevel1) totalCc += 1

      // Level 2 Monster (2 CC)
      for (const level2Victory of quarry.ccLevel2 || [])
        if (level2Victory) totalCc += 2

      // Level 3 Monster (3 CC)
      for (const level3Victory of quarry.ccLevel3 || [])
        if (level3Victory) totalCc += 3
    }

    form.setValue('ccValue', totalCc)
  }, [isArcCampaign, nemeses, quarries, form])

  /**
   * Save survival limit to localStorage for the current settlement, with
   * Zod validation and toast feedback.
   *
   * @param value Updated survival limit value
   */
  const saveSurvivalLimit = (value: number) => {
    try {
      const formValues = form.getValues()
      const campaign = getCampaign()
      const settlementIndex = campaign.settlements.findIndex(
        (s: { id: number }) => s.id === formValues.id
      )

      if (settlementIndex !== -1) {
        const updatedSettlement = {
          ...campaign.settlements[settlementIndex],
          survivalLimit: value
        }

        try {
          SettlementSchema.parse(updatedSettlement)
        } catch (error) {
          if (error instanceof ZodError && error.errors[0]?.message)
            return toast.error(error.errors[0].message)
          else
            return toast.error(
              'The darkness swallows your words. Please try again.'
            )
        }

        campaign.settlements[settlementIndex].survivalLimit = value
        localStorage.setItem('campaign', JSON.stringify(campaign))

        toast.success("The settlement's will to live grows stronger.")
      }
    } catch (error) {
      console.error('Survival Limit Save Error:', error)
      toast.error('The darkness swallows your words. Please try again.')
    }
  }

  /**
   * Save lantern research level to localStorage for the current settlement, with
   * Zod validation and toast feedback.
   *
   * @param value Updated lantern research level value
   */
  const saveLanternResearchLevel = (value: number) => {
    try {
      const formValues = form.getValues()
      const campaign = getCampaign()
      const settlementIndex = campaign.settlements.findIndex(
        (s: { id: number }) => s.id === formValues.id
      )

      if (settlementIndex !== -1) {
        const updatedSettlement = {
          ...campaign.settlements[settlementIndex],
          lanternResearchLevel: value
        }

        try {
          SettlementSchema.parse(updatedSettlement)
        } catch (error) {
          if (error instanceof ZodError && error.errors[0]?.message)
            return toast.error(error.errors[0].message)
          else
            return toast.error(
              'The darkness swallows your words. Please try again.'
            )
        }

        campaign.settlements[settlementIndex].lanternResearchLevel = value
        localStorage.setItem('campaign', JSON.stringify(campaign))

        toast.success('The lantern burns brighter with newfound knowledge.')
      }
    } catch (error) {
      console.error('Lantern Research Level Save Error:', error)
      toast.error('The darkness swallows your words. Please try again.')
    }
  }

  return (
    <Card className="border-0">
      <CardContent className="py-2">
        <div className="flex flex-row items-center justify-between">
          {/* Survival Limit */}
          <FormField
            control={form.control}
            name="survivalLimit"
            render={({ field }) => (
              <FormItem className="flex-1 flex justify-center">
                <div className="flex flex-col items-center gap-1">
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="1"
                      className="w-12 text-center no-spinners"
                      {...field}
                      value={field.value ?? '1'}
                      onChange={(e) => {
                        const value = parseInt(e.target.value)
                        form.setValue(field.name, value)
                        saveSurvivalLimit(value)
                      }}
                    />
                  </FormControl>
                  <FormLabel className="text-center text-xs">
                    Survival Limit
                  </FormLabel>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="sm:h-12 w-px bg-border" />

          {/* Population */}
          <FormField
            control={form.control}
            name="population"
            render={({ field }) => (
              <FormItem className="flex-1 flex justify-center">
                <div className="flex flex-col items-center gap-1">
                  <FormControl>
                    <Input
                      type="number"
                      className="w-12 text-center no-spinners"
                      {...field}
                      value={field.value ?? '0'}
                      disabled
                    />
                  </FormControl>
                  <FormLabel className="text-center text-xs">
                    Population
                  </FormLabel>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="sm:h-12 w-px bg-border" />

          {/* Death Count */}
          <FormField
            control={form.control}
            name="deathCount"
            render={({ field }) => (
              <FormItem className="flex-1 flex justify-center">
                <div className="flex flex-col items-center gap-1">
                  <FormControl>
                    <Input
                      type="number"
                      className="w-12 text-center no-spinners"
                      {...field}
                      value={field.value ?? '0'}
                      disabled
                    />
                  </FormControl>
                  <FormLabel className="text-center text-xs">
                    Death Count
                  </FormLabel>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="sm:h-12 w-px bg-border" />

          {/* Lost Settlement Count */}
          <FormField
            control={form.control}
            name="lostSettlements"
            render={({ field }) => (
              <FormItem className="flex-1 flex justify-center">
                <div className="flex flex-col items-center gap-1">
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0"
                      className="w-12 text-center no-spinners"
                      {...field}
                      value={field.value ?? '0'}
                      disabled
                    />
                  </FormControl>
                  <FormLabel className="text-center text-xs">
                    Lost Settlements
                  </FormLabel>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Collective Cognition (ARC only) */}
          {isArcCampaign && (
            <>
              <div className="sm:h-12 w-px bg-border" />

              <FormField
                control={form.control}
                name="ccValue"
                render={({ field }) => (
                  <FormItem className="flex-1 flex justify-center">
                    <div className="flex flex-col items-center gap-1">
                      <FormControl>
                        <Input
                          type="number"
                          className="w-12 text-center no-spinners"
                          {...field}
                          value={field.value ?? '0'}
                          disabled
                        />
                      </FormControl>
                      <FormLabel className="text-center text-xs">
                        Collective Cognition
                      </FormLabel>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}

          {/* Lantern Research Level (People of the Lantern/Sun only) */}
          {isLanternCampaign && (
            <>
              <div className="sm:h-12 w-px bg-border" />

              <FormField
                control={form.control}
                name="lanternResearchLevel"
                render={({ field }) => (
                  <FormItem className="flex-1 flex justify-center">
                    <div className="flex flex-col items-center gap-1">
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0"
                          className="w-12 text-center no-spinners"
                          {...field}
                          value={field.value ?? '0'}
                          onChange={(e) => {
                            const value = parseInt(e.target.value)
                            const finalValue =
                              isNaN(value) || value < 0 ? 0 : value
                            form.setValue(field.name, finalValue)
                            saveLanternResearchLevel(finalValue)
                          }}
                        />
                      </FormControl>
                      <FormLabel className="text-center text-xs">
                        Lantern Research
                      </FormLabel>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
