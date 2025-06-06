'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Settlement } from '@/schemas/settlement'
import { CheckIcon, StickyNoteIcon } from 'lucide-react'
import { ReactElement, useState } from 'react'

/**
 * Notes Card Props
 */
interface NotesCardProps extends Partial<Settlement> {
  /** Save settlement function */
  saveSettlement: (updateData: Partial<Settlement>, successMsg?: string) => void
}

/**
 * Notes Card Component
 *
 * @param form Settlement form instance
 * @returns Notes Card Component
 */
export function NotesCard({
  saveSettlement,
  ...settlement
}: NotesCardProps): ReactElement {
  const [draft, setDraft] = useState<string | undefined>(settlement.notes || '')
  const [isDirty, setIsDirty] = useState<boolean>(false)

  /**
   * Save to Local Storage
   *
   * @param updatedNotes Updated Notes
   * @param successMsg Success Message
   */
  const saveToLocalStorage = (
    updatedNotes: string | undefined,
    successMsg?: string
  ) =>
    saveSettlement(
      {
        notes: updatedNotes
      },
      successMsg
    )

  const handleSave = () => {
    setIsDirty(false)
    saveToLocalStorage(
      draft,
      'As stories are shared amongst survivors, they are etched into the history of your settlement.'
    )
  }

  return (
    <Card className="p-0 pb-1 border-0 h-full flex flex-col">
      <CardHeader className="px-2 py-0 flex-shrink-0">
        <CardTitle className="text-md flex flex-row items-center gap-1 h-8">
          <StickyNoteIcon className="h-4 w-4" /> Notes
        </CardTitle>
      </CardHeader>

      {/* Notes Textarea */}
      <CardContent className="p-1 py-0 flex-1 flex flex-col">
        <div className="flex flex-col h-full">
          <Textarea
            value={draft}
            name="notes"
            id="settlement-notes"
            onChange={(e) => {
              setDraft(e.target.value)
              setIsDirty(e.target.value !== settlement.notes)
            }}
            placeholder="Add notes about your settlement..."
            className="w-full flex-1 resize-none"
            style={{ minHeight: '200px' }}
          />
          <div className="flex justify-end pt-1 flex-shrink-0">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={handleSave}
              disabled={!isDirty}
              title="Save notes">
              <CheckIcon className="h-4 w-4" />
              Save Notes
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
