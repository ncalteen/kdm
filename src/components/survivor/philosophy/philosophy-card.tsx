'use client'

import { SelectPhilosophy } from '@/components/menu/select-philosophy'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Philosophy } from '@/lib/enums'
import { cn } from '@/lib/utils'
import { Survivor } from '@/schemas/survivor'
import { BrainCogIcon } from 'lucide-react'
import { ReactElement, useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'

/**
 * Philosophy Card Properties
 */
interface PhilosophyCardProps {
  /** Save Selected Survivor */
  saveSelectedSurvivor: (data: Partial<Survivor>, successMsg?: string) => void
  /** Selected Survivor */
  selectedSurvivor: Partial<Survivor> | null
  /** Set Survivors */
  setSurvivors: (survivors: Survivor[]) => void
  /** Survivors */
  survivors: Survivor[] | null
}

/**
 * Philosophy Card Component
 *
 * @param props Philosophy Card Properties
 * @returns Philosophy Card Component
 */
export function PhilosophyCard({
  saveSelectedSurvivor,
  selectedSurvivor,
  setSurvivors,
  survivors
}: PhilosophyCardProps): ReactElement {
  // Local state for text fields to enable controlled components that update when survivor changes
  const [neurosis, setNeurosis] = useState(selectedSurvivor?.neurosis ?? '')
  const [tenetKnowledge, setTenetKnowledge] = useState(
    selectedSurvivor?.tenetKnowledge ?? ''
  )
  const [tenetKnowledgeRules, setTenetKnowledgeRules] = useState(
    selectedSurvivor?.tenetKnowledgeRules ?? ''
  )
  const [
    tenetKnowledgeObservationConditions,
    setTenetKnowledgeObservationConditions
  ] = useState(selectedSurvivor?.tenetKnowledgeObservationConditions ?? '')

  // Update local state when selected survivor changes
  useEffect(() => {
    setNeurosis(selectedSurvivor?.neurosis ?? '')
    setTenetKnowledge(selectedSurvivor?.tenetKnowledge ?? '')
    setTenetKnowledgeRules(selectedSurvivor?.tenetKnowledgeRules ?? '')
    setTenetKnowledgeObservationConditions(
      selectedSurvivor?.tenetKnowledgeObservationConditions ?? ''
    )
  }, [
    selectedSurvivor?.neurosis,
    selectedSurvivor?.tenetKnowledge,
    selectedSurvivor?.tenetKnowledgeRules,
    selectedSurvivor?.tenetKnowledgeObservationConditions
  ])

  /**
   * Handles the change of philosophy selection.
   *
   * @param value Value
   */
  const handlePhilosophyChange = useCallback(
    (value: string) => {
      const updateData: Partial<Survivor> = {
        philosophy: value === '' ? null : (value as Philosophy),
        ...(value ? {} : { philosophyRank: 0 })
      }

      saveSelectedSurvivor(
        updateData,
        value
          ? 'The path of wisdom begins to illuminate the darkness.'
          : 'The philosophical path returns to shadow.'
      )

      // Update the survivors context to trigger re-renders in settlement table
      if (survivors && selectedSurvivor?.id) {
        const updatedSurvivors = survivors.map((s) =>
          s.id === selectedSurvivor?.id ? { ...s, ...updateData } : s
        )

        // Update both localStorage and context
        localStorage.setItem('survivors', JSON.stringify(updatedSurvivors))
        setSurvivors(updatedSurvivors)
      }
    },
    [saveSelectedSurvivor, survivors, selectedSurvivor?.id, setSurvivors]
  )

  /**
   * Handles right-clicking on tenet knowledge observation rank checkboxes to toggle rank up milestone
   *
   * @param index The index of the checkbox (0-based)
   * @param event The mouse event
   */
  const handleRightClick = useCallback(
    (index: number, event: React.MouseEvent) => {
      event.preventDefault()

      const newRankUp =
        selectedSurvivor?.tenetKnowledgeRankUp === index ? undefined : index

      saveSelectedSurvivor(
        { tenetKnowledgeRankUp: newRankUp },
        newRankUp !== undefined
          ? 'Tenet knowledge rank up milestone marked.'
          : 'Tenet knowledge rank up milestone removed.'
      )
    },
    [selectedSurvivor?.tenetKnowledgeRankUp, saveSelectedSurvivor]
  )

  /**
   * Update Philosophy Rank
   */
  const updatePhilosophyRank = useCallback(
    (val: string) => {
      const value = parseInt(val) || 0

      // Enforce minimum value of 0
      if (value < 0) return toast.error('Philosophy rank cannot be negative.')

      const updateData: Partial<Survivor> = { philosophyRank: value }

      saveSelectedSurvivor(updateData, 'Philosophy rank has been updated.')

      // Update the survivors context to trigger re-renders in settlement table
      if (survivors && selectedSurvivor?.id) {
        const updatedSurvivors = survivors.map((s) =>
          s.id === selectedSurvivor?.id ? { ...s, ...updateData } : s
        )

        // Update both localStorage and context
        localStorage.setItem('survivors', JSON.stringify(updatedSurvivors))
        setSurvivors(updatedSurvivors)
      }
    },
    [saveSelectedSurvivor, survivors, selectedSurvivor?.id, setSurvivors]
  )

  /**
   * Update Neurosis
   */
  const updateNeurosis = (value: string) => {
    setNeurosis(value)
    saveSelectedSurvivor(
      { neurosis: value },
      value
        ? 'The neurosis manifests in the mind.'
        : 'The neurosis fades into darkness.'
    )
  }

  /**
   * Update Tenet Knowledge
   */
  const updateTenetKnowledge = (value: string) => {
    setTenetKnowledge(value)
    saveSelectedSurvivor(
      { tenetKnowledge: value },
      value
        ? 'Tenet knowledge is inscribed in memory.'
        : 'Tenet knowledge dissolves into shadow.'
    )
  }

  /**
   * Update Tenet Knowledge Observation Rank
   */
  const updateTenetKnowledgeObservationRank = (
    checked: boolean,
    index: number
  ) => {
    const newRank = checked
      ? index + 1
      : (selectedSurvivor?.tenetKnowledgeObservationRank || 0) === index + 1
        ? index
        : undefined

    if (newRank === undefined) return

    // Check if this is a rank up milestone
    const isRankUp = checked && selectedSurvivor?.tenetKnowledgeRankUp === index

    // Save to localStorage
    saveSelectedSurvivor(
      { tenetKnowledgeObservationRank: newRank },
      isRankUp
        ? 'Wisdom ascends through knowledge and understanding. Rank up achieved!'
        : `Observation rank ${newRank} burns bright in the lantern's glow.`
    )
  }

  /**
   * Update Tenet Knowledge Rules
   */
  const updateTenetKnowledgeRules = (value: string) => {
    setTenetKnowledgeRules(value)
    saveSelectedSurvivor(
      { tenetKnowledgeRules: value },
      value
        ? 'The rules of knowledge are etched in stone.'
        : 'The rules fade back into mystery.'
    )
  }

  /**
   * Update Tenet Knowledge Observation Conditions
   */
  const updateTenetKnowledgeObservationConditions = (value: string) => {
    setTenetKnowledgeObservationConditions(value)
    saveSelectedSurvivor(
      { tenetKnowledgeObservationConditions: value },
      value
        ? "Observation conditions are recorded in the survivor's memory."
        : 'The conditions vanish into the void.'
    )
  }

  return (
    <Card className="p-0 border-1 gap-2 h-[483px] justify-between">
      <CardHeader className="px-2 pt-1 pb-0">
        <div className="flex flex-row justify-between">
          {/* Philosophy */}
          <div className="flex flex-col gap-1">
            <CardTitle className="text-md flex flex-row items-center gap-1">
              <BrainCogIcon className="h-4 w-4" />
              Philosophy
            </CardTitle>
            <SelectPhilosophy
              options={Object.values(Philosophy)}
              value={selectedSurvivor?.philosophy ?? ''}
              onChange={handlePhilosophyChange}
            />
          </div>

          {/* Rank */}
          <Input
            placeholder="0"
            type="number"
            className={cn(
              'w-14 h-14 text-center no-spinners text-2xl sm:text-2xl md:text-2xl focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0'
            )}
            value={selectedSurvivor?.philosophyRank ?? '0'}
            onChange={(e) => updatePhilosophyRank(e.target.value)}
          />
        </div>

        {/* Rules Text */}
        <p className="text-xs text-muted-foreground">
          <strong>Ponder:</strong> If you are a{' '}
          <strong>returning survivor</strong> and reach a new Hunt XP milestone,
          you must rank up your philosophy. Limit, once per settlement phase.
        </p>
      </CardHeader>

      <hr className="my-1" />

      <CardContent className="p-2 flex flex-col">
        {/* Neurosis */}
        <div className="flex flex-col gap-1">
          <Input
            placeholder="Neurosis..."
            className="border-0 border-b rounded-none focus-visible:ring-0 focus-visible:border-b-2 px-0 md:text-md"
            value={neurosis}
            onChange={(e) => setNeurosis(e.target.value)}
            onBlur={(e) => {
              updateNeurosis(e.target.value)
            }}
          />
          <label className="text-xs text-muted-foreground">Neurosis</label>
        </div>

        {/* Tenet Knowledge and Ranks */}
        <div className="flex items-start gap-2 mt-1">
          <div className="flex-grow flex flex-col gap-1">
            <Input
              placeholder="Tenet knowledge..."
              className="border-0 border-b rounded-none focus-visible:ring-0 focus-visible:border-b-2 px-0 md:text-md"
              value={tenetKnowledge}
              onChange={(e) => setTenetKnowledge(e.target.value)}
              onBlur={(e) => {
                updateTenetKnowledge(e.target.value)
              }}
            />
            <label className="text-xs text-muted-foreground">
              Tenet Knowledge
            </label>
          </div>
          <div className="flex gap-1 pt-2">
            {[...Array(9)].map((_, index) => {
              const checked =
                (selectedSurvivor?.tenetKnowledgeObservationRank || 0) > index
              const isRankUpMilestone =
                selectedSurvivor?.tenetKnowledgeRankUp === index

              return (
                <Checkbox
                  key={index}
                  checked={checked}
                  onCheckedChange={(checked) =>
                    updateTenetKnowledgeObservationRank(!!checked, index)
                  }
                  onContextMenu={(event) => handleRightClick(index, event)}
                  className={cn(
                    'h-4 w-4 rounded-sm',
                    !checked && isRankUpMilestone && 'border-2 border-primary'
                  )}
                />
              )
            })}
          </div>
        </div>

        {/* Tenet Knowledge Rules */}
        <div className="mt-1 flex flex-col gap-1">
          <Textarea
            placeholder="Tenet knowledge rules..."
            className="resize-none border-0 border-b rounded-none focus-visible:ring-0 focus-visible:border-b-2 px-0 h-20 overflow-y-auto text-sm sm:text-sm md:text-sm"
            value={tenetKnowledgeRules}
            onChange={(e) => setTenetKnowledgeRules(e.target.value)}
            onBlur={(e) => updateTenetKnowledgeRules(e.target.value)}
          />
          <label className="text-xs text-muted-foreground">Rules</label>
        </div>

        {/* Tenet Knowledge Observation Conditions */}
        <div className="mt-1 flex flex-col gap-1">
          <Textarea
            placeholder="Observation conditions..."
            className="resize-none border-0 border-b rounded-none focus-visible:ring-0 focus-visible:border-b-2 px-0 h-20 overflow-y-auto text-sm sm:text-sm md:text-sm"
            value={tenetKnowledgeObservationConditions}
            onChange={(e) =>
              setTenetKnowledgeObservationConditions(e.target.value)
            }
            onBlur={(e) =>
              updateTenetKnowledgeObservationConditions(e.target.value)
            }
          />
          <label className="text-xs text-muted-foreground">
            Observation Conditions
          </label>
        </div>
      </CardContent>
    </Card>
  )
}
