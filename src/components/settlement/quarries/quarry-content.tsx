'use client'

import {
  NewQuarryItem,
  QuarryItem
} from '@/components/settlement/quarries/quarry-item'
import { Button } from '@/components/ui/button'
import { getCampaign } from '@/lib/utils'
import { Quarry, Settlement } from '@/schemas/settlement'
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

/**
 * Quarry Content Properties
 */
export interface QuarryContentProps {
  /** Add Quarry Function */
  addQuarry: () => void
  /** Disabled Inputs */
  disabledInputs: { [key: string]: boolean }
  /** Edit Quarry Function */
  editQuarry: (quarryName: string) => void
  /** Form */
  form: UseFormReturn<Settlement>
  /** Handle Drag End Function */
  handleDragEnd: (event: DragEndEvent) => void
  /** Remove Quarry Function */
  handleRemoveQuarry: (quarryName: string) => void
  /** Adding New Quarry Status */
  isAddingNew: boolean
  /** Quarries */
  quarries: Quarry[]
  /** Save Quarry Function */
  saveQuarry: (quarryName: string) => void
  /** Drag and Drop Sensors */
  sensors: SensorDescriptor<object>[]
  /** Set Disabled Inputs */
  setDisabledInputs: React.Dispatch<
    React.SetStateAction<{ [key: string]: boolean }>
  >
  /** Set Is Adding New */
  setIsAddingNew: React.Dispatch<React.SetStateAction<boolean>>
  /** Toggle Quarry Unlocked Function */
  toggleQuarryUnlocked?: (quarryName: string, unlocked: boolean) => void
  /** Update Quarry Name Function */
  updateQuarryName: (originalName: string, newName: string) => void
  /** Update Quarry Node Function */
  updateQuarryNode: (quarryName: string, node: string) => void
}

/**
 * Quarry Content Component
 *
 * @param props Component Properties
 */
export const QuarryContent = memo(
  ({
    addQuarry,
    disabledInputs,
    editQuarry,
    form,
    handleDragEnd,
    handleRemoveQuarry,
    isAddingNew,
    quarries,
    saveQuarry,
    sensors,
    setDisabledInputs,
    setIsAddingNew,
    toggleQuarryUnlocked,
    updateQuarryName,
    updateQuarryNode
  }: QuarryContentProps) => {
    const saveNewQuarry = useCallback(
      (name: string, node: string, unlocked: boolean) => {
        if (quarries.some((q) => q.name === name)) {
          toast.warning('This beast already lurks in the darkness.')
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

          // Update localStorage
          try {
            const formValues = form.getValues()
            const campaign = getCampaign()
            const settlementIndex = campaign.settlements.findIndex(
              (s) => s.id === formValues.id
            )

            campaign.settlements[settlementIndex].quarries = updatedQuarries
            localStorage.setItem('campaign', JSON.stringify(campaign))
            toast.success('A new horror prowls in the darkness.')
          } catch (error) {
            console.error('Quarry Save Error:', error)
            toast.error('The darkness refuses you. Please try again.')
          }
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
                toggleQuarryUnlocked={toggleQuarryUnlocked}
              />
            ))}
          </SortableContext>
        </DndContext>

        {isAddingNew && (
          <NewQuarryItem
            index={quarries.length}
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
