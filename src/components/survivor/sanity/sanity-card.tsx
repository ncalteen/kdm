'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { SurvivorType } from '@/lib/enums'
import { Settlement } from '@/schemas/settlement'
import { Survivor } from '@/schemas/survivor'
import { BrainIcon, Shield } from 'lucide-react'
import { ReactElement } from 'react'
import { toast } from 'sonner'

/**
 * Sanity Card Properties
 */
interface SanityCardProps {
  /** Save Selected Survivor */
  saveSelectedSurvivor: (data: Partial<Survivor>, successMsg?: string) => void
  /** Selected Settlemenet */
  selectedSettlement: Partial<Settlement> | null
  /** Selected Survivor */
  selectedSurvivor: Partial<Survivor> | null
}

/**
 * Survivor Sanity Card Component
 *
 * This component displays the survivor's insanity level and brain state. It
 * includes an insanity counter and a checkbox for light brain damage. For Arc
 * survivors, it also shows the Torment attribute.
 *
 * @param props Sanity Card Properties
 * @returns Sanity Card Component
 */
export function SanityCard({
  saveSelectedSurvivor,
  selectedSettlement,
  selectedSurvivor
}: SanityCardProps): ReactElement {
  /**
   * Update Insanity
   */
  const updateInsanity = (val: string) => {
    let value = parseInt(val) || 0

    // Enforce minimum value of 0
    if (value < 0) {
      value = 0
      return toast.error('Insanity cannot be negative..')
    }

    saveSelectedSurvivor(
      {
        insanity: value
      },
      'Insanity level updated.'
    )
  }

  /**
   * Update Brain Light Damage
   */
  const updateBrainLightDamage = (checked: boolean) =>
    saveSelectedSurvivor(
      {
        brainLightDamage: !!checked
      },
      !!checked
        ? 'The survivor suffers brain damage from the horrors witnessed.'
        : 'The survivor recovers from their brain injury.'
    )

  /**
   * Update Torment (Arc)
   */
  const updateTorment = (val: string) => {
    let value = parseInt(val) || 0

    // Enforce minimum value of 0
    if (value < 0) {
      value = 0
      return toast.error('Torment cannot be negative.')
    }

    saveSelectedSurvivor(
      {
        torment: value
      },
      'Torment level updated.'
    )
  }

  return (
    <Card className="p-2 border-0">
      <CardContent className="p-0 h-[80px]">
        <div className="flex">
          {/* Insanity */}
          <div className="flex flex-col items-center">
            <div className="relative flex items-center">
              <Shield
                className="h-14 w-14 text-muted-foreground"
                strokeWidth={1}
              />
              <Input
                placeholder="1"
                type="number"
                className="absolute top-[50%] left-7 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 text-xl sm:text-xl md:text-xl text-center p-0 bg-transparent border-none no-spinners focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                value={selectedSurvivor?.insanity ?? '0'}
                min={0}
                onChange={(e) => updateInsanity(e.target.value)}
              />
            </div>
            <label className="text-xs">Insanity</label>
          </div>

          <div className="mx-2 w-px bg-border h-[80px]" />

          {/* Brain */}
          <div className="relative flex-1 flex flex-col justify-between">
            <div className="text-md font-bold flex gap-1 items-center">
              <BrainIcon />
              Brain
            </div>
            <div className="absolute top-0 right-0 pr-2 flex items-center">
              <div className="space-y-0 flex flex-col items-center">
                <Checkbox
                  checked={selectedSurvivor?.brainLightDamage ?? false}
                  onCheckedChange={(checked) =>
                    updateBrainLightDamage(!!checked)
                  }
                />
                <label className="text-xs mt-1">L</label>
              </div>
            </div>
            <div className="text-xs mt-auto text-muted-foreground">
              If your insanity is 3+, you are <strong>insane</strong>.
            </div>
          </div>

          {/* Torment (Arc) */}
          {selectedSettlement?.survivorType === SurvivorType.ARC && (
            <div className="flex flex-col items-center gap-1">
              <Input
                placeholder="0"
                type="number"
                className="w-12 h-12 text-center no-spinners text-xl sm:text-xl md:text-xl focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                value={selectedSurvivor?.torment ?? '0'}
                onChange={(e) => updateTorment(e.target.value)}
              />
              <label className="text-xs">Torment</label>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
