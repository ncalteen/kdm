'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'
import { SurvivorSchema } from '@/schemas/survivor'
import { useMemo } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { z } from 'zod'

/**
 * Hunt XP Card Component Properties
 */
export interface HuntXPCardProps {
  /** Form */
  form: UseFormReturn<z.infer<typeof SurvivorSchema>>
}

/**
 * Hunt XP Card Component
 *
 * @param props HuntXPCard props
 */
export function HuntXPCard({ form }: HuntXPCardProps) {
  const huntXP = useMemo(() => form.watch('huntXP') || 0, [form])
  const huntXPRankUp = useMemo(() => form.watch('huntXPRankUp') || [], [form])

  /**
   * Handles toggling the Hunt XP checkboxes
   *
   * @param index The index of the checkbox (1-based)
   * @param checked Whether the checkbox is checked
   */
  const handleToggle = (index: number, checked: boolean) => {
    if (checked)
      // If checking a box, check all previous boxes too
      form.setValue('huntXP', index)
    else
      // If unchecking a box, uncheck all subsequent boxes too
      form.setValue('huntXP', index - 1)
  }

  /**
   * Checks if a checkbox should be disabled
   *
   * @param index The index of the checkbox (1-based)
   * @returns True if the checkbox should be disabled
   */
  const isDisabled = (index: number) => index > huntXP + 1

  /**
   * Determines if a checkbox should have a bold border
   *
   * @param index The index of the checkbox (1-based)
   * @returns True if the checkbox should have a bold border
   */
  const isMilestone = (index: number) => huntXPRankUp.includes(index)

  return (
    <Card>
      <CardContent className="py-4 min-w-[495px]">
        <div className="flex flex-wrap gap-2 items-center">
          <div className="font-bold text-l whitespace-nowrap">Hunt XP</div>
          <div className="flex flex-wrap gap-2 items-center">
            {Array.from({ length: 16 }, (_, i) => {
              const boxIndex = i + 1 // 1-based index

              return (
                <div key={boxIndex} className="flex flex-col items-center">
                  <Checkbox
                    id={`hunt-xp-${boxIndex}`}
                    checked={huntXP >= boxIndex}
                    disabled={isDisabled(boxIndex)}
                    onCheckedChange={(checked) =>
                      handleToggle(boxIndex, !!checked)
                    }
                    className={cn(
                      'h-4 w-4 rounded-sm',
                      isMilestone(boxIndex) && 'border-2 border-primary'
                    )}
                  />
                </div>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
