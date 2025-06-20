'use client'

import { cn } from '@/lib/utils'
import { useDraggable } from '@dnd-kit/core'
import { UsersIcon } from 'lucide-react'
import { ReactElement } from 'react'

interface SurvivorTokenProps {
  /** Token Overlap */
  overlap: boolean
}

/**
 * Survivor Token Component
 *
 * A draggable token representing the survivor party.
 */
export function SurvivorToken({ overlap }: SurvivorTokenProps): ReactElement {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: 'survivor-token'
    })

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`
      }
    : undefined

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={cn(
        'absolute z-10 flex items-center justify-center',
        'w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12',
        'bg-blue-500 text-white rounded-full cursor-grab active:cursor-grabbing',
        'shadow-md hover:shadow-lg transition-shadow',
        overlap
          ? 'top-1 left-1 sm:top-1.5 sm:left-1.5 md:top-2 md:left-2' // Top-left when overlapping
          : 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2', // Centered when not overlapping
        isDragging && 'opacity-50 scale-110'
      )}
      title="Drag to move survivors on the hunt board">
      <UsersIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
    </div>
  )
}
