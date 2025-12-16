'use client'

import { SettlementSwitcher } from '@/components/menu/settlement-switcher'
import { NavMain } from '@/components/nav-main'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar
} from '@/components/ui/sidebar'
import { CampaignType, SurvivorType, TabType } from '@/lib/enums'
import {
  ERROR_MESSAGE,
  SETTLEMENT_LOADED_MESSAGE,
  SETTLEMENT_SAVED_MESSAGE
} from '@/lib/messages'
import { getCampaign } from '@/lib/utils'
import { Campaign, CampaignSchema } from '@/schemas/campaign'
import { Hunt } from '@/schemas/hunt'
import { Settlement } from '@/schemas/settlement'
import { Showdown } from '@/schemas/showdown'
import { Survivor } from '@/schemas/survivor'
import {
  DownloadIcon,
  HourglassIcon,
  LightbulbIcon,
  NotebookPenIcon,
  PawPrintIcon,
  SchoolIcon,
  SettingsIcon,
  SkullIcon,
  SwordsIcon,
  UploadIcon,
  UsersIcon,
  WrenchIcon
} from 'lucide-react'
import {
  ChangeEvent,
  ComponentProps,
  ReactElement,
  useEffect,
  useRef,
  useState
} from 'react'
import { toast } from 'sonner'

const baseNavPrimary = [
  {
    title: 'Timeline',
    tab: TabType.TIMELINE,
    icon: HourglassIcon
  },
  {
    title: 'Monsters',
    tab: TabType.MONSTERS,
    icon: SwordsIcon
  },
  {
    title: 'Survivors',
    tab: TabType.SURVIVORS,
    icon: UsersIcon
  },
  {
    title: 'Society',
    tab: TabType.SOCIETY,
    icon: SchoolIcon
  },
  {
    title: 'Crafting',
    tab: TabType.CRAFTING,
    icon: WrenchIcon
  },
  {
    title: 'Notes',
    tab: TabType.NOTES,
    icon: NotebookPenIcon
  }
]

const navSquires = [
  {
    title: 'Timeline',
    tab: TabType.TIMELINE,
    icon: HourglassIcon
  },
  {
    title: 'Monsters',
    tab: TabType.MONSTERS,
    icon: SwordsIcon
  },
  {
    title: 'Squires',
    tab: TabType.SQUIRES,
    icon: UsersIcon
  },
  {
    title: 'Society',
    tab: TabType.SOCIETY,
    icon: SchoolIcon
  },
  {
    title: 'Crafting',
    tab: TabType.CRAFTING,
    icon: WrenchIcon
  },
  {
    title: 'Notes',
    tab: TabType.NOTES,
    icon: NotebookPenIcon
  }
]

const navEmbark = [
  {
    title: 'Hunt',
    tab: TabType.HUNT,
    icon: PawPrintIcon
  },
  {
    title: 'Showdown',
    tab: TabType.SHOWDOWN,
    icon: SkullIcon
  }
]

const navSettings = [
  {
    title: 'Settings',
    tab: TabType.SETTINGS,
    icon: SettingsIcon
  }
]

/**
 * Application Sidebar Properties
 */
interface AppSidebarProps extends ComponentProps<typeof Sidebar> {
  /** Selected Hunt */
  selectedHunt: Hunt | null
  /** Selected Settlement */
  selectedSettlement: Settlement | null
  /** Selected Showdown */
  selectedShowdown: Showdown | null
  /** Set Selected Hunt */
  setSelectedHunt: (hunt: Hunt | null) => void
  /** Set Selected Settlement */
  setSelectedSettlement: (settlement: Settlement | null) => void
  /** Set Selected Showdown */
  setSelectedShowdown: (showdown: Showdown | null) => void
  /** Set Selected Survivor */
  setSelectedSurvivor: (survivor: Survivor | null) => void
}

/**
 * Application Sidebar Component
 *
 * @param props Application Sidebar Properties
 * @returns Application Sidebar Component
 */
