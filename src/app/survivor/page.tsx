'use client'

import { SurvivorForm } from '@/components/survivor/survivor-form'
import { Button } from '@/components/ui/button'
import { Survivor } from '@/lib/types'
import { getSurvivor } from '@/lib/utils'
import { useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useRef, useState } from 'react'

/**
 * This component handles the actual page content after searchParams are
 * available. It loads the survivor data based on the provided survivorId
 * and displays the survivor form. If no survivorId is provided, it shows a
 * message indicating that the survivor was not found.
 */
export function SurvivorPage() {
  const searchParams = useSearchParams()
  const survivorIdParam = searchParams.get('survivorId')

  // Track if the component is mounted
  const isMounted = useRef(false)

  // Store the survivor data
  const [survivor, setSurvivor] = useState<Survivor | undefined>(undefined)

  useEffect(() => {
    // Mark component as mounted
    isMounted.current = true

    if (survivorIdParam && isMounted.current) {
      // Parse the survivor ID parameter
      const survivorId = parseInt(survivorIdParam, 10)

      // Get the survivor data from localStorage
      try {
        const fetchedSurvivor = getSurvivor(survivorId)
        setSurvivor(fetchedSurvivor)
      } catch (error) {
        console.error('Get Survivor Error:', error)
      }
    }

    return () => {
      isMounted.current = false
    }
  }, [survivorIdParam])

  // If no survivor ID is provided, display a message
  if (!survivorIdParam)
    return (
      <div className="grid grid-rows-[0px_1fr_0px] grid-rows-[1fr] items-center justify-items-center sm:p-8 pb-20 gap-8 sm:gap-16 font-[family-name:var(--font-geist-sans)]">
        <h1 className="text-4xl sm:text-5xl font-bold pt-[20px] text-center">
          Survivor Not Found
        </h1>
        <p className="text-xl text-center">
          No survivor ID was specified. Please go to the survivors list or
          create a new one.
        </p>
        <div className="mt-6">
          <Button
            onClick={() => (window.location.href = '/kdm/survivor/create')}
            variant="default">
            Create a Survivor
          </Button>
        </div>
      </div>
    )

  // If survivor data is still loading or not found
  if (!survivor)
    return (
      <div className="grid grid-rows-[0px_1fr_0px] grid-rows-[1fr] items-center justify-items-center sm:p-8 pb-20 gap-8 sm:gap-16 font-[family-name:var(--font-geist-sans)]">
        <h1 className="text-4xl sm:text-5xl font-bold pt-[20px] text-center">
          {isMounted.current ? 'Survivor Not Found' : 'Loading Survivor...'}
        </h1>
        <p className="text-xl text-center">
          {isMounted.current
            ? `No survivor was found with the ID: ${survivorIdParam}`
            : 'Loading Survivor...'}
        </p>
        {isMounted.current && (
          <div className="mt-6">
            <Button
              onClick={() => (window.location.href = '/kdm/survivor/create')}
              variant="default">
              Create a Survivor
            </Button>
          </div>
        )}
      </div>
    )

  // If we have a valid survivor, render the form
  return <SurvivorForm initialSurvivor={survivor} />
}

/**
 * Creates a loading component to show during the suspense fallback.
 */
export function SurvivorLoading() {
  return (
    <div className="grid grid-rows-[0px_1fr_0px] grid-rows-[1fr] items-center justify-items-center sm:p-8 pb-20 gap-8 sm:gap-16 font-[family-name:var(--font-geist-sans)]">
      <h1 className="text-4xl sm:text-5xl font-bold pt-[20px] text-center">
        Loading Survivor...
      </h1>
      <p className="text-xl text-center">Reaching into the darkness...</p>
    </div>
  )
}

// Main page component with Suspense boundary
export default function Page() {
  return (
    <Suspense fallback={<SurvivorLoading />}>
      <SurvivorPage />
    </Suspense>
  )
}
