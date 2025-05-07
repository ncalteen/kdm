import { Card, CardContent } from '@/components/ui/card'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { SettlementSchema } from '@/schemas/settlement'
import { SunIcon } from 'lucide-react'
import { UseFormReturn } from 'react-hook-form'
import { z } from 'zod'

/**
 * Lantern Research Level Card Component
 */
export function LanternResearchLevelCard(
  form: UseFormReturn<z.infer<typeof SettlementSchema>>
) {
  const lanternResearchLevel = form.watch('lanternResearchLevel') ?? 0

  return (
    <Card className="mt-2">
      <CardContent className="pt-2 pb-2">
        <div className="flex flex-row items-center">
          <FormField
            control={form.control}
            name="lanternResearchLevel"
            render={() => (
              <FormItem className="flex items-center gap-4">
                <div className="flex items-center pt-2">
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      className="w-16 h-12 text-2xl font-bold text-center border-2 no-spinners"
                      value={lanternResearchLevel}
                      onChange={(e) => {
                        const value = parseInt(e.target.value, 10)
                        if (isNaN(value) || value < 0) {
                          form.setValue('lanternResearchLevel', 0)
                        } else {
                          form.setValue('lanternResearchLevel', value)
                        }
                      }}
                    />
                  </FormControl>
                </div>
                <div className="text-left">
                  <FormLabel className="flex items-center gap-1 text-md">
                    <SunIcon className="w-4 h-4" /> Lantern Research Level
                  </FormLabel>
                  <p className="text-xs text-muted-foreground">
                    Your settlement&apos;s progress in researching the secrets
                    of the Final Lantern.
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
