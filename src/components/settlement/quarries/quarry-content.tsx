'use client'

import {
  NewQuarryItem,
  QuarryItem
} from '@/components/settlement/quarries/quarry-item'
import { Button } from '@/components/ui/button'
import { Quarry } from '@/lib/types'
import { SettlementSchema } from '@/schemas/settlement'
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  SensorDescriptor
} from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { PlusCircleIcon } from 'lucide-react'
import { memo, startTransition, useCallback } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

export const QuarryContent = memo(
  ({
    quarries,
    disabledInputs,
    isAddingNew,
    sensors,
    updateQuarryNode,
    handleRemoveQuarry,
    saveQuarry,
    editQuarry,
    updateQuarryName,
    addQuarry,
    handleDragEnd,
    form,
    setDisabledInputs,
    setIsAddingNew
  }: {
    quarries: Quarry[]
    disabledInputs: { [key: string]: boolean }
    isAddingNew: boolean
    sensors: SensorDescriptor<object>[]
    updateQuarryNode: (quarryName: string, node: string) => void
    handleRemoveQuarry: (quarryName: string) => void
    saveQuarry: (quarryName: string) => void
    editQuarry: (quarryName: string) => void
    updateQuarryName: (originalName: string, newName: string) => void
    addQuarry: () => void
    handleDragEnd: (event: DragEndEvent) => void
    form: UseFormReturn<z.infer<typeof SettlementSchema>>
    setDisabledInputs: React.Dispatch<
      React.SetStateAction<{ [key: string]: boolean }>
    >
    setIsAddingNew: React.Dispatch<React.SetStateAction<boolean>>
  }) => {
    const saveNewQuarry = useCallback(
      (name: string, node: string, unlocked: boolean) => {
        if (quarries.some((q) => q.name === name)) {
          toast.warning('A quarry with this name already exists')
          return false
        }

        startTransition(() => {
          const newQuarry = {
            name,
            unlocked,
            node: node as 'Node 1' | 'Node 2' | 'Node 3' | 'Node 4',
            ccPrologue: false,
            ccLevel1: false,
            ccLevel2: [false, false],
            ccLevel3: [false, false, false]
          }
          const updatedQuarries = [...quarries, newQuarry]
          form.setValue('quarries', updatedQuarries)

          // Mark the new quarry as disabled immediately to prevent duplicates
          setDisabledInputs((prev) => ({
            ...prev,
            [name]: true
          }))

          // Close the "add new" form
          setIsAddingNew(false)

          toast.success('New quarry added')
        })

        return true
      },
      [quarries, form, setDisabledInputs, setIsAddingNew]
    )

    return (
      <div className="space-y-2">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}>
          <SortableContext
            items={quarries.map((q) => q.name)}
            strategy={verticalListSortingStrategy}>
            {quarries.map((quarry) => (
              <QuarryItem
                key={quarry.name}
                id={quarry.name}
                quarry={quarry}
                updateQuarryNode={updateQuarryNode}
                handleRemoveQuarry={handleRemoveQuarry}
                isDisabled={!!disabledInputs[quarry.name]}
                onSave={saveQuarry}
                onEdit={editQuarry}
                updateQuarryName={updateQuarryName}
                form={form}
              />
            ))}
          </SortableContext>
        </DndContext>

        {isAddingNew && (
          <NewQuarryItem
            index={quarries.length}
            form={form}
            handleRemoveQuarry={handleRemoveQuarry}
            onSave={saveNewQuarry}
          />
        )}

        <div className="pt-2 flex justify-center">
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={addQuarry}
            disabled={isAddingNew}>
            <PlusCircleIcon className="h-4 w-4 mr-1" />
            Add Quarry
          </Button>
        </div>
      </div>
    )
  }
)

QuarryContent.displayName = 'QuarryContent'
