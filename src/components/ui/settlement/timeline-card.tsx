'use client'

import { CampaignType } from '@/lib/enums'
import { SettlementSchema } from '@/schemas/settlement'
import {
  BookOpenIcon,
  CheckIcon,
  HourglassIcon,
  PlusCircleIcon,
  ScrollIcon,
  SwordsIcon,
  TrashIcon
} from 'lucide-react'
import {
  KeyboardEvent,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react'
import { UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { Badge } from '../badge'
import { Button } from '../button'
import { Card, CardContent, CardHeader, CardTitle } from '../card'
import { Checkbox } from '../checkbox'
import { FormControl, FormField, FormItem } from '../form'
import { Input } from '../input'

// Define type for TimelineEntry based on the schema
type TimelineEntry = {
  completed?: boolean
  entries: string[]
}

// Memoize the TimelineEventBadge component to prevent unnecessary re-renders
const TimelineEventBadge = memo(
  ({
    entry,
    yearIndex,
    entryIndex,
    onEdit
  }: {
    entry: string
    yearIndex: number
    entryIndex: number
    onEdit: (yearIndex: number, entryIndex: number) => void
  }) => {
    const handleClick = useCallback(() => {
      onEdit(yearIndex, entryIndex)
    }, [yearIndex, entryIndex, onEdit])

    return (
      <Badge
        key={entryIndex}
        className="cursor-pointer my-1 inline-flex items-center"
        onClick={handleClick}>
        {entry.startsWith('Nemesis') ? (
          <SwordsIcon className="h-4 w-4 mr-1" />
        ) : (
          <BookOpenIcon className="h-4 w-4 mr-1" />
        )}
        {entry}
      </Badge>
    )
  }
)

TimelineEventBadge.displayName = 'TimelineEventBadge'

// Split TimelineContent into a separate component to allow for lazy loading
const TimelineContent = memo(
  ({
    timeline,
    usesNormalNumbering,
    isEventBeingEdited,
    setInputRef,
    handleKeyDown,
    saveEvent,
    removeEventFromYear,
    addEventToYear,
    form,
    editEvent,
    showScrollIcon
  }: {
    timeline: TimelineEntry[]
    usesNormalNumbering: boolean
    editingEvents: { [key: string]: boolean }
    isEventBeingEdited: (yearIndex: number, entryIndex: number) => boolean
    setInputRef: (
      element: HTMLInputElement | null,
      yearIndex: number,
      entryIndex: number
    ) => void
    handleKeyDown: (
      e: KeyboardEvent<HTMLInputElement>,
      yearIndex: number,
      entryIndex: number
    ) => void
    saveEvent: (yearIndex: number, entryIndex: number) => void
    removeEventFromYear: (yearIndex: number, eventIndex: number) => void
    addEventToYear: (yearIndex: number) => void
    form: UseFormReturn<z.infer<typeof SettlementSchema>>
    debouncedSetFormValue: (
      path:
        | `timeline.${number}.entries`
        | `timeline.${number}.entries.${number}`
        | `timeline.${number}.completed`
        | 'timeline',
      value: boolean | string | string[] | TimelineEntry[]
    ) => void
    editEvent: (yearIndex: number, entryIndex: number) => void
    showScrollIcon: boolean
  }) => {
    // Virtualized row renderer for timeline years
    const Row = useCallback(
      ({ index, style }: { index: number; style: React.CSSProperties }) => {
        // Skip header row which is rendered separately
        const yearIndex = index
        const yearData = timeline[yearIndex]

        return (
          <div
            style={style}
            className={`grid ${
              showScrollIcon
                ? 'grid-cols-[80px_40px_1fr_auto]'
                : 'grid-cols-[80px_1fr_auto]'
            } gap-4 items-start border-t border-border py-1`}>
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
                        disabled={true}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <span className="text-sm font-medium ml-2 mb-1 inline-flex items-center">
                {yearIndex === 0 && !usesNormalNumbering
                  ? 'Prologue'
                  : usesNormalNumbering
                    ? yearIndex + 1
                    : yearIndex}
              </span>
            </div>

            {showScrollIcon && (
              <div className="flex justify-center items-center mt-1">
                <ScrollIcon className="h-5 w-5 text-muted-foreground" />
              </div>
            )}

            <div className="flex flex-col gap-2">
              {/* Display event badges for saved events */}
              {(yearData.entries || []).length > 0 && (
                <div className="flex flex-wrap gap-1 mb-1">
                  {(yearData.entries || []).map((entry, entryIndex) => {
                    // Only show as badge if not being edited and has content
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
                          onEdit={editEvent}
                        />
                      )
                    }
                    return null
                  })}
                </div>
              )}

              {/* Display editable fields for events that are being edited */}
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

              {/* Display "No events" message when there are no events */}
              {(yearData.entries || []).length === 0 && (
                <div className="text-sm text-gray-500 italic">No events</div>
              )}
            </div>

            <div className="flex justify-end">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  // Add a small delay to prevent blocking the UI
                  setTimeout(() => addEventToYear(yearIndex), 0)
                }}>
                <PlusCircleIcon className="h-4 w-4 mr-2" /> Add Event
              </Button>
            </div>
          </div>
        )
      },
      [
        timeline,
        form,
        usesNormalNumbering,
        isEventBeingEdited,
        setInputRef,
        handleKeyDown,
        saveEvent,
        removeEventFromYear,
        addEventToYear,
        editEvent,
        showScrollIcon
      ]
    )

    return (
      <div className="space-y-2">
        <div
          className={`grid ${showScrollIcon ? 'grid-cols-[80px_40px_1fr_auto]' : 'grid-cols-[80px_1fr_auto]'} gap-4 px-2 py-1 font-medium text-sm`}>
          <div>Year</div>
          {showScrollIcon && <div className="text-center" />}
          <div>Events</div>
          <div></div>
        </div>

        {timeline.length > 0 && (
          <div className="max-h-[600px] overflow-y-auto scrollbar-thin">
            {timeline.map((yearData, yearIndex) => (
              <Row key={yearIndex} index={yearIndex} style={{}} />
            ))}
          </div>
        )}
      </div>
    )
  }
)

