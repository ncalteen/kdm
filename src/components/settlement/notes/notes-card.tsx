import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { getCampaign } from '@/lib/utils'
import { Settlement } from '@/schemas/settlement'
import { CheckIcon, StickyNoteIcon } from 'lucide-react'
import { useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'

/**
 * Notes Card Component
 *
 * Displays a textarea for adding notes to the settlement.
 */
export function NotesCard(form: UseFormReturn<Settlement>) {
  const notes = form.watch('notes')

  const [draft, setDraft] = useState<string | undefined>(notes)
  const [isDirty, setIsDirty] = useState<boolean>(false)

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
      toast.success(
        'As stories are shared amongst survivors, they are etched into the history of your settlement.'
      )
    } catch (error) {
      console.error('Notes Save Error:', error)
      toast.error(
        'The shadows devour your words - your stories are lost. Please try again.'
      )
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
