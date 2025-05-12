'use client'

import { ListSettlementsTable } from '@/components/settlement/list-settlements-table'
import { Card, CardContent } from '@/components/ui/card'

export default function Page() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl sm:text-5xl font-bold pt-[20px] text-center mb-8">
        My Settlements
      </h1>

      <Card className="max-w-[1200px] mx-auto pt-6">
        <CardContent>
          <div className="space-y-6">
            <ListSettlementsTable />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
