import { Card, CardContent } from '@/components/ui/card'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { getCampaign } from '@/lib/utils'
import { Settlement, SettlementSchema } from '@/schemas/settlement'
import { SunIcon } from 'lucide-react'
import { ReactElement } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'
import { ZodError } from 'zod'

/**
 * Lantern Research Level Card Component
 */
export function LanternResearchLevelCard({
  ...form
}: UseFormReturn<Settlement>): ReactElement {
  const lanternResearchLevel = form.watch('lanternResearchLevel') ?? 0

  /**
   * Save lantern research level to localStorage for the current settlement, with
   * Zod validation and toast feedback.
   *
   * @param value Updated Lantern Research Level
   */
  const saveToLocalStorage = (value: number) => {
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

  /**
   * Handles the change event for the lantern research level input.
   *
   * @param e Change Event
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = parseInt(e.target.value, 10)
    const finalValue = isNaN(value) || value < 0 ? 0 : value

    form.setValue('lanternResearchLevel', finalValue)
    saveToLocalStorage(finalValue)
  }

  return (
    <Card className="mt-1 border-0">
      <CardContent className="px-3 py-2 pb-2">
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
                      onChange={handleChange}
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
