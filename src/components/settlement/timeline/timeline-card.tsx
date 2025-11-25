'use client'

import { TimelineContent } from '@/components/settlement/timeline/timeline-content'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { CampaignType } from '@/lib/enums'
import {
  TIMELINE_EVENT_EMPTY_ERROR_MESSAGE,
  TIMELINE_EVENT_EMPTY_WARNING_MESSAGE,
  TIMELINE_EVENT_REMOVED_MESSAGE,
  TIMELINE_EVENT_SAVED_MESSAGE,
  TIMELINE_YEAR_ADDED_MESSAGE,
  TIMELINE_YEAR_COMPLETED_MESSAGE
} from '@/lib/messages'
import { Settlement } from '@/schemas/settlement'
import { PlusCircleIcon } from 'lucide-react'
import {
  KeyboardEvent,
  ReactElement,
  startTransition,
  useCallback,
  useMemo,
  useRef,
  useState
} from 'react'
import { toast } from 'sonner'

/**
 * Timeline Card Properties
 */
interface TimelineCardProps {
  /** Save Selected Settlement */
  saveSelectedSettlement: (
    updateData: Partial<Settlement>,
    successMsg?: string
  ) => void
  /** Selected Settlement */
  selectedSettlement: Settlement | null
}

/**
 * Timeline Card Component
 *
 * Displays the lantern years and events for a given settlement. Depending on
 * the campaign type, it may also show a scroll icon to indicate that a story
 * event card should be drawn when updating the settlement's timeline.
 *
 * @param props Timeline Card Properties
 * @returns Timeline Card Component
 */
