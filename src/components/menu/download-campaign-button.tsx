'use client'

import { Button } from '@/components/ui/button'
import { getCampaign } from '@/lib/utils'
import { DownloadIcon } from 'lucide-react'
import { ReactElement, useState } from 'react'
import { toast } from 'sonner'

/**
 * Download Campaign Button Component
 *
 * This component allows the user to download the current campaign data as a
 * JSON file. The data is retrieved from localStorage and converted.
 *
 * @returns Download Campaign Button
 */
export function DownloadCampaignButton(): ReactElement {
  const [isDownloading, setIsDownloading] = useState<boolean>(false)

  const handleDownload = () => {
    try {
      setIsDownloading(true)

      const campaignJson = JSON.stringify(getCampaign(), null, 2)
      const blob = new Blob([campaignJson], { type: 'application/json' })
      const url = URL.createObjectURL(blob)

      // Create a link element to trigger the download
      const a = document.createElement('a')
      a.href = url
      a.download = 'kdm-campaign.json'

      // Trigger the download
      document.body.appendChild(a)
      a.click()

      // Cleanup
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast.success('Settlement records preserved!')
    } catch (error) {
      console.error('Download Campaign Error:', error)
      toast.error('Failed to preserve records. Please try again.')
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <Button
      onClick={handleDownload}
      disabled={isDownloading}
      variant="outline"
      size="sm"
      className="w-full sm:w-auto">
      <DownloadIcon className="h-4 w-4" />
      Preserve Records
    </Button>
  )
}
