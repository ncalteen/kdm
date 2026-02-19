'use client'

import { SurvivorCard } from '@/components/survivor/survivor-card'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { SurvivorCardMode } from '@/lib/enums'
import { SHOWDOWN_NOTES_SAVED_MESSAGE } from '@/lib/messages'
import { Settlement } from '@/schemas/settlement'
import { Showdown } from '@/schemas/showdown'
import { Survivor, SurvivorSchema } from '@/schemas/survivor'
import { zodResolver } from '@hookform/resolvers/zod'
import { CheckIcon } from 'lucide-react'
import { ReactElement, useEffect, useRef, useState } from 'react'
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
  selectedSettlement: Settlement | null
  /** Selected Showdown */
  selectedShowdown: Showdown | null
  /** Selected Survivor */
  selectedSurvivor: Survivor | null
}

/**
 * Survivor Card Component
 *
 * Displays updatable survivor information for showdown
 *
 * @param props Showdown Survivor Card Properties
 * @returns Showdown Survivor Card Component
 */
export function ShowdownSurvivorCard({
  saveSelectedShowdown,
  saveSelectedSurvivor,
  selectedSettlement,
  selectedShowdown,
  selectedSurvivor
}: ShowdownSurvivorCardProps): ReactElement {
  // Get current survivor's showdown details
  const survivorShowdownDetails = selectedShowdown?.survivorDetails?.find(
    (detail) => detail.id === selectedSurvivor?.id
  )

  // Track survivor ID to detect changes
  const survivorIdRef = useRef(selectedSurvivor?.id)

  // State for managing notes
  const [notesDraft, setNotesDraft] = useState<string>(
    survivorShowdownDetails?.notes ?? ''
  )
  const [isNotesDirty, setIsNotesDirty] = useState<boolean>(false)

  // Reset notes draft when survivor changes
  if (survivorIdRef.current !== selectedSurvivor?.id) {
    survivorIdRef.current = selectedSurvivor?.id
    setNotesDraft(survivorShowdownDetails?.notes ?? '')
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
    if (!selectedSurvivor?.id || !selectedShowdown?.survivorDetails) return

    setIsNotesDirty(false)

    // Update or add the notes to the survivor's showdown details
    const updatedDetails = selectedShowdown.survivorDetails.map((detail) =>
      detail.id === selectedSurvivor.id
        ? { ...detail, notes: notesDraft }
        : detail
    )

    saveSelectedShowdown(
      { survivorDetails: updatedDetails },
      SHOWDOWN_NOTES_SAVED_MESSAGE()
    )
  }

  if (!selectedSurvivor) return <></>

  return (
    <Card className="w-full min-w-[430px] border-0 p-0">
      <CardContent className="px-2">
        <SurvivorCard
          mode={SurvivorCardMode.SHOWDOWN_CARD}
          saveSelectedShowdown={saveSelectedShowdown}
          saveSelectedSurvivor={saveSelectedSurvivor}
          selectedHunt={null}
          selectedSettlement={selectedSettlement}
          selectedShowdown={selectedShowdown}
          selectedSurvivor={selectedSurvivor}
        />

        <Separator className="my-2" />

        {/* Showdown Notes Section */}
        <div className="flex flex-col gap-2">
          <Textarea
            value={notesDraft}
            name="showdown-survivor-notes"
            id={`showdown-survivor-notes-${selectedSurvivor.id}`}
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
