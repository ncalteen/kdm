import { CampaignType } from '@/lib/enums'
import { SettlementSchema } from '@/schemas/settlement'
import {
  CheckIcon,
  HourglassIcon,
  PlusCircleIcon,
  TrashIcon
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { Badge } from '../badge'
import { Button } from '../button'
import { Card, CardContent, CardHeader, CardTitle } from '../card'
import { Checkbox } from '../checkbox'
import { FormControl, FormField, FormItem } from '../form'
import { Input } from '../input'

export function TimelineCard(
  form: UseFormReturn<z.infer<typeof SettlementSchema>>
) {
  const campaignType = form.watch('campaignType')
  const formTimeline = form.watch('timeline')
  const isSquiresCampaign = campaignType === CampaignType.SQUIRES_OF_THE_CITADEL
  const isStarsCampaign = campaignType === CampaignType.PEOPLE_OF_THE_STARS
  const isSunCampaign = campaignType === CampaignType.PEOPLE_OF_THE_SUN

  // Check if the campaign uses normal numbering (no prologue)
  const usesNormalNumbering =
    isSquiresCampaign || isStarsCampaign || isSunCampaign

  const [timeline, setTimeline] = useState(formTimeline || [])

  // Track which inputs are being edited
  const [editingEvents, setEditingEvents] = useState<{
    [key: string]: boolean
  }>({})

  // Update timeline when form timeline changes
  useEffect(() => {
    if (formTimeline) {
      setTimeline(formTimeline)

      // When timeline is first loaded or changed, all events should be in non-editing mode (badges)
      const newEditingEvents: { [key: string]: boolean } = {}
      setEditingEvents(newEditingEvents)
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

  const addTimelineEvent = () => {
    setTimeline([...timeline, { completed: false, entries: [] }])
  }

  const addEventToYear = (yearIndex: number) => {
    const updatedTimeline = [...timeline]
    const newEntryIndex = updatedTimeline[yearIndex].entries
      ? updatedTimeline[yearIndex].entries.length
      : 0

    updatedTimeline[yearIndex].entries = [
      ...(updatedTimeline[yearIndex].entries || []),
      ''
    ]

    setTimeline(updatedTimeline)
    form.setValue(
      `timeline.${yearIndex}.entries`,
      updatedTimeline[yearIndex].entries
    )

    // Set this new event as being edited
    const inputKey = `${yearIndex}-${newEntryIndex}`
    setEditingEvents({
      ...editingEvents,
      [inputKey]: true
    })
  }

  const removeEventFromYear = (yearIndex: number, eventIndex: number) => {
    const updatedTimeline = [...timeline]
    const events = [...(updatedTimeline[yearIndex].entries || [])]
    events.splice(eventIndex, 1)
    updatedTimeline[yearIndex].entries = events
    setTimeline(updatedTimeline)
    form.setValue(`timeline.${yearIndex}.entries`, events)

    // Remove from editing events
    const inputKey = `${yearIndex}-${eventIndex}`
    const newEditingEvents = { ...editingEvents }
    delete newEditingEvents[inputKey]
    setEditingEvents(newEditingEvents)
  }

  const saveEvent = (yearIndex: number, entryIndex: number) => {
    const currentEvent = form.getValues(
      `timeline.${yearIndex}.entries.${entryIndex}`
    )
    if (!currentEvent || currentEvent.trim() === '') {
      toast.warning('Cannot save an empty event')
      return
    }

    // Mark this input as no longer being edited (converted to badge)
    const inputKey = `${yearIndex}-${entryIndex}`
    const newEditingEvents = { ...editingEvents }
    delete newEditingEvents[inputKey]
    setEditingEvents(newEditingEvents)

    toast.success('Event saved to timeline')
  }

  const editEvent = (yearIndex: number, entryIndex: number) => {
    // Mark this event as being edited
    const inputKey = `${yearIndex}-${entryIndex}`
    setEditingEvents({
      ...editingEvents,
      [inputKey]: true
    })

    toast.info('Editing event')
  }

  const isEventBeingEdited = (yearIndex: number, entryIndex: number) => {
    const inputKey = `${yearIndex}-${entryIndex}`
    return !!editingEvents[inputKey]
  }

  return (
    <Card className="mt-2">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-1">
          <HourglassIcon className="h-5 w-5" /> Timeline
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 pb-2">
        <div className="space-y-2">
          <div className="grid grid-cols-[80px_1fr_auto] gap-4 px-2 py-1 font-medium text-sm">
            <div>Year</div>
            <div>Events</div>
            <div></div>
          </div>

          {timeline.map((yearData, yearIndex) => (
            <div
              key={yearIndex}
              className="grid grid-cols-[80px_1fr_auto] gap-4 items-start border-t border-border py-1">
              <div className="flex items-center">
                <FormField
                  control={form.control}
                  name={`timeline.${yearIndex}.completed`}
                  render={({ field }) => (
                    <FormItem className="flex items-center m-0">
                      <FormControl>
                        <Checkbox
                          className="mt-2"
                          checked={field.value}
                          onCheckedChange={(checked) => {
                            form.setValue(
                              `timeline.${yearIndex}.completed`,
                              !!checked
                            )
                          }}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <span className="text-sm font-medium ml-2 inline-flex items-center">
                  {yearIndex === 0 && !usesNormalNumbering
                    ? 'Prologue'
                    : usesNormalNumbering
                      ? yearIndex + 1
                      : yearIndex}
                </span>
              </div>

              <div className="flex flex-col gap-2 pt-1 pl-20">
                {/* Display event badges for saved events */}
                {(yearData.entries || []).length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-2">
                    {(yearData.entries || []).map((entry, entryIndex) => {
                      // Only show as badge if not being edited and has content
                      if (
                        !isEventBeingEdited(yearIndex, entryIndex) &&
                        entry &&
                        entry.trim() !== ''
                      ) {
                        return (
                          <Badge
                            key={entryIndex}
                            className="cursor-pointer"
                            onClick={() => editEvent(yearIndex, entryIndex)}>
                            {entry}
                          </Badge>
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
                          render={({ field }) => (
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
                                  {...field}
                                  value={field.value || ''}
                                  onChange={(e) => {
                                    form.setValue(
                                      `timeline.${yearIndex}.entries.${entryIndex}`,
                                      e.target.value
                                    )
                                  }}
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
                  onClick={() => addEventToYear(yearIndex)}>
                  <PlusCircleIcon className="h-4 w-4 mr-2" /> Add Event
                </Button>
              </div>
            </div>
          ))}

          <Button type="button" onClick={addTimelineEvent} className="mt-2">
            Add Lantern Year
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
