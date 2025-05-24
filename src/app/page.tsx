'use client'

import { DownloadCampaignButton } from '@/components/menu/download-campaign-button'
import { UploadCampaignButton } from '@/components/menu/upload-campaign-button'
import { ListSettlementsTable } from '@/components/settlement/list-settlements-table'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { ReactElement } from 'react'

export default function Page(): ReactElement {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl sm:text-5xl font-bold pt-[20px] text-center mb-8">
        Kingdom Death: Monster
      </h1>

      <Card className="max-w-[1200px] mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl text-center font-bold">
            Settlement Tracker
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ListSettlementsTable />
        </CardContent>
        <CardFooter className="flex justify-between">
          <UploadCampaignButton />
          <DownloadCampaignButton />
        </CardFooter>
      </Card>
    </div>
  )
}
