'use client'

import { NumericInput } from '@/components/menu/numeric-input'
import { Button } from '@/components/ui/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  CheckIcon,
  ChevronDown,
  PencilIcon,
  PlusIcon,
  Trash2
} from 'lucide-react'
import { ReactElement, useState } from 'react'

/**
 * CC Rewards Data Properties
 */
export interface CCRewardsDataProps {
  /** CC rewards */
  ccRewards: Array<{ cc: number; name: string }>
  /** Update CC Rewards Callback */
  onCCRewardsChange: (rewards: Array<{ cc: number; name: string }>) => void
  /** Initial disabled indexes (for editing existing data) */
  initialDisabledIndexes?: number[]
}

/**
 * CC Rewards Data Component
 *
 * Manages Collective Cognition rewards for Arc quarry monsters.
 *
 * @param props CC Rewards Data Properties
 * @returns CC Rewards Data Component
 */
export function CCRewardsData({
  ccRewards,
  onCCRewardsChange,
  initialDisabledIndexes
}: CCRewardsDataProps): ReactElement {
  const [isOpen, setIsOpen] = useState(false)
  const [disabledInputs, setDisabledInputs] = useState<{
    [key: number]: boolean
  }>(() => {
    if (!initialDisabledIndexes) return {}
    return initialDisabledIndexes.reduce(
      (acc, idx) => ({ ...acc, [idx]: true }),
      {}
    )
  })
  const [isAddingNew, setIsAddingNew] = useState<boolean>(false)
  const [newCCValue, setNewCCValue] = useState<number>(0)
  const [newNameValue, setNewNameValue] = useState<string>('')

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Button variant="outline" className="w-full justify-between">
          <span>Collective Cognition Rewards (Arc)</span>
          <ChevronDown
            className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-1 ml-2">
        <div className="space-y-2">
          <div className="flex items-center justify-between h-8">
            <Label>CC Rewards</Label>
            {!isAddingNew && (
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => {
                  setIsAddingNew(true)
                  setNewCCValue(0)
                  setNewNameValue('')
                }}
                className="border-0 h-8 w-8"
                disabled={
                  isAddingNew ||
                  Object.values(disabledInputs).some((v) => v === false)
                }>
                <PlusIcon className="h-4 w-4" />
              </Button>
            )}
          </div>
          <div className="ml-2">
            {ccRewards.map((reward, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-20">
                  {disabledInputs[index] ? (
                    <span className="text-sm">{reward.cc}</span>
                  ) : (
                    <NumericInput
                      label="CC Reward Target"
                      value={reward.cc}
                      onChange={(value) => {
                        const newRewards = [...ccRewards]
                        newRewards[index] = {
                          ...reward,
                          cc: value
                        }
                        onCCRewardsChange(newRewards)
                      }}
                      min={0}
                      readOnly={false}>
                      <Input
                        id={`cc-reward-${index + 1}-cc`}
                        type="number"
                        min="0"
                        value={reward.cc}
                        onChange={(e) => {
                          const newRewards = [...ccRewards]
                          newRewards[index] = {
                            ...reward,
                            cc: parseInt(e.target.value) || 0
                          }
                          onCCRewardsChange(newRewards)
                        }}
                        className="text-center no-spinners"
                      />
                    </NumericInput>
                  )}
                </div>
                <div className="flex-1">
                  {disabledInputs[index] ? (
                    <span className="text-sm">{reward.name}</span>
                  ) : (
                    <Input
                      placeholder="Reward name"
                      defaultValue={reward.name}
                      onChange={(e) => {
                        const newRewards = [...ccRewards]
                        newRewards[index] = {
                          ...reward,
                          name: e.target.value
                        }
                        onCCRewardsChange(newRewards)
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          setDisabledInputs((prev) => ({
                            ...prev,
                            [index]: true
                          }))
                        }
                      }}
                    />
                  )}
                </div>
                <div className="flex items-center gap-1">
                  {disabledInputs[index] ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        setDisabledInputs((prev) => ({
                          ...prev,
                          [index]: false
                        }))
                      }>
                      <PencilIcon className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        setDisabledInputs((prev) => ({
                          ...prev,
                          [index]: true
                        }))
                      }>
                      <CheckIcon className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      const newRewards = ccRewards.filter((_, i) => i !== index)
                      onCCRewardsChange(newRewards)
                      const newDisabled = { ...disabledInputs }
                      delete newDisabled[index]
                      Object.keys(newDisabled).forEach((k) => {
                        const num = parseInt(k)
                        if (num > index) {
                          newDisabled[num - 1] = newDisabled[num]
                          delete newDisabled[num]
                        }
                      })
                      setDisabledInputs(newDisabled)
                    }}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            {isAddingNew && (
              <div className="flex items-center gap-2">
                <div className="w-20">
                  <NumericInput
                    label="CC Reward Target"
                    value={newCCValue}
                    onChange={setNewCCValue}
                    min={0}
                    readOnly={false}>
                    <Input
                      id="new-cc-reward-cc"
                      type="number"
                      min="0"
                      placeholder="CC"
                      value={newCCValue}
                      onChange={(e) =>
                        setNewCCValue(parseInt(e.target.value) || 0)
                      }
                      onKeyDown={(e) => {
                        if (e.key === 'Escape') {
                          e.preventDefault()
                          setIsAddingNew(false)
                          setNewCCValue(0)
                          setNewNameValue('')
                        }
                      }}
                      className="text-center no-spinners"
                    />
                  </NumericInput>
                </div>
                <div className="flex-1">
                  <Input
                    id="new-cc-reward-name"
                    placeholder="Reward name"
                    value={newNameValue}
                    onChange={(e) => setNewNameValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        if (newNameValue.trim()) {
                          const newRewards = [
                            ...ccRewards,
                            { cc: newCCValue, name: newNameValue }
                          ]
                          onCCRewardsChange(newRewards)
                          setDisabledInputs((prev) => ({
                            ...prev,
                            [ccRewards.length]: true
                          }))
                          setIsAddingNew(false)
                          setNewCCValue(0)
                          setNewNameValue('')
                        }
                      } else if (e.key === 'Escape') {
                        e.preventDefault()
                        setIsAddingNew(false)
                        setNewCCValue(0)
                        setNewNameValue('')
                      }
                    }}
                  />
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      if (newNameValue.trim()) {
                        const newRewards = [
                          ...ccRewards,
                          { cc: newCCValue, name: newNameValue }
                        ]
                        onCCRewardsChange(newRewards)
                        setDisabledInputs((prev) => ({
                          ...prev,
                          [ccRewards.length]: true
                        }))
                        setIsAddingNew(false)
                        setNewCCValue(0)
                        setNewNameValue('')
                      }
                    }}>
                    <CheckIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setIsAddingNew(false)
                      setNewCCValue(0)
                      setNewNameValue('')
                    }}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
