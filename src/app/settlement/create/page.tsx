'use client'

import { CreateSettlementForm } from '@/components/settlement/create-settlement-form'
import { ReactElement } from 'react'

export default function Page(): ReactElement {
  return (
    <div className="mx-auto py-8">
      <h1 className="text-3xl sm:text-4xl font-bold text-center mb-8">
        Create a Settlement
      </h1>

      <CreateSettlementForm />
    </div>
  )
}
