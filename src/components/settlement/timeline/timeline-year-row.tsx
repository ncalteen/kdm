'use client'

import { TimelineEventBadge } from '@/components/settlement/timeline/timeline-event-badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Settlement } from '@/schemas/settlement'
import { CheckIcon, PlusCircleIcon, ScrollIcon, TrashIcon } from 'lucide-react'
import { KeyboardEvent, memo } from 'react'

/**
 * Timeline Row Data Interface
 */
export interface TimelineRowData {
  /** Add Event Handler */
  addEventToYear: (yearIndex: number) => void
  /** Edit Event Handler */
  editEvent: (yearIndex: number, entryIndex: number) => void
  /** Key Press Handler */
  handleKeyDown: (
    e: KeyboardEvent<HTMLInputElement>,
    yearIndex: number,
    entryIndex: number
  ) => void
  /** Handler for Year Completion Change */
  handleYearCompletionChange: (yearIndex: number, completed: boolean) => void
  /** Check if an event is being edited */
  isEventBeingEdited: (yearIndex: number, entryIndex: number) => boolean
  /** Remove Event Handler */
  removeEventFromYear: (yearIndex: number, eventIndex: number) => void
  /** Save Event Handler */
  saveEvent: (yearIndex: number, entryIndex: number) => void
  /** Selected Settlement */
  selectedSettlement: Partial<Settlement> | null
  /** Set Input Reference Function */
  setInputRef: (
    element: HTMLInputElement | null,
    yearIndex: number,
    entryIndex: number
  ) => void
  /** Show Story Event Icon */
  showStoryEventIcon: boolean
  /** Use Normal Year Numbering */
  usesNormalNumbering: boolean
}

export interface TimelineRowProps {
  index: number
  style: React.CSSProperties
  data: TimelineRowData
}

/**
 * Timeline Year Row Component for virtualization
 */
export const TimelineYearRow = memo(
  ({ index, style, data }: TimelineRowProps) => {
    const {
      addEventToYear,
      editEvent,
      handleKeyDown,
      handleYearCompletionChange,
      isEventBeingEdited,
      removeEventFromYear,
      saveEvent,
      selectedSettlement,
      setInputRef,
      showStoryEventIcon,
      usesNormalNumbering
    } = data

    // Get all entry indices that should be rendered (existing entries + new entries being edited)
    const entries = selectedSettlement?.timeline?.[index].entries || []
    const allEntryIndices = new Set([...entries.map((_, i) => i)])

    // Also include any entry indices that are being edited but don't exist in the entries array yet
    for (let i = 0; i <= entries.length; i++)
      if (isEventBeingEdited(index, i)) allEntryIndices.add(i)

    const sortedIndices = Array.from(allEntryIndices).sort((a, b) => a - b)

    return (
      <div style={style}>
        <div
          className={`grid ${
            showStoryEventIcon
              ? 'grid-cols-[60px_30px_1fr_auto]'
              : 'grid-cols-[60px_1fr_auto]'
          } items-start border-t py-1`}>
          {/* Year Number and Completion Checkbox */}
          <div className="flex gap-1 items-center">
            <Checkbox
              checked={selectedSettlement?.timeline?.[index].completed || false}
              onCheckedChange={(checked) =>
                handleYearCompletionChange(index, !!checked)
              }
              id={`timeline.${index}.completed`}
              name={`timeline.${index}.completed`}
            />
            <span
              className={`text-xs leading-none ${selectedSettlement?.timeline?.[index].completed ? 'text-muted-foreground' : ''}`}>
              {index === 0 && !usesNormalNumbering
                ? 'Prologue'
                : usesNormalNumbering
                  ? index + 1
                  : index}
            </span>
          </div>

          {/* Story Event Icon */}
          {showStoryEventIcon && (
            <div className="flex items-center justify-center">
              {index !== 0 && (
                <ScrollIcon className="h-3 w-3 text-muted-foreground" />
              )}
            </div>
          )}

          {/* Events Section */}
          <div className="flex flex-col gap-0.5">
            {/* Saved Event Badges and Add Event Button (mobile) */}
            {entries.length > 0 && (
              <div className="flex flex-wrap gap-0.5 items-center">
                {entries.map((entry: string, entryIndex: number) => {
                  if (
                    !isEventBeingEdited(index, entryIndex) &&
                    entry &&
                    entry.trim() !== ''
                  ) {
                    return (
                      <TimelineEventBadge
                        key={entryIndex}
                        entry={entry}
                        yearIndex={index}
                        entryIndex={entryIndex}
                        onEdit={
                          !selectedSettlement?.timeline?.[index].completed
                            ? editEvent
                            : () => {}
                        }
                        isCompleted={
                          selectedSettlement?.timeline?.[index].completed
                        }
                      />
                    )
                  }
                  return null
                })}
                {/* Add Event Button for mobile - inline with badges */}
                {!selectedSettlement?.timeline?.[index].completed && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      addEventToYear(index)
                    }}
                    className="h-6 px-2 text-xs sm:hidden ml-auto">
                    <PlusCircleIcon className="h-3 w-3" />
                    <span className="text-xs hidden">Add Event</span>
                  </Button>
                )}
              </div>
            )}

            {/* Add Event Button for mobile when no events */}
            {entries.length === 0 &&
              !selectedSettlement?.timeline?.[index].completed && (
                <div className="flex justify-end sm:hidden">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      addEventToYear(index)
                    }}
                    className="h-6 px-2 text-xs">
                    <PlusCircleIcon className="h-3 w-3" />
                    <span className="text-xs hidden">Add Event</span>
                  </Button>
                </div>
              )}

            {/* Edit Event Input Fields */}
            {sortedIndices.map((entryIndex: number) => {
              if (isEventBeingEdited(index, entryIndex)) {
                const entry = entries[entryIndex] || ''
                return (
                  <div key={entryIndex} className="flex items-center gap-1">
                    <Input
                      placeholder={`${
                        index === 0 && !usesNormalNumbering
                          ? 'Prologue'
                          : usesNormalNumbering
                            ? `Year ${index + 1}`
                            : `Year ${index}`
                      } event...`}
                      defaultValue={entry}
                      ref={(element) => setInputRef(element, index, entryIndex)}
                      onKeyDown={(e) => handleKeyDown(e, index, entryIndex)}
                      autoFocus
                      className="h-7 text-xs"
                      id={`timeline.${index}.entries.${entryIndex}`}
                      name={`timeline.${index}.entries.${entryIndex}`}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => saveEvent(index, entryIndex)}
                      title="Save event">
                      <CheckIcon className="h-3 w-3" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => removeEventFromYear(index, entryIndex)}
                      title="Remove event">
                      <TrashIcon className="h-3 w-3" />
                    </Button>
                  </div>
                )
              }
              return null
            })}

            {entries.length === 0 && (
              <div className="text-xs text-muted-foreground italic leading-none">
                No events recorded.
              </div>
            )}
          </div>

          {/* Add Event Button - Desktop only */}
          {!selectedSettlement?.timeline?.[index].completed && (
            <div className="justify-end pr-2 hidden sm:flex">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  addEventToYear(index)
                }}
                className="h-6 px-2 text-xs">
                <PlusCircleIcon className="h-3 w-3" />
                <span className="text-xs">Add Event</span>
              </Button>
            </div>
          )}
        </div>
      </div>
    )
  }
)

TimelineYearRow.displayName = 'TimelineYearRow'
