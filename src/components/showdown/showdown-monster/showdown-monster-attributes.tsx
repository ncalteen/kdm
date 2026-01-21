'use client'

import { NumericInput } from '@/components/menu/numeric-input'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import {
  MONSTER_ACCURACY_TOKENS_UPDATED_MESSAGE,
  MONSTER_DAMAGE_TOKENS_UPDATED_MESSAGE,
  MONSTER_EVASION_TOKENS_UPDATED_MESSAGE,
  MONSTER_LUCK_TOKENS_UPDATED_MESSAGE,
  MONSTER_MOVEMENT_TOKENS_UPDATED_MESSAGE,
  MONSTER_MOVEMENT_UPDATED_MESSAGE,
  MONSTER_SPEED_TOKENS_UPDATED_MESSAGE,
  MONSTER_SPEED_UPDATED_MESSAGE,
  MONSTER_STRENGTH_TOKENS_UPDATED_MESSAGE
} from '@/lib/messages'
import { ShowdownMonster } from '@/schemas/showdown-monster'
import { ReactElement } from 'react'

/**
 * Showdown Monster Attributes Component Properties
 */
interface ShowdownMonsterAttributesProps {
  /** Showdown Monster */
  monster: ShowdownMonster
  /** Save Monster Data */
  saveMonsterData: (
    updateData: Partial<ShowdownMonster>,
    successMsg?: string
  ) => void
}

/**
 * Showdown Monster Attributes Component
 *
 * Displays the monster attributes grid with base values, tokens, and totals
 * for Movement, Accuracy, Strength, Evasion, Luck, and Speed.
 *
 * @param props Showdown Monster Attributes Properties
 * @returns Showdown Monster Attributes Component
 */
