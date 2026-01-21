'use client'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Campaign } from '@/schemas/campaign'
import { Download, Loader2 } from 'lucide-react'
import { ReactElement, useState } from 'react'

/**
 * Migration Alert Dialog Properties
 */
interface MigrationAlertDialogProps {
  /** Campaign Data */
  campaign: Campaign
  /** Current Campaign Version */
  current: string
  /** Whether the Dialog is Open */
  migrate: boolean
  /** Callback when Migration is Confirmed */
  onConfirm: () => void
  /** Target Campaign Version */
  target: string
}

/**
 * Migration Alert Dialog Component
 *
 * Displays an alert dialog when campaign data needs to be migrated to a newer
 * version. Provides the user with the option to download their current data
 * before proceeding with the migration.
 *
 * @param props Component Properties
 * @returns Migration Alert Dialog Component
 */
export function MigrationAlertDialog({
  campaign,
  current,
  migrate,
  onConfirm,
  target
}: MigrationAlertDialogProps): ReactElement {
  const [isDownloading, setIsDownloading] = useState(false)
  const [hasDownloaded, setHasDownloaded] = useState(false)

  /**
   * Handle Download of Current Campaign Data
   *
   * Creates a JSON file with the current campaign data and triggers a download.
   */
  const handleDownload = () => {
    setIsDownloading(true)

    try {
      const dataStr = JSON.stringify(campaign, null, 2)
      const blob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(blob)

      const link = document.createElement('a')
      link.href = url
      link.download = `kdm-campaign-backup-${current}-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      URL.revokeObjectURL(url)
      setHasDownloaded(true)
    } catch (error) {
      console.error('Download Error:', error)
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <AlertDialog open={migrate}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Campaign Data Migration Required</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-3">
              <p>
                Your lantern flickers as ancient knowledge stirs. Your campaign
                data must be carried forward from the darkness to the light of
                version <strong>{target}</strong>.
              </p>
              <p>
                Before the migration begins, you may preserve your current
                records by downloading a backup. This ensures your journey is
                never lost.
              </p>
              <div className="bg-muted/50 flex items-center gap-2 rounded-md border p-3">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className="shrink-0">
                  {isDownloading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Download className="mr-2 h-4 w-4" />
                  )}
                  Download Backup
                </Button>
                {hasDownloaded && (
                  <span className="text-muted-foreground text-xs">
                    ✓ Backup Downloaded
                  </span>
                )}
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={onConfirm}>
            Proceed with Migration
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
