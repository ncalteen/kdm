'use client'

import { CreateSurvivorForm } from '@/components/survivor/create-survivor-form'
import { ReactElement, Suspense } from 'react'

export default function Page(): ReactElement {
  return (
    <div className="grid grid-rows-[0px_1fr_0px] grid-rows-[1fr] items-center justify-items-center sm:p-8 pb-20 gap-8 sm:gap-16 font-[family-name:var(--font-geist-sans)]">
      <h1 className="text-4xl sm:text-5xl font-bold pt-[20px] text-center">
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
