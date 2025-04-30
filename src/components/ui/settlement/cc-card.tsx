'use client'

import { SettlementSchema } from '@/schemas/settlement'
import { useEffect, useMemo, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { z } from 'zod'
import { Card, CardContent } from '../card'
import { FormControl, FormField, FormItem, FormLabel } from '../form'
import { Input } from '../input'

export function CcCard(form: UseFormReturn<z.infer<typeof SettlementSchema>>) {
  const [ccValue, setCcValue] = useState(0)

  // Watch for changes to nemesis victories, quarry victories, and cc rewards
  const nemesisVictories = useMemo(
    () => form.watch('ccNemesisVictories') || [],
    [form]
  )
  const quarryVictories = useMemo(
    () => form.watch('ccQuarryVictories') || [],
    [form]
  )
  const ccRewards = useMemo(() => form.watch('ccRewards') || [], [form])

  useEffect(() => {
    // Calculate CC value based on nemesis and quarry victories
    let totalCc = 0

    // Calculate CC from nemesis victories
    for (const nemesis of nemesisVictories) {
      if (nemesis.level1) totalCc += 3
      if (nemesis.level2) totalCc += 3
      if (nemesis.level3) totalCc += 3
    }

    // Calculate CC from quarry victories
    for (const quarry of quarryVictories) {
      if (quarry.prologue) totalCc += 1
      if (quarry.level1) totalCc += 1

      // Add 2 for each true value in level2 array
      for (const level2Victory of quarry.level2 || []) {
        if (level2Victory) totalCc += 2
      }

      // Add 3 for each true value in level3 array
      for (const level3Victory of quarry.level3 || []) {
        if (level3Victory) totalCc += 3
      }
    }

    // Add CC from CC rewards
    for (const reward of ccRewards) {
      if (reward.unlocked) {
        totalCc += reward.cc
      }
    }

    setCcValue(totalCc)

    // Update the form's ccValue field with the calculated value
    form.setValue('ccValue', totalCc)
  }, [nemesisVictories, quarryVictories, ccRewards, form])

  return (
    <Card className="mt-2">
      <CardContent className="pt-2 pb-2">
        <div className="flex flex-row items-center">
          <FormField
            control={form.control}
            name="ccValue"
            render={() => (
              <FormItem className="flex items-center gap-4">
                <div className="flex items-center pt-2">
                  <FormControl>
                    <Input
                      type="text"
                      className="w-16 h-12 text-2xl font-bold text-center border-2 no-spinners"
                      value={ccValue}
                      readOnly
                    />
                  </FormControl>
                </div>
                <div className="text-left">
                  <FormLabel className="text-base font-medium">
                    Collective Cognition
                  </FormLabel>
                  <p className="text-sm text-muted-foreground">
                    The settlement&apos;s total CC is based on its victories.
                  </p>
                </div>
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  )
}
