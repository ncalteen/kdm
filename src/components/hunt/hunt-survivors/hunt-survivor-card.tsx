'use client'

import { Avatar } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger
} from '@/components/ui/context-menu'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { ColorChoice, SurvivorType } from '@/lib/enums'
import {
  getCampaign,
  getColorStyle,
  saveCampaignToLocalStorage
} from '@/lib/utils'
import { Hunt } from '@/schemas/hunt'
import { Settlement } from '@/schemas/settlement'
import { Survivor, SurvivorSchema } from '@/schemas/survivor'
import { zodResolver } from '@hookform/resolvers/zod'
import { AvatarFallback } from '@radix-ui/react-avatar'
import {
  BrainIcon,
  FootprintsIcon,
  HandMetalIcon,
  HardHatIcon,
  RibbonIcon,
  ShieldIcon,
  ShirtIcon
} from 'lucide-react'
import { ReactElement, useEffect } from 'react'
import { Resolver, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { ZodError } from 'zod'

/**
 * Hunt Survivor Card Component
 */
interface HuntSurvivorCardProps {
  /** Save Selected Hunt */
  saveSelectedHunt: (updateData: Partial<Hunt>, successMsg?: string) => void
  /** Selected Hunt */
  selectedHunt: Partial<Hunt> | null
  /** Selected Settlement */
  selectedSettlement: Partial<Settlement> | null
  /** Selected Survivor */
  selectedSurvivor: Survivor | null
  /** Set Survivors */
  setSurvivors: (survivors: Survivor[]) => void
  /** Survivor */
  survivor: Partial<Survivor> | null
  /** Survivors */
  survivors: Survivor[] | null
  /** Update Selected Survivor */
  updateSelectedSurvivor: (survivor: Survivor) => void
}

/**
 * Survivor Card Component
 *
 * Displays updatable survivor information for hunt
 */
export function HuntSurvivorCard({
  saveSelectedHunt,
  selectedHunt,
  selectedSettlement,
  selectedSurvivor,
  setSurvivors,
  survivor,
  survivors,
  updateSelectedSurvivor
}: HuntSurvivorCardProps): ReactElement {
  const form = useForm<Survivor>({
    resolver: zodResolver(SurvivorSchema) as Resolver<Survivor>,
    defaultValues: SurvivorSchema.parse(survivor || {})
  })

  // Update form values when survivor data changes
  useEffect(() => {
    if (survivor) form.reset(survivor)
  }, [survivor, form])

  /**
   * Save Survivors to Local Storage
   */
  const saveToLocalStorage = (
    survivorId: number,
    updateData: Partial<Survivor>,
    successMsg?: string
  ) => {
    if (!survivors) return

    try {
      // Get the campaign and find the survivor to update
      const campaign = getCampaign()
      const survivorIndex = campaign.survivors.findIndex(
        (s: Survivor) => s.id === survivorId
      )

      if (survivorIndex === -1)
        return toast.error('Survivor not found in campaign data.')

      // Update the survivor in the campaign
      const updatedSurvivor = {
        ...campaign.survivors[survivorIndex],
        ...updateData
      }

      // Validate the updated survivor data
      SurvivorSchema.parse(updatedSurvivor)

      // Update the campaign with the modified survivor
      campaign.survivors[survivorIndex] = updatedSurvivor

      // Save the updated campaign to localStorage
      saveCampaignToLocalStorage(campaign)

      const updatedSurvivors = survivors.map((s) =>
        s.id === survivorId ? { ...s, ...updateData } : s
      )

      // Update selected survivor if this is the currently selected survivor
      if (survivorId === selectedSurvivor?.id)
        updateSelectedSurvivor({
          ...selectedSurvivor,
          ...updateData
        })

      setSurvivors(updatedSurvivors)

      // Update the form with the new values
      if (survivorId === survivor?.id) {
        const updatedFormData = { ...survivor, ...updateData }
        form.reset(SurvivorSchema.parse(updatedFormData))
      }

      if (successMsg) toast.success(successMsg)
    } catch (error) {
      console.error('Hunt Survivor Save Error:', error)

      if (error instanceof ZodError && error.errors[0]?.message)
        toast.error(error.errors[0].message)
      else toast.error('The darkness swallows your words. Please try again.')
    }
  }

  /**
   * Update Survivor Color
   */
  const updateSurvivorColor = (color: ColorChoice) => {
    if (!survivor?.id || !selectedHunt) return

    const currentColors = selectedHunt.survivorColors || []
    const updatedColors = currentColors.filter((sc) => sc.id !== survivor.id)
    updatedColors.push({ id: survivor.id, color })

    saveSelectedHunt(
      { survivorColors: updatedColors },
      `Survivor color changed to ${color}.`
    )
  }

  /**
   * Get Current Survivor Color
   */
  const getCurrentColor = (): ColorChoice => {
    if (!survivor?.id || !selectedHunt?.survivorColors) return ColorChoice.SLATE

    const survivorColor = selectedHunt.survivorColors.find(
      (sc) => sc.id === survivor.id
    )

    return survivorColor?.color || ColorChoice.SLATE
  }

  /**
   * Update Survival Points
   */
  const updateSurvival = (val: string) => {
    if (!survivor || !survivor.id || !selectedSettlement) return

    const value = parseInt(val) || 0

    if (value < 0) return toast.error('Survival cannot be negative.')
    if (value > (selectedSettlement?.survivalLimit || 1))
      return toast.error(
        `Survival cannot exceed the settlement's limit of ${selectedSettlement.survivalLimit || 1}.`
      )

    saveToLocalStorage(
      survivor.id,
      { survival: value },
      'Survival updated successfully.'
    )
  }

  /**
   * Update Insanity Points
   */
  const updateInsanity = (val: string) => {
    if (!survivor || !survivor.id || !selectedSettlement) return

    const value = parseInt(val) || 0

    if (value < 0) return toast.error('Insanity cannot be negative.')

    saveToLocalStorage(
      survivor.id,
      { insanity: value },
      'Insanity updated successfully.'
    )
  }

  if (!survivor) return <></>

  return (
    <Card className="min-w-[300px] flex-grow-2 border-2 rounded-xl border-border/20 hover:border-border/50 py-0 pb-2 gap-2">
      <CardHeader className="flex items-center gap-3 bg-muted/20 p-3 border-border/20 rounded-t-lg">
        <ContextMenu>
          <ContextMenuTrigger>
            {/* Header with Avatar and Name */}
            <Avatar
              className={`h-12 w-12 border-2 ${getColorStyle(getCurrentColor())} items-center justify-center`}>
              <AvatarFallback className="font-bold text-lg text-white">
                {survivor.name
                  ? survivor.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .slice(0, 2)
                  : '??'}
              </AvatarFallback>
            </Avatar>
          </ContextMenuTrigger>
          <ContextMenuContent className="w-64">
            <div className="p-2">
              <div className="text-sm font-medium mb-2">Survivor Color</div>
              <div className="grid grid-cols-6 gap-1">
                {Object.values(ColorChoice).map((color) => {
                  const isSelected = getCurrentColor() === color
                  return (
                    <ContextMenuItem
                      key={color}
                      className="p-0 h-8 w-8"
                      asChild>
                      <button
                        className={`h-8 w-8 rounded-full border-2 ${getColorStyle(color)} ${
                          isSelected
                            ? 'border-white ring-2 ring-black'
                            : 'border-gray-300 hover:border-white'
                        } transition-all duration-200`}
                        onClick={() => updateSurvivorColor(color)}
                        title={color.charAt(0).toUpperCase() + color.slice(1)}
                      />
                    </ContextMenuItem>
                  )
                })}
              </div>
            </div>
          </ContextMenuContent>
        </ContextMenu>

        <div className="text-left flex-1 min-w-0">
          <div className="font-semibold text-sm truncate">{survivor.name}</div>
          <div className="text-xs text-muted-foreground">{survivor.gender}</div>
        </div>

        {/* Status Checkboxes */}
        <div className="flex flex-col gap-1">
          {/* Retired */}
          <div className="flex items-center space-x-1">
            <Checkbox
              id={`retired-${survivor.id}`}
              checked={survivor.retired}
              onCheckedChange={(checked) =>
                saveToLocalStorage(
                  survivor.id!,
                  { retired: !!checked },
                  checked
                    ? 'The survivor will retire after this hunt.'
                    : 'The survivor returns from retirement.'
                )
              }
              className="h-4 w-4"
            />
            <Label htmlFor={`retired-${survivor.id}`} className="text-xs">
              Retired
            </Label>
          </div>

          {/* Dead */}
          <div className="flex items-center space-x-1">
            <Checkbox
              id={`dead-${survivor.id}`}
              checked={survivor.dead}
              onCheckedChange={(checked) =>
                saveToLocalStorage(
                  survivor.id!,
                  { dead: !!checked },
                  checked
                    ? 'Darkness claims another soul.'
                    : 'The survivor returns from the brink of death.'
                )
              }
              className="h-4 w-4"
            />
            <Label htmlFor={`dead-${survivor.id}`} className="text-xs">
              Dead
            </Label>
          </div>

          {/* Skip Next Hunt */}
          <div className="flex items-center space-x-1">
            <Checkbox
              id={`skipNextHunt-${survivor.id}`}
              checked={survivor.skipNextHunt}
              onCheckedChange={(checked) =>
                saveToLocalStorage(
                  survivor.id!,
                  { skipNextHunt: !!checked },
                  checked
                    ? 'The survivor must skip the next hunt.'
                    : 'The survivor does not need to skip the next hunt.'
                )
              }
              className="h-4 w-4"
            />
            <Label htmlFor={`dead-${survivor.id}`} className="text-xs">
              Skip Next Hunt
            </Label>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col p-3 py-0 mt-0 gap-1">
        {/* Hunt XP */}
        <div className="bg-background/60 rounded text-center text-sm">
          <div className="font-bold pb-1 text-muted-foreground">Hunt XP</div>
          <Input
            id={`hunt-xp-${survivor.id}`}
            type="number"
            value={survivor.huntXP}
            onChange={(e) =>
              saveToLocalStorage(
                survivor.id!,
                { huntXP: parseInt(e.target.value) || 0 },
                'Hunt XP updated successfully.'
              )
            }
            className="text-center border-0 bg-transparent p-0 no-spinners focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
            min="0"
          />
        </div>

        {/* Movement, Survival, and Insanity */}
        <div className="grid grid-cols-3 gap-0">
          <div className="bg-background/40 rounded-lg p-1 text-center">
            <div className="text-xs text-muted-foreground pb-1">Movement</div>
            <Input
              id={`movement-${survivor.id}`}
              type="number"
              value={survivor.movement}
              onChange={(e) =>
                saveToLocalStorage(
                  survivor.id!,
                  { movement: parseInt(e.target.value) || 0 },
                  'Movement updated.'
                )
              }
              className="text-center border-0 bg-transparent p-0 no-spinners focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
              min="0"
            />
          </div>
          <div className="bg-background/40 rounded-lg p-1 text-center">
            <div className="text-xs text-muted-foreground pb-1">Survival</div>
            <Input
              id={`survival-${survivor.id}`}
              type="number"
              value={survivor.survival}
              onChange={(e) => updateSurvival(e.target.value)}
              className={`text-center border-0 p-0 no-spinners focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 ${
                !survivor.canSpendSurvival
                  ? 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                  : 'bg-transparent'
              }`}
              min="0"
            />
          </div>
          <div className="bg-background/40 rounded-lg p-1 text-center">
            <div className="text-xs text-muted-foreground pb-1">Insanity</div>
            <Input
              id={`insanity-${survivor.id}`}
              type="number"
              value={survivor.insanity}
              onChange={(e) => updateInsanity(e.target.value)}
              className="text-center border-0 bg-transparent p-0 no-spinners focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
              min="0"
            />
          </div>
        </div>

        {/* Cannot Spend Survival */}
        <div className="flex items-center justify-center space-x-2">
          <Switch
            id={`cannot-spend-survival-${survivor.id}`}
            checked={!survivor.canSpendSurvival}
            onCheckedChange={(checked) =>
              saveToLocalStorage(
                survivor.id!,
                { canSpendSurvival: !checked },
                checked
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

        {/* Courage and Understanding */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-background/40 rounded-lg p-0 text-center">
            <div className="text-xs text-muted-foreground pb-1">Courage</div>
            <Input
              id={`courage-${survivor.id}`}
              type="number"
              value={survivor.courage}
              onChange={(e) =>
                saveToLocalStorage(
                  survivor.id!,
                  { courage: parseInt(e.target.value) || 0 },
                  'Courage updated.'
                )
              }
              className="text-center border-0 bg-transparent p-0 no-spinners focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
              min="0"
              max="9"
            />
          </div>
          <div className="bg-background/40 rounded-lg p-0 text-center">
            <div className="text-xs text-muted-foreground pb-1">
              Understanding
            </div>
            <Input
              id={`understanding-${survivor.id}`}
              type="number"
              value={survivor.understanding}
              onChange={(e) =>
                saveToLocalStorage(
                  survivor.id!,
                  { understanding: parseInt(e.target.value) || 0 },
                  'Understanding updated.'
                )
              }
              className="text-center border-0 bg-transparent p-0 no-spinners focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
              min="0"
              max="9"
            />
          </div>
        </div>

        {/* ARC Survivor Attributes */}
        {selectedSettlement?.survivorType === SurvivorType.ARC && (
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-background/40 rounded-lg p-0 text-center">
              <div className="text-xs text-muted-foreground pb-1">
                Systemic Pressure
              </div>
              <Input
                id={`systemicPressure-${survivor.id}`}
                type="number"
                value={survivor.systemicPressure}
                onChange={(e) =>
                  saveToLocalStorage(
                    survivor.id!,
                    { systemicPressure: parseInt(e.target.value) || 0 },
                    'Systemic pressure updated.'
                  )
                }
                className="text-center border-0 bg-transparent p-0 no-spinners focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                min="0"
              />
            </div>
            <div className="bg-background/40 rounded-lg p-0 text-center">
              <div className="text-xs text-muted-foreground pb-1">Torment</div>
              <Input
                id={`torment-${survivor.id}`}
                type="number"
                value={survivor.torment}
                onChange={(e) =>
                  saveToLocalStorage(
                    survivor.id!,
                    { torment: parseInt(e.target.value) || 0 },
                    'Torment updated.'
                  )
                }
                className="text-center border-0 bg-transparent p-0 no-spinners focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                min="0"
              />
            </div>
          </div>
        )}

        <Separator className="my-2" />

        {/* Combat and Attributes Grid */}
        <div className="grid grid-cols-[auto_1px_auto] gap-4">
          {/* Combat Attributes Column (Left) */}
          <div className="space-y-1 flex flex-col">
            <Label className="text-xs font-semibold justify-center text-muted-foreground">
              Armor & Damage
            </Label>

            {/* Brain */}
            <div className="space-y-1 flex flex-row items-center gap-2">
              <div className="relative items-center">
                <div className="h-12 w-12">
                  {/* Empty space for alignment */}
                </div>
              </div>

              <BrainIcon className="h-5 w-5" />

              <div className="flex-1"></div>

              <div className="flex flex-col items-center space-y-1">
                <Checkbox
                  id={`brain-light-${survivor.id}`}
                  checked={survivor.brainLightDamage}
                  onCheckedChange={(checked) =>
                    saveToLocalStorage(
                      survivor.id!,
                      {
                        brainLightDamage: !!checked
                      },
                      checked
                        ? 'Brain takes light damage.'
                        : 'Brain light damage cleared.'
                    )
                  }
                />
                <Label
                  htmlFor={`brain-light-${survivor.id}`}
                  className="text-xs">
                  L
                </Label>
              </div>
            </div>

            {/* Head */}
            <div className="space-y-1 flex flex-row items-center gap-2">
              <div className="relative flex items-center">
                <ShieldIcon
                  className="h-12 w-12 text-muted-foreground"
                  strokeWidth={1}
                />
                <Input
                  placeholder="1"
                  type="number"
                  className="absolute top-[50%] left-6 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 text-lg text-center p-0 bg-transparent border-none no-spinners focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                  defaultValue={survivor.headArmor ?? '0'}
                  min={0}
                  onChange={(e) =>
                    saveToLocalStorage(
                      survivor.id!,
                      { headArmor: parseInt(e.target.value) || 0 },
                      'Head armor updated.'
                    )
                  }
                />
              </div>

              <HardHatIcon className="h-5 w-5" />

              <div className="flex-1"></div>

              <div className="flex flex-col items-center space-y-1">
                <Checkbox
                  id={`head-heavy-${survivor.id}`}
                  className="border-2 border-white/40"
                  checked={survivor.headHeavyDamage}
                  onCheckedChange={(checked) =>
                    saveToLocalStorage(
                      survivor.id!,
                      {
                        headHeavyDamage: !!checked
                      },
                      checked
                        ? 'Head takes heavy damage.'
                        : 'Head heavy damage cleared.'
                    )
                  }
                />
                <Label
                  htmlFor={`head-heavy-${survivor.id}`}
                  className="text-xs">
                  H
                </Label>
              </div>
            </div>

            {/* Arm */}
            <div className="space-y-1 flex flex-row items-center gap-2">
              <div className="relative flex items-center">
                <ShieldIcon
                  className="h-12 w-12 text-muted-foreground"
                  strokeWidth={1}
                />
                <Input
                  placeholder="1"
                  type="number"
                  className="absolute top-[50%] left-6 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 text-lg text-center p-0 bg-transparent border-none no-spinners focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                  defaultValue={survivor.armArmor ?? '0'}
                  min={0}
                  onChange={(e) =>
                    saveToLocalStorage(
                      survivor.id!,
                      { armArmor: parseInt(e.target.value) || 0 },
                      'Arm armor updated.'
                    )
                  }
                />
              </div>

              <HandMetalIcon className="h-5 w-5" />

              <div className="flex-1"></div>

              <div className="flex items-center space-x-1">
                <div className="flex flex-col items-center space-y-1">
                  <Checkbox
                    id={`arm-light-${survivor.id}`}
                    checked={survivor.armLightDamage}
                    onCheckedChange={(checked) =>
                      saveToLocalStorage(
                        survivor.id!,
                        {
                          armLightDamage: !!checked
                        },
                        checked
                          ? 'Arm takes light damage.'
                          : 'Arm light damage cleared.'
                      )
                    }
                  />
                  <Label
                    htmlFor={`arm-light-${survivor.id}`}
                    className="text-xs">
                    L
                  </Label>
                </div>

                <div className="flex flex-col items-center space-y-1">
                  <Checkbox
                    id={`arm-heavy-${survivor.id}`}
                    className="border-2"
                    checked={survivor.armHeavyDamage}
                    onCheckedChange={(checked) =>
                      saveToLocalStorage(
                        survivor.id!,
                        {
                          armHeavyDamage: !!checked
                        },
                        checked
                          ? 'Arm takes heavy damage.'
                          : 'Arm heavy damage cleared.'
                      )
                    }
                  />
                  <Label
                    htmlFor={`arm-heavy-${survivor.id}`}
                    className="text-xs">
                    H
                  </Label>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="space-y-1 flex flex-row items-center gap-2">
              <div className="relative flex items-center">
                <ShieldIcon
                  className="h-12 w-12 text-muted-foreground"
                  strokeWidth={1}
                />
                <Input
                  placeholder="1"
                  type="number"
                  className="absolute top-[50%] left-6 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 text-lg text-center p-0 bg-transparent border-none no-spinners focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                  defaultValue={survivor.bodyArmor ?? '0'}
                  min={0}
                  onChange={(e) =>
                    saveToLocalStorage(
                      survivor.id!,
                      { bodyArmor: parseInt(e.target.value) || 0 },
                      'Body armor updated.'
                    )
                  }
                />
              </div>

              <ShirtIcon className="h-5 w-5" />

              <div className="flex-1"></div>

              <div className="flex items-center space-x-1">
                <div className="flex flex-col items-center space-y-1">
                  <Checkbox
                    id={`body-light-${survivor.id}`}
                    checked={survivor.bodyLightDamage}
                    onCheckedChange={(checked) =>
                      saveToLocalStorage(
                        survivor.id!,
                        {
                          bodyLightDamage: !!checked
                        },
                        checked
                          ? 'Body takes light damage.'
                          : 'Body light damage cleared.'
                      )
                    }
                  />
                  <Label
                    htmlFor={`body-light-${survivor.id}`}
                    className="text-xs">
                    L
                  </Label>
                </div>

                <div className="flex flex-col items-center space-y-1">
                  <Checkbox
                    id={`body-heavy-${survivor.id}`}
                    className="border-2"
                    checked={survivor.bodyHeavyDamage}
                    onCheckedChange={(checked) =>
                      saveToLocalStorage(
                        survivor.id!,
                        {
                          bodyHeavyDamage: !!checked
                        },
                        checked
                          ? 'Body takes heavy damage.'
                          : 'Body heavy damage cleared.'
                      )
                    }
                  />
                  <Label
                    htmlFor={`body-heavy-${survivor.id}`}
                    className="text-xs">
                    H
                  </Label>
                </div>
              </div>
            </div>

            {/* Waist */}
            <div className="space-y-1 flex flex-row items-center gap-2">
              <div className="relative flex items-center">
                <ShieldIcon
                  className="h-12 w-12 text-muted-foreground"
                  strokeWidth={1}
                />
                <Input
                  placeholder="1"
                  type="number"
                  className="absolute top-[50%] left-6 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 text-lg text-center p-0 bg-transparent border-none no-spinners focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                  defaultValue={survivor.waistArmor ?? '0'}
                  min={0}
                  onChange={(e) =>
                    saveToLocalStorage(
                      survivor.id!,
                      { waistArmor: parseInt(e.target.value) || 0 },
                      'Waist armor updated.'
                    )
                  }
                />
              </div>

              <RibbonIcon className="h-5 w-5" />

              <div className="flex-1"></div>

              <div className="flex items-center space-x-1">
                <div className="flex flex-col items-center space-y-1">
                  <Checkbox
                    id={`waist-light-${survivor.id}`}
                    checked={survivor.waistLightDamage}
                    onCheckedChange={(checked) =>
                      saveToLocalStorage(
                        survivor.id!,
                        {
                          waistLightDamage: !!checked
                        },
                        checked
                          ? 'Waist takes light damage.'
                          : 'Waist light damage cleared.'
                      )
                    }
                  />
                  <Label
                    htmlFor={`waist-light-${survivor.id}`}
                    className="text-xs">
                    L
                  </Label>
                </div>

                <div className="flex flex-col items-center space-y-1">
                  <Checkbox
                    id={`waist-heavy-${survivor.id}`}
                    className="border-2"
                    checked={survivor.waistHeavyDamage}
                    onCheckedChange={(checked) =>
                      saveToLocalStorage(
                        survivor.id!,
                        {
                          waistHeavyDamage: !!checked
                        },
                        checked
                          ? 'Waist takes heavy damage.'
                          : 'Waist heavy damage cleared.'
                      )
                    }
                  />
                  <Label
                    htmlFor={`waist-heavy-${survivor.id}`}
                    className="text-xs">
                    H
                  </Label>
                </div>
              </div>
            </div>

            {/* Leg */}
            <div className="space-y-1 flex flex-row items-center gap-2">
              <div className="relative flex items-center">
                <ShieldIcon
                  className="h-12 w-12 text-muted-foreground"
                  strokeWidth={1}
                />
                <Input
                  placeholder="1"
                  type="number"
                  className="absolute top-[50%] left-6 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 text-lg text-center p-0 bg-transparent border-none no-spinners focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                  defaultValue={survivor.legArmor ?? '0'}
                  min={0}
                  onChange={(e) =>
                    saveToLocalStorage(
                      survivor.id!,
                      { legArmor: parseInt(e.target.value) || 0 },
                      'Leg armor updated.'
                    )
                  }
                />
              </div>

              <FootprintsIcon className="h-5 w-5" />

              <div className="flex-1"></div>

              <div className="flex items-center space-x-1">
                <div className="flex flex-col items-center space-y-1">
                  <Checkbox
                    id={`leg-light-${survivor.id}`}
                    checked={survivor.legLightDamage}
                    onCheckedChange={(checked) =>
                      saveToLocalStorage(
                        survivor.id!,
                        {
                          legLightDamage: !!checked
                        },
                        checked
                          ? 'Leg takes light damage.'
                          : 'Leg light damage cleared.'
                      )
                    }
                  />
                  <Label
                    htmlFor={`leg-light-${survivor.id}`}
                    className="text-xs">
                    L
                  </Label>
                </div>

                <div className="flex flex-col items-center space-y-1">
                  <Checkbox
                    id={`leg-heavy-${survivor.id}`}
                    className="border-2"
                    checked={survivor.legHeavyDamage}
                    onCheckedChange={(checked) =>
                      saveToLocalStorage(
                        survivor.id!,
                        {
                          legHeavyDamage: !!checked
                        },
                        checked
                          ? 'Leg takes heavy damage.'
                          : 'Leg heavy damage cleared.'
                      )
                    }
                  />
                  <Label
                    htmlFor={`leg-heavy-${survivor.id}`}
                    className="text-xs">
                    H
                  </Label>
                </div>
              </div>
            </div>
          </div>

          <Separator orientation="vertical" className="h-full" />

          {/* Attributes Column (Right) */}
          <div className="flex flex-col">
            <Label className="text-xs font-semibold justify-center text-muted-foreground">
              Attributes
            </Label>

            <div className="space-y-1">
              <div className="bg-background/30 rounded p-2 flex items-center gap-3">
                <Label
                  htmlFor={`accuracy-${survivor.id}`}
                  className="text-xs text-muted-foreground min-w-[50px]">
                  Accuracy
                </Label>
                <Input
                  id={`accuracy-${survivor.id}`}
                  type="number"
                  value={survivor.accuracy}
                  onChange={(e) =>
                    saveToLocalStorage(
                      survivor.id!,
                      { accuracy: parseInt(e.target.value) || 0 },
                      'Accuracy updated.'
                    )
                  }
                  className="text-center border-0 bg-transparent p-0 no-spinners flex-1 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>

              <div className="bg-background/30 rounded p-2 flex items-center gap-3">
                <Label
                  htmlFor={`strength-${survivor.id}`}
                  className="text-xs text-muted-foreground min-w-[50px]">
                  Strength
                </Label>
                <Input
                  id={`strength-${survivor.id}`}
                  type="number"
                  value={survivor.strength}
                  onChange={(e) =>
                    saveToLocalStorage(
                      survivor.id!,
                      { strength: parseInt(e.target.value) || 0 },
                      'Strength updated.'
                    )
                  }
                  className="text-center border-0 bg-transparent p-0 no-spinners flex-1 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>

              <div className="bg-background/30 rounded p-2 flex items-center gap-3">
                <Label
                  htmlFor={`evasion-${survivor.id}`}
                  className="text-xs text-muted-foreground min-w-[50px]">
                  Evasion
                </Label>
                <Input
                  id={`evasion-${survivor.id}`}
                  type="number"
                  value={survivor.evasion}
                  onChange={(e) =>
                    saveToLocalStorage(
                      survivor.id!,
                      { evasion: parseInt(e.target.value) || 0 },
                      'Evasion updated.'
                    )
                  }
                  className="text-center border-0 bg-transparent p-0 no-spinners flex-1 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>

              <div className="bg-background/30 rounded p-2 flex items-center gap-3">
                <Label
                  htmlFor={`luck-${survivor.id}`}
                  className="text-xs text-muted-foreground min-w-[50px]">
                  Luck
                </Label>
                <Input
                  id={`luck-${survivor.id}`}
                  type="number"
                  value={survivor.luck}
                  onChange={(e) =>
                    saveToLocalStorage(
                      survivor.id!,
                      { luck: parseInt(e.target.value) || 0 },
                      'Luck updated.'
                    )
                  }
                  className="text-center border-0 bg-transparent p-0 no-spinners flex-1 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>

              <div className="bg-background/30 rounded p-2 flex items-center gap-3">
                <Label
                  htmlFor={`speed-${survivor.id}`}
                  className="text-xs text-muted-foreground min-w-[50px]">
                  Speed
                </Label>
                <Input
                  id={`speed-${survivor.id}`}
                  type="number"
                  value={survivor.speed}
                  onChange={(e) =>
                    saveToLocalStorage(
                      survivor.id!,
                      { speed: parseInt(e.target.value) || 0 },
                      'Speed updated.'
                    )
                  }
                  className="text-center border-0 bg-transparent p-0 no-spinners flex-1 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>

              {selectedSettlement?.survivorType === SurvivorType.ARC && (
                <div className="bg-background/30 rounded p-2 flex items-center gap-3">
                  <Label
                    htmlFor={`lumi-${survivor.id}`}
                    className="text-xs text-muted-foreground min-w-[50px]">
                    Lumi
                  </Label>
                  <Input
                    id={`lumi-${survivor.id}`}
                    type="number"
                    value={survivor.lumi}
                    onChange={(e) =>
                      saveToLocalStorage(
                        survivor.id!,
                        { lumi: parseInt(e.target.value) || 0 },
                        'Lumi updated.'
                      )
                    }
                    className="text-center border-0 bg-transparent p-0 no-spinners flex-1 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Special Abilities */}
        {(survivor.hasPrepared ||
          survivor.hasExplore ||
          survivor.headShatteredJaw) && (
          <>
            <Separator className="my-2" />

            <div className="space-y-1 flex flex-col">
              <Label className="text-xs font-semibold justify-center text-muted-foreground">
                Hunt Abilities
              </Label>

              {survivor.hasPrepared && (
                <div className="text-xs bg-green-50 dark:bg-green-950/30 border border-green-200/50 dark:border-green-800/30 rounded px-2 py-1">
                  <strong>Prepared:</strong> Add Hunt XP to straggler roll.
                </div>
              )}
              {survivor.hasExplore && (
                <div className="text-xs bg-blue-50 dark:bg-blue-950/30 border border-blue-200/50 dark:border-blue-800/30 rounded px-2 py-1">
                  <strong>Explore:</strong> Add +2 to your Investigate roll.
                </div>
              )}
              {survivor.headShatteredJaw && (
                <div className="text-xs bg-red-50 dark:bg-red-950/30 border border-red-200/50 dark:border-red-800/30 rounded px-2 py-1">
                  <strong>Shattered Jaw:</strong> Cannot consume or encourage.
                </div>
              )}
            </div>
          </>
        )}

        {/* Abilities and Impairments */}
        {survivor?.abilitiesAndImpairments &&
          survivor?.abilitiesAndImpairments?.length > 0 && (
            <>
              <Separator className="my-2" />

              <div className="space-y-1 flex flex-col">
                <Label className="text-xs font-semibold justify-center text-muted-foreground">
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
            </>
          )}

        {/* Once Per Lifetime */}
        {survivor?.oncePerLifetime && survivor?.oncePerLifetime?.length > 0 && (
          <>
            <Separator className="my-2" />

            <div className="space-y-1 flex flex-col">
              <Label className="text-xs font-semibold justify-center text-muted-foreground">
                Once Per Lifetime
              </Label>

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
          </>
        )}

        {/* Disorders */}
        {survivor?.disorders && survivor?.disorders.length > 0 && (
          <>
            <Separator className="my-2" />

            <div className="space-y-1 flex flex-col">
              <Label className="text-xs font-semibold justify-center text-muted-foreground">
                Disorders
              </Label>

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
          </>
        )}
      </CardContent>
    </Card>
  )
}
