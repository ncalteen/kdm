import { HuntEventType, MonsterNode, MonsterType } from '@/lib/enums'
import { QuarryMonsterData } from '@/lib/types'

/**
 * White Gigalion Monster Data
 */
export const WHITE_GIGALION: QuarryMonsterData = {
  huntBoard: {
    0: undefined,
    1: HuntEventType.BASIC,
    2: HuntEventType.BASIC,
    3: HuntEventType.BASIC,
    4: HuntEventType.BASIC,
    5: HuntEventType.MONSTER,
    6: undefined,
    7: HuntEventType.MONSTER,
    8: HuntEventType.BASIC,
    9: HuntEventType.MONSTER,
    10: HuntEventType.MONSTER,
    11: HuntEventType.BASIC,
    12: undefined
  },
  name: 'White Gigalion',
  node: MonsterNode.NQ1,
  type: MonsterType.QUARRY,
  level2: {
    accuracy: 0,
    accuracyTokens: 0,
    aiDeckSize: 15,
    damage: 1,
    damageTokens: 0,
    evasion: 0,
    evasionTokens: 0,
    huntPos: 8,
    luck: 0,
    luckTokens: 0,
    moods: [],
    movement: 8,
    movementTokens: 0,
    speed: 1,
    speedTokens: 0,
    strength: 0,
    strengthTokens: 0,
    survivorStatuses: [],
    toughness: 10,
    toughnessTokens: 0,
    traits: ['Vicious', 'Giga Claws', 'Smart Cat']
  },
  level3: {
    accuracy: 0,
    accuracyTokens: 0,
    aiDeckSize: 20,
    damage: 2,
    damageTokens: 0,
    evasion: 0,
    evasionTokens: 0,
    huntPos: 8,
    luck: 0,
    luckTokens: 1,
    moods: [],
    movement: 10,
    movementTokens: 0,
    speed: 2,
    speedTokens: 0,
    strength: 0,
    strengthTokens: 0,
    survivorStatuses: [],
    toughness: 16,
    toughnessTokens: 0,
    traits: [
      'Vicious',
      'Giga Claws',
      'Smart Cat',
      'Merciless',
      'Golden Eyes',
      'Indomitable'
    ]
  },
  timeline: {}
}
