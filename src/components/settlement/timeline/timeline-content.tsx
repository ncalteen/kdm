'use client'

import { TimelineYearRow } from '@/components/settlement/timeline/timeline-year-row'
import { Settlement } from '@/schemas/settlement'
import { SettlementTimelineYear } from '@/schemas/settlement-timeline-year'
import { KeyboardEvent } from 'react'

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
  selectedSettlement: Settlement | null
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
 *
 * @param props Timeline Content Component Properties
 * @returns Timeline Content Component
 */
export const TimelineContent = ({
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
        {selectedSettlement?.timeline.map(
          (yearData: SettlementTimelineYear, index: number) => (
            <TimelineYearRow
              key={index}
              index={index}
              addEventToYear={addEventToYear}
              editEvent={editEvent}
              handleKeyDown={handleKeyDown}
              handleYearCompletionChange={handleYearCompletionChange}
              isEventBeingEdited={isEventBeingEdited}
              removeEventFromYear={removeEventFromYear}
              saveEvent={saveEvent}
              setInputRef={setInputRef}
              showStoryEventIcon={showStoryEventIcon}
              usesNormalNumbering={usesNormalNumbering}
              selectedSettlement={selectedSettlement}
            />
          )
        )}
      </div>
    </div>
  )
}
