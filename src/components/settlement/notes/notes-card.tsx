'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Settlement } from '@/schemas/settlement'
import { CheckIcon, StickyNoteIcon } from 'lucide-react'
import { ReactElement, useState } from 'react'

/**
 * Notes Card Properties
 */
interface NotesCardProps {
  /** Save Selected Settlement */
  saveSelectedSettlement: (
    updateData: Partial<Settlement>,
    successMsg?: string
  ) => void
  /** Selected Settlement */
  selectedSettlement: Partial<Settlement> | null
}

/**
 * Notes Card Component
 *
 * @param props Notes Card Properties
 * @returns Notes Card Component
 */
export function NotesCard({
  saveSelectedSettlement,
  selectedSettlement
}: NotesCardProps): ReactElement {
  const [draft, setDraft] = useState<string | undefined>(
    selectedSettlement?.notes || ''
  )
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
    saveSelectedSettlement(
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
              setIsDirty(e.target.value !== selectedSettlement?.notes)
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
