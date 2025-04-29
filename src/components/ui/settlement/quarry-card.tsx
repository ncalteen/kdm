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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../select'

export function QuarryCard(
  form: UseFormReturn<z.infer<typeof SettlementSchema>>
) {
  const quarries = form.watch('quarries') || []
  const [newQuarryName, setNewQuarryName] = useState('')
  const [newQuarryNode, setNewQuarryNode] = useState('Node 1')

  const handleAddQuarry = () => {
    if (newQuarryName && !quarries.some((q) => q.name === newQuarryName)) {
      const newQuarry = {
        name: newQuarryName,
        completed: false,
        node: newQuarryNode as 'Node 1' | 'Node 2' | 'Node 3' | 'Node 4'
      }
      const updatedQuarries = [...quarries, newQuarry]
      form.setValue('quarries', updatedQuarries)
      setNewQuarryName('')
      setNewQuarryNode('Node 1')
    }
  }

  const handleRemoveQuarry = (quarryName: string) => {
    const updatedQuarries = quarries.filter((q) => q.name !== quarryName)
    form.setValue('quarries', updatedQuarries)
  }

  const handleToggleCompleted = (quarryName: string, completed: boolean) => {
    const updatedQuarries = quarries.map((q) => {
      if (q.name === quarryName) {
        return { ...q, completed }
      }
      return q
    })
    form.setValue('quarries', updatedQuarries)
  }

  const updateQuarryNode = (quarryName: string, node: string) => {
    const updatedQuarries = quarries.map((q) => {
      if (q.name === quarryName) {
        return {
          ...q,
          node: node as 'Node 1' | 'Node 2' | 'Node 3' | 'Node 4'
        }
      }
      return q
    })
    form.setValue('quarries', updatedQuarries)
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-1">
          Quarries
        </CardTitle>
        <CardDescription>
          The monsters your settlement can select to hunt.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0 pb-2">
        <div className="space-y-2">
          {quarries.map((quarry) => (
            <div key={quarry.name} className="flex items-center gap-2">
              <FormField
                control={form.control}
                name="quarries"
                render={() => (
                  <FormItem className="flex items-center space-x-2 flex-shrink-0">
                    <FormControl>
                      <Checkbox
                        checked={quarry.completed}
                        className="mt-2"
                        onCheckedChange={(checked) => {
                          if (checked !== 'indeterminate') {
                            handleToggleCompleted(quarry.name, checked)
                          }
                        }}
                      />
                    </FormControl>
                    <FormLabel className="text-sm font-medium">
                      {quarry.name}
                    </FormLabel>
                  </FormItem>
                )}
              />

              <div className="flex items-center gap-2 ml-auto">
                <Select
                  value={quarry.node}
                  onValueChange={(value) =>
                    updateQuarryNode(quarry.name, value)
                  }>
                  <SelectTrigger className="h-8 w-24">
                    <SelectValue placeholder={quarry.node} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Node 1">Node 1</SelectItem>
                    <SelectItem value="Node 2">Node 2</SelectItem>
                    <SelectItem value="Node 3">Node 3</SelectItem>
                    <SelectItem value="Node 4">Node 4</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => handleRemoveQuarry(quarry.name)}>
                  <XIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}

          <div className="pt-2 flex items-center gap-2">
            <Input
              placeholder="Add a quarry..."
              value={newQuarryName}
              onChange={(e) => setNewQuarryName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleAddQuarry()
                }
              }}
              className="flex-1"
            />
            <Select value={newQuarryNode} onValueChange={setNewQuarryNode}>
              <SelectTrigger className="w-24">
                <SelectValue placeholder="Node" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Node 1">Node 1</SelectItem>
                <SelectItem value="Node 2">Node 2</SelectItem>
                <SelectItem value="Node 3">Node 3</SelectItem>
                <SelectItem value="Node 4">Node 4</SelectItem>
              </SelectContent>
            </Select>
            <Button type="button" size="sm" onClick={handleAddQuarry}>
              <PlusCircleIcon className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
