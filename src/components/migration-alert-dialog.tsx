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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { SchemaVersion } from '@/lib/enums'
import { Campaign } from '@/schemas/campaign'
import { Download, FlaskConical, Loader2 } from 'lucide-react'
import { ReactElement, useState } from 'react'

/**
 * Migration Alert Dialog Properties
 */
interface MigrationAlertDialogProps {
  /** Campaign Data */
  campaign: Campaign
  /** Current Campaign Version */
  current: string
  /** Callback to Load Test Campaign Data for Development */
  loadTestData: (version: SchemaVersion) => Promise<void>
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
 * In development mode, provides additional options to load test campaign data
 * from fixture files to test migration functionality.
 *
 * @param props Component Properties
 * @returns Migration Alert Dialog Component
 */
export function MigrationAlertDialog({
  campaign,
  current,
  loadTestData,
  migrate,
  onConfirm,
  target
}: MigrationAlertDialogProps): ReactElement {
  const [isDownloading, setIsDownloading] = useState(false)
  const [hasDownloaded, setHasDownloaded] = useState(false)
  const [selectedTestVersion, setSelectedTestVersion] = useState<
    SchemaVersion | undefined
  >(undefined)
  const [isLoadingTestData, setIsLoadingTestData] = useState(false)

  const isDevelopment = process.env.NODE_ENV === 'development'

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

  /**
   * Handle Loading Test Campaign Data (Development Only)
   *
   * Loads campaign data from a fixture file for testing migration.
   */
  const handleLoadTestData = async () => {
    if (!loadTestData || !selectedTestVersion) return

    setIsLoadingTestData(true)

    try {
      await loadTestData(selectedTestVersion)
    } catch (error) {
      console.error('Load Test Data Error:', error)
    } finally {
      setIsLoadingTestData(false)
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
              <p>
                Current Version: <strong>{current}</strong>
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

              {isDevelopment && (
                <div className="bg-amber-500/10 space-y-2 rounded-md border border-amber-500/50 p-3">
                  <div className="flex items-center gap-2">
                    <FlaskConical className="h-4 w-4 text-amber-500" />
                    <span className="text-sm font-medium text-amber-500">
                      Development Mode
                    </span>
                  </div>
                  <p className="text-muted-foreground text-xs">
                    Override the current campaign with test fixture data to test
                    migration from a specific version.
                  </p>
                  <div className="flex items-center gap-2">
                    <Select
                      value={selectedTestVersion}
                      onValueChange={(value) =>
                        setSelectedTestVersion(value as SchemaVersion)
                      }>
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Select version" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(SchemaVersion).map(([key, version]) => (
                          <SelectItem key={key} value={version}>
                            v{version}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleLoadTestData}
                      disabled={!selectedTestVersion || isLoadingTestData}
                      className="shrink-0 border-amber-500/50 text-amber-500 hover:bg-amber-500/10 hover:text-amber-500">
                      {isLoadingTestData ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <FlaskConical className="mr-2 h-4 w-4" />
                      )}
                      Load Test Data
                    </Button>
                  </div>
                </div>
              )}
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
