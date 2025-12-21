'use client'

import { CreateMonsterDialog } from '@/components/monster/create-monster-dialog'
import { CustomMonstersTable } from '@/components/monster/custom-monsters-table'
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
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/hooks/use-toast'
import {
  CAMPAIGN_UNLOCK_KILLENIUM_BUTCHER_UPDATED_MESSAGE,
  CAMPAIGN_UNLOCK_SCREAMING_NUKALOPE_UPDATED_MESSAGE,
  CAMPAIGN_UNLOCK_WHITE_GIGALION_UPDATED_MESSAGE,
  DISABLE_TOASTS_SETTING_UPDATED_MESSAGE,
  ERROR_MESSAGE,
  HUNT_DELETED_MESSAGE,
  SETTLEMENT_DELETED_MESSAGE,
  SETTLEMENT_USES_SCOUTS_SETTING_UPDATED_MESSAGE,
  SHOWDOWN_DELETED_MESSAGE
} from '@/lib/messages'
import { generateSeedData } from '@/lib/seed'
import { Campaign } from '@/schemas/campaign'
import { Hunt } from '@/schemas/hunt'
import { Settlement } from '@/schemas/settlement'
import { Showdown } from '@/schemas/showdown'
import { Survivor } from '@/schemas/survivor'
import { DatabaseIcon, Trash2Icon, XIcon } from 'lucide-react'
import { ReactElement, useState } from 'react'

/**
 * Settings Card Properties
 */
interface SettingsCardProps {
  /** Campaign */
  campaign: Campaign
  /** Save Selected Settlement */
  saveSelectedSettlement: (
    updateData: Partial<Settlement>,
    successMsg?: string
  ) => void
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
  /** Update Campaign */
  updateCampaign: (campaign: Campaign) => void
}

/**
 * Settings Card Component
 *
 * Displays various settings for a settlement, such as deletion.
 *
 * @param props Settings Card Properties
 * @returns Settings Card Component
 */
