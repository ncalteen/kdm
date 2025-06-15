'use client'

import { TimelineEventBadge } from '@/components/settlement/timeline/timeline-event-badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { FormControl, FormField, FormItem } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Settlement, TimelineYear } from '@/schemas/settlement'
import { CheckIcon, PlusCircleIcon, ScrollIcon, TrashIcon } from 'lucide-react'
import { KeyboardEvent, memo } from 'react'
import { UseFormReturn } from 'react-hook-form'

/**
 * Timeline Row Data Interface
 */
export interface TimelineRowData {
  /** Timeline */
  timeline: TimelineYear[]
  /** Show Story Event Icon */
  showStoryEventIcon: boolean
  /** Use Normal Year Numbering */
  usesNormalNumbering: boolean
  /** Form for Settlement */
  form: UseFormReturn<Settlement>
  /** Handler for Year Completion Change */
  handleYearCompletionChange: (yearIndex: number, completed: boolean) => void
  /** Check if an event is being edited */
  isEventBeingEdited: (yearIndex: number, entryIndex: number) => boolean
  /** Edit Event Handler */
  editEvent: (yearIndex: number, entryIndex: number) => void
  /** Set Input Reference Function */
  setInputRef: (
    element: HTMLInputElement | null,
    yearIndex: number,
    entryIndex: number
  ) => void
  /** Key Press Handler */
  handleKeyDown: (
    e: KeyboardEvent<HTMLInputElement>,
    yearIndex: number,
    entryIndex: number
  ) => void
  /** Save Event Handler */
  saveEvent: (yearIndex: number, entryIndex: number) => void
  /** Remove Event Handler */
  removeEventFromYear: (yearIndex: number, eventIndex: number) => void
  /** Add Event Handler */
  addEventToYear: (yearIndex: number) => void
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
      timeline,
      showStoryEventIcon,
      usesNormalNumbering,
      form,
      handleYearCompletionChange,
      isEventBeingEdited,
      editEvent,
      setInputRef,
      handleKeyDown,
      saveEvent,
      removeEventFromYear,
      addEventToYear
    } = data

    const yearData = timeline[index]
    const yearIndex = index

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
            <FormField
              control={form.control}
              name={`timeline.${yearIndex}.completed`}
              render={({ field }) => (
                <FormItem className="flex">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(checked) =>
                        handleYearCompletionChange(yearIndex, !!checked)
                      }
                      id={`timeline.${yearIndex}.completed`}
                      name={`timeline.${yearIndex}.completed`}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <span
              className={`text-xs leading-none ${yearData.completed ? 'text-muted-foreground' : ''}`}>
              {yearIndex === 0 && !usesNormalNumbering
                ? 'Prologue'
                : usesNormalNumbering
                  ? yearIndex + 1
                  : yearIndex}
            </span>
          </div>

          {/* Story Event Icon */}
          {showStoryEventIcon && (
            <div className="flex items-center justify-center">
              {yearIndex !== 0 && (
                <ScrollIcon className="h-3 w-3 text-muted-foreground" />
              )}
            </div>
          )}

          {/* Events Section */}
          <div className="flex flex-col gap-0.5">
            {/* Saved Event Badges and Add Event Button (mobile) */}
            {(yearData.entries || []).length > 0 && (
              <div className="flex flex-wrap gap-0.5 items-center">
                {(yearData.entries || []).map(
                  (entry: string, entryIndex: number) => {
                    if (
                      !isEventBeingEdited(yearIndex, entryIndex) &&
                      entry &&
                      entry.trim() !== ''
                    ) {
                      return (
                        <TimelineEventBadge
                          key={entryIndex}
                          entry={entry}
                          yearIndex={yearIndex}
                          entryIndex={entryIndex}
                          onEdit={!yearData.completed ? editEvent : () => {}}
                          isCompleted={yearData.completed}
                        />
                      )
                    }
                    return null
                  }
                )}
                {/* Add Event Button for mobile - inline with badges */}
                {!yearData.completed && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      addEventToYear(yearIndex)
                    }}
                    className="h-6 px-2 text-xs sm:hidden ml-auto">
                    <PlusCircleIcon className="h-3 w-3" />
                    <span className="text-xs hidden">Add Event</span>
                  </Button>
                )}
              </div>
            )}

            {/* Add Event Button for mobile when no events */}
            {(yearData.entries || []).length === 0 && !yearData.completed && (
              <div className="flex justify-end sm:hidden">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    addEventToYear(yearIndex)
                  }}
                  className="h-6 px-2 text-xs">
                  <PlusCircleIcon className="h-3 w-3" />
                  <span className="text-xs hidden">Add Event</span>
                </Button>
              </div>
            )}

            {/* Edit Event Input Fields */}
            {(yearData.entries || []).map(
              (entry: string, entryIndex: number) => {
                if (isEventBeingEdited(yearIndex, entryIndex)) {
                  return (
                    <div key={entryIndex} className="flex items-center gap-1">
                      <FormField
                        control={form.control}
                        name={`timeline.${yearIndex}.entries.${entryIndex}`}
                        render={() => (
                          <FormItem className="flex-1 pt-1">
                            <FormControl>
                              <Input
                                placeholder={`${
                                  yearIndex === 0 && !usesNormalNumbering
                                    ? 'Prologue'
                                    : usesNormalNumbering
                                      ? `Year ${yearIndex + 1}`
                                      : `Year ${yearIndex}`
                                } event...`}
                                defaultValue={entry || ''}
                                ref={(element) =>
                                  setInputRef(element, yearIndex, entryIndex)
                                }
                                onKeyDown={(e) =>
                                  handleKeyDown(e, yearIndex, entryIndex)
                                }
                                autoFocus
                                className="h-7 text-xs"
                                id={`timeline.${yearIndex}.entries.${entryIndex}`}
                                name={`timeline.${yearIndex}.entries.${entryIndex}`}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => saveEvent(yearIndex, entryIndex)}
                        title="Save event">
                        <CheckIcon className="h-3 w-3" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() =>
                          removeEventFromYear(yearIndex, entryIndex)
                        }
                        title="Remove event">
                        <TrashIcon className="h-3 w-3" />
                      </Button>
                    </div>
                  )
                }
                return null
              }
            )}

            {(yearData.entries || []).length === 0 && (
              <div className="text-xs text-muted-foreground italic leading-none">
                No events recorded.
              </div>
            )}
          </div>

          {/* Add Event Button - Desktop only */}
          {!yearData.completed && (
            <div className="justify-end pr-2 hidden sm:flex">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  addEventToYear(yearIndex)
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
