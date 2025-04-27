import { CampaignType } from '@/lib/enums'
import { SURVIVOR_SCHEMA } from '@/schemas/survivor'
import { UseFormReturn } from 'react-hook-form'
import { z } from 'zod'
import { Card, CardContent } from '../card'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '../form'
import { Input } from '../input'

export function AttributeCard(
  form: UseFormReturn<z.infer<typeof SURVIVOR_SCHEMA>>
) {
  const isArcCampaign = form.getValues('type') === CampaignType.ARC

  return (
    <Card className="mt-4">
      <CardContent className="pt-2 pb-2">
        <div className="flex flex-row flex-wrap gap-4">
          <FormField
            control={form.control}
            name="movement"
            render={({ field }) => (
              <FormItem>
                <div className="flex flex-col items-left gap-2">
                  <FormControl>
                    <Input
                      placeholder="1"
                      type="number"
                      className="w-16 text-center"
                      {...field}
                      value={field.value ?? '1'}
                      onChange={(e) => {
                        form.setValue(field.name, parseInt(e.target.value))
                      }}
                    />
                  </FormControl>
                  <FormLabel className="text-sm">Movement</FormLabel>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="accuracy"
            render={({ field }) => (
              <FormItem>
                <div className="flex flex-col items-left gap-2">
                  <FormControl>
                    <Input
                      placeholder="0"
                      type="number"
                      className="w-16 text-center"
                      {...field}
                      value={field.value ?? '0'}
                      onChange={(e) => {
                        form.setValue(field.name, parseInt(e.target.value))
                      }}
                    />
                  </FormControl>
                  <FormLabel className="text-sm">Accuracy</FormLabel>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="strength"
            render={({ field }) => (
              <FormItem>
                <div className="flex flex-col items-left gap-2">
                  <FormControl>
                    <Input
                      placeholder="0"
                      type="number"
                      className="w-16 text-center"
                      {...field}
                      value={field.value ?? '0'}
                      onChange={(e) => {
                        form.setValue(field.name, parseInt(e.target.value))
                      }}
                    />
                  </FormControl>
                  <FormLabel className="text-sm">Strength</FormLabel>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="evasion"
            render={({ field }) => (
              <FormItem>
                <div className="flex flex-col items-left gap-2">
                  <FormControl>
                    <Input
                      placeholder="0"
                      type="number"
                      className="w-16 text-center"
                      {...field}
                      value={field.value ?? '0'}
                      onChange={(e) => {
                        form.setValue(field.name, parseInt(e.target.value))
                      }}
                    />
                  </FormControl>
                  <FormLabel className="text-sm">Evasion</FormLabel>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="luck"
            render={({ field }) => (
              <FormItem>
                <div className="flex flex-col items-left gap-2">
                  <FormControl>
                    <Input
                      placeholder="0"
                      type="number"
                      className="w-16 text-center"
                      {...field}
                      value={field.value ?? '0'}
                      onChange={(e) => {
                        form.setValue(field.name, parseInt(e.target.value))
                      }}
                    />
                  </FormControl>
                  <FormLabel className="text-sm">Luck</FormLabel>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="speed"
            render={({ field }) => (
              <FormItem>
                <div className="flex flex-col items-left gap-2">
                  <FormControl>
                    <Input
                      placeholder="0"
                      type="number"
                      className="w-16 text-center"
                      {...field}
                      value={field.value ?? '0'}
                      onChange={(e) => {
                        form.setValue(field.name, parseInt(e.target.value))
                      }}
                    />
                  </FormControl>
                  <FormLabel className="text-sm">Speed</FormLabel>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {isArcCampaign && (
            <FormField
              control={form.control}
              name="lumi"
              render={({ field }) => (
                <FormItem>
                  <div className="flex flex-col items-left gap-2">
                    <FormControl>
                      <Input
                        placeholder="0"
                        type="number"
                        className="w-16 text-center"
                        {...field}
                        value={field.value ?? '0'}
                        onChange={(e) => {
                          form.setValue(field.name, parseInt(e.target.value))
                        }}
                      />
                    </FormControl>
                    <FormLabel className="text-sm">Lumi</FormLabel>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>
      </CardContent>
    </Card>
  )
}
