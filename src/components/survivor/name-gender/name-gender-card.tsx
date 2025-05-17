'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Gender } from '@/lib/enums'
import { Survivor } from '@/schemas/survivor'
import { ReactElement } from 'react'
import { UseFormReturn } from 'react-hook-form'

/**
 * Survivor Name and Gender Card Component
 *
 * This component allows the user to set the name and gender of a survivor. The
 * form includes a text input for the name and checkboxes for male/female gender
 * selection. When a survivor is named, they gain +1 survival.
 *
 * @param form Form
 * @returns Name and Gender Card Component
 */
export function NameGenderCard(form: UseFormReturn<Survivor>): ReactElement {
  return (
    <Card>
      <CardContent className="pt-2 pb-2">
        <div className="flex flex-col">
          <div className="flex items-center">
            {/* Survivor Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <div className="flex items-center gap-4">
                    <FormLabel className="font-bold text-left text-l">
                      Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Survivor name..."
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

            {/* Gender */}
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
                        onCheckedChange={(checked) => {
                          if (checked) form.setValue('gender', Gender.MALE)
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
                        onCheckedChange={(checked) => {
                          if (checked) form.setValue('gender', Gender.FEMALE)
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

          <FormDescription className="mt-2 text-xs">
            When you name your survivor, gain +1 <strong>survival</strong>.
          </FormDescription>
        </div>
      </CardContent>
    </Card>
  )
}
