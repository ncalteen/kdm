'use client'

import { SurvivorForm } from '@/components/survivor/survivor-form'
import { Button } from '@/components/ui/button'
import { Survivor } from '@/lib/types'
import { getSurvivor } from '@/lib/utils'
import { useSearchParams } from 'next/navigation'
import { ReactElement, Suspense, useEffect, useState } from 'react'

/**
 * Survivor Page Component
 *
 * This component handles the actual page content after searchParams are
 * available. It loads the survivor data based on the provided survivorId
 * and displays the survivor form. If no survivorId is provided, it shows a
 * message indicating that the survivor was not found.
 */
export function SurvivorPage(): ReactElement {
  // Get the survivor and settlement IDs from the URL search parameters.
  const searchParams = useSearchParams()
  const survivorIdParam = searchParams.get('survivorId')

  // Store the survivor data/status and loading state.
  const [survivor, setSurvivor] = useState<Survivor | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)

    if (survivorIdParam) {
      // Parse the survivor ID parameter
      const survivorId = parseInt(survivorIdParam, 10)

      // Get the survivor data from localStorage
      try {
        const fetchedSurvivor = getSurvivor(survivorId)
        setSurvivor(fetchedSurvivor)
        setIsLoading(false)
      } catch (error) {
        console.error('Get Survivor Error:', error)
        setIsLoading(false)
      }
    } else {
      setIsLoading(false)
    }
  }, [survivorIdParam])

  // If survivor data is still loading or not found
  if (isLoading || !survivor)
    return (
      <div className="grid grid-rows-[0px_1fr_0px] grid-rows-[1fr] items-center justify-items-center sm:p-8 pb-20 gap-8 sm:gap-16 font-[family-name:var(--font-geist-sans)]">
        <h1 className="text-4xl sm:text-5xl font-bold pt-[20px] text-center">
          {isLoading ? 'Loading Survivor...' : 'Survivor Not Found'}
        </h1>
        {!survivor && !isLoading && (
          <>
            <p className="text-xl text-center">
              Survivor #{survivorIdParam} Not Found
            </p>

            <div className="mt-6">
              <Button
                onClick={() => (window.location.href = '/kdm/survivor/create')}
                variant="default">
                Create a Survivor
              </Button>
            </div>
          </>
        )}
      </div>
    )

  // If we have a valid survivor, render the form
  return <SurvivorForm initialSurvivor={survivor} />
}

/**
 * Survivor Loading Component
 *
 * Creates a loading component to show during the suspense fallback.
 */
export function SurvivorLoading(): ReactElement {
  return (
    <div className="grid grid-rows-[0px_1fr_0px] grid-rows-[1fr] items-center justify-items-center sm:p-8 pb-20 gap-8 sm:gap-16 font-[family-name:var(--font-geist-sans)]">
      <h1 className="text-4xl sm:text-5xl font-bold pt-[20px] text-center">
        Loading Survivor...
      </h1>
      <p className="text-xl text-center">Reaching into the darkness...</p>
    </div>
  )
}

/**
 * Page Component
 */
export default function Page(): ReactElement {
  return (
    <Suspense fallback={<SurvivorLoading />}>
      <SurvivorPage />
    </Suspense>
  )
}
