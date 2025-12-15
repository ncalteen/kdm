'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'
import { MonsterNode, MonsterType } from '@/lib/enums'
import { ERROR_MESSAGE } from '@/lib/messages'
import {
  getAvailableNodes,
  getCampaign,
  saveCampaignToLocalStorage
} from '@/lib/utils'
import {
  NemesisMonsterDataSchema,
  QuarryMonsterDataSchema
} from '@/schemas/monster'
import { PlusIcon } from 'lucide-react'
import { ReactElement, useState } from 'react'

/**
 * Create Monster Dialog Properties
 */
export interface CreateMonsterDialogProps {
  /** Monster Create Callback */
  onMonsterCreated?: () => void
}

/**
 * Create Monster Dialog Component
 *
 * Provides a modal dialog for creating custom quarry or nemesis monsters.
 *
 * @param props Create Monster Dialog Properties
 * @returns Create Monster Dialog Component
 */
export function CreateMonsterDialog({
  onMonsterCreated
}: CreateMonsterDialogProps): ReactElement {
  const { toast } = useToast()

  const [isOpen, setIsOpen] = useState(false)
  const [monsterType, setMonsterType] = useState<MonsterType>(
    MonsterType.QUARRY
  )
  const [name, setName] = useState('')
  const [node, setNode] = useState<MonsterNode>(MonsterNode.NQ1)

  /**
   * Handles monster type change and updates node to first available
   */
  const handleMonsterTypeChange = (type: MonsterType) => {
    setMonsterType(type)
    const availableNodes = getAvailableNodes(type)
    setNode(availableNodes[0])
  }

  /**
   * Resets the form to its initial state
   */
  const resetForm = () => {
    setMonsterType(MonsterType.QUARRY)
    setName('')
    setNode(MonsterNode.NQ1)
  }

  /**
   * Handles creating a new monster
   */
  const handleCreateMonster = () => {
    try {
      // Create the base monster data
      const baseData = {
        name,
        node,
        type: monsterType
      }

      // Generate a unique ID for the monster
      const monsterId = `custom-${Math.random().toString(36).substring(2, 9)}`

      // Get existing campaign data
      const campaign = getCampaign()
      const existingMonsters = campaign.customMonsters || []

      // Validate based on monster type
      if (monsterType === MonsterType.QUARRY) {
        const monsterData = QuarryMonsterDataSchema.parse({
          ...baseData,
          ccRewards: [],
          huntBoard: {},
          locations: [],
          timeline: {}
        })

        // Save to localStorage with id field
        const monsterWithId = { ...monsterData, id: monsterId }
        saveCampaignToLocalStorage({
          ...campaign,
          customMonsters: [...existingMonsters, monsterWithId]
        })

        toast.success('A new quarry stalks the land.')
      } else {
        const monsterData = NemesisMonsterDataSchema.parse({
          ...baseData,
          timeline: {}
        })

        // Save to localStorage with id field
        const monsterWithId = { ...monsterData, id: monsterId }
        saveCampaignToLocalStorage({
          ...campaign,
          customMonsters: [...existingMonsters, monsterWithId]
        })

        toast.success('A nemesis has awakened.')
      }

      resetForm()
      setIsOpen(false)

      if (onMonsterCreated) onMonsterCreated()
    } catch (error) {
      console.error('Create Monster Error:', error)
      toast.error(ERROR_MESSAGE())
    }
  }

  /**
   * Handles dialog close with cleanup
   */
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (!open) resetForm()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <PlusIcon className="h-4 w-4 mr-2" />
          Create Custom Monster
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Custom Monster</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Monster Type Selection */}
          <div className="space-y-2">
            <Label htmlFor="monster-type">Monster Type</Label>
            <Tabs
              value={monsterType}
              onValueChange={(value) =>
                handleMonsterTypeChange(value as MonsterType)
              }
              className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value={MonsterType.QUARRY}>Quarry</TabsTrigger>
                <TabsTrigger value={MonsterType.NEMESIS}>Nemesis</TabsTrigger>
              </TabsList>
              <TabsContent value={MonsterType.QUARRY} className="mt-4">
                <p className="text-sm text-muted-foreground">
                  Quarries are hunted by survivors. They can be tracked on the
                  hunt board and provide resources when defeated.
                </p>
              </TabsContent>
              <TabsContent value={MonsterType.NEMESIS} className="mt-4">
                <p className="text-sm text-muted-foreground">
                  Nemeses appear during showdowns. They await survivors at the
                  edge of the settlement.
                </p>
              </TabsContent>
            </Tabs>
          </div>

          <Separator />

          {/* Basic Information */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="monster-name">Monster Name</Label>
              <Input
                id="monster-name"
                name="monster-name"
                placeholder="Enter monster name..."
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="monster-node">Monster Node</Label>
              <Select
                value={node}
                onValueChange={(value) => setNode(value as MonsterNode)}
                name="monster-node">
                <SelectTrigger id="monster-node">
                  <SelectValue placeholder="Select monster node" />
                </SelectTrigger>
                <SelectContent>
                  {getAvailableNodes(monsterType).map((nodeValue) => (
                    <SelectItem key={nodeValue} value={nodeValue}>
                      {nodeValue}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              resetForm()
              setIsOpen(false)
            }}>
            Cancel
          </Button>
          <Button
            onClick={handleCreateMonster}
            disabled={!name.trim() || !node}>
            Create Monster
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
