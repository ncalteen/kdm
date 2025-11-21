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
import { ColorChoice, SurvivorCardMode } from '@/lib/enums'
import {
  SHOWDOWN_NOTES_SAVED_MESSAGE,
  SURVIVOR_COLOR_CHANGED_MESSAGE
} from '@/lib/messages'
import { getCardColorStyles, getColorStyle } from '@/lib/utils'
import { Settlement } from '@/schemas/settlement'
import { Showdown } from '@/schemas/showdown'
import { Survivor, SurvivorSchema } from '@/schemas/survivor'
import { zodResolver } from '@hookform/resolvers/zod'
import { AvatarFallback } from '@radix-ui/react-avatar'
import { CheckIcon } from 'lucide-react'
import { ReactElement, useEffect, useState } from 'react'
import { Resolver, useForm } from 'react-hook-form'

/**
 * Showdown Survivor Card Component
 */
interface ShowdownSurvivorCardProps {
  /** Save Selected Showdown */
  saveSelectedShowdown: (
    updateData: Partial<Showdown>,
    successMsg?: string
  ) => void
  /** Save Selected Survivor */
  saveSelectedSurvivor: (
    updateData: Partial<Survivor>,
    successMsg?: string
  ) => void
  /** Selected Settlement */
  selectedSettlement: Partial<Settlement> | null
  /** Selected Showdown */
  selectedShowdown: Partial<Showdown> | null
  /** Selected Survivor */
  selectedSurvivor: Survivor | null
  /** Set Survivors */
  setSurvivors: (survivors: Survivor[]) => void
  /** Survivor */
  survivor: Partial<Survivor> | null
  /** Survivors */
  survivors: Survivor[] | null
}

/**
 * Survivor Card Component
 *
 * Displays updatable survivor information for showdown
 */
export function ShowdownSurvivorCard({
  saveSelectedShowdown,
  saveSelectedSurvivor,
  selectedSettlement,
  selectedShowdown,
  selectedSurvivor,
  setSurvivors,
  survivor,
  survivors
}: ShowdownSurvivorCardProps): ReactElement {
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
      SHOWDOWN_NOTES_SAVED_MESSAGE()
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
          <div className="font-semibold text-sm truncate">
            {survivor.name}{' '}
            {selectedShowdown?.scout === survivor.id && (
              <Badge variant="secondary" className="mt-1 text-xs">
                Scout
              </Badge>
            )}
          </div>
          <div className="text-xs text-muted-foreground">{survivor.gender}</div>
        </div>
      </CardHeader>

      <CardContent className="px-2">
        <SurvivorCard
          mode={SurvivorCardMode.SHOWDOWN_CARD}
          saveSelectedShowdown={saveSelectedShowdown}
          saveSelectedSurvivor={saveSelectedSurvivor}
          selectedSettlement={selectedSettlement}
          selectedShowdown={selectedShowdown}
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
