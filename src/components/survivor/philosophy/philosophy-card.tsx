'use client'

import { NumericInput } from '@/components/menu/numeric-input'
import { SelectPhilosophy } from '@/components/menu/select-philosophy'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useIsMobile } from '@/hooks/use-mobile'
import { Philosophy } from '@/lib/enums'
import {
  PHILOSOPHY_RANK_MINIMUM_ERROR,
  SURVIVOR_NEUROSIS_UPDATED_MESSAGE,
  SURVIVOR_PHILOSOPHY_RANK_UPDATED_MESSAGE,
  SURVIVOR_PHILOSOPHY_SELECTED_MESSAGE,
  SURVIVOR_TENET_KNOWLEDGE_OBSERVATION_CONDITIONS_UPDATED_MESSAGE,
  SURVIVOR_TENET_KNOWLEDGE_OBSERVATION_RANK_UPDATED_MESSAGE,
  SURVIVOR_TENET_KNOWLEDGE_RANK_UP_UPDATED_MESSAGE,
  SURVIVOR_TENET_KNOWLEDGE_RULES_UPDATED_MESSAGE,
  SURVIVOR_TENET_KNOWLEDGE_UPDATED_MESSAGE
} from '@/lib/messages'
import { cn } from '@/lib/utils'
import { Survivor } from '@/schemas/survivor'
import { ReactElement, useCallback, useRef, useState } from 'react'
import { toast } from 'sonner'

/**
 * Philosophy Card Properties
 */
interface PhilosophyCardProps {
  /** Save Selected Survivor */
  saveSelectedSurvivor: (data: Partial<Survivor>, successMsg?: string) => void
  /** Selected Survivor */
  selectedSurvivor: Survivor | null
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
  const isMobile = useIsMobile()

  const survivorIdRef = useRef<number | undefined>(undefined)

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

