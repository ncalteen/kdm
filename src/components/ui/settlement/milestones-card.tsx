import { SettlementSchema } from '@/schemas/settlement'
import { UseFormReturn } from 'react-hook-form'
import { z } from 'zod'
import { Card, CardContent, CardHeader, CardTitle } from '../card'
import { Checkbox } from '../checkbox'
import { FormControl, FormField, FormItem } from '../form'
import { Input } from '../input'

// Example campaign milestones in KDM
const DEFAULT_MILESTONES = [
  'First Day',
  'Returning Survivors',
  'Principle: New Life',
  'Principle: Death',
  'Principle: Society',
  'Principle: Conviction'
]

export function MilestonesCard(
  form: UseFormReturn<z.infer<typeof SettlementSchema>>
) {
  const milestones = form.watch('milestones')

  const addMilestone = () => {
    const currentMilestones = [...(milestones || [])]
    currentMilestones.push({ name: '', complete: false })
    form.setValue('milestones', currentMilestones)
  }

  const ensureDefaultMilestones = () => {
    const currentMilestones = [...(milestones || [])]
    if (currentMilestones.length === 0) {
      DEFAULT_MILESTONES.forEach((name) => {
        currentMilestones.push({ name, complete: false })
      })
      form.setValue('milestones', currentMilestones)
    }
  }

  // Ensure default milestones exist
  if (!milestones || milestones.length === 0) {
    ensureDefaultMilestones()
  }

  return (
    <Card className="mt-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Settlement Milestones</CardTitle>
      </CardHeader>
      <CardContent className="pt-0 pb-2">
        <div className="space-y-2">
          {milestones &&
            milestones.map((milestone, index) => (
              <div key={index} className="flex items-center gap-2">
                <FormField
                  control={form.control}
                  name={`milestones.${index}.complete`}
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={(checked) => {
                            form.setValue(
                              `milestones.${index}.complete`,
                              !!checked
                            )
                          }}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`milestones.${index}.name`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input
                          placeholder="Milestone"
                          {...field}
                          value={field.value || ''}
                          onChange={(e) => {
                            form.setValue(
                              `milestones.${index}.name`,
                              e.target.value
                            )
                          }}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            ))}

          <div className="flex justify-center mt-4">
            <button
              type="button"
              onClick={addMilestone}
              className="text-xs text-muted-foreground hover:text-foreground">
              + Add Milestone
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
