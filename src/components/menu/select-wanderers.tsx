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
import { cn } from '@/lib/utils'
import { WANDERERS } from '@/lib/wanderers'
import { Wanderer } from '@/schemas/wanderer'
import { Check, ChevronsUpDown, X } from 'lucide-react'
import { type ReactElement, useMemo, useState } from 'react'

/**
 * Select Wanderers Component Properties
 */
export interface SelectWanderersProps {
  /** Component ID */
  id?: string
  /** OnChange Callback */
  onChange?: (value: Wanderer[]) => void
  /** Selected Wanderers */
  value?: Wanderer[]
}

/**
 * Select Wanderers Component
 *
 * This component allows the user to select zero or more wanderers to add to
 * their settlement. It uses a popover to display the options and allows for
 * searching through them.
 *
 * @param props Component Properties
 * @returns Select Wanderers Component
 */
export function SelectWanderers({
  id,
  onChange,
  value: propValue = []
}: SelectWanderersProps): ReactElement {
  const [open, setOpen] = useState(false)

  const wandererOptions = useMemo(() => {
    return Object.values(WANDERERS).sort((a, b) => a.name.localeCompare(b.name))
  }, [])

  /**
   * Toggle Wanderer Selection
   *
   * @param wandererName Wanderer Name to Toggle
   */
  const handleToggle = (wandererName: string) => {
    if (!onChange) return

    const wanderer = wandererOptions.find((w) => w.name === wandererName)
    if (!wanderer) return

    if (propValue.some((w) => w.name === wandererName))
      onChange(propValue.filter((w) => w.name !== wandererName))
    else onChange([...propValue, wanderer])
  }

  /**
   * Remove Wanderer Selection
   *
   * @param wandererName Wanderer Name to Remove
   */
  const handleRemove = (wandererName: string) => {
    if (onChange)
      onChange(propValue.filter((wanderer) => wanderer.name !== wandererName))
  }

  const selectedWanderers = useMemo(
    () =>
      propValue
        .map((wanderer) =>
          wandererOptions.find((w) => w.name === wanderer.name)
        )
        .filter((w) => w !== undefined),
    [propValue, wandererOptions]
  )

  return (
    <div className="flex flex-col gap-2 w-full max-w-[250px]">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            id={id}
            className="w-full justify-between h-auto min-h-[2.5rem] px-3">
            <span className="truncate">
              {propValue.length > 0
                ? `${propValue.length} selected`
                : 'Select...'}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-[250px] p-0">
          <Command>
            <CommandInput placeholder="Search wanderers..." />
            <CommandList>
              <CommandEmpty>No wanderers found.</CommandEmpty>
              <CommandGroup>
                {wandererOptions.map((wanderer) => (
                  <CommandItem
                    key={wanderer.name}
                    value={wanderer.name}
                    onSelect={() => handleToggle(wanderer.name)}>
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        propValue.some((w) => w.name === wanderer.name)
                          ? 'opacity-100'
                          : 'opacity-0'
                      )}
                    />
                    {wanderer.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {selectedWanderers.length > 0 && (
        <div className="flex flex-col gap-1">
          {selectedWanderers.map((wanderer) => (
            <div
              key={wanderer.name}
              className="flex items-center gap-1 bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-xs">
              <span className="truncate flex-1">{wanderer.name}</span>
              <button
                type="button"
                onClick={() => handleRemove(wanderer.name)}
                className="hover:bg-secondary-foreground/20 rounded-sm p-0.5 shrink-0">
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
