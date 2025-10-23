'use client'

import { HuntMonsterAttributes } from '@/components/hunt/hunt-monster/hunt-monster-attributes'
import { HuntMonsterBaseStats } from '@/components/hunt/hunt-monster/hunt-monster-base-stats'
import { HuntMonsterTraitsMoods } from '@/components/hunt/hunt-monster/hunt-monster-traits-moods'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { Hunt, HuntMonster, HuntMonsterSchema } from '@/schemas/hunt'
import { zodResolver } from '@hookform/resolvers/zod'
import { CheckIcon, SkullIcon } from 'lucide-react'
import { ReactElement, useEffect, useState } from 'react'
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
  selectedHunt: Partial<Hunt> | null
}

/**
 * Monster Card Component
 *
 * Displays updatable monster information for the hunt.
 *
 * @param props Hunt Monster Card Properties
 * @returns Monster Card Component
 */
export function HuntMonsterCard({
  saveSelectedHunt,
  selectedHunt
}: HuntMonsterCardProps): ReactElement {
  const monster = selectedHunt?.monster

  const form = useForm<HuntMonster>({
    resolver: zodResolver(HuntMonsterSchema) as Resolver<HuntMonster>,
    defaultValues: HuntMonsterSchema.parse(monster || {})
  })

  // State for managing trait and mood editing
  const [disabledTraits, setDisabledTraits] = useState<{
    [key: number]: boolean
  }>({})
  const [disabledMoods, setDisabledMoods] = useState<{
    [key: number]: boolean
  }>({})
  const [isAddingTrait, setIsAddingTrait] = useState<boolean>(false)
  const [isAddingMood, setIsAddingMood] = useState<boolean>(false)

  // State for managing monster notes
  const [notesDraft, setNotesDraft] = useState<string>(
    selectedHunt?.monster?.notes || ''
  )
  const [isNotesDirty, setIsNotesDirty] = useState<boolean>(false)

  // Update form values when monster data changes
  useEffect(() => {
    if (monster) form.reset(monster)
  }, [monster, form])

  // Initialize disabled states for traits and moods
  useEffect(() => {
    setDisabledTraits((prev) => {
      const next: { [key: number]: boolean } = {}
      monster?.traits?.forEach((_, i) => {
        next[i] = prev[i] !== undefined ? prev[i] : true
      })
      return next
    })

    setDisabledMoods((prev) => {
      const next: { [key: number]: boolean } = {}
      monster?.moods?.forEach((_, i) => {
        next[i] = prev[i] !== undefined ? prev[i] : true
      })
      return next
    })
  }, [monster?.traits, monster?.moods])

  // Update notes draft when selected hunt changes
  useEffect(() => {
    setNotesDraft(selectedHunt?.monster?.notes || '')
    setIsNotesDirty(false)
  }, [selectedHunt?.monster?.notes])

  /**
   * Save Monster Data
   */
  const saveMonsterData = (
    updateData: Partial<HuntMonster>,
    successMsg?: string
  ) => {
    if (!selectedHunt?.monster) return

    try {
      const updatedMonster = {
        ...selectedHunt.monster,
        ...updateData
      }

      // Validate the updated monster data
      HuntMonsterSchema.parse(updatedMonster)

      // Update the hunt with the modified monster
      saveSelectedHunt({ monster: updatedMonster }, successMsg)

      // Update the form with the new values
      form.reset(HuntMonsterSchema.parse(updatedMonster))
    } catch (error) {
      console.error('Monster Save Error:', error)

      if (error instanceof ZodError && error.errors[0]?.message)
        toast.error(error.errors[0].message)
      else toast.error('The darkness swallows your words. Please try again.')
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
   * Handle Trait Operations
   */
  const onRemoveTrait = (index: number) => {
    const currentTraits = [...(monster?.traits || [])]
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

    saveTraitsAndMoods(currentTraits, undefined, 'The trait fades from memory.')
  }

  const onSaveTrait = (value?: string, i?: number) => {
    if (!value || value.trim() === '')
      return toast.error('A nameless trait cannot be recorded.')

    const updatedTraits = [...(monster?.traits || [])]

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
      i !== undefined ? 'The trait has been updated.' : 'A new trait emerges.'
    )
    setIsAddingTrait(false)
  }

  const onEditTrait = (index: number) =>
    setDisabledTraits((prev) => ({ ...prev, [index]: false }))

  /**
   * Handle Mood Operations
   */
  const onRemoveMood = (index: number) => {
    const currentMoods = [...(monster?.moods || [])]
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

    saveTraitsAndMoods(undefined, currentMoods, 'The mood shifts away.')
  }

  const onSaveMood = (value?: string, i?: number) => {
    if (!value || value.trim() === '')
      return toast.error('A nameless mood cannot be recorded.')

    const updatedMoods = [...(monster?.moods || [])]

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
      i !== undefined ? 'The mood has been updated.' : 'A new mood takes hold.'
    )
    setIsAddingMood(false)
  }

  const onEditMood = (index: number) =>
    setDisabledMoods((prev) => ({ ...prev, [index]: false }))

  /**
   * Handle Save Notes
   */
  const handleSaveNotes = () => {
    setIsNotesDirty(false)

    saveSelectedHunt(
      {
        monster: {
          ...selectedHunt?.monster,
          notes: notesDraft
        } as HuntMonster
      },
      'The tales of this hunt are recorded for future generations.'
    )
  }

  if (!monster) return <></>

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
              {monster.name}
              <div className="text-xs text-muted-foreground">
                {monster.type}
              </div>
            </div>

            <Badge variant="outline" className="text-xs">
              Level {monster.level}
            </Badge>
          </div>

          {/* Knocked Down Status */}
          <div className="flex items-center space-x-1">
            <Checkbox
              id="knocked-down"
              checked={monster.knockedDown}
              onCheckedChange={(checked) =>
                saveMonsterData(
                  { knockedDown: !!checked },
                  checked
                    ? 'The monster will start the showdown knocked down.'
                    : 'The monster will start the showdown standing.'
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
          {/* First Column: Base Stats and Attributes */}
          <div className="flex flex-col flex-1">
            <HuntMonsterBaseStats
              monster={monster}
              saveMonsterData={saveMonsterData}
            />

            <Separator className="my-1" />

            <HuntMonsterAttributes
              monster={monster}
              saveMonsterData={saveMonsterData}
            />
          </div>

          {/* Separator between columns (hidden on mobile) */}
          <div className="hidden lg:flex lg:items-stretch">
            <Separator orientation="vertical" className="mx-2" />
          </div>

          {/* Mobile separator (shown only on mobile) */}
          <Separator className="my-2 lg:hidden" />

          {/* Second Column: Traits, Moods, and Notes */}
          <div className="flex flex-col flex-1">
            <HuntMonsterTraitsMoods
              monster={monster}
              disabledTraits={disabledTraits}
              disabledMoods={disabledMoods}
              isAddingTrait={isAddingTrait}
              isAddingMood={isAddingMood}
              setIsAddingTrait={setIsAddingTrait}
              setIsAddingMood={setIsAddingMood}
              onEditTrait={onEditTrait}
              onSaveTrait={onSaveTrait}
              onRemoveTrait={onRemoveTrait}
              onEditMood={onEditMood}
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
                    e.target.value !== selectedHunt?.monster?.notes
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
