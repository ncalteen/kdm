'use client'

import {
  MilestoneItem,
  NewMilestoneItem
} from '@/components/settlement/milestones/milestone-item'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { getCampaign } from '@/lib/utils'
import { Settlement } from '@/schemas/settlement'
import {
  closestCenter,
  DndContext,
  DragEndEvent,
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
import { CircleCheckBigIcon, PlusCircleIcon } from 'lucide-react'
import {
  startTransition,
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react'
import { UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'

/**
 * Milestones Card Component
 */
export function MilestonesCard(form: UseFormReturn<Settlement>) {
  const milestones = useMemo(() => form.watch('milestones') || [], [form])

  const [disabledInputs, setDisabledInputs] = useState<{
    [key: number]: boolean
  }>({})
  const [isAddingNew, setIsAddingNew] = useState<boolean>(false)

  useEffect(() => {
    setDisabledInputs((prev) => {
      const next: { [key: number]: boolean } = {}

      milestones.forEach((_, i) => {
        next[i] = prev[i] ?? true
      })

      return next
    })
  }, [milestones])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  const addMilestone = useCallback(() => setIsAddingNew(true), [])

  const saveNewMilestone = useCallback(
    (name: string, event: string) => {
      if (milestones.some((m) => m.name === name)) {
        toast.warning('This milestone already been recorded.')
        return false
      }

      startTransition(() => {
        const newMilestone = { name, complete: false, event }
        const updated = [...milestones, newMilestone]

        form.setValue('milestones', updated)
        setDisabledInputs((prev) => ({ ...prev, [updated.length - 1]: true }))
        setIsAddingNew(false)

        // Update localStorage
        try {
          const formValues = form.getValues()
          const campaign = getCampaign()
          const settlementIndex = campaign.settlements.findIndex(
            (s) => s.id === formValues.id
          )

          campaign.settlements[settlementIndex].milestones = updated
          localStorage.setItem('campaign', JSON.stringify(campaign))
          toast.success("New milestone added to the settlement's fate!")
        } catch (error) {
          console.error('New Milestone Save Error:', error)
        }
      })

      return true
    },
    [milestones, form]
  )

  const cancelNewMilestone = useCallback(() => setIsAddingNew(false), [])

  const handleRemoveMilestone = useCallback(
    (index: number) => {
      startTransition(() => {
        const updated = [...milestones]
        updated.splice(index, 1)

        form.setValue('milestones', updated)

        setDisabledInputs((prev) => {
          const next = { ...prev }
          delete next[index]
          const reindexed: { [key: number]: boolean } = {}

          Object.keys(next).forEach((k) => {
            const num = parseInt(k)
            if (num > index) reindexed[num - 1] = next[num]
            else if (num < index) reindexed[num] = next[num]
          })

          return reindexed
        })

        // Update localStorage
        try {
          const formValues = form.getValues()
          const campaign = getCampaign()
          const settlementIndex = campaign.settlements.findIndex(
            (s) => s.id === formValues.id
          )

          campaign.settlements[settlementIndex].milestones = updated
          localStorage.setItem('campaign', JSON.stringify(campaign))

          toast.success('Milestone fades into the void.')
        } catch (error) {
          console.error('Milestone Remove Error:', error)
          toast.error(
            'The shadows devour your words - your stories are lost. Please try again.'
          )
        }
      })
    },
    [milestones, form]
  )

  const handleEdit = useCallback((index: number) => {
    setDisabledInputs((prev) => ({ ...prev, [index]: false }))
  }, [])

  const handleSave = useCallback(
    (index: number, name: string, event: string) => {
      if (!name || name.trim() === '')
        return toast.warning('Cannot establish a nameless milestone.')

      startTransition(() => {
        const updated = [...milestones]
        updated[index] = { ...updated[index], name, event }

        form.setValue('milestones', updated)
        setDisabledInputs((prev) => ({ ...prev, [index]: true }))

        // Update localStorage
        try {
          const formValues = form.getValues()
          const campaign = getCampaign()
          const settlementIndex = campaign.settlements.findIndex(
            (s) => s.id === formValues.id
          )

          campaign.settlements[settlementIndex].milestones = updated
          localStorage.setItem('campaign', JSON.stringify(campaign))

          toast.success('Milestone reshaped!')
        } catch (error) {
          console.error('Milestone Save Error:', error)
          toast.error('Failed to save milestone. Please try again.')
        }
      })
    },
    [milestones, form]
  )

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event

      if (over && active.id !== over.id) {
        requestAnimationFrame(() => {
          const oldIndex = parseInt(active.id.toString())
          const newIndex = parseInt(over.id.toString())
          const newOrder = arrayMove(milestones, oldIndex, newIndex)

          form.setValue('milestones', newOrder)

          // Update localStorage
          try {
            const formValues = form.getValues()
            const campaign = getCampaign()
            const settlementIndex = campaign.settlements.findIndex(
              (s) => s.id === formValues.id
            )

            campaign.settlements[settlementIndex].milestones = newOrder
            localStorage.setItem('campaign', JSON.stringify(campaign))
          } catch (error) {
            console.error('Milestone Drag Error:', error)
          }
        })
      }
    },
    [milestones, form]
  )

  const handleMilestoneCompletionChange = useCallback(
    (index: number, checked: boolean) => {
      startTransition(() => {
        const updated = [...milestones]
        updated[index] = { ...updated[index], complete: checked }

        form.setValue('milestones', updated)

        // Update localStorage
        try {
          const formValues = form.getValues()
          const campaign = getCampaign()
          const settlementIndex = campaign.settlements.findIndex(
            (s) => s.id === formValues.id
          )

          campaign.settlements[settlementIndex].milestones = updated
          localStorage.setItem('campaign', JSON.stringify(campaign))

          toast.success(
            checked
              ? 'Milestone completed - make sure to complete the appropriate story event.'
              : 'Milestone updated.'
          )
        } catch (error) {
          console.error('Milestone Completion Error:', error)
          toast.error(
            'Failed to update milestone completion status. Please try again.'
          )
        }
      })
    },
    [milestones, form]
  )

  return (
    <Card className="mt-2">
      <CardHeader className="pb-2">
        <CardTitle className="text-md flex items-center gap-1">
          <CircleCheckBigIcon className="h-4 w-4" />
          Settlement Milestones
        </CardTitle>
        <CardDescription className="text-left text-xs">
          Trigger these effects when the milestone condition is met.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0 pb-2">
        <div className="space-y-2">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}>
            <SortableContext
              items={milestones.map((_, index) => index.toString())}
              strategy={verticalListSortingStrategy}>
              {milestones.map((milestone, index) => (
                <MilestoneItem
                  key={index}
                  id={index.toString()}
                  milestone={milestone}
                  index={index}
                  form={form}
                  isDisabled={!!disabledInputs[index]}
                  onSave={handleSave}
                  onEdit={handleEdit}
                  onRemove={handleRemoveMilestone}
                  onToggleComplete={handleMilestoneCompletionChange}
                />
              ))}
            </SortableContext>
          </DndContext>
          {isAddingNew && (
            <NewMilestoneItem
              index={milestones.length}
              onSave={saveNewMilestone}
              onCancel={cancelNewMilestone}
            />
          )}
          <div className="pt-2 flex justify-center">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={addMilestone}
              disabled={
                isAddingNew ||
                Object.values(disabledInputs).some((v) => v === false)
              }>
              <PlusCircleIcon className="h-4 w-4 mr-1" />
              Add Milestone
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
