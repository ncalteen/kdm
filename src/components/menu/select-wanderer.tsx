'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Wanderer } from '@/schemas/wanderer'
import { type ReactElement } from 'react'

/**
 * Select Wanderer Component Properties
 */
export interface SelectWandererProps {
  /** Component ID */
  id?: string
  /** OnChange Callback */
  onChange?: (wanderer: Wanderer | null) => void
  /** Available Wanderers */
  wanderers: Wanderer[]
  /** Selected Wanderer Name */
  value?: string
}

/**
 * Select Wanderer Component
 *
 * This component allows the user to select a single wanderer from the
 * settlement's available wanderers to use as a template for creating a new
 * survivor.
 *
 * @param props Component Properties
 * @returns Select Wanderer Component
 */
export function SelectWanderer({
  id,
  onChange,
  wanderers,
  value
}: SelectWandererProps): ReactElement {
  /**
   * Handle Value Change
   *
   * @param selectedName Selected Wanderer Name
   */
  const handleValueChange = (selectedName: string) => {
    if (!onChange) return

    onChange(wanderers.find((w) => w.name === selectedName) ?? null)
  }

  return (
    <Select value={value} onValueChange={handleValueChange}>
      <SelectTrigger id={id} className="flex-1">
        <SelectValue placeholder="Select wanderer" />
      </SelectTrigger>
      <SelectContent>
        {wanderers.map((wanderer) => (
          <SelectItem key={wanderer.name} value={wanderer.name}>
            {wanderer.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
