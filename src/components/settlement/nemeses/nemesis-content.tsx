'use client'

import {
  NemesisItem,
  NewNemesisItem
} from '@/components/settlement/nemeses/nemesis-item'
import { Button } from '@/components/ui/button'
import { Nemesis } from '@/lib/types'
import { getCampaign } from '@/lib/utils'
import { SettlementSchema } from '@/schemas/settlement'
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
import { z } from 'zod'

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
  }: {
    nemeses: Nemesis[]
    disabledInputs: { [key: string]: boolean }
    isAddingNew: boolean
    sensors: SensorDescriptor<object>[]
    handleToggleLevel: (
      nemesisName: string,
      level: 'level1' | 'level2' | 'level3',
      checked: boolean
    ) => void
    handleRemoveNemesis: (nemesisName: string) => void
    saveNemesis: (nemesisName: string) => void
    editNemesis: (nemesisName: string) => void
    addNemesis: () => void
    handleDragEnd: (event: DragEndEvent) => void
    form: UseFormReturn<z.infer<typeof SettlementSchema>>
    toggleUnlocked: (nemesisName: string, checked: boolean) => void
    setDisabledInputs: React.Dispatch<
      React.SetStateAction<{ [key: string]: boolean }>
    >
    setIsAddingNew: React.Dispatch<React.SetStateAction<boolean>>
    updateNemesisName: (originalName: string, newName: string) => void
  }) => {
    const saveNewNemesis = useCallback(
      (name: string) => {
        // Check if a nemesis with this name already exists
        if (nemeses.some((n) => n.name === name)) {
          toast.warning('A nemesis with this name already exists')
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

            toast.success('New nemesis added!')
          } catch (error) {
            console.error('Error saving nemeses to localStorage:', error)
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