export function SettingsCard({
  campaign,
  saveSelectedSettlement,
  selectedHunt,
  selectedSettlement,
  selectedShowdown,
  setSelectedHunt,
  setSelectedSettlement,
  setSelectedShowdown,
  setSelectedSurvivor,
  updateCampaign
}: SettingsCardProps): ReactElement {
  const { toast } = useToast(campaign)

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false)
  const [monstersRefreshKey, setMonstersRefreshKey] = useState<number>(0)
  const [disableToasts, setDisableToasts] = useState<boolean>(() => {
    try {
      return campaign.settings.disableToasts ?? false
    } catch {
      return false
    }
  })
  const [killeniumButcherUnlocked, setKilleniumButcherUnlocked] =
    useState<boolean>(() => {
      try {
        return campaign.settings.unlockedMonsters.killeniumButcher ?? false
      } catch {
        return false
      }
    })
  const [screamingNukalopeUnlocked, setScreamingNukalopeUnlocked] =
    useState<boolean>(() => {
      try {
        return campaign.settings.unlockedMonsters.screamingNukalope ?? false
      } catch {
        return false
      }
    })
  const [whiteGigalionUnlocked, setWhiteGigalionUnlocked] = useState<boolean>(
    () => {
      try {
        return campaign.settings.unlockedMonsters.whiteGigalion ?? false
      } catch {
        return false
      }
    }
  )

  /**
   * Handles updating the disable toasts setting
   */
  const handleDisableToastsChange = (value: string) => {
    const newDisableToasts = value === 'true'

    try {
      updateCampaign({
        ...campaign,
        settings: { ...campaign.settings, disableToasts: newDisableToasts }
      })
      setDisableToasts(newDisableToasts)

      // Always show this toast so user knows the setting was changed
      toast.success(DISABLE_TOASTS_SETTING_UPDATED_MESSAGE(newDisableToasts))
    } catch (error) {
      console.error('Disable Toasts Update Error:', error)
      toast.error(ERROR_MESSAGE())
    }
  }

  /**
   * Handles updating the Killenium Butcher unlocked setting.
   *
   * This is set for all campaigns.
   */
  const handleKilleniumButcherUnlockedChange = (value: string) => {
    const unlocked = value === 'true'

    try {
      updateCampaign({
        ...campaign,
        settings: {
          ...campaign.settings,
          unlockedMonsters: {
            ...campaign.settings.unlockedMonsters,
            killeniumButcher: unlocked
          }
        }
      })
      setKilleniumButcherUnlocked(unlocked)

      toast.success(CAMPAIGN_UNLOCK_KILLENIUM_BUTCHER_UPDATED_MESSAGE(unlocked))
    } catch (error) {
      console.error('Killenium Butcher Unlock Error:', error)
      toast.error(ERROR_MESSAGE())
    }
  }

  /**
   * Handles updating the Screaming Nukalope unlocked setting.
   *
   * This is set for all campaigns.
   */
  const handleScreamingNukalopeUnlockedChange = (value: string) => {
    const unlocked = value === 'true'

    try {
      updateCampaign({
        ...campaign,
        settings: {
          ...campaign.settings,
          unlockedMonsters: {
            ...campaign.settings.unlockedMonsters,
            screamingNukalope: unlocked
          }
        }
      })
      setScreamingNukalopeUnlocked(unlocked)

      toast.success(
        CAMPAIGN_UNLOCK_SCREAMING_NUKALOPE_UPDATED_MESSAGE(unlocked)
      )
    } catch (error) {
      console.error('Screaming Nukalope Unlock Error:', error)
      toast.error(ERROR_MESSAGE())
    }
  }

  /**
   * Handles updating the White Gigalion unlocked setting.
   *
   * This is set for all campaigns.
   */
  const handleWhiteGigalionUnlockedChange = (value: string) => {
    const unlocked = value === 'true'

    try {
      updateCampaign({
        ...campaign,
        settings: {
          ...campaign.settings,
          unlockedMonsters: {
            ...campaign.settings.unlockedMonsters,
            whiteGigalion: unlocked
          }
        }
      })
      setWhiteGigalionUnlocked(unlocked)

      toast.success(CAMPAIGN_UNLOCK_WHITE_GIGALION_UPDATED_MESSAGE(unlocked))
    } catch (error) {
      console.error('White Gigalion Unlock Error:', error)
      toast.error(ERROR_MESSAGE())
    }
  }

  /**
   * Handles updating the uses scouts setting
   */
  const handleUsesScoutsChange = (value: string) => {
    const usesScouts = value === 'true'
    try {
      saveSelectedSettlement(
        { usesScouts },
        SETTLEMENT_USES_SCOUTS_SETTING_UPDATED_MESSAGE(usesScouts)
      )
    } catch (error) {
      console.error('Uses Scouts Update Error:', error)
      toast.error(ERROR_MESSAGE())
    }
  }

  /**
   * Deletes the Selected Hunt
   */
  const handleDeleteHunt = () => {
    if (!selectedSettlement?.id) return

    try {
      const updatedHunts = campaign.hunts?.filter(
        (hunt) => hunt.id !== selectedHunt?.id
      )

      updateCampaign({
        ...campaign,
        hunts: updatedHunts
      })
      setSelectedHunt(null)

      toast.success(HUNT_DELETED_MESSAGE())
    } catch (error) {
      console.error('Delete Hunt Error:', error)
      toast.error(ERROR_MESSAGE())
    }
  }

  /**
   * Deletes the Selected Showdown
   */
  const handleDeleteShowdown = () => {
    if (!selectedSettlement?.id) return

    try {
      const updatedShowdowns = campaign.showdowns?.filter(
        (hunt) => hunt.id !== selectedHunt?.id
      )

      updateCampaign({
        ...campaign,
        showdowns: updatedShowdowns
      })
      setSelectedShowdown(null)

      toast.success(SHOWDOWN_DELETED_MESSAGE())
    } catch (error) {
      console.error('Delete Showdown Error:', error)
      toast.error(ERROR_MESSAGE())
    }
  }

  /**
   * Deletes the Settlement
   */
  const handleDeleteSettlement = () => {
    if (!selectedSettlement?.id) return

    try {
      const settlementName = selectedSettlement?.name || 'this settlement'

      const updatedSettlements = campaign.settlements.filter(
        (s) => s.id !== selectedSettlement?.id
      )

      const updatedSurvivors = campaign.survivors.filter(
        (survivor) => survivor.settlementId !== selectedSettlement?.id
      )

      const updatedHunts = campaign.hunts?.filter(
        (hunt) => hunt.settlementId !== selectedSettlement?.id
      )

      const updatedShowdowns = campaign.showdowns?.filter(
        (showdown) => showdown.settlementId !== selectedSettlement?.id
      )

      updateCampaign({
        ...campaign,
        hunts: updatedHunts,
        settlements: updatedSettlements,
        showdowns: updatedShowdowns,
        survivors: updatedSurvivors,
        selectedHuntId: null,
        selectedSettlementId: null,
        selectedShowdownId: null,
        selectedSurvivorId: null
      })

      // Clear the selected settlement and survivor
      setSelectedHunt(null)
      setSelectedSettlement(null)
      setSelectedShowdown(null)
      setSelectedSurvivor(null)

      setIsDeleteDialogOpen(false)

      toast.success(SETTLEMENT_DELETED_MESSAGE(settlementName))
    } catch (error) {
      console.error('Settlement Delete Error:', error)
      toast.error(ERROR_MESSAGE())
    }
  }

  /**
   * Generates seed data for testing
   *
   * Only available in development mode
   */
  const handleGenerateSeedData = () => {
    try {
      generateSeedData()

      // Refresh the page to load the new data
      window.location.reload()
    } catch (error) {
      console.error('Seed Data Generation Error:', error)
      toast.error(ERROR_MESSAGE())
    }
  }

  const isDevelopment = process.env.NODE_ENV === 'development'

  return (
    <div className="flex flex-col gap-4">
      {/* Development Tools */}
      {isDevelopment && (
        <Card className="p-0 border-blue-500">
          <CardHeader className="px-4 pt-3 pb-0">
            <CardTitle className="text-lg text-blue-600">
              Development Tools
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-sm">Generate Seed Data</div>
                <div className="text-sm text-muted-foreground">
                  Creates multiple test campaigns with settlements, survivors,
                  hunts, and showdowns. This will replace all existing data.
                </div>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <DatabaseIcon className="h-4 w-4 mr-2" />
                    Seed Data
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Generate Seed Data</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will replace all existing campaigns, settlements,
                      survivors, hunts, and showdowns with comprehensive test
                      data. This action cannot be undone. Are you sure you want
                      to proceed?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleGenerateSeedData}
                      className="bg-blue-600 text-white hover:bg-blue-700">
                      Generate Test Data
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Settlement Settings */}
      {selectedSettlement && (
        <Card className="p-0">
          <CardHeader className="px-4 pt-3 pb-0">
            <CardTitle className="text-lg">Settlement Settings</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-sm">Uses Scouts</div>
                <div className="text-sm text-muted-foreground">
                  Determines if scouts are required for hunts and showdowns.
                </div>
              </div>
              <Select
                value={
                  selectedSettlement?.usesScouts !== undefined
                    ? selectedSettlement.usesScouts.toString()
                    : 'false'
                }
                onValueChange={handleUsesScoutsChange}
                name="uses-scouts"
                aria-label="Uses Scouts">
                <SelectTrigger className="w-24" id="uses-scouts">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="false">No</SelectItem>
                  <SelectItem value="true">Yes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Global Settings */}
      <Card className="p-0">
        <CardHeader className="px-4 pt-3 pb-0">
          <CardTitle className="text-lg">Global Settings</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-sm">Disable Notifications</div>
              <div className="text-sm text-muted-foreground">
                Silences success messages. Error messages will always be shown.
              </div>
            </div>
            <Select
              value={disableToasts.toString()}
              onValueChange={handleDisableToastsChange}
              name="disable-toasts"
              aria-label="Disable Notifications">
              <SelectTrigger className="w-24" id="disable-toasts">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="false">No</SelectItem>
                <SelectItem value="true">Yes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator className="my-2" />

          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-sm">
                Unlock Killenium Butcher
              </div>
              <div className="text-sm text-muted-foreground">
                Allows the Killenium Butcher nemesis to appear in showdowns.
              </div>
            </div>
            <Select
              value={killeniumButcherUnlocked.toString()}
              onValueChange={handleKilleniumButcherUnlockedChange}
              name="unlock-killenium-butcher"
              aria-label="Unlock Killenium Butcher">
              <SelectTrigger className="w-24" id="unlock-killenium-butcher">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="false">No</SelectItem>
                <SelectItem value="true">Yes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator className="my-2" />

          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-sm">
                Unlock Screaming Nukalope
              </div>
              <div className="text-sm text-muted-foreground">
                Allows the Screaming Nukalope quarry to be hunted.
              </div>
            </div>
            <Select
              value={screamingNukalopeUnlocked.toString()}
              onValueChange={handleScreamingNukalopeUnlockedChange}
              name="unlock-screaming-nukalope"
              aria-label="Unlock Screaming Nukalope">
              <SelectTrigger className="w-24" id="unlock-screaming-nukalope">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="false">No</SelectItem>
                <SelectItem value="true">Yes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator className="my-2" />

          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-sm">Unlock White Gigalion</div>
              <div className="text-sm text-muted-foreground">
                Allows the White Gigalion quarry to be hunted.
              </div>
            </div>
            <Select
              value={whiteGigalionUnlocked.toString()}
              onValueChange={handleWhiteGigalionUnlockedChange}
              name="unlock-white-gigalion"
              aria-label="Unlock White Gigalion">
              <SelectTrigger className="w-24" id="unlock-white-gigalion">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="false">No</SelectItem>
                <SelectItem value="true">Yes</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Custom Monster Settings */}
      <Card className="p-0">
        <CardHeader className="px-4 pt-3 pb-0">
          <CardTitle className="text-lg">Custom Monsters</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-sm">Create & Manage</div>
                <div className="text-sm text-muted-foreground">
                  Create custom quarry or nemesis monsters for your campaign.
                </div>
              </div>
              <CreateMonsterDialog
                campaign={campaign}
                onMonsterCreated={() =>
                  setMonstersRefreshKey((prev) => prev + 1)
                }
                updateCampaign={updateCampaign}
              />
            </div>
            <CustomMonstersTable
              campaign={campaign}
              key={monstersRefreshKey}
              onMonstersChange={() => setMonstersRefreshKey((prev) => prev + 1)}
              updateCampaign={updateCampaign}
            />
          </div>
        </CardContent>
      </Card>

      {/* Delete Selected Hunt */}
      {selectedHunt && (
        <Card className="p-0 border-yellow-500">
          <CardHeader className="px-4 pt-3 pb-0">
            <CardTitle className="text-lg text-yellow-600">
              Active Hunt
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-sm">Delete Current Hunt</div>
                <div className="text-sm text-muted-foreground">
                  End the hunt and return survivors to the settlement.
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={handleDeleteHunt}>
                <XIcon className="h-4 w-4 mr-2" />
                Delete Hunt
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Delete Selected Showdown */}
      {selectedShowdown && (
        <Card className="p-0 border-yellow-500">
          <CardHeader className="px-4 pt-3 pb-0">
            <CardTitle className="text-lg text-yellow-600">
              Active Showdown
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-sm">
                  Delete Current Showdown
                </div>
                <div className="text-sm text-muted-foreground">
                  End the showdown and return survivors to the settlement.
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDeleteShowdown}>
                <XIcon className="h-4 w-4 mr-2" />
                Delete Showdown
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Danger Zone */}
      {selectedSettlement && (
        <Card className="p-0 border-destructive">
          <CardHeader className="px-4 pt-3 pb-0">
            <CardTitle className="text-lg text-destructive">
              Danger Zone
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-sm">
                  Permanently delete this settlement
                </div>
                <div className="text-sm text-muted-foreground">
                  This action cannot be undone. All survivors will be forgotten.
                </div>
              </div>
              <AlertDialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setIsDeleteDialogOpen(true)}>
                    <Trash2Icon className="h-4 w-4 mr-2" />
                    Delete {selectedSettlement?.name || 'Settlement'}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Settlement</AlertDialogTitle>
                    <AlertDialogDescription>
                      The darkness hungers for {selectedSettlement?.name}.{' '}
                      <strong>
                        Once consumed, all who dwelled within will be forgotten.
                      </strong>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteSettlement}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                      Delete {selectedSettlement?.name || 'Settlement'}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
