'use client'

import { Badge } from '@/components/ui/badge'
import { BookOpenIcon, SwordsIcon } from 'lucide-react'
import { memo, useCallback } from 'react'

/**
 * Timeline Event Badge Component Properties
 */
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
 *
 * @param props Timeline Event Badge Component Properties
 * @returns Timeline Event Badge Component
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
     * Handles click events on the badge for editing
     */
    const handleClick = useCallback(() => {
      if (!isCompleted) onEdit(yearIndex, entryIndex)
    }, [yearIndex, entryIndex, onEdit, isCompleted])

    return (
      <Badge
        key={entryIndex}
        className={`my-1 inline-flex items-center gap-1 ${
          isCompleted
            ? 'opacity-70 cursor-default'
            : 'cursor-pointer hover:bg-accent'
        }`}
        onClick={handleClick}>
        {entry.toLowerCase().startsWith('nemesis') ||
        entry.toLowerCase().startsWith('special showdown') ? (
          <SwordsIcon className="h-3 w-3" />
        ) : (
          <BookOpenIcon className="h-3 w-3" />
        )}
        <span>{entry}</span>
      </Badge>
    )
  }
)

TimelineEventBadge.displayName = 'TimelineEventBadge'
