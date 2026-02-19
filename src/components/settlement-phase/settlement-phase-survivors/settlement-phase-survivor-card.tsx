'use client'

import { SurvivorCard } from '@/components/survivor/survivor-card'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { SurvivorCardMode } from '@/lib/enums'
import { SURVIVOR_NOTES_SAVED_MESSAGE } from '@/lib/messages'
import { Settlement } from '@/schemas/settlement'
import { Survivor, SurvivorSchema } from '@/schemas/survivor'
import { zodResolver } from '@hookform/resolvers/zod'
import { CheckIcon } from 'lucide-react'
import { ReactElement, useEffect, useRef, useState } from 'react'
import { Resolver, useForm } from 'react-hook-form'

/**
 * Settlement Phase Survivor Card Component
 */
interface SettlementPhaseSurvivorCardProps {
  /** Save Selected Survivor */
  saveSelectedSurvivor: (
    updateData: Partial<Survivor>,
    successMsg?: string
  ) => void
  /** Selected Settlement */
  selectedSettlement: Settlement | null
  /** Selected Survivor */
  selectedSurvivor: Survivor | null
}

/**
 * Survivor Card Component
 *
 * Displays updatable survivor information for settlement phase
 *
 * @param props Settlement Phase Survivor Card Properties
 * @returns Settlement Phase Survivor Card Component
 */
export function SettlementPhaseSurvivorCard({
  saveSelectedSurvivor,
  selectedSettlement,
  selectedSurvivor
}: SettlementPhaseSurvivorCardProps): ReactElement {
  // Track survivor ID to detect changes
  const survivorIdRef = useRef(selectedSurvivor?.id)

  // State for managing notes
  const [notesDraft, setNotesDraft] = useState<string>(
    selectedSurvivor?.notes ?? ''
  )
  const [isNotesDirty, setIsNotesDirty] = useState<boolean>(false)

  // Reset notes draft when survivor changes
  if (survivorIdRef.current !== selectedSurvivor?.id) {
    survivorIdRef.current = selectedSurvivor?.id
    setNotesDraft(selectedSurvivor?.notes ?? '')
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
    if (!selectedSurvivor?.id) return

    setIsNotesDirty(false)

    saveSelectedSurvivor({ notes: notesDraft }, SURVIVOR_NOTES_SAVED_MESSAGE())
  }

  return (
    <Card className="w-full min-w-[430px] border-0 p-0">
      <CardContent className="p-0">
        <SurvivorCard
          mode={SurvivorCardMode.SETTLEMENT_PHASE_CARD}
          saveSelectedSurvivor={saveSelectedSurvivor}
          selectedHunt={null}
          selectedSettlement={selectedSettlement}
          selectedShowdown={null}
          selectedSurvivor={selectedSurvivor}
        />

        <Separator className="my-2" />

        {/* Notes Section */}
        <div className="flex flex-col gap-2">
          <Textarea
            value={notesDraft}
            name="survivor-notes"
            id={`survivor-notes-${selectedSurvivor?.id}`}
            onChange={(e) => {
              setNotesDraft(e.target.value)
              setIsNotesDirty(e.target.value !== selectedSurvivor?.notes)
            }}
            placeholder="Add notes..."
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
              title="Save survivor notes">
              <CheckIcon className="h-4 w-4" />
              Save
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
