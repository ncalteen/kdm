'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { Survivor } from '@/schemas/survivor'
import { LightBulbIcon } from '@primer/octicons-react'
import { ReactElement, useCallback, useEffect, useState } from 'react'

/**
 * Knowledge Card Properties
 */
interface KnowledgeCardProps {
  /** Save Selected Survivor */
  saveSelectedSurvivor: (data: Partial<Survivor>, successMsg?: string) => void
  /** Selected Survivor */
  selectedSurvivor: Partial<Survivor> | null
}

/**
 * Knowledge Card Component
 *
 * @param props Knowledge Card Properties
 * @returns Knowledge Card Component
 */
export function KnowledgeCard({
  saveSelectedSurvivor,
  selectedSurvivor
}: KnowledgeCardProps): ReactElement {
  // Local state for text fields to enable controlled components that update when survivor changes
  const [knowledge1, setKnowledge1] = useState(
    selectedSurvivor?.knowledge1 ?? ''
  )
  const [knowledge1Rules, setKnowledge1Rules] = useState(
    selectedSurvivor?.knowledge1Rules ?? ''
  )
  const [knowledge1ObservationConditions, setKnowledge1ObservationConditions] =
    useState(selectedSurvivor?.knowledge1ObservationConditions ?? '')
  const [knowledge2, setKnowledge2] = useState(
    selectedSurvivor?.knowledge2 ?? ''
  )
  const [knowledge2Rules, setKnowledge2Rules] = useState(
    selectedSurvivor?.knowledge2Rules ?? ''
  )
  const [knowledge2ObservationConditions, setKnowledge2ObservationConditions] =
    useState(selectedSurvivor?.knowledge2ObservationConditions ?? '')

  // Update local state when selected survivor changes
  useEffect(() => {
    setKnowledge1(selectedSurvivor?.knowledge1 ?? '')
    setKnowledge1Rules(selectedSurvivor?.knowledge1Rules ?? '')
    setKnowledge1ObservationConditions(
      selectedSurvivor?.knowledge1ObservationConditions ?? ''
    )
    setKnowledge2(selectedSurvivor?.knowledge2 ?? '')
    setKnowledge2Rules(selectedSurvivor?.knowledge2Rules ?? '')
    setKnowledge2ObservationConditions(
      selectedSurvivor?.knowledge2ObservationConditions ?? ''
    )
  }, [
    selectedSurvivor?.knowledge1,
    selectedSurvivor?.knowledge1Rules,
    selectedSurvivor?.knowledge1ObservationConditions,
    selectedSurvivor?.knowledge2,
    selectedSurvivor?.knowledge2Rules,
    selectedSurvivor?.knowledge2ObservationConditions
  ])

  /**
   * Handles observation rank changes
   *
   * @param fieldName Field Name
   * @param rank Selected Rank
   */
  const handleRankChange = useCallback(
    (fieldName: keyof Survivor, rank: number) => {
      saveSelectedSurvivor(
        {
          [fieldName]: rank
        },
        'The lantern illuminates newfound wisdom.'
      )
    },
    [saveSelectedSurvivor]
  )

  /**
   * Update Can Use Fighting Arts or Knowledges
   */
  const updateCanUseFightingArtsOrKnowledges = useCallback(
    (checked: boolean) => {
      saveSelectedSurvivor(
        {
          canUseFightingArtsOrKnowledges: !checked
        },
        !checked
          ? 'The survivor recalls their knowledge.'
          : 'The survivor has forgotten their learnings.'
      )
    },
    [saveSelectedSurvivor]
  )

  /**
   * Update Knowledge 1
   */
  const updateKnowledge1 = (value: string) => {
    setKnowledge1(value)
    saveSelectedSurvivor(
      { knowledge1: value },
      value
        ? 'Knowledge inscribed in the lantern light.'
        : 'Knowledge forgotten in the darkness.'
    )
  }

  /**
   * Update Knowledge 1 Observation Rank
   */
  const updateKnowledge1ObservationRank = (checked: boolean, index: number) => {
    const rank = index + 1

    if (checked) handleRankChange('knowledge1ObservationRank', rank)
    else if (selectedSurvivor?.knowledge1ObservationRank === rank)
      handleRankChange('knowledge1ObservationRank', rank - 1)
  }

  /**
   * Update Knowledge 1 Rank Up Milestone
   *
   * @param index The index of the checkbox (0-based)
   * @param event The mouse event
   */
  const updateKnowledge1RankUp = useCallback(
    (index: number, event: React.MouseEvent) => {
      event.preventDefault()

      const newRankUp =
        selectedSurvivor?.knowledge1RankUp === index ? undefined : index

      saveSelectedSurvivor(
        {
          knowledge1RankUp: newRankUp
        },
        newRankUp !== undefined
          ? 'Knowledge rank up milestone marked.'
          : 'Knowledge rank up milestone removed.'
      )
    },
    [selectedSurvivor?.knowledge1RankUp, saveSelectedSurvivor]
  )

  /**
   * Update Knowledge 1 Rules
   */
  const updateKnowledge1Rules = (value: string) => {
    setKnowledge1Rules(value)
    saveSelectedSurvivor(
      {
        knowledge1Rules: value
      },
      value.trim()
        ? 'The rules of wisdom are inscribed in lantern light.'
        : undefined
    )
  }

  /**
   * Update Knowledge 1 Observation Conditions
   */
  const updateKnowledge1ObservationConditions = (value: string) => {
    setKnowledge1ObservationConditions(value)
    saveSelectedSurvivor(
      {
        knowledge1ObservationConditions: value
      },
      value.trim()
        ? 'Observation conditions etched in the darkness.'
        : undefined
    )
  }

  /**
   * Update Knowledge 2
   */
  const updateKnowledge2 = (value: string) => {
    setKnowledge2(value)
    saveSelectedSurvivor(
      { knowledge2: value },
      value
        ? 'Knowledge inscribed in the lantern light.'
        : 'Knowledge forgotten in the darkness.'
    )
  }

  /**
   * Update Knowledge 2 Observation Rank
   */
  const updateKnowledge2ObservationRank = (checked: boolean, index: number) => {
    const rank = index + 1

    if (checked) handleRankChange('knowledge2ObservationRank', rank)
    else if (selectedSurvivor?.knowledge2ObservationRank === rank)
      handleRankChange('knowledge2ObservationRank', rank - 1)
  }

  /**
   * Update Knowledge 2 Rank Up Milestone
   *
   * @param index The index of the checkbox (0-based)
   * @param event The mouse event
   */
  const updateKnowledge2RankUp = useCallback(
    (index: number, event: React.MouseEvent) => {
      event.preventDefault()

      const newRankUp =
        selectedSurvivor?.knowledge2RankUp === index ? undefined : index

      saveSelectedSurvivor(
        {
          knowledge2RankUp: newRankUp
        },
        newRankUp !== undefined
          ? 'Knowledge rank up milestone marked.'
          : 'Knowledge rank up milestone removed.'
      )
    },
    [selectedSurvivor?.knowledge2RankUp, saveSelectedSurvivor]
  )

  /**
   * Update Knowledge 2 Rules
   */
  const updateKnowledge2Rules = (value: string) => {
    setKnowledge2Rules(value)
    saveSelectedSurvivor(
      {
        knowledge2Rules: value
      },
      value.trim()
        ? 'The rules of wisdom are inscribed in lantern light.'
        : undefined
    )
  }

  /**
   * Update Knowledge 1 Observation Conditions
   */
  const updateKnowledge2ObservationConditions = (value: string) => {
    setKnowledge2ObservationConditions(value)
    saveSelectedSurvivor(
      {
        knowledge2ObservationConditions: value
      },
      value.trim()
        ? 'Observation conditions etched in the darkness.'
        : undefined
    )
  }

  return (
    <Card className="p-0 border-1 gap-0">
      <CardHeader className="px-2 pt-1 pb-0">
        <div className="flex flex-row justify-between">
          {/* Title */}
          <CardTitle className="text-md flex flex-row items-center gap-1 h-8">
            <LightBulbIcon className="h-4 w-4" />
            Knowledges
          </CardTitle>

          {/* Cannot Use Fighting Arts or Knowledges */}
          <div className="flex items-center gap-2">
            <Checkbox
              id="canUseFightingArtsOrKnowledges"
              checked={!selectedSurvivor?.canUseFightingArtsOrKnowledges}
              onCheckedChange={updateCanUseFightingArtsOrKnowledges}
            />
            <Label
              htmlFor="canUseFightingArtsOrKnowledges"
              className="text-xs cursor-pointer">
              Cannot Use Knowledges
            </Label>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-2 py-0 flex flex-col">
        {/* Knowledge 1 */}
        <div className="flex items-start gap-2">
          <div className="flex-grow flex flex-col gap-1">
            <div className="flex flex-col gap-1">
              <Input
                placeholder=" Enter knowledge..."
                className="border-0 border-b rounded-none focus-visible:ring-0 focus-visible:border-b-2 px-0 text-sm"
                value={knowledge1}
                onChange={(e) => setKnowledge1(e.target.value)}
                onBlur={(e) => updateKnowledge1(e.target.value)}
              />
              <label className="text-xs text-muted-foreground">
                Knowledge Name
              </label>
            </div>
          </div>
          <div className="flex gap-1 pt-2">
            {[...Array(9)].map((_, index) => {
              const checked =
                (selectedSurvivor?.knowledge1ObservationRank || 0) >= index + 1
              const isRankUpMilestone =
                selectedSurvivor?.knowledge1RankUp === index

              return (
                <Checkbox
                  key={index}
                  checked={checked}
                  onCheckedChange={(checked) =>
                    updateKnowledge1ObservationRank(!!checked, index)
                  }
                  onContextMenu={(event) =>
                    updateKnowledge1RankUp(index, event)
                  }
                  className={cn(
                    'h-4 w-4 rounded-sm',
                    !checked && isRankUpMilestone && 'border-2 border-primary'
                  )}
                />
              )
            })}
          </div>
        </div>

        {/* Knowledge 1 Rules */}
        <div className="mt-1 flex flex-col gap-1">
          <Textarea
            placeholder=" Enter knowledge rules..."
            className="resize-none border-0 border-b rounded-none focus-visible:ring-0 focus-visible:border-b-2 px-0 h-20 overflow-y-auto text-sm"
            value={knowledge1Rules}
            onChange={(e) => setKnowledge1Rules(e.target.value)}
            onBlur={(e) => updateKnowledge1Rules(e.target.value)}
          />
          <label className="text-xs text-muted-foreground">Rules</label>
        </div>

        {/* Knowledge 1 Observation Conditions */}
        <div className="mt-1">
          <div className="flex flex-col gap-1">
            <Textarea
              placeholder=" Enter observation conditions..."
              className="resize-none border-0 border-b rounded-none focus-visible:ring-0 focus-visible:border-b-2 px-0 h-20 overflow-y-auto text-sm"
              value={knowledge1ObservationConditions}
              onChange={(e) =>
                setKnowledge1ObservationConditions(e.target.value)
              }
              onBlur={(e) =>
                updateKnowledge1ObservationConditions(e.target.value)
              }
            />
            <label className="text-xs text-muted-foreground">
              Observation Conditions
            </label>
          </div>
        </div>

        <hr className="mt-2 mb-2 border-1" />

        {/* Knowledge 2 */}
        <div className="flex items-start gap-2">
          <div className="flex-grow flex flex-col gap-1">
            <div className="flex flex-col gap-1">
              <Input
                placeholder=" Enter knowledge..."
                className="border-0 border-b rounded-none focus-visible:ring-0 focus-visible:border-b-2 px-0 text-sm"
                value={knowledge2}
                onChange={(e) => setKnowledge2(e.target.value)}
                onBlur={(e) => updateKnowledge2(e.target.value)}
              />
              <label className="text-xs text-muted-foreground">
                Knowledge Name
              </label>
            </div>
          </div>
          <div className="flex gap-1 pt-2">
            {[...Array(9)].map((_, index) => {
              const checked =
                (selectedSurvivor?.knowledge2ObservationRank || 0) >= index + 1
              const isRankUpMilestone =
                selectedSurvivor?.knowledge2RankUp === index

              return (
                <Checkbox
                  key={index}
                  checked={checked}
                  onCheckedChange={(checked) =>
                    updateKnowledge2ObservationRank(!!checked, index)
                  }
                  onContextMenu={(event) =>
                    updateKnowledge2RankUp(index, event)
                  }
                  className={cn(
                    'h-4 w-4 rounded-sm',
                    !checked && isRankUpMilestone && 'border-2 border-primary'
                  )}
                />
              )
            })}
          </div>
        </div>

        {/* Knowledge 2 Rules */}
        <div className="mt-1 flex flex-col gap-1">
          <Textarea
            placeholder=" Enter knowledge rules..."
            className="resize-none border-0 border-b rounded-none focus-visible:ring-0 focus-visible:border-b-2 px-0 h-20 overflow-y-auto text-sm"
            value={knowledge2Rules}
            onChange={(e) => setKnowledge2Rules(e.target.value)}
            onBlur={(e) => updateKnowledge2Rules(e.target.value)}
          />
          <label className="text-xs text-muted-foreground">Rules</label>
        </div>

        {/* Knowledge 2 Observation Conditions */}
        <div className="mt-1 flex flex-col gap-1">
          <Textarea
            placeholder=" Enter observation conditions..."
            className="resize-none border-0 border-b rounded-none focus-visible:ring-0 focus-visible:border-b-2 px-0 h-20 overflow-y-auto text-sm"
            value={knowledge2ObservationConditions}
            onChange={(e) => setKnowledge2ObservationConditions(e.target.value)}
            onBlur={(e) =>
              updateKnowledge2ObservationConditions(e.target.value)
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
