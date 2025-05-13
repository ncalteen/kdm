'use client'

import { TimelineContent } from '@/components/settlement/timeline/timeline-content'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CampaignType } from '@/lib/enums'
import { TimelineEvent } from '@/lib/types'
import { getCampaign } from '@/lib/utils'
import { SettlementSchema } from '@/schemas/settlement'
import { HourglassIcon, PlusCircleIcon } from 'lucide-react'
import {
  KeyboardEvent,
  startTransition,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react'
import { UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

/**
 * Timeline Card Component
 *
 * Displays the lantern years and events for a given settlement. Depending on
 * the campaign type, it may also show a scroll icon to indicate that a story
 * event card should be drawn when updating the settlement's timeline.
 */
export function TimelineCard(
  form: UseFormReturn<z.infer<typeof SettlementSchema>>
) {
  const campaignType = form.watch('campaignType')
  const formTimeline = form.watch('timeline')

  const [timeline, setTimeline] = useState(formTimeline || [])
  const [editingEvents, setEditingEvents] = useState<{
    [key: string]: boolean
  }>({})

  const inputRefs = useRef<{
    [key: string]: HTMLInputElement | null
  }>({})

  const isSquiresCampaign = campaignType === CampaignType.SQUIRES_OF_THE_CITADEL
  const isStarsCampaign = campaignType === CampaignType.PEOPLE_OF_THE_STARS
  const isSunCampaign = campaignType === CampaignType.PEOPLE_OF_THE_SUN
  const isCustomCampaign = campaignType === CampaignType.CUSTOM

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
   * Debounced function to set the timeline state.
   *
   * @param newTimeline New Timeline
   * @returns void
   */
  const debouncedSetTimeline = useCallback(
    (newTimeline: TimelineEvent[]) => {
      // Create a closure over the current setTimeline to avoid stale references
      const currentSetTimeline = setTimeline
      // Use requestAnimationFrame to ensure the state update is batched
      requestAnimationFrame(() => currentSetTimeline(newTimeline))
    },
    [setTimeline]
  )

  /**
   * Debounced function to set the form value.
   *
   * @param path Path to Set
   * @param value Value to Set
   * @returns void
   */
  const debouncedSetFormValue = useCallback(
    (
      path:
        | `timeline.${number}.entries`
        | `timeline.${number}.entries.${number}`
        | `timeline.${number}.completed`
        | 'timeline',
      value: boolean | string | string[] | TimelineEvent[]
    ) => {
      // Create a closure over the current form to avoid stale references
      const currentForm = form
      // Use requestAnimationFrame to ensure the state update is batched
      requestAnimationFrame(() => currentForm.setValue(path, value))
    },
    [form]
  )

  useEffect(() => {
    // Update the form value when the timeline state changes
    if (formTimeline) {
      debouncedSetTimeline(formTimeline)

      // When timeline is first loaded or changed, all events should be in
      // non-editing mode (badges)
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

      // Save to localStorage
      try {
        const formValues = form.getValues()
        const campaign = getCampaign()
        const settlementIndex = campaign.settlements.findIndex(
          (s: { id: number }) => s.id === formValues.id
        )

        campaign.settlements[settlementIndex].timeline = formValues.timeline
        localStorage.setItem('campaign', JSON.stringify(campaign))
      } catch (error) {
        console.error('Timeline Add Error:', error)
      }
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

      // Save to localStorage
      try {
        const formValues = form.getValues()
        const campaign = getCampaign()
        const settlementIndex = campaign.settlements.findIndex(
          (s: { id: number }) => s.id === formValues.id
        )

        campaign.settlements[settlementIndex].timeline = formValues.timeline
        localStorage.setItem('campaign', JSON.stringify(campaign))

        toast.success(
          'The chronicle is altered - this memory fades into darkness.'
        )
      } catch (error) {
        console.error('Timeline Remove Error:', error)
        toast.error(
          'The darkness resists - your changes to history are rejected. Please try again.'
        )
      }
    },
    [timeline, form]
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

      // Save to localStorage
      try {
        const formValues = form.getValues()
        const campaign = getCampaign()
        const settlementIndex = campaign.settlements.findIndex(
          (s: { id: number }) => s.id === formValues.id
        )

        campaign.settlements[settlementIndex].timeline = formValues.timeline
        localStorage.setItem('campaign', JSON.stringify(campaign))

        toast.success(
          'The chronicles remember - your memory is etched in stone.'
        )
      } catch (error) {
        console.error('Timeline Save Error:', error)
        toast.error(
          'The darkness clouds your memory - the chronicles remain unchanged. Please try again.'
        )
      }
    },
    [form, setEditingEvents, inputRefs]
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

  // Add a visibility state for progressive loading when switching tabs.
  const [isVisible, setIsVisible] = useState(false)

  // Use IntersectionObserver to detect when the component becomes visible.
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Check if the component is in view.
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) setIsVisible(true)
      },
      // Trigger when 10% of the component is visible
      { threshold: 0.1 }
    )

    const currentCardRef = cardRef.current

    if (currentCardRef) observer.observe(currentCardRef)

    return () => {
      if (currentCardRef) observer.unobserve(currentCardRef)
    }
  }, [])

  // Preload essential data when component mounts, but defer full rendering.
  const cachedTimeline = useMemo(() => timeline, [timeline])

  return (
    <Card ref={cardRef}>
      <CardHeader className="pb-2">
        <CardTitle className="text-md flex items-center gap-1">
          <HourglassIcon className="h-4 w-4" /> Timeline
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 pb-2">
        {isVisible ? (
          <>
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
            />

            {/* Add Lantern Year Button */}
            {!isSquiresCampaign && (
              <Button
                type="button"
                variant="outline"
                className="mt-4 w-full"
                size="lg"
                onClick={() => {
                  startTransition(() => {
                    const updatedTimeline = [
                      ...timeline,
                      { completed: false, entries: [] }
                    ]

                    debouncedSetTimeline(updatedTimeline)
                    debouncedSetFormValue('timeline', updatedTimeline)

                    // Save to localStorage
                    try {
                      const formValues = form.getValues()
                      const campaign = getCampaign()
                      const settlementIndex = campaign.settlements.findIndex(
                        (s: { id: number }) => s.id === formValues.id
                      )

                      campaign.settlements[settlementIndex].timeline =
                        updatedTimeline
                      localStorage.setItem('campaign', JSON.stringify(campaign))

                      toast.success(
                        'A new lantern year is added - the chronicles expand.'
                      )
                    } catch (error) {
                      console.error('Lantern Year Add Error:', error)
                      toast.error(
                        'The darkness resists - your changes to history are rejected. Please try again.'
                      )
                    }
                  })
                }}>
                <PlusCircleIcon className="h-4 w-4 mr-2" /> Add Lantern Year
              </Button>
            )}
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
