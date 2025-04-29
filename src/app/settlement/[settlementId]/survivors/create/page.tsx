'use client'

import { CreateSurvivorForm } from '@/components/survivors/create'

export default function Page() {
  return (
    <div className="grid grid-rows-[0px_1fr_0px] grid-rows-[1fr] items-center justify-items-center sm:p-8 pb-20 gap-8 sm:gap-16 font-[family-name:var(--font-geist-sans)]">
      <h1 className="text-4xl sm:text-5xl font-bold pt-[20px] text-center">
        Create a Survivor
      </h1>

      <CreateSurvivorForm />
    </div>
  )
}
