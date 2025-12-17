'use client'

import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { MonsterNode } from '@/lib/enums'
import { NEMESES, QUARRIES } from '@/lib/monsters'
import { cn } from '@/lib/utils'
import { Check, ChevronsUpDown, X } from 'lucide-react'
import { type ReactElement, useMemo, useState } from 'react'

/**
 * Select Monster Node Component Properties
 */
export interface SelectMonsterNodeProps {
  /** Component ID */
  id?: string
  /** Monster Node Type */
  nodeType: MonsterNode
  /** OnChange Callback */
  onChange?: (value: number[]) => void
  /** Selected Monster IDs */
  value?: number[]
  /** Whether the input is disabled */
  disabled?: boolean
}

/**
 * Select Monster Node Component
 *
 * This component allows the user to select one or more monsters for a specific
 * node type. It uses a popover to display the options and allows for searching
 * through them. Multiple monsters can be selected.
 *
 * @param props Component Properties
 * @returns Select Monster Node Component
 */
export function SelectMonsterNode({
  id,
  nodeType,
  onChange,
  value: propValue = [],
  disabled = false
}: SelectMonsterNodeProps): ReactElement {
  const [open, setOpen] = useState(false)

  const monsterOptions = useMemo(() => {
    const isQuarryNode = nodeType.startsWith('NQ')
    const monsterList = isQuarryNode ? QUARRIES : NEMESES
    const options: Array<{ id: number; name: string; node: MonsterNode }> = []

    Object.entries(monsterList).forEach(([id, monsterData]) => {
      const monster = monsterData.main
      if (monster.node === nodeType)
        options.push({
          id: parseInt(id),
          name: monster.name,
          node: monster.node
        })
    })

    return options.sort((a, b) => a.name.localeCompare(b.name))
  }, [nodeType])

  /**
   * Toggle a monster selection.
   *
   * @param monsterId Monster ID to toggle
   */
  const handleToggle = (monsterId: number) => {
    if (!onChange) return

    const newSelection = propValue.includes(monsterId)
      ? propValue.filter((id) => id !== monsterId)
      : [...propValue, monsterId]

    onChange(newSelection)
  }

  /**
   * Remove a monster from selection.
   *
   * @param monsterId Monster ID to remove
   */
  const handleRemove = (monsterId: number) => {
    if (!onChange) return

    const newSelection = propValue.filter((id) => id !== monsterId)
    onChange(newSelection)
  }

  /**
   * Get the selected monster names for display.
   */
  const selectedMonsters = useMemo(() => {
    return propValue
      .map((id) => monsterOptions.find((m) => m.id === id))
      .filter(
        (m): m is { id: number; name: string; node: MonsterNode } =>
          m !== undefined
      )
  }, [propValue, monsterOptions])

  return (
    <div className="flex flex-col gap-2 w-full">
      <Popover
        open={open}
        onOpenChange={(isOpen) => !disabled && setOpen(isOpen)}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            id={id}
            disabled={disabled}
            className="w-full justify-between h-auto min-h-[2.5rem] px-3">
            <span className="truncate">
              {propValue.length > 0
                ? `${propValue.length} selected`
                : 'Select...'}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-[250px] p-0">
          <Command>
            <CommandInput placeholder="Search monsters..." />
            <CommandList>
              <CommandEmpty>No monsters found for {nodeType}.</CommandEmpty>
              <CommandGroup>
                {monsterOptions.map((monster) => (
                  <CommandItem
                    key={monster.id}
                    value={monster.name}
                    onSelect={() => handleToggle(monster.id)}>
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        propValue.includes(monster.id)
                          ? 'opacity-100'
                          : 'opacity-0'
                      )}
                    />
                    {monster.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {selectedMonsters.length > 0 && (
        <div className="flex flex-col gap-1">
          {selectedMonsters.map((monster) => (
            <div
              key={monster.id}
              className="flex items-center gap-1 bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-xs">
              <span className="truncate flex-1">{monster.name}</span>
              {!disabled && (
                <button
                  type="button"
                  onClick={() => handleRemove(monster.id)}
                  className="hover:bg-secondary-foreground/20 rounded-sm p-0.5 shrink-0">
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
