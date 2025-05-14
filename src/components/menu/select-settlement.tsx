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
import { cn, getCampaign } from '@/lib/utils'
import { Check, ChevronsUpDown } from 'lucide-react'
import { useEffect, useState } from 'react'

/**
 * Select Settlement Component Properties
 */
export interface SelectSettlementProps {
  /** Disabled State */
  disabled?: boolean
  /** OnChange Handler */
  onChange?: (value: string) => void
  /** Selected Value */
  value?: string
}

/**
 * Select Settlement Component
 *
 * @param props Component Properties
 */
export function SelectSettlement({
  disabled,
  onChange,
  value: propValue
}: SelectSettlementProps) {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState(propValue || '')
  const [settlementOptions, setSettlementOptions] = useState<
    Array<{ value: string; label: string }>
  >([])
  const [minWidth, setMinWidth] = useState<number>(200)

  // Get settlements from the campaign
  useEffect(() => {
    // Only run on the client side
    const campaign = getCampaign()
    const settlements = campaign?.settlements || []

    const options = settlements.map((settlement) => ({
      value: settlement.id.toString(),
      label: settlement.name
    }))

    // Calculate the width based on the longest settlement name
    if (options.length > 0) {
      // Create a temporary span to measure text width
      const span = document.createElement('span')
      span.style.visibility = 'hidden'
      span.style.position = 'absolute'
      span.style.fontFamily = 'var(--font-sans)'
      span.style.fontSize = '14px'
      document.body.appendChild(span)

      // Find the longest name
      let maxWidth = 0
      options.forEach((option) => {
        span.textContent = option.label
        const width = span.getBoundingClientRect().width
        maxWidth = Math.max(maxWidth, width)
      })

      // Add some padding for the button elements (icon, etc.)
      const minButtonWidth = Math.ceil(maxWidth) + 80
      setMinWidth(minButtonWidth)

      // Clean up
      document.body.removeChild(span)
    }

    setSettlementOptions(options)
  }, [])

  useEffect(() => {
    if (propValue !== undefined) setValue(propValue)
  }, [propValue])

  const handleSelect = (currentValue: string) => {
    setValue(currentValue)
    setOpen(false)

    if (onChange) onChange(currentValue)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between"
          style={{ minWidth: `${minWidth}px` }}
          disabled={disabled}>
          {value
            ? settlementOptions.find((s) => s.value === value)?.label ||
              'Select settlement...'
            : 'Select settlement...'}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0" style={{ width: `${minWidth}px` }}>
        <Command>
          <CommandInput placeholder="Search settlement..." />
          <CommandList>
            <CommandEmpty>No settlements found.</CommandEmpty>
            <CommandGroup>
              {settlementOptions.length > 0 ? (
                settlementOptions.map((s) => (
                  <CommandItem
                    key={s.value}
                    value={s.value}
                    onSelect={handleSelect}>
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        value === s.value ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                    {s.label}
                  </CommandItem>
                ))
              ) : (
                <CommandItem disabled>
                  No settlements available. Please create one first.
                </CommandItem>
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
