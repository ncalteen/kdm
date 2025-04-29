import { SettlementSchema } from '@/schemas/settlement'
import { HourglassIcon } from 'lucide-react'
import { UseFormReturn } from 'react-hook-form'
import { z } from 'zod'
import { Card, CardContent, CardHeader, CardTitle } from '../card'
import { Checkbox } from '../checkbox'
import { FormControl, FormField, FormItem } from '../form'
import { Input } from '../input'

export function TimelineCard(
  form: UseFormReturn<z.infer<typeof SettlementSchema>>
) {
  return (
    <Card className="mt-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">
          <HourglassIcon /> Timeline
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 pb-2">
        <div className="space-y-2">
          <div className="grid grid-cols-[60px_auto] gap-4 px-2 py-1 font-medium text-sm">
            <div>Year</div>
            <div>Event</div>
          </div>

          {Array.from({ length: 30 }, (_, index) => (
            <div
              key={index}
              className="grid grid-cols-[60px_auto] gap-4 items-center border-t border-border py-1">
              <div className="flex items-center gap-2">
                <FormField
                  control={form.control}
                  name={`timeline.${index}.completed`}
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-1 m-0">
                      <span className="text-sm font-medium w-5">
                        {index + 1}
                      </span>
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={(checked) => {
                            form.setValue(
                              `timeline.${index}.completed`,
                              !!checked
                            )
                          }}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name={`timeline.${index}.description`}
                render={({ field }) => (
                  <FormItem className="m-0">
                    <FormControl>
                      <Input
                        placeholder={`Year ${index + 1} event...`}
                        {...field}
                        value={field.value || ''}
                        onChange={(e) => {
                          form.setValue(
                            `timeline.${index}.description`,
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
        </div>
      </CardContent>
    </Card>
  )
}
