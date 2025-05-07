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
    onEdit
  }: {
    entry: string
    yearIndex: number
    entryIndex: number
    onEdit: (yearIndex: number, entryIndex: number) => void
  }) => {
    const handleClick = useCallback(() => {
      onEdit(yearIndex, entryIndex)
    }, [yearIndex, entryIndex, onEdit])

    return (
      <Badge
        key={entryIndex}
        className="cursor-pointer my-1 inline-flex items-center"
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
