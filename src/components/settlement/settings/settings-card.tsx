'use client'

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
import { getCampaign, saveCampaignToLocalStorage } from '@/lib/utils'
import { Hunt } from '@/schemas/hunt'
import { Settlement } from '@/schemas/settlement'
import { Showdown } from '@/schemas/showdown'
import { Survivor } from '@/schemas/survivor'
import { Trash2Icon, XIcon } from 'lucide-react'
import { ReactElement, useState } from 'react'
import { toast } from 'sonner'

/**
 * Settings Card Properties
 */
interface SettingsCardProps {
  /** Save Selected Settlement */
  saveSelectedSettlement: (
    updateData: Partial<Settlement>,
    successMsg?: string
  ) => void
  /** Selected Hunt */
  selectedHunt: Partial<Hunt> | null
  /** Selected Settlement */
  selectedSettlement: Partial<Settlement> | null
  /** Selected Showdown */
  selectedShowdown?: Partial<Showdown> | null
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
 * Settings Card Component
 *
 * Displays various settings for a settlement, such as deletion.
 *
 * @param props Settings Card Properties
 * @returns Settings Card Component
 */
export function SettingsCard({
  saveSelectedSettlement,
  selectedHunt,
  selectedSettlement,
  selectedShowdown,
  setSelectedHunt,
  setSelectedSettlement,
  setSelectedShowdown,
  setSelectedSurvivor
}: SettingsCardProps): ReactElement {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false)

  /**
   * Handles updating the uses scouts setting
   */
  const handleUsesScoutsChange = (value: string) => {
    const usesScouts = value === 'true'
    try {
      saveSelectedSettlement(
        { usesScouts },
        usesScouts
          ? 'The settlement now employs scouts to aid in hunts.'
          : 'The settlement no longer relies on scouts for hunts.'
      )
    } catch (error) {
      console.error('Uses Scouts Update Error:', error)
      toast.error('The darkness swallows your words. Please try again.')
    }
  }

  /**
   * Deletes the Selected Hunt
   */
  const handleDeleteHunt = () => {
    if (!selectedSettlement?.id) return

    try {
      const campaign = getCampaign()

      const updatedHunts = campaign.hunts?.filter(
        (hunt) => hunt.id !== selectedHunt?.id
      )

      saveCampaignToLocalStorage({
        ...campaign,
        hunts: updatedHunts
      })

      setSelectedHunt(null)

      toast.success(
        'The hunt ends. Survivors return to the relative safety of the settlement.'
      )
    } catch (error) {
      console.error('Delete Hunt Error:', error)
      toast.error('The darkness swallows your words. Please try again.')
    }
  }

  /**
   * Deletes the Selected Showdown
   */
  const handleDeleteShowdown = () => {
    if (!selectedSettlement?.id) return

    try {
      const campaign = getCampaign()

      const updatedShowdowns = campaign.showdowns?.filter(
        (hunt) => hunt.id !== selectedHunt?.id
      )

      saveCampaignToLocalStorage({
        ...campaign,
        showdowns: updatedShowdowns
      })

      setSelectedShowdown(null)

      toast.success(
        'The showdown ends. Survivors return to the relative safety of the settlement.'
      )
    } catch (error) {
      console.error('Delete Showdown Error:', error)
      toast.error('The darkness swallows your words. Please try again.')
    }
  }

  /**
   * Deletes the Settlement
   */
  const handleDeleteSettlement = () => {
    if (!selectedSettlement?.id) return

    try {
      const campaign = getCampaign()
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

      saveCampaignToLocalStorage({
        ...campaign,
        hunts: updatedHunts,
        settlements: updatedSettlements,
        showdowns: updatedShowdowns,
        survivors: updatedSurvivors,
        selectedHuntId: undefined,
        selectedSettlementId: undefined,
        selectedShowdownId: undefined,
        selectedSurvivorId: undefined
      })

      // Clear the selected settlement and survivor
      setSelectedHunt(null)
      setSelectedSettlement(null)
      setSelectedShowdown(null)
      setSelectedSurvivor(null)

      setIsDeleteDialogOpen(false)

      toast.success(
        `A wave of darkness washes over ${settlementName}. Voices cried out, and were silenced.`
      )
    } catch (error) {
      console.error('Settlement Delete Error:', error)
      toast.error('The darkness swallows your words. Please try again.')
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Settings */}
      <Card className="p-0">
        <CardHeader className="px-4 pt-3 pb-0">
          <CardTitle className="text-lg">Settings</CardTitle>
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
              onValueChange={handleUsesScoutsChange}>
              <SelectTrigger className="w-24">
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
    </div>
  )
}
