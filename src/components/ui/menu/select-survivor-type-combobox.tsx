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
import { SurvivorType } from '@/lib/enums'
import { cn } from '@/lib/utils'

// Create survivor type options from the SurvivorType enum
const survivorTypeOptions = Object.values(SurvivorType).map((survivorType) => ({
  value: survivorType,
  label: survivorType
}))

interface SelectSurvivorTypeComboboxProps {
  onChange?: (value: SurvivorType) => void
  value?: SurvivorType
  disabled?: boolean
}

export function SelectSurvivorTypeCombobox({
  onChange,
  value: propValue,
  disabled = false
}: SelectSurvivorTypeComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState(propValue || '')

  React.useEffect(() => {
    if (propValue) {
      setValue(propValue)
    }
  }, [propValue])

  const handleSelect = (currentValue: string) => {
    // Don't allow changes if disabled
    if (disabled) return
    // Do not allow clearing the selection
    if (!currentValue) return
    if (currentValue === value) {
      setOpen(false)
      return
    }
    setValue(currentValue)
    setOpen(false)

    if (onChange && currentValue) {
      onChange(currentValue as SurvivorType)
    }
  }

  return (
    <Popover
      open={open && !disabled}
      onOpenChange={(isOpen) => !disabled && setOpen(isOpen)}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn('w-[200px] justify-between', disabled && 'opacity-70')}>
          {value
            ? survivorTypeOptions.find((option) => option.value === value)
                ?.label
            : 'Survivor type...'}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search survivor type..." />
          <CommandList>
            <CommandEmpty>No survivor type found.</CommandEmpty>
            <CommandGroup>
              {survivorTypeOptions.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={handleSelect}>
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      value === option.value ? 'opacity-100' : 'opacity-0'
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