export function AppSidebar({
  selectedHunt,
  selectedSettlement,
  selectedShowdown,
  setSelectedHunt,
  setSelectedSettlement,
  setSelectedShowdown,
  setSelectedSurvivor,
  ...props
}: AppSidebarProps): ReactElement {
  const { state } = useSidebar()

  const [campaign, setCampaign] = useState<Campaign>(() => getCampaign())
  const [isDownloading, setIsDownloading] = useState<boolean>(false)
  const [isUploading, setIsUploading] = useState<boolean>(false)
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false)
  const [uploadedData, setUploadedData] = useState<Campaign | undefined>(
    undefined
  )
  const [validationErrors, setValidationErrors] = useState<string[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [navItems, setNavItems] = useState(baseNavPrimary)
  const [isMounted, setIsMounted] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  // Update navigation items based on settlement context
  useEffect(() => {
    if (!isMounted) return setIsMounted(true)

    console.debug(
      '[AppSidebar] Updating Navigation Items',
      selectedSettlement?.campaignType,
      selectedSettlement?.survivorType,
      isMounted
    )

    if (
      selectedSettlement?.campaignType === CampaignType.SQUIRES_OF_THE_CITADEL
    )
      return setNavItems([...navSquires])

    // Start with base navigation
    const newNavItems = [...baseNavPrimary]

    if (selectedSettlement?.survivorType === SurvivorType.ARC) {
      const notesIndex = newNavItems.findIndex((item) => item.tab === 'notes')

      if (notesIndex !== -1)
        newNavItems.splice(notesIndex, 0, {
          title: 'Arc',
          tab: TabType.ARC,
          icon: LightbulbIcon
        })
    }

    setNavItems(newNavItems)
  }, [
    selectedSettlement?.campaignType,
    selectedSettlement?.survivorType,
    isMounted
  ])

  // Listen for campaign changes and update the local state
  useEffect(() => {
    const handleStorageChange = () => setCampaign(getCampaign())

    // Listen for storage events (when localStorage changes from other tabs)
    window.addEventListener('storage', handleStorageChange)

    // Listen for custom events when localStorage is updated from the same tab
    window.addEventListener('campaignUpdated', handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('campaignUpdated', handleStorageChange)
    }
  }, [])

  const handleDownload = () => {
    try {
      setIsDownloading(true)

      const campaignJson = JSON.stringify(getCampaign(), null, 2)
      const blob = new Blob([campaignJson], { type: 'application/json' })
      const url = URL.createObjectURL(blob)

      // Create a link element to trigger the download
      const a = document.createElement('a')
      a.href = url
      a.download = 'kdm-campaign.json'

      // Trigger the download
      document.body.appendChild(a)
      a.click()

      // Cleanup
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast.success(SETTLEMENT_SAVED_MESSAGE())
    } catch (error) {
      console.error('Download Campaign Error:', error)
      toast.error(ERROR_MESSAGE())
    } finally {
      setIsDownloading(false)
    }
  }

  /**
   * Handles the file selection and validation.
   *
   * @param event File Input Change Event
   */
  const handleFileSelection = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (!file) return

    setIsUploading(true)
    setValidationErrors([])

    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const jsonData = JSON.parse(e.target?.result as string)
        const result = CampaignSchema.safeParse(jsonData)

        if (result.success) {
          // Data is valid
          setUploadedData(jsonData)
          setShowConfirmation(true)
        } else {
          // Collect validation errors
          const errors = result.error.issues.map(
            (err) => `${err.path.join('.')}: ${err.message}`
          )

          setValidationErrors(errors)
          setUploadedData(undefined)
          setShowConfirmation(false)
        }
      } catch (error) {
        console.error('Upload Campaign JSON Error:', error)
        setValidationErrors([ERROR_MESSAGE()])

        setUploadedData(undefined)
        setShowConfirmation(false)
      } finally {
        setIsUploading(false)
      }
    }

    reader.onerror = () => {
      console.error('Read Campaign JSON Error:', reader.error)
      toast.error(ERROR_MESSAGE())
      setIsUploading(false)
    }

    reader.readAsText(file)
  }

  /**
   * Confirms the upload and replaces the existing campaign data.
   */
  const confirmUpload = () => {
    if (!uploadedData) return

    try {
      // Replace existing campaign data
      localStorage.setItem('campaign', JSON.stringify(uploadedData))
      toast.success(SETTLEMENT_LOADED_MESSAGE())

      // Reset state
      setUploadedData(undefined)
      setShowConfirmation(false)
      setIsOpen(false)

      // Clear file input
      if (fileInputRef.current) fileInputRef.current.value = ''

      // Reload the page to reflect changes
      window.location.reload()
    } catch (error) {
      console.error('Upload Campaign Error:', error)
      toast.error(ERROR_MESSAGE())
    }
  }

  /**
   * Handles the dialog close event.
   */
  const handleDialogClose = () => {
    setUploadedData(undefined)
    setShowConfirmation(false)
    setValidationErrors([])

    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <Sidebar
      collapsible="icon"
      className="top-(--header-height) h-[calc(100svh-var(--header-height))]!"
      {...props}>
      <SidebarHeader>
        <SettlementSwitcher
          selectedHunt={selectedHunt}
          selectedSettlement={selectedSettlement}
          selectedShowdown={selectedShowdown}
          settlements={campaign.settlements || []}
          setSelectedHunt={setSelectedHunt}
          setSelectedSettlement={setSelectedSettlement}
          setSelectedShowdown={setSelectedShowdown}
          setSelectedSurvivor={setSelectedSurvivor}
        />
      </SidebarHeader>

      <SidebarContent className="group-data-[collapsible=icon]:justify-center">
        <SidebarGroup className="group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:flex-1">
          <SidebarGroupLabel>Settlement</SidebarGroupLabel>
          <NavMain items={navItems} />
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Embark</SidebarGroupLabel>
          <NavMain items={navEmbark} />
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Configuration</SidebarGroupLabel>
          <NavMain items={navSettings} />
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        {state === 'expanded' && (
          <p className="text-center text-xs text-gray-500 pb-2">
            This project is not affiliated with or endorsed by Kingdom Death:
            Monster or its creators. It is a fan-made project created for
            personal use and entertainment purposes only. All rights to Kingdom
            Death: Monster and its associated materials are owned by their
            respective copyright holders. This project is intended to be a tool
            for players to enhance their experience with the game and is not
            intended for commercial use or distribution.
          </p>
        )}

        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleDownload}
              disabled={isDownloading}
              variant="outline"
              size="sm">
              <DownloadIcon className="h-4 w-4" />
              Preserve Records
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
              <AlertDialogTrigger asChild>
                <SidebarMenuButton
                  onClick={() => setIsOpen(true)}
                  disabled={isUploading}
                  variant="outline"
                  size="sm">
                  <UploadIcon className="h-4 w-4" />
                  Upload Records
                </SidebarMenuButton>
              </AlertDialogTrigger>{' '}
              <AlertDialogContent
                className="max-w-md"
                onCloseAutoFocus={handleDialogClose}>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    {showConfirmation
                      ? 'Your lantern flickers with indecision'
                      : validationErrors.length > 0
                        ? 'Your offering is tainted'
                        : 'Illuminate your past'}
                  </AlertDialogTitle>

                  {showConfirmation && (
                    <AlertDialogDescription className="sr-only">
                      This will replace your current campaign data with the
                      uploaded file.
                    </AlertDialogDescription>
                  )}

                  {validationErrors.length > 0 && (
                    <AlertDialogDescription className="sr-only">
                      The uploaded file contains validation errors that need to
                      be fixed.
                    </AlertDialogDescription>
                  )}

                  {!showConfirmation && validationErrors.length === 0 && (
                    <AlertDialogDescription className="sr-only">
                      Upload a JSON file containing campaign data. This will
                      replace your existing data.
                    </AlertDialogDescription>
                  )}
                </AlertDialogHeader>

                <div className="text-sm text-muted-foreground">
                  {showConfirmation ? (
                    <div className="text-left space-y-4">
                      <p className="font-medium text-amber-500">
                        Warning: The darkness will consume your current
                        settlements!
                      </p>
                      <p>Your currently have:</p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>
                          {campaign.settlements.length} settlement
                          {campaign.settlements.length !== 1 ? 's' : ''}
                        </li>
                        <li>
                          {campaign.survivors.length} survivor
                          {campaign.survivors.length !== 1 ? 's' : ''}
                        </li>
                      </ul>
                      <p>The records you seek to restore contain:</p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>
                          {uploadedData?.settlements?.length} settlement
                          {uploadedData?.settlements?.length !== 1 ? 's' : ''}
                        </li>
                        <li>
                          {uploadedData?.survivors?.length} survivor
                          {uploadedData?.survivors?.length !== 1 ? 's' : ''}
                        </li>
                      </ul>
                      <p>Do you wish to continue?</p>
                    </div>
                  ) : validationErrors.length > 0 ? (
                    <div className="text-left">
                      <p className="mb-2 text-destructive font-medium">
                        The darkness corrupts your chronicles:
                      </p>
                      <ul className="list-disc pl-5 space-y-1 text-sm max-h-40 overflow-y-auto">
                        {validationErrors.slice(0, 10).map((error, index) => (
                          <li key={index}>{error}</li>
                        ))}
                        {validationErrors.length > 10 && (
                          <li>
                            ...and {validationErrors.length - 10} more errors
                          </li>
                        )}
                      </ul>
                      <p className="mt-2">
                        Mend your chronicles and try again, lest they be lost
                        forever.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <p>
                        Surrender your chronicles.{' '}
                        <strong>
                          The darkness will consume your existing settlements.
                        </strong>
                      </p>
                      <div className="pt-2">
                        <input
                          type="file"
                          ref={fileInputRef}
                          accept=".json,application/json"
                          onChange={handleFileSelection}
                          className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 cursor-pointer"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  {showConfirmation && (
                    <AlertDialogAction
                      onClick={confirmUpload}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                      Embrace the Darkness
                    </AlertDialogAction>
                  )}
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
