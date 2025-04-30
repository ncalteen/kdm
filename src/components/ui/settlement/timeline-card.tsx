import { CampaignType } from '@/lib/enums'
import { SettlementSchema } from '@/schemas/settlement'
import {
  CheckIcon,
  HourglassIcon,
  PencilIcon,
  PlusCircleIcon,
  TrashIcon
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { Button } from '../button'
import { Card, CardContent, CardHeader, CardTitle } from '../card'
import { Checkbox } from '../checkbox'
import { FormControl, FormField, FormItem } from '../form'
import { Input } from '../input'

export function TimelineCard(
  form: UseFormReturn<z.infer<typeof SettlementSchema>>
) {
  const campaignType = form.watch('campaignType')
  const isSquiresCampaign = campaignType === CampaignType.SQUIRES_OF_THE_CITADEL

  const [timeline, setTimeline] = useState(
    form.getValues('timeline') ||
      Array.from({ length: isSquiresCampaign ? 5 : 40 }, () => ({
        completed: false,
        entries: []
      }))
  )

  // Track which inputs are disabled (saved)
  const [disabledInputs, setDisabledInputs] = useState<{
    [key: string]: boolean
  }>({})

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
    updatedTimeline[yearIndex].entries = [
      ...(updatedTimeline[yearIndex].entries || []),
      ''
    ]
    setTimeline(updatedTimeline)
    form.setValue(
      `timeline.${yearIndex}.entries`,
      updatedTimeline[yearIndex].entries
    )
  }

  const removeEventFromYear = (yearIndex: number, eventIndex: number) => {
    const updatedTimeline = [...timeline]
    const events = [...(updatedTimeline[yearIndex].entries || [])]
    events.splice(eventIndex, 1)
    updatedTimeline[yearIndex].entries = events
    setTimeline(updatedTimeline)
    form.setValue(`timeline.${yearIndex}.entries`, events)
  }

  const saveEvent = (yearIndex: number, entryIndex: number) => {
    const currentEvent = form.getValues(
      `timeline.${yearIndex}.entries.${entryIndex}`
    )
    if (!currentEvent || currentEvent.trim() === '') {
      toast.warning('Cannot save an empty event')
      return
    }

    // Mark this input as disabled (saved)
    const inputKey = `${yearIndex}-${entryIndex}`
    setDisabledInputs({
      ...disabledInputs,
      [inputKey]: true
    })

    toast.success('Event saved to timeline')
  }

  const editEvent = (yearIndex: number, entryIndex: number) => {
    // Mark this input as enabled (editable)
    const inputKey = `${yearIndex}-${entryIndex}`
    setDisabledInputs({
      ...disabledInputs,
      [inputKey]: false
    })

    toast.info('Editing event')
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
          <div className="grid grid-cols-[60px_auto] gap-4 px-2 py-1 font-medium text-sm">
            <div>Year</div>
            <div>Events</div>
          </div>

          {timeline.map((yearData, yearIndex) => (
            <div
              key={yearIndex}
              className="grid grid-cols-[60px_auto] gap-4 items-start border-t border-border py-1">
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
                  {yearIndex + 1}
                </span>
              </div>

              <div className="flex flex-col gap-2">
                {(yearData.entries || []).length === 0 ? (
                  <div className="text-sm text-gray-500 italic">No events</div>
                ) : (
                  (yearData.entries || []).map((entry, entryIndex) => {
                    const inputKey = `${yearIndex}-${entryIndex}`
                    const isDisabled = !!disabledInputs[inputKey]

                    return (
                      <div key={entryIndex} className="flex items-center">
                        <FormField
                          control={form.control}
                          name={`timeline.${yearIndex}.entries.${entryIndex}`}
                          render={({ field }) => (
                            <FormItem className="flex-1 m-0">
                              <FormControl>
                                <Input
                                  placeholder={`Year ${yearIndex + 1} event...`}
                                  {...field}
                                  value={field.value || ''}
                                  disabled={isDisabled}
                                  onChange={(e) => {
                                    form.setValue(
                                      `timeline.${yearIndex}.entries.${entryIndex}`,
                                      e.target.value
                                    )
                                  }}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        {isDisabled ? (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => editEvent(yearIndex, entryIndex)}
                            title="Edit event">
                            <PencilIcon className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => saveEvent(yearIndex, entryIndex)}
                            title="Save event">
                            <CheckIcon className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            removeEventFromYear(yearIndex, entryIndex)
                          }>
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    )
                  })
                )}

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-fit"
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
