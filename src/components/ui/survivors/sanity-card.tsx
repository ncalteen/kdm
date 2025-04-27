import { SURVIVOR_SCHEMA } from '@/schemas/survivor'
import { Shield } from 'lucide-react'
import { UseFormReturn } from 'react-hook-form'
import { z } from 'zod'
import { Card, CardContent } from '../card'
import { Checkbox } from '../checkbox'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '../form'
import { Input } from '../input'

export function SanityCard(
  form: UseFormReturn<z.infer<typeof SURVIVOR_SCHEMA>>
) {
  return (
    <Card className="mt-4">
      <CardContent className="pt-2 pb-2 relative">
        <FormField
          control={form.control}
          name="insanity"
          render={({ field }) => (
            <FormItem>
              <div className="flex flex-col items-left gap-2">
                <FormControl>
                  <div className="relative">
                    <Shield className="h-12 w-12 text-muted-foreground" />
                    <Input
                      placeholder="1"
                      type="number"
                      className="absolute top-[50%] left-[9%] transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-center p-0 bg-transparent border-none"
                      {...field}
                      value={field.value ?? '0'}
                      onChange={(e) => {
                        form.setValue(field.name, parseInt(e.target.value))
                      }}
                    />
                  </div>
                </FormControl>
                <FormLabel className="text-sm">Insanity</FormLabel>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="absolute top-0 bottom-0 left-[16%] w-[1px] bg-muted-foreground h-full"></div>
        <div className="absolute top-0 left-[20%] pl-2 flex flex-col h-full justify-center">
          <div className="font-bold">Brain</div>
          <div className="text-sm mt-1">
            If your insanity is 3+, you are <strong>insane</strong>.
          </div>
        </div>

        <FormField
          control={form.control}
          name="brainLightDamage"
          render={({ field }) => (
            <FormItem className="absolute top-2 right-2 space-y-0 flex items-center">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel className="ml-2 text-sm font-medium">
                Light Damage
              </FormLabel>
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  )
}
