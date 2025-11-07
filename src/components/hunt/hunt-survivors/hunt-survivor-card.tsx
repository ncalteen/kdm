'use client'

import { HuntSurvivorAttributes } from '@/components/hunt/hunt-survivors/hunt-survivor-attributes'
import { NumericInput } from '@/components/menu/numeric-input'
import { ArmsCard } from '@/components/survivor/combat/arms-card'
import { BodyCard } from '@/components/survivor/combat/body-card'
import { HeadCard } from '@/components/survivor/combat/head-card'
import { LegsCard } from '@/components/survivor/combat/legs-card'
import { WaistCard } from '@/components/survivor/combat/waist-card'
import { SanityCard } from '@/components/survivor/sanity/sanity-card'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
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
import { Textarea } from '@/components/ui/textarea'
import { useIsMobile } from '@/hooks/use-mobile'
import { ColorChoice, SurvivorType } from '@/lib/enums'
import {
  ERROR_MESSAGE,
  SAVE_HUNT_NOTES_MESSAGE,
  SURVIVOR_ATTRIBUTE_TOKEN_UPDATED_MESSAGE,
  SURVIVOR_BASE_ATTRIBUTE_UPDATED_MESSAGE,
  SURVIVOR_CAN_SPEND_SURVIVAL_UPDATED_MESSAGE,
  SURVIVOR_COLOR_CHANGED_MESSAGE,
  SURVIVOR_INSANITY_UPDATED_MESSAGE,
  SURVIVOR_NOT_FOUND_MESSAGE,
  SURVIVOR_SURVIVAL_UPDATED_MESSAGE
} from '@/lib/messages'
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
import { CheckIcon } from 'lucide-react'
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

  // Get current survivor's hunt details
  const survivorHuntDetails = selectedHunt?.survivorDetails?.find(
    (detail) => detail.id === survivor?.id
  )

  // State for managing notes
  const [notesDraft, setNotesDraft] = useState<string>(
    survivorHuntDetails?.notes || ''
  )
  const [isNotesDirty, setIsNotesDirty] = useState<boolean>(false)

  const form = useForm<Survivor>({
    resolver: zodResolver(SurvivorSchema) as Resolver<Survivor>,
    defaultValues: SurvivorSchema.parse(survivor || {})
  })

  // Update form values when survivor data changes
  useEffect(() => {
    if (survivor) form.reset(survivor)
  }, [survivor, form])

  // Update notes draft when survivor hunt details change
  useEffect(() => {
    setNotesDraft(survivorHuntDetails?.notes || '')
    setIsNotesDirty(false)
  }, [survivorHuntDetails?.notes])

  /**
   * Save Survivors to Local Storage
   */
  const saveToLocalStorage = (
    survivorId: number | undefined,
    updateData: Partial<Survivor>,
    successMsg?: string
  ) => {
    if (!survivors) return
    if (!survivorId) return
    if (!selectedSettlement) return

    try {
      // Get the campaign and find the survivor to update
      const campaign = getCampaign()
      const survivorIndex = campaign.survivors.findIndex(
        (s: Survivor) => s.id === survivorId
      )

      if (survivorIndex === -1) return toast.error(SURVIVOR_NOT_FOUND_MESSAGE())

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
      if (survivorId === survivor?.id)
        form.reset(SurvivorSchema.parse({ ...survivor, ...updateData }))

      // Dispatch custom event to notify other components about survivor changes
      window.dispatchEvent(new CustomEvent('campaignUpdated'))

      if (successMsg) toast.success(successMsg)
    } catch (error) {
      console.error('Hunt Survivor Save Error:', error)

      if (error instanceof ZodError && error.errors[0]?.message)
        toast.error(error.errors[0].message)
      else toast.error(ERROR_MESSAGE())
    }
  }

  /**
   * Update Survivor Color
   */
  const updateSurvivorColor = (color: ColorChoice) => {
    if (!survivor?.id || !selectedHunt) return

    const currentDetails = selectedHunt.survivorDetails || []
    const survivorDetail = currentDetails.find((sd) => sd.id === survivor.id)
    const updatedDetails = currentDetails.filter((sd) => sd.id !== survivor.id)

    updatedDetails.push({ ...survivorDetail!, color })

    saveSelectedHunt(
      { survivorDetails: updatedDetails },
      SURVIVOR_COLOR_CHANGED_MESSAGE(color)
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
  const updateSurvival = (val: string) =>
    saveToLocalStorage(
      survivor?.id,
      { survival: parseInt(val) || 0 },
      SURVIVOR_SURVIVAL_UPDATED_MESSAGE(
        survivor?.survival || 0,
        parseInt(val) || 0
      )
    )

  /**
   * Update Insanity Points
   */
  const updateInsanity = (val: string) =>
    saveToLocalStorage(
      survivor?.id,
      { insanity: parseInt(val) || 0 },
      SURVIVOR_INSANITY_UPDATED_MESSAGE(
        survivor?.insanity || 0,
        parseInt(val) || 0
      )
    )

  /**
   * Update Survivor Can Spend Survival
   */
  const updateSurvivorCanSpendSurvival = (val: boolean) =>
    saveToLocalStorage(
      survivor?.id,
      { canSpendSurvival: val },
      SURVIVOR_CAN_SPEND_SURVIVAL_UPDATED_MESSAGE(val)
    )

  /**
   * Save Survivor Base Attribute
   */
  const saveSurvivorBaseAttribute = (
    attributeName: keyof Survivor,
    value: number | boolean
  ) => {
    if (!survivor?.id) return

    saveToLocalStorage(
      survivor.id,
      { [attributeName]: value },
      SURVIVOR_BASE_ATTRIBUTE_UPDATED_MESSAGE(attributeName)
    )
  }

  /**
   * Save Survivor Attribute Token
   */
  const saveAttributeToken = (attributeName: string, value: number) => {
    if (!survivor?.id || !selectedHunt?.survivorDetails) return

    saveSelectedHunt(
      {
        survivorDetails: selectedHunt.survivorDetails.map((detail) =>
          detail.id === survivor.id
            ? { ...detail, [attributeName]: value }
            : detail
        )
      },
      SURVIVOR_ATTRIBUTE_TOKEN_UPDATED_MESSAGE(attributeName)
    )
  }

  /**
   * Handle Save Notes
   */
  const handleSaveNotes = () => {
    if (!survivor?.id || !selectedHunt?.survivorDetails) return

    setIsNotesDirty(false)

    // Update or add the notes to the survivor's hunt details
    const updatedDetails = selectedHunt.survivorDetails.map((detail) =>
      detail.id === survivor.id ? { ...detail, notes: notesDraft } : detail
    )

    saveSelectedHunt(
      { survivorDetails: updatedDetails },
      SAVE_HUNT_NOTES_MESSAGE()
    )
  }

  if (!survivor) return <></>

  return (
    <Card
      className="w-full min-w-[430px] flex-grow-2 border-2 rounded-xl py-0 pb-2 gap-2 transition-all duration-200 hover:shadow-lg"
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

          {/* Cannot Spend Survival */}
          <div className="flex items-center space-x-1">
            <Checkbox
              id={`cannotSpendSurvival-${survivor.id}`}
              checked={!survivor.canSpendSurvival}
              onCheckedChange={(checked) =>
                updateSurvivorCanSpendSurvival(!checked)
              }
              className="h-4 w-4"
            />
            <Label
              htmlFor={`cannotSpendSurvival-${survivor.id}`}
              className="text-xs">
              Can&apos;t Spend Survival
            </Label>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col p-3 py-0 mt-0 gap-1">
        {/* Hunt XP, Courage, and Understanding */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-background/60 rounded text-center text-sm">
            <div className="text-xs text-muted-foreground pb-1">Hunt XP</div>
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
          <>
            <Separator className="my-2" />

            <div className="grid grid-cols-3 gap-2">
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
                <div className="text-xs text-muted-foreground pb-1">
                  Torment
                </div>
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
              <div className="bg-background/40 rounded-lg p-0 text-center">
                <div className="text-xs text-muted-foreground pb-1">Lumi</div>
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
                    className="text-center border-0 bg-transparent p-0 no-spinners focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                    min="0"
                    name={`lumi-${survivor.id}`}
                  />
                </NumericInput>
              </div>
            </div>
          </>
        )}

        <Separator className="my-2" />

        {/* Combat and Attributes Grid */}
        <div className="flex flex-col lg:flex-row lg:gap-2">
          {/* Base Attributes */}
          <HuntSurvivorAttributes
            survivor={survivor}
            selectedHunt={selectedHunt}
            selectedSettlement={selectedSettlement}
            isMobile={isMobile}
            updateSurvival={updateSurvival}
            updateInsanity={updateInsanity}
            saveAttributeToken={saveAttributeToken}
            saveSurvivorBaseAttribute={saveSurvivorBaseAttribute}
          />

          {/* Non-Mobile Separator */}
          <div className="hidden lg:flex lg:items-stretch">
            <Separator orientation="vertical" className="mx-2" />
          </div>

          {/* Mobile Separator */}
          <Separator className="my-2 lg:hidden" />

          {/* Combat Attributes */}
          <div className="flex flex-col flex-1">
            <div className="space-y-1 flex flex-col">
              {/* Brain */}
              <SanityCard
                displayText={false}
                displayTormentInput={false}
                saveSelectedSurvivor={(
                  updateData: Partial<Survivor>,
                  successMsg: string
                ) => saveToLocalStorage(survivor.id!, updateData, successMsg)}
                selectedSurvivor={selectedSurvivor}
                selectedSettlement={selectedSettlement}
              />

              {/* Head */}
              <HeadCard
                saveSelectedSurvivor={(
                  updateData: Partial<Survivor>,
                  successMsg: string
                ) => saveToLocalStorage(survivor.id!, updateData, successMsg)}
                selectedSurvivor={selectedSurvivor}
              />

              {/* Arm */}
              <ArmsCard
                saveSelectedSurvivor={(
                  updateData: Partial<Survivor>,
                  successMsg: string
                ) => saveToLocalStorage(survivor.id!, updateData, successMsg)}
                selectedSurvivor={selectedSurvivor}
              />

              {/* Body */}
              <BodyCard
                saveSelectedSurvivor={(
                  updateData: Partial<Survivor>,
                  successMsg: string
                ) => saveToLocalStorage(survivor.id!, updateData, successMsg)}
                selectedSurvivor={selectedSurvivor}
              />

              {/* Waist */}
              <WaistCard
                saveSelectedSurvivor={(
                  updateData: Partial<Survivor>,
                  successMsg: string
                ) => saveToLocalStorage(survivor.id!, updateData, successMsg)}
                selectedSurvivor={selectedSurvivor}
              />

              {/* Leg */}
              <LegsCard
                saveSelectedSurvivor={(
                  updateData: Partial<Survivor>,
                  successMsg: string
                ) => saveToLocalStorage(survivor.id!, updateData, successMsg)}
                selectedSurvivor={selectedSurvivor}
              />
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

        <Separator className="my-2" />

        {/* Hunt Notes Section */}
        <div className="flex flex-col gap-2">
          <Textarea
            value={notesDraft}
            name="hunt-survivor-notes"
            id={`hunt-survivor-notes-${survivor.id}`}
            onChange={(e) => {
              setNotesDraft(e.target.value)
              setIsNotesDirty(e.target.value !== survivorHuntDetails?.notes)
            }}
            placeholder="Add hunt notes..."
            className="w-full resize-none text-xs font-normal"
            style={{ minHeight: '125px' }}
          />
          <div className="flex justify-end">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={handleSaveNotes}
              disabled={!isNotesDirty}
              title="Save hunt notes">
              <CheckIcon className="h-4 w-4" />
              Save
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
