'use client'

import { SurvivorCard } from '@/components/survivor/survivor-card'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { useIsMobile } from '@/hooks/use-mobile'
import { ColorChoice } from '@/lib/enums'
import {
  ERROR_MESSAGE,
  HUNT_NOTES_SAVED_MESSAGE,
  SURVIVOR_CAN_SPEND_SURVIVAL_UPDATED_MESSAGE,
  SURVIVOR_COLOR_CHANGED_MESSAGE,
  SURVIVOR_NOT_FOUND_MESSAGE
} from '@/lib/messages'
import {
  getCampaign,
  getCardColorStyles,
  getColorStyle,
  saveCampaignToLocalStorage
} from '@/lib/utils'
import { Settlement } from '@/schemas/settlement'
import { Showdown } from '@/schemas/showdown'
import { Survivor, SurvivorSchema } from '@/schemas/survivor'
import { zodResolver } from '@hookform/resolvers/zod'
import { AvatarFallback } from '@radix-ui/react-avatar'
import { CheckIcon } from 'lucide-react'
import { ReactElement, useEffect, useState } from 'react'
import { Resolver, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { ZodError } from 'zod'

/**
 * Showdown Survivor Card Component
 */
interface ShowdownSurvivorCardProps {
  /** Save Selected Showdown */
  saveSelectedShowdown: (
    updateData: Partial<Showdown>,
    successMsg?: string
  ) => void
  /** Selected Showdown */
  selectedShowdown: Partial<Showdown> | null
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
 * Displays updatable survivor information for showdown
 */
export function ShowdownSurvivorCard({
  saveSelectedShowdown,
  selectedShowdown,
  selectedSettlement,
  selectedSurvivor,
  setSurvivors,
  survivor,
  survivors,
  updateSelectedSurvivor
}: ShowdownSurvivorCardProps): ReactElement {
  const isMobile = useIsMobile()

  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false)

  // Get current survivor's showdown details
  const survivorShowdownDetails = selectedShowdown?.survivorDetails?.find(
    (detail) => detail.id === survivor?.id
  )

  // State for managing notes
  const [notesDraft, setNotesDraft] = useState<string>(
    survivorShowdownDetails?.notes || ''
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

  // Update notes draft when survivor showdown details change
  useEffect(() => {
    setNotesDraft(survivorShowdownDetails?.notes || '')
    setIsNotesDirty(false)
  }, [survivorShowdownDetails?.notes])

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
      console.error('Showdown Survivor Save Error:', error)

      if (error instanceof ZodError && error.errors[0]?.message)
        toast.error(error.errors[0].message)
      else toast.error(ERROR_MESSAGE())
    }
  }

  /**
   * Update Survivor Color
   */
  const updateSurvivorColor = (color: ColorChoice) => {
    if (!survivor?.id || !selectedShowdown) return

    const currentDetails = selectedShowdown.survivorDetails || []
    const survivorDetail = currentDetails.find((sd) => sd.id === survivor.id)
    const updatedDetails = currentDetails.filter((sd) => sd.id !== survivor.id)

    updatedDetails.push({ ...survivorDetail!, color })

    saveSelectedShowdown(
      { survivorDetails: updatedDetails },
      SURVIVOR_COLOR_CHANGED_MESSAGE(color)
    )
  }

  /**
   * Get Current Survivor Color
   */
  const getCurrentColor = (): ColorChoice => {
    if (!survivor?.id || !selectedShowdown?.survivorDetails)
      return ColorChoice.SLATE

    const survivorDetail = selectedShowdown.survivorDetails.find(
      (sc) => sc.id === survivor.id
    )

    return survivorDetail?.color || ColorChoice.SLATE
  }

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
   * Handle Save Notes
   */
  const handleSaveNotes = () => {
    if (!survivor?.id || !selectedShowdown?.survivorDetails) return

    setIsNotesDirty(false)

    // Update or add the notes to the survivor's showdown details
    const updatedDetails = selectedShowdown.survivorDetails.map((detail) =>
      detail.id === survivor.id ? { ...detail, notes: notesDraft } : detail
    )

    saveSelectedShowdown(
      { survivorDetails: updatedDetails },
      HUNT_NOTES_SAVED_MESSAGE()
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
          {selectedShowdown?.scout === survivor.id && (
            <Badge variant="secondary" className="mt-1 text-xs">
              Scout
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="px-2">
        <SurvivorCard
          saveSelectedSurvivor={() => {}}
          selectedSettlement={selectedSettlement}
          selectedSurvivor={selectedSurvivor}
          setSurvivors={setSurvivors}
          survivors={survivors}
        />

        <Separator className="my-2" />

        {/* Showdown Notes Section */}
        <div className="flex flex-col gap-2">
          <Textarea
            value={notesDraft}
            name="showdown-survivor-notes"
            id={`showdown-survivor-notes-${survivor.id}`}
            onChange={(e) => {
              setNotesDraft(e.target.value)
              setIsNotesDirty(e.target.value !== survivorShowdownDetails?.notes)
            }}
            placeholder="Add showdown notes..."
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
              title="Save showdown notes">
              <CheckIcon className="h-4 w-4" />
              Save
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
