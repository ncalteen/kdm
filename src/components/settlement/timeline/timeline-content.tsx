'use client'

import { TimelineEventBadge } from '@/components/settlement/timeline/timeline-event-badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { FormControl, FormField, FormItem } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { getCampaign } from '@/lib/utils'
import { Settlement, TimelineYear } from '@/schemas/settlement'
import { CheckIcon, PlusCircleIcon, ScrollIcon, TrashIcon } from 'lucide-react'
import { KeyboardEvent, memo, startTransition } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'

/**
 * Timeline Content Component Properties
 */
export interface TimelineContentProps {
  /** Add Event Handler */
  addEventToYear: (yearIndex: number) => void
  /** Edit Event Handler */
  editEvent: (yearIndex: number, entryIndex: number) => void
  /** Settlement Form */
  form: UseFormReturn<Settlement>
  /** Key Press Handler */
  handleKeyDown: (
    e: KeyboardEvent<HTMLInputElement>,
    yearIndex: number,
    entryIndex: number
  ) => void
  /** Event Edit Status */
  isEventBeingEdited: (yearIndex: number, entryIndex: number) => boolean
  /** Remove Event Handler */
  removeEventFromYear: (yearIndex: number, eventIndex: number) => void
  /** Save Event Handler */
  saveEvent: (yearIndex: number, entryIndex: number) => void
  /** Set Input Reference Function */
  setInputRef: (
    element: HTMLInputElement | null,
    yearIndex: number,
    entryIndex: number
  ) => void
  /** Show Story Event Icon */
  showStoryEventIcon: boolean
  /** Timeline Events */
  timeline: TimelineYear[]
  /** Use Normal Year Numbering */
  usesNormalNumbering: boolean
}

/**
 * Timeline Content Component
 */
export const TimelineContent = memo(
  ({
    addEventToYear,
    editEvent,
    handleKeyDown,
    isEventBeingEdited,
    removeEventFromYear,
    saveEvent,
    setInputRef,
    showStoryEventIcon,
    timeline,
    usesNormalNumbering,
    form
  }: TimelineContentProps) => {
    /**
     * Handles Completion Status Change
     *
     * @param yearIndex Timeline Year Index
     * @param checked Completion Status
     */
    const handleYearCompletionChange = (
      yearIndex: number,
      checked: string | boolean
    ) => {
      try {
        form.setValue(`timeline.${yearIndex}.completed`, !!checked)

        const formValues = form.getValues()
        const campaign = getCampaign()
        const settlementIndex = campaign.settlements.findIndex(
          (s: { id: number }) => s.id === formValues.id
        )

        campaign.settlements[settlementIndex].timeline = formValues.timeline
        localStorage.setItem('campaign', JSON.stringify(campaign))

        toast.success(
          usesNormalNumbering
            ? `Lantern year ${yearIndex + 1} updated!`
            : yearIndex === 0
              ? 'Prologue updated!'
              : `Lantern year ${yearIndex} updated!`
        )
      } catch (error) {
        console.error('Lantern Year Complete Error:', error)
        toast.error('The darkness swallows you. Please try again.')
      }
    }

    return (
      <div className="space-y-2">
        <div
          className={`grid ${showStoryEventIcon ? 'grid-cols-[80px_40px_1fr_auto]' : 'grid-cols-[80px_1fr_auto]'} gap-4 px-2 py-1 font-medium text-sm`}>
          <div>Year</div>
          {showStoryEventIcon && <div className="text-center" />}
          <div>Events</div>
          <div></div>
        </div>
        <div className="flex flex-col gap-0">
          {timeline.map((yearData, yearIndex) => (
            <div
              key={yearIndex}
              className={`grid ${
                showStoryEventIcon
                  ? 'grid-cols-[80px_40px_1fr_auto]'
                  : 'grid-cols-[80px_1fr_auto]'
              } gap-2 items-start border-t border-border py-1`}>
              {/* Year Number and Completion Checkbox */}
              <div className="flex items-center">
                <FormField
                  control={form.control}
                  name={`timeline.${yearIndex}.completed`}
                  render={({ field }) => (
                    <FormItem className="flex items-center m-0">
                      <FormControl>
                        <Checkbox
                          className="mt-1"
                          checked={field.value}
                          onCheckedChange={(checked) =>
                            handleYearCompletionChange(yearIndex, checked)
                          }
                          id={`timeline.${yearIndex}.completed`}
                          name={`timeline.${yearIndex}.completed`}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <span
                  className={`text-sm font-medium ml-2 mb-1 inline-flex items-center ${yearData.completed ? 'text-muted-foreground' : ''}`}>
                  {yearIndex === 0 && !usesNormalNumbering
                    ? 'Prologue'
                    : usesNormalNumbering
                      ? yearIndex + 1
                      : yearIndex}
                </span>
              </div>

              {/* Story Event Icon */}
              {showStoryEventIcon && (
                <div className="flex justify-center items-center mt-1">
                  {yearIndex !== 0 && (
                    <ScrollIcon className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
              )}

              {/* Events Section */}
              <div className="flex flex-col gap-2">
                {/* Saved Event Badges */}
                {(yearData.entries || []).length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-1">
                    {(yearData.entries || []).map((entry, entryIndex) => {
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
                    })}
                  </div>
                )}

                {/* Edit Event Input Fields */}
                {(yearData.entries || []).map((entry, entryIndex) => {
                  if (isEventBeingEdited(yearIndex, entryIndex)) {
                    return (
                      <div key={entryIndex} className="flex items-center">
                        <FormField
                          control={form.control}
                          name={`timeline.${yearIndex}.entries.${entryIndex}`}
                          render={() => (
                            <FormItem className="flex-1 m-0">
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
                          className="ml-2"
                          onClick={() => saveEvent(yearIndex, entryIndex)}
                          title="Save event">
                          <CheckIcon className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            removeEventFromYear(yearIndex, entryIndex)
                          }
                          title="Remove event">
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    )
                  }
                  return null
                })}

                {(yearData.entries || []).length === 0 && (
                  <div className="text-sm text-gray-500 italic">No events</div>
                )}
              </div>

              {/* Add Event Button */}
              {!yearData.completed && (
                <div className="flex justify-end mr-5">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      startTransition(() => addEventToYear(yearIndex))
                    }}>
                    <PlusCircleIcon className="h-4 w-4 mr-2" /> Add Event
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    )
  }
)

TimelineContent.displayName = 'TimelineContent'
