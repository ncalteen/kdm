'use client'

import { AppSidebar } from '@/components/app-sidebar'
import { SettlementForm } from '@/components/settlement/settlement-form'
import { SiteHeader } from '@/components/side-header'
import { Form } from '@/components/ui/form'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { useSettlement } from '@/contexts/settlement-context'
import { useSurvivor } from '@/contexts/survivor-context'
import { useTab } from '@/contexts/tab-context'
import { useSettlementSave } from '@/hooks/use-settlement-save'
import { useSurvivorSave } from '@/hooks/use-survivor-save'
import { Settlement, SettlementSchema } from '@/schemas/settlement'
import { Survivor, SurvivorSchema } from '@/schemas/survivor'
import { zodResolver } from '@hookform/resolvers/zod'
import { ReactElement, Suspense, useEffect, useRef, useState } from 'react'
import { Resolver, useForm } from 'react-hook-form'

/**
 * Main Page Component (with Suspense Boundary)
 *
 * @returns Main Page Component
 */
export default function Page(): ReactElement {
  return (
    <Suspense fallback={<MainPageLoading />}>
      <MainPageContent />
    </Suspense>
  )
}

/**
 * Loading Component for Suspense Boundary
 *
 * @returns Loading Component
 */
function MainPageLoading(): ReactElement {
  return (
    <div className="grid grid-rows-[1fr] items-center justify-items-center sm:p-8 pb-20 gap-8 sm:gap-16 font-[family-name:var(--font-geist-sans)]">
      <h1 className="text-3xl sm:text-4xl font-bold pt-[20px] text-center">
        Loading...
      </h1>
      <p className="text-md text-center">
        All seeing eyes pierce the darkness, looking for settlements.
      </p>
    </div>
  )
}

/**
 * Main Page Content Component
 *
 * @returns Main Page Content Component
 */
function MainPageContent(): ReactElement {
  // Track if the component is mounted and loading state
  const isMounted = useRef(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Mark component as mounted
    isMounted.current = true

    // Simulate async behavior to show loading state briefly
    setTimeout(() => {
      if (isMounted.current) {
        setIsLoading(false)
      }
    }, 100) // Brief delay to ensure contexts are initialized

    return () => {
      isMounted.current = false
    }
  }, [])

  // Show loading state while initializing
  if (isLoading) {
    return (
      <div className="grid grid-rows-[1fr] items-center justify-items-center gap-8">
        <h1 className="text-3xl sm:text-4xl font-bold pt-[20px] text-center">
          Initializing...
        </h1>
        <p className="text-md text-center">
          Preparing the settlement records and survivor chronicles...
        </p>
      </div>
    )
  }

  return <MainPage />
}

/**
 * Main Page Component
 *
 * @returns Main Page Component
 */
function MainPage(): ReactElement {
  const {
    selectedSettlement,
    updateSelectedSettlement,
    setSelectedSettlement
  } = useSettlement()
  const {
    selectedSurvivor,
    setSelectedSurvivor,
    isCreatingNewSurvivor,
    updateSelectedSurvivor,
    setIsCreatingNewSurvivor
  } = useSurvivor()
  const { selectedTab } = useTab()

  // Initialize the settlement form data from the context
  const settlementForm = useForm<Settlement>({
    resolver: zodResolver(SettlementSchema) as Resolver<Settlement>,
    defaultValues: selectedSettlement || undefined
  })
  const { saveSettlement } = useSettlementSave(
    settlementForm,
    updateSelectedSettlement
  )

  // Initialize the survivor form data from the context
  const survivorForm = useForm<Survivor>({
    resolver: zodResolver(SurvivorSchema) as Resolver<Survivor>,
    defaultValues: selectedSurvivor || undefined
  })
  const { saveSurvivor } = useSurvivorSave(survivorForm, updateSelectedSurvivor)

  const selectedSurvivorSettlementId = selectedSurvivor?.settlementId

  useEffect(() => {
    // If the settlement changes, reset the settlement form with the selected
    // settlement data. Clear the selected survivor only if it doesn't belong
    // to the current settlement.
    if (selectedSettlement) {
      settlementForm.reset(selectedSettlement)

      // Clear selected survivor if it doesn't belong to current settlement
      if (selectedSurvivorSettlementId !== selectedSettlement.id)
        setSelectedSurvivor(null)
    }
  }, [
    selectedSettlement,
    selectedSurvivorSettlementId,
    setSelectedSurvivor,
    settlementForm
  ])

  useEffect(() => {
    // Reset the survivor form when the selected survivor changes
    if (selectedSurvivor) survivorForm.reset(selectedSurvivor)
  }, [selectedSurvivor, survivorForm])

  return (
    <div className="[--header-height:calc(--spacing(10))]">
      <SidebarProvider className="flex flex-col">
        {/* Header requires the settlement form to display high-level data */}
        <SiteHeader />

        <div className="flex flex-1 pt-(--header-height)">
          <AppSidebar
            settlement={selectedSettlement}
            setSelectedSettlement={setSelectedSettlement}
          />
          <SidebarInset>
            <Form {...settlementForm}>
              <Form {...survivorForm}>
                <SettlementForm
                  settlement={selectedSettlement}
                  saveSettlement={saveSettlement}
                  isCreatingNewSurvivor={isCreatingNewSurvivor}
                  setIsCreatingNewSurvivor={setIsCreatingNewSurvivor}
                  updateSelectedSurvivor={updateSelectedSurvivor}
                  saveSurvivor={saveSurvivor}
                  setSelectedSurvivor={setSelectedSurvivor}
                  survivor={selectedSurvivor}
                  selectedTab={selectedTab}
                  survivorForm={survivorForm}
                  settlementForm={settlementForm}
                  setSelectedSettlement={setSelectedSettlement}
                />
              </Form>
            </Form>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  )
}
