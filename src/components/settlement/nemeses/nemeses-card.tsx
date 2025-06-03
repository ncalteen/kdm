'use client'

import {
  NemesisItem,
  NewNemesisItem
} from '@/components/settlement/nemeses/nemesis-item'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { getCampaign, saveCampaignToLocalStorage } from '@/lib/utils'
import { Nemesis, Settlement, SettlementSchema } from '@/schemas/settlement'
import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors
} from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy
} from '@dnd-kit/sortable'
import { PlusIcon, SkullIcon } from 'lucide-react'
import {
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react'
import { UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'
import { ZodError } from 'zod'

/**
 * Nemeses Card Component
 */
export function NemesesCard({
  ...form
}: UseFormReturn<Settlement>): ReactElement {
  const watchedNemeses = form.watch('nemeses')
  const nemeses = useMemo(() => watchedNemeses || [], [watchedNemeses])

  const [disabledInputs, setDisabledInputs] = useState<{
    [key: number]: boolean
  }>({})
  const [isAddingNew, setIsAddingNew] = useState<boolean>(false)

  // Ref to store timeout ID for cleanup
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)
    }
  }, [])

  useEffect(() => {
    setDisabledInputs((prev) => {
      const next: { [key: number]: boolean } = {}

      nemeses.forEach((_, i) => {
        next[i] = prev[i] !== undefined ? prev[i] : true
      })

      return next
    })
  }, [nemeses])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  const addNemesis = () => setIsAddingNew(true)

  /**
   * Debounced save function to reduce localStorage operations
   *
   * @param updatedNemeses Updated Nemeses
   * @param successMsg Success Message
   * @param immediate Whether to save immediately without debouncing
   */
  const saveToLocalStorageDebounced = useCallback(
    (updatedNemeses: Nemesis[], successMsg?: string, immediate = false) => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }

      const doSave = () => {
        try {
          const formValues = form.getValues()
          const campaign = getCampaign()
          const settlementIndex = campaign.settlements.findIndex(
            (s: { id: number }) => s.id === formValues.id
          )

          if (settlementIndex !== -1) {
            try {
              SettlementSchema.shape.nemeses.parse(updatedNemeses)
            } catch (error) {
              if (error instanceof ZodError && error.errors[0]?.message)
                return toast.error(error.errors[0].message)
              else
                return toast.error(
                  'The darkness swallows your words. Please try again.'
                )
            }

            campaign.settlements[settlementIndex].nemeses = updatedNemeses
            saveCampaignToLocalStorage(campaign)

            if (successMsg) toast.success(successMsg)
          }
        } catch (error) {
          console.error('Nemesis Save Error:', error)
          toast.error('The darkness swallows your words. Please try again.')
        }
      }

      if (immediate) {
        doSave()
      } else {
        saveTimeoutRef.current = setTimeout(doSave, 300)
      }
    },
    [form]
  )

  /**
   * Handles the removal of a nemesis.
   *
   * @param index Nemesis Index
   */
  const onRemove = (index: number) => {
    const currentNemeses = [...nemeses]

    currentNemeses.splice(index, 1)
    form.setValue('nemeses', currentNemeses)

    setDisabledInputs((prev) => {
      const next: { [key: number]: boolean } = {}

      Object.keys(prev).forEach((k) => {
        const num = parseInt(k)
        if (num < index) next[num] = prev[num]
        else if (num > index) next[num - 1] = prev[num]
      })

      return next
    })

    saveToLocalStorageDebounced(
      currentNemeses,
      'The nemesis has returned to the darkness.',
      true // immediate save for removal
    )
  }

  /**
   * Handles saving a new nemesis.
   *
   * @param value Nemesis Name
   * @param unlocked Nemesis Unlocked Status
   * @param index Nemesis Index (When Updating Only)
   */
  const onSave = (value?: string, unlocked?: boolean, index?: number) => {
    if (!value || value.trim() === '')
      return toast.error('A nameless nemesis cannot be recorded.')

    const nemesisWithCc: Nemesis = {
      name: value,
      unlocked: unlocked || false,
      level1: false,
      level2: false,
      level3: false,
      ccLevel1: false,
      ccLevel2: false,
      ccLevel3: false
    }

    try {
      SettlementSchema.shape.nemeses.parse([nemesisWithCc])
    } catch (error) {
      if (error instanceof ZodError) return toast.error(error.errors[0].message)
      else
        return toast.error(
          'The darkness swallows your words. Please try again.'
        )
    }

    const updatedNemeses = [...nemeses]

    if (index !== undefined) {
      // Updating an existing value - preserve existing properties
      updatedNemeses[index] = {
        ...updatedNemeses[index],
        name: value,
        unlocked: unlocked || false
      }
      form.setValue(`nemeses.${index}`, updatedNemeses[index])

      setDisabledInputs((prev) => ({
        ...prev,
        [index]: true
      }))
    } else {
      // Adding a new value
      updatedNemeses.push(nemesisWithCc)

      form.setValue('nemeses', updatedNemeses)

      setDisabledInputs((prev) => ({
        ...prev,
        [updatedNemeses.length - 1]: true
      }))
    }

    saveToLocalStorageDebounced(
      updatedNemeses,
      index !== undefined
        ? 'The nemesis waits outside your settlement.'
        : 'A new nemesis emerges.',
      true // immediate save for create/update
    )
    setIsAddingNew(false)
  }

  /**
   * Enables editing a nemesis.
   *
   * @param index Nemesis Index
   */
  const onEdit = (index: number) =>
    setDisabledInputs((prev) => ({ ...prev, [index]: false }))

  /**
   * Handles toggling nemesis unlocked status.
   *
   * @param index Nemesis Index
   * @param unlocked Unlocked Status
   */
  const onToggleUnlocked = (index: number, unlocked: boolean) => {
    const updatedNemeses = nemeses.map((n, i) =>
      i === index ? { ...n, unlocked } : n
    )

    form.setValue('nemeses', updatedNemeses)

    saveToLocalStorageDebounced(
      updatedNemeses,
      `${nemeses[index]?.name} ${unlocked ? 'emerges, ready to accept your challenge.' : 'retreats into the darkness, beyond your reach.'}`
    )
  }

  /**
   * Handles toggling nemesis levels.
   *
   * @param index Nemesis Index
   * @param level Level to Toggle
   * @param checked Checked State
   */
  const onToggleLevel = (
    index: number,
    level:
      | 'level1'
      | 'level2'
      | 'level3'
      | 'ccLevel1'
      | 'ccLevel2'
      | 'ccLevel3',
    checked: boolean
  ) => {
    const updatedNemeses = nemeses.map((n, i) =>
      i === index ? { ...n, [level]: checked } : n
    )

    form.setValue('nemeses', updatedNemeses)
    saveToLocalStorageDebounced(updatedNemeses)
  }

  /**
   * Handles the end of a drag event for reordering nemeses.
   *
   * @param event Drag End Event
   */
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = parseInt(active.id.toString())
      const newIndex = parseInt(over.id.toString())
      const newOrder = arrayMove(nemeses, oldIndex, newIndex)

      form.setValue('nemeses', newOrder)
      saveToLocalStorageDebounced(newOrder)

      setDisabledInputs((prev) => {
        const next: { [key: number]: boolean } = {}

        Object.keys(prev).forEach((k) => {
          const num = parseInt(k)
          if (num === oldIndex) next[newIndex] = prev[num]
          else if (num >= newIndex && num < oldIndex) next[num + 1] = prev[num]
          else if (num <= newIndex && num > oldIndex) next[num - 1] = prev[num]
          else next[num] = prev[num]
        })

        return next
      })
    }
  }

  return (
    <Card className="p-0 border-1">
      <CardHeader className="px-2 pt-1 pb-0">
        <CardTitle className="text-sm flex flex-row items-center gap-1 h-8">
          <SkullIcon className="h-4 w-4" />
          Nemesis Monsters
          {!isAddingNew && (
            <div className="flex justify-center">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={addNemesis}
                className="border-0 h-8 w-8"
                disabled={
                  isAddingNew ||
                  Object.values(disabledInputs).some((v) => v === false)
                }>
                <PlusIcon className="h-4 w-4" />
              </Button>
            </div>
          )}
        </CardTitle>
        <CardDescription className="text-left text-xs text-muted-foreground">
          The nemesis monsters your settlement can encounter.
        </CardDescription>
      </CardHeader>

      {/* Nemeses List */}
      <CardContent className="p-1 pb-2">
        <div className="flex flex-col h-[200px]">
          <div className="flex-1 overflow-y-auto">
            {nemeses.length !== 0 && (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}>
                <SortableContext
                  items={nemeses.map((_, index) => index.toString())}
                  strategy={verticalListSortingStrategy}>
                  {nemeses.map((nemesis, index) => (
                    <NemesisItem
                      key={index}
                      id={index.toString()}
                      index={index}
                      form={form}
                      onRemove={onRemove}
                      isDisabled={!!disabledInputs[index]}
                      onSave={(name, unlocked, i) => onSave(name, unlocked, i)}
                      onEdit={onEdit}
                      onToggleUnlocked={onToggleUnlocked}
                      onToggleLevel={onToggleLevel}
                    />
                  ))}
                </SortableContext>
              </DndContext>
            )}
            {isAddingNew && (
              <NewNemesisItem
                onSave={(name, unlocked) => onSave(name, unlocked)}
                onCancel={() => setIsAddingNew(false)}
              />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
