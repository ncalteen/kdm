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
import { CampaignType } from '@/lib/enums'
import { cn } from '@/lib/utils'

// Create campaign options from the CampaignType enum
const campaignOptions = Object.values(CampaignType).map((campaign) => ({
  value: campaign,
  label: campaign
}))

interface SelectCampaignProps {
  onChange?: (value: CampaignType) => void
  value?: CampaignType
}

export function SelectCampaign({
  onChange,
  value: propValue
}: SelectCampaignProps) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState(propValue || '')

  React.useEffect(() => {
    if (propValue) {
      setValue(propValue)
    }
  }, [propValue])

  const handleSelect = (currentValue: string) => {
    // Do not allow clearing the selection
    if (!currentValue) return
    if (currentValue === value) {
      setOpen(false)
      return
    }
    setValue(currentValue)
    setOpen(false)

    if (onChange && currentValue) {
      onChange(currentValue as CampaignType)
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[300px] justify-between">
          {value
            ? campaignOptions.find((campaign) => campaign.value === value)
                ?.label
            : 'Campaign type...'}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-0">
        <Command>
          <CommandInput placeholder="Search campaign..." />
          <CommandList>
            <CommandEmpty>No campaign found.</CommandEmpty>
            <CommandGroup>
              {campaignOptions.map((campaign) => (
                <CommandItem
                  key={campaign.value}
                  value={campaign.value}
                  onSelect={handleSelect}>
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      value === campaign.value ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  {campaign.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
