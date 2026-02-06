'use client'

import { SurvivorCard } from '@/components/survivor/survivor-card'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { SurvivorCardMode } from '@/lib/enums'
import { HUNT_NOTES_SAVED_MESSAGE } from '@/lib/messages'
import { getCardColorStyles, getColorStyle } from '@/lib/utils'
import { Hunt } from '@/schemas/hunt'
import { Settlement } from '@/schemas/settlement'
import { Survivor, SurvivorSchema } from '@/schemas/survivor'
import { zodResolver } from '@hookform/resolvers/zod'
import { AvatarFallback } from '@radix-ui/react-avatar'
import { CheckIcon } from 'lucide-react'
import { ReactElement, useEffect, useRef, useState } from 'react'
import { Resolver, useForm } from 'react-hook-form'

/**
 * Hunt Survivor Card Component
 */
interface HuntSurvivorCardProps {
  /** Save Selected Hunt */
  saveSelectedHunt: (updateData: Partial<Hunt>, successMsg?: string) => void
  /** Save Selected Survivor */
  saveSelectedSurvivor: (
    updateData: Partial<Survivor>,
    successMsg?: string
  ) => void
  /** Selected Hunt */
  selectedHunt: Hunt | null
  /** Selected Settlement */
  selectedSettlement: Settlement | null
  /** Selected Survivor */
  selectedSurvivor: Survivor | null
}

/**
 * Survivor Card Component
 *
 * Displays updatable survivor information for hunt
 */
export function HuntSurvivorCard({
  saveSelectedHunt,
  saveSelectedSurvivor,
  selectedHunt,
  selectedSettlement,
  selectedSurvivor
}: HuntSurvivorCardProps): ReactElement {
  // Get current survivor's hunt details
  const survivorHuntDetails = selectedHunt?.survivorDetails?.find(
    (detail) => detail.id === selectedSurvivor?.id
  )

  // Track survivor ID to detect changes
  const survivorIdRef = useRef(selectedSurvivor?.id)

  // State for managing notes
  const [notesDraft, setNotesDraft] = useState<string>(
    survivorHuntDetails?.notes ?? ''
  )
  const [isNotesDirty, setIsNotesDirty] = useState<boolean>(false)

  // Reset notes draft when survivor changes
  if (survivorIdRef.current !== selectedSurvivor?.id) {
    survivorIdRef.current = selectedSurvivor?.id
    setNotesDraft(survivorHuntDetails?.notes ?? '')
    setIsNotesDirty(false)
  }

  const form = useForm<Survivor>({
    resolver: zodResolver(SurvivorSchema) as Resolver<Survivor>,
    defaultValues: SurvivorSchema.parse(selectedSurvivor ?? {})
  })

  // Update form values when survivor data changes
  useEffect(() => {
    if (selectedSurvivor) form.reset(selectedSurvivor)
  }, [selectedSurvivor, form])

  /**
   * Handle Save Notes
   */
  const handleSaveNotes = () => {
    if (!selectedSurvivor?.id || !selectedHunt?.survivorDetails) return

    setIsNotesDirty(false)

    // Update or add the notes to the survivor's hunt details
    const updatedDetails = selectedHunt.survivorDetails.map((detail) =>
      detail.id === selectedSurvivor.id
        ? { ...detail, notes: notesDraft }
        : detail
    )

    saveSelectedHunt(
      { survivorDetails: updatedDetails },
      HUNT_NOTES_SAVED_MESSAGE()
    )
  }

  if (!selectedSurvivor) return <></>

  return (
    <Card
      className="w-full min-w-[430px] border-2 rounded-xl pt-0 pb-2 gap-2 transition-all duration-200 hover:shadow-lg"
      style={{
        ...getCardColorStyles(selectedSurvivor.color),
        borderColor: 'var(--card-border-color)'
      }}>
      <CardHeader
        className="flex items-center gap-3 p-2 rounded-t-lg"
        style={{ backgroundColor: 'var(--card-header-bg)' }}>
        {/* Header with Avatar and Name */}
        <Avatar
          className={`h-12 w-12 border-2 ${getColorStyle(selectedSurvivor.color, 'bg')} items-center justify-center cursor-pointer`}>
          <AvatarFallback className="font-bold text-lg text-white">
            {selectedSurvivor.name
              ? selectedSurvivor.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .slice(0, 2)
              : '??'}
          </AvatarFallback>
        </Avatar>

        <div className="text-left flex-1 min-w-0">
          <div className="font-semibold text-sm truncate">
            {selectedSurvivor.name}{' '}
            {selectedHunt?.scout === selectedSurvivor.id && (
              <Badge variant="secondary" className="mt-1 text-xs">
                Scout
              </Badge>
            )}
          </div>
          <div className="text-xs text-muted-foreground">
            {selectedSurvivor.gender}
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-2">
        <SurvivorCard
          mode={SurvivorCardMode.HUNT_CARD}
          saveSelectedHunt={saveSelectedHunt}
          saveSelectedSurvivor={saveSelectedSurvivor}
          selectedHunt={selectedHunt}
          selectedSettlement={selectedSettlement}
          selectedShowdown={null}
          selectedSurvivor={selectedSurvivor}
        />

        <Separator className="my-2" />

        {/* Hunt Notes Section */}
        <div className="flex flex-col gap-2">
          <Textarea
            value={notesDraft}
            name="hunt-survivor-notes"
            id={`hunt-survivor-notes-${selectedSurvivor.id}`}
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
