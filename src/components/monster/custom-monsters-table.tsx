'use client'

import { EditMonsterDialog } from '@/components/monster/edit-monster-dialog'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { useToast } from '@/hooks/use-toast'
import { MonsterType } from '@/lib/enums'
import { CUSTOM_MONSTER_DELETED_MESSAGE, ERROR_MESSAGE } from '@/lib/messages'
import { Campaign } from '@/schemas/campaign'
import { NemesisMonsterData } from '@/schemas/nemesis-monster-data'
import { QuarryMonsterData } from '@/schemas/quarry-monster-data'
import { PencilIcon, Trash2Icon } from 'lucide-react'
import { ReactElement, useState } from 'react'

/**
 * Custom Monsters Table Component Properties
 */
export interface CustomMonstersTableProps {
  /** Campaign */
  campaign: Campaign
  /** Monster List Change Callback */
  onMonstersChange?: () => void
  /** Update Campaign */
  updateCampaign: (campaign: Campaign) => void
}

/**
 * Custom Monsters Table Component
 *
 * Displays a scrollable table of custom monsters saved in localStorage.
 *
 * @param props Custom Monsters Table Component Properties
 * @returns Custom Monsters Table Component
 */
export function CustomMonstersTable({
  campaign,
  onMonstersChange,
  updateCampaign
}: CustomMonstersTableProps): ReactElement {
  const { toast } = useToast(campaign)

  const [monsters, setMonsters] = useState<{
    [key: string]: NemesisMonsterData | QuarryMonsterData
  }>(() => ({
    ...(campaign.customNemeses ?? {}),
    ...(campaign.customQuarries ?? {})
  }))

  const [editingMonsterId, setEditingMonsterId] = useState<string | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  /**
   * Opens edit dialog for a monster
   */
  const handleEditMonster = (monsterId: string) => {
    setEditingMonsterId(monsterId)
    setIsEditDialogOpen(true)
  }

  /**
   * Handles monster update completion
   */
  const handleMonsterUpdated = () => {
    try {
      setMonsters({
        ...(campaign.customNemeses ?? {}),
        ...(campaign.customQuarries ?? {})
      })

      if (onMonstersChange) onMonstersChange()
    } catch (error) {
      console.error('Refresh Monsters Error:', error)
    }
  }

  /**
   * Deletes a custom monster
   */
  const handleDeleteMonster = (id: string) => {
    try {
      const monsterToDelete = monsters[id as keyof typeof monsters]

      const updatedNemeses = {
        ...(campaign.customNemeses ?? {})
      }
      const updatedQuarries = {
        ...(campaign.customQuarries ?? {})
      }

      if (monsterToDelete.type === MonsterType.NEMESIS)
        delete updatedNemeses[id]
      if (monsterToDelete.type === MonsterType.QUARRY)
        delete updatedQuarries[id]

      updateCampaign({
        ...campaign,
        customNemeses: updatedNemeses,
        customQuarries: updatedQuarries
      })
      setMonsters({
        ...updatedNemeses,
        ...updatedQuarries
      })

      toast.success(CUSTOM_MONSTER_DELETED_MESSAGE(monsterToDelete.name))

      if (onMonstersChange) onMonstersChange()
    } catch (error) {
      console.error('Delete Custom Monster Error:', error)
      toast.error(ERROR_MESSAGE())
    }
  }

  if (Object.keys(monsters).length === 0)
    return (
      <div className="flex items-center justify-center p-8 text-center">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            No custom monsters have been forged yet.
          </p>
          <p className="text-xs text-muted-foreground">
            Create a custom monster to see it appear here.
          </p>
        </div>
      </div>
    )

  return (
    <div className="max-h-[400px] overflow-y-auto rounded-md border">
      <Table>
        <TableHeader className="sticky top-0 bg-background z-10">
          <TableRow>
            <TableHead className="w-[40%]">Name</TableHead>
            <TableHead className="w-[20%]">Type</TableHead>
            <TableHead className="w-[20%]">Node</TableHead>
            <TableHead className="w-[20%] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Object.keys(monsters).map((monsterId: string) => {
            const monster = monsters[monsterId as keyof typeof monsters]

            return (
              <TableRow key={monsterId}>
                <TableCell className="font-medium">{monster.name}</TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                      monster.type === MonsterType.QUARRY
                        ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                    {monster.type === MonsterType.QUARRY ? 'Quarry' : 'Nemesis'}
                  </span>
                </TableCell>
                <TableCell>
                  <code className="text-xs bg-muted px-1.5 py-0.5 rounded">
                    {monster.node}
                  </code>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditMonster(monsterId)}
                      title={`Edit ${monster.name}`}>
                      <PencilIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteMonster(monsterId)}
                      title={`Delete ${monster.name}`}>
                      <Trash2Icon className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>

      <EditMonsterDialog
        campaign={campaign}
        monsterId={editingMonsterId}
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onMonsterUpdated={handleMonsterUpdated}
        updateCampaign={updateCampaign}
      />
    </div>
  )
}
