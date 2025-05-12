'use client'

import { Badge } from '@/components/ui/badge'
import { BookOpenIcon, SwordsIcon } from 'lucide-react'
import { memo, useCallback } from 'react'

/**
 * Timeline Event Badge Component
 */
export const TimelineEventBadge = memo(
  ({
    entry,
    yearIndex,
    entryIndex,
    onEdit,
    isCompleted
  }: {
    entry: string
    yearIndex: number
    entryIndex: number
    onEdit: (yearIndex: number, entryIndex: number) => void
    isCompleted?: boolean
  }) => {
    const handleClick = useCallback(() => {
      if (!isCompleted) {
        onEdit(yearIndex, entryIndex)
      }
    }, [yearIndex, entryIndex, onEdit, isCompleted])

    return (
      <Badge
        key={entryIndex}
        className={`my-1 inline-flex items-center ${isCompleted ? 'opacity-70 cursor-default' : 'cursor-pointer'}`}
        onClick={handleClick}>
        {entry.startsWith('Nemesis') ? (
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
