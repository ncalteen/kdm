'use client'

import { CreateSurvivorForm } from '@/components/survivor/create-survivor-form'
import { ReactElement, Suspense } from 'react'

export default function Page(): ReactElement {
  return (
    <div className="mx-auto py-8">
      <h1 className="text-3xl sm:text-4xl font-bold text-center mb-8">
        Create a Survivor
      </h1>

      <Suspense
        fallback={
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-4">
              A lantern flickers...
            </h2>
            <p className="text-lg text-muted-foreground">
              The Scribe is preparing a new survivor.
            </p>
          </div>
        }>
        <CreateSurvivorForm />
      </Suspense>
    </div>
  )
}
