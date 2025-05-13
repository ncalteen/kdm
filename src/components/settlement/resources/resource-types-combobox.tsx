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
import { ResourceType } from '@/lib/enums'
import { cn } from '@/lib/utils'
import { Check, ChevronsUpDown } from 'lucide-react'
import { useState } from 'react'

/**
 * Resource Types Combobox Component Properties
 */
export interface ResourceTypesComboboxProps {
  /** Disabled State */
  disabled?: boolean
  /** OnChange Callback */
  onChange: (types: ResourceType[]) => void
  /** Selected Types */
  selectedTypes: ResourceType[]
}

/**
 * Resource Types Combobox Component
 */
export function ResourceTypesCombobox({
  disabled,
  onChange,
  selectedTypes
}: ResourceTypesComboboxProps) {
  const [open, setOpen] = useState(false)

  /**
   * Handles the selection of a resource type.
   *
   * @param type Resource Type
   */
  const handleSelect = (type: ResourceType) => {
    if (disabled) return

    // Toggle selection
    const newSelection = selectedTypes.includes(type)
      ? selectedTypes.filter((t) => t !== type)
      : [...selectedTypes, type]

    // Ensure at least one type is selected
    if (newSelection.length === 0) onChange([ResourceType.BONE])
    else onChange(newSelection)
  }

  // Create type options from the ResourceType enum
  const typeOptions = Object.values(ResourceType).map((type) => ({
    value: type,
    label: type
  }))

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between h-9"
          disabled={disabled}>
          {selectedTypes.length > 0
            ? `${selectedTypes.length} selected`
            : 'Select types...'}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search types..." disabled={disabled} />
          <CommandList>
            <CommandEmpty>No type found.</CommandEmpty>
            <CommandGroup>
              {typeOptions.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={() => handleSelect(option.value)}
                  disabled={disabled}>
                  <div className="flex items-center">
                    <div
                      className={cn(
                        'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                        selectedTypes.includes(option.value)
                          ? 'bg-primary text-primary-foreground'
                          : 'opacity-50'
                      )}>
                      {selectedTypes.includes(option.value) && (
                        <Check className="h-3 w-3" />
                      )}
                    </div>
                    {option.label}
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
