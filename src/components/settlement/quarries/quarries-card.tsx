'use client'

import { QuarryContent } from '@/components/settlement/quarries/quarry-content'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { SettlementSchema } from '@/schemas/settlement'
import {
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core'
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { SwordIcon } from 'lucide-react'
import {
  startTransition,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react'
import { UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

export function QuarriesCard(
  form: UseFormReturn<z.infer<typeof SettlementSchema>>
) {
  const quarries = useMemo(() => form.watch('quarries') || [], [form])

  const [isVisible, setIsVisible] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    const currentCardRef = cardRef.current

    if (currentCardRef) observer.observe(currentCardRef)

    return () => {
      if (currentCardRef) {
        observer.unobserve(currentCardRef)
      }
    }
  }, [])

  const [disabledInputs, setDisabledInputs] = useState<{
    [key: string]: boolean
  }>({})

  const [isAddingNew, setIsAddingNew] = useState(false)

  useEffect(() => {
    setDisabledInputs((prev) => {
      const next: { [key: string]: boolean } = {}
      quarries.forEach((quarry) => {
        next[quarry.name] = prev[quarry.name] ?? true
      })
      return next
    })
  }, [quarries])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  const addQuarry = useCallback(() => setIsAddingNew(true), [])

  const handleRemoveQuarry = useCallback(
    (quarryName: string) => {
      if (quarryName.startsWith('new-quarry-')) setIsAddingNew(false)
      else
        startTransition(() => {
          const updatedQuarries = quarries.filter((q) => q.name !== quarryName)

          form.setValue('quarries', updatedQuarries)

          setDisabledInputs((prev) => {
            const updated = { ...prev }
            delete updated[quarryName]
            return updated
          })
        })
    },
    [quarries, form]
  )

  const updateQuarryNode = useCallback(
    (quarryName: string, node: string) =>
      startTransition(() => {
        const updatedQuarries = quarries.map((q) =>
          q.name === quarryName
            ? { ...q, node: node as 'Node 1' | 'Node 2' | 'Node 3' | 'Node 4' }
            : q
        )

        form.setValue('quarries', updatedQuarries)
      }),
    [quarries, form]
  )

  const updateQuarryName = useCallback(
    (originalName: string, newName: string) =>
      startTransition(() => {
        const updatedQuarries = quarries.map((q) =>
          q.name === originalName ? { ...q, name: newName } : q
        )

        form.setValue('quarries', updatedQuarries)

        setDisabledInputs((prev) => {
          const updated = { ...prev }
          delete updated[originalName]
          updated[newName] = true
          return updated
        })
      }),
    [quarries, form]
  )

  const saveQuarry = useCallback((quarryName: string) => {
    if (!quarryName || quarryName.trim() === '')
      return toast.warning('Cannot save a quarry without a name')

    setDisabledInputs((prev) => ({ ...prev, [quarryName]: true }))

    toast.success('Quarry saved')
  }, [])

  const editQuarry = useCallback(
    (quarryName: string) =>
      setDisabledInputs((prev) => ({ ...prev, [quarryName]: false })),
    []
  )

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event

      if (over && active.id !== over.id)
        requestAnimationFrame(() => {
          const oldIndex = quarries.findIndex((q) => q.name === active.id)
          const newIndex = quarries.findIndex((q) => q.name === over.id)

          const newOrder = arrayMove(quarries, oldIndex, newIndex)

          form.setValue('quarries', newOrder)
        })
    },
    [quarries, form]
  )

  const cachedQuarries = useMemo(() => quarries, [quarries])

  const contentProps = useMemo(
    () => ({
      quarries: cachedQuarries,
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
    }),
    [
      cachedQuarries,
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
      form
    ]
  )

  return (
    <Card className="mt-2" ref={cardRef}>
      <CardHeader className="pb-2">
        <CardTitle className="text-md flex items-center gap-1">
          <SwordIcon className="h-4 w-4" /> Quarries
        </CardTitle>
        <CardDescription className="text-left text-xs">
          The monsters your settlement can select to hunt.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0 pb-2">
        {isVisible ? (
          <QuarryContent {...contentProps} />
        ) : (
          <div className="py-8 text-center text-gray-500">
            Loading quarries...
          </div>
        )}
      </CardContent>
    </Card>
  )
}
