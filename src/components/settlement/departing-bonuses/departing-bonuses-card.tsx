'use client'

import {
  DepartingBonusItem,
  NewDepartingBonusItem
} from '@/components/settlement/departing-bonuses/departing-bonus-item'
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
import { MapPinIcon, PlusCircleIcon } from 'lucide-react'
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
 * Departing Bonuses Card Component
 */
export function DepartingBonusesCard(form: UseFormReturn<Settlement>) {
  const bonuses = useMemo(() => form.watch('departingBonuses') || [], [form])

  const [disabledInputs, setDisabledInputs] = useState<{
    [key: number]: boolean
  }>({})
  const [isAddingNew, setIsAddingNew] = useState(false)

  const addBonus = useCallback(() => setIsAddingNew(true), [])

  useEffect(() => {
    setDisabledInputs((prev) => {
      const next: { [key: number]: boolean } = {}

      bonuses.forEach((_, i) => {
        next[i] = prev[i] ?? true
      })

      return next
    })
  }, [bonuses])

  /**
   * Handles the removal of a departing bonus.
   *
   * @param index Departing Bonus Index
   */
  const handleRemoveBonus = useCallback(
    (index: number) => {
      startTransition(() => {
        const updatedBonuses = [...bonuses]
        updatedBonuses.splice(index, 1)

        form.setValue('departingBonuses', updatedBonuses)

        setDisabledInputs((prev) => {
          const next = { ...prev }
          delete next[index]

          // Reindex
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

          campaign.settlements[settlementIndex].departingBonuses =
            updatedBonuses
          localStorage.setItem('campaign', JSON.stringify(campaign))
          toast.success('A blessing has faded into the void.')
        } catch (error) {
          console.error('Departing Bonus Remove Error:', error)
          toast.error('Failed to remove the blessing. Please try again.')
        }
      })
    },
    [bonuses, form]
  )

  /**
   * Handles the saving of a departing bonus.
   *
   * @param index Departing Bonus Index
   */
  const handleSave = useCallback(
    (index: number) => {
      if (!bonuses[index] || bonuses[index].trim() === '')
        return toast.warning('Cannot inscribe a nameless blessing.')

      setDisabledInputs((prev) => ({ ...prev, [index]: true }))

      // Update localStorage
      try {
        const formValues = form.getValues()
        const campaign = getCampaign()
        const settlementIndex = campaign.settlements.findIndex(
          (s) => s.id === formValues.id
        )

        campaign.settlements[settlementIndex].departingBonuses =
          formValues.departingBonuses
        localStorage.setItem('campaign', JSON.stringify(campaign))
        toast.success('Blessing etched into reality.')
      } catch (error) {
        console.error('Departing Bonus Save Error:', error)
        toast.error('Failed to save the blessing. Please try again.')
      }
    },
    [bonuses, form]
  )

  const handleEdit = useCallback(
    (index: number) =>
      setDisabledInputs((prev) => ({ ...prev, [index]: false })),
    []
  )

  const handleChange = useCallback(
    (index: number, value: string) => {
      const updatedBonuses = [...bonuses]

      updatedBonuses[index] = value

      form.setValue('departingBonuses', updatedBonuses)
    },
    [bonuses, form]
  )

  /**
   * Handles the addition of a new departing bonus.
   *
   * @param bonus New Departing Bonus
   */
  const saveNewBonus = useCallback(
    (bonus: string) => {
      startTransition(() => {
        const updatedBonuses = [...bonuses, bonus]

        form.setValue('departingBonuses', updatedBonuses)

        setDisabledInputs((prev) => ({
          ...prev,
          [updatedBonuses.length - 1]: true
        }))

        setIsAddingNew(false)

        // Update localStorage
        try {
          const formValues = form.getValues()
          const campaign = getCampaign()
          const settlementIndex = campaign.settlements.findIndex(
            (s) => s.id === formValues.id
          )

          campaign.settlements[settlementIndex].departingBonuses =
            updatedBonuses
          localStorage.setItem('campaign', JSON.stringify(campaign))
          toast.success('A new blessing graces your settlement.')
        } catch (error) {
          console.error('New Departing Bonus Save Error:', error)
          toast.error('Failed to save the new blessing. Please try again.')
        }
      })
    },
    [bonuses, form]
  )

  const cancelNewBonus = useCallback(() => setIsAddingNew(false), [])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  /**
   * Handles the drag end event for the sortable list.
   *
   * @param event Event
   */
  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event

      if (over && active.id !== over.id) {
        requestAnimationFrame(() => {
          const oldIndex = parseInt(active.id.toString())
          const newIndex = parseInt(over.id.toString())
          const newOrder = arrayMove(bonuses, oldIndex, newIndex)

          form.setValue('departingBonuses', newOrder)

          // Update localStorage
          try {
            const formValues = form.getValues()
            const campaign = getCampaign()
            const settlementIndex = campaign.settlements.findIndex(
              (s) => s.id === formValues.id
            )

            campaign.settlements[settlementIndex].departingBonuses = newOrder
            localStorage.setItem('campaign', JSON.stringify(campaign))
          } catch (error) {
            console.error('Departing Bonus Drag Error:', error)
          }
        })
      }
    },
    [bonuses, form]
  )

  return (
    <Card className="mt-2">
      <CardHeader className="pb-2">
        <CardTitle className="text-md flex items-center gap-1">
          <MapPinIcon className="h-4 w-4" />
          Departing Survivor Bonuses
        </CardTitle>
        <CardDescription className="text-left text-xs">
          Departing survivors gain these bonuses.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0 pb-2">
        <div className="space-y-2">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}>
            <SortableContext
              items={bonuses.map((_, index) => index.toString())}
              strategy={verticalListSortingStrategy}>
              {bonuses.map((bonus, index) => (
                <DepartingBonusItem
                  key={index}
                  index={index}
                  value={bonus}
                  isDisabled={!!disabledInputs[index]}
                  onSave={handleSave}
                  onEdit={handleEdit}
                  onRemove={handleRemoveBonus}
                  onChange={handleChange}
                />
              ))}
            </SortableContext>
          </DndContext>
          {isAddingNew && (
            <NewDepartingBonusItem
              onSave={saveNewBonus}
              onCancel={cancelNewBonus}
            />
          )}
          <div className="pt-2 flex justify-center">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={addBonus}
              disabled={isAddingNew}>
              <PlusCircleIcon className="h-4 w-4 mr-1" />
              Add Bonus
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
