import {
  MonsterVolumeItem,
  NewMonsterVolumeItem
} from '@/components/settlement/monster-volumes/monster-volume-item'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getCampaign } from '@/lib/utils'
import { SettlementSchema } from '@/schemas/settlement'
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy
} from '@dnd-kit/sortable'
import { BookOpenIcon, PlusCircleIcon } from 'lucide-react'
import { startTransition, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

/**
 * Monster Volumes Card Component
 */
export function MonsterVolumesCard(
  form: UseFormReturn<z.infer<typeof SettlementSchema>>
) {
  const [showNewVolumeForm, setShowNewVolumeForm] = useState(false)
  const [editingVolume, setEditingVolume] = useState<string | null>(null)
  const monsterVolumes = form.watch('monsterVolumes') || []
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  const handleRemoveVolume = (volume: string) => {
    startTransition(() => {
      const updatedVolumes = monsterVolumes.filter((v) => v !== volume)
      form.setValue('monsterVolumes', updatedVolumes)

      // Update localStorage
      try {
        const formValues = form.getValues()
        const campaign = getCampaign()
        const settlementIndex = campaign.settlements.findIndex(
          (s) => s.id === formValues.id
        )

        campaign.settlements[settlementIndex].monsterVolumes = updatedVolumes
        localStorage.setItem('campaign', JSON.stringify(campaign))

        toast.success('Monster volume removed!')
      } catch (error) {
        console.error('Error saving monster volumes to localStorage:', error)
      }
    })
  }

  const handleUpdateVolume = (oldVolume: string, newVolume: string) => {
    if (newVolume.trim() === '')
      return toast.warning('Cannot save a monster volume without a name')

    if (monsterVolumes.some((v) => v === newVolume.trim() && v !== oldVolume))
      return toast.warning('A monster volume with this name already exists')

    startTransition(() => {
      const updatedVolumes = monsterVolumes.map((v) =>
        v === oldVolume ? newVolume.trim() : v
      )

      form.setValue('monsterVolumes', updatedVolumes)
      setEditingVolume(null)

      // Update localStorage
      try {
        const formValues = form.getValues()
        const campaign = getCampaign()
        const settlementIndex = campaign.settlements.findIndex(
          (s) => s.id === formValues.id
        )

        campaign.settlements[settlementIndex].monsterVolumes = updatedVolumes
        localStorage.setItem('campaign', JSON.stringify(campaign))

        toast.success('Monster volume saved!')
      } catch (error) {
        console.error('Error saving monster volumes to localStorage:', error)
      }
    })
  }

  const addNewVolume = () => setShowNewVolumeForm(false)

  return (
    <Card className="mt-2">
      <CardHeader className="pb-2">
        <CardTitle className="text-md flex items-center gap-1">
          <BookOpenIcon className="h-4 w-4" /> Monster Volumes
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 pb-2">
        <div className="space-y-2">
          {monsterVolumes.length > 0 && (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={(event) => {
                const { active, over } = event
                if (over && active.id !== over.id) {
                  const oldIndex = monsterVolumes.indexOf(active.id as string)
                  const newIndex = monsterVolumes.indexOf(over.id as string)
                  const newOrder = arrayMove(monsterVolumes, oldIndex, newIndex)
                  form.setValue('monsterVolumes', newOrder)

                  // Update localStorage
                  try {
                    const formValues = form.getValues()
                    const campaign = getCampaign()
                    const settlementIndex = campaign.settlements.findIndex(
                      (s) => s.id === formValues.id
                    )

                    campaign.settlements[settlementIndex].monsterVolumes =
                      newOrder
                    localStorage.setItem('campaign', JSON.stringify(campaign))
                  } catch (error) {
                    console.error(
                      'Error saving monster volumes to localStorage:',
                      error
                    )
                  }
                }
              }}>
              <SortableContext
                items={monsterVolumes}
                strategy={verticalListSortingStrategy}>
                {monsterVolumes.map((volume) => (
                  <MonsterVolumeItem
                    key={volume}
                    id={volume}
                    volume={volume}
                    handleRemoveVolume={handleRemoveVolume}
                    isEditing={editingVolume === volume}
                    onEdit={() => setEditingVolume(volume)}
                    onSaveEdit={(name) => handleUpdateVolume(volume, name)}
                    onCancelEdit={() => setEditingVolume(null)}
                  />
                ))}
              </SortableContext>
            </DndContext>
          )}

          {showNewVolumeForm && (
            <NewMonsterVolumeItem
              form={form}
              onAdd={addNewVolume}
              existingNames={monsterVolumes}
            />
          )}

          <div className="pt-2 flex justify-center">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => setShowNewVolumeForm(true)}
              disabled={showNewVolumeForm || editingVolume !== null}>
              <PlusCircleIcon className="h-4 w-4 mr-1" />
              Add Monster Volume
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
