'use client'

import { QuarryContent } from '@/components/settlement/quarries/quarry-content'
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

/**
 * Quarries Card Component
 *
 * @param form Form
 */
export function QuarriesCard(form: UseFormReturn<Settlement>) {
  const quarries = useMemo(() => form.watch('quarries') || [], [form])

  const [isAddingNew, setIsAddingNew] = useState<boolean>(false)
  const [isVisible, setIsVisible] = useState<boolean>(false)
  const [disabledInputs, setDisabledInputs] = useState<{
    [key: string]: boolean
  }>({})

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
      if (currentCardRef) observer.unobserve(currentCardRef)
    }
  }, [])

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

  /**
   * Handles the removal of a quarry.
   *
   * @param quarryName Quarry Name
   */
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

          // Update localStorage
          try {
            const formValues = form.getValues()
            const campaign = getCampaign()
            const settlementIndex = campaign.settlements.findIndex(
              (s) => s.id === formValues.id
            )

            campaign.settlements[settlementIndex].quarries = updatedQuarries
            localStorage.setItem('campaign', JSON.stringify(campaign))

            toast.success('The beast has been banished to the void.')
          } catch (error) {
            console.error('Quarry Remove Error:', error)
            toast.error('The darkness refuses to let go. Please try again.')
          }
        })
    },
    [quarries, form]
  )

  /**
   * Updates the quarry node level.
   *
   * @param quarryName Quarry Name
   * @param node Node Level
   */
  const updateQuarryNode = useCallback(
    (quarryName: string, node: string) =>
      startTransition(() => {
        const updatedQuarries = quarries.map((q) =>
          q.name === quarryName
            ? { ...q, node: node as 'Node 1' | 'Node 2' | 'Node 3' | 'Node 4' }
            : q
        )

        form.setValue('quarries', updatedQuarries)

        // Update localStorage
        try {
          const formValues = form.getValues()
          const campaign = getCampaign()
          const settlementIndex = campaign.settlements.findIndex(
            (s) => s.id === formValues.id
          )

          campaign.settlements[settlementIndex].quarries = updatedQuarries
          localStorage.setItem('campaign', JSON.stringify(campaign))
        } catch (error) {
          console.error('Quarry Node Update Error:', error)
        }
      }),
    [quarries, form]
  )

  /**
   * Updates the quarry name.
   *
   * @param originalName Original Quarry Name
   * @param newName New Quarry Name
   */
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

        // Update localStorage
        try {
          const formValues = form.getValues()
          const campaign = getCampaign()
          const settlementIndex = campaign.settlements.findIndex(
            (s) => s.id === formValues.id
          )

          campaign.settlements[settlementIndex].quarries = updatedQuarries
          localStorage.setItem('campaign', JSON.stringify(campaign))
        } catch (error) {
          console.error('Quarry Update Name Error:', error)
        }
      }),
    [quarries, form]
  )

  /**
   * Saves the quarry to localStorage.
   *
   * @param quarryName The name of the quarry to save.
   */
  const saveQuarry = useCallback(
    (quarryName: string) => {
      if (!quarryName || quarryName.trim() === '')
        return toast.warning('Cannot save a quarry without a name!')

      setDisabledInputs((prev) => ({ ...prev, [quarryName]: true }))

      // Update localStorage
      try {
        const formValues = form.getValues()
        const campaign = getCampaign()
        const settlementIndex = campaign.settlements.findIndex(
          (s) => s.id === formValues.id
        )

        campaign.settlements[settlementIndex].quarries = formValues.quarries
        localStorage.setItem('campaign', JSON.stringify(campaign))
        toast.success('The monster prowls the darkness. Hunt or be hunted.')
      } catch (error) {
        console.error('Quarry Save Error:', error)
        toast.error('The quarry refuses to be bound. Please try again.')
      }
    },
    [form]
  )

  /**
   * Edits the quarry.
   *
   * @param quarryName Quarry Name
   */
  const editQuarry = useCallback(
    (quarryName: string) =>
      setDisabledInputs((prev) => ({ ...prev, [quarryName]: false })),
    []
  )

  /**
   * Toggles the quarry unlocked state.
   *
   * @param quarryName Quarry Name
   * @param unlocked Unlocked State
   */
  const toggleQuarryUnlocked = useCallback(
    (quarryName: string, unlocked: boolean) =>
      startTransition(() => {
        const updatedQuarries = quarries.map((q) =>
          q.name === quarryName ? { ...q, unlocked } : q
        )

        form.setValue('quarries', updatedQuarries)

        // Update localStorage
        try {
          const formValues = form.getValues()
          const campaign = getCampaign()
          const settlementIndex = campaign.settlements.findIndex(
            (s) => s.id === formValues.id
          )

          campaign.settlements[settlementIndex].quarries = updatedQuarries
          localStorage.setItem('campaign', JSON.stringify(campaign))
          toast.success(
            `${quarryName} ${unlocked ? 'emerges from the mist, ready to be hunted.' : 'retreats into the darkness, beyond your reach.'}`
          )
        } catch (error) {
          console.error('Quarry Lock/Unlock Error:', error)
          toast.error(
            'The quarry resists your attempt to alter its nature. Please try again.'
          )
        }
      }),
    [quarries, form]
  )

  /**
   * Handles the drag end event.
   *
   * @param event Drag End Event
   */
  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event

      if (over && active.id !== over.id)
        requestAnimationFrame(() => {
          const oldIndex = quarries.findIndex((q) => q.name === active.id)
          const newIndex = quarries.findIndex((q) => q.name === over.id)

          const newOrder = arrayMove(quarries, oldIndex, newIndex)

          form.setValue('quarries', newOrder)

          // Update localStorage
          try {
            const formValues = form.getValues()
            const campaign = getCampaign()
            const settlementIndex = campaign.settlements.findIndex(
              (s) => s.id === formValues.id
            )

            campaign.settlements[settlementIndex].quarries = newOrder
            localStorage.setItem('campaign', JSON.stringify(campaign))
          } catch (error) {
            console.error('Quarry Drag Error:', error)
          }
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
      toggleQuarryUnlocked,
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
      toggleQuarryUnlocked,
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
