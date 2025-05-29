'use client'

import { SurvivorForm } from '@/components/survivor/survivor-form'
import { Button } from '@/components/ui/button'
import { getSurvivor } from '@/lib/utils'
import { Survivor } from '@/schemas/survivor'
import { useSearchParams } from 'next/navigation'
import { ReactElement, Suspense, useEffect, useRef, useState } from 'react'

/**
 * Handles the actual page content after searchParams are available
 */
function SurvivorPage(): ReactElement {
  const searchParams = useSearchParams()
  const survivorIdParam = searchParams.get('survivorId')

  // Track if the component is mounted and loading state
  const isMounted = useRef(false)
  const [isLoading, setIsLoading] = useState(true)

  // Store the survivor data.
  const [survivor, setSurvivor] = useState<Survivor | undefined>(undefined)

  useEffect(() => {
    // Mark component as mounted
    isMounted.current = true

    if (survivorIdParam && isMounted.current) {
      setIsLoading(true)

      // Parse the survivor ID parameter
      const survivorId = parseInt(survivorIdParam, 10)

      // Simulate async behavior to show loading state
      setTimeout(() => {
        // Get the settlement data from localStorage
        try {
          const fetchedSurvivor = getSurvivor(survivorId)
          setSurvivor(fetchedSurvivor)
        } catch (error) {
          console.error('Get Survivor Error:', error)
          setSurvivor(undefined)
        } finally {
          setIsLoading(false)
        }
      }, 10) // Small delay to ensure loading state is visible
    } else {
      setIsLoading(false)
    }

    return () => {
      isMounted.current = false
    }
  }, [survivorIdParam])

  // If no survivor ID is provided, display a message
  if (!survivorIdParam)
    return (
      <div className="grid grid-rows-[1fr] items-center justify-items-center gap-8">
        <h1 className="text-3xl sm:text-4xl font-bold pt-[20px] text-center">
          Survivor Not Found
        </h1>
        <p className="text-md text-center">
          No survivor ID was specified. Please go to the survivors list or
          create a new one.
        </p>
        <Button
          onClick={() => (window.location.href = '/kdm/survivor/create')}
          variant="default">
          Create a Survivor
        </Button>
      </div>
    )

  // Show loading state while fetching settlement data
  if (isLoading)
    return (
      <div className="grid grid-rows-[1fr] items-center justify-items-center gap-8">
        <h1 className="text-3xl sm:text-4xl font-bold pt-[20px] text-center">
          Loading Survivor...
        </h1>
        <p className="text-md text-center">
          Please wait while we load the survivor data...
        </p>
      </div>
    )

  // If survivor data is not found after loading
  if (!survivor)
    return (
      <div className="grid grid-rows-[1fr] items-center justify-items-center gap-8">
        <h1 className="text-3xl sm:text-4xl font-bold pt-[20px] text-center">
          Survivor Not Found
        </h1>
        <p className="text-md text-center">
          No survivor was found with the ID: {survivorIdParam}
        </p>
        <Button
          onClick={() => (window.location.href = '/kdm/survivor/create')}
          variant="default">
          Create a Survivor
        </Button>
      </div>
    )

  // If we have a valid survivor, render the form
  return <SurvivorForm survivor={survivor} />
}

// Create a loading component to show during suspense
function SurvivorLoading(): ReactElement {
  return (
    <div className="grid grid-rows-[1fr] items-center justify-items-center sm:p-8 pb-20 gap-8 sm:gap-16 font-[family-name:var(--font-geist-sans)]">
      <h1 className="text-43xl sm:text-4xl font-bold pt-[20px] text-center">
        Loading Survivor...
      </h1>
      <p className="text-md text-center">
        Please wait while we load the survivor data...
      </p>
    </div>
  )
}

// Main page component with Suspense boundary
export default function Page(): ReactElement {
  return (
    <Suspense fallback={<SurvivorLoading />}>
      <SurvivorPage />
    </Suspense>
  )
}
