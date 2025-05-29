'use client'

import { SettlementForm } from '@/components/settlement/settlement-form'
import { Button } from '@/components/ui/button'
import { getSettlement } from '@/lib/utils'
import { Settlement } from '@/schemas/settlement'
import { useSearchParams } from 'next/navigation'
import { ReactElement, Suspense, useEffect, useRef, useState } from 'react'

/**
 * Handles the actual page content after searchParams are available
 */
function SettlementPage(): ReactElement {
  const searchParams = useSearchParams()
  const settlementIdParam = searchParams.get('settlementId')

  // Track if the component is mounted and loading state
  const isMounted = useRef(false)
  const [isLoading, setIsLoading] = useState(true)

  // Store the settlement data
  const [settlement, setSettlement] = useState<Settlement | undefined>(
    undefined
  )

  useEffect(() => {
    // Mark component as mounted
    isMounted.current = true

    if (settlementIdParam && isMounted.current) {
      setIsLoading(true)

      // Parse the settlement ID parameter
      const settlementId = parseInt(settlementIdParam, 10)

      // Simulate async behavior to show loading state
      setTimeout(() => {
        // Get the settlement data from localStorage
        try {
          const fetchedSettlement = getSettlement(settlementId)
          setSettlement(fetchedSettlement)
        } catch (error) {
          console.error('Get Settlement Error:', error)
          setSettlement(undefined)
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
  }, [settlementIdParam])

  // If no settlement ID is provided, display a message
  if (!settlementIdParam)
    return (
      <div className="grid grid-rows-[1fr] items-center justify-items-center gap-8">
        <h1 className="text-3xl sm:text-4xl font-bold pt-[20px] text-center">
          Settlement Not Found
        </h1>
        <p className="text-md text-center">
          No settlement ID was specified. Please go to the settlements list or
          create a new one.
        </p>
        <Button
          onClick={() => (window.location.href = '/kdm/settlement/create')}
          variant="default">
          Create a Settlement
        </Button>
      </div>
    )

  // Show loading state while fetching settlement data
  if (isLoading)
    return (
      <div className="grid grid-rows-[1fr] items-center justify-items-center gap-8">
        <h1 className="text-3xl sm:text-4xl font-bold pt-[20px] text-center">
          Loading Settlement...
        </h1>
        <p className="text-md text-center">
          Please wait while we load the settlement data...
        </p>
      </div>
    )

  // If settlement data is not found after loading
  if (!settlement)
    return (
      <div className="grid grid-rows-[1fr] items-center justify-items-center gap-8">
        <h1 className="text-3xl sm:text-4xl font-bold pt-[20px] text-center">
          Settlement Not Found
        </h1>
        <p className="text-md text-center">
          No settlement was found with the ID: {settlementIdParam}
        </p>
        <Button
          onClick={() => (window.location.href = '/kdm/settlement/create')}
          variant="default">
          Create a Settlement
        </Button>
      </div>
    )

  // If we have a valid settlement, render the form
  return <SettlementForm settlement={settlement} />
}

// Create a loading component to show during suspense
function SettlementLoading(): ReactElement {
  return (
    <div className="grid grid-rows-[1fr] items-center justify-items-center sm:p-8 pb-20 gap-8 sm:gap-16 font-[family-name:var(--font-geist-sans)]">
      <h1 className="text-43xl sm:text-4xl font-bold pt-[20px] text-center">
        Loading Settlement...
      </h1>
      <p className="text-md text-center">
        Please wait while we load the settlement data...
      </p>
    </div>
  )
}

// Main page component with Suspense boundary
export default function Page(): ReactElement {
  return (
    <Suspense fallback={<SettlementLoading />}>
      <SettlementPage />
    </Suspense>
  )
}
