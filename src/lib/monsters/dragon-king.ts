import { HuntEventType, MonsterNode, MonsterType } from '@/lib/enums'
import { NemesisMonsterData, QuarryMonsterData } from '@/lib/types'

/**
 * Dragon King Monster Data
 */
export const DRAGON_KING: QuarryMonsterData = {
  ccRewards: [],
  huntBoard: {
    0: undefined,
    1: HuntEventType.MONSTER,
    2: HuntEventType.BASIC,
    3: HuntEventType.MONSTER,
    4: HuntEventType.MONSTER,
    5: HuntEventType.BASIC,
    6: undefined,
    7: HuntEventType.MONSTER,
    8: HuntEventType.BASIC,
    9: HuntEventType.BASIC,
    10: HuntEventType.MONSTER,
    11: HuntEventType.BASIC,
    12: undefined
  },
  id: 5,
  name: 'Dragon King',
  node: MonsterNode.NQ3,
  type: MonsterType.QUARRY,
  level1: {
    accuracy: 0,
    accuracyTokens: 0,
    aiDeckSize: 12,
    damage: 0,
    damageTokens: 0,
    evasion: 0,
    evasionTokens: 0,
    huntPos: 0,
    luck: 0,
    luckTokens: 0,
    moods: [],
    movement: 10,
    movementTokens: 0,
    speed: 0,
    speedTokens: 0,
    strength: 0,
    strengthTokens: 0,
    survivorStatuses: [],
    toughness: 13,
    toughnessTokens: 0,
    traits: ['Irradiate', 'Unseen Agony']
  },
  level2: {
    accuracy: 0,
    accuracyTokens: 0,
    aiDeckSize: 16,
    damage: 1,
    damageTokens: 0,
    evasion: 0,
    evasionTokens: 0,
    huntPos: 0,
    luck: 0,
    luckTokens: 0,
    moods: [],
    movement: 10,
    movementTokens: 0,
    speed: 1,
    speedTokens: 0,
    strength: 0,
    strengthTokens: 0,
    survivorStatuses: [],
    toughness: 15,
    toughnessTokens: 0,
    traits: ['Irradiate', 'Unseen Agony']
  },
  level3: {
    accuracy: 0,
    accuracyTokens: 0,
    aiDeckSize: 19,
    damage: 2,
    damageTokens: 0,
    evasion: 0,
    evasionTokens: 0,
    huntPos: 0,
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
    toughness: 17,
    toughnessTokens: 0,
    traits: ['Irradiate', 'Smolder', 'Unseen Agony', 'Indomitable']
  },
  locations: [{ name: 'Dragon Armory', unlocked: false }],
  timeline: {
    8: ['Glowing Crater']
  }
}

/**
 * Dying God Monster Data
 *
 * Finale boss for PotStars campaigns.
 */
export const DYING_GOD: NemesisMonsterData = {
  name: 'Dying God (Dragon King)',
  node: MonsterNode.FI,
  type: MonsterType.NEMESIS,
  level3: {
    accuracy: 0,
    accuracyTokens: 0,
    aiDeckSize: 12,
    damage: 3,
    damageTokens: 0,
    evasion: 0,
    evasionTokens: 0,
    life: 20,
    luck: 0,
    luckTokens: 0,
    moods: [],
    movement: 10,
    movementTokens: 0,
    speed: 2,
    speedTokens: 0,
    strength: 0,
    strengthTokens: 0,
    survivorStatuses: [],
    toughness: 17,
    toughnessTokens: 0,
    traits: ['Irradiate', 'Smolder', 'Trample', 'Unseen Agony']
  },
  timeline: {
    24: ['Nemesis Encounter - Death of the Dragon King']
  }
}
