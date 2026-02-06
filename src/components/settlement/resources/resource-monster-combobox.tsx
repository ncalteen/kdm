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
import { cn } from '@/lib/utils'
import { Settlement } from '@/schemas/settlement'
import { Check, ChevronsUpDown } from 'lucide-react'
import { ReactElement, useMemo, useState } from 'react'

/**
 * Resource Monster Combobox Options
 */
interface MonsterOption {
  /** Monster Name */
  name: string
  /** Monster Node */
  node: MonsterNode
}

/**
 * Resource Monster Combobox Component Properties
 */
interface ResourceMonsterComboboxProps {
  /** Disabled State */
  disabled?: boolean
  /** OnChange Callback */
  onChange: (
    monsterName: string | undefined,
    monsterNode: MonsterNode | undefined
  ) => void
  /** Selected Monster Name */
  selectedMonsterName: string | undefined
  /** Selected Settlement */
  selectedSettlement: Settlement | null
}

/**
 * Resource Monster Combobox Component
 *
 * Allows selection of a monster from the unlocked quarries and nemeses in the
 * settlement. This is used when adding a MONSTER category resource to track
 * which monster the resource came from.
 *
 * @param props Resource Monster Combobox Component Properties
 * @returns Resource Monster Combobox Component
 */
export function ResourceMonsterCombobox({
  disabled,
  onChange,
  selectedMonsterName,
  selectedSettlement
}: ResourceMonsterComboboxProps): ReactElement {
  const [open, setOpen] = useState<boolean>(false)

  // Get available monsters from unlocked quarries and nemeses
  const availableMonsters: MonsterOption[] = useMemo(() => {
    if (!selectedSettlement) return []

    const monsters: MonsterOption[] = []

    // Add unlocked quarries
    for (const quarry of selectedSettlement.quarries ?? [])
      if (quarry.unlocked)
        monsters.push({
          name: quarry.name,
          node: quarry.node
        })

    // Add unlocked nemeses
    for (const nemesis of selectedSettlement.nemeses ?? [])
      if (nemesis.unlocked)
        monsters.push({
          name: nemesis.name,
          node: nemesis.node
        })

    // Sort alphabetically by name
    return monsters.sort((a, b) => a.name.localeCompare(b.name))
  }, [selectedSettlement])

  /**
   * Handle Monster Selection
   *
   * @param monsterName Monster Name
   */
  const handleSelect = (monsterName: string) => {
    if (!disabled) {
      const monster = availableMonsters.find((m) => m.name === monsterName)
      onChange(monster?.name, monster?.node)
      setOpen(false)
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between h-9"
          disabled={disabled || availableMonsters.length === 0}>
          {selectedMonsterName ?? 'Select monster...'}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search monsters..." disabled={disabled} />
          <CommandList>
            <CommandEmpty>No unlocked monsters found.</CommandEmpty>
            <CommandGroup>
              {availableMonsters.map((monster) => (
                <CommandItem
                  key={monster.name}
                  value={monster.name}
                  onSelect={() => handleSelect(monster.name)}
                  disabled={disabled}>
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      selectedMonsterName === monster.name
                        ? 'opacity-100'
                        : 'opacity-0'
                    )}
                  />
                  <div className="flex flex-col">
                    <span>{monster.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {monster.node}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
