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
import { ReactElement, useEffect, useState } from 'react'

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
 * @returns Select Settlement Component
 */
export function SelectSettlement({
  disabled,
  onChange,
  value: propValue
}: SelectSettlementProps): ReactElement {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState(propValue || '')
  const [settlementOptions, setSettlementOptions] = useState<
    Array<{ value: string; label: string }>
  >([])

  // Get settlements from the campaign
  useEffect(() => {
    console.debug('[SelectSettlement] Fetching Settlements')

    const campaign = getCampaign()
    const settlements = campaign.settlements || []

    const options = settlements.map((settlement) => ({
      value: settlement.id.toString(),
      label: settlement.name
    }))

    setSettlementOptions(options)
  }, [])

  useEffect(() => {
    console.debug('[SelectSettlement] Value Changed:', propValue)
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
          className="w-[75%] justify-between"
          disabled={disabled}>
          {value
            ? settlementOptions.find((s) => s.value === value)?.label ||
              'Select settlement...'
            : 'Select settlement...'}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-0">
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
