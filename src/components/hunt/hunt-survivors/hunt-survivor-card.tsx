'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { ActiveHunt } from '@/schemas/active-hunt'
import { Settlement } from '@/schemas/settlement'
import { Survivor, SurvivorSchema } from '@/schemas/survivor'
import { zodResolver } from '@hookform/resolvers/zod'
import { ReactElement, useCallback, useEffect } from 'react'
import { Resolver, useForm } from 'react-hook-form'
import { toast } from 'sonner'

/**
 * Hunt Survivor Card Component
 *
 * Displays updatable information for a single survivor during an active hunt
 */
interface HuntSurvivorCardProps {
  /** Settlement Data */
  settlement: Settlement
  /** Survivor Data */
  survivor: Survivor
  /** Function to Save Active Hunt Data */
  saveActiveHunt: (data: Partial<ActiveHunt>, successMsg?: string) => void
}

/**
 * Survivor Card Component
 *
 * Displays updatable survivor information for hunt
 */
export function HuntSurvivorCard({
  settlement,
  survivor,
  saveActiveHunt
}: HuntSurvivorCardProps): ReactElement {
  // const [selectedSurvivor, setSelectedSurvivor] = useState<Survivor>(survivor)

  const form = useForm<Survivor>({
    resolver: zodResolver(SurvivorSchema) as Resolver<Survivor>,
    defaultValues: survivor
  })

  /**
   * Update Survival Points
   */
  const updateSurvival = (val: string) => {
    const value = parseInt(val) || 0

    // Enforce minimum value of 0
    if (value < 0) return toast.error('Survival cannot be negative.')

    // Enforce maximum value of survivalLimit
    if (value > (settlement.survivalLimit || 0))
      return toast.error(
        `Survival cannot exceed the settlement's limit of ${settlement.survivalLimit}.`
      )

    saveToLocalStorage('survival', value, 'Survival updated successfully.')
  }

  /**
   * Update Insanity Points
   */
  const updateInsanity = (val: string) => {
    const value = parseInt(val) || 0

    // Enforce minimum value of 0
    if (value < 0) return toast.error('Insanity cannot be negative.')

    saveToLocalStorage('insanity', value, 'Insanity updated successfully.')
  }

  /**
   * Save to Local Storage
   *
   * @param field Field name to update
   * @param value New value
   * @param successMsg Optional success message
   */
  const saveToLocalStorage = (
    field: keyof Survivor,
    value: unknown,
    successMsg?: string
  ) => {
    // setSelectedSurvivor((prev) => ({
    //   ...prev,
    //   [field]: value
    // }))
    // form.setValue(field, value as string | number)
    saveActiveHunt({ [field]: value }, successMsg)
  }

  useEffect(() => {
    // Reset form when survivor data changes
    console.log('Resetting form with survivor data:', survivor)
    form.reset(survivor)
  }, [form, survivor])

  /**
   * Update survivor data and save to local storage.
   */
  const updateSurvivor = useCallback(
    (field: keyof Survivor, value: unknown, successMsg?: string) => {
      console.log(survivor.insanity)
      try {
        // saveActiveHunt(
        //   {
        //     ...survivor,
        //     [field]: value
        //   },
        //   successMsg
        // )
        form.reset({
          ...survivor,
          [field]: value
        })
      } catch (error) {
        console.error('Survivor Update Error:', error)
        toast.error('The darkness swallows your words. Please try again.')
      }
    },
    [form, survivor]
  )

  return (
    <Card className="border border-border/30">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold">{survivor.name}</CardTitle>
      </CardHeader>
      <CardContent className="pt-0 space-y-3">
        {/* Special Abilities */}
        {(survivor.hasPrepared ||
          survivor.hasExplore ||
          survivor.headShatteredJaw) && (
          <div className="space-y-2">
            {survivor.hasPrepared && (
              <div className="text-xs bg-green-50 dark:bg-green-950/30 border border-green-200/50 dark:border-green-800/30 rounded px-2 py-1">
                <strong>Prepared:</strong> Add Hunt XP to roll when determining{' '}
                <strong>straggler</strong>
              </div>
            )}
            {survivor.hasExplore && (
              <div className="text-xs bg-blue-50 dark:bg-blue-950/30 border border-blue-200/50 dark:border-blue-800/30 rounded px-2 py-1">
                <strong>Explore:</strong> +2 to <strong>investigate</strong>{' '}
                results
              </div>
            )}
            {survivor.headShatteredJaw && (
              <div className="text-xs bg-red-50 dark:bg-red-950/30 border border-red-200/50 dark:border-red-800/30 rounded px-2 py-1">
                <strong>Shattered Jaw:</strong> Can&apos;t{' '}
                <strong>consume</strong>
              </div>
            )}
          </div>
        )}

        {/* Status Checkboxes */}
        <div className="flex gap-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id={`retired-${survivor.id}`}
              checked={survivor.retired}
              onCheckedChange={(checked) =>
                updateSurvivor(
                  'retired',
                  !!checked,
                  checked
                    ? 'The survivor retires from the hunt.'
                    : 'The survivor returns to active duty.'
                )
              }
            />
            <Label htmlFor={`retired-${survivor.id}`} className="text-xs">
              Retired
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id={`dead-${survivor.id}`}
              checked={survivor.dead}
              onCheckedChange={(checked) =>
                updateSurvivor(
                  'dead',
                  !!checked,
                  checked
                    ? 'Darkness claims another soul.'
                    : 'The survivor returns from the brink of death.'
                )
              }
            />
            <Label htmlFor={`dead-${survivor.id}`} className="text-xs">
              Dead
            </Label>
          </div>
        </div>

        {/* Hunt XP (Read-only) */}
        <div className="flex items-center justify-between">
          <Label className="text-xs">Hunt XP</Label>
          <div className="text-sm font-semibold bg-muted rounded px-2 py-1">
            {survivor.huntXP}
          </div>
        </div>

        {/* Cannot Spend Survival */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id={`cannot-spend-survival-${survivor.id}`}
            checked={!survivor.canSpendSurvival}
            onCheckedChange={(checked) =>
              updateSurvivor(
                'canSpendSurvival',
                !checked,
                !checked
                  ? 'The survivor freezes - survival cannot be spent.'
                  : 'The survivor can once again spend survival.'
              )
            }
          />
          <Label
            htmlFor={`cannot-spend-survival-${survivor.id}`}
            className="text-xs">
            Cannot spend survival
          </Label>
        </div>

        {/* Survival and Insanity */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label htmlFor={`survival-${survivor.id}`} className="text-xs">
              Survival
            </Label>
            <Input
              id={`survival-${survivor.id}`}
              type="number"
              value={survivor.survival}
              onChange={(e) =>
                updateSurvivor(
                  'survival',
                  parseInt(e.target.value) || 0,
                  'Survival updated.'
                )
              }
              className="h-8 text-center"
              min="0"
            />
          </div>
          <div className="space-y-1">
            <FormField
              control={form.control}
              name="insanity"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-2">
                    {/* Insanity Input */}
                    <FormControl>
                      <Input
                        placeholder="1"
                        type="number"
                        className={cn(
                          'w-14 h-14 text-center no-spinners text-2xl sm:text-2xl md:text-2xl'
                        )}
                        {...field}
                        value={field.value ?? '1'}
                        onChange={(e) => updateInsanity(e.target.value)}
                      />
                    </FormControl>
                    <FormLabel className="font-bold text-left">
                      Insanity
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Attributes Grid */}
        <div className="grid grid-cols-3 gap-2">
          <div className="space-y-1">
            <Label htmlFor={`accuracy-${survivor.id}`} className="text-xs">
              Accuracy
            </Label>
            <Input
              id={`accuracy-${survivor.id}`}
              type="number"
              value={survivor.accuracy}
              onChange={(e) =>
                updateSurvivor(
                  'accuracy',
                  parseInt(e.target.value) || 0,
                  'Accuracy updated.'
                )
              }
              className="h-8 text-center"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor={`luck-${survivor.id}`} className="text-xs">
              Luck
            </Label>
            <Input
              id={`luck-${survivor.id}`}
              type="number"
              value={survivor.luck}
              onChange={(e) =>
                updateSurvivor(
                  'luck',
                  parseInt(e.target.value) || 0,
                  'Luck updated.'
                )
              }
              className="h-8 text-center"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor={`speed-${survivor.id}`} className="text-xs">
              Speed
            </Label>
            <Input
              id={`speed-${survivor.id}`}
              type="number"
              value={survivor.speed}
              onChange={(e) =>
                updateSurvivor(
                  'speed',
                  parseInt(e.target.value) || 0,
                  'Speed updated.'
                )
              }
              className="h-8 text-center"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor={`strength-${survivor.id}`} className="text-xs">
              Strength
            </Label>
            <Input
              id={`strength-${survivor.id}`}
              type="number"
              value={survivor.strength}
              onChange={(e) =>
                updateSurvivor(
                  'strength',
                  parseInt(e.target.value) || 0,
                  'Strength updated.'
                )
              }
              className="h-8 text-center"
            />
          </div>

          {/* ARC-specific attributes */}
          {/* {settlement.survivorType === SurvivorType.ARC && (
            <>
              <div className="space-y-1">
                <Label htmlFor={`lumi-${survivor.id}`} className="text-xs">
                  Lumi
                </Label>
                <Input
                  id={`lumi-${survivor.id}`}
                  type="number"
                  value={survivor.lumi}
                  onChange={(e) =>
                    updateSurvivor(
                      'lumi',
                      parseInt(e.target.value) || 0,
                      'Lumi updated.'
                    )
                  }
                  className="h-8 text-center"
                  min="0"
                />
              </div>
              <div className="space-y-1">
                <Label
                  htmlFor={`systemic-pressure-${survivor.id}`}
                  className="text-xs">
                  Systemic Pressure
                </Label>
                <Input
                  id={`systemic-pressure-${survivor.id}`}
                  type="number"
                  value={survivor.systemicPressure}
                  onChange={(e) =>
                    updateSurvivor(
                      'systemicPressure',
                      parseInt(e.target.value) || 0,
                      'Systemic pressure updated.'
                    )
                  }
                  className="h-8 text-center"
                  min="0"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor={`torment-${survivor.id}`} className="text-xs">
                  Torment
                </Label>
                <Input
                  id={`torment-${survivor.id}`}
                  type="number"
                  value={survivor.torment}
                  onChange={(e) =>
                    updateSurvivor(
                      'torment',
                      parseInt(e.target.value) || 0,
                      'Torment updated.'
                    )
                  }
                  className="h-8 text-center"
                  min="0"
                />
              </div>
            </>
          )} */}
        </div>

        {/* Courage and Understanding */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label htmlFor={`courage-${survivor.id}`} className="text-xs">
              Courage
            </Label>
            <Input
              id={`courage-${survivor.id}`}
              type="number"
              value={survivor.courage}
              onChange={(e) =>
                updateSurvivor(
                  'courage',
                  parseInt(e.target.value) || 0,
                  'Courage updated.'
                )
              }
              className="h-8 text-center"
              min="0"
              max="9"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor={`understanding-${survivor.id}`} className="text-xs">
              Understanding
            </Label>
            <Input
              id={`understanding-${survivor.id}`}
              type="number"
              value={survivor.understanding}
              onChange={(e) =>
                updateSurvivor(
                  'understanding',
                  parseInt(e.target.value) || 0,
                  'Understanding updated.'
                )
              }
              className="h-8 text-center"
              min="0"
              max="9"
            />
          </div>
        </div>

        {/* Abilities and Impairments */}
        {survivor.abilitiesAndImpairments.length > 0 && (
          <div className="space-y-2">
            <Label className="text-xs font-semibold">
              Abilities & Impairments
            </Label>
            <div className="space-y-1">
              {survivor.abilitiesAndImpairments.map((ability, index) => (
                <div
                  key={index}
                  className="text-xs bg-background/60 rounded px-2 py-1 border">
                  {ability}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Once Per Lifetime */}
        {survivor.oncePerLifetime.length > 0 && (
          <div className="space-y-2">
            <Label className="text-xs font-semibold">Once Per Lifetime</Label>
            <div className="space-y-1">
              {survivor.oncePerLifetime.map((bonus, index) => (
                <div
                  key={index}
                  className="text-xs bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200/50 dark:border-yellow-800/30 rounded px-2 py-1">
                  {bonus}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Disorders */}
        {survivor.disorders.length > 0 && (
          <div className="space-y-2">
            <Label className="text-xs font-semibold">Disorders</Label>
            <div className="space-y-1">
              {survivor.disorders.map((disorder, index) => (
                <div
                  key={index}
                  className="text-xs bg-red-50 dark:bg-red-950/30 border border-red-200/50 dark:border-red-800/30 rounded px-2 py-1">
                  {disorder}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Armor and Damage Tracking */}
        <div className="space-y-3">
          <Label className="text-xs font-semibold">Armor & Damage</Label>

          {/* Head */}
          <div className="space-y-2">
            <Label className="text-xs font-medium">Head</Label>
            <div className="grid grid-cols-3 gap-2 items-center">
              <div className="space-y-1">
                <Label
                  htmlFor={`head-armor-${survivor.id}`}
                  className="text-xs">
                  Armor
                </Label>
                <Input
                  id={`head-armor-${survivor.id}`}
                  type="number"
                  value={survivor.headArmor}
                  onChange={(e) =>
                    updateSurvivor(
                      'headArmor',
                      parseInt(e.target.value) || 0,
                      'Head armor updated.'
                    )
                  }
                  className="h-8 text-center"
                  min="0"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`head-heavy-${survivor.id}`}
                  checked={survivor.headHeavyDamage}
                  onCheckedChange={(checked) =>
                    updateSurvivor(
                      'headHeavyDamage',
                      !!checked,
                      checked
                        ? 'Head takes heavy damage.'
                        : 'Head heavy damage cleared.'
                    )
                  }
                />
                <Label
                  htmlFor={`head-heavy-${survivor.id}`}
                  className="text-xs">
                  Heavy
                </Label>
              </div>
            </div>
          </div>

          {/* Arm */}
          <div className="space-y-2">
            <Label className="text-xs font-medium">Arm</Label>
            <div className="grid grid-cols-3 gap-2 items-center">
              <div className="space-y-1">
                <Label htmlFor={`arm-armor-${survivor.id}`} className="text-xs">
                  Armor
                </Label>
                <Input
                  id={`arm-armor-${survivor.id}`}
                  type="number"
                  value={survivor.armArmor}
                  onChange={(e) =>
                    updateSurvivor(
                      'armArmor',
                      parseInt(e.target.value) || 0,
                      'Arm armor updated.'
                    )
                  }
                  className="h-8 text-center"
                  min="0"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`arm-light-${survivor.id}`}
                  checked={survivor.armLightDamage}
                  onCheckedChange={(checked) =>
                    updateSurvivor(
                      'armLightDamage',
                      !!checked,
                      checked
                        ? 'Arm takes light damage.'
                        : 'Arm light damage cleared.'
                    )
                  }
                />
                <Label htmlFor={`arm-light-${survivor.id}`} className="text-xs">
                  Light
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`arm-heavy-${survivor.id}`}
                  checked={survivor.armHeavyDamage}
                  onCheckedChange={(checked) =>
                    updateSurvivor(
                      'armHeavyDamage',
                      !!checked,
                      checked
                        ? 'Arm takes heavy damage.'
                        : 'Arm heavy damage cleared.'
                    )
                  }
                />
                <Label htmlFor={`arm-heavy-${survivor.id}`} className="text-xs">
                  Heavy
                </Label>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="space-y-2">
            <Label className="text-xs font-medium">Body</Label>
            <div className="grid grid-cols-3 gap-2 items-center">
              <div className="space-y-1">
                <Label
                  htmlFor={`body-armor-${survivor.id}`}
                  className="text-xs">
                  Armor
                </Label>
                <Input
                  id={`body-armor-${survivor.id}`}
                  type="number"
                  value={survivor.bodyArmor}
                  onChange={(e) =>
                    updateSurvivor(
                      'bodyArmor',
                      parseInt(e.target.value) || 0,
                      'Body armor updated.'
                    )
                  }
                  className="h-8 text-center"
                  min="0"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`body-light-${survivor.id}`}
                  checked={survivor.bodyLightDamage}
                  onCheckedChange={(checked) =>
                    updateSurvivor(
                      'bodyLightDamage',
                      !!checked,
                      checked
                        ? 'Body takes light damage.'
                        : 'Body light damage cleared.'
                    )
                  }
                />
                <Label
                  htmlFor={`body-light-${survivor.id}`}
                  className="text-xs">
                  Light
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`body-heavy-${survivor.id}`}
                  checked={survivor.bodyHeavyDamage}
                  onCheckedChange={(checked) =>
                    updateSurvivor(
                      'bodyHeavyDamage',
                      !!checked,
                      checked
                        ? 'Body takes heavy damage.'
                        : 'Body heavy damage cleared.'
                    )
                  }
                />
                <Label
                  htmlFor={`body-heavy-${survivor.id}`}
                  className="text-xs">
                  Heavy
                </Label>
              </div>
            </div>
          </div>

          {/* Waist */}
          <div className="space-y-2">
            <Label className="text-xs font-medium">Waist</Label>
            <div className="grid grid-cols-3 gap-2 items-center">
              <div className="space-y-1">
                <Label
                  htmlFor={`waist-armor-${survivor.id}`}
                  className="text-xs">
                  Armor
                </Label>
                <Input
                  id={`waist-armor-${survivor.id}`}
                  type="number"
                  value={survivor.waistArmor}
                  onChange={(e) =>
                    updateSurvivor(
                      'waistArmor',
                      parseInt(e.target.value) || 0,
                      'Waist armor updated.'
                    )
                  }
                  className="h-8 text-center"
                  min="0"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`waist-light-${survivor.id}`}
                  checked={survivor.waistLightDamage}
                  onCheckedChange={(checked) =>
                    updateSurvivor(
                      'waistLightDamage',
                      !!checked,
                      checked
                        ? 'Waist takes light damage.'
                        : 'Waist light damage cleared.'
                    )
                  }
                />
                <Label
                  htmlFor={`waist-light-${survivor.id}`}
                  className="text-xs">
                  Light
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`waist-heavy-${survivor.id}`}
                  checked={survivor.waistHeavyDamage}
                  onCheckedChange={(checked) =>
                    updateSurvivor(
                      'waistHeavyDamage',
                      !!checked,
                      checked
                        ? 'Waist takes heavy damage.'
                        : 'Waist heavy damage cleared.'
                    )
                  }
                />
                <Label
                  htmlFor={`waist-heavy-${survivor.id}`}
                  className="text-xs">
                  Heavy
                </Label>
              </div>
            </div>
          </div>

          {/* Leg */}
          <div className="space-y-2">
            <Label className="text-xs font-medium">Leg</Label>
            <div className="grid grid-cols-3 gap-2 items-center">
              <div className="space-y-1">
                <Label htmlFor={`leg-armor-${survivor.id}`} className="text-xs">
                  Armor
                </Label>
                <Input
                  id={`leg-armor-${survivor.id}`}
                  type="number"
                  value={survivor.legArmor}
                  onChange={(e) =>
                    updateSurvivor(
                      'legArmor',
                      parseInt(e.target.value) || 0,
                      'Leg armor updated.'
                    )
                  }
                  className="h-8 text-center"
                  min="0"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`leg-light-${survivor.id}`}
                  checked={survivor.legLightDamage}
                  onCheckedChange={(checked) =>
                    updateSurvivor(
                      'legLightDamage',
                      !!checked,
                      checked
                        ? 'Leg takes light damage.'
                        : 'Leg light damage cleared.'
                    )
                  }
                />
                <Label htmlFor={`leg-light-${survivor.id}`} className="text-xs">
                  Light
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`leg-heavy-${survivor.id}`}
                  checked={survivor.legHeavyDamage}
                  onCheckedChange={(checked) =>
                    updateSurvivor(
                      'legHeavyDamage',
                      !!checked,
                      checked
                        ? 'Leg takes heavy damage.'
                        : 'Leg heavy damage cleared.'
                    )
                  }
                />
                <Label htmlFor={`leg-heavy-${survivor.id}`} className="text-xs">
                  Heavy
                </Label>
              </div>
            </div>
          </div>

          {/* Brain */}
          <div className="space-y-2">
            <Label className="text-xs font-medium">Brain</Label>
            <div className="grid grid-cols-3 gap-2 items-center">
              <div></div> {/* Empty space for alignment */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`brain-light-${survivor.id}`}
                  checked={survivor.brainLightDamage}
                  onCheckedChange={(checked) =>
                    updateSurvivor(
                      'brainLightDamage',
                      !!checked,
                      checked
                        ? 'Brain takes light damage.'
                        : 'Brain light damage cleared.'
                    )
                  }
                />
                <Label
                  htmlFor={`brain-light-${survivor.id}`}
                  className="text-xs">
                  Light
                </Label>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
