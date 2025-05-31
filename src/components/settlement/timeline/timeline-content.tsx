'use client'

import { TimelineYearRow } from '@/components/settlement/timeline/timeline-year-row'
import { Settlement, TimelineYear } from '@/schemas/settlement'
import { KeyboardEvent, memo, useMemo } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { FixedSizeList as List } from 'react-window'

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
  /** Year Completion Change Handler */
  handleYearCompletionChange: (yearIndex: number, completed: boolean) => void
}

/**
 * Timeline Content Component
 */
export const TimelineContent = memo(
  ({
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
  }: TimelineContentProps) => {
    // Memoize item data to prevent unnecessary re-renders
    const itemData = useMemo(
      () => ({
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
      }),
      [
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
      ]
    )

    // Only use virtualization for timelines with more than 20 items
    if (timeline.length <= 20) {
      return (
        <div>
          <div
            className={`grid ${showStoryEventIcon ? 'grid-cols-[80px_40px_1fr_auto]' : 'grid-cols-[80px_1fr_auto]'} px-2 py-1 text-sm text-left`}>
            <div>Year</div>
            {showStoryEventIcon && <div />}
            <div>Events</div>
            <div />
          </div>
          <div className="flex flex-col">
            {timeline.map((_, yearIndex) => (
              <TimelineYearRow
                key={yearIndex}
                index={yearIndex}
                style={{}}
                data={itemData}
              />
            ))}
          </div>
        </div>
      )
    }

    return (
      <div>
        <div
          className={`grid ${showStoryEventIcon ? 'grid-cols-[80px_40px_1fr_auto]' : 'grid-cols-[80px_1fr_auto]'} px-2 py-1 text-sm text-left`}>
          <div>Year</div>
          {showStoryEventIcon && <div />}
          <div>Events</div>
          <div />
        </div>
        <List
          height={600}
          width="100%"
          itemCount={timeline.length}
          itemSize={80}
          itemData={itemData}
          overscanCount={5}>
          {TimelineYearRow}
        </List>
      </div>
    )
  }
)

TimelineContent.displayName = 'TimelineContent'
