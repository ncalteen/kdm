'use client'

import { AppSidebar } from '@/components/app-sidebar'
import { MigrationAlertDialog } from '@/components/migration-alert-dialog'
import { SettlementForm } from '@/components/settlement/settlement-form'
import { SiteHeader } from '@/components/side-header'
import { Form } from '@/components/ui/form'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { useCampaign } from '@/contexts/campaign-context'
import { useSelectedHuntSave } from '@/hooks/use-selected-hunt-save'
import { useSelectedSettlementSave } from '@/hooks/use-selected-settlement-save'
import { useSelectedShowdownSave } from '@/hooks/use-selected-showdown-save'
import { useSelectedSurvivorSave } from '@/hooks/use-selected-survivor-save'
import { SchemaVersion, TabType } from '@/lib/enums'
import { migrateCampaign } from '@/lib/migrate'
import { Campaign } from '@/schemas/campaign'
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
import packageInfo from '../../package.json'

/**
 * Main Page Component
 *
 * Includes a Suspense boundary for loading state.
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
 * Loading Component
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
        All-seeing eyes pierce the darkness, looking for settlements.
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
    // Mark component as mounted
    console.debug('[MainPageContent] Mounted')
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
  if (isLoading)
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

  return <MainPage />
}

/**
 * Main Page Component
 *
 * @returns Main Page Component
 */
