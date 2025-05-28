'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { getCampaign } from '@/lib/utils'
import { Settlement, SettlementSchema } from '@/schemas/settlement'
import { CheckIcon, StickyNoteIcon } from 'lucide-react'
import { ReactElement, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'
import { ZodError } from 'zod'

/**
 * Notes Card Component
 *
 * @param form Settlement form instance
 * @returns Notes Card Component
 */
export function NotesCard({
  ...form
}: UseFormReturn<Settlement>): ReactElement {
  const notes = form.watch('notes')

  const [draft, setDraft] = useState<string | undefined>(notes)
  const [isDirty, setIsDirty] = useState<boolean>(false)

  /**
   * Save notes to localStorage for the current settlement, with
   * Zod validation and toast feedback.
   *
   * @param updatedNotes Updated Notes
   * @param successMsg Success Message
   */
  const saveToLocalStorage = (
    updatedNotes: string | undefined,
    successMsg?: string
  ) => {
    try {
      const formValues = form.getValues()
      const campaign = getCampaign()
      const settlementIndex = campaign.settlements.findIndex(
        (s: { id: number }) => s.id === formValues.id
      )

      if (settlementIndex !== -1) {
        const updatedSettlement = {
          ...campaign.settlements[settlementIndex],
          notes: updatedNotes
        }

        try {
          SettlementSchema.parse(updatedSettlement)
        } catch (error) {
          if (error instanceof ZodError && error.errors[0]?.message)
            return toast.error(error.errors[0].message)
          else
            return toast.error(
              'The darkness swallows your words. Please try again.'
            )
        }

        campaign.settlements[settlementIndex].notes = updatedNotes
        localStorage.setItem('campaign', JSON.stringify(campaign))

        if (successMsg) toast.success(successMsg)
      }
    } catch (error) {
      console.error('Notes Save Error:', error)
      toast.error('The darkness swallows your words. Please try again.')
    }
  }

  const handleSave = () => {
    form.setValue('notes', draft)
    setIsDirty(false)

    saveToLocalStorage(
      draft,
      'As stories are shared amongst survivors, they are etched into the history of your settlement.'
    )
  }

  return (
    <Card className="mt-2 border-0">
      <CardHeader className="px-3 py-2">
        <CardTitle className="text-md flex items-center gap-1">
          <StickyNoteIcon className="h-4 w-4" /> Notes
        </CardTitle>
      </CardHeader>
      <CardContent className="p-1 pb-0">
        <div className="space-y-1">
          <Textarea
            value={draft}
            name="notes"
            id="settlement-notes"
            onChange={(e) => {
              setDraft(e.target.value)
              setIsDirty(e.target.value !== notes)

              // Auto-resize textarea
              const textarea = e.target as HTMLTextAreaElement
              textarea.style.height = 'auto'
              textarea.style.height = textarea.scrollHeight + 'px'
            }}
            placeholder="Add notes about your settlement..."
            className="w-full min-h-[100px] resize-none overflow-hidden"
            style={{ height: 'auto' }}
          />
          <div className="flex justify-end pt-1">
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