TimelineContent.displayName = 'TimelineContent'

export function TimelineCard(
  form: UseFormReturn<z.infer<typeof SettlementSchema>>
) {
  const campaignType = form.watch('campaignType')
  const formTimeline = form.watch('timeline')
  const isSquiresCampaign = campaignType === CampaignType.SQUIRES_OF_THE_CITADEL
  const isStarsCampaign = campaignType === CampaignType.PEOPLE_OF_THE_STARS
  const isSunCampaign = campaignType === CampaignType.PEOPLE_OF_THE_SUN
  const isCustomCampaign = campaignType === CampaignType.CUSTOM

  // Check if the campaign uses normal numbering (no prologue)
  const usesNormalNumbering = useMemo(
    () =>
      isSquiresCampaign || isStarsCampaign || isSunCampaign || isCustomCampaign,
    [isSquiresCampaign, isStarsCampaign, isSunCampaign, isCustomCampaign]
  )

  // Check if this campaign type should show the scroll icon
  const showScrollIcon = useMemo(
    () =>
      campaignType === CampaignType.PEOPLE_OF_THE_LANTERN ||
      campaignType === CampaignType.PEOPLE_OF_THE_DREAM_KEEPER,
    [campaignType]
  )

  const [timeline, setTimeline] = useState(formTimeline || [])

  // Track which inputs are being edited
  const [editingEvents, setEditingEvents] = useState<{
    [key: string]: boolean
  }>({})

  // Helper function to check if an event is being edited - defined before it's used
  const isEventBeingEdited = useCallback(
    (yearIndex: number, entryIndex: number) => {
      const inputKey = `${yearIndex}-${entryIndex}`
      return !!editingEvents[inputKey]
    },
    [editingEvents]
  )

  // Use refs to store input values instead of state
  const inputRefs = useRef<{
    [key: string]: HTMLInputElement | null
  }>({})

  // Debounce state updates with proper typing
  const debouncedSetTimeline = useCallback(
    (newTimeline: TimelineEntry[]) => {
      // Create a closure over the current setTimeline to avoid stale references
      const currentSetTimeline = setTimeline
      requestAnimationFrame(() => {
        currentSetTimeline(newTimeline)
      })
    },
    [setTimeline]
  )

  const debouncedSetFormValue = useCallback(
    (
      path:
        | `timeline.${number}.entries`
        | `timeline.${number}.entries.${number}`
        | `timeline.${number}.completed`
        | 'timeline',
      value: boolean | string | string[] | TimelineEntry[]
    ) => {
      // Create a closure over the current form to avoid stale references
      const currentForm = form
      requestAnimationFrame(() => {
        currentForm.setValue(path, value)
      })
    },
    [form]
  )

  // Update timeline when form timeline changes
  useEffect(() => {
    if (formTimeline) {
      debouncedSetTimeline(formTimeline)

      // When timeline is first loaded or changed, all events should be in non-editing mode (badges)
      setEditingEvents({})
    }
  }, [formTimeline, debouncedSetTimeline])

  // Update timeline when campaign type changes
  useEffect(() => {
    const currentTimeline = form.getValues('timeline') || []

    if (isSquiresCampaign && currentTimeline.length > 5) {
      // Trim timeline to 5 rows for Squires campaign
      const trimmedTimeline = currentTimeline.slice(0, 5)
      debouncedSetTimeline(trimmedTimeline)
      debouncedSetFormValue('timeline', trimmedTimeline)
    } else if (!isSquiresCampaign && currentTimeline.length < 40) {
      // Expand timeline to 40 rows for other campaigns
      // Preserve existing timeline entries and add empty ones to reach 40
      const expandedTimeline = [
        ...currentTimeline,
        ...Array.from({ length: 40 - currentTimeline.length }, () => ({
          completed: false,
          entries: []
        }))
      ]
      debouncedSetTimeline(expandedTimeline)
      debouncedSetFormValue('timeline', expandedTimeline)
    }
  }, [
    campaignType,
    isSquiresCampaign,
    form,
    debouncedSetTimeline,
    debouncedSetFormValue
  ])

  const addTimelineEvent = () => {
    debouncedSetTimeline([...timeline, { completed: false, entries: [] }])
  }

  // Optimize the addEventToYear function with useCallback to prevent recreation on each render
  const addEventToYear = useCallback(
    (yearIndex: number) => {
      // First check if any event is currently being edited in this year
      const yearEntries = timeline[yearIndex]?.entries || []
      const hasActiveEditingEvent = yearEntries.some((_, entryIndex) =>
        isEventBeingEdited(yearIndex, entryIndex)
      )

      // If there is already an event being edited, show a toast and don't add a new one
      if (hasActiveEditingEvent) return

      // Use requestAnimationFrame to defer the state updates to the next frame
      requestAnimationFrame(() => {
        const updatedTimeline = [...timeline]
        const newEntryIndex = updatedTimeline[yearIndex].entries
          ? updatedTimeline[yearIndex].entries.length
          : 0

        updatedTimeline[yearIndex].entries = [
          ...(updatedTimeline[yearIndex].entries || []),
          ''
        ]

        // Update the timeline state
        debouncedSetTimeline(updatedTimeline)

        // Update the form state after the timeline state is updated
        debouncedSetFormValue(
          `timeline.${yearIndex}.entries`,
          updatedTimeline[yearIndex].entries
        )

        // Set this new event as being edited
        const inputKey = `${yearIndex}-${newEntryIndex}`
        setEditingEvents((prev) => ({
          ...prev,
          [inputKey]: true
        }))
      })
    },
    [
      timeline,
      debouncedSetTimeline,
      debouncedSetFormValue,
      setEditingEvents,
      isEventBeingEdited
    ]
  )

  const removeEventFromYear = useCallback(
    (yearIndex: number, eventIndex: number) => {
      requestAnimationFrame(() => {
        const updatedTimeline = [...timeline]
        const events = [...(updatedTimeline[yearIndex].entries || [])]
        events.splice(eventIndex, 1)
        updatedTimeline[yearIndex].entries = events

        // Update timeline state
        debouncedSetTimeline(updatedTimeline)

        // Update form state
        debouncedSetFormValue(`timeline.${yearIndex}.entries`, events)

        // Remove from tracking
        const inputKey = `${yearIndex}-${eventIndex}`
        setEditingEvents((prev) => {
          const newEditingEvents = { ...prev }
          delete newEditingEvents[inputKey]
          return newEditingEvents
        })
      })
    },
    [timeline, debouncedSetTimeline, debouncedSetFormValue, setEditingEvents]
  )

  const saveEvent = useCallback(
    (yearIndex: number, entryIndex: number) => {
      const inputKey = `${yearIndex}-${entryIndex}`
      const inputElement = inputRefs.current[inputKey]

      if (!inputElement) {
        return
      }

      const currentEvent = inputElement.value

      if (!currentEvent || currentEvent.trim() === '') {
        toast.warning('Cannot save an empty event')
        return
      }

      // Break the heavy operations into smaller chunks using multiple requestAnimationFrame calls
      // First, get the value from the input
      const newEventValue = currentEvent.trim()

      // Step 1: Update the UI to show we're processing (mark as non-editing immediately)
      setEditingEvents((prev) => {
        const newEditingEvents = { ...prev }
        delete newEditingEvents[inputKey]
        return newEditingEvents
      })

      // Step 2: Update the form value (this is likely the heaviest operation)
      requestAnimationFrame(() => {
        // Create a shallow copy of the timeline to avoid direct state mutation
        const updatedTimeline = [...timeline]
        if (!updatedTimeline[yearIndex].entries) {
          updatedTimeline[yearIndex].entries = []
        }

        // Update the specific entry in our local timeline
        updatedTimeline[yearIndex].entries[entryIndex] = newEventValue

        // Step 3: Update the local timeline state in the next frame
        requestAnimationFrame(() => {
          // Update the local state
          debouncedSetTimeline(updatedTimeline)

          // Step 4: Update the form state in yet another frame
          requestAnimationFrame(() => {
            debouncedSetFormValue(
              `timeline.${yearIndex}.entries.${entryIndex}`,
              newEventValue
            )

            // Final step: Show success toast
            requestAnimationFrame(() => {
              toast.success('Event saved to timeline')
            })
          })
        })
      })
    },
    [timeline, debouncedSetTimeline, debouncedSetFormValue, inputRefs]
  )

  const editEvent = useCallback(
    (yearIndex: number, entryIndex: number) => {
      const inputKey = `${yearIndex}-${entryIndex}`

      // Mark this event as being edited
      setEditingEvents((prev) => ({
        ...prev,
        [inputKey]: true
      }))
    },
    [setEditingEvents]
  )

  const handleKeyDown = useCallback(
    (
      e: KeyboardEvent<HTMLInputElement>,
      yearIndex: number,
      entryIndex: number
    ) => {
      // If the user presses Enter, save the event instead of submitting the form
      if (e.key === 'Enter') {
        e.preventDefault()
        saveEvent(yearIndex, entryIndex)
      }
    },
    [saveEvent]
  )

  // Function to set the ref for an input element
  const setInputRef = useCallback(
    (
      element: HTMLInputElement | null,
      yearIndex: number,
      entryIndex: number
    ) => {
      const inputKey = `${yearIndex}-${entryIndex}`
      inputRefs.current[inputKey] = element
    },
    []
  )

  // Add a visibility state for progressive loading when switching tabs
  const [isVisible, setIsVisible] = useState(false)

  // Use IntersectionObserver to detect when the component becomes visible (tab switched)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Check if the component is in view
    const observer = new IntersectionObserver(
      (entries) => {
        // When the timeline becomes visible, set isVisible to true with a small delay
        if (entries[0].isIntersecting) {
          // Small delay to ensure UI remains responsive during tab switch
          setTimeout(() => {
            setIsVisible(true)
          }, 50)
        }
      },
      { threshold: 0.1 } // Trigger when 10% of the component is visible
    )

    const currentCardRef = cardRef.current
    if (currentCardRef) {
      observer.observe(currentCardRef)
    }

    return () => {
      if (currentCardRef) {
        observer.unobserve(currentCardRef)
      }
    }
  }, [])

  // Preload essential data when component mounts, but defer full rendering
  const cachedTimeline = useMemo(() => timeline, [timeline])

  return (
    <Card ref={cardRef}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-1">
          <HourglassIcon className="h-5 w-5" /> Timeline
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 pb-2">
        {isVisible ? (
          <>
            <TimelineContent
              timeline={cachedTimeline}
              usesNormalNumbering={usesNormalNumbering}
              editingEvents={editingEvents}
              isEventBeingEdited={isEventBeingEdited}
              setInputRef={setInputRef}
              handleKeyDown={handleKeyDown}
              saveEvent={saveEvent}
              removeEventFromYear={removeEventFromYear}
              addEventToYear={addEventToYear}
              form={form}
              debouncedSetFormValue={debouncedSetFormValue}
              editEvent={editEvent}
              showScrollIcon={showScrollIcon}
            />
            <Button
              type="button"
              onClick={() => {
                // Add a small delay to prevent blocking the UI
                setTimeout(addTimelineEvent, 0)
              }}>
              Add Lantern Year
            </Button>
          </>
        ) : (
          <div className="py-10 text-center text-gray-500">
            Loading timeline...
          </div>
        )}
      </CardContent>
    </Card>
  )
}
