'use client'

import { NumericInput } from '@/components/menu/numeric-input'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import {
  SURVIVOR_DISPOSITION_UPDATED_MESSAGE,
  SURVIVOR_STATE_UPDATED_MESSAGE
} from '@/lib/messages'
import { AenasState } from '@/lib/wanderers/aenas'
import { Survivor } from '@/schemas/survivor'
import { ReactElement } from 'react'

/**
 * Wanderer Card Properties
 */
interface WandererCardProps {
  /** Save Selected Survivor */
  saveSelectedSurvivor: (data: Partial<Survivor>, successMsg?: string) => void
  /** Selected Survivor */
  selectedSurvivor: Survivor | null
}

/**
 * Wanderer Card Component
 *
 * Displays wanderer-specific attributes including disposition (always shown)
 * and state (shown only for Aenas). Wanderers are special survivors that
 * join the settlement through specific events.
 *
 * @param props Wanderer Card Properties
 * @returns Wanderer Card Component
 */
export function WandererCard({
  saveSelectedSurvivor,
  selectedSurvivor
}: WandererCardProps): ReactElement {
  /**
   * Handles state selection changes (for Aenas).
   *
   * @param value Selected State Value
   */
  const handleStateChange = (value: string) => {
    if (selectedSurvivor && selectedSurvivor.name)
      saveSelectedSurvivor(
        { state: value as (typeof AenasState)[keyof typeof AenasState] },
        SURVIVOR_STATE_UPDATED_MESSAGE(selectedSurvivor.name, value)
      )
  }

  return (
    <Card className="p-2 border-0 gap-0">
      {/* Wanderer Attributes */}
      <CardContent className="flex flex-col gap-2 p-0">
        {/* Disposition (Always Shown) */}
        <div className="flex flex-row items-center gap-2 justify-between">
          <Label className="text-xs">Disposition</Label>
          <NumericInput
            label="Disposition"
            value={selectedSurvivor?.disposition ?? 0}
            onChange={(value) =>
              saveSelectedSurvivor(
                { disposition: value },
                SURVIVOR_DISPOSITION_UPDATED_MESSAGE()
              )
            }
            readOnly={false}>
            <Input
              id="wanderer-disposition"
              type="number"
              value={selectedSurvivor?.disposition ?? 0}
              onChange={(e) =>
                saveSelectedSurvivor(
                  { disposition: parseInt(e.target.value, 10) || 0 },
                  SURVIVOR_DISPOSITION_UPDATED_MESSAGE()
                )
              }
              min="0"
              className="text-center no-spinners w-20"
            />
          </NumericInput>
        </div>

        {/* State (Aenas Only) */}
        {selectedSurvivor?.name === 'Aenas' && (
          <div className="flex flex-row items-center gap-2 justify-between">
            <Label className="text-xs">State</Label>
            <Select
              value={selectedSurvivor?.state || ''}
              onValueChange={handleStateChange}>
              <SelectTrigger id="state-select" name="state">
                <SelectValue placeholder="Select a state" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(AenasState).map((state) => (
                  <SelectItem key={state} value={state}>
                    {state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
