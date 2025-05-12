'use client'

import { Card, CardContent } from '@/components/ui/card'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { SettlementSchema } from '@/schemas/settlement'
import { useEffect, useMemo, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { z } from 'zod'

/**
 * Collective Cognition Card
 */
export function CollectiveCognitionCard(
  form: UseFormReturn<z.infer<typeof SettlementSchema>>
) {
  // Initialize state for collective cognition value.
  const [ccValue, setCcValue] = useState(0)

  // Watch for changes to nemesis victories, quarry victories, and rewards.
  const nemeses = useMemo(() => form.watch('nemeses') || [], [form])
  const quarries = useMemo(() => form.watch('quarries') || [], [form])
  const ccRewards = useMemo(() => form.watch('ccRewards') || [], [form])

  useEffect(() => {
    // Calculate collective cognition based on nemesis and quarry victories.
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

    setCcValue(totalCc)
    form.setValue('ccValue', totalCc)
  }, [nemeses, quarries, ccRewards, form])

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
                      type="number"
                      className="w-16 h-12 text-2xl font-bold text-center border-2 no-spinners"
                      value={ccValue}
                      readOnly
                    />
                  </FormControl>
                </div>
                <div className="text-left">
                  <FormLabel className="text-base text-md font-medium">
                    Collective Cognition
                  </FormLabel>
                  <p className="text-xs text-muted-foreground">
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
