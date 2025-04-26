'use client'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Construction } from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="grid grid-rows-[0px_1fr_0px] grid-rows-[1fr] items-center justify-items-center sm:p-8 pb-20 gap-8 sm:gap-16 font-[family-name:var(--font-geist-sans)]">
      <h1 className="text-4xl sm:text-5xl font-bold pt-[20px] text-center">
        Kingdom Death: Monster
        <br />
        Tracker
      </h1>

      <Alert>
        <Construction className="h-4 w-4" />
        <AlertTitle>Under Construction</AlertTitle>
        <AlertDescription>
          This site is a work in progress. If you have any feedback, please{' '}
          <Link
            href="https://github.com/ncalteen/kdm/issues/new"
            className="text-blue-500 hover:underline">
            open an issue!
          </Link>{' '}
          If you&apos;re interested in contributing, check out our{' '}
          <Link
            href="https://github.com/ncalteen/kdm/blob/main/CONTRIBUTING.md"
            className="text-blue-500 hover:underline">
            contribution guide.
          </Link>
        </AlertDescription>
      </Alert>

      <p>TODO</p>
    </div>
  )
}
