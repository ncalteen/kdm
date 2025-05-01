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
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '../dialog'
import { FormControl, FormField, FormItem } from '../form'
import { Input } from '../input'

// Define type for TimelineEntry based on the schema
type TimelineEntry = {
  completed?: boolean
  entries: string[]
}

// Add Event Dialog component
const AddEventDialog = memo(
  ({
    yearIndex,
    yearLabel,
    addEventToYear
  }: {
    yearIndex: number
    yearLabel: string
    addEventToYear: (yearIndex: number, event: string) => void
  }) => {
    const [newEvent, setNewEvent] = useState('')
    const [open, setOpen] = useState(false)

    const handleAddEvent = () => {
      if (newEvent.trim() === '') {
        toast.warning('Cannot add an empty event')
        return
      }

      addEventToYear(yearIndex, newEvent.trim())
      setNewEvent('')
      setOpen(false)
    }

    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button type="button" variant="outline" size="sm" className="mr-5">
            <PlusCircleIcon className="h-4 w-4 mr-2" /> Add Event
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Event to {yearLabel}</DialogTitle>
          </DialogHeader>
          <div className="flex items-center">
            <Input
              placeholder={`${yearLabel} event...`}
              value={newEvent}
              onChange={(e) => setNewEvent(e.target.value)}
              className="flex-1"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleAddEvent()
                }
              }}
              autoFocus
            />
          </div>
          <DialogFooter className="flex justify-end">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleAddEvent}
              title="Add event">
              <CheckIcon className="h-5 w-5 text-primary" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }
)

AddEventDialog.displayName = 'AddEventDialog'

// Edit Event Dialog component
const EditEventDialog = memo(
  ({
    yearIndex,
    yearLabel,
    entryIndex,
    entry,
    saveEvent,
    removeEventFromYear
  }: {
    yearIndex: number
    yearLabel: string
    entryIndex: number
    entry: string
    saveEvent: (yearIndex: number, entryIndex: number, event: string) => void
    removeEventFromYear: (yearIndex: number, eventIndex: number) => void
  }) => {
    const [eventText, setEventText] = useState(entry)
    const [open, setOpen] = useState(false)

    // Reset the input when the dialog opens
    useEffect(() => {
      if (open) {
        setEventText(entry)
      }
    }, [open, entry])

    const handleSaveEvent = () => {
      if (eventText.trim() === '') {
        toast.warning('Cannot save an empty event')
        return
      }

      saveEvent(yearIndex, entryIndex, eventText.trim())
      setOpen(false)
    }

    const handleRemoveEvent = () => {
      removeEventFromYear(yearIndex, entryIndex)
      setOpen(false)
    }

    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Badge className="cursor-pointer mt-1">
            {entry.startsWith('Nemesis') ? (
              <SwordsIcon className="h-4 w-4 mr-1" />
            ) : (
              <BookOpenIcon className="h-4 w-4 mr-1" />
            )}
            {entry}
          </Badge>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Event for {yearLabel}</DialogTitle>
          </DialogHeader>
          <div className="flex items-center">
            <Input
              placeholder={`${yearLabel} event...`}
              value={eventText}
              onChange={(e) => setEventText(e.target.value)}
              className="flex-1"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleSaveEvent()
                }
              }}
              autoFocus
            />
          </div>
          <DialogFooter className="flex justify-between">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleRemoveEvent}
              title="Delete event">
              <TrashIcon className="h-5 w-5 text-destructive" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleSaveEvent}
              title="Save event">
              <CheckIcon className="h-5 w-5 text-primary" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }
)

EditEventDialog.displayName = 'EditEventDialog'

