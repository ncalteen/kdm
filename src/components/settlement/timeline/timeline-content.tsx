'use client'

import { TimelineYearRow } from '@/components/settlement/timeline/timeline-year-row'
import { Settlement } from '@/schemas/settlement'
import { KeyboardEvent, memo, useMemo } from 'react'

/**
 * Timeline Content Component Properties
 */
export interface TimelineContentProps {
  /** Add Event Handler */
  addEventToYear: (yearIndex: number) => void
  /** Edit Event Handler */
  editEvent: (yearIndex: number, entryIndex: number) => void
  /** Key Press Handler */
  handleKeyDown: (
    e: KeyboardEvent<HTMLInputElement>,
    yearIndex: number,
    entryIndex: number
  ) => void
  /** Year Completion Change Handler */
  handleYearCompletionChange: (yearIndex: number, completed: boolean) => void
  /** Event Edit Status */
  isEventBeingEdited: (yearIndex: number, entryIndex: number) => boolean
  /** Remove Event Handler */
  removeEventFromYear: (yearIndex: number, eventIndex: number) => void
  /** Save Event Handler */
  saveEvent: (yearIndex: number, entryIndex: number) => void
  /** Selected Settlement */
  selectedSettlement: Partial<Settlement> | null
  /** Set Input Reference Function */
  setInputRef: (
    element: HTMLInputElement | null,
    yearIndex: number,
    entryIndex: number
  ) => void
  /** Show Story Event Icon */
  showStoryEventIcon: boolean
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
    handleYearCompletionChange,
    isEventBeingEdited,
    removeEventFromYear,
    saveEvent,
    selectedSettlement,
    setInputRef,
    showStoryEventIcon,
    usesNormalNumbering
  }: TimelineContentProps) => {
    // Memoize item data to prevent unnecessary re-renders
    const itemData = useMemo(
      () => ({
        addEventToYear,
        editEvent,
        handleKeyDown,
        handleYearCompletionChange,
        isEventBeingEdited,
        removeEventFromYear,
        saveEvent,
        selectedSettlement,
        setInputRef,
        showStoryEventIcon,
        usesNormalNumbering
      }),
      [
        addEventToYear,
        editEvent,
        handleKeyDown,
        handleYearCompletionChange,
        isEventBeingEdited,
        removeEventFromYear,
        saveEvent,
        selectedSettlement,
        setInputRef,
        showStoryEventIcon,
        usesNormalNumbering
      ]
    )

    return (
      <div className="flex flex-col h-full">
        <div
          className={`grid ${showStoryEventIcon ? 'grid-cols-[60px_30px_1fr_auto]' : 'grid-cols-[60px_1fr_auto]'} px-2 py-0.5 text-sm text-left border-b`}>
          <div>Year</div>
          {showStoryEventIcon && <div />}
          <div>Events</div>
          <div />
        </div>
        <div className="flex-1 overflow-y-auto">
          {selectedSettlement?.timeline?.map((yearData, index) => (
            <TimelineYearRow
              key={index}
              index={index}
              style={{}}
              data={itemData}
            />
          ))}
        </div>
      </div>
    )
  }
)

TimelineContent.displayName = 'TimelineContent'
