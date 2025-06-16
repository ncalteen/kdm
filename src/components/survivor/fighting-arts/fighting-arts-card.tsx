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
import { Settlement } from '@/schemas/settlement'
import { Survivor } from '@/schemas/survivor'
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
import { ReactElement, useEffect, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'

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
 * Fighting Arts Card Props
 */
interface FightingArtsCardProps {
  /** Survivor form instance */
  form: UseFormReturn<Survivor>
  /** Current settlement */
  settlement: Settlement
  /** Function to save survivor data */
  saveSurvivor: (data: Partial<Survivor>, successMsg?: string) => void
}

/**
 * Fighting Arts Card Component
 *
 * @param form Form
 * @returns Fighting Arts Card Component
 */
export function FightingArtsCard({
  form,
  settlement,
  saveSurvivor
}: FightingArtsCardProps): ReactElement {
  // Watch form state
  const fightingArts = form.watch('fightingArts')
  const secretFightingArts = form.watch('secretFightingArts')
  const canUseFightingArtsOrKnowledges = form.watch(
    'canUseFightingArtsOrKnowledges'
  )

  // Determine survivor type from settlement data
  const survivorType = settlement.survivorType || SurvivorType.CORE

  // Calculate total arts to check against limits
  const totalArts =
    (fightingArts?.length || 0) + (secretFightingArts?.length || 0)

  // Track state for input editing
  const [disabledInputs, setDisabledInputs] = useState<{
    [key: string]: boolean
  }>({})

  // Track which type we're currently adding
  const [newArtType, setNewArtType] = useState<'regular' | 'secret'>('regular')
  const [isAddingNew, setIsAddingNew] = useState<boolean>(false)

  // Initialize disabled inputs for fighting arts
  useEffect(() => {
    setDisabledInputs((prev) => {
      const next: { [key: string]: boolean } = {}

      fightingArts?.forEach((_, index) => {
        const key = `regular-${index}`
        next[key] = prev[key] !== undefined ? prev[key] : true
      })

      secretFightingArts?.forEach((_, index) => {
        const key = `secret-${index}`
        next[key] = prev[key] !== undefined ? prev[key] : true
      })

      return next
    })
  }, [fightingArts, secretFightingArts])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  const addRegularFightingArt = () => {
    setNewArtType('regular')
    setIsAddingNew(true)
  }

  const addSecretFightingArt = () => {
    setNewArtType('secret')
    setIsAddingNew(true)
  }

  /**
   * Save to Local Storage
   *
   * @param updatedFightingArts Updated Fighting Arts
   * @param updatedSecretFightingArts Updated Secret Fighting Arts
   * @param successMsg Success Message
   */
  const saveToLocalStorage = (
    updatedFightingArts: string[],
    updatedSecretFightingArts: string[],
    successMsg?: string
  ) =>
    saveSurvivor(
      {
        fightingArts: updatedFightingArts,
        secretFightingArts: updatedSecretFightingArts
      },
      successMsg
    )

  /**
   * Handles the removal of a fighting art.
   *
   * @param art Fighting Art to Remove
   */
  const onRemove = (art: CombinedFightingArt) => {
    if (art.type === 'regular') {
      const currentArts = [...(fightingArts || [])]
      currentArts.splice(art.originalIndex, 1)

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

      saveToLocalStorage(
        currentArts,
        secretFightingArts || [],
        'The fighting art has been forgotten.'
      )
    } else {
      const currentArts = [...(secretFightingArts || [])]
      currentArts.splice(art.originalIndex, 1)

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

      saveToLocalStorage(
        fightingArts || [],
        currentArts,
        'The secret fighting art has been banished from memory.'
      )
    }
  }

  /**
   * Handles saving of a fighting art.
   *
   * @param value Fighting Art Value
   * @param art Fighting Art (when updating existing)
   */
  const onSave = (value?: string, art?: CombinedFightingArt) => {
    if (!value || value.trim() === '')
      return toast.error('A nameless fighting art cannot be recorded.')

    if (art) {
      // Updating an existing fighting art
      const key = `${art.type}-${art.originalIndex}`

      if (art.type === 'regular') {
        const updated = [...(fightingArts || [])]
        updated[art.originalIndex] = value

        setDisabledInputs((prev) => ({ ...prev, [key]: true }))
        saveToLocalStorage(
          updated,
          secretFightingArts || [],
          'The fighting art has been perfected.'
        )
      } else {
        const updated = [...(secretFightingArts || [])]
        updated[art.originalIndex] = value

        setDisabledInputs((prev) => ({ ...prev, [key]: true }))
        saveToLocalStorage(
          fightingArts || [],
          updated,
          'The secret fighting art has been perfected.'
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

        const newArts = [...(fightingArts || []), value]

        setDisabledInputs((prev) => ({
          ...prev,
          [`regular-${newArts.length - 1}`]: true
        }))

        saveToLocalStorage(
          newArts,
          secretFightingArts || [],
          'A new fighting art has been mastered.'
        )
      } else {
        if (isAtSecretFightingArtLimit())
          return toast.warning(
            survivorType === SurvivorType.ARC
              ? 'Arc survivors can only have 1 Secret Fighting Art.'
              : 'Survivors can only have 3 total Fighting Arts and Secret Fighting Arts combined.'
          )

        const newArts = [...(secretFightingArts || []), value]
        form.setValue('secretFightingArts', newArts)

        setDisabledInputs((prev) => ({
          ...prev,
          [`secret-${newArts.length - 1}`]: true
        }))

        saveToLocalStorage(
          fightingArts || [],
          newArts,
          'A new secret fighting art has been mastered.'
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
  const onEdit = (art: CombinedFightingArt) =>
    setDisabledInputs((prev) => ({
      ...prev,
      [`${art.type}-${art.originalIndex}`]: false
    }))

  /**
   * Handle toggling the canUseFightingArtsOrKnowledges checkbox
   */
  const updateCanUseFightingArtsOrKnowledges = (checked: boolean) => {
    saveSurvivor(
      { canUseFightingArtsOrKnowledges: !checked },
      !checked
        ? 'The survivor recalls the ways of battle.'
        : 'The survivor has forgotten their fighting techniques.'
    )
  }

  /**
   * Checks if we've reached the regular fighting arts limit
   *
   * - ARC survivors can have 1 fighting art and 1 secret fighting art
   * - Regular survivors can have 3 total (fighting + secret combined)
   *
   * @returns boolean True if at limit, false otherwise
   */
  const isAtRegularFightingArtLimit = () =>
    survivorType === SurvivorType.ARC
      ? (fightingArts || []).length >= 1
      : totalArts >= 3

  /**
   * Checks if we've reached the secret fighting arts limit
   *
   * - ARC survivors can have 1 fighting art and 1 secret fighting art
   * - Regular survivors can have 3 total (fighting + secret combined)
   *
   * @returns boolean True if at limit, false otherwise
   */
  const isAtSecretFightingArtLimit = () =>
    survivorType === SurvivorType.ARC
      ? (secretFightingArts || []).length >= 1
      : totalArts >= 3

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
        const newOrder = arrayMove(fightingArts || [], oldIndex, newIndex)
        form.setValue('fightingArts', newOrder)
        saveToLocalStorage(newOrder, secretFightingArts || [])

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
        const newOrder = arrayMove(secretFightingArts || [], oldIndex, newIndex)
        form.setValue('secretFightingArts', newOrder)
        saveToLocalStorage(fightingArts || [], newOrder)

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
  if (settlement.campaignType === CampaignType.SQUIRES_OF_THE_CITADEL)
    return <></>

  return (
    <Card className="p-0 border-1 gap-2">
      <CardHeader className="px-2 pt-1 pb-0">
        <div className="flex justify-between items-center">
          {/* Title */}
          <CardTitle className="text-sm flex flex-row items-center gap-1 h-8">
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
                      onClick={addRegularFightingArt}
                      disabled={isAtRegularFightingArtLimit()}>
                      Fighting Art
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={addSecretFightingArt}
                      disabled={isAtSecretFightingArtLimit()}>
                      Secret Fighting Art
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </CardTitle>
        </div>
      </CardHeader>

      {/* Fighting Arts List */}
      <CardContent className="p-1 pb-2 pt-0">
        <div className="flex flex-col h-[120px]">
          <div className="flex-1 overflow-y-auto">
            {/* Regular Fighting Arts */}
            {fightingArts?.length !== 0 && (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={(event) => handleDragEnd(event, 'regular')}>
                <SortableContext
                  items={(fightingArts || []).map((_, index) =>
                    index.toString()
                  )}
                  strategy={verticalListSortingStrategy}>
                  {(fightingArts || []).map((art, index) => (
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
            {secretFightingArts?.length !== 0 && (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={(event) => handleDragEnd(event, 'secret')}>
                <SortableContext
                  items={(secretFightingArts || []).map((_, index) =>
                    index.toString()
                  )}
                  strategy={verticalListSortingStrategy}>
                  {(secretFightingArts || []).map((art, index) => (
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

          {/* Cannot Use Fighting Arts - Bottom Right */}
          <div className="flex justify-end mt-2 pr-2">
            <div className="flex items-center gap-2">
              <Checkbox
                id="canUseFightingArtsOrKnowledges"
                checked={!canUseFightingArtsOrKnowledges}
                onCheckedChange={updateCanUseFightingArtsOrKnowledges}
              />
              <Label
                htmlFor="canUseFightingArtsOrKnowledges"
                className="text-xs cursor-pointer">
                Cannot Use Fighting Arts
              </Label>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
