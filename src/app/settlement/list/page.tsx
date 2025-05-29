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
    <div className="mx-auto py-8">
      <h1 className="text-3xl sm:text-4xl font-bold text-center mb-8">
        Kingdom Death: Monster
      </h1>

      <Card className="max-w-[90%] mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl text-center font-bold">
            Settlements
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
