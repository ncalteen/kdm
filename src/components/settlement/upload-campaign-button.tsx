'use client'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import type { Campaign } from '@/lib/types'
import { getCampaign } from '@/lib/utils'
import { CampaignSchema } from '@/schemas/campaign'
import { UploadIcon } from 'lucide-react'
import { useRef, useState } from 'react'
import { toast } from 'sonner'

/**
 * Upload Campaign Button Component
 *
 * This component allows the user to upload a JSON file containing campaign
 * data. It is validated against a schema, and if valid, the data replaces the
 * existing campaign data.
 *
 * @returns Upload Campaign Button
 */
export function UploadCampaignButton() {
  const [isUploading, setIsUploading] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [uploadedData, setUploadedData] = useState<Campaign | null>(null)
  const [validationErrors, setValidationErrors] = useState<string[]>([])
  const [isOpen, setIsOpen] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  /**
   * Handles the file selection and validation.
   *
   * @param event File Input Change Event
   */
  const handleFileSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (!file) return

    setIsUploading(true)
    setValidationErrors([])

    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const jsonData = JSON.parse(e.target?.result as string)
        const result = CampaignSchema.safeParse(jsonData)

        if (result.success) {
          // Data is valid
          setUploadedData(jsonData)
          setShowConfirmation(true)
        } else {
          // Collect validation errors
          const errors = result.error.errors.map(
            (err) => `${err.path.join('.')}: ${err.message}`
          )

          setValidationErrors(errors)
          setUploadedData(null)
          setShowConfirmation(false)
        }
      } catch (error) {
        console.error('Upload Campaign JSON Error:', error)
        setValidationErrors([
          'Your records are unreadable. The darkness has corrupted them.'
        ])

        setUploadedData(null)
        setShowConfirmation(false)
      } finally {
        setIsUploading(false)
      }
    }

    reader.onerror = () => {
      console.error('Read Campaign JSON Error:', reader.error)
      toast.error('The darkness consumes your record. Try again.')
      setIsUploading(false)
    }

    reader.readAsText(file)
  }

  /**
   * Confirms the upload and replaces the existing campaign data.
   */
  const confirmUpload = () => {
    if (!uploadedData) return

    try {
      // Replace existing campaign data
      localStorage.setItem('campaign', JSON.stringify(uploadedData))
      toast.success("Settlement chronicles illuminated by the lantern's light!")

      // Reset state
      setUploadedData(null)
      setShowConfirmation(false)
      setIsOpen(false)

      // Clear file input
      if (fileInputRef.current) fileInputRef.current.value = ''

      // Reload the page to reflect changes
      window.location.reload()
    } catch (error) {
      console.error('Save Campaign Error:', error)
      toast.error('The lantern fades. Your records are lost to the abyss')
    }
  }

  /**
   * Handles the dialog close event.
   */
  const handleDialogClose = () => {
    setUploadedData(null)
    setShowConfirmation(false)
    setValidationErrors([])

    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button
          onClick={() => setIsOpen(true)}
          disabled={isUploading}
          variant="outline"
          size="sm"
          className="w-full sm:w-auto">
          <UploadIcon className="h-4 w-4" />
          Upload Settlement Records
        </Button>
      </AlertDialogTrigger>{' '}
      <AlertDialogContent
        className="max-w-md"
        onCloseAutoFocus={handleDialogClose}>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {showConfirmation
              ? 'The Lantern Flickers - Confirm Your Choice'
              : validationErrors.length > 0
                ? 'The Darkness Rejects Your Offering'
                : 'Illuminate Your Past'}
          </AlertDialogTitle>

          {showConfirmation && (
            <AlertDialogDescription className="sr-only">
              This will replace your current campaign data with the uploaded
              file.
            </AlertDialogDescription>
          )}

          {validationErrors.length > 0 && (
            <AlertDialogDescription className="sr-only">
              The uploaded file contains validation errors that need to be
              fixed.
            </AlertDialogDescription>
          )}

          {!showConfirmation && validationErrors.length === 0 && (
            <AlertDialogDescription className="sr-only">
              Upload a JSON file containing campaign data. This will replace
              your existing data.
            </AlertDialogDescription>
          )}
        </AlertDialogHeader>

        {/* Content outside of AlertDialogDescription to avoid nesting issues */}
        <div className="text-sm text-muted-foreground">
          {showConfirmation ? (
            <div className="text-left space-y-4">
              <p className="font-medium text-amber-500">
                Warning: The darkness will consume your current settlements!
              </p>
              <p>Your lantern currently illuminates:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  {getCampaign().settlements.length} settlement
                  {getCampaign().settlements.length !== 1 ? 's' : ''}
                </li>
                <li>
                  {getCampaign().survivors.length} survivor
                  {getCampaign().survivors.length !== 1 ? 's' : ''}
                </li>
              </ul>
              <p>The records you seek to restore contain:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  {uploadedData?.settlements?.length} settlement
                  {uploadedData?.settlements?.length !== 1 ? 's' : ''}
                </li>
                <li>
                  {uploadedData?.survivors?.length} survivor
                  {uploadedData?.survivors?.length !== 1 ? 's' : ''}
                </li>
              </ul>
              <p>Will you face the darkness and continue?</p>
            </div>
          ) : validationErrors.length > 0 ? (
            <div className="text-left">
              <p className="mb-2 text-destructive font-medium">
                The darkness corrupts your chronicles:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-sm max-h-40 overflow-y-auto">
                {validationErrors.slice(0, 10).map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
                {validationErrors.length > 10 && (
                  <li>...and {validationErrors.length - 10} more errors</li>
                )}
              </ul>
              <p className="mt-2">
                Mend your chronicles and try again, lest they be lost forever.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <p>
                Surrender your chronicles to the lantern&apos;s light.{' '}
                <strong>
                  The darkness will consume your existing settlements.
                </strong>
              </p>
              <div className="pt-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".json,application/json"
                  onChange={handleFileSelection}
                  className="w-full text-sm file:mr-4 file:py-2 file:px-4
                     file:rounded-md file:border-0
                     file:text-sm file:font-medium
                     file:bg-primary file:text-primary-foreground
                     hover:file:bg-primary/90
                     cursor-pointer"
                />
              </div>
            </div>
          )}
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>Flee</AlertDialogCancel>
          {showConfirmation && (
            <AlertDialogAction
              onClick={confirmUpload}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Embrace the Darkness
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
