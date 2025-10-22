'use client'

import { NumericInput } from '@/components/menu/numeric-input'
import { Input } from '@/components/ui/input'
import { HuntMonster } from '@/schemas/hunt'
import { ReactElement } from 'react'

/**
 * Hunt Monster Attributes Component Properties
 */
interface HuntMonsterAttributesProps {
  /** Monster data */
  monster: HuntMonster
  /** Save Monster Data function */
  saveMonsterData: (
    updateData: Partial<HuntMonster>,
    successMsg?: string
  ) => void
}

/**
 * Hunt Monster Attributes Component
 *
 * Displays the monster attributes grid with base values, tokens, and totals
 * for Movement, Accuracy, Strength, Evasion, Luck, and Speed.
 *
 * @param props Hunt Monster Attributes Properties
 * @returns Hunt Monster Attributes Component
 */
export function HuntMonsterAttributes({
  monster,
  saveMonsterData
}: HuntMonsterAttributesProps): ReactElement {
  return (
    <div className="grid grid-cols-4">
      {/* Base Stats */}
      <div className="mb-2 col-span-4">
        <h3 className="text-sm font-semibold text-muted-foreground text-center">
          Attributes
        </h3>
      </div>

      <div></div>
      <div className="mb-1">
        <h4 className="text-xs font-semibold text-muted-foreground text-center">
          Base
        </h4>
      </div>
      <div className="mb-1">
        <h4 className="text-xs font-semibold text-muted-foreground text-center">
          Tokens
        </h4>
      </div>
      <div className="mb-1">
        <h4 className="text-xs font-semibold text-muted-foreground text-center">
          Total
        </h4>
      </div>

      {/* Movement */}
      <div className="text-xs text-muted-foreground text-center flex items-center justify-center">
        Movement
      </div>

      <div className="bg-background/40 rounded-lg p-1 text-center">
        <NumericInput
          label="Movement"
          value={monster.movement ?? 0}
          onChange={(value) =>
            saveMonsterData({ movement: value }, 'Movement updated.')
          }
          min={0}
          readOnly={false}>
          <Input
            id="monster-movement"
            type="number"
            value={monster.movement}
            onChange={(e) =>
              saveMonsterData(
                { movement: parseInt(e.target.value) || 0 },
                'Movement updated.'
              )
            }
            className="text-center border-0 bg-transparent p-0 no-spinners focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
            min="0"
            name="monster-movement"
          />
        </NumericInput>
      </div>

      <div className="bg-background/40 rounded-lg p-1 text-center">
        <NumericInput
          label="Movement Tokens"
          value={monster.movementTokens ?? 0}
          onChange={(value) =>
            saveMonsterData(
              { movementTokens: value },
              'Movement tokens updated.'
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
                'Movement tokens updated.'
              )
            }
            className="text-center border-0 bg-transparent p-0 no-spinners focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
            name="monster-movement-tokens"
          />
        </NumericInput>
      </div>

      <div className="p-1">
        <Input
          id="monster-movement-total"
          type="number"
          value={(monster.movementTokens ?? 0) + (monster.movement ?? 0)}
          className="text-center border-0 bg-transparent p-0 no-spinners focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
          name="monster-movement-total"
          readOnly={true}
        />
      </div>

      {/* Accuracy */}
      <div className="text-xs text-muted-foreground text-center flex items-center justify-center">
        Accuracy
      </div>

      <div className="bg-background/40 rounded-lg p-1 text-center">0</div>

      <div className="bg-background/40 rounded-lg p-1 text-center">
        <NumericInput
          label="Accuracy Tokens"
          value={monster.accuracyTokens ?? 0}
          onChange={(value) =>
            saveMonsterData(
              { accuracyTokens: value },
              'Accuracy tokens updated.'
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
                'Accuracy tokens updated.'
              )
            }
            className="text-center border-0 bg-transparent p-0 no-spinners focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
            min="0"
            name="monster-accuracy-tokens"
          />
        </NumericInput>
      </div>

      <div className="p-1">
        <Input
          id="monster-accuracy-total"
          type="number"
          value={(monster.accuracy ?? 0) + (monster.accuracyTokens ?? 0)}
          className="text-center border-0 bg-transparent p-0 no-spinners focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
          name="monster-accuracy-total"
          readOnly={true}
        />
      </div>

      {/* Strength */}
      <div className="text-xs text-muted-foreground text-center flex items-center justify-center">
        Strength
      </div>

      <div className="bg-background/40 rounded-lg p-1 text-center">0</div>

      <div className="bg-background/40 rounded-lg p-1 text-center">
        <NumericInput
          label="Strength Tokens"
          value={monster.strengthTokens ?? 0}
          onChange={(value) =>
            saveMonsterData(
              { strengthTokens: value },
              'Strength tokens updated.'
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
                'Strength tokens updated.'
              )
            }}
            className="text-center border-0 bg-transparent p-0 no-spinners focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
            min="0"
            name="monster-strength-tokens"
          />
        </NumericInput>
      </div>

      <div className="p-1">
        <Input
          id="monster-strength-total"
          type="number"
          value={(monster.strength ?? 0) + (monster.strengthTokens ?? 0)}
          className="text-center border-0 bg-transparent p-0 no-spinners focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
          name="monster-strength-total"
          readOnly={true}
        />
      </div>

      {/* Evasion */}
      <div className="text-xs text-muted-foreground text-center flex items-center justify-center">
        Evasion
      </div>

      <div className="bg-background/40 rounded-lg p-1 text-center">0</div>

      <div className="bg-background/40 rounded-lg p-1 text-center">
        <NumericInput
          label="Evasion Tokens"
          value={monster.evasionTokens ?? 0}
          onChange={(value) =>
            saveMonsterData({ evasionTokens: value }, 'Evasion tokens updated.')
          }
          readOnly={false}>
          <Input
            id="monster-evasion-tokens"
            type="number"
            value={monster.evasionTokens}
            onChange={(e) =>
              saveMonsterData(
                { evasionTokens: parseInt(e.target.value) || 0 },
                'Evasion tokens updated.'
              )
            }
            className="text-center border-0 bg-transparent p-0 no-spinners focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
            min="0"
            name="monster-evasion-tokens"
          />
        </NumericInput>
      </div>

      <div className="p-1">
        <Input
          id="monster-evasion-total"
          type="number"
          value={(monster.evasion ?? 0) + (monster.evasionTokens ?? 0)}
          className="text-center border-0 bg-transparent p-0 no-spinners focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
          name="monster-evasion-total"
          readOnly={true}
        />
      </div>

      {/* Luck */}
      <div className="text-xs text-muted-foreground text-center flex items-center justify-center">
        Luck
      </div>

      <div className="bg-background/40 rounded-lg p-1 text-center">0</div>

      <div className="bg-background/40 rounded-lg p-1 text-center">
        <NumericInput
          label="Luck Tokens"
          value={monster.luckTokens ?? 0}
          onChange={(value) =>
            saveMonsterData({ luckTokens: value }, 'Luck tokens updated.')
          }
          readOnly={false}>
          <Input
            id="monster-luck-tokens"
            type="number"
            value={monster.luckTokens}
            onChange={(e) =>
              saveMonsterData(
                { luckTokens: parseInt(e.target.value) || 0 },
                'Luck tokens updated.'
              )
            }
            className="text-center border-0 bg-transparent p-0 no-spinners focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
            min="0"
            name="monster-luck-tokens"
          />
        </NumericInput>
      </div>

      <div className="p-1">
        <Input
          id="monster-luck-total"
          type="number"
          value={(monster.luck ?? 0) + (monster.luckTokens ?? 0)}
          className="text-center border-0 bg-transparent p-0 no-spinners focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
          name="monster-luck-total"
          readOnly={true}
        />
      </div>

      {/* Speed */}
      <div className="text-xs text-muted-foreground text-center flex items-center justify-center">
        Speed
      </div>

      <div className="bg-background/40 rounded-lg p-1 text-center">
        <NumericInput
          label="Speed"
          value={monster.speed ?? 0}
          onChange={(value) =>
            saveMonsterData({ speed: value }, 'Speed updated.')
          }
          min={0}
          readOnly={false}>
          <Input
            id="monster-speed"
            type="number"
            value={monster.speed}
            onChange={(e) =>
              saveMonsterData(
                { speed: parseInt(e.target.value) || 0 },
                'Speed updated.'
              )
            }
            className="text-center border-0 bg-transparent p-0 no-spinners focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
            min="0"
            name="monster-speed"
          />
        </NumericInput>
      </div>

      <div className="bg-background/40 rounded-lg p-1 text-center">
        <NumericInput
          label="Speed Tokens"
          value={monster.speedTokens ?? 0}
          onChange={(value) =>
            saveMonsterData({ speedTokens: value }, 'Speed tokens updated.')
          }
          readOnly={false}>
          <Input
            id="monster-speed-tokens"
            type="number"
            value={monster.speedTokens}
            onChange={(e) =>
              saveMonsterData(
                { speedTokens: parseInt(e.target.value) || 0 },
                'Speed tokens updated.'
              )
            }
            className="text-center border-0 bg-transparent p-0 no-spinners focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
            min="0"
            name="monster-speed-tokens"
          />
        </NumericInput>
      </div>

      <div className="p-1">
        <Input
          id="monster-speed-total"
          type="number"
          value={(monster.speed ?? 0) + (monster.speedTokens ?? 0)}
          className="text-center border-0 bg-transparent p-0 no-spinners focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
          name="monster-speed-total"
          readOnly={true}
        />
      </div>
    </div>
  )
}
