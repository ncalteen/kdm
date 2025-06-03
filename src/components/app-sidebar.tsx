'use client'

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
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail
} from '@/components/ui/sidebar'
import { useSettlement } from '@/contexts/settlement-context'
import { CampaignType, SurvivorType } from '@/lib/enums'
import { getCampaign } from '@/lib/utils'
import { Campaign, CampaignSchema } from '@/schemas/campaign'
import { MarkGithubIcon } from '@primer/octicons-react'
import {
  DownloadIcon,
  HourglassIcon,
  LightbulbIcon,
  NotebookPenIcon,
  SchoolIcon,
  SwordsIcon,
  UploadIcon,
  UsersIcon,
  WrenchIcon,
  type LucideIcon
} from 'lucide-react'
import { ChangeEvent, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { SettlementSwitcher } from './menu/settlement-switcher'
import { NavFooter } from './nav-footer'

const footer = [
  {
    name: 'ncalteen/kdm',
    url: 'https://github.com/ncalteen/kdm',
    icon: MarkGithubIcon as LucideIcon
  }
]

const baseNavPrimary = [
  {
    title: 'Timeline',
    tab: 'timeline',
    icon: HourglassIcon
  },
  {
    title: 'Monsters',
    tab: 'monsters',
    icon: SwordsIcon
  },
  {
    title: 'Survivors',
    tab: 'survivors',
    icon: UsersIcon
  },
  {
    title: 'Society',
    tab: 'society',
    icon: SchoolIcon
  },
  {
    title: 'Crafting',
    tab: 'crafting',
    icon: WrenchIcon
  },
  {
    title: 'Notes',
    tab: 'notes',
    icon: NotebookPenIcon
  }
]

const navSquires = [
  {
    title: 'Timeline',
    tab: 'timeline',
    icon: HourglassIcon
  },
  {
    title: 'Monsters',
    tab: 'monsters',
    icon: SwordsIcon
  },
  {
    title: 'Squires',
    tab: 'squires',
    icon: UsersIcon
  },
  {
    title: 'Society',
    tab: 'society',
    icon: SchoolIcon
  },
  {
    title: 'Crafting',
    tab: 'crafting',
    icon: WrenchIcon
  },
  {
    title: 'Notes',
    tab: 'notes',
    icon: NotebookPenIcon
  }
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [campaign, setCampaign] = useState<Campaign | undefined>()
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

  const settlementContext = useSettlement()
  const campaignType = settlementContext.selectedSettlement?.campaignType
  const survivorType = settlementContext.selectedSettlement?.survivorType

  // Update navigation items based on settlement context
  useEffect(() => {
    if (!isMounted) return setIsMounted(true)

    if (campaignType === CampaignType.SQUIRES_OF_THE_CITADEL)
      return setNavItems([...navSquires])

    // Start with base navigation
    const newNavItems = [...baseNavPrimary]

    if (survivorType === SurvivorType.ARC) {
      const notesIndex = newNavItems.findIndex((item) => item.tab === 'notes')

      if (notesIndex !== -1)
        newNavItems.splice(notesIndex, 0, {
          title: 'Arc',
          tab: 'arc',
          icon: LightbulbIcon
        })
    }

    setNavItems(newNavItems)
    setCampaign(getCampaign())
  }, [campaignType, survivorType, isMounted])

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

      toast.success('Settlement records preserved!')
    } catch (error) {
      console.error('Download Campaign Error:', error)
      toast.error('Failed to preserve records. Please try again.')
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
          const errors = result.error.errors.map(
            (err) => `${err.path.join('.')}: ${err.message}`
          )

          setValidationErrors(errors)
          setUploadedData(undefined)
          setShowConfirmation(false)
        }
      } catch (error) {
        console.error('Upload Campaign JSON Error:', error)
        setValidationErrors([
          'The darkness swallows your words. Please try again.'
        ])

        setUploadedData(undefined)
        setShowConfirmation(false)
      } finally {
        setIsUploading(false)
      }
    }

    reader.onerror = () => {
      console.error('Read Campaign JSON Error:', reader.error)
      toast.error('The darkness swallows your words. Please try again.')
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
      toast.success('Settlement chronicles loaded!')

      // Reset state
      setUploadedData(undefined)
      setShowConfirmation(false)
      setIsOpen(false)

      // Clear file input
      if (fileInputRef.current) fileInputRef.current.value = ''

      // Reload the page to reflect changes
      window.location.reload()
    } catch (error) {
      console.error('Save Campaign Error:', error)
      toast.error('The darkness swallows your words. Please try again.')
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
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SettlementSwitcher settlements={campaign?.settlements || []} />
      </SidebarHeader>
      <SidebarContent className="flex flex-col justify-between">
        <NavMain items={navItems} />
        <SidebarGroup {...props}>
          <SidebarGroupContent>
            <p className="text-center text-xs text-gray-500 pb-2">
              This project is not affiliated with or endorsed by Kingdom Death:
              Monster or its creators. It is a fan-made project created for
              personal use and entertainment purposes only. All rights to
              Kingdom Death: Monster and its associated materials are owned by
              their respective copyright holders. This project is intended to be
              a tool for players to enhance their experience with the game and
              is not intended for commercial use or distribution.
            </p>
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
                          The uploaded file contains validation errors that need
                          to be fixed.
                        </AlertDialogDescription>
                      )}

                      {!showConfirmation && validationErrors.length === 0 && (
                        <AlertDialogDescription className="sr-only">
                          Upload a JSON file containing campaign data. This will
                          replace your existing data.
                        </AlertDialogDescription>
                      )}
                    </AlertDialogHeader>

                    {/* Content outside of AlertDialogDescription to avoid nesting issues */}
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
                              {getCampaign().settlements.length} settlement
                              {getCampaign().settlements.length !== 1
                                ? 's'
                                : ''}
                            </li>
                            <li>
                              {getCampaign().survivors.length} survivor
                              {getCampaign().survivors.length !== 1 ? 's' : ''}
                            </li>
                          </ul>
                          <p>The records you seek to restore contain:</p>
                          <ul className="list-disc pl-5 space-y-1">
                            <li>
                              {uploadedData?.settlements?.length} settlement
                              {uploadedData?.settlements?.length !== 1
                                ? 's'
                                : ''}
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
                            {validationErrors
                              .slice(0, 10)
                              .map((error, index) => (
                                <li key={index}>{error}</li>
                              ))}
                            {validationErrors.length > 10 && (
                              <li>
                                ...and {validationErrors.length - 10} more
                                errors
                              </li>
                            )}
                          </ul>
                          <p className="mt-2">
                            Mend your chronicles and try again, lest they be
                            lost forever.
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <p>
                            Surrender your chronicles.{' '}
                            <strong>
                              The darkness will consume your existing
                              settlements.
                            </strong>
                          </p>
                          <div className="pt-2">
                            <input
                              type="file"
                              ref={fileInputRef}
                              accept=".json,application/json"
                              onChange={handleFileSelection}
                              className="w-full text-sm file:mr-4 file:py-2 file:px-4
                     file:rounded-md file:border-0
                     file:text-sm file:font-medium
                     file:bg-primary file:text-primary-foreground
                     hover:file:bg-primary/90
                     cursor-pointer"
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
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavFooter projects={footer} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
