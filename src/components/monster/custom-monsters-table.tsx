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
import { ERROR_MESSAGE } from '@/lib/messages'
import { getCampaign, saveCampaignToLocalStorage } from '@/lib/utils'
import { NemesisMonsterData, QuarryMonsterData } from '@/schemas/monster'
import { PencilIcon, Trash2Icon } from 'lucide-react'
import { ReactElement, useState } from 'react'

/**
 * Custom Monster (Quarry or Nemesis)
 */
type CustomMonster = (QuarryMonsterData | NemesisMonsterData) & { id: string }

/**
 * Custom Monsters Table Component Properties
 */
export interface CustomMonstersTableProps {
  /** Monster List Change Callback */
  onMonstersChange?: () => void
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
  onMonstersChange
}: CustomMonstersTableProps): ReactElement {
  const { toast } = useToast()

  const [monsters, setMonsters] = useState<CustomMonster[]>(() => {
    try {
      const campaign = getCampaign()
      return (campaign.customMonsters as CustomMonster[]) || []
    } catch (error) {
      console.error('Load Custom Monsters Error:', error)
      return []
    }
  })
  const [editingMonster, setEditingMonster] = useState<CustomMonster | null>(
    null
  )
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  /**
   * Opens edit dialog for a monster
   */
  const handleEditMonster = (monster: CustomMonster) => {
    setEditingMonster(monster)
    setIsEditDialogOpen(true)
  }

  /**
   * Handles monster update completion
   */
  const handleMonsterUpdated = () => {
    try {
      const campaign = getCampaign()
      const updatedMonsters = (campaign.customMonsters as CustomMonster[]) || []
      setMonsters(updatedMonsters)

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
      const campaign = getCampaign()
      const monsterToDelete = monsters.find((m) => m.id === id)

      const updatedMonsters = (
        (campaign.customMonsters as CustomMonster[]) || []
      ).filter((m) => m.id !== id)

      saveCampaignToLocalStorage({
        ...campaign,
        customMonsters: updatedMonsters
      })

      setMonsters(updatedMonsters)

      toast.success(
        `${monsterToDelete?.name || 'Monster'} fades back into the darkness.`
      )

      if (onMonstersChange) onMonstersChange()
    } catch (error) {
      console.error('Delete Custom Monster Error:', error)
      toast.error(ERROR_MESSAGE())
    }
  }

  if (monsters.length === 0)
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
          {monsters.map((monster) => (
            <TableRow key={monster.id}>
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
                    onClick={() => handleEditMonster(monster)}
                    title={`Edit ${monster.name}`}>
                    <PencilIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteMonster(monster.id)}
                    title={`Delete ${monster.name}`}>
                    <Trash2Icon className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Edit Monster Dialog */}
      <EditMonsterDialog
        monster={editingMonster}
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onMonsterUpdated={handleMonsterUpdated}
      />
    </div>
  )
}
