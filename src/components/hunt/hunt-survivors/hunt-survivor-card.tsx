'use client'

import { NumericInput } from '@/components/menu/numeric-input'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { useIsMobile } from '@/hooks/use-mobile'
import { ColorChoice, SurvivorType } from '@/lib/enums'
import {
  getCampaign,
  getCardColorStyles,
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
import { ReactElement, useEffect, useState } from 'react'
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
  const isMobile = useIsMobile()

  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false)

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

      // Dispatch custom event to notify other components about survivor changes
      window.dispatchEvent(new CustomEvent('campaignUpdated'))

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

    const currentDetails = selectedHunt.survivorDetails || []
    const updatedDetails = currentDetails.filter((sd) => sd.id !== survivor.id)
    updatedDetails.push({ id: survivor.id, color })

    saveSelectedHunt(
      { survivorDetails: updatedDetails },
      `Survivor color changed to ${color}.`
    )
  }

  /**
   * Get Current Survivor Color
   */
  const getCurrentColor = (): ColorChoice => {
    if (!survivor?.id || !selectedHunt?.survivorDetails)
      return ColorChoice.SLATE

    const survivorDetail = selectedHunt.survivorDetails.find(
      (sc) => sc.id === survivor.id
    )

    return survivorDetail?.color || ColorChoice.SLATE
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
    <Card
      className="min-w-[300px] flex-grow-2 border-2 rounded-xl py-0 pb-2 gap-2 transition-all duration-200 hover:shadow-lg font-bold"
      style={{
        ...getCardColorStyles(getCurrentColor()),
        borderColor: 'var(--card-border-color)'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--card-border-hover-color)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--card-border-color)'
      }}>
      <CardHeader
        className="flex items-center gap-3 p-3 rounded-t-lg border-b"
        style={{ backgroundColor: 'var(--card-header-bg)' }}>
        <Popover open={isColorPickerOpen} onOpenChange={setIsColorPickerOpen}>
          <PopoverTrigger asChild>
            {/* Header with Avatar and Name */}
            <Avatar
              className={`h-12 w-12 border-2 ${getColorStyle(getCurrentColor(), 'bg')} items-center justify-center cursor-pointer`}
              onClick={() => setIsColorPickerOpen(true)}
              onContextMenu={(e) => {
                e.preventDefault() // Prevent default right-click menu
                setIsColorPickerOpen(true)
              }}>
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
          </PopoverTrigger>
          <PopoverContent className="w-64 p-2">
            <div className="grid grid-cols-6 gap-1">
              {Object.values(ColorChoice).map((color) => {
                const isSelected = getCurrentColor() === color
                return (
                  <button
                    key={color}
                    className={`h-8 w-8 rounded-full border-2 ${getColorStyle(color, 'bg')} ${
                      isSelected
                        ? 'border-white ring-2 ring-black'
                        : 'border-gray-300 hover:border-white'
                    } transition-all duration-200`}
                    onClick={() => {
                      updateSurvivorColor(color)
                      setIsColorPickerOpen(false)
                    }}
                    title={color.charAt(0).toUpperCase() + color.slice(1)}
                  />
                )
              })}
            </div>
          </PopoverContent>
        </Popover>

        <div className="text-left flex-1 min-w-0">
          <div className="font-semibold text-sm truncate">{survivor.name}</div>
          <div className="text-xs text-muted-foreground">{survivor.gender}</div>
          {/* Scout Badge */}
          {selectedHunt?.scout === survivor.id && (
            <Badge variant="secondary" className="mt-1 text-xs">
              Scout
            </Badge>
          )}
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
          <NumericInput
            label="Hunt XP"
            value={survivor.huntXP ?? 0}
            onChange={(value) =>
              saveToLocalStorage(
                survivor.id!,
                { huntXP: value },
                'Hunt XP updated successfully.'
              )
            }
            min={0}
            max={16}
            readOnly={false}>
            <Input
              id={`hunt-xp-${survivor.id}`}
              type="number"
              value={survivor.huntXP}
              readOnly={isMobile}
              onChange={(e) =>
                saveToLocalStorage(
                  survivor.id!,
                  { huntXP: parseInt(e.target.value) || 0 },
                  'Hunt XP updated successfully.'
                )
              }
              className="text-center border-0 bg-transparent p-0 no-spinners focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
              min="0"
              max="16"
              name={`hunt-xp-${survivor.id}`}
            />
          </NumericInput>
        </div>

        {/* Movement, Survival, and Insanity */}
        <div className="grid grid-cols-3 gap-0">
          <div className="bg-background/40 rounded-lg p-1 text-center">
            <div className="text-xs text-muted-foreground pb-1">Movement</div>
            <NumericInput
              label="Movement"
              value={survivor.movement ?? 0}
              onChange={(value) =>
                saveToLocalStorage(
                  survivor.id!,
                  { movement: value },
                  'Movement updated.'
                )
              }
              min={0}
              readOnly={false}>
              <Input
                id={`movement-${survivor.id}`}
                type="number"
                value={survivor.movement}
                readOnly={isMobile}
                onChange={(e) =>
                  saveToLocalStorage(
                    survivor.id!,
                    { movement: parseInt(e.target.value) || 0 },
                    'Movement updated.'
                  )
                }
                className="text-center border-0 bg-transparent p-0 no-spinners focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                min="0"
                name={`movement-${survivor.id}`}
              />
            </NumericInput>
          </div>
          <div className="bg-background/40 rounded-lg p-1 text-center">
            <div className="text-xs text-muted-foreground pb-1">Survival</div>
            <NumericInput
              label="Survival"
              value={survivor.survival ?? 0}
              onChange={(value) => updateSurvival(value.toString())}
              min={0}
              max={selectedSettlement?.survivalLimit || 1}
              readOnly={false}>
              <Input
                id={`survival-${survivor.id}`}
                type="number"
                value={survivor.survival}
                readOnly={isMobile}
                onChange={(e) => updateSurvival(e.target.value)}
                className={`text-center border-0 p-0 no-spinners focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 ${
                  !survivor.canSpendSurvival
                    ? 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                    : 'bg-transparent'
                }`}
                min="0"
                max={selectedSettlement?.survivalLimit || 1}
                name={`survival-${survivor.id}`}
              />
            </NumericInput>
          </div>
          <div className="bg-background/40 rounded-lg p-1 text-center">
            <div className="text-xs text-muted-foreground pb-1">Insanity</div>
            <NumericInput
              label="Insanity"
              value={survivor.insanity ?? 0}
              onChange={(value) => updateInsanity(value.toString())}
              min={0}
              readOnly={false}>
              <Input
                id={`insanity-${survivor.id}`}
                type="number"
                value={survivor.insanity}
                readOnly={isMobile}
                onChange={(e) => updateInsanity(e.target.value)}
                className="text-center border-0 bg-transparent p-0 no-spinners focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                min="0"
                name={`insanity-${survivor.id}`}
              />
            </NumericInput>
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
            <NumericInput
              label="Courage"
              value={survivor.courage ?? 0}
              onChange={(value) =>
                saveToLocalStorage(
                  survivor.id!,
                  { courage: value },
                  'Courage updated.'
                )
              }
              min={0}
              max={9}
              readOnly={false}>
              <Input
                id={`courage-${survivor.id}`}
                type="number"
                value={survivor.courage}
                readOnly={isMobile}
                onChange={(e) =>
                  saveToLocalStorage(
                    survivor.id!,
                    { courage: parseInt(e.target.value) || 0 },
                    'Courage updated.'
                  )
                }
                className="text-center border-0 bg-transparent p-0 no-spinners focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                min="0"
                name={`courage-${survivor.id}`}
              />
            </NumericInput>
          </div>
          <div className="bg-background/40 rounded-lg p-0 text-center">
            <div className="text-xs text-muted-foreground pb-1">
              Understanding
            </div>
            <NumericInput
              label="Understanding"
              value={survivor.understanding ?? 0}
              onChange={(value) =>
                saveToLocalStorage(
                  survivor.id!,
                  { understanding: value },
                  'Understanding updated.'
                )
              }
              min={0}
              max={9}
              readOnly={false}>
              <Input
                id={`understanding-${survivor.id}`}
                type="number"
                value={survivor.understanding}
                readOnly={isMobile}
                onChange={(e) =>
                  saveToLocalStorage(
                    survivor.id!,
                    { understanding: parseInt(e.target.value) || 0 },
                    'Understanding updated.'
                  )
                }
                className="text-center border-0 bg-transparent p-0 no-spinners focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                min="0"
                name={`understanding-${survivor.id}`}
              />
            </NumericInput>
          </div>
        </div>

        {/* ARC Survivor Attributes */}
        {selectedSettlement?.survivorType === SurvivorType.ARC && (
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-background/40 rounded-lg p-0 text-center">
              <div className="text-xs text-muted-foreground pb-1">
                Systemic Pressure
              </div>
              <NumericInput
                label="Systemic Pressure"
                value={survivor.systemicPressure ?? 0}
                onChange={(value) =>
                  saveToLocalStorage(
                    survivor.id!,
                    { systemicPressure: value },
                    'Systemic pressure updated.'
                  )
                }
                min={0}
                readOnly={false}>
                <Input
                  id={`systemicPressure-${survivor.id}`}
                  type="number"
                  value={survivor.systemicPressure}
                  readOnly={isMobile}
                  onChange={(e) =>
                    saveToLocalStorage(
                      survivor.id!,
                      { systemicPressure: parseInt(e.target.value) || 0 },
                      'Systemic pressure updated.'
                    )
                  }
                  className="text-center border-0 bg-transparent p-0 no-spinners focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                  min="0"
                  name={`systemicPressure-${survivor.id}`}
                />
              </NumericInput>
            </div>
            <div className="bg-background/40 rounded-lg p-0 text-center">
              <div className="text-xs text-muted-foreground pb-1">Torment</div>
              <NumericInput
                label="Torment"
                value={survivor.torment ?? 0}
                onChange={(value) =>
                  saveToLocalStorage(
                    survivor.id!,
                    { torment: value },
                    'Torment updated.'
                  )
                }
                min={0}
                readOnly={false}>
                <Input
                  id={`torment-${survivor.id}`}
                  type="number"
                  value={survivor.torment}
                  readOnly={isMobile}
                  onChange={(e) =>
                    saveToLocalStorage(
                      survivor.id!,
                      { torment: parseInt(e.target.value) || 0 },
                      'Torment updated.'
                    )
                  }
                  className="text-center border-0 bg-transparent p-0 no-spinners focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                  min="0"
                  name={`torment-${survivor.id}`}
                />
              </NumericInput>
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
                <NumericInput
                  label="Head Armor"
                  value={survivor.headArmor ?? 0}
                  onChange={(value) =>
                    saveToLocalStorage(
                      survivor.id!,
                      { headArmor: value },
                      'Head armor updated.'
                    )
                  }
                  min={0}
                  readOnly={false}>
                  <Input
                    id={`head-armor-${survivor.id}`}
                    placeholder="1"
                    type="number"
                    className="absolute top-[50%] left-6 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 text-lg text-center p-0 bg-transparent border-none no-spinners focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                    value={survivor.headArmor ?? '0'}
                    min={0}
                    readOnly={isMobile}
                    onChange={(e) =>
                      saveToLocalStorage(
                        survivor.id!,
                        { headArmor: parseInt(e.target.value) || 0 },
                        'Head armor updated.'
                      )
                    }
                    name={`head-armor-${survivor.id}`}
                  />
                </NumericInput>
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
                <NumericInput
                  label="Arm Armor"
                  value={survivor.armArmor ?? 0}
                  onChange={(value) =>
                    saveToLocalStorage(
                      survivor.id!,
                      { armArmor: value },
                      'Arm armor updated.'
                    )
                  }
                  min={0}
                  readOnly={false}>
                  <Input
                    id={`arm-armor-${survivor.id}`}
                    placeholder="1"
                    type="number"
                    className="absolute top-[50%] left-6 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 text-lg text-center p-0 bg-transparent border-none no-spinners focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                    value={survivor.armArmor ?? '0'}
                    min={0}
                    readOnly={isMobile}
                    onChange={(e) =>
                      saveToLocalStorage(
                        survivor.id!,
                        { armArmor: parseInt(e.target.value) || 0 },
                        'Arm armor updated.'
                      )
                    }
                    name={`arm-armor-${survivor.id}`}
                  />
                </NumericInput>
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
                <NumericInput
                  label="Body Armor"
                  value={survivor.bodyArmor ?? 0}
                  onChange={(value) =>
                    saveToLocalStorage(
                      survivor.id!,
                      { bodyArmor: value },
                      'Body armor updated.'
                    )
                  }
                  min={0}
                  readOnly={false}>
                  <Input
                    id={`body-armor-${survivor.id}`}
                    placeholder="1"
                    type="number"
                    className="absolute top-[50%] left-6 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 text-lg text-center p-0 bg-transparent border-none no-spinners focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                    value={survivor.bodyArmor ?? '0'}
                    min={0}
                    readOnly={isMobile}
                    onChange={(e) =>
                      saveToLocalStorage(
                        survivor.id!,
                        { bodyArmor: parseInt(e.target.value) || 0 },
                        'Body armor updated.'
                      )
                    }
                    name={`body-armor-${survivor.id}`}
                  />
                </NumericInput>
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
                <NumericInput
                  label="Waist Armor"
                  value={survivor.waistArmor ?? 0}
                  onChange={(value) =>
                    saveToLocalStorage(
                      survivor.id!,
                      { waistArmor: value },
                      'Waist armor updated.'
                    )
                  }
                  min={0}
                  readOnly={false}>
                  <Input
                    id={`waist-armor-${survivor.id}`}
                    placeholder="1"
                    type="number"
                    className="absolute top-[50%] left-6 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 text-lg text-center p-0 bg-transparent border-none no-spinners focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                    value={survivor.waistArmor ?? '0'}
                    min={0}
                    readOnly={isMobile}
                    onChange={(e) =>
                      saveToLocalStorage(
                        survivor.id!,
                        { waistArmor: parseInt(e.target.value) || 0 },
                        'Waist armor updated.'
                      )
                    }
                    name={`waist-armor-${survivor.id}`}
                  />
                </NumericInput>
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
                <NumericInput
                  label="Leg Armor"
                  value={survivor.legArmor ?? 0}
                  onChange={(value) =>
                    saveToLocalStorage(
                      survivor.id!,
                      { legArmor: value },
                      'Leg armor updated.'
                    )
                  }
                  min={0}
                  readOnly={false}>
                  <Input
                    id={`leg-armor-${survivor.id}`}
                    placeholder="1"
                    type="number"
                    className="absolute top-[50%] left-6 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 text-lg text-center p-0 bg-transparent border-none no-spinners focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                    value={survivor.legArmor ?? '0'}
                    min={0}
                    readOnly={isMobile}
                    onChange={(e) =>
                      saveToLocalStorage(
                        survivor.id!,
                        { legArmor: parseInt(e.target.value) || 0 },
                        'Leg armor updated.'
                      )
                    }
                    name={`leg-armor-${survivor.id}`}
                  />
                </NumericInput>
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
                <NumericInput
                  label="Accuracy"
                  value={survivor.accuracy ?? 0}
                  onChange={(value) =>
                    saveToLocalStorage(
                      survivor.id!,
                      { accuracy: value },
                      'Accuracy updated.'
                    )
                  }
                  readOnly={false}>
                  <Input
                    id={`accuracy-${survivor.id}`}
                    type="number"
                    value={survivor.accuracy}
                    readOnly={isMobile}
                    onChange={(e) =>
                      saveToLocalStorage(
                        survivor.id!,
                        { accuracy: parseInt(e.target.value) || 0 },
                        'Accuracy updated.'
                      )
                    }
                    className="text-center border-0 bg-transparent p-0 no-spinners flex-1 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                    name={`accuracy-${survivor.id}`}
                  />
                </NumericInput>
              </div>

              <div className="bg-background/30 rounded p-2 flex items-center gap-3">
                <Label
                  htmlFor={`strength-${survivor.id}`}
                  className="text-xs text-muted-foreground min-w-[50px]">
                  Strength
                </Label>
                <NumericInput
                  label="Strength"
                  value={survivor.strength ?? 0}
                  onChange={(value) =>
                    saveToLocalStorage(
                      survivor.id!,
                      { strength: value },
                      'Strength updated.'
                    )
                  }
                  readOnly={false}>
                  <Input
                    id={`strength-${survivor.id}`}
                    type="number"
                    value={survivor.strength}
                    readOnly={isMobile}
                    onChange={(e) =>
                      saveToLocalStorage(
                        survivor.id!,
                        { strength: parseInt(e.target.value) || 0 },
                        'Strength updated.'
                      )
                    }
                    className="text-center border-0 bg-transparent p-0 no-spinners flex-1 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                    name={`strength-${survivor.id}`}
                  />
                </NumericInput>
              </div>

              <div className="bg-background/30 rounded p-2 flex items-center gap-3">
                <Label
                  htmlFor={`evasion-${survivor.id}`}
                  className="text-xs text-muted-foreground min-w-[50px]">
                  Evasion
                </Label>
                <NumericInput
                  label="Evasion"
                  value={survivor.evasion ?? 0}
                  onChange={(value) =>
                    saveToLocalStorage(
                      survivor.id!,
                      { evasion: value },
                      'Evasion updated.'
                    )
                  }
                  readOnly={false}>
                  <Input
                    id={`evasion-${survivor.id}`}
                    type="number"
                    value={survivor.evasion}
                    readOnly={isMobile}
                    onChange={(e) =>
                      saveToLocalStorage(
                        survivor.id!,
                        { evasion: parseInt(e.target.value) || 0 },
                        'Evasion updated.'
                      )
                    }
                    className="text-center border-0 bg-transparent p-0 no-spinners flex-1 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                    name={`evasion-${survivor.id}`}
                  />
                </NumericInput>
              </div>

              <div className="bg-background/30 rounded p-2 flex items-center gap-3">
                <Label
                  htmlFor={`luck-${survivor.id}`}
                  className="text-xs text-muted-foreground min-w-[50px]">
                  Luck
                </Label>
                <NumericInput
                  label="Luck"
                  value={survivor.luck ?? 0}
                  onChange={(value) =>
                    saveToLocalStorage(
                      survivor.id!,
                      { luck: value },
                      'Luck updated.'
                    )
                  }
                  readOnly={false}>
                  <Input
                    id={`luck-${survivor.id}`}
                    type="number"
                    value={survivor.luck}
                    readOnly={isMobile}
                    onChange={(e) =>
                      saveToLocalStorage(
                        survivor.id!,
                        { luck: parseInt(e.target.value) || 0 },
                        'Luck updated.'
                      )
                    }
                    className="text-center border-0 bg-transparent p-0 no-spinners flex-1 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                    name={`luck-${survivor.id}`}
                  />
                </NumericInput>
              </div>

              <div className="bg-background/30 rounded p-2 flex items-center gap-3">
                <Label
                  htmlFor={`speed-${survivor.id}`}
                  className="text-xs text-muted-foreground min-w-[50px]">
                  Speed
                </Label>
                <NumericInput
                  label="Speed"
                  value={survivor.speed ?? 0}
                  onChange={(value) =>
                    saveToLocalStorage(
                      survivor.id!,
                      { speed: value },
                      'Speed updated.'
                    )
                  }
                  readOnly={false}>
                  <Input
                    id={`speed-${survivor.id}`}
                    type="number"
                    value={survivor.speed}
                    readOnly={isMobile}
                    onChange={(e) =>
                      saveToLocalStorage(
                        survivor.id!,
                        { speed: parseInt(e.target.value) || 0 },
                        'Speed updated.'
                      )
                    }
                    className="text-center border-0 bg-transparent p-0 no-spinners flex-1 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                    name={`speed-${survivor.id}`}
                  />
                </NumericInput>
              </div>

              {selectedSettlement?.survivorType === SurvivorType.ARC && (
                <div className="bg-background/30 rounded p-2 flex items-center gap-3">
                  <Label
                    htmlFor={`lumi-${survivor.id}`}
                    className="text-xs text-muted-foreground min-w-[50px]">
                    Lumi
                  </Label>
                  <NumericInput
                    label="Lumi"
                    value={survivor.lumi ?? 0}
                    onChange={(value) =>
                      saveToLocalStorage(
                        survivor.id!,
                        { lumi: value },
                        'Lumi updated.'
                      )
                    }
                    min={0}
                    readOnly={false}>
                    <Input
                      id={`lumi-${survivor.id}`}
                      type="number"
                      value={survivor.lumi}
                      readOnly={isMobile}
                      onChange={(e) =>
                        saveToLocalStorage(
                          survivor.id!,
                          { lumi: parseInt(e.target.value) || 0 },
                          'Lumi updated.'
                        )
                      }
                      className="text-center border-0 bg-transparent p-0 no-spinners flex-1 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                      name={`lumi-${survivor.id}`}
                    />
                  </NumericInput>
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

        {/* Cursed Gear */}
        {survivor?.cursedGear && survivor?.cursedGear?.length > 0 && (
          <>
            <Separator className="my-2" />

            <div className="space-y-1 flex flex-col">
              <Label className="text-xs font-semibold justify-center text-muted-foreground">
                Cursed Gear
              </Label>

              <div className="space-y-1">
                {survivor.cursedGear.map((item, index) => (
                  <div
                    key={index}
                    className="text-xs bg-green-50 dark:bg-green-950/30 border border-green-200/50 dark:border-green-800/30 rounded px-2 py-1">
                    {item}
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
