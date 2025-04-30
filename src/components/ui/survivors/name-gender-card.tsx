'use client'

import { Gender } from '@/lib/enums'
import { SurvivorSchema } from '@/schemas/survivor'
import { UseFormReturn } from 'react-hook-form'
import { z } from 'zod'
import { Card, CardContent } from '../card'
import { Checkbox } from '../checkbox'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '../form'
import { Input } from '../input'

export function NameGenderCard(
  form: UseFormReturn<z.infer<typeof SurvivorSchema>>
) {
  return (
    <Card>
      <CardContent className="pt-2 pb-2">
        <div className="flex flex-col">
          <div className="flex items-center">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <div className="flex items-center gap-4">
                    <FormLabel className="text-left text-xl">Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Survivor Name"
                        {...field}
                        value={field.value ?? ''}
                        onChange={(e) => {
                          form.setValue(field.name, e.target.value)
                        }}
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem className="ml-6">
                  <div className="flex items-center space-x-1">
                    <div className="flex items-center space-x-1">
                      <label
                        htmlFor="male-checkbox"
                        className="text-sm font-medium leading-none cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        M
                      </label>
                      <Checkbox
                        id="male-checkbox"
                        checked={field.value === Gender.MALE}
                        onCheckedChange={() => {
                          form.setValue('gender', Gender.MALE)
                        }}
                      />
                    </div>
                    <div className="flex items-center space-x-1">
                      <label
                        htmlFor="female-checkbox"
                        className="text-sm font-medium leading-none cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        F
                      </label>
                      <Checkbox
                        id="female-checkbox"
                        checked={field.value === Gender.FEMALE}
                        onCheckedChange={() => {
                          form.setValue('gender', Gender.FEMALE)
                        }}
                      />
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <hr className="mt-2" />

          <FormDescription className="mt-2">
            When you name your survivor, gain +1 <strong>survival</strong>.
          </FormDescription>
        </div>
      </CardContent>
    </Card>
  )
}