  // Reset local state when survivor changes (different ID)
  if (survivorIdRef.current !== selectedSurvivor?.id) {
    survivorIdRef.current = selectedSurvivor?.id

    setNeurosis(selectedSurvivor?.neurosis ?? '')
    setTenetKnowledge(selectedSurvivor?.tenetKnowledge ?? '')
    setTenetKnowledgeRules(selectedSurvivor?.tenetKnowledgeRules ?? '')
    setTenetKnowledgeObservationConditions(
      selectedSurvivor?.tenetKnowledgeObservationConditions ?? ''
    )
  }

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
        SURVIVOR_PHILOSOPHY_SELECTED_MESSAGE(value)
      )

      // Update the survivors context to trigger re-renders in settlement table
      if (survivors && selectedSurvivor?.id)
        setSurvivors(
          survivors.map((s) =>
            s.id === selectedSurvivor?.id ? { ...s, ...updateData } : s
          )
        )
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
        SURVIVOR_TENET_KNOWLEDGE_RANK_UP_UPDATED_MESSAGE(newRankUp)
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
      if (value < 0) return toast.error(PHILOSOPHY_RANK_MINIMUM_ERROR())

      const updateData: Partial<Survivor> = { philosophyRank: value }

      saveSelectedSurvivor(
        updateData,
        SURVIVOR_PHILOSOPHY_RANK_UPDATED_MESSAGE()
      )

      // Update the survivors context to trigger re-renders in settlement table
      if (survivors && selectedSurvivor?.id)
        setSurvivors(
          survivors.map((s) =>
            s.id === selectedSurvivor?.id ? { ...s, ...updateData } : s
          )
        )
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
      SURVIVOR_NEUROSIS_UPDATED_MESSAGE(value)
    )
  }

  /**
   * Update Tenet Knowledge
   */
  const updateTenetKnowledge = (value: string) => {
    setTenetKnowledge(value)
    saveSelectedSurvivor(
      { tenetKnowledge: value },
      SURVIVOR_TENET_KNOWLEDGE_UPDATED_MESSAGE(value)
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
      SURVIVOR_TENET_KNOWLEDGE_OBSERVATION_RANK_UPDATED_MESSAGE(
        isRankUp,
        newRank
      )
    )
  }

  /**
   * Update Tenet Knowledge Rules
   */
  const updateTenetKnowledgeRules = (value: string) => {
    setTenetKnowledgeRules(value)
    saveSelectedSurvivor(
      { tenetKnowledgeRules: value },
      SURVIVOR_TENET_KNOWLEDGE_RULES_UPDATED_MESSAGE(value)
    )
  }

  /**
   * Update Tenet Knowledge Observation Conditions
   */
  const updateTenetKnowledgeObservationConditions = (value: string) => {
    setTenetKnowledgeObservationConditions(value)
    saveSelectedSurvivor(
      { tenetKnowledgeObservationConditions: value },
      SURVIVOR_TENET_KNOWLEDGE_OBSERVATION_CONDITIONS_UPDATED_MESSAGE(value)
    )
  }

  return (
    <Card className="p-2 border-0">
      {/* Title */}
      <CardHeader className="p-0">
        <div className="flex flex-row justify-between">
          <div className="flex flex-col gap-1">
            <CardTitle className="text-sm flex flex-row items-center gap-1">
              Philosophy
            </CardTitle>
            <SelectPhilosophy
              options={Object.values(Philosophy)}
              value={selectedSurvivor?.philosophy ?? ''}
              onChange={handlePhilosophyChange}
            />
          </div>

          {/* Rank */}
          <NumericInput
            label="Philosophy Rank"
            value={selectedSurvivor?.philosophyRank ?? 0}
            onChange={(value) => updatePhilosophyRank(value.toString())}
            min={0}
            readOnly={false}>
            <Input
              placeholder="0"
              type="number"
              className={cn(
                'w-14 h-14 text-center no-spinners text-2xl sm:text-2xl md:text-2xl focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0'
              )}
              value={selectedSurvivor?.philosophyRank ?? '0'}
              min={0}
              readOnly={isMobile}
              onChange={
                !isMobile
                  ? (e) => updatePhilosophyRank(e.target.value)
                  : undefined
              }
              name="philosophy-rank"
              id="philosophy-rank"
            />
          </NumericInput>
        </div>

        {/* Rules Text */}
        <p className="text-xs text-muted-foreground">
          <strong>Ponder:</strong> If you are a{' '}
          <strong>returning survivor</strong> and reach a new Hunt XP milestone,
          you must rank up your philosophy. Limit, once per settlement phase.
        </p>

        <hr />
      </CardHeader>

      <CardContent className="p-0 flex flex-col">
        {/* Neurosis */}
        <div className="flex flex-col gap-1">
          <Input
            placeholder=" Neurosis..."
            className="border-0 border-b rounded-none focus-visible:ring-0 focus-visible:border-b-2 px-0 text-sm"
            value={neurosis}
            onChange={(e) => setNeurosis(e.target.value)}
            onBlur={(e) => {
              updateNeurosis(e.target.value)
            }}
          />
          <Label className="text-xs text-muted-foreground">Neurosis</Label>
        </div>

        {/* Tenet Knowledge and Ranks */}
        <div className="flex items-start gap-2 mt-1">
          <div className="flex-grow flex flex-col gap-1">
            <Input
              placeholder=" Tenet knowledge..."
              className="border-0 border-b rounded-none focus-visible:ring-0 focus-visible:border-b-2 px-0 text-sm"
              value={tenetKnowledge}
              onChange={(e) => setTenetKnowledge(e.target.value)}
              onBlur={(e) => {
                updateTenetKnowledge(e.target.value)
              }}
            />
            <Label className="text-xs text-muted-foreground">
              Tenet Knowledge
            </Label>
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
            placeholder=" Tenet knowledge rules..."
            className="resize-none border-0 border-b rounded-none focus-visible:ring-0 focus-visible:border-b-2 px-0 h-20 overflow-y-auto text-sm"
            value={tenetKnowledgeRules}
            onChange={(e) => setTenetKnowledgeRules(e.target.value)}
            onBlur={(e) => updateTenetKnowledgeRules(e.target.value)}
          />
          <Label className="text-xs text-muted-foreground text-right">
            Rules
          </Label>
        </div>

        {/* Tenet Knowledge Observation Conditions */}
        <div className="mt-1 flex flex-col gap-1">
          <Textarea
            placeholder=" Observation conditions..."
            className="resize-none border-0 border-b rounded-none focus-visible:ring-0 focus-visible:border-b-2 px-0 h-20 overflow-y-auto text-sm"
            value={tenetKnowledgeObservationConditions}
            onChange={(e) =>
              setTenetKnowledgeObservationConditions(e.target.value)
            }
            onBlur={(e) =>
              updateTenetKnowledgeObservationConditions(e.target.value)
            }
          />
          <Label className="text-xs text-muted-foreground text-right">
            Observation Conditions
          </Label>
        </div>
      </CardContent>
    </Card>
  )
}
