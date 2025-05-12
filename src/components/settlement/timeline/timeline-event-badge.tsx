'use client'

import { Badge } from '@/components/ui/badge'
import { BookOpenIcon, SwordsIcon } from 'lucide-react'
import { memo, useCallback } from 'react'

export interface TimelineEventBadgeProps {
  /** Entry Text */
  entry: string
  /** Entry Index */
  entryIndex: number
  /** Entry Completion Status */
  isCompleted?: boolean
  /** Entry Edit Handler */
  onEdit: (yearIndex: number, entryIndex: number) => void
  /** Timeline Year Index */
  yearIndex: number
}

/**
 * Timeline Event Badge Component
 */
export const TimelineEventBadge = memo(
  ({
    entry,
    entryIndex,
    isCompleted,
    onEdit,
    yearIndex
  }: TimelineEventBadgeProps) => {
    /**
     * Handler for click event on the badge
     */
    const handleClick = useCallback(() => {
      if (!isCompleted) onEdit(yearIndex, entryIndex)
    }, [yearIndex, entryIndex, onEdit, isCompleted])

    return (
      <Badge
        key={entryIndex}
        className={`my-1 inline-flex items-center ${isCompleted ? 'opacity-70 cursor-default' : 'cursor-pointer'}`}
        onClick={handleClick}>
        {entry.toLowerCase().startsWith('nemesis') ||
        entry.toLowerCase().startsWith('special showdown') ? (
          <SwordsIcon className="h-4 w-4" />
        ) : (
          <BookOpenIcon className="h-4 w-4" />
        )}
        {entry}
      </Badge>
    )
  }
)

TimelineEventBadge.displayName = 'TimelineEventBadge'
