'use client'

import { NumericInput } from '@/components/menu/numeric-input'
import { Input } from '@/components/ui/input'
import { HuntMonster } from '@/schemas/hunt'
import { ReactElement } from 'react'

/**
 * Hunt Monster Base Stats Component Properties
 */
interface HuntMonsterBaseStatsProps {
  /** Monster data */
  monster: HuntMonster
  /** Save Monster Data function */
  saveMonsterData: (
    updateData: Partial<HuntMonster>,
    successMsg?: string
  ) => void
}

/**
 * Hunt Monster Base Stats Component
 *
 * Displays the base stats (AI Deck, Wounds, Toughness) for a hunt monster.
 *
 * @param props Base Hunt Monster Stats Properties
 * @returns Base Hunt Monster Stats Component
 */
export function HuntMonsterBaseStats({
  monster,
  saveMonsterData
}: HuntMonsterBaseStatsProps): ReactElement {
  return (
    <div className="grid grid-cols-3">
      {/* AI Deck */}
      <div className="bg-background/40 rounded-lg p-2 text-center">
        <div className="text-xs text-muted-foreground pb-1">AI Deck</div>
        <NumericInput
          label="AI Deck Size"
          value={monster.aiDeckSize ?? 0}
          onChange={(value) =>
            saveMonsterData({ aiDeckSize: value }, 'AI Deck Size updated.')
          }
          min={0}
          readOnly={false}>
          <Input
            id="monster-ai-deck"
            type="number"
            value={monster.aiDeckSize}
            onChange={(e) =>
              saveMonsterData(
                { aiDeckSize: parseInt(e.target.value) || 0 },
                'AI Deck Size updated.'
              )
            }
            className="text-center border-0 bg-transparent p-0 no-spinners focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
            min="0"
            name="monster-ai-deck"
          />
        </NumericInput>
      </div>

      {/* Wounds */}
      <div className="bg-background/40 rounded-lg p-2 text-center">
        <div className="text-xs text-muted-foreground pb-1 flex items-center justify-center gap-1">
          Wounds
        </div>
        <NumericInput
          label="Wounds"
          value={monster.wounds ?? 0}
          onChange={(value) =>
            saveMonsterData({ wounds: value }, 'Wounds updated.')
          }
          min={0}
          readOnly={false}>
          <Input
            id="monster-wounds"
            type="number"
            value={monster.wounds}
            onChange={(e) =>
              saveMonsterData(
                { wounds: parseInt(e.target.value) || 0 },
                'Wounds updated.'
              )
            }
            className="text-center border-0 bg-transparent p-0 no-spinners focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
            min="0"
            name="monster-wounds"
          />
        </NumericInput>
      </div>

      {/* Toughness */}
      <div className="bg-background/40 rounded-lg p-2 text-center">
        <div className="text-xs text-muted-foreground pb-1 flex items-center justify-center gap-1">
          Toughness
        </div>
        <NumericInput
          label="Toughness"
          value={monster.toughness ?? 0}
          onChange={(value) =>
            saveMonsterData({ toughness: value }, 'Toughness updated.')
          }
          min={0}
          readOnly={false}>
          <Input
            id="monster-toughness"
            type="number"
            value={monster.toughness}
            onChange={(e) =>
              saveMonsterData(
                { toughness: parseInt(e.target.value) || 0 },
                'Toughness updated.'
              )
            }
            className="text-center border-0 bg-transparent p-0 no-spinners focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
            min="0"
            name="monster-toughness"
          />
        </NumericInput>
      </div>
    </div>
  )
}
