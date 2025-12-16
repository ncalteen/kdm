'use client'

import { NumericInput } from '@/components/menu/numeric-input'
import { Button } from '@/components/ui/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  CheckIcon,
  ChevronDown,
  PencilIcon,
  PlusIcon,
  Trash2
} from 'lucide-react'
import { ReactElement, useState } from 'react'

/**
 * Timeline Data Properties
 */
export interface TimelineDataProps {
  /** Timeline entries */
  timelineData: Array<{ year: number; event: string }>
  /** Update timeline data callback */
  onTimelineDataChange: (data: Array<{ year: number; event: string }>) => void
  /** Initial disabled indexes (for editing existing data) */
  initialDisabledIndexes?: number[]
}

/**
 * Timeline Data Component
 *
 * Manages timeline entries for a monster.
 *
 * @param props Timeline Data Properties
 * @returns Timeline Data Component
 */
export function TimelineData({
  timelineData,
  onTimelineDataChange,
  initialDisabledIndexes
}: TimelineDataProps): ReactElement {
  const [isOpen, setIsOpen] = useState(false)
  const [disabledInputs, setDisabledInputs] = useState<{
    [key: number]: boolean
  }>(() => {
    if (!initialDisabledIndexes) return {}
    return initialDisabledIndexes.reduce(
      (acc, idx) => ({ ...acc, [idx]: true }),
      {}
    )
  })
  const [isAddingNew, setIsAddingNew] = useState<boolean>(false)
  const [newYearValue, setNewYearValue] = useState<number>(0)
  const [newEventValue, setNewEventValue] = useState<string>('')

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Button variant="outline" className="w-full justify-between">
          <span>Timeline Entries</span>
          <ChevronDown
            className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-1 ml-2">
        <div className="space-y-2">
          <div className="flex items-center justify-between h-8">
            <Label>Timeline Entries</Label>
            {!isAddingNew && (
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => {
                  setIsAddingNew(true)
                  setNewYearValue(0)
                  setNewEventValue('')
                }}
                className="border-0 h-8 w-8"
                disabled={
                  isAddingNew ||
                  Object.values(disabledInputs).some((v) => v === false)
                }>
                <PlusIcon className="h-4 w-4" />
              </Button>
            )}
          </div>
          <div className="ml-2">
            {timelineData.map((entry, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-20">
                  {disabledInputs[index] ? (
                    <span className="text-sm">{entry.year}</span>
                  ) : (
                    <NumericInput
                      label="Year"
                      value={entry.year}
                      onChange={(value) => {
                        const newTimelineData = [...timelineData]
                        newTimelineData[index] = {
                          ...entry,
                          year: value
                        }
                        onTimelineDataChange(newTimelineData)
                      }}
                      min={0}
                      readOnly={false}>
                      <Input
                        id={`year-${index + 1}`}
                        type="number"
                        min="0"
                        value={entry.year}
                        onChange={(e) => {
                          const newTimelineData = [...timelineData]
                          newTimelineData[index] = {
                            ...entry,
                            year: parseInt(e.target.value) || 0
                          }
                          onTimelineDataChange(newTimelineData)
                        }}
                        className="text-center no-spinners"
                      />
                    </NumericInput>
                  )}
                </div>
                <div className="flex-1">
                  {disabledInputs[index] ? (
                    <span className="text-sm">{entry.event}</span>
                  ) : (
                    <Input
                      placeholder="Event name"
                      defaultValue={entry.event}
                      onChange={(e) => {
                        const newTimelineData = [...timelineData]
                        newTimelineData[index] = {
                          ...entry,
                          event: e.target.value
                        }
                        onTimelineDataChange(newTimelineData)
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          setDisabledInputs((prev) => ({
                            ...prev,
                            [index]: true
                          }))
                        }
                      }}
                    />
                  )}
                </div>
                <div className="flex items-center gap-1">
                  {disabledInputs[index] ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        setDisabledInputs((prev) => ({
                          ...prev,
                          [index]: false
                        }))
                      }>
                      <PencilIcon className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        setDisabledInputs((prev) => ({
                          ...prev,
                          [index]: true
                        }))
                      }>
                      <CheckIcon className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      const newTimelineData = timelineData.filter(
                        (_, i) => i !== index
                      )
                      onTimelineDataChange(newTimelineData)
                      const newDisabled = { ...disabledInputs }
                      delete newDisabled[index]
                      Object.keys(newDisabled).forEach((k) => {
                        const num = parseInt(k)
                        if (num > index) {
                          newDisabled[num - 1] = newDisabled[num]
                          delete newDisabled[num]
                        }
                      })
                      setDisabledInputs(newDisabled)
                    }}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            {isAddingNew && (
              <div className="flex items-center gap-2">
                <div className="w-20">
                  <NumericInput
                    label="Year"
                    value={newYearValue}
                    onChange={setNewYearValue}
                    min={0}
                    readOnly={false}>
                    <Input
                      id="new-timeline-year"
                      type="number"
                      min="0"
                      placeholder="Year"
                      value={newYearValue}
                      onChange={(e) =>
                        setNewYearValue(parseInt(e.target.value) || 0)
                      }
                      onKeyDown={(e) => {
                        if (e.key === 'Escape') {
                          e.preventDefault()
                          setIsAddingNew(false)
                          setNewYearValue(0)
                          setNewEventValue('')
                        }
                      }}
                      className="text-center no-spinners"
                    />
                  </NumericInput>
                </div>
                <div className="flex-1">
                  <Input
                    id="new-timeline-event"
                    placeholder="Event name"
                    value={newEventValue}
                    onChange={(e) => setNewEventValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        if (newEventValue.trim()) {
                          const newTimelineData = [
                            ...timelineData,
                            { year: newYearValue, event: newEventValue }
                          ]
                          onTimelineDataChange(newTimelineData)
                          setDisabledInputs((prev) => ({
                            ...prev,
                            [timelineData.length]: true
                          }))
                          setIsAddingNew(false)
                          setNewYearValue(0)
                          setNewEventValue('')
                        }
                      } else if (e.key === 'Escape') {
                        e.preventDefault()
                        setIsAddingNew(false)
                        setNewYearValue(0)
                        setNewEventValue('')
                      }
                    }}
                  />
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      if (newEventValue.trim()) {
                        const newTimelineData = [
                          ...timelineData,
                          { year: newYearValue, event: newEventValue }
                        ]
                        onTimelineDataChange(newTimelineData)
                        setDisabledInputs((prev) => ({
                          ...prev,
                          [timelineData.length]: true
                        }))
                        setIsAddingNew(false)
                        setNewYearValue(0)
                        setNewEventValue('')
                      }
                    }}>
                    <CheckIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setIsAddingNew(false)
                      setNewYearValue(0)
                      setNewEventValue('')
                    }}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
