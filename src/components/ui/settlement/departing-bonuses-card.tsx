import { SettlementSchema } from '@/schemas/settlement'
import { UseFormReturn } from 'react-hook-form'
import { z } from 'zod'
import { Card, CardContent, CardHeader, CardTitle } from '../card'
import { Checkbox } from '../checkbox'
import { FormControl, FormField, FormItem } from '../form'
import { Input } from '../input'

// Example departing survivor bonuses in KDM
const DEFAULT_BONUSES = ['Accuracy', 'Strength', 'Evasion', 'Luck', 'Speed']

export function DepartingBonusesCard(
  form: UseFormReturn<z.infer<typeof SettlementSchema>>
) {
  const bonuses = form.watch('departingBonuses')

  const addBonus = () => {
    const currentBonuses = [...(bonuses || [])]
    currentBonuses.push({ name: '', complete: false })
    form.setValue('departingBonuses', currentBonuses)
  }

  const ensureDefaultBonuses = () => {
    const currentBonuses = [...(bonuses || [])]
    if (currentBonuses.length === 0) {
      DEFAULT_BONUSES.forEach((name) => {
        currentBonuses.push({ name, complete: false })
      })
      form.setValue('departingBonuses', currentBonuses)
    }
  }

  // Ensure default bonuses exist
  if (!bonuses || bonuses.length === 0) {
    ensureDefaultBonuses()
  }

  return (
    <Card className="mt-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Departing Survivor Bonuses</CardTitle>
      </CardHeader>
      <CardContent className="pt-0 pb-2">
        <div className="space-y-2">
          {bonuses &&
            bonuses.map((bonus, index) => (
              <div key={index} className="flex items-center gap-2">
                <FormField
                  control={form.control}
                  name={`departingBonuses.${index}.complete`}
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={(checked) => {
                            form.setValue(
                              `departingBonuses.${index}.complete`,
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
                  name={`departingBonuses.${index}.name`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input
                          placeholder="Bonus"
                          {...field}
                          value={field.value || ''}
                          onChange={(e) => {
                            form.setValue(
                              `departingBonuses.${index}.name`,
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
              onClick={addBonus}
              className="text-xs text-muted-foreground hover:text-foreground">
              + Add Bonus
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
