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
import { MonsterNode, MonsterType } from '@/lib/enums'
import { NEMESES, QUARRIES } from '@/lib/monsters'
import { cn, getNemesisDataByName, getQuarryDataByName } from '@/lib/utils'
import { Campaign } from '@/schemas/campaign'
import { NemesisMonsterData } from '@/schemas/nemesis-monster-data'
import { QuarryMonsterData } from '@/schemas/quarry-monster-data'
import { Check, ChevronsUpDown, X } from 'lucide-react'
import { type ReactElement, useMemo, useState } from 'react'

/**
 * Select Monster Node Component Properties
 */
export interface SelectMonsterNodeProps {
  /** Campaign */
  campaign: Campaign
  /** Component ID */
  id?: string
  /** Monster Node Type */
  nodeType: MonsterNode
  /** OnChange Callback */
  onChange?: (value: (NemesisMonsterData | QuarryMonsterData)[]) => void
  /** Selected Monsters */
  value?: (QuarryMonsterData | NemesisMonsterData)[]
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
  campaign,
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
    const options: Array<{
      name: string
      node: MonsterNode
    }> = []

    // Add built-in monsters
    Object.values(monsterList).forEach((monster) => {
      if (monster.node === nodeType)
        options.push({
          name: monster.name,
          node: monster.node
        })
    })

    // Add custom monsters when not disabled (custom campaign)
    if (!disabled) {
      try {
        const customMonsters = {
          ...(campaign.customNemeses ?? {}),
          ...(campaign.customQuarries ?? {})
        }

        Object.values(customMonsters).forEach((monster) => {
          const isQuarry = monster.type === MonsterType.QUARRY

          // Only include if monster type matches node type and node matches
          if (isQuarry === isQuarryNode && monster.node === nodeType) {
            options.push({
              name: monster.name,
              node: monster.node
            })
          }
        })
      } catch (error) {
        // Silently fail if campaign data is not available
        console.error('Failed to Load Custom Monsters:', error)
      }
    }

    return options.sort((a, b) => a.name.localeCompare(b.name))
  }, [campaign.customNemeses, campaign.customQuarries, nodeType, disabled])

  /**
   * Toggle Monster Selection
   *
   * @param monsterName Monster Name to Toggle
   */
  const handleToggle = (monsterName: string) => {
    if (!onChange) return

    // Silently ignore if monster data is not found
    const monsterData =
      getNemesisDataByName(campaign, monsterName) ??
      getQuarryDataByName(campaign, monsterName)

    if (propValue.some((monster) => monster.name === monsterName))
      onChange(propValue.filter((monster) => monster.name !== monsterName))
    else if (monsterData) onChange([...propValue, monsterData])
  }

  /**
   * Remove Monster from Selection.
   *
   * @param monsterName Monster Name to Remove
   */
  const handleRemove = (monsterName: string) => {
    if (onChange)
      onChange(propValue.filter((monster) => monster.name !== monsterName))
  }

  const selectedMonsters = useMemo(() => {
    return propValue
      .map((monster) => monsterOptions.find((m) => m.name === monster.name))
      .filter((m) => m !== undefined)
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
                    key={monster.name}
                    value={monster.name}
                    onSelect={() => handleToggle(monster.name)}>
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        propValue.some((m) => m.name === monster.name)
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
              key={monster.name}
              className="flex items-center gap-1 bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-xs">
              <span className="truncate flex-1">{monster.name}</span>
              {!disabled && (
                <button
                  type="button"
                  onClick={() => handleRemove(monster.name)}
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
