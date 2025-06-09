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
import { getCampaign, saveCampaignToLocalStorage } from '@/lib/utils'
import { Settlement } from '@/schemas/settlement'
import { Survivor } from '@/schemas/survivor'
import { Trash2Icon } from 'lucide-react'
import { ReactElement, useState } from 'react'
import { toast } from 'sonner'

/**
 * Settings Card Props
 */
interface SettingsCardProps extends Partial<Settlement> {
  /** Function to set selected settlement */
  setSelectedSettlement: (settlement: Settlement | null) => void
  /** Function to set selected survivor */
  setSelectedSurvivor: (survivor: Survivor | null) => void
}

/**
 * Settings Card Component
 *
 * Displays various settings for a settlement, such as deletion.
 *
 * @param setSelectedSettlement Function to set selected settlement
 * @param setSelectedSurvivor Function to set selected survivor
 * @returns Settings Card Component
 */
export function SettingsCard({
  setSelectedSettlement,
  setSelectedSurvivor,
  ...settlement
}: SettingsCardProps): ReactElement {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false)

  /**
   * Handles the deletion of the current settlement
   */
  const handleDeleteSettlement = () => {
    if (!settlement.id) return

    try {
      const campaign = getCampaign()
      const settlementName = settlement.name || 'this settlement'

      // Remove the settlement from the campaign
      const updatedSettlements = campaign.settlements.filter(
        (s) => s.id !== settlement.id
      )

      // Remove all survivors from this settlement
      const updatedSurvivors = campaign.survivors.filter(
        (survivor) => survivor.settlementId !== settlement.id
      )

      // Save the updated campaign
      saveCampaignToLocalStorage({
        ...campaign,
        settlements: updatedSettlements,
        survivors: updatedSurvivors,
        selectedSettlementId: undefined,
        selectedSurvivorId: undefined
      })

      // Clear the selected settlement and survivor
      setSelectedSettlement(null)
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
      {/* Danger Zone */}
      <Card className="p-0 border-destructive">
        <CardHeader className="px-4 pt-3 pb-0">
          <CardTitle className="text-lg text-destructive">
            Danger Zone
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-2">
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
                  Delete {settlement.name || 'Settlement'}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Settlement</AlertDialogTitle>
                  <AlertDialogDescription>
                    The darkness hungers for {settlement.name}.{' '}
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
                    Delete {settlement.name || 'Settlement'}
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
