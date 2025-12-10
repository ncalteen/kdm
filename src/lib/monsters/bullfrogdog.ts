import { HuntEventType, MonsterNode, MonsterType } from '@/lib/enums'
import { QuarryMonsterData } from '@/lib/types'

/**
 * Bullfrogdog Monster Data
 */
export const BULLFROGDOG: QuarryMonsterData = {
  huntBoard: {
    0: undefined,
    1: HuntEventType.BASIC,
    2: HuntEventType.MONSTER,
    3: HuntEventType.BASIC,
    4: HuntEventType.BASIC,
    5: HuntEventType.MONSTER,
    6: undefined,
    7: HuntEventType.MONSTER,
    8: HuntEventType.BASIC,
    9: HuntEventType.MONSTER,
    10: HuntEventType.BASIC,
    11: HuntEventType.BASIC,
    12: undefined
  },
  name: 'Bullfrogdog',
  node: MonsterNode.NQ1,
  type: MonsterType.QUARRY,
  level3: {
    accuracy: 0,
    accuracyTokens: 2,
    aiDeckSize: 23,
    damage: 2,
    damageTokens: 0,
    evasion: 0,
    evasionTokens: 0,
    huntPos: 0,
    luck: 0,
    luckTokens: 1,
    moods: ['Indigestion'],
    movement: 10,
    movementTokens: 0,
    speed: 2,
    speedTokens: 0,
    strength: 0,
    strengthTokens: 0,
    survivorStatuses: [],
    toughness: 17,
    toughnessTokens: 0,
    traits: [
      'Foul Stench',
      'Double Sphincter',
      'Gaseous Bloat',
      'Mature',
      'Bullish Charge',
      'Indomitable'
    ]
  },
  timeline: {}
}
