import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { getCampaign } from '@/lib/utils'
import { SettlementSchema } from '@/schemas/settlement'
import { CheckIcon, StickyNoteIcon } from 'lucide-react'
import { useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

/**
 * Notes Card Component
 */
export function NotesCard(
  form: UseFormReturn<z.infer<typeof SettlementSchema>>
) {
  const notes = form.watch('notes') || ''
  const [draft, setDraft] = useState(notes)
  const [isDirty, setIsDirty] = useState(false)

  const handleSave = () => {
    form.setValue('notes', draft)
    setIsDirty(false)

    // Update localStorage
    try {
      const formValues = form.getValues()
      const campaign = getCampaign()
      const settlementIndex = campaign.settlements.findIndex(
        (s) => s.id === formValues.id
      )

      campaign.settlements[settlementIndex].notes = draft
      localStorage.setItem('campaign', JSON.stringify(campaign))

      toast.success('Notes saved!')
    } catch (error) {
      console.error('Error saving notes to localStorage:', error)
      toast.error('Failed to save notes')
    }
  }

  return (
    <Card className="mt-2">
      <CardHeader className="pb-2">
        <CardTitle className="text-md flex items-center gap-1">
          <StickyNoteIcon className="h-4 w-4" /> Notes
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 pb-2">
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
        <div className="flex justify-end pt-2">
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={handleSave}
            disabled={!isDirty}
            title="Save notes">
            <CheckIcon className="h-4 w-4 mr-1" /> Save Notes
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
