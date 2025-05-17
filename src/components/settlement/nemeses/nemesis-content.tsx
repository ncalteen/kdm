'use client'

import {
  NemesisItem,
  NewNemesisItem
} from '@/components/settlement/nemeses/nemesis-item'
import { Button } from '@/components/ui/button'
import { getCampaign } from '@/lib/utils'
import { Nemesis, Settlement } from '@/schemas/settlement'
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  SensorDescriptor
} from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { PlusCircleIcon } from 'lucide-react'
import { memo, useCallback } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'

/**
 * Nemesis Content Component Properties
 */
export interface NemesisContentProps {
  /** Add Nemesis */
  addNemesis: () => void
  /** Disabled Inputs */
  disabledInputs: { [key: string]: boolean }
  /** Edit Nemesis */
  editNemesis: (nemesisName: string) => void
  /** Form */
  form: UseFormReturn<Settlement>
  /** Handle Drag End */
  handleDragEnd: (event: DragEndEvent) => void
  /** Handle Toggle Level */
  handleToggleLevel: (
    nemesisName: string,
    level: 'level1' | 'level2' | 'level3',
    checked: boolean
  ) => void
  /** Handle Remove Nemesis */
  handleRemoveNemesis: (nemesisName: string) => void
  /** Is Adding New Nemesis */
  isAddingNew: boolean
  /** Nemesis List */
  nemeses: Nemesis[]
  /** Save Nemesis */
  saveNemesis: (nemesisName: string) => void
  /** Sensors for Drag and Drop */
  sensors: SensorDescriptor<object>[]
  /** Set Disabled Inputs */
  setDisabledInputs: React.Dispatch<
    React.SetStateAction<{ [key: string]: boolean }>
  >
  /** Set Is Adding New */
  setIsAddingNew: React.Dispatch<React.SetStateAction<boolean>>
  /** Toggle Unlocked */
  toggleUnlocked: (nemesisName: string, checked: boolean) => void
  /** Update Nemesis Name */
  updateNemesisName: (originalName: string, newName: string) => void
}

/**
 * Nemesis Content Component
 */
export const NemesisContent = memo(
  ({
    nemeses,
    disabledInputs,
    isAddingNew,
    sensors,
    handleToggleLevel,
    handleRemoveNemesis,
    saveNemesis,
    editNemesis,
    addNemesis,
    handleDragEnd,
    form,
    toggleUnlocked,
    setDisabledInputs,
    setIsAddingNew,
    updateNemesisName
  }: NemesisContentProps) => {
    const saveNewNemesis = useCallback(
      (name: string) => {
        // Check if a nemesis with this name already exists
        if (nemeses.some((n) => n.name === name)) {
          toast.warning('This nemesis already stalks your settlement.')
          return false
        }

        // Add the new nemesis to the list with deferred execution
        requestAnimationFrame(() => {
          const newNemesis = {
            name,
            unlocked: false,
            level1: false,
            level2: false,
            level3: false,
            ccLevel1: false,
            ccLevel2: false,
            ccLevel3: false
          }
          const updatedNemeses = [...nemeses, newNemesis]
          form.setValue('nemeses', updatedNemeses)

          // Mark the new nemesis as disabled immediately to prevent duplicates
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

            campaign.settlements[settlementIndex].nemeses = updatedNemeses
            localStorage.setItem('campaign', JSON.stringify(campaign))
            toast.success('A new nemesis emerges from the shadows.')
          } catch (error) {
            console.error('New Nemesis Save Error:', error)
            toast.error('Failed to save the new nemesis. Please try again.')
          }
        })

        return true
      },
      [nemeses, form, setDisabledInputs, setIsAddingNew]
    )

    return (
      <div className="space-y-2">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}>
          <SortableContext
            items={nemeses.map((n) => n.name)}
            strategy={verticalListSortingStrategy}>
            {nemeses.map((nemesis) =>
              nemesis.name ? (
                <NemesisItem
                  key={nemesis.name}
                  id={nemesis.name}
                  nemesis={nemesis}
                  handleToggleLevel={handleToggleLevel}
                  toggleUnlocked={toggleUnlocked}
                  handleRemoveNemesis={handleRemoveNemesis}
                  isDisabled={!!disabledInputs[nemesis.name]}
                  onSave={saveNemesis}
                  onEdit={editNemesis}
                  updateNemesisName={updateNemesisName}
                />
              ) : null
            )}
          </SortableContext>
        </DndContext>

        {isAddingNew && (
          <NewNemesisItem
            index={nemeses.length}
            form={form}
            handleRemoveNemesis={handleRemoveNemesis}
            onSave={saveNewNemesis}
          />
        )}

        <div className="pt-2 flex justify-center">
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={addNemesis}
            disabled={isAddingNew}>
            <PlusCircleIcon className="h-4 w-4 mr-1" />
            Add Nemesis
          </Button>
        </div>
      </div>
    )
  }
)

NemesisContent.displayName = 'NemesisContent'
