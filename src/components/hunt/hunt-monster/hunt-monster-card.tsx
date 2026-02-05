'use client'

import { HuntMonsterAttributes } from '@/components/hunt/hunt-monster/hunt-monster-attributes'
import { HuntMonsterBaseStats } from '@/components/hunt/hunt-monster/hunt-monster-base-stats'
import { TraitsMoods } from '@/components/monster/traits-moods/traits-moods'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import {
  ERROR_MESSAGE,
  HUNT_NOTES_SAVED_MESSAGE,
  MONSTER_STARTS_SHOWDOWN_KNOCKED_DOWN_MESSAGE,
  MOOD_CREATED_MESSAGE,
  MOOD_REMOVED_MESSAGE,
  MOOD_UPDATED_MESSAGE,
  NAMELESS_OBJECT_ERROR_MESSAGE,
  TRAIT_CREATED_MESSAGE,
  TRAIT_REMOVED_MESSAGE,
  TRAIT_UPDATED_MESSAGE
} from '@/lib/messages'
import { Hunt, HuntSchema } from '@/schemas/hunt'
import { HuntMonster, HuntMonsterSchema } from '@/schemas/hunt-monster'
import { zodResolver } from '@hookform/resolvers/zod'
import { CheckIcon, SkullIcon } from 'lucide-react'
import { ReactElement, useEffect, useMemo, useState } from 'react'
import { Resolver, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { ZodError } from 'zod'

/**
 * Hunt Monster Card Component Properties
 */
interface HuntMonsterCardProps {
  /** Save Selected Hunt */
  saveSelectedHunt: (updateData: Partial<Hunt>, successMsg?: string) => void
  /** Selected Hunt */
  selectedHunt: Hunt | null
  /** Selected Hunt Monster Index */
  selectedHuntMonsterIndex: number
}

/**
 * Hunt Monster Card Component
 *
 * Displays updatable monster information for the hunt.
 *
 * @param props Hunt Monster Card Properties
 * @returns Hunt Monster Card Component
 */
export function HuntMonsterCard({
  saveSelectedHunt,
  selectedHunt,
  selectedHuntMonsterIndex
}: HuntMonsterCardProps): ReactElement {
  const form = useForm<HuntMonster>({
    resolver: zodResolver(HuntMonsterSchema) as Resolver<HuntMonster>,
    defaultValues: HuntMonsterSchema.parse(
      selectedHunt?.monsters[selectedHuntMonsterIndex] ?? {}
    )
  })

  // Compute the initial disabled state based on current traits
  const initialDisabledTraits = useMemo(() => {
    const next: { [key: number]: boolean } = {}
    selectedHunt?.monsters?.[selectedHuntMonsterIndex].traits?.forEach(
      (_, i) => {
        next[i] = true
      }
    )
    return next
  }, [selectedHunt?.monsters, selectedHuntMonsterIndex])

  // Compute the initial disabled state based on current moods
  const initialDisabledMoods = useMemo(() => {
    const next: { [key: number]: boolean } = {}
    selectedHunt?.monsters?.[selectedHuntMonsterIndex].moods?.forEach(
      (_, i) => {
        next[i] = true
      }
    )
    return next
  }, [selectedHunt?.monsters, selectedHuntMonsterIndex])

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
    selectedHunt?.monsters?.[selectedHuntMonsterIndex].notes ?? ''
  )
  const [isNotesDirty, setIsNotesDirty] = useState<boolean>(false)

  // Update form values when monster data changes
  useEffect(() => {
    if (selectedHunt?.monsters) {
      form.reset(selectedHunt?.monsters[selectedHuntMonsterIndex])
      setNotesDraft(
        selectedHunt?.monsters?.[selectedHuntMonsterIndex].notes ?? ''
      )
      setIsNotesDirty(false)
    }
  }, [selectedHunt?.monsters, selectedHuntMonsterIndex, form])

  // Update disabled inputs when the computed initial state changes
  useEffect(() => {
    console.debug('[HuntMonsterCard] Initialize Disabled Traits')

    setDisabledTraits(initialDisabledTraits)
  }, [initialDisabledTraits])

  useEffect(() => {
    console.debug('[HuntMonsterCard] Initialize Disabled Moods')

    setDisabledMoods(initialDisabledMoods)
  }, [initialDisabledMoods])

  /**
   * Save Monster Data
   */
  const saveMonsterData = (
    updateData: Partial<HuntMonster>,
    successMsg?: string
  ) => {
    if (!selectedHunt?.monsters) return

    try {
      const updatedMonsters = [
        ...selectedHunt.monsters.slice(0, selectedHuntMonsterIndex),
        {
          ...selectedHunt.monsters[selectedHuntMonsterIndex],
          ...updateData
        },
        ...selectedHunt.monsters.slice(selectedHuntMonsterIndex + 1)
      ]

      // Validate the updated monster data
      HuntSchema.parse({
        ...selectedHunt,
        monsters: updatedMonsters
      })

      // Update the hunt with the modified monster
      saveSelectedHunt({ monsters: updatedMonsters }, successMsg)

      // Update the form with the new values
      form.reset(updatedMonsters[selectedHuntMonsterIndex])
    } catch (error) {
      console.error('Hunt Monster Save Error:', error)

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
    const updateData: Partial<HuntMonster> = {}

    if (traits !== undefined) updateData.traits = traits
    if (moods !== undefined) updateData.moods = moods

    saveMonsterData(updateData, successMsg)
  }

  /**
   * Trait Operations
   */

  const onRemoveTrait = (index: number) => {
    const currentTraits = [
      ...(selectedHunt?.monsters?.[selectedHuntMonsterIndex].traits ?? [])
    ]
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

    const updatedTraits = [
      ...(selectedHunt?.monsters?.[selectedHuntMonsterIndex].traits ?? [])
    ]

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
    const currentMoods = [
      ...(selectedHunt?.monsters?.[selectedHuntMonsterIndex].moods ?? [])
    ]
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

    const updatedMoods = [
      ...(selectedHunt?.monsters?.[selectedHuntMonsterIndex].moods ?? [])
    ]

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
    if (!selectedHunt?.monsters) return

    setIsNotesDirty(false)
    saveSelectedHunt(
      {
        monsters: [
          ...selectedHunt.monsters.slice(0, selectedHuntMonsterIndex),
          {
            ...selectedHunt.monsters[selectedHuntMonsterIndex],
            notes: notesDraft
          },
          ...selectedHunt.monsters.slice(selectedHuntMonsterIndex + 1)
        ]
      },
      HUNT_NOTES_SAVED_MESSAGE()
    )
  }

  if (!selectedHunt) return <></>

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
              {selectedHunt.monsters[selectedHuntMonsterIndex].name}
            </div>

            <Badge variant="outline" className="text-xs">
              Level {selectedHunt.level.replace('level', '')}
            </Badge>
          </div>

          {/* Knocked Down Status */}
          <div className="flex items-center space-x-1">
            <Checkbox
              id="knocked-down"
              checked={
                selectedHunt.monsters[selectedHuntMonsterIndex].knockedDown
              }
              onCheckedChange={(checked) =>
                saveMonsterData(
                  { knockedDown: !!checked },
                  MONSTER_STARTS_SHOWDOWN_KNOCKED_DOWN_MESSAGE(!!checked)
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
            <HuntMonsterBaseStats
              monster={selectedHunt.monsters[selectedHuntMonsterIndex]}
              saveMonsterData={saveMonsterData}
            />

            <Separator className="my-1" />

            <HuntMonsterAttributes
              monster={selectedHunt.monsters[selectedHuntMonsterIndex]}
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
              monster={selectedHunt.monsters[selectedHuntMonsterIndex]}
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

            {/* Hunt Monster Notes Section */}
            <div className="flex flex-col gap-2 pb-2">
              <Textarea
                value={notesDraft}
                name="hunt-monster-notes"
                id="hunt-monster-notes"
                onChange={(e) => {
                  setNotesDraft(e.target.value)
                  setIsNotesDirty(
                    e.target.value !==
                      selectedHunt.monsters[selectedHuntMonsterIndex].notes
                  )
                }}
                placeholder="Add notes about your quarry..."
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
                  title="Save hunt monster notes">
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
