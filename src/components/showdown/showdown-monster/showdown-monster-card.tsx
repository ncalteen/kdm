'use client'

import { TraitsMoods } from '@/components/monster/traits-moods/traits-moods'
import { ShowdownMonsterAttributes } from '@/components/showdown/showdown-monster/showdown-monster-attributes'
import { ShowdownMonsterBaseStats } from '@/components/showdown/showdown-monster/showdown-monster-base-stats'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import {
  ERROR_MESSAGE,
  MOOD_CREATED_MESSAGE,
  MOOD_REMOVED_MESSAGE,
  MOOD_UPDATED_MESSAGE,
  NAMELESS_OBJECT_ERROR_MESSAGE,
  SHOWDOWN_MONSTER_KNOCKED_DOWN_MESSAGE,
  SHOWDOWN_NOTES_SAVED_MESSAGE,
  TRAIT_CREATED_MESSAGE,
  TRAIT_REMOVED_MESSAGE,
  TRAIT_UPDATED_MESSAGE
} from '@/lib/messages'
import {
  Showdown,
  ShowdownMonster,
  ShowdownMonsterSchema
} from '@/schemas/showdown'
import { zodResolver } from '@hookform/resolvers/zod'
import { CheckIcon, SkullIcon } from 'lucide-react'
import { ReactElement, useEffect, useMemo, useState } from 'react'
import { Resolver, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { ZodError } from 'zod'

/**
 * Showdown Monster Card Component Properties
 */
interface ShowdownMonsterCardProps {
  /** Save Selected Showdown */
  saveSelectedShowdown: (
    updateData: Partial<Showdown>,
    successMsg?: string
  ) => void
  /** Selected Showdown */
  selectedShowdown: Showdown | null
}

/**
 * Showdown Monster Card Component
 *
 * Displays updatable monster information for a showdown.
 *
 * @param props Showdown Monster Card Properties
 * @returns Monster Card Component
 */
export function ShowdownMonsterCard({
  saveSelectedShowdown,
  selectedShowdown
}: ShowdownMonsterCardProps): ReactElement {
  const form = useForm<ShowdownMonster>({
    resolver: zodResolver(ShowdownMonsterSchema) as Resolver<ShowdownMonster>,
    defaultValues: ShowdownMonsterSchema.parse(selectedShowdown?.monster || {})
  })

  // Compute the initial disabled state based on current traits
  const initialDisabledTraits = useMemo(() => {
    const next: { [key: number]: boolean } = {}
    selectedShowdown?.monster?.traits?.forEach((_, i) => {
      next[i] = true
    })
    return next
  }, [selectedShowdown?.monster?.traits])

  // Compute the initial disabled state based on current moods
  const initialDisabledMoods = useMemo(() => {
    const next: { [key: number]: boolean } = {}
    selectedShowdown?.monster?.moods?.forEach((_, i) => {
      next[i] = true
    })
    return next
  }, [selectedShowdown?.monster?.moods])

  // State for managing trait and mood editing
  const [disabledTraits, setDisabledTraits] = useState<{
    [key: number]: boolean
  }>(initialDisabledTraits)
  const [disabledMoods, setDisabledMoods] = useState<{
    [key: number]: boolean
  }>(initialDisabledMoods)
  const [isAddingTrait, setIsAddingTrait] = useState<boolean>(false)
  const [isAddingMood, setIsAddingMood] = useState<boolean>(false)

  // State for managing monster notes
  const [notesDraft, setNotesDraft] = useState<string>(
    selectedShowdown?.monster?.notes || ''
  )
  const [isNotesDirty, setIsNotesDirty] = useState<boolean>(false)

  // Update form values when monster data changes
  useEffect(() => {
    if (selectedShowdown?.monster) form.reset(selectedShowdown?.monster)
  }, [selectedShowdown?.monster, form])

  // Update disabled inputs when the computed initial state changes
  useEffect(() => {
    console.debug('[ShowdownMonsterCard] Initialize Disabled Traits')

    setDisabledTraits(initialDisabledTraits)
  }, [initialDisabledTraits])

  useEffect(() => {
    console.debug('[ShowdownMonsterCard] Initialize Disabled Moods')

    setDisabledMoods(initialDisabledMoods)
  }, [initialDisabledMoods])

  // Update notes draft when selected showdown changes
  useEffect(() => {
    setNotesDraft(selectedShowdown?.monster?.notes || '')
    setIsNotesDirty(false)
  }, [selectedShowdown?.monster?.notes])

  /**
   * Save Monster Data
   */
  const saveMonsterData = (
    updateData: Partial<ShowdownMonster>,
    successMsg?: string
  ) => {
    if (!selectedShowdown?.monster) return

    try {
      const updatedMonster = {
        ...selectedShowdown.monster,
        ...updateData
      }

      // Validate the updated monster data
      ShowdownMonsterSchema.parse(updatedMonster)

      // Update the showdown with the modified monster
      saveSelectedShowdown({ monster: updatedMonster }, successMsg)

      // Update the form with the new values
      form.reset(ShowdownMonsterSchema.parse(updatedMonster))
    } catch (error) {
      console.error('Showdown Monster Save Error:', error)

      if (error instanceof ZodError && error.issues[0]?.message)
        toast.error(error.issues[0].message)
      else toast.error(ERROR_MESSAGE())
    }
  }

  /**
   * Save Monster Data with Traits/Moods Updates
   */
  const saveTraitsAndMoods = (
    traits?: string[],
    moods?: string[],
    successMsg?: string
  ) => {
    const updateData: Partial<ShowdownMonster> = {}

    if (traits !== undefined) updateData.traits = traits
    if (moods !== undefined) updateData.moods = moods

    saveMonsterData(updateData, successMsg)
  }

  /**
   * Trait Operations
   */

  const onRemoveTrait = (index: number) => {
    const currentTraits = [...(selectedShowdown?.monster?.traits || [])]
    currentTraits.splice(index, 1)

    setDisabledTraits((prev) => {
      const next: { [key: number]: boolean } = {}
      Object.keys(prev).forEach((k) => {
        const num = parseInt(k)
        if (num < index) next[num] = prev[num]
        else if (num > index) next[num - 1] = prev[num]
      })
      return next
    })

    saveTraitsAndMoods(currentTraits, undefined, TRAIT_REMOVED_MESSAGE())
  }

  const onSaveTrait = (value?: string, i?: number) => {
    if (!value || value.trim() === '')
      return toast.error(NAMELESS_OBJECT_ERROR_MESSAGE('trait'))

    const updatedTraits = [...(selectedShowdown?.monster?.traits || [])]

    if (i !== undefined) {
      updatedTraits[i] = value
      setDisabledTraits((prev) => ({ ...prev, [i]: true }))
    } else {
      updatedTraits.push(value)
      setDisabledTraits((prev) => ({
        ...prev,
        [updatedTraits.length - 1]: true
      }))
    }

    saveTraitsAndMoods(
      updatedTraits,
      undefined,
      i !== undefined ? TRAIT_UPDATED_MESSAGE() : TRAIT_CREATED_MESSAGE()
    )
    setIsAddingTrait(false)
  }

  /**
   * Mood Operations
   */

  const onRemoveMood = (index: number) => {
    const currentMoods = [...(selectedShowdown?.monster?.moods || [])]
    currentMoods.splice(index, 1)

    setDisabledMoods((prev) => {
      const next: { [key: number]: boolean } = {}
      Object.keys(prev).forEach((k) => {
        const num = parseInt(k)
        if (num < index) next[num] = prev[num]
        else if (num > index) next[num - 1] = prev[num]
      })
      return next
    })

    saveTraitsAndMoods(undefined, currentMoods, MOOD_REMOVED_MESSAGE())
  }

  const onSaveMood = (value?: string, i?: number) => {
    if (!value || value.trim() === '')
      return toast.error(NAMELESS_OBJECT_ERROR_MESSAGE('mood'))

    const updatedMoods = [...(selectedShowdown?.monster?.moods || [])]

    if (i !== undefined) {
      updatedMoods[i] = value
      setDisabledMoods((prev) => ({ ...prev, [i]: true }))
    } else {
      updatedMoods.push(value)
      setDisabledMoods((prev) => ({
        ...prev,
        [updatedMoods.length - 1]: true
      }))
    }

    saveTraitsAndMoods(
      undefined,
      updatedMoods,
      i !== undefined ? MOOD_UPDATED_MESSAGE() : MOOD_CREATED_MESSAGE()
    )
    setIsAddingMood(false)
  }

  /**
   * Handle Save Notes
   */
  const handleSaveNotes = () => {
    setIsNotesDirty(false)

    saveSelectedShowdown(
      {
        monster: {
          ...selectedShowdown?.monster,
          notes: notesDraft
        } as ShowdownMonster
      },
      SHOWDOWN_NOTES_SAVED_MESSAGE()
    )
  }

  if (!selectedShowdown?.monster) return <></>

  return (
    <Card className="w-full min-w-[430px] border-2 rounded-xl p-0 gap-0 transition-all duration-200 hover:shadow-lg">
      <CardHeader className="flex p-3 border-b-1 bg-red-100/50 dark:bg-red-950/30">
        <div className="flex items-center gap-3 w-full py-0 pb-0 my-0">
          {/* Monster Icon */}
          <div className="h-12 w-12 bg-red-200 dark:bg-red-800 rounded-full flex items-center justify-center">
            <SkullIcon className="h-6 w-6 text-red-700 dark:text-red-300" />
          </div>

          <div className="text-left flex-1 min-w-0">
            <div className="font-semibold text-sm truncate flex gap-2 items-center">
              {selectedShowdown.monster.name}
              <div className="text-xs text-muted-foreground">
                {selectedShowdown.monster.type}
              </div>
            </div>

            <Badge variant="outline" className="text-xs">
              Level {selectedShowdown.monster.level}
            </Badge>
          </div>

          {/* Knocked Down Status */}
          <div className="flex items-center space-x-1">
            <Checkbox
              id="knocked-down"
              checked={selectedShowdown.monster.knockedDown}
              onCheckedChange={(checked) =>
                saveMonsterData(
                  { knockedDown: !!checked },
                  SHOWDOWN_MONSTER_KNOCKED_DOWN_MESSAGE(!!checked)
                )
              }
              className="h-4 w-4"
            />

            <Label htmlFor="knocked-down" className="text-xs">
              Knocked Down
            </Label>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-2 py-0 mt-0">
        <div className="flex flex-col lg:flex-row lg:gap-2">
          {/* Column: Base Stats and Attributes */}
          <div className="flex flex-col flex-1">
            <ShowdownMonsterBaseStats
              monster={selectedShowdown.monster}
              saveMonsterData={saveMonsterData}
            />

            <Separator className="my-1" />

            <ShowdownMonsterAttributes
              monster={selectedShowdown.monster}
              saveMonsterData={saveMonsterData}
            />
          </div>

          {/* Separator: Hidden on Mobile */}
          <div className="hidden lg:flex lg:items-stretch">
            <Separator orientation="vertical" className="mx-2" />
          </div>

          {/* Separator: Mobile */}
          <Separator className="my-2 lg:hidden" />

          {/* Column: Traits, Moods, and Notes */}
          <div className="flex flex-col flex-1">
            <TraitsMoods
              monster={selectedShowdown.monster}
              disabledTraits={disabledTraits}
              disabledMoods={disabledMoods}
              isAddingTrait={isAddingTrait}
              isAddingMood={isAddingMood}
              setIsAddingTrait={setIsAddingTrait}
              setIsAddingMood={setIsAddingMood}
              onEditTrait={(index: number) =>
                setDisabledTraits((prev) => ({ ...prev, [index]: false }))
              }
              onSaveTrait={onSaveTrait}
              onRemoveTrait={onRemoveTrait}
              onEditMood={(index: number) =>
                setDisabledMoods((prev) => ({ ...prev, [index]: false }))
              }
              onSaveMood={onSaveMood}
              onRemoveMood={onRemoveMood}
            />

            <Separator className="my-2" />

            {/* Showdown Monster Notes Section */}
            <div className="flex flex-col gap-2 pb-2">
              <Textarea
                value={notesDraft}
                name="showdown-monster-notes"
                id="showdown-monster-notes"
                onChange={(e) => {
                  setNotesDraft(e.target.value)
                  setIsNotesDirty(
                    e.target.value !== selectedShowdown?.monster?.notes
                  )
                }}
                placeholder="Add notes about the showdown monster..."
                className="w-full resize-none"
                style={{ minHeight: '125px' }}
              />

              <div className="flex justify-end">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={handleSaveNotes}
                  disabled={!isNotesDirty}
                  title="Save showdown monster notes">
                  <CheckIcon className="h-4 w-4" />
                  Save
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
