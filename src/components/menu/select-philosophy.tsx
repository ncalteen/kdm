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
import {
  KeyboardEvent,
  ReactElement,
  forwardRef,
  useEffect,
  useState
} from 'react'

/**
 * Select Philosophy Component Properties
 */
export interface SelectPhilosophyProps {
  /** Auto Focus */
  autoFocus?: boolean
  /** Disabled State */
  disabled?: boolean
  /** OnChange Handler */
  onChange?: (value: string) => void
  /** OnKeyDown Handler */
  onKeyDown?: (e: KeyboardEvent) => void
  /** Options */
  options: string[]
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
    { autoFocus, onChange, onKeyDown, value: propValue, options, disabled },
    ref
  ): ReactElement => {
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState(propValue || '')

    useEffect(() => {
      console.debug('[SelectPhilosophy] Value Changed:', propValue)

      if (propValue !== undefined) setValue(propValue)
    }, [propValue])

    const handleSelect = (currentValue: string) => {
      setValue(currentValue)
      setOpen(false)

      if (onChange) onChange(currentValue)
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (onKeyDown) onKeyDown(e)
    }

    const philosophyOptions = [
      { value: '', label: 'None' },
      ...options.map((p) => ({ value: p, label: p }))
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
            autoFocus={autoFocus}
            onKeyDown={handleKeyDown}>
            {value
              ? philosophyOptions.find((p) => p.value === value)?.label
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
                    key={p.value || 'none'}
                    value={p.value}
                    onSelect={handleSelect}>
                    <Check
                      className={cn(
                        'mr-1 h-4 w-4',
                        value === p.value ? 'opacity-100' : 'opacity-0'
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
