'use client'

import {
  FightingArtItem,
  NewFightingArtItem
} from '@/components/survivor/fighting-arts/fighting-art-item'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Label } from '@/components/ui/label'
import { CampaignType, SurvivorType } from '@/lib/enums'
import {
  getCampaign,
  getSettlement,
  saveCampaignToLocalStorage
} from '@/lib/utils'
import { Settlement } from '@/schemas/settlement'
import { Survivor, SurvivorSchema } from '@/schemas/survivor'
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
import { PlusIcon, ZapIcon } from 'lucide-react'
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

// Type for a combined fighting art item with metadata
export interface CombinedFightingArt {
  /** Original Index */
  originalIndex: number
  /** Type */
  type: 'regular' | 'secret'
  /** Value */
  value: string
}

/**
 * Fighting Arts Card Component
 *
 * @param form Form
 * @returns Fighting Arts Card Component
 */
export function FightingArtsCard({
  ...form
}: UseFormReturn<Survivor>): ReactElement {
  const settlementId = form.watch('settlementId')

  // Get settlement data to determine survivor type for limit checking
  const [settlement, setSettlement] = useState<Settlement | undefined>()

  useEffect(() => {
    if (settlementId) {
      const fetchedSettlement = getSettlement(settlementId)
      setSettlement(fetchedSettlement)
    }
  }, [settlementId])

  // Determine survivor type from settlement data
  const survivorType = settlement?.survivorType || SurvivorType.CORE

  // Get the current fighting arts and secret fighting arts
  const watchedFightingArts = form.watch('fightingArts')
  const watchedSecretFightingArts = form.watch('secretFightingArts')
  const fightingArts = useMemo(
    () => watchedFightingArts || [],
    [watchedFightingArts]
  )
  const secretFightingArts = useMemo(
    () => watchedSecretFightingArts || [],
    [watchedSecretFightingArts]
  )

  // Get the canUseFightingArtsOrKnowledges value
  const watchedCanUseFightingArtsOrKnowledges = form.watch(
    'canUseFightingArtsOrKnowledges'
  )
  const canUseFightingArtsOrKnowledges = useMemo(
    () => watchedCanUseFightingArtsOrKnowledges,
    [watchedCanUseFightingArtsOrKnowledges]
  )

  // Calculate total arts to check against limits
  const totalArts = fightingArts.length + secretFightingArts.length

  // Track state for input editing
  const [disabledInputs, setDisabledInputs] = useState<{
    [key: string]: boolean
  }>({})

  // Track which type we're currently adding
  const [newArtType, setNewArtType] = useState<'regular' | 'secret'>('regular')
  const [isAddingNew, setIsAddingNew] = useState<boolean>(false)

  // Timeout reference for debounced saves
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Initialize disabled inputs for fighting arts
  useEffect(() => {
    setDisabledInputs((prev) => {
      const next: { [key: string]: boolean } = {}

      fightingArts.forEach((_, index) => {
        const key = `regular-${index}`
        next[key] = prev[key] !== undefined ? prev[key] : true
      })

      secretFightingArts.forEach((_, index) => {
        const key = `secret-${index}`
        next[key] = prev[key] !== undefined ? prev[key] : true
      })

      return next
    })

    // Cleanup on unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
    }
  }, [fightingArts, secretFightingArts])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  /**
   * Save fighting arts and secret fighting arts to localStorage for the current survivor, with Zod validation and toast feedback.
   * Uses debounced saving to improve performance.
   *
   * @param updatedFightingArts Updated Fighting Arts
   * @param updatedSecretFightingArts Updated Secret Fighting Arts
   * @param successMsg Success Message
   * @param immediate Whether to save immediately (for user-triggered actions)
   */
  const saveToLocalStorageDebounced = useCallback(
    (
      updatedFightingArts: string[],
      updatedSecretFightingArts: string[],
      successMsg?: string,
      immediate = false
    ) => {
      const saveFunction = () => {
        try {
          const formValues = form.getValues()
          const campaign = getCampaign()
          const survivorIndex = campaign.survivors.findIndex(
            (s: { id: number }) => s.id === formValues.id
          )

          if (survivorIndex !== -1) {
            try {
              SurvivorSchema.shape.fightingArts.parse(updatedFightingArts)
              SurvivorSchema.shape.secretFightingArts.parse(
                updatedSecretFightingArts
              )
            } catch (error) {
              if (error instanceof ZodError && error.errors[0]?.message)
                return toast.error(error.errors[0].message)
              else
                return toast.error(
                  'The darkness swallows your words. Please try again.'
                )
            }

            const updatedCampaign = {
              ...campaign,
              survivors: campaign.survivors.map((s) =>
                s.id === formValues.id
                  ? {
                      ...s,
                      fightingArts: updatedFightingArts,
                      secretFightingArts: updatedSecretFightingArts
                    }
                  : s
              )
            }

            saveCampaignToLocalStorage(updatedCampaign)

            if (successMsg) toast.success(successMsg)
          }
        } catch (error) {
          console.error('Fighting Art Save Error:', error)
          toast.error('The darkness swallows your words. Please try again.')
        }
      }

      if (immediate) {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
          timeoutRef.current = null
        }
        saveFunction()
      } else {
        if (timeoutRef.current) clearTimeout(timeoutRef.current)

        timeoutRef.current = setTimeout(saveFunction, 300)
      }
    },
    [form]
  )

  /**
   * Handles the removal of a fighting art.
   *
   * @param art Fighting Art to Remove
   */
  const onRemove = (art: CombinedFightingArt) => {
    if (art.type === 'regular') {
      const currentArts = [...fightingArts]
      currentArts.splice(art.originalIndex, 1)
      form.setValue('fightingArts', currentArts)

      setDisabledInputs((prev) => {
        const next: { [key: string]: boolean } = {}

        Object.keys(prev).forEach((k) => {
          if (k.startsWith('regular-')) {
            const num = parseInt(k.replace('regular-', ''))
            if (num < art.originalIndex) next[k] = prev[k]
            else if (num > art.originalIndex)
              next[`regular-${num - 1}`] = prev[k]
          } else {
            next[k] = prev[k]
          }
        })

        return next
      })

      saveToLocalStorageDebounced(
        currentArts,
        secretFightingArts,
        'The fighting art has been forgotten.',
        true
      )
    } else {
      const currentArts = [...secretFightingArts]
      currentArts.splice(art.originalIndex, 1)
      form.setValue('secretFightingArts', currentArts)

      setDisabledInputs((prev) => {
        const next: { [key: string]: boolean } = {}

        Object.keys(prev).forEach((k) => {
          if (k.startsWith('secret-')) {
            const num = parseInt(k.replace('secret-', ''))
            if (num < art.originalIndex) next[k] = prev[k]
            else if (num > art.originalIndex)
              next[`secret-${num - 1}`] = prev[k]
          } else {
            next[k] = prev[k]
          }
        })

        return next
      })

      saveToLocalStorageDebounced(
        fightingArts,
        currentArts,
        'The secret fighting art has been banished from memory.',
        true
      )
    }
  }

  /**
   * Handles saving of a new fighting art.
   *
   * @param value Fighting Art Value
   * @returns void
   */
  const onSave = (value?: string, art?: CombinedFightingArt) => {
    if (!value || value.trim() === '')
      return toast.error('A nameless fighting art cannot be recorded.')

    if (art) {
      // Updating an existing fighting art
      const key = `${art.type}-${art.originalIndex}`

      if (art.type === 'regular') {
        const updated = [...fightingArts]

        updated[art.originalIndex] = value
        form.setValue(`fightingArts.${art.originalIndex}`, value)

        setDisabledInputs((prev) => ({
          ...prev,
          [key]: true
        }))

        saveToLocalStorageDebounced(
          updated,
          secretFightingArts,
          'The fighting art has been perfected.',
          true
        )
      } else {
        const updated = [...secretFightingArts]

        updated[art.originalIndex] = value
        form.setValue(`secretFightingArts.${art.originalIndex}`, value)

        setDisabledInputs((prev) => ({
          ...prev,
          [key]: true
        }))

        saveToLocalStorageDebounced(
          fightingArts,
          updated,
          'The secret fighting art has been perfected.',
          true
        )
      }
    } else {
      // Adding a new fighting art
      if (newArtType === 'regular') {
        if (isAtRegularFightingArtLimit())
          return toast.warning(
            survivorType === SurvivorType.ARC
              ? 'Arc survivors can only have 1 Fighting Art.'
              : 'Survivors can only have 3 total Fighting Arts and Secret Fighting Arts combined.'
          )

        const newArts = [...fightingArts, value]
        form.setValue('fightingArts', newArts)

        setDisabledInputs((prev) => ({
          ...prev,
          [`regular-${newArts.length - 1}`]: true
        }))

        saveToLocalStorageDebounced(
          newArts,
          secretFightingArts,
          'A new fighting art has been mastered.',
          true
        )
      } else {
        if (isAtSecretFightingArtLimit())
          return toast.warning(
            survivorType === SurvivorType.ARC
              ? 'Arc survivors can only have 1 Secret Fighting Art.'
              : 'Survivors can only have 3 total Fighting Arts and Secret Fighting Arts combined.'
          )

        const newArts = [...secretFightingArts, value]
        form.setValue('secretFightingArts', newArts)

        setDisabledInputs((prev) => ({
          ...prev,
          [`secret-${newArts.length - 1}`]: true
        }))

        saveToLocalStorageDebounced(
          fightingArts,
          newArts,
          'A new secret fighting art has been mastered.',
          true
        )
      }
      setIsAddingNew(false)
    }
  }

  /**
   * Enables editing a value.
   *
   * @param art Fighting Art to Edit
   */
  const onEdit = (art: CombinedFightingArt) => {
    const key = `${art.type}-${art.originalIndex}`
    setDisabledInputs((prev) => ({ ...prev, [key]: false }))
  }

  /**
   * Handle toggling the canUseFightingArtsOrKnowledges checkbox
   */
  const handleCanUseToggle = useCallback(
    (checked: boolean) => {
      try {
        const formValues = form.getValues()
        const campaign = getCampaign()
        const survivorIndex = campaign.survivors.findIndex(
          (s: { id: number }) => s.id === formValues.id
        )

        if (survivorIndex !== -1) {
          const updatedValue = !checked

          try {
            SurvivorSchema.shape.canUseFightingArtsOrKnowledges.parse(
              updatedValue
            )
          } catch (error) {
            if (error instanceof ZodError && error.errors[0]?.message)
              return toast.error(error.errors[0].message)
            else
              return toast.error(
                'The darkness swallows your words. Please try again.'
              )
          }

          form.setValue('canUseFightingArtsOrKnowledges', updatedValue)

          campaign.survivors[survivorIndex].canUseFightingArtsOrKnowledges =
            updatedValue
          localStorage.setItem('campaign', JSON.stringify(campaign))

          toast.success(
            updatedValue
              ? 'The survivor recalls the ways of battle.'
              : 'The survivor has forgotten their fighting techniques.'
          )
        }
      } catch (error) {
        console.error('Fighting Art Toggle Save Error:', error)
        toast.error('The darkness swallows your words. Please try again.')
      }
    },
    [form]
  )

  /**
   * Checks if we've reached the regular fighting arts limit
   *
   * @returns boolean True if at limit, false otherwise
   */
  const isAtRegularFightingArtLimit = useCallback(() => {
    // ARC survivors can have 1 fighting art and 1 secret fighting art
    // Regular survivors can have 3 total (fighting + secret combined)
    return survivorType === SurvivorType.ARC
      ? fightingArts.length >= 1
      : totalArts >= 3
  }, [survivorType, fightingArts.length, totalArts])

  /**
   * Checks if we've reached the secret fighting arts limit
   *
   * @returns boolean True if at limit, false otherwise
   */
  const isAtSecretFightingArtLimit = useCallback(() => {
    // ARC survivors can have 1 fighting art and 1 secret fighting art
    // Regular survivors can have 3 total (fighting + secret combined)
    return survivorType === SurvivorType.ARC
      ? secretFightingArts.length >= 1
      : totalArts >= 3
  }, [survivorType, secretFightingArts.length, totalArts])

  /**
   * Handles the end of a drag event for reordering values.
   *
   * @param event Drag End Event
   * @param artType Type of fighting art being reordered
   */
  const handleDragEnd = (
    event: DragEndEvent,
    artType: 'regular' | 'secret'
  ) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = parseInt(active.id.toString())
      const newIndex = parseInt(over.id.toString())

      if (artType === 'regular') {
        const newOrder = arrayMove(fightingArts, oldIndex, newIndex)
        form.setValue('fightingArts', newOrder)
        saveToLocalStorageDebounced(newOrder, secretFightingArts)

        setDisabledInputs((prev) => {
          const next: { [key: string]: boolean } = {}

          Object.keys(prev).forEach((k) => {
            if (k.startsWith('regular-')) {
              const num = parseInt(k.replace('regular-', ''))
              if (num === oldIndex) next[`regular-${newIndex}`] = prev[k]
              else if (num >= newIndex && num < oldIndex)
                next[`regular-${num + 1}`] = prev[k]
              else if (num <= newIndex && num > oldIndex)
                next[`regular-${num - 1}`] = prev[k]
              else next[k] = prev[k]
            } else {
              next[k] = prev[k]
            }
          })

          return next
        })
      } else {
        const newOrder = arrayMove(secretFightingArts, oldIndex, newIndex)
        form.setValue('secretFightingArts', newOrder)
        saveToLocalStorageDebounced(fightingArts, newOrder)

        setDisabledInputs((prev) => {
          const next: { [key: string]: boolean } = {}

          Object.keys(prev).forEach((k) => {
            if (k.startsWith('secret-')) {
              const num = parseInt(k.replace('secret-', ''))
              if (num === oldIndex) next[`secret-${newIndex}`] = prev[k]
              else if (num >= newIndex && num < oldIndex)
                next[`secret-${num + 1}`] = prev[k]
              else if (num <= newIndex && num > oldIndex)
                next[`secret-${num - 1}`] = prev[k]
              else next[k] = prev[k]
            } else {
              next[k] = prev[k]
            }
          })

          return next
        })
      }
    }
  }

  // Don't show this component for Squires of the Citadel campaign
  if (settlement?.campaignType === CampaignType.SQUIRES_OF_THE_CITADEL)
    return <></>

  return (
    <Card className="p-0 pb-1 mt-1 border-3">
      <CardHeader className="px-2 py-1">
        <div className="flex justify-between items-center">
          {/* Title */}
          <CardTitle className="text-md flex flex-row items-center gap-1 h-8">
            <ZapIcon className="h-4 w-4" />
            Fighting Arts &amp; Secret Fighting Arts
            {!isAddingNew && (
              <div className="flex justify-center">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="border-0 h-8 w-8"
                      disabled={
                        isAddingNew ||
                        Object.values(disabledInputs).some((v) => v === false)
                      }>
                      <PlusIcon className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onClick={() => {
                        setNewArtType('regular')
                        setIsAddingNew(true)
                      }}
                      disabled={isAtRegularFightingArtLimit()}>
                      Fighting Art
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        setNewArtType('secret')
                        setIsAddingNew(true)
                      }}
                      disabled={isAtSecretFightingArtLimit()}>
                      Secret Fighting Art
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </CardTitle>

          {/* Cannot Use Fighting Arts */}
          <div className="flex items-center gap-2">
            <Checkbox
              id="canUseFightingArtsOrKnowledges"
              checked={!canUseFightingArtsOrKnowledges}
              onCheckedChange={handleCanUseToggle}
            />
            <Label
              htmlFor="canUseFightingArtsOrKnowledges"
              className="text-xs cursor-pointer">
              Cannot Use Fighting Arts
            </Label>
          </div>
        </div>
      </CardHeader>

      {/* Fighting Arts List */}
      <CardContent className="p-1 pb-0">
        <div className="flex flex-col h-[240px]">
          <div className="flex-1 overflow-y-auto">
            {/* Regular Fighting Arts */}
            {fightingArts.length !== 0 && (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={(event) => handleDragEnd(event, 'regular')}>
                <SortableContext
                  items={fightingArts.map((_, index) => index.toString())}
                  strategy={verticalListSortingStrategy}>
                  {fightingArts.map((art, index) => (
                    <FightingArtItem
                      key={`regular-${index}`}
                      id={index.toString()}
                      index={index}
                      form={form}
                      arrayName="fightingArts"
                      onRemove={() =>
                        onRemove({
                          value: art,
                          type: 'regular',
                          originalIndex: index
                        })
                      }
                      isDisabled={!!disabledInputs[`regular-${index}`]}
                      onSave={(value) =>
                        onSave(value, {
                          value: art,
                          type: 'regular',
                          originalIndex: index
                        })
                      }
                      onEdit={() =>
                        onEdit({
                          value: art,
                          type: 'regular',
                          originalIndex: index
                        })
                      }
                      placeholder="Fighting Art"
                    />
                  ))}
                </SortableContext>
              </DndContext>
            )}

            {/* Secret Fighting Arts */}
            {secretFightingArts.length !== 0 && (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={(event) => handleDragEnd(event, 'secret')}>
                <SortableContext
                  items={secretFightingArts.map((_, index) => index.toString())}
                  strategy={verticalListSortingStrategy}>
                  {secretFightingArts.map((art, index) => (
                    <FightingArtItem
                      key={`secret-${index}`}
                      id={index.toString()}
                      index={index}
                      form={form}
                      arrayName="secretFightingArts"
                      onRemove={() =>
                        onRemove({
                          value: art,
                          type: 'secret',
                          originalIndex: index
                        })
                      }
                      isDisabled={!!disabledInputs[`secret-${index}`]}
                      onSave={(value) =>
                        onSave(value, {
                          value: art,
                          type: 'secret',
                          originalIndex: index
                        })
                      }
                      onEdit={() =>
                        onEdit({
                          value: art,
                          type: 'secret',
                          originalIndex: index
                        })
                      }
                      placeholder="Secret Fighting Art"
                    />
                  ))}
                </SortableContext>
              </DndContext>
            )}

            {/* Add New Fighting Art */}
            {isAddingNew && (
              <NewFightingArtItem
                onSave={onSave}
                onCancel={() => setIsAddingNew(false)}
                placeholder={
                  newArtType === 'regular'
                    ? 'Fighting Art'
                    : 'Secret Fighting Art'
                }
                artType={newArtType}
              />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
