'use client'

import { NemesisContent } from '@/components/settlement/nemeses/nemesis-content'
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
import { SkullIcon } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

/**
 * Nemesis Card Component
 */
export function NemesesCard(
  form: UseFormReturn<z.infer<typeof SettlementSchema>>
) {
  const nemeses = useMemo(() => form.watch('nemesis') || [], [form])

  const [isVisible, setIsVisible] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) setIsVisible(true)
      },
      { threshold: 0.1 }
    )

    const currentRef = cardRef.current
    if (currentRef) observer.observe(currentRef)

    return () => {
      if (currentRef) observer.unobserve(currentRef)
    }
  }, [])

  // Sync disabledInputs with nemeses
  const [disabledInputs, setDisabledInputs] = useState<{
    [key: string]: boolean
  }>({})
  useEffect(() => {
    setDisabledInputs((prev) => {
      const next: { [key: string]: boolean } = {}
      nemeses.forEach((nemesis) => {
        next[nemesis.name] = prev[nemesis.name] ?? true
      })
      return next
    })
  }, [nemeses])

  const [isAddingNew, setIsAddingNew] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  const addNemesis = useCallback(() => setIsAddingNew(true), [])

  const handleRemoveNemesis = useCallback(
    (nemesisName: string) => {
      if (nemesisName.startsWith('new-nemesis-')) setIsAddingNew(false)
      else {
        const updatedNemeses = nemeses.filter((n) => n.name !== nemesisName)

        form.setValue('nemesis', updatedNemeses)

        setDisabledInputs((prev) => {
          const updated = { ...prev }
          delete updated[nemesisName]
          return updated
        })
      }
    },
    [nemeses, form]
  )

  const handleToggleLevel = useCallback(
    (
      nemesisName: string,
      level: 'level1' | 'level2' | 'level3',
      checked: boolean
    ) => {
      const updatedNemeses = nemeses.map((n) =>
        n.name === nemesisName ? { ...n, [level]: checked } : n
      )

      form.setValue('nemesis', updatedNemeses)
    },
    [nemeses, form]
  )

  const toggleUnlocked = useCallback(
    (nemesisName: string, checked: boolean) => {
      const updatedNemeses = nemeses.map((n) =>
        n.name === nemesisName ? { ...n, unlocked: checked } : n
      )

      form.setValue('nemesis', updatedNemeses)
    },
    [nemeses, form]
  )

  const saveNemesis = useCallback((nemesisName: string) => {
    if (!nemesisName || nemesisName.trim() === '')
      return toast.warning('Cannot save a nemesis without a name')

    setDisabledInputs((prev) => ({
      ...prev,
      [nemesisName]: true
    }))

    toast.success('Nemesis saved')
  }, [])

  const updateNemesisName = useCallback(
    (originalName: string, newName: string) => {
      const updatedNemeses = nemeses.map((n) =>
        n.name === originalName ? { ...n, name: newName } : n
      )

      form.setValue('nemesis', updatedNemeses)

      setDisabledInputs((prev) => {
        const updated = { ...prev }
        delete updated[originalName]
        updated[newName] = true
        return updated
      })
    },
    [nemeses, form]
  )

  const editNemesis = useCallback((nemesisName: string) => {
    setDisabledInputs((prev) => ({
      ...prev,
      [nemesisName]: false
    }))
  }, [])

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event

      if (over && active.id !== over.id) {
        requestAnimationFrame(() => {
          const oldIndex = nemeses.findIndex((n) => n.name === active.id)
          const newIndex = nemeses.findIndex((n) => n.name === over.id)

          const newOrder = arrayMove(nemeses, oldIndex, newIndex)

          form.setValue('nemesis', newOrder)
        })
      }
    },
    [nemeses, form]
  )

  // Cache values to prevent unnecessary re-renders
  const cachedNemeses = useMemo(() => nemeses, [nemeses])

  // Prepare props for NemesisContent component
  const contentProps = useMemo(
    () => ({
      nemeses: cachedNemeses,
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
    }),
    [
      cachedNemeses,
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
    ]
  )

  return (
    <Card className="mt-2" ref={cardRef}>
      <CardHeader className="pb-2">
        <CardTitle className="text-md flex items-center gap-1">
          <SkullIcon className="h-4 w-4" /> Nemesis Monsters
        </CardTitle>
        <CardDescription className="text-left text-xs">
          The nemesis monsters your settlement can encounter.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0 pb-2">
        {isVisible ? (
          <NemesisContent {...contentProps} />
        ) : (
          <div className="py-8 text-center text-gray-500">
            Loading nemesis monsters...
          </div>
        )}
      </CardContent>
    </Card>
  )
}
