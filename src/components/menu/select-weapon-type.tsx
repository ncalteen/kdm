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
import { WeaponType } from '@/lib/enums'
import { cn } from '@/lib/utils'
import { Check, ChevronsUpDown } from 'lucide-react'
import { ReactElement, useState } from 'react'

/**
 * Select Weapon Type Component Properties
 */
export interface SelectWeaponTypeProps {
  /** Disabled State */
  disabled?: boolean
  /** OnChange Handler */
  onChange?: (value: string) => void
  /** Value */
  value?: WeaponType
}

/**
 * Select Weapon Type Component
 *
 * @param props Component Properties
 * @returns Select Weapon Type Component
 */
export function SelectWeaponType({
  disabled,
  onChange,
  value
}: SelectWeaponTypeProps): ReactElement {
  const weaponTypeOptions = Object.values(WeaponType).sort((a, b) =>
    a.localeCompare(b)
  )

  const [open, setOpen] = useState(false)

  const handleTypeSelect = (type: string) => {
    if (onChange) onChange(type)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between text-sm min-w-[180px]"
          disabled={disabled}>
          {value || 'Select Type'}
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="p-0">
        <Command>
          <CommandInput placeholder="Search weapon type..." />
          <CommandList>
            <CommandEmpty>No weapon types found.</CommandEmpty>
            <CommandGroup>
              {weaponTypeOptions.map((type) => (
                <CommandItem
                  key={type}
                  value={type}
                  onSelect={() => handleTypeSelect(type)}>
                  <Check
                    className={cn(
                      'h-4 w-4',
                      value === type ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  {type}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
