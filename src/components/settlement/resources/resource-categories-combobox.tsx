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
import { ResourceCategory } from '@/lib/enums'
import { cn } from '@/lib/utils'
import { Check, ChevronsUpDown } from 'lucide-react'
import { ReactElement, useState } from 'react'

/**
 * Resource Categories Combobox Component Properties
 */
interface ResourceCategoriesComboboxProps {
  /** Disabled State */
  disabled?: boolean
  /** OnChange Callback */
  onChange: (category: ResourceCategory) => void
  /** Selected Category */
  selectedCategory: ResourceCategory
}

/**
 * Resource Categories Combobox Component
 */
export function ResourceCategoriesCombobox({
  disabled,
  onChange,
  selectedCategory
}: ResourceCategoriesComboboxProps): ReactElement {
  const [open, setOpen] = useState<boolean>(false)

  /**
   * Handles the selection of a category.
   *
   * @param category Category
   */
  const handleSelect = (category: ResourceCategory) => {
    if (!disabled) {
      onChange(category)
      setOpen(false)
    }
  }

  // Create category options from the ResourceCategory enum
  const categoryOptions = Object.values(ResourceCategory).map((category) => ({
    value: category,
    label: category
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
          {selectedCategory ?? 'Select category...'}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput
            placeholder="Search categories..."
            disabled={disabled}
          />
          <CommandList>
            <CommandEmpty>No category found.</CommandEmpty>
            <CommandGroup>
              {categoryOptions.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={() => handleSelect(option.value)}
                  disabled={disabled}>
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      selectedCategory === option.value
                        ? 'opacity-100'
                        : 'opacity-0'
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
