'use client'

import { ReactElement } from 'react'

export default function Page(): ReactElement {
  return (
    <div className="grid grid-rows-[0px_1fr_0px] grid-rows-[1fr] items-center justify-items-center sm:p-8 pb-20 gap-8 sm:gap-16 font-[family-name:var(--font-geist-sans)]">
      <h1 className="text-4xl font-bold pt-[20px]">404 - Page Not Found</h1>

      <h1 className="text-2xl font-bold">
        Uh oh...this page doesn&apos;t exist!
      </h1>
    </div>
  )
}
