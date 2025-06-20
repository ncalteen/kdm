'use client'

import { cn } from '@/lib/utils'
import { useDraggable } from '@dnd-kit/core'
import { SkullIcon } from 'lucide-react'
import { ReactElement } from 'react'

interface QuarryTokenProps {
  /** Token Overlap */
  overlap: boolean
}

/**
 * Quarry Token Component
 *
 * A draggable token representing the quarry.
 */
export function QuarryToken({ overlap }: QuarryTokenProps): ReactElement {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: 'quarry-token'
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
        'bg-red-500 text-white rounded-full cursor-grab active:cursor-grabbing',
        'shadow-md hover:shadow-lg transition-shadow z-1',
        overlap
          ? 'bottom-1 right-1 sm:bottom-1.5 sm:right-1.5 md:bottom-2 md:right-2' // Bottom-right when overlapping
          : 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2', // Centered when not overlapping
        isDragging && 'opacity-50 scale-110'
      )}
      title="Drag to move quarry on the hunt board">
      <SkullIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
    </div>
  )
}
