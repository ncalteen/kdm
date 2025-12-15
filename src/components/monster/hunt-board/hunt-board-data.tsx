'use client'

import { Button } from '@/components/ui/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { HuntEventType } from '@/lib/enums'
import { ChevronDown } from 'lucide-react'
import { ReactElement, useState } from 'react'

/**
 * Hunt Board Data Properties
 */
export interface HuntBoardDataProps {
  /** Hunt board positions */
  huntBoard: Record<
    number,
    HuntEventType.BASIC | HuntEventType.MONSTER | undefined
  >
  /** Update hunt board callback */
  onHuntBoardChange: (
    board: Record<
      number,
      HuntEventType.BASIC | HuntEventType.MONSTER | undefined
    >
  ) => void
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
          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((pos) => {
              const isFixed = pos === 0 || pos === 6 || pos === 12
              const fixedLabel =
                pos === 0
                  ? 'Start'
                  : pos === 6
                    ? 'Overwhelming Darkness'
                    : 'Starvation'

              return (
                <div
                  key={pos}
                  className="flex items-center gap-2 p-2 border rounded">
                  <div className="w-16 font-semibold">Position {pos}</div>
                  <div className="flex-1">
                    {isFixed ? (
                      <Input value={fixedLabel} disabled className="bg-muted" />
                    ) : (
                      <Select
                        value={huntBoard[pos] || 'none'}
                        onValueChange={(value) => {
                          const newBoard = { ...huntBoard }
                          if (value === 'none') {
                            delete newBoard[pos]
                          } else {
                            newBoard[pos] = value as
                              | HuntEventType.BASIC
                              | HuntEventType.MONSTER
                          }
                          onHuntBoardChange(newBoard)
                        }}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select event type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          <SelectItem value={HuntEventType.BASIC}>
                            Basic
                          </SelectItem>
                          <SelectItem value={HuntEventType.MONSTER}>
                            Monster
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
