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
  FIGHTING_ARTS_MAX_EXCEEDED_ERROR_MESSAGE,
  NAMELESS_OBJECT_ERROR_MESSAGE,
  SECRET_FIGHTING_ARTS_MAX_EXCEEDED_ERROR_MESSAGE,
  SURVIVOR_CAN_USE_FIGHTING_ARTS_UPDATED_MESSAGE,
  SURVIVOR_FIGHTING_ART_REMOVED_MESSAGE,
  SURVIVOR_FIGHTING_ART_UPDATED_MESSAGE
} from '@/lib/messages'
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
import { PlusIcon } from 'lucide-react'
import { ReactElement, useEffect, useState } from 'react'
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
 * Fighting Arts Card Properties
 */
interface FightingArtsCardProps {
  /** Save Selected Survivor */
  saveSelectedSurvivor: (data: Partial<Survivor>, successMsg?: string) => void
  /** Selected Settlemenet */
  selectedSettlement: Partial<Settlement> | null
  /** Selected Survivor */
  selectedSurvivor: Partial<Survivor> | null
}

/**
 * Fighting Arts Card Component
 *
 * @param form Form
 * @returns Fighting Arts Card Component
 */
export function FightingArtsCard({
  saveSelectedSurvivor,
  selectedSettlement,
  selectedSurvivor
}: FightingArtsCardProps): ReactElement {
  // Determine survivor type from settlement data
  const survivorType = selectedSettlement?.survivorType || SurvivorType.CORE

  // Calculate total arts to check against limits
  const totalArts =
    (selectedSurvivor?.fightingArts?.length || 0) +
    (selectedSurvivor?.secretFightingArts?.length || 0)

  // Track state for input editing
  const [disabledInputs, setDisabledInputs] = useState<{
    [key: string]: boolean
  }>({})

  // Track which type we're currently adding
  const [newArtType, setNewArtType] = useState<'regular' | 'secret'>('regular')
  const [isAddingNew, setIsAddingNew] = useState<boolean>(false)

  // Initialize disabled inputs for fighting arts
  useEffect(() => {
    console.debug('[FightingArtsCard] Initialize Disabled Inputs')

    setDisabledInputs((prev) => {
      const next: { [key: string]: boolean } = {}

      selectedSurvivor?.fightingArts?.forEach((_, index) => {
        const key = `regular-${index}`
        next[key] = prev[key] !== undefined ? prev[key] : true
      })

      selectedSurvivor?.secretFightingArts?.forEach((_, index) => {
        const key = `secret-${index}`
        next[key] = prev[key] !== undefined ? prev[key] : true
      })

      return next
    })
  }, [selectedSurvivor?.fightingArts, selectedSurvivor?.secretFightingArts])

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
    saveSelectedSurvivor(
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
      const currentArts = [...(selectedSurvivor?.fightingArts || [])]
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
        selectedSurvivor?.secretFightingArts || [],
        SURVIVOR_FIGHTING_ART_REMOVED_MESSAGE(false)
      )
    } else {
      const currentArts = [...(selectedSurvivor?.secretFightingArts || [])]
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
        selectedSurvivor?.fightingArts || [],
        currentArts,
        SURVIVOR_FIGHTING_ART_REMOVED_MESSAGE(true)
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
      return toast.error(NAMELESS_OBJECT_ERROR_MESSAGE('fighting art'))

    if (art) {
      // Updating an existing fighting art
      const key = `${art.type}-${art.originalIndex}`

      if (art.type === 'regular') {
        const updated = [...(selectedSurvivor?.fightingArts || [])]
        updated[art.originalIndex] = value

        setDisabledInputs((prev) => ({ ...prev, [key]: true }))
        saveToLocalStorage(
          updated,
          selectedSurvivor?.secretFightingArts || [],
          SURVIVOR_FIGHTING_ART_UPDATED_MESSAGE(false, false)
        )
      } else {
        const updated = [...(selectedSurvivor?.secretFightingArts || [])]
        updated[art.originalIndex] = value

        setDisabledInputs((prev) => ({ ...prev, [key]: true }))
        saveToLocalStorage(
          selectedSurvivor?.fightingArts || [],
          updated,
          SURVIVOR_FIGHTING_ART_UPDATED_MESSAGE(true, false)
        )
      }
    } else {
      // Adding a new fighting art
      if (newArtType === 'regular') {
        if (isAtRegularFightingArtLimit())
          return toast.warning(
            FIGHTING_ARTS_MAX_EXCEEDED_ERROR_MESSAGE(survivorType)
          )

        const newArts = [...(selectedSurvivor?.fightingArts || []), value]

        setDisabledInputs((prev) => ({
          ...prev,
          [`regular-${newArts.length - 1}`]: true
        }))

        saveToLocalStorage(
          newArts,
          selectedSurvivor?.secretFightingArts || [],
          SURVIVOR_FIGHTING_ART_UPDATED_MESSAGE(false, true)
        )
      } else {
        if (isAtSecretFightingArtLimit())
          return toast.warning(
            SECRET_FIGHTING_ARTS_MAX_EXCEEDED_ERROR_MESSAGE(survivorType)
          )

        const newArts = [...(selectedSurvivor?.secretFightingArts || []), value]

        setDisabledInputs((prev) => ({
          ...prev,
          [`secret-${newArts.length - 1}`]: true
        }))

        saveToLocalStorage(
          selectedSurvivor?.fightingArts || [],
          newArts,
          SURVIVOR_FIGHTING_ART_UPDATED_MESSAGE(true, true)
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
    saveSelectedSurvivor(
      { canUseFightingArtsOrKnowledges: !checked },
      SURVIVOR_CAN_USE_FIGHTING_ARTS_UPDATED_MESSAGE(!checked)
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
      ? (selectedSurvivor?.fightingArts || []).length >= 1
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
      ? (selectedSurvivor?.secretFightingArts || []).length >= 1
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
        const newOrder = arrayMove(
          selectedSurvivor?.fightingArts || [],
          oldIndex,
          newIndex
        )
        saveToLocalStorage(newOrder, selectedSurvivor?.secretFightingArts || [])

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
        const newOrder = arrayMove(
          selectedSurvivor?.secretFightingArts || [],
          oldIndex,
          newIndex
        )
        saveToLocalStorage(selectedSurvivor?.fightingArts || [], newOrder)

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
  if (selectedSettlement?.campaignType === CampaignType.SQUIRES_OF_THE_CITADEL)
    return <></>

  return (
    <Card className="p-2 border-0 gap-0">
      {/* Title */}
      <CardHeader className="p-0">
        <CardTitle className="p-0 text-sm flex flex-row items-center justify-between h-8">
          Fighting Arts &amp; Secret Fighting Arts
          {!isAddingNew && (
            <div className="flex justify-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="h-6 w-6"
                    disabled={
                      isAddingNew ||
                      Object.values(disabledInputs).some((v) => v === false)
                    }>
                    <PlusIcon />
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
      </CardHeader>

      {/* Fighting Arts List */}
      <CardContent className="p-0">
        <div className="flex flex-col">
          {/* Fighting Arts */}
          {selectedSurvivor?.fightingArts?.length !== 0 && (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={(event) => handleDragEnd(event, 'regular')}>
              <SortableContext
                items={(selectedSurvivor?.fightingArts || []).map((_, index) =>
                  index.toString()
                )}
                strategy={verticalListSortingStrategy}>
                {(selectedSurvivor?.fightingArts || []).map((art, index) => (
                  <FightingArtItem
                    key={`regular-${index}`}
                    id={index.toString()}
                    index={index}
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
                    selectedSurvivor={selectedSurvivor}
                  />
                ))}
              </SortableContext>
            </DndContext>
          )}

          {/* Secret Fighting Arts */}
          {selectedSurvivor?.secretFightingArts?.length !== 0 && (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={(event) => handleDragEnd(event, 'secret')}>
              <SortableContext
                items={(selectedSurvivor?.secretFightingArts || []).map(
                  (_, index) => index.toString()
                )}
                strategy={verticalListSortingStrategy}>
                {(selectedSurvivor?.secretFightingArts || []).map(
                  (art, index) => (
                    <FightingArtItem
                      key={`secret-${index}`}
                      id={index.toString()}
                      index={index}
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
                      selectedSurvivor={selectedSurvivor}
                    />
                  )
                )}
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

        {/* Cannot Use Fighting Arts */}
        <div className="flex justify-end mt-2 pr-2">
          <div className="flex items-center gap-2">
            <Checkbox
              id="canUseFightingArtsOrKnowledges"
              checked={!selectedSurvivor?.canUseFightingArtsOrKnowledges}
              onCheckedChange={updateCanUseFightingArtsOrKnowledges}
            />
            <Label
              htmlFor="canUseFightingArtsOrKnowledges"
              className="text-xs cursor-pointer">
              Cannot Use Fighting Arts
            </Label>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
