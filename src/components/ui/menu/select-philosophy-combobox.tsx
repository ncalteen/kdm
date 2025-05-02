'use client'

import { Check, ChevronsUpDown } from 'lucide-react'
import * as React from 'react'

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
import { cn } from '@/lib/utils'

interface SelectPhilosophyComboboxProps {
  onChange?: (value: string) => void
  value?: string
  options: string[]
  disabled?: boolean
}

export function SelectPhilosophyCombobox({
  onChange,
  value: propValue,
  options,
  disabled
}: SelectPhilosophyComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState(propValue || '')

  React.useEffect(() => {
    if (propValue !== undefined) {
      setValue(propValue)
    }
  }, [propValue])

  const handleSelect = (currentValue: string) => {
    setValue(currentValue)
    setOpen(false)
    if (onChange) {
      onChange(currentValue)
    }
  }

  const philosophyOptions = [
    { value: '', label: 'None' },
    ...options.map((p) => ({ value: p, label: p }))
  ]

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
          disabled={disabled}>
          {value
            ? philosophyOptions.find((p) => p.value === value)?.label
            : 'Select philosophy...'}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
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
                      'mr-2 h-4 w-4',
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
