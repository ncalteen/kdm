'use client'

import { cn } from '@/lib/utils'
import { useDraggable } from '@dnd-kit/core'
import { Skull } from 'lucide-react'
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
        `absolute top-1/2 left-1/2 -translate-x-${overlap ? '1/4' : '1/2'} -translate-y-${overlap ? '1/4' : '1/2'} z-10 flex items-center justify-center w-12 h-12`,
        'bg-red-500 text-white rounded-full cursor-grab active:cursor-grabbing',
        'shadow-md hover:shadow-lg transition-shadow',
        isDragging && 'opacity-50 scale-110'
      )}
      title="Drag to move quarry on the hunt board">
      <Skull className="w-4 h-4" />
    </div>
  )
}
