'use client'

import { TimelineContent } from '@/components/settlement/timeline/timeline-content'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useSettlement } from '@/contexts/settlement-context'
import { useSettlementSave } from '@/hooks/use-settlement-save'
import { CampaignType } from '@/lib/enums'
import { Settlement, TimelineYear } from '@/schemas/settlement'
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
import { UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'

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
export function TimelineCard({
  ...form
}: UseFormReturn<Settlement>): ReactElement {
  const { saveSettlement } = useSettlementSave(form)
  const { selectedSettlement } = useSettlement()

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
   * Save timeline data to localStorage and update context
   *
   * @param updatedTimeline Updated Timeline
   * @param successMsg Optional success message to display
   */
  const saveToLocalStorage = useCallback(
    (updatedTimeline: TimelineYear[], successMsg?: string) =>
      saveSettlement(
        {
          timeline: updatedTimeline
        },
        successMsg
      ),
    [saveSettlement]
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
      // Prevent adding another input if an empty event already exists this year
      const yearEntries = form.watch(`timeline.${yearIndex}.entries`) || []

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
    [form, editingEvents]
  )

  /**
   * Removes an Event from a Year
   *
   * @param yearIndex Year Index
   * @param eventIndex Event Index
   */
  const removeEventFromYear = useCallback(
    (yearIndex: number, eventIndex: number) => {
      const yearEntries = form.watch(`timeline.${yearIndex}.entries`) || []
      const newEntries = [...yearEntries]
      const inputKey = `${yearIndex}-${eventIndex}`

      newEntries.splice(eventIndex, 1)

      // Update form state
      form.setValue(`timeline.${yearIndex}.entries`, newEntries)

      // Remove from editingEvents
      setEditingEvents((prev) => {
        const newEditingEvents = { ...prev }
        delete newEditingEvents[inputKey]
        return newEditingEvents
      })

      // Save to localStorage with the updated timeline
      const updatedTimeline = form.watch('timeline') || []
      const year = { ...updatedTimeline[yearIndex] }

      year.entries = [...(year.entries || [])]
      year.entries.splice(eventIndex, 1)
      updatedTimeline[yearIndex] = year

      saveToLocalStorage(
        updatedTimeline,
        'The chronicle is altered - a memory fades into darkness.'
      )
    },
    [form, saveToLocalStorage]
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

      form.setValue(
        `timeline.${yearIndex}.entries.${entryIndex}`,
        newEventValue
      )

      // Save to localStorage with the updated timeline
      const updatedTimeline = form.watch('timeline') || []
      const year = { ...updatedTimeline[yearIndex] }
      year.entries = [...(year.entries || [])]
      year.entries[entryIndex] = newEventValue
      updatedTimeline[yearIndex] = year

      saveToLocalStorage(
        updatedTimeline,
        'The chronicles remember - a memory is etched in stone.'
      )
    },
    [form, inputRefs, saveToLocalStorage]
  )

  /**
   * Handles updating year completion status.
   *
   * @param yearIndex Year Index
   * @param completed Completion Status
   */
  const handleYearCompletionChange = useCallback(
    (yearIndex: number, completed: boolean) => {
      form.setValue(`timeline.${yearIndex}.completed`, completed)

      // Save to localStorage with the updated timeline
      const updatedTimeline = form.watch('timeline') || []
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
    [form, saveToLocalStorage]
  )

  /**
   * Edits an Event in the Timeline
   *
   * @param yearIndex Year Index
   * @param entryIndex Event Entry Index
   */
  const editEvent = useCallback(
    (yearIndex: number, entryIndex: number) => {
      // Update the form state
      const yearEntries = form.watch(`timeline.${yearIndex}.entries`) || []
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
    [setEditingEvents, form]
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

  // Use form state as source of truth for timeline data to ensure immediate updates
  const cachedTimeline = useMemo(() => form.watch('timeline') || [], [form])

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
              startTransition(() =>
                saveToLocalStorage(
                  [
                    ...(form.watch('timeline') || []),
                    { completed: false, entries: [] }
                  ],
                  'A new lantern year is added - the chronicles expand.'
                )
              )
            }}>
            <PlusCircleIcon className="h-4 w-4" /> Add Lantern Year
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
