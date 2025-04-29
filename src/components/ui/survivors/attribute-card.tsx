import { SettlementType } from '@/lib/enums'
import { SurvivorSchema } from '@/schemas/survivor'
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
  form: UseFormReturn<z.infer<typeof SurvivorSchema>>
) {
  const settlementType = form.watch('settlementType')

  return (
    <Card className="mt-4">
      <CardContent className="pt-2 pb-2">
        <div className="flex flex-row flex-wrap gap-4">
          <FormField
            control={form.control}
            name="movement"
            render={({ field }) => (
              <FormItem>
                <div className="flex flex-col items-center gap-2">
                  <FormControl>
                    <Input
                      placeholder="1"
                      type="number"
                      className="w-12 text-center no-spinners"
                      {...field}
                      value={field.value ?? '1'}
                      onChange={(e) => {
                        form.setValue(field.name, parseInt(e.target.value))
                      }}
                    />
                  </FormControl>
                  <FormLabel className="text-xs">Movement</FormLabel>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="w-px bg-border"></div>

          <FormField
            control={form.control}
            name="accuracy"
            render={({ field }) => (
              <FormItem>
                <div className="flex flex-col items-center gap-2">
                  <FormControl>
                    <Input
                      placeholder="0"
                      type="number"
                      className="w-12 text-center no-spinners"
                      {...field}
                      value={field.value ?? '0'}
                      onChange={(e) => {
                        form.setValue(field.name, parseInt(e.target.value))
                      }}
                    />
                  </FormControl>
                  <FormLabel className="text-xs">Accuracy</FormLabel>
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
                <div className="flex flex-col items-center gap-2">
                  <FormControl>
                    <Input
                      placeholder="0"
                      type="number"
                      className="w-12 text-center no-spinners"
                      {...field}
                      value={field.value ?? '0'}
                      onChange={(e) => {
                        form.setValue(field.name, parseInt(e.target.value))
                      }}
                    />
                  </FormControl>
                  <FormLabel className="text-xs">Strength</FormLabel>
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
                <div className="flex flex-col items-center gap-2">
                  <FormControl>
                    <Input
                      placeholder="0"
                      type="number"
                      className="w-12 text-center no-spinners"
                      {...field}
                      value={field.value ?? '0'}
                      onChange={(e) => {
                        form.setValue(field.name, parseInt(e.target.value))
                      }}
                    />
                  </FormControl>
                  <FormLabel className="text-xs">Evasion</FormLabel>
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
                <div className="flex flex-col items-center gap-2">
                  <FormControl>
                    <Input
                      placeholder="0"
                      type="number"
                      className="w-12 text-center no-spinners"
                      {...field}
                      value={field.value ?? '0'}
                      onChange={(e) => {
                        form.setValue(field.name, parseInt(e.target.value))
                      }}
                    />
                  </FormControl>
                  <FormLabel className="text-xs">Luck</FormLabel>
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
                <div className="flex flex-col items-center gap-2">
                  <FormControl>
                    <Input
                      placeholder="0"
                      type="number"
                      className="w-12 text-center no-spinners"
                      {...field}
                      value={field.value ?? '0'}
                      onChange={(e) => {
                        form.setValue(field.name, parseInt(e.target.value))
                      }}
                    />
                  </FormControl>
                  <FormLabel className="text-xs">Speed</FormLabel>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {settlementType === SettlementType.ARC && (
            <>
              <div className="w-px bg-border"></div>
              <FormField
                control={form.control}
                name="lumi"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex flex-col items-center gap-2">
                      <FormControl>
                        <Input
                          placeholder="0"
                          type="number"
                          className="w-12 text-center no-spinners"
                          {...field}
                          value={field.value ?? '0'}
                          onChange={(e) => {
                            form.setValue(field.name, parseInt(e.target.value))
                          }}
                        />
                      </FormControl>
                      <FormLabel className="text-xs">Lumi</FormLabel>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