export function TimelineCard({
  saveSelectedSettlement,
  selectedSettlement
}: TimelineCardProps): ReactElement {
  const [editingEvents, setEditingEvents] = useState<{
    [key: string]: boolean
  }>({})

  const inputRefs = useRef<{
    [key: string]: HTMLInputElement | null
  }>({})

  const {
    isSquiresCampaign,
    isStarsCampaign,
    isSunCampaign,
    isCustomCampaign
  } = useMemo(
    () => ({
      isSquiresCampaign:
        selectedSettlement?.campaignType ===
        CampaignType.SQUIRES_OF_THE_CITADEL,
      isStarsCampaign:
        selectedSettlement?.campaignType === CampaignType.PEOPLE_OF_THE_STARS,
      isSunCampaign:
        selectedSettlement?.campaignType === CampaignType.PEOPLE_OF_THE_SUN,
      isCustomCampaign: selectedSettlement?.campaignType === CampaignType.CUSTOM
    }),
    [selectedSettlement?.campaignType]
  )

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
      selectedSettlement?.campaignType === CampaignType.PEOPLE_OF_THE_LANTERN ||
      selectedSettlement?.campaignType ===
        CampaignType.PEOPLE_OF_THE_DREAM_KEEPER ||
      selectedSettlement?.campaignType === CampaignType.CUSTOM,
    [selectedSettlement?.campaignType]
  )

  /**
   * Is Event Being Edited
   *
   * @param yearIndex Year Index
   * @param entryIndex Event Entry Index
   * @returns Event is Being Edited
   */
  const isEventBeingEdited = useCallback(
    (yearIndex: number, entryIndex: number) =>
      !!editingEvents[`${yearIndex}-${entryIndex}`],
    [editingEvents]
  )

  /**
   * Adds an Event to a Year
   *
   * This uses the form state directly instead of the settlement context, to
   * ensure that the timeline is updated immediately without needing to
   * re-render the entire settlement context.
   *
   * @param yearIndex Year Index
   */
  const addEventToYear = useCallback(
    (yearIndex: number) => {
      const currentEntries =
        selectedSettlement?.timeline?.[yearIndex].entries || []

      // Check if any entry in this year is being edited
      const isEditing = Object.keys(editingEvents).some((key) => {
        const [keyYearIndex] = key.split('-').map(Number)
        return keyYearIndex === yearIndex && editingEvents[key]
      })

      // Check if any entry in this year is empty
      const hasEmpty = currentEntries.some((e) => !e || e.trim() === '')

      // Warn the user that there is an empty event or an event being edited
      // and prevent adding another event.
      if (isEditing || hasEmpty)
        return toast.warning(TIMELINE_EVENT_EMPTY_WARNING_MESSAGE())

      const newEntryIndex = currentEntries.length

      // Set this new event as being edited - this will trigger the input to show
      setEditingEvents((prev) => ({
        ...prev,
        [`${yearIndex}-${newEntryIndex}`]: true
      }))

      // Note: We don't save to localStorage here because we're adding an empty
      // string which would fail Zod validation. We only save when the user
      // actually enters content in the saveEvent function.
    },
    [selectedSettlement?.timeline, editingEvents]
  )

  /**
   * Removes an Event from a Year
   *
   * @param yearIndex Year Index
   * @param eventIndex Event Index
   */
  const removeEventFromYear = useCallback(
    (yearIndex: number, eventIndex: number) => {
      const currentEntries =
        selectedSettlement?.timeline?.[yearIndex].entries || []
      const inputKey = `${yearIndex}-${eventIndex}`

      // Remove from editingEvents first
      setEditingEvents((prev) => {
        const newEditingEvents = { ...prev }
        delete newEditingEvents[inputKey]
        return newEditingEvents
      })

      // If the entry index is beyond the current entries length, it means we're
      // canceling the creation of a new entry, so we don't need to save anything
      if (eventIndex >= currentEntries.length) return

      // Remove the entry from the timeline and save
      const newEntries = [...currentEntries]
      newEntries.splice(eventIndex, 1)

      const updatedTimeline = selectedSettlement?.timeline || []
      const year = { ...selectedSettlement?.timeline?.[yearIndex] }
      year.entries = newEntries
      updatedTimeline[yearIndex] = year as {
        entries: string[]
        completed: boolean
      }

      saveSelectedSettlement(
        {
          timeline: updatedTimeline
        },
        TIMELINE_EVENT_REMOVED_MESSAGE()
      )
    },
    [selectedSettlement?.timeline, saveSelectedSettlement]
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
        return toast.warning(TIMELINE_EVENT_EMPTY_ERROR_MESSAGE())

      const newEventValue = currentEvent.trim()

      setEditingEvents((prev) => {
        const newEditingEvents = { ...prev }
        delete newEditingEvents[inputKey]
        return newEditingEvents
      })

      // Save to localStorage with the updated timeline
      const updatedTimeline = selectedSettlement?.timeline || []
      const year = { ...updatedTimeline[yearIndex] }
      year.entries = [...(year.entries || [])]
      year.entries[entryIndex] = newEventValue
      updatedTimeline[yearIndex] = year

      saveSelectedSettlement(
        {
          timeline: updatedTimeline
        },
        TIMELINE_EVENT_SAVED_MESSAGE()
      )
    },
    [selectedSettlement?.timeline, inputRefs, saveSelectedSettlement]
  )

  /**
   * Handles updating year completion status.
   *
   * @param yearIndex Year Index
   * @param completed Completion Status
   */
  const handleYearCompletionChange = useCallback(
    (yearIndex: number, completed: boolean) => {
      // Save to localStorage with the updated timeline
      const updatedTimeline = selectedSettlement?.timeline || []
      const year = { ...updatedTimeline[yearIndex] }
      year.completed = completed
      updatedTimeline[yearIndex] = year

      saveSelectedSettlement(
        {
          timeline: updatedTimeline
        },
        TIMELINE_YEAR_COMPLETED_MESSAGE(completed)
      )
    },
    [selectedSettlement?.timeline, saveSelectedSettlement]
  )

  /**
   * Edits an Event in the Timeline
   *
   * @param yearIndex Year Index
   * @param entryIndex Event Entry Index
   */
  const editEvent = useCallback(
    (yearIndex: number, entryIndex: number) => {
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
    [setEditingEvents]
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

  return (
    <Card className="border-0 w-full h-full pt-0">
      <CardContent className="flex flex-col justify-between h-full">
        {/* Timeline Content */}
        <TimelineContent
          usesNormalNumbering={usesNormalNumbering}
          isEventBeingEdited={isEventBeingEdited}
          setInputRef={setInputRef}
          handleKeyDown={handleKeyDown}
          saveEvent={saveEvent}
          removeEventFromYear={removeEventFromYear}
          addEventToYear={addEventToYear}
          editEvent={editEvent}
          showStoryEventIcon={showStoryEventIcon}
          handleYearCompletionChange={handleYearCompletionChange}
          selectedSettlement={selectedSettlement}
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
                const currentTimeline = selectedSettlement?.timeline || []
                const newTimeline = [
                  ...currentTimeline,
                  { completed: false, entries: [] }
                ]

                saveSelectedSettlement(
                  {
                    timeline: newTimeline
                  },
                  TIMELINE_YEAR_ADDED_MESSAGE()
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