// Split TimelineContent into a separate component to allow for lazy loading
const TimelineContent = memo(
  ({
    timeline,
    usesNormalNumbering,
    saveEvent,
    removeEventFromYear,
    addEventToYear,
    form,
    showScrollIcon,
    isVisible,
    setIsVisible
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
    saveEvent: (yearIndex: number, entryIndex: number, event?: string) => void
    removeEventFromYear: (yearIndex: number, eventIndex: number) => void
    addEventToYear: (yearIndex: number, event: string) => void
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
    isVisible: { visible: boolean; visibleCount: number }
    setIsVisible: React.Dispatch<
      React.SetStateAction<{ visible: boolean; visibleCount: number }>
    >
  }) => {
    // Virtualized row renderer for timeline years
    const Row = useCallback(
      ({ index }: { index: number }) => {
        // Skip header row which is rendered separately
        const yearIndex = index
        const yearData = timeline[yearIndex]

        const yearLabel =
          yearIndex === 0 && !usesNormalNumbering
            ? 'Prologue'
            : usesNormalNumbering
              ? `${yearIndex + 1}`
              : `${yearIndex}`

        return (
          <div
            className={`grid ${showScrollIcon ? 'grid-cols-[80px_40px_1fr_auto]' : 'grid-cols-[80px_1fr_auto]'} gap-4 items-start border-t border-border py-1`}>
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
                {yearLabel}
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
                <div className="flex flex-wrap gap-2 mb-2">
                  {(yearData.entries || []).map((entry, entryIndex) => {
                    // Only show badges if the entry has content
                    if (entry && entry.trim() !== '') {
                      return (
                        <EditEventDialog
                          key={entryIndex}
                          yearIndex={yearIndex}
                          yearLabel={yearLabel}
                          entryIndex={entryIndex}
                          entry={entry}
                          saveEvent={saveEvent}
                          removeEventFromYear={removeEventFromYear}
                        />
                      )
                    }
                    return null
                  })}
                </div>
              )}

              {/* Display "No events" message when there are no events */}
              {(yearData.entries || []).length === 0 && (
                <div className="text-sm text-gray-500 italic">No events</div>
              )}
            </div>

            <div className="flex justify-end">
              <AddEventDialog
                yearIndex={yearIndex}
                yearLabel={yearLabel}
                addEventToYear={(yearIndex, event) => {
                  // Add a small delay to prevent blocking the UI
                  setTimeout(() => addEventToYear(yearIndex, event), 0)
                }}
              />
            </div>
          </div>
        )
      },
      [
        timeline,
        form,
        usesNormalNumbering,
        saveEvent,
        removeEventFromYear,
        addEventToYear,
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
          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin">
            {/* Use windowing approach to only render visible items */}
            {timeline.slice(0, isVisible.visibleCount).map((_, index) => (
              <Row key={index} index={index} />
            ))}
            {timeline.length > isVisible.visibleCount && (
              <div
                ref={(el) => {
                  if (!el) return
                  // Use Intersection Observer to load more items when scrolling
                  const observer = new IntersectionObserver((entries) => {
                    if (entries[0].isIntersecting) {
                      // Load more items when the user scrolls near the bottom
                      observer.disconnect()
                      setIsVisible((prev) => ({
                        ...prev,
                        visibleCount: Math.min(
                          timeline.length,
                          prev.visibleCount + 20
                        )
                      }))
                    }
                  })
                  observer.observe(el)
                }}
                className="h-8 w-full">
                {/* Loading indicator */}
                <div className="py-2 text-center text-xs text-muted-foreground">
                  Scroll to load more...
                </div>
              </div>
            )}
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
    (yearIndex: number, event: string) => {
      requestAnimationFrame(() => {
        const updatedTimeline = [...timeline]

        // Add the new event to the entries array
        updatedTimeline[yearIndex].entries = [
          ...(updatedTimeline[yearIndex].entries || []),
          event
        ]

        // Update the timeline state
        debouncedSetTimeline(updatedTimeline)

        // Update the form state after the timeline state is updated
        debouncedSetFormValue(
          `timeline.${yearIndex}.entries`,
          updatedTimeline[yearIndex].entries
        )

        // Since we're adding from the dialog, we don't need to mark it for editing
        // The event text is already provided and validated
        toast.success('Event added to timeline')
      })
    },
    [timeline, debouncedSetTimeline, debouncedSetFormValue]
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
    (yearIndex: number, entryIndex: number, event?: string) => {
      // For dialog-based editing, we'll receive the event text directly
      const newEventValue = event?.trim()

      if (!newEventValue || newEventValue === '') {
        toast.warning('Cannot save an empty event')
        return
      }

      // Update in a single requestAnimationFrame for better performance
      requestAnimationFrame(() => {
        // Create a shallow copy of the timeline to avoid direct state mutation
        const updatedTimeline = [...timeline]
        if (!updatedTimeline[yearIndex].entries) {
          updatedTimeline[yearIndex].entries = []
        }

        // Update the specific entry in our local timeline
        updatedTimeline[yearIndex].entries[entryIndex] = newEventValue

        // Update the local state
        debouncedSetTimeline(updatedTimeline)

        // Update the form state
        debouncedSetFormValue(
          `timeline.${yearIndex}.entries.${entryIndex}`,
          newEventValue
        )

        toast.success('Event saved to timeline')
      })
    },
    [timeline, debouncedSetTimeline, debouncedSetFormValue]
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
  const [isVisible, setIsVisible] = useState<{
    visible: boolean
    visibleCount: number
  }>({ visible: false, visibleCount: 20 })

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
            setIsVisible({ visible: true, visibleCount: 20 })
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
        {isVisible.visible ? (
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
              isVisible={isVisible}
              setIsVisible={setIsVisible}
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
