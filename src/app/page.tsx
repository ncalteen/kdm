'use client'

import { AppSidebar } from '@/components/app-sidebar'
import { SettlementForm } from '@/components/settlement/settlement-form'
import { SiteHeader } from '@/components/side-header'
import { Form } from '@/components/ui/form'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { useSelectedHunt } from '@/contexts/selected-hunt-context'
import { useSelectedSettlement } from '@/contexts/selected-settlement-context'
import { useSelectedShowdown } from '@/contexts/selected-showdown-context'
import { useSelectedSurvivor } from '@/contexts/selected-survivor-context'
import { useSelectedTab } from '@/contexts/selected-tab-context'
import { useSurvivors } from '@/contexts/survivors-context'
import { useSelectedHuntSave } from '@/hooks/use-selected-hunt-save'
import { useSelectedSettlementSave } from '@/hooks/use-selected-settlement-save'
import { useSelectedShowdownSave } from '@/hooks/use-selected-showdown-save'
import { useSelectedSurvivorSave } from '@/hooks/use-selected-survivor-save'
import { Hunt, HuntSchema } from '@/schemas/hunt'
import { Settlement, SettlementSchema } from '@/schemas/settlement'
import { Showdown, ShowdownSchema } from '@/schemas/showdown'
import { Survivor, SurvivorSchema } from '@/schemas/survivor'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  ReactElement,
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react'
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
  const {
    isCreatingNewShowdown,
    selectedShowdown,
    setIsCreatingNewShowdown,
    setSelectedShowdown,
    updateSelectedShowdown
  } = useSelectedShowdown()
  const { setSelectedTab, selectedTab } = useSelectedTab()
  const { setSurvivors, survivors } = useSurvivors()

  // Memoize form configurations to prevent unnecessary re-initializations
  const huntFormConfig = useMemo(
    () => ({
      resolver: zodResolver(HuntSchema) as Resolver<Hunt>,
      defaultValues: selectedHunt || undefined
    }),
    [selectedHunt]
  )

  const settlementFormConfig = useMemo(
    () => ({
      resolver: zodResolver(SettlementSchema) as Resolver<Settlement>,
      defaultValues: selectedSettlement || undefined
    }),
    [selectedSettlement]
  )

  const showdownFormConfig = useMemo(
    () => ({
      resolver: zodResolver(ShowdownSchema) as Resolver<Showdown>,
      defaultValues: selectedShowdown || undefined
    }),
    [selectedShowdown]
  )

  const survivorFormConfig = useMemo(
    () => ({
      resolver: zodResolver(SurvivorSchema) as Resolver<Survivor>,
      defaultValues: selectedSurvivor || undefined
    }),
    [selectedSurvivor]
  )

  // Initialize the form data from the context
  const huntForm = useForm<Hunt>(huntFormConfig)
  const settlementForm = useForm<Settlement>(settlementFormConfig)
  const showdownForm = useForm<Showdown>(showdownFormConfig)
  const survivorForm = useForm<Survivor>(survivorFormConfig)

  // Initialize save hooks with the forms and update functions
  const { saveSelectedHunt } = useSelectedHuntSave(huntForm, updateSelectedHunt)
  const { saveSelectedSettlement } = useSelectedSettlementSave(
    settlementForm,
    updateSelectedSettlement
  )
  const { saveSelectedShowdown } = useSelectedShowdownSave(
    showdownForm,
    updateSelectedShowdown
  )
  const { saveSelectedSurvivor } = useSelectedSurvivorSave(
    survivorForm,
    updateSelectedSurvivor
  )

  // Updates both settlement and active hunt contexts
  const handleSetSelectedSettlement = useMemo(
    () => (settlement: Settlement | null) => {
      setSelectedSettlement(settlement)
      updateSelectedHunt()
      updateSelectedSettlement()
      updateSelectedShowdown()
    },
    [
      setSelectedSettlement,
      updateSelectedHunt,
      updateSelectedSettlement,
      updateSelectedShowdown
    ]
  )

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

      // Reset the showdown form
      if (selectedShowdown) showdownForm.reset(selectedShowdown)
    }
  }, [
    huntForm,
    selectedHunt,
    selectedSettlement,
    selectedShowdown,
    selectedSurvivor?.settlementId,
    setSelectedSurvivor,
    settlementForm,
    showdownForm
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
            selectedShowdown={selectedShowdown}
            setSelectedHunt={setSelectedHunt}
            setSelectedSettlement={handleSetSelectedSettlement}
            setSelectedShowdown={setSelectedShowdown}
            setSelectedSurvivor={setSelectedSurvivor}
          />
          <SidebarInset>
            <Form {...settlementForm}>
              <Form {...survivorForm}>
                <Form {...huntForm}>
                  <SettlementForm
                    isCreatingNewHunt={isCreatingNewHunt}
                    isCreatingNewShowdown={isCreatingNewShowdown}
                    isCreatingNewSurvivor={isCreatingNewSurvivor}
                    saveSelectedHunt={saveSelectedHunt}
                    saveSelectedSettlement={saveSelectedSettlement}
                    saveSelectedShowdown={saveSelectedShowdown}
                    saveSelectedSurvivor={saveSelectedSurvivor}
                    selectedHunt={selectedHunt}
                    selectedSettlement={selectedSettlement}
                    selectedShowdown={selectedShowdown}
                    selectedSurvivor={selectedSurvivor}
                    selectedTab={selectedTab}
                    setIsCreatingNewHunt={setIsCreatingNewHunt}
                    setIsCreatingNewShowdown={setIsCreatingNewShowdown}
                    setIsCreatingNewSurvivor={setIsCreatingNewSurvivor}
                    setSelectedHunt={setSelectedHunt}
                    setSelectedSettlement={handleSetSelectedSettlement}
                    setSelectedShowdown={setSelectedShowdown}
                    setSelectedSurvivor={setSelectedSurvivor}
                    setSelectedTab={setSelectedTab}
                    setSurvivors={setSurvivors}
                    settlementForm={settlementForm}
                    survivors={survivors}
                    updateSelectedHunt={updateSelectedHunt}
                    updateSelectedSettlement={updateSelectedSettlement}
                    updateSelectedShowdown={updateSelectedShowdown}
                    updateSelectedSurvivor={updateSelectedSurvivor}
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
