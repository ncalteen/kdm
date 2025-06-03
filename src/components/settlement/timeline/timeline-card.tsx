'use client'

import { TimelineContent } from '@/components/settlement/timeline/timeline-content'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { CampaignType } from '@/lib/enums'
import { getCampaign, saveCampaignToLocalStorage } from '@/lib/utils'
import {
  Settlement,
  SettlementSchema,
  TimelineYear
} from '@/schemas/settlement'
import { PlusCircleIcon } from 'lucide-react'
import {
  KeyboardEvent,
  ReactElement,
  startTransition,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react'
import { UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'
import { ZodError } from 'zod'

/**
 * Timeline Card Component
 *
 * Displays the lantern years and events for a given settlement. Depending on
 * the campaign type, it may also show a scroll icon to indicate that a story
 * event card should be drawn when updating the settlement's timeline.
 *
 * @param form Settlement form instance
 * @returns Timeline Card Component
 */
export function TimelineCard(form: UseFormReturn<Settlement>): ReactElement {
  const watchedCampaignType = form.watch('campaignType')
  const watchedTimeline = form.watch('timeline')

  const campaignType = useMemo(() => watchedCampaignType, [watchedCampaignType])
  const formTimeline = useMemo(() => watchedTimeline, [watchedTimeline])

  const [timeline, setTimeline] = useState<TimelineYear[]>(formTimeline || [])
  const [editingEvents, setEditingEvents] = useState<{
    [key: string]: boolean
  }>({})

  const inputRefs = useRef<{
    [key: string]: HTMLInputElement | null
  }>({})

  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const campaignTypeFlags = useMemo(
    () => ({
      isSquiresCampaign: campaignType === CampaignType.SQUIRES_OF_THE_CITADEL,
      isStarsCampaign: campaignType === CampaignType.PEOPLE_OF_THE_STARS,
      isSunCampaign: campaignType === CampaignType.PEOPLE_OF_THE_SUN,
      isCustomCampaign: campaignType === CampaignType.CUSTOM
    }),
    [campaignType]
  )

  const {
    isSquiresCampaign,
    isStarsCampaign,
    isSunCampaign,
    isCustomCampaign
  } = campaignTypeFlags

  // Check if the campaign uses normal numbering (no Prologue). Prologue is
  // only used in the People of the Lantern and People of the Dream Keeper
  // campaigns (as well as custom campaigns).
  const usesNormalNumbering = useMemo(
    () =>
      isSquiresCampaign || isStarsCampaign || isSunCampaign || isCustomCampaign,
    [isSquiresCampaign, isStarsCampaign, isSunCampaign, isCustomCampaign]
  )

  // Check if this campaign type should show the scroll icon. This is used to
  // indicate that a story event card should be drawn when updating the
  // settlement's timeline.
  const showStoryEventIcon = useMemo(
    () =>
      campaignType === CampaignType.PEOPLE_OF_THE_LANTERN ||
      campaignType === CampaignType.PEOPLE_OF_THE_DREAM_KEEPER ||
      campaignType === CampaignType.CUSTOM,
    [campaignType]
  )

  /**
   * Checks if an event is being edited.
   *
   * @param yearIndex Year Index
   * @param entryIndex Event Entry Index
   * @returns True if the event is being edited, false otherwise
   */
  const isEventBeingEdited = useCallback(
    (yearIndex: number, entryIndex: number) => {
      const inputKey = `${yearIndex}-${entryIndex}`
      return !!editingEvents[inputKey]
    },
    [editingEvents]
  )

  /**
   * Debounced save timeline to localStorage for the current settlement, with
   * Zod validation and toast feedback.
   *
   * @param updatedTimeline Updated Timeline
   * @param successMsg Success Message
   * @param immediate Whether to save immediately without debouncing
   */
  const debouncedSaveToLocalStorage = useCallback(
    (
      updatedTimeline: TimelineYear[],
      successMsg?: string,
      immediate = false
    ) => {
      // Clear existing timeout
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)

      const saveFunction = () => {
        try {
          const formValues = form.getValues()
          const campaign = getCampaign()
          const settlementIndex = campaign.settlements.findIndex(
            (s: { id: number }) => s.id === formValues.id
          )

          if (settlementIndex !== -1) {
            try {
              SettlementSchema.shape.timeline.parse(updatedTimeline)
            } catch (error) {
              if (error instanceof ZodError && error.errors[0]?.message)
                return toast.error(error.errors[0].message)
              else
                return toast.error(
                  'The darkness swallows your words. Please try again.'
                )
            }

            campaign.settlements[settlementIndex].timeline = updatedTimeline
            saveCampaignToLocalStorage(campaign)

            if (successMsg) toast.success(successMsg)
          }
        } catch (error) {
          console.error('Timeline Save Error:', error)
          toast.error('The darkness swallows your words. Please try again.')
        }
      }

      if (immediate) {
        saveFunction()
      } else {
        // Debounce saves by 300ms to reduce localStorage writes
        saveTimeoutRef.current = setTimeout(saveFunction, 300)
      }
    },
    [form, saveTimeoutRef]
  )

  /**
   * Save timeline to localStorage for the current settlement, with Zod
   * validation and toast feedback.
   *
   * @param updatedTimeline Updated Timeline
   * @param successMsg Success Message
   */
  const saveToLocalStorage = useCallback(
    (updatedTimeline: TimelineYear[], successMsg?: string) => {
      debouncedSaveToLocalStorage(updatedTimeline, successMsg, true)
    },
    [debouncedSaveToLocalStorage]
  )

  useEffect(() => {
    // Update the form value when the timeline state changes
    if (formTimeline) {
      setTimeline(formTimeline)

      // When timeline is first loaded or changed, all events should be in
      // non-editing mode (badges)
      setEditingEvents({})
    }
  }, [formTimeline])

  // Update timeline when campaign type changes
  useEffect(() => {
    const currentTimeline = form.getValues('timeline') || []

    if (isSquiresCampaign && currentTimeline.length > 5) {
      // Trim timeline to 5 rows for Squires campaign
      const trimmedTimeline = currentTimeline.slice(0, 5)

      setTimeline(trimmedTimeline)
      form.setValue('timeline', trimmedTimeline)
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

      setTimeline(expandedTimeline)
      form.setValue('timeline', expandedTimeline)
    }
  }, [campaignType, isSquiresCampaign, form])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)
    }
  }, [])

  /**
   * Adds an Event to a Year
   *
   * @param yearIndex Year Index
   */
  const addEventToYear = useCallback(
    (yearIndex: number) => {
      // Prevent adding another input if an empty event already exists this year
      const yearEntries = timeline[yearIndex]?.entries || []

      // Check if any entry in this year is being edited
      const isEditing = yearEntries.some(
        (_, entryIndex) => editingEvents[`${yearIndex}-${entryIndex}`]
      )

      // Check if any entry in this year is empty
      const hasEmpty = yearEntries.some((e) => !e || e.trim() === '')

      // Warn the user that there is an empty event or an event being edited
      // and prevent adding another event.
      if (isEditing || hasEmpty)
        return toast.warning(
          'Finish editing the current event before adding another.'
        )

      setTimeline((prevTimeline) => {
        // Only update the affected year
        const updatedTimeline = [...prevTimeline]
        const year = { ...updatedTimeline[yearIndex] }

        year.entries = [...(year.entries || []), '']
        updatedTimeline[yearIndex] = year

        return updatedTimeline
      })

      // Update the form state for just the affected year.
      form.setValue(`timeline.${yearIndex}.entries`, [...yearEntries, ''])

      // Set this new event as being edited.
      setEditingEvents((prev) => ({
        ...prev,
        [`${yearIndex}-${yearEntries.length}`]: true
      }))

      // Note: We don't save to localStorage here because we're adding an empty
      // string which would fail Zod validation. We only save when the user
      // actually enters content.
    },
    [timeline, form, editingEvents]
  )

  /**
   * Removes an Event from a Year
   *
   * @param yearIndex Year Index
   * @param eventIndex Event Index
   */
  const removeEventFromYear = useCallback(
    (yearIndex: number, eventIndex: number) => {
      setTimeline((prevTimeline) => {
        const updatedTimeline = [...prevTimeline]
        const year = { ...updatedTimeline[yearIndex] }

        year.entries = [...(year.entries || [])]
        year.entries.splice(eventIndex, 1)
        updatedTimeline[yearIndex] = year

        return updatedTimeline
      })

      // Update form state for just the affected year.
      const yearEntries = timeline[yearIndex]?.entries || []
      const newEntries = [...yearEntries]
      const inputKey = `${yearIndex}-${eventIndex}`

      newEntries.splice(eventIndex, 1)
      form.setValue(`timeline.${yearIndex}.entries`, newEntries)

      // Remove from editingEvents
      setEditingEvents((prev) => {
        const newEditingEvents = { ...prev }
        delete newEditingEvents[inputKey]
        return newEditingEvents
      })

      // Save to localStorage with the updated timeline
      const updatedTimeline = [...timeline]
      const year = { ...updatedTimeline[yearIndex] }
      year.entries = [...(year.entries || [])]
      year.entries.splice(eventIndex, 1)
      updatedTimeline[yearIndex] = year

      saveToLocalStorage(
        updatedTimeline,
        'The chronicle is altered - a memory fades into darkness.'
      )
    },
    [timeline, form, saveToLocalStorage]
  )

  /**
   * Saves an Event to the Timeline
   *
   * @param yearIndex Year Index
   * @param entryIndex Event Entry Index
   */
  const saveEvent = useCallback(
    (yearIndex: number, entryIndex: number) => {
      const inputKey = `${yearIndex}-${entryIndex}`
      const inputElement = inputRefs.current[inputKey]

      if (!inputElement) return

      const currentEvent = inputElement.value

      if (!currentEvent || currentEvent.trim() === '')
        return toast.warning('Cannot save an empty event!')

      const newEventValue = currentEvent.trim()

      setEditingEvents((prev) => {
        const newEditingEvents = { ...prev }
        delete newEditingEvents[inputKey]
        return newEditingEvents
      })

      setTimeline((prevTimeline) => {
        const updatedTimeline = [...prevTimeline]
        const year = { ...updatedTimeline[yearIndex] }

        year.entries = [...(year.entries || [])]
        year.entries[entryIndex] = newEventValue
        updatedTimeline[yearIndex] = year

        return updatedTimeline
      })

      form.setValue(
        `timeline.${yearIndex}.entries.${entryIndex}`,
        newEventValue
      )

      // Save to localStorage with the updated timeline
      const updatedTimeline = [...timeline]
      const year = { ...updatedTimeline[yearIndex] }
      year.entries = [...(year.entries || [])]
      year.entries[entryIndex] = newEventValue
      updatedTimeline[yearIndex] = year

      saveToLocalStorage(
        updatedTimeline,
        'The chronicles remember - a memory is etched in stone.'
      )
    },
    [form, inputRefs, timeline, saveToLocalStorage]
  )

  /**
   * Handles updating year completion status.
   *
   * @param yearIndex Year Index
   * @param completed Completion Status
   */
  const handleYearCompletionChange = useCallback(
    (yearIndex: number, completed: boolean) => {
      setTimeline((prevTimeline) => {
        const updatedTimeline = [...prevTimeline]
        const year = { ...updatedTimeline[yearIndex] }
        year.completed = completed
        updatedTimeline[yearIndex] = year
        return updatedTimeline
      })

      form.setValue(`timeline.${yearIndex}.completed`, completed)

      // Save to localStorage with the updated timeline
      const updatedTimeline = [...timeline]
      const year = { ...updatedTimeline[yearIndex] }
      year.completed = completed
      updatedTimeline[yearIndex] = year

      saveToLocalStorage(
        updatedTimeline,
        completed
          ? 'The year concludes in triumph.'
          : 'The year remains unfinished.'
      )
    },
    [timeline, form, saveToLocalStorage]
  )

  /**
   * Edits an Event in the Timeline
   *
   * @param yearIndex Year Index
   * @param entryIndex Event Entry Index
   */
  const editEvent = useCallback(
    (yearIndex: number, entryIndex: number) => {
      // Remove any empty (unsaved) event in this year before editing.
      setTimeline((prevTimeline) => {
        const updatedTimeline = [...prevTimeline]
        const year = { ...updatedTimeline[yearIndex] }
        const entries = [...(year.entries || [])]

        for (let i = entries.length - 1; i >= 0; i--)
          if (
            (entries[i] === '' || entries[i]?.trim() === '') &&
            i !== entryIndex
          )
            entries.splice(i, 1)

        year.entries = entries
        updatedTimeline[yearIndex] = year

        return updatedTimeline
      })

      // Update the form state
      const yearEntries = timeline[yearIndex]?.entries || []
      const filteredEntries = yearEntries.filter(
        (e, i) => !(i !== entryIndex && (!e || e.trim() === ''))
      )

      form.setValue(`timeline.${yearIndex}.entries`, filteredEntries)

      // Remove editing state for all other events in this year...only allow one
      // editing input per year.
      setEditingEvents((prev) => {
        const newEditingEvents = { ...prev }

        Object.keys(newEditingEvents).forEach((key) => {
          if (
            key.startsWith(`${yearIndex}-`) &&
            key !== `${yearIndex}-${entryIndex}`
          )
            delete newEditingEvents[key]
        })

        // Set the selected event as editing.
        newEditingEvents[`${yearIndex}-${entryIndex}`] = true
        return newEditingEvents
      })
    },
    [setEditingEvents, setTimeline, form, timeline]
  )

  /**
   * Handles the key down event for the input element.
   *
   * @param e Keyboard Event
   * @param yearIndex Year Index
   * @param entryIndex Event Entry Index
   */
  const handleKeyDown = useCallback(
    (
      e: KeyboardEvent<HTMLInputElement>,
      yearIndex: number,
      entryIndex: number
    ) => {
      // If the user presses Enter, save the event instead of submitting.
      if (e.key === 'Enter') {
        e.preventDefault()
        saveEvent(yearIndex, entryIndex)
      }
    },
    [saveEvent]
  )

  /**
   * Sets the input reference for the event input.
   *
   * @param element Input Element
   * @param yearIndex Year Index
   * @param entryIndex Event Entry Index
   */
  const setInputRef = useCallback(
    (
      element: HTMLInputElement | null,
      yearIndex: number,
      entryIndex: number
    ) => {
      inputRefs.current[`${yearIndex}-${entryIndex}`] = element
    },
    []
  )

  // Preload essential data when component mounts
  const cachedTimeline = useMemo(() => timeline, [timeline])

  return (
    <Card className="border-0 w-full h-full pt-0">
      <CardContent className="flex flex-col justify-between h-full">
        {/* Timeline Content */}
        <TimelineContent
          timeline={cachedTimeline}
          usesNormalNumbering={usesNormalNumbering}
          isEventBeingEdited={isEventBeingEdited}
          setInputRef={setInputRef}
          handleKeyDown={handleKeyDown}
          saveEvent={saveEvent}
          removeEventFromYear={removeEventFromYear}
          addEventToYear={addEventToYear}
          form={form}
          editEvent={editEvent}
          showStoryEventIcon={showStoryEventIcon}
          handleYearCompletionChange={handleYearCompletionChange}
        />

        {/* Add Lantern Year Button */}
        {!isSquiresCampaign && (
          <Button
            type="button"
            variant="outline"
            className="mt-2 w-full"
            size="lg"
            onClick={() => {
              startTransition(() => {
                const updatedTimeline = [
                  ...timeline,
                  { completed: false, entries: [] }
                ]

                setTimeline(updatedTimeline)
                form.setValue('timeline', updatedTimeline)

                saveToLocalStorage(
                  updatedTimeline,
                  'A new lantern year is added - the chronicles expand.'
                )
              })
            }}>
            <PlusCircleIcon className="h-4 w-4" /> Add Lantern Year
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
