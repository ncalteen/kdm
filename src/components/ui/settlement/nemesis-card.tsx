import { SettlementSchema } from '@/schemas/settlement'
import { PlusCircleIcon, XIcon } from 'lucide-react'
import { useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '../button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '../card'
import { Checkbox } from '../checkbox'
import { FormControl, FormField, FormItem, FormLabel } from '../form'
import { Input } from '../input'

export function NemesisCard(
  form: UseFormReturn<z.infer<typeof SettlementSchema>>
) {
  const nemeses = form.watch('nemesis') || []
  const [newNemesisName, setNewNemesisName] = useState('')

  const handleAddNemesis = () => {
    if (newNemesisName && !nemeses.some((n) => n.name === newNemesisName)) {
      const newNemesis = {
        name: newNemesisName,
        level1: false,
        level2: false,
        level3: false
      }
      const updatedNemeses = [...nemeses, newNemesis]
      form.setValue('nemesis', updatedNemeses)
      setNewNemesisName('')
    }
  }

  const handleRemoveNemesis = (nemesisName: string) => {
    const updatedNemeses = nemeses.filter((n) => n.name !== nemesisName)
    form.setValue('nemesis', updatedNemeses)
  }

  const handleToggleLevel = (
    nemesisName: string,
    level: 'level1' | 'level2' | 'level3',
    checked: boolean
  ) => {
    const updatedNemeses = nemeses.map((n) => {
      if (n.name === nemesisName) {
        return { ...n, [level]: checked }
      }
      return n
    })
    form.setValue('nemesis', updatedNemeses)
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-1">
          Nemesis
        </CardTitle>
        <CardDescription>
          The nemesis monsters your settlement can encounter.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0 pb-2">
        <div className="space-y-2">
          {nemeses.map((nemesis) => (
            <div key={nemesis.name} className="flex items-center gap-2">
              <FormField
                control={form.control}
                name="nemesis"
                render={() => (
                  <FormItem className="flex-shrink-0">
                    <FormLabel className="text-sm font-medium mr-2">
                      {nemesis.name}
                    </FormLabel>
                  </FormItem>
                )}
              />

              <div className="flex items-center gap-2 ml-auto">
                <FormField
                  control={form.control}
                  name="nemesis"
                  render={() => (
                    <FormItem className="flex items-center space-x-1 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={nemesis.level1}
                          onCheckedChange={(checked) => {
                            if (checked !== 'indeterminate') {
                              handleToggleLevel(nemesis.name, 'level1', checked)
                            }
                          }}
                        />
                      </FormControl>
                      <FormLabel className="text-xs">Lvl 1</FormLabel>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="nemesis"
                  render={() => (
                    <FormItem className="flex items-center space-x-1 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={nemesis.level2}
                          onCheckedChange={(checked) => {
                            if (checked !== 'indeterminate') {
                              handleToggleLevel(nemesis.name, 'level2', checked)
                            }
                          }}
                        />
                      </FormControl>
                      <FormLabel className="text-xs">Lvl 2</FormLabel>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="nemesis"
                  render={() => (
                    <FormItem className="flex items-center space-x-1 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={nemesis.level3}
                          onCheckedChange={(checked) => {
                            if (checked !== 'indeterminate') {
                              handleToggleLevel(nemesis.name, 'level3', checked)
                            }
                          }}
                        />
                      </FormControl>
                      <FormLabel className="text-xs">Lvl 3</FormLabel>
                    </FormItem>
                  )}
                />

                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => handleRemoveNemesis(nemesis.name)}>
                  <XIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}

          <div className="pt-2 flex items-center gap-2">
            <Input
              placeholder="Add a nemesis..."
              value={newNemesisName}
              onChange={(e) => setNewNemesisName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleAddNemesis()
                }
              }}
              className="flex-1"
            />
            <Button type="button" size="sm" onClick={handleAddNemesis}>
              <PlusCircleIcon className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
