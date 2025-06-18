'use client'

import { AppSidebar } from '@/components/app-sidebar'
import { SettlementForm } from '@/components/settlement/settlement-form'
import { SiteHeader } from '@/components/side-header'
import { Form } from '@/components/ui/form'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { useSelectedHunt } from '@/contexts/selected-hunt-context'
import { useSelectedSettlement } from '@/contexts/selected-settlement-context'
import { useSelectedSurvivor } from '@/contexts/selected-survivor-context'
import { useSelectedTab } from '@/contexts/selected-tab-context'
import { useSurvivors } from '@/contexts/survivors-context'
import { useSelectedHuntSave } from '@/hooks/use-selected-hunt-save'
import { useSelectedSettlementSave } from '@/hooks/use-selected-settlement-save'
import { useSelectedSurvivorSave } from '@/hooks/use-selected-survivor-save'
import { Hunt, HuntSchema } from '@/schemas/hunt'
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

  // Effect to handle component mount and loading state
  useEffect(() => {
    console.debug('[MainPageContent] Mounted')
    // Mark component as mounted
    isMounted.current = true

    // Simulate async behavior to show loading state briefly
    setTimeout(() => {
      if (isMounted.current) setIsLoading(false)
    }, 100)

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
    // isCreatingNewSettlement,
    selectedSettlement,
    // setIsCreatingNewSettlement,
    setSelectedSettlement,
    updateSelectedSettlement
  } = useSelectedSettlement()
  const {
    isCreatingNewSurvivor,
    selectedSurvivor,
    setIsCreatingNewSurvivor,
    setSelectedSurvivor,
    updateSelectedSurvivor
  } = useSelectedSurvivor()
  const {
    isCreatingNewHunt,
    selectedHunt,
    setIsCreatingNewHunt,
    setSelectedHunt,
    updateSelectedHunt
  } = useSelectedHunt()
  const { selectedTab } = useSelectedTab()
  const { setSurvivors, survivors, updateSurvivors } = useSurvivors()

  // Initialize the form data from the context
  const huntForm = useForm<Hunt>({
    resolver: zodResolver(HuntSchema) as Resolver<Hunt>,
    defaultValues: selectedHunt || undefined
  })
  const settlementForm = useForm<Settlement>({
    resolver: zodResolver(SettlementSchema) as Resolver<Settlement>,
    defaultValues: selectedSettlement || undefined
  })
  const survivorForm = useForm<Survivor>({
    resolver: zodResolver(SurvivorSchema) as Resolver<Survivor>,
    defaultValues: selectedSurvivor || undefined
  })

  // Initialize save hooks with the forms and update functions
  const { saveSelectedHunt } = useSelectedHuntSave(huntForm, updateSelectedHunt)
  const { saveSelectedSettlement } = useSelectedSettlementSave(
    settlementForm,
    updateSelectedSettlement
  )
  const { saveSelectedSurvivor } = useSelectedSurvivorSave(
    survivorForm,
    updateSelectedSurvivor
  )

  // Updates both settlement and active hunt contexts
  const handleSetSelectedSettlement = (settlement: Settlement | null) => {
    setSelectedSettlement(settlement)
    updateSelectedSettlement()
    updateSelectedHunt()
  }

  // Handle settlement data changes
  useEffect(() => {
    console.debug('[Page] Selected Settlement Changed')

    // If the settlement changes, reset the settlement form
    if (selectedSettlement) {
      settlementForm.reset(selectedSettlement)

      // Clear selected survivor if it doesn't belong to current settlement
      if (selectedSurvivor?.settlementId !== selectedSettlement.id)
        setSelectedSurvivor(null)

      // Reset the hunt form
      if (selectedHunt) huntForm.reset(selectedHunt)
    }
  }, [
    selectedSettlement,
    selectedSurvivor?.settlementId,
    setSelectedSurvivor,
    settlementForm,
    huntForm,
    selectedHunt
  ])

  // Reset the survivor form when the selected survivor changes
  useEffect(() => {
    console.debug('[Page] Selected Survivor Changed')
    if (selectedSurvivor) survivorForm.reset(selectedSurvivor)
  }, [selectedSurvivor, survivorForm])

  return (
    <div className="[--header-height:calc(--spacing(10))] min-w-[450px]">
      <SidebarProvider className="flex flex-col">
        {/* Header requires the settlement form to display high-level data */}
        <SiteHeader />

        <div className="flex flex-1 pt-(--header-height)">
          <AppSidebar
            selectedHunt={selectedHunt}
            selectedSettlement={selectedSettlement}
            selectedShowdown={null} // Showdown not implemented yet
            setSelectedHunt={setSelectedHunt}
            setSelectedSettlement={handleSetSelectedSettlement}
            setSelectedShowdown={() => {}} // No showdown context yet
            setSelectedSurvivor={setSelectedSurvivor}
          />
          <SidebarInset>
            <Form {...settlementForm}>
              <Form {...survivorForm}>
                <Form {...huntForm}>
                  <SettlementForm
                    huntForm={huntForm}
                    isCreatingNewHunt={isCreatingNewHunt}
                    isCreatingNewSurvivor={isCreatingNewSurvivor}
                    saveSelectedHunt={saveSelectedHunt}
                    saveSelectedSettlement={saveSelectedSettlement}
                    saveSelectedSurvivor={saveSelectedSurvivor}
                    selectedHunt={selectedHunt}
                    selectedSettlement={selectedSettlement}
                    selectedSurvivor={selectedSurvivor}
                    selectedTab={selectedTab}
                    setIsCreatingNewHunt={setIsCreatingNewHunt}
                    setIsCreatingNewSurvivor={setIsCreatingNewSurvivor}
                    setSelectedHunt={setSelectedHunt}
                    setSelectedSettlement={handleSetSelectedSettlement}
                    setSelectedSurvivor={setSelectedSurvivor}
                    setSurvivors={setSurvivors}
                    settlementForm={settlementForm}
                    survivorForm={survivorForm}
                    survivors={survivors}
                    updateSelectedHunt={updateSelectedHunt}
                    updateSelectedSettlement={updateSelectedSettlement}
                    updateSelectedSurvivor={updateSelectedSurvivor}
                    updateSurvivors={updateSurvivors}
                  />
                </Form>
              </Form>
            </Form>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  )
}
