'use client'

import { CCRewardsData } from '@/components/monster/cc-rewards/cc-rewards-data'
import { HuntBoardData } from '@/components/monster/hunt-board/hunt-board-data'
import { LevelData } from '@/components/monster/level/level-data'
import { LocationsData } from '@/components/monster/locations/locations-data'
import { TimelineData } from '@/components/monster/timeline/timeline-data'
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
import { useToast } from '@/hooks/use-toast'
import { HuntEventType, MonsterNode, MonsterType } from '@/lib/enums'
import { CUSTOM_MONSTER_CREATED_MESSAGE, ERROR_MESSAGE } from '@/lib/messages'
import {
  getAvailableNodes,
  getCampaign,
  saveCampaignToLocalStorage
} from '@/lib/utils'
import {
  NemesisMonsterDataSchema,
  NemesisMonsterLevel,
  QuarryMonsterDataSchema,
  QuarryMonsterLevel
} from '@/schemas/monster'
import { TimelineYear } from '@/schemas/settlement'
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
  const [level1Data, setLevel1Data] = useState<
    Partial<QuarryMonsterLevel | NemesisMonsterLevel>
  >({})
  const [level2Data, setLevel2Data] = useState<
    Partial<QuarryMonsterLevel | NemesisMonsterLevel>
  >({})
  const [level3Data, setLevel3Data] = useState<
    Partial<QuarryMonsterLevel | NemesisMonsterLevel>
  >({})
  const [level4Data, setLevel4Data] = useState<
    Partial<QuarryMonsterLevel | NemesisMonsterLevel>
  >({})
  const [timelineData, setTimelineData] = useState<
    Array<{ year: number; event: string }>
  >([])
  const [huntBoardData, setHuntBoardData] = useState<
    Record<number, HuntEventType.BASIC | HuntEventType.MONSTER | undefined>
  >({})
  const [locationsData, setLocationsData] = useState<string[]>([])
  const [ccRewardsData, setCcRewardsData] = useState<
    Array<{ cc: number; name: string }>
  >([])

  /**
   * Handles monster type change to restrict allowed nodes.
   */
  const handleMonsterTypeChange = (type: MonsterType) => {
    setMonsterType(type)
    setNode(getAvailableNodes(type)[0])
  }

  /**
   * Resets the form to its initial state.
   */
  const resetForm = () => {
    setMonsterType(MonsterType.QUARRY)
    setName('')
    setNode(MonsterNode.NQ1)
    setLevel1Data({})
    setLevel2Data({})
    setLevel3Data({})
    setLevel4Data({})
    setTimelineData([])
    setHuntBoardData({})
    setLocationsData([])
    setCcRewardsData([])
  }

  /**
   * Handles creating a new monster
   */
  const handleCreateMonster = () => {
    try {
      // Get existing campaign data
      const campaign = getCampaign()
      const existingMonsters = campaign.customMonsters || []

      // Generate a unique ID for the monster
      const monsterId = crypto.randomUUID()

      // Convert timeline array to correct format
      const timelineRecord: { [key: number]: TimelineYear['entries'] } = {}
      timelineData.forEach(({ year, event }) => {
        if (!timelineRecord[year]) timelineRecord[year] = []
        timelineRecord[year].push(event)
      })

      // Validate based on monster type
      if (monsterType === MonsterType.QUARRY) {
        const monsterData = QuarryMonsterDataSchema.parse({
          ccRewards: ccRewardsData.map(({ cc, name }) => ({
            name,
            cc,
            unlocked: false
          })),
          huntBoard: huntBoardData,
          locations: locationsData.map((name) => ({ name, unlocked: false })),
          timeline: timelineRecord,
          ...(Object.keys(level1Data).length > 0 && { level1: level1Data }),
          ...(Object.keys(level2Data).length > 0 && { level2: level2Data }),
          ...(Object.keys(level3Data).length > 0 && { level3: level3Data }),
          ...(Object.keys(level4Data).length > 0 && { level4: level4Data })
        })

        // Save to localStorage with id field
        const monsterWithId = { ...monsterData, id: monsterId }
        saveCampaignToLocalStorage({
          ...campaign,
          customMonsters: [...existingMonsters, monsterWithId]
        })
      } else {
        const monsterData = NemesisMonsterDataSchema.parse({
          name,
          node,
          timeline: timelineRecord,
          type: monsterType,
          ...(Object.keys(level1Data).length > 0 && { level1: level1Data }),
          ...(Object.keys(level2Data).length > 0 && { level2: level2Data }),
          ...(Object.keys(level3Data).length > 0 && { level3: level3Data }),
          ...(Object.keys(level4Data).length > 0 && { level4: level4Data })
        })

        // Save to localStorage with id field
        const monsterWithId = { ...monsterData, id: monsterId }
        saveCampaignToLocalStorage({
          ...campaign,
          customMonsters: [...existingMonsters, monsterWithId]
        })
      }

      CUSTOM_MONSTER_CREATED_MESSAGE(monsterType)

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

  /**
   * Updates a level's field
   */
  const updateLevel = (
    level: 1 | 2 | 3 | 4,
    field: string,
    value: number | string | string[]
  ) => {
    const setter = [setLevel1Data, setLevel2Data, setLevel3Data, setLevel4Data][
      level - 1
    ]
    const currentLevel = [level1Data, level2Data, level3Data, level4Data][
      level - 1
    ]

    setter({ ...currentLevel, [field]: value })
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <PlusIcon className="h-4 w-4 mr-2" />
          Create Custom Monster
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Custom Monster</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
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

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label htmlFor="monster-type">Monster Type</Label>
                <Select
                  value={monsterType}
                  onValueChange={(value) =>
                    handleMonsterTypeChange(value as MonsterType)
                  }
                  name="monster-type">
                  <SelectTrigger id="monster-type" className="w-full">
                    <SelectValue placeholder="Select monster type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={MonsterType.QUARRY}>Quarry</SelectItem>
                    <SelectItem value={MonsterType.NEMESIS}>Nemesis</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="monster-node">Monster Node</Label>
                <Select
                  value={node}
                  onValueChange={(value) => setNode(value as MonsterNode)}
                  name="monster-node">
                  <SelectTrigger id="monster-node" className="w-full">
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

          <Separator />

          {/* Attributes & Tokens (per Level) */}
          {[1, 2, 3, 4].map((level) => {
            return (
              <LevelData
                key={`level${level}-data`}
                level={level}
                monsterType={monsterType}
                levelData={
                  {
                    1: level1Data,
                    2: level2Data,
                    3: level3Data,
                    4: level4Data
                  }[level] as Partial<QuarryMonsterLevel | NemesisMonsterLevel>
                }
                onLevelDataChange={(field, value) =>
                  updateLevel(level as 1 | 2 | 3 | 4, field, value)
                }
              />
            )
          })}

          {/* Timeline Entries */}
          <TimelineData
            timelineData={timelineData}
            onTimelineDataChange={setTimelineData}
          />

          {/* Quarry-Specific Fields */}
          {monsterType === MonsterType.QUARRY && (
            <>
              {/* Hunt Board Layout */}
              <HuntBoardData
                huntBoard={huntBoardData}
                onHuntBoardChange={setHuntBoardData}
              />

              {/* Settlement Locations */}
              <LocationsData
                locations={locationsData}
                onLocationsChange={setLocationsData}
              />

              {/* Collective Cognition Rewards (Arc) */}
              <CCRewardsData
                ccRewards={ccRewardsData}
                onCCRewardsChange={setCcRewardsData}
              />
            </>
          )}
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
