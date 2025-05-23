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

  // Track if the component is mounted
  const isMounted = useRef(false)

  // Store the settlement data
  const [settlement, setSettlement] = useState<Settlement | undefined>(
    undefined
  )

  useEffect(() => {
    // Mark component as mounted
    isMounted.current = true

    if (settlementIdParam && isMounted.current) {
      // Parse the settlement ID parameter
      const settlementId = parseInt(settlementIdParam, 10)

      // Get the settlement data from localStorage
      try {
        const fetchedSettlement = getSettlement(settlementId)
        setSettlement(fetchedSettlement)
      } catch (error) {
        console.error('Get Settlement Error:', error)
      }
    }

    return () => {
      isMounted.current = false
    }
  }, [settlementIdParam])

  // If no settlement ID is provided, display a message
  if (!settlementIdParam)
    return (
      <div className="grid grid-rows-[0px_1fr_0px] grid-rows-[1fr] items-center justify-items-center sm:p-8 pb-20 gap-8 sm:gap-16 font-[family-name:var(--font-geist-sans)]">
        <h1 className="text-4xl sm:text-5xl font-bold pt-[20px] text-center">
          Settlement Not Found
        </h1>
        <p className="text-xl text-center">
          No settlement ID was specified. Please go to the settlements list or
          create a new one.
        </p>
        <div className="mt-6">
          <Button
            onClick={() => (window.location.href = '/kdm/settlement/create')}
            variant="default">
            Create a Settlement
          </Button>
        </div>
      </div>
    )

  // If settlement data is still loading or not found
  if (!settlement)
    return (
      <div className="grid grid-rows-[0px_1fr_0px] grid-rows-[1fr] items-center justify-items-center sm:p-8 pb-20 gap-8 sm:gap-16 font-[family-name:var(--font-geist-sans)]">
        <h1 className="text-4xl sm:text-5xl font-bold pt-[20px] text-center">
          {isMounted.current ? 'Settlement Not Found' : 'Loading Settlement...'}
        </h1>
        <p className="text-xl text-center">
          {isMounted.current
            ? `No settlement was found with the ID: ${settlementIdParam}`
            : 'Loading Settlement...'}
        </p>
        {isMounted.current && (
          <div className="mt-6">
            <Button
              onClick={() => (window.location.href = '/kdm/settlement/create')}
              variant="default">
              Create a Settlement
            </Button>
          </div>
        )}
      </div>
    )

  // If we have a valid settlement, render the form
  return <SettlementForm settlement={settlement} />
}

// Create a loading component to show during suspense
function SettlementLoading(): ReactElement {
  return (
    <div className="grid grid-rows-[0px_1fr_0px] grid-rows-[1fr] items-center justify-items-center sm:p-8 pb-20 gap-8 sm:gap-16 font-[family-name:var(--font-geist-sans)]">
      <h1 className="text-4xl sm:text-5xl font-bold pt-[20px] text-center">
        Loading Settlement...
      </h1>
      <p className="text-xl text-center">
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