export function ShowdownMonsterAttributes({
  monster,
  saveMonsterData
}: ShowdownMonsterAttributesProps): ReactElement {
  return (
    <div className="p-2">
      <div className="flex flex-col gap-1">
        {/* Header */}
        <div className="flex flex-row items-center gap-2">
          <div className="w-20"></div>
          <Label className="text-xs w-24 justify-center">Base</Label>
          <Label className="text-xs w-24 justify-center">Tokens</Label>
          <Label className="text-xs w-24 justify-center">Total</Label>
        </div>

        {/* Damage */}
        <div className="flex flex-row items-center gap-2">
          <Label className="text-xs w-20">Damage</Label>
          <Input
            id="monster-damage"
            type="number"
            value={monster.damage ?? 0}
            className="w-24 h-12 text-center no-spinners text-xl"
            name="monster-damage"
            readOnly={true}
            disabled={true}
          />
          <NumericInput
            label="Damage Tokens"
            value={monster.damageTokens ?? 0}
            onChange={(value) =>
              saveMonsterData(
                { damageTokens: value },
                MONSTER_DAMAGE_TOKENS_UPDATED_MESSAGE(
                  monster.damageTokens,
                  value
                )
              )
            }
            readOnly={false}>
            <Input
              id="monster-damage-tokens"
              type="number"
              value={monster.damageTokens}
              onChange={(e) =>
                saveMonsterData(
                  { damageTokens: parseInt(e.target.value) || 0 },
                  MONSTER_DAMAGE_TOKENS_UPDATED_MESSAGE(
                    monster.damageTokens,
                    parseInt(e.target.value) || 0
                  )
                )
              }
              className="w-24 h-12 text-center no-spinners text-xl bg-muted!"
              name="monster-damage-tokens"
            />
          </NumericInput>
          <Input
            id="monster-damage-total"
            type="number"
            value={(monster.damage ?? 0) + (monster.damageTokens ?? 0)}
            className="w-24 h-12 text-center no-spinners text-xl"
            name="monster-damage-total"
            readOnly={true}
            disabled={true}
          />
        </div>

        <Separator className="my-1" />

        {/* Movement */}
        <div className="flex flex-row items-center gap-2">
          <Label className="text-xs w-20">Movement</Label>
          <NumericInput
            label="Movement Base"
            value={monster.movement ?? 1}
            onChange={(value) =>
              saveMonsterData(
                { movement: value },
                MONSTER_MOVEMENT_UPDATED_MESSAGE(monster.movement, value)
              )
            }
            min={1}
            readOnly={false}>
            <Input
              id="monster-movement"
              type="number"
              value={monster.movement}
              onChange={(e) =>
                saveMonsterData(
                  { movement: parseInt(e.target.value) || 1 },
                  MONSTER_MOVEMENT_UPDATED_MESSAGE(
                    monster.movement,
                    parseInt(e.target.value) || 1
                  )
                )
              }
              className="w-24 h-12 text-center no-spinners text-xl"
              min="1"
              name="monster-movement"
            />
          </NumericInput>
          <NumericInput
            label="Movement Tokens"
            value={monster.movementTokens ?? 0}
            onChange={(value) =>
              saveMonsterData(
                { movementTokens: value },
                MONSTER_MOVEMENT_TOKENS_UPDATED_MESSAGE(
                  monster.movementTokens,
                  value
                )
              )
            }
            readOnly={false}>
            <Input
              id="monster-movement-tokens"
              type="number"
              value={monster.movementTokens}
              onChange={(e) =>
                saveMonsterData(
                  { movementTokens: parseInt(e.target.value) || 0 },
                  MONSTER_MOVEMENT_TOKENS_UPDATED_MESSAGE(
                    monster.movementTokens,
                    parseInt(e.target.value) || 0
                  )
                )
              }
              className="w-24 h-12 text-center no-spinners text-xl bg-muted!"
              name="monster-movement-tokens"
            />
          </NumericInput>
          <Input
            id="monster-movement-total"
            type="number"
            value={(monster.movementTokens ?? 0) + (monster.movement ?? 0)}
            className="w-24 h-12 text-center no-spinners text-xl"
            name="monster-movement-total"
            readOnly={true}
            disabled={true}
          />
        </div>

        {/* Accuracy */}
        <div className="flex flex-row items-center gap-2">
          <Label className="text-xs w-20">Accuracy</Label>
          <Input
            id="monster-accuracy"
            type="number"
            value={monster.accuracy ?? 0}
            className="w-24 h-12 text-center no-spinners text-xl"
            name="monster-accuracy"
            readOnly={true}
            disabled={true}
          />
          <NumericInput
            label="Accuracy Tokens"
            value={monster.accuracyTokens ?? 0}
            onChange={(value) =>
              saveMonsterData(
                { accuracyTokens: value },
                MONSTER_ACCURACY_TOKENS_UPDATED_MESSAGE(
                  monster.accuracyTokens,
                  value
                )
              )
            }
            readOnly={false}>
            <Input
              id="monster-accuracy-tokens"
              type="number"
              value={monster.accuracyTokens}
              onChange={(e) =>
                saveMonsterData(
                  { accuracyTokens: parseInt(e.target.value) || 0 },
                  MONSTER_ACCURACY_TOKENS_UPDATED_MESSAGE(
                    monster.accuracyTokens,
                    parseInt(e.target.value) || 0
                  )
                )
              }
              className="w-24 h-12 text-center no-spinners text-xl bg-muted!"
              name="monster-accuracy-tokens"
            />
          </NumericInput>
          <Input
            id="monster-accuracy-total"
            type="number"
            value={(monster.accuracy ?? 0) + (monster.accuracyTokens ?? 0)}
            className="w-24 h-12 text-center no-spinners text-xl"
            name="monster-accuracy-total"
            readOnly={true}
            disabled={true}
          />
        </div>

        {/* Strength */}
        <div className="flex flex-row items-center gap-2">
          <Label className="text-xs w-20">Strength</Label>
          <Input
            id="monster-strength"
            type="number"
            value={monster.strength ?? 0}
            className="w-24 h-12 text-center no-spinners text-xl"
            name="monster-strength"
            readOnly={true}
            disabled={true}
          />
          <NumericInput
            label="Strength Tokens"
            value={monster.strengthTokens ?? 0}
            onChange={(value) =>
              saveMonsterData(
                { strengthTokens: value },
                MONSTER_STRENGTH_TOKENS_UPDATED_MESSAGE(
                  monster.strengthTokens,
                  value
                )
              )
            }
            readOnly={false}>
            <Input
              id="monster-strength-tokens"
              type="number"
              value={monster.strengthTokens}
              onChange={(e) => {
                saveMonsterData(
                  { strengthTokens: parseInt(e.target.value) || 0 },
                  MONSTER_STRENGTH_TOKENS_UPDATED_MESSAGE(
                    monster.strengthTokens,
                    parseInt(e.target.value) || 0
                  )
                )
              }}
              className="w-24 h-12 text-center no-spinners text-xl bg-muted!"
              name="monster-strength-tokens"
            />
          </NumericInput>
          <Input
            id="monster-strength-total"
            type="number"
            value={(monster.strength ?? 0) + (monster.strengthTokens ?? 0)}
            className="w-24 h-12 text-center no-spinners text-xl"
            name="monster-strength-total"
            readOnly={true}
            disabled={true}
          />
        </div>

        {/* Evasion */}
        <div className="flex flex-row items-center gap-2">
          <Label className="text-xs w-20">Evasion</Label>
          <Input
            id="monster-evasion"
            type="number"
            value={monster.evasion ?? 0}
            className="w-24 h-12 text-center no-spinners text-xl"
            name="monster-evasion"
            readOnly={true}
            disabled={true}
          />
          <NumericInput
            label="Evasion Tokens"
            value={monster.evasionTokens ?? 0}
            onChange={(value) =>
              saveMonsterData(
                { evasionTokens: value },
                MONSTER_EVASION_TOKENS_UPDATED_MESSAGE(
                  monster.evasionTokens,
                  value
                )
              )
            }
            readOnly={false}>
            <Input
              id="monster-evasion-tokens"
              type="number"
              value={monster.evasionTokens}
              onChange={(e) =>
                saveMonsterData(
                  { evasionTokens: parseInt(e.target.value) || 0 },
                  MONSTER_EVASION_TOKENS_UPDATED_MESSAGE(
                    monster.evasionTokens,
                    parseInt(e.target.value) || 0
                  )
                )
              }
              className="w-24 h-12 text-center no-spinners text-xl bg-muted!"
              name="monster-evasion-tokens"
            />
          </NumericInput>
          <Input
            id="monster-evasion-total"
            type="number"
            value={(monster.evasion ?? 0) + (monster.evasionTokens ?? 0)}
            className="w-24 h-12 text-center no-spinners text-xl"
            name="monster-evasion-total"
            readOnly={true}
            disabled={true}
          />
        </div>

        {/* Luck */}
        <div className="flex flex-row items-center gap-2">
          <Label className="text-xs w-20">Luck</Label>
          <Input
            id="monster-luck"
            type="number"
            value={monster.luck ?? 0}
            className="w-24 h-12 text-center no-spinners text-xl"
            name="monster-luck"
            readOnly={true}
            disabled={true}
          />
          <NumericInput
            label="Luck Tokens"
            value={monster.luckTokens ?? 0}
            onChange={(value) =>
              saveMonsterData(
                { luckTokens: value },
                MONSTER_LUCK_TOKENS_UPDATED_MESSAGE(monster.luckTokens, value)
              )
            }
            readOnly={false}>
            <Input
              id="monster-luck-tokens"
              type="number"
              value={monster.luckTokens}
              onChange={(e) =>
                saveMonsterData(
                  { luckTokens: parseInt(e.target.value) || 0 },
                  MONSTER_LUCK_TOKENS_UPDATED_MESSAGE(
                    monster.luckTokens,
                    parseInt(e.target.value) || 0
                  )
                )
              }
              className="w-24 h-12 text-center no-spinners text-xl bg-muted!"
              name="monster-luck-tokens"
            />
          </NumericInput>
          <Input
            id="monster-luck-total"
            type="number"
            value={(monster.luck ?? 0) + (monster.luckTokens ?? 0)}
            className="w-24 h-12 text-center no-spinners text-xl"
            name="monster-luck-total"
            readOnly={true}
            disabled={true}
          />
        </div>

        {/* Speed */}
        <div className="flex flex-row items-center gap-2">
          <Label className="text-xs w-20">Speed</Label>
          <NumericInput
            label="Speed Base"
            value={monster.speed ?? 0}
            onChange={(value) =>
              saveMonsterData(
                { speed: value },
                MONSTER_SPEED_UPDATED_MESSAGE(monster.speed, value)
              )
            }
            readOnly={false}>
            <Input
              id="monster-speed"
              type="number"
              value={monster.speed}
              onChange={(e) =>
                saveMonsterData(
                  { speed: parseInt(e.target.value) || 0 },
                  MONSTER_SPEED_UPDATED_MESSAGE(
                    monster.speed,
                    parseInt(e.target.value) || 0
                  )
                )
              }
              className="w-24 h-12 text-center no-spinners text-xl focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
              name="monster-speed"
            />
          </NumericInput>
          <NumericInput
            label="Speed Tokens"
            value={monster.speedTokens ?? 0}
            onChange={(value) =>
              saveMonsterData(
                { speedTokens: value },
                MONSTER_SPEED_TOKENS_UPDATED_MESSAGE(monster.speed, value)
              )
            }
            readOnly={false}>
            <Input
              id="monster-speed-tokens"
              type="number"
              value={monster.speedTokens}
              onChange={(e) =>
                saveMonsterData(
                  { speedTokens: parseInt(e.target.value) || 0 },
                  MONSTER_SPEED_TOKENS_UPDATED_MESSAGE(
                    monster.speed,
                    parseInt(e.target.value) || 0
                  )
                )
              }
              className="w-24 h-12 text-center no-spinners text-xl bg-muted!"
              name="monster-speed-tokens"
            />
          </NumericInput>
          <Input
            id="monster-speed-total"
            type="number"
            value={(monster.speed ?? 0) + (monster.speedTokens ?? 0)}
            className="w-24 h-12 text-center no-spinners text-xl"
            name="monster-speed-total"
            readOnly={true}
            disabled={true}
          />
        </div>
      </div>
    </div>
  )
}
