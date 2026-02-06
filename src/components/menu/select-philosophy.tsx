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
import { Philosophy } from '@/lib/enums'
import { cn } from '@/lib/utils'
import { Check, ChevronsUpDown } from 'lucide-react'
import { KeyboardEvent, ReactElement, forwardRef, useState } from 'react'

/**
 * Select Philosophy Component Properties
 */
export interface SelectPhilosophyProps {
  /** Disabled State */
  disabled?: boolean
  /** OnChange Handler */
  onChange?: (value: string) => void
  /** OnKeyDown Handler */
  onKeyDown?: (e: KeyboardEvent) => void
  /** Options (defaults to all Philosophy enum values if not provided) */
  options?: string[]
  /** Value */
  value?: Philosophy | ''
}

/**
 * Select Philosophy Component
 *
 * @param props Component Properties
 * @returns Select Philosophy Component
 */
export const SelectPhilosophy = forwardRef<
  HTMLButtonElement,
  SelectPhilosophyProps
>(
  (
    { onChange, onKeyDown, value: propValue, options, disabled },
    ref
  ): ReactElement => {
    const [open, setOpen] = useState(false)

    /**
     * Handle Philosophy Selection
     *
     * @param currentValue Selected Philosophy Value
     */
    const handleSelect = (currentValue: string) => {
      setOpen(false)

      if (onChange) onChange(currentValue)
    }

    /**
     * Handle Key Down Event
     *
     * @param e Keyboard Event
     */
    const handleKeyDown = (e: KeyboardEvent) => {
      if (onKeyDown) onKeyDown(e)
    }

    const availableOptions = options ?? Object.values(Philosophy)

    const philosophyOptions = [
      { value: '', label: 'None' },
      ...availableOptions.map((p) => ({ value: p, label: p }))
    ]

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            ref={ref}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[200px] justify-between"
            disabled={disabled}
            onKeyDown={handleKeyDown}>
            {propValue
              ? philosophyOptions.find((p) => p.value === propValue)?.label
              : 'Select philosophy...'}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="p-0">
          <Command>
            <CommandInput placeholder="Search philosophy..." />
            <CommandList>
              <CommandEmpty>No philosophy found.</CommandEmpty>
              <CommandGroup>
                {philosophyOptions.map((p) => (
                  <CommandItem
                    key={p.value ?? 'none'}
                    value={p.value}
                    onSelect={handleSelect}>
                    <Check
                      className={cn(
                        'mr-1 h-4 w-4',
                        propValue === p.value ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                    {p.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    )
  }
)

SelectPhilosophy.displayName = 'SelectPhilosophy'