function MainPage(): ReactElement {
  const {
    campaign,

    // isCreatingNewHunt,
    // isCreatingNewSettlement,
    // isCreatingNewShowdown,
    isCreatingNewSurvivor,

    // setIsCreatingNewHunt,
    // setIsCreatingNewSettlement,
    // setIsCreatingNewShowdown,
    setIsCreatingNewSurvivor,

    setSelectedHunt,
    setSelectedHuntMonsterIndex,
    setSelectedSettlement,
    setSelectedShowdown,
    setSelectedShowdownMonsterIndex,
    setSelectedSurvivor,
    setSelectedTab,
    setVersion,

    updateCampaign,
    updateSelectedHunt,
    updateSelectedSettlement,
    updateSelectedShowdown,
    updateSelectedSurvivor,

    version
  } = useCampaign()

  const selectedHunt = useMemo(
    () =>
      campaign.hunts?.find((hunt) => hunt.id === campaign.selectedHuntId) ||
      null,
    [campaign.hunts, campaign.selectedHuntId]
  )
  const selectedHuntMonsterIndex = useMemo(
    () => campaign.selectedHuntMonsterIndex || 0,
    [campaign.selectedHuntMonsterIndex]
  )
  const selectedSettlement = useMemo(
    () =>
      campaign.settlements.find(
        (settlement) => settlement.id === campaign.selectedSettlementId
      ) || null,
    [campaign.settlements, campaign.selectedSettlementId]
  )
  const selectedShowdown = useMemo(
    () =>
      campaign.showdowns?.find(
        (showdown) => showdown.id === campaign.selectedShowdownId
      ) || null,
    [campaign.showdowns, campaign.selectedShowdownId]
  )
  const selectedShowdownMonsterIndex = useMemo(
    () => campaign.selectedShowdownMonsterIndex || 0,
    [campaign.selectedShowdownMonsterIndex]
  )
  const selectedSurvivor = useMemo(
    () =>
      campaign.survivors?.find(
        (survivor) => survivor.id === campaign.selectedSurvivorId
      ) || null,
    [campaign.survivors, campaign.selectedSurvivorId]
  )
  const selectedTab = useMemo(
    () => campaign.selectedTab || TabType.TIMELINE,
    [campaign.selectedTab]
  )

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

  const migrationStatus = useMemo(
    () => ({
      migrate: version !== packageInfo.version,
      current: version ?? '0.12.0'
    }),
    [version]
  )

  // Initialize the form data from the context
  const huntForm = useForm<Hunt>(huntFormConfig)
  const settlementForm = useForm<Settlement>(settlementFormConfig)
  const showdownForm = useForm<Showdown>(showdownFormConfig)
  const survivorForm = useForm<Survivor>(survivorFormConfig)

  // Reset forms when selected entities change to keep form data in sync
  useEffect(() => {
    if (selectedSettlement) settlementForm.reset(selectedSettlement)
  }, [selectedSettlement, settlementForm])

  useEffect(() => {
    if (selectedHunt) huntForm.reset(selectedHunt)
  }, [selectedHunt, huntForm])

  useEffect(() => {
    if (selectedShowdown) showdownForm.reset(selectedShowdown)
  }, [selectedShowdown, showdownForm])

  useEffect(() => {
    if (selectedSurvivor) survivorForm.reset(selectedSurvivor)
  }, [selectedSurvivor, survivorForm])

  // Initialize save hooks with the forms and update functions
  const { saveSelectedHunt } = useSelectedHuntSave(
    campaign,
    huntForm,
    updateSelectedHunt,
    updateCampaign
  )
  const { saveSelectedSettlement } = useSelectedSettlementSave(
    campaign,
    settlementForm,
    updateSelectedSettlement,
    updateCampaign
  )
  const { saveSelectedShowdown } = useSelectedShowdownSave(
    campaign,
    showdownForm,
    updateSelectedShowdown,
    updateCampaign
  )
  const { saveSelectedSurvivor } = useSelectedSurvivorSave(
    campaign,
    survivorForm,
    updateSelectedSurvivor,
    updateCampaign
  )

  const handleMigrationConfirm = (): void => {
    console.debug(
      `[MainPage] Migration confirmed. Updating campaign version ${version} -> ${packageInfo.version}`
    )

    updateCampaign(migrateCampaign(campaign))
    setVersion(packageInfo.version)
  }

  const loadTestData = async (version: SchemaVersion): Promise<void> => {
    console.debug(`[MainPage] Loading Test Data for Version ${version}`)

    const data = await (async () => {
      switch (version) {
        case SchemaVersion.V0_12_0:
          return await import('../../__fixtures__/campaigns/0.12.0.json')
        case SchemaVersion.V0_13_0:
          return await import('../../__fixtures__/campaigns/0.13.0.json')
        case SchemaVersion.V0_14_0:
        case SchemaVersion.V0_14_1:
        case SchemaVersion.V0_14_2:
          return await import('../../__fixtures__/campaigns/0.14.0.json')
        case SchemaVersion.V0_15_0:
          return await import('../../__fixtures__/campaigns/0.15.0.json')
        default:
          return null
      }
    })()

    if (!data) {
      console.warn(`[MainPage] No Data Found for Version ${version}`)
      return
    }

    updateCampaign(data as unknown as Campaign)
    setVersion(data.version)
  }

  return (
    <div className="[--header-height:calc(--spacing(10))] min-w-[450px]">
      <SidebarProvider className="flex flex-col">
        <SiteHeader />

        <div className="flex flex-1 pt-(--header-height)">
          <AppSidebar
            campaign={campaign}
            selectedHunt={selectedHunt}
            selectedSettlement={selectedSettlement}
            selectedShowdown={selectedShowdown}
            selectedTab={selectedTab}
            setSelectedHunt={setSelectedHunt}
            setSelectedSettlement={setSelectedSettlement}
            setSelectedShowdown={setSelectedShowdown}
            setSelectedSurvivor={setSelectedSurvivor}
            setSelectedTab={setSelectedTab}
            updateCampaign={updateCampaign}
          />
          <SidebarInset>
            {migrationStatus.migrate && (
              <MigrationAlertDialog
                campaign={campaign}
                current={migrationStatus.current}
                loadTestData={loadTestData}
                migrate={migrationStatus.migrate}
                onConfirm={handleMigrationConfirm}
                target={packageInfo.version}
              />
            )}
            {!migrationStatus.migrate && (
              <Form {...settlementForm}>
                <Form {...survivorForm}>
                  <Form {...huntForm}>
                    <SettlementForm
                      campaign={campaign}
                      isCreatingNewSurvivor={isCreatingNewSurvivor}
                      loadTestData={loadTestData}
                      saveSelectedHunt={saveSelectedHunt}
                      saveSelectedSettlement={saveSelectedSettlement}
                      saveSelectedShowdown={saveSelectedShowdown}
                      saveSelectedSurvivor={saveSelectedSurvivor}
                      selectedHunt={selectedHunt}
                      selectedHuntMonsterIndex={selectedHuntMonsterIndex}
                      selectedSettlement={selectedSettlement}
                      selectedShowdown={selectedShowdown}
                      selectedShowdownMonsterIndex={
                        selectedShowdownMonsterIndex
                      }
                      selectedSurvivor={selectedSurvivor}
                      selectedTab={selectedTab}
                      setIsCreatingNewSurvivor={setIsCreatingNewSurvivor}
                      setSelectedHunt={setSelectedHunt}
                      setSelectedHuntMonsterIndex={setSelectedHuntMonsterIndex}
                      setSelectedSettlement={setSelectedSettlement}
                      setSelectedShowdown={setSelectedShowdown}
                      setSelectedShowdownMonsterIndex={
                        setSelectedShowdownMonsterIndex
                      }
                      setSelectedSurvivor={setSelectedSurvivor}
                      setSelectedTab={setSelectedTab}
                      updateCampaign={updateCampaign}
                    />
                  </Form>
                </Form>
              </Form>
            )}
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  )
}
