'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible'
import { Label } from '@/components/ui/label'
import { HuntEventType } from '@/lib/enums'
import { cn } from '@/lib/utils'
import { HuntBoard } from '@/schemas/hunt-board'
import { ChevronDown } from 'lucide-react'
import { ReactElement, useState } from 'react'

/**
 * Hunt Board Data Properties
 */
export interface HuntBoardDataProps {
  /** Hunt board positions */
  huntBoard: HuntBoard
  /** Update hunt board callback */
  onHuntBoardChange: (board: HuntBoard) => void
}

/**
 * Hunt Board Data Component
 *
 * Manages hunt board layout for quarry monsters.
 *
 * @param props Hunt Board Data Properties
 * @returns Hunt Board Data Component
 */
export function HuntBoardData({
  huntBoard,
  onHuntBoardChange
}: HuntBoardDataProps): ReactElement {
  const [isOpen, setIsOpen] = useState(false)

  // Define hunt board spaces
  const spaces = [
    { index: 0, label: 'Start', isStart: true },
    { index: 1 },
    { index: 2 },
    { index: 3 },
    { index: 4 },
    { index: 5 },
    { index: 6, label: 'Overwhelming Darkness', isOverwhelming: true },
    { index: 7 },
    { index: 8 },
    { index: 9 },
    { index: 10 },
    { index: 11 },
    { index: 12, label: 'Starvation', isStarvation: true }
  ]

  /**
   * Handle Space Click
   *
   * Cycles through event types.
   *
   * @param pos Space Position
   */
  const handleSpaceClick = (pos: number) => {
    // Skip fixed positions
    if (pos === 0 || pos === 6 || pos === 12) return

    const newBoard = { ...huntBoard }
    const current = huntBoard[pos as keyof HuntBoard]

    // Cycle: none -> basic -> monster -> none
    if (!current)
      newBoard[pos as 1 | 2 | 3 | 4 | 5 | 7 | 8 | 9 | 10 | 11] =
        HuntEventType.BASIC
    else if (current === HuntEventType.BASIC)
      newBoard[pos as 1 | 2 | 3 | 4 | 5 | 7 | 8 | 9 | 10 | 11] =
        HuntEventType.MONSTER
    else delete newBoard[pos as keyof HuntBoard]

    onHuntBoardChange(newBoard)
  }

  /**
   * Get Space Styling
   *
   * @param space Hunt Board Space
   */
  const getSpaceClass = (space: (typeof spaces)[0]) => {
    const { index, isStart, isOverwhelming, isStarvation } = space
    const eventType = huntBoard[index as keyof HuntBoard]

    return cn(
      'relative flex flex-col items-center justify-center w-full h-full border-2 rounded-lg transition-colors cursor-pointer',
      'border-border bg-card hover:bg-accent/50',
      isStart && 'border-green-500 bg-green-500/10 cursor-not-allowed',
      isOverwhelming && 'border-amber-500 bg-amber-500/10 cursor-not-allowed',
      isStarvation && 'border-red-500 bg-red-500/10 cursor-not-allowed',
      !isStart &&
        !isOverwhelming &&
        !isStarvation &&
        eventType === HuntEventType.BASIC &&
        'border-blue-500 bg-blue-500/10',
      !isStart &&
        !isOverwhelming &&
        !isStarvation &&
        eventType === HuntEventType.MONSTER &&
        'border-purple-500 bg-purple-500/10'
    )
  }

  /**
   * Get Display Label for Space
   *
   * @param space Hunt Board Space
   */
  const getSpaceLabel = (space: (typeof spaces)[0]) => {
    const { index, label } = space
    const eventType = huntBoard[index as keyof HuntBoard]

    if (label) return label

    if (eventType === HuntEventType.BASIC) return 'Basic'
    if (eventType === HuntEventType.MONSTER) return 'Monster'

    return index
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Button variant="outline" className="w-full justify-between">
          <span>Hunt Board Layout</span>
          <ChevronDown
            className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-4 mt-4">
        <div className="space-y-2">
          <Label>Hunt Board Positions</Label>
          <p className="text-sm text-muted-foreground">
            Click a space to cycle through event types: None → Basic → Monster
          </p>

          <Card className="p-0 w-full">
            <CardContent className="p-0 w-full overflow-x-auto">
              {/* Hunt Board Grid */}
              <div className="w-full overflow-x-auto gap-1 p-2 bg-muted/30 rounded-lg relative flex flex-row flex-wrap items-center justify-center">
                {spaces.map((space) => (
                  <div
                    key={space.index}
                    className="relative w-[75px] sm:w-[85px] md:w-[90px] h-[75px] sm:h-[85px] md:h-[90px] flex-shrink-0 flex items-center justify-center">
                    <div
                      onClick={() => handleSpaceClick(space.index)}
                      className={getSpaceClass(space)}>
                      <div className="text-[10px] sm:text-xs font-medium text-center break-words px-1 sm:px-2 leading-tight">
                        {getSpaceLabel(space)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
