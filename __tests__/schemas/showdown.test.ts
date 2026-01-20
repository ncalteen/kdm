import {
  AmbushType,
  ColorChoice,
  MonsterLevel,
  MonsterType,
  TurnType
} from '@/lib/enums'
import { ShowdownSchema } from '@/schemas/showdown'
import { ShowdownMonsterSchema } from '@/schemas/showdown-monster'
import { ShowdownMonsterTurnStateSchema } from '@/schemas/showdown-monster-turn-state'
import { ShowdownSurvivorDetailsSchema } from '@/schemas/showdown-survivor-details'
import { ShowdownSurvivorTurnStateSchema } from '@/schemas/showdown-survivor-turn-state'
import { ShowdownTurnSchema } from '@/schemas/showdown-turn'
import { describe, expect, it } from 'vitest'

const basicShowdown = {
  ambush: AmbushType.NONE,
  id: 1,
  level: MonsterLevel.LEVEL_1,
  monsters: [
    {
      ...ShowdownMonsterSchema.parse({
        name: 'White Lion',
        type: MonsterType.QUARRY
      })
    }
  ],
  scout: 4,
  settlementId: 1,
  survivorDetails: [
    {
      ...ShowdownSurvivorDetailsSchema.parse({ id: 1 })
    },
    {
      ...ShowdownSurvivorDetailsSchema.parse({ id: 2 })
    },
    {
      ...ShowdownSurvivorDetailsSchema.parse({ id: 3 })
    },
    {
      ...ShowdownSurvivorDetailsSchema.parse({ id: 4 })
    }
  ],
  survivors: [1, 2, 3],
  turn: {}
}

describe('ShowdownSurvivorDetailsSchema', () => {
  describe('Valid Data', () => {
    it('should validate with minimal required fields', () => {
      const result = ShowdownSurvivorDetailsSchema.safeParse({
        id: 1
      })

      expect(result.success).toBe(true)
    })

    it('should validate with all fields populated', () => {
      const result = ShowdownSurvivorDetailsSchema.safeParse({
        accuracyTokens: 2,
        bleedingTokens: 3,
        blockTokens: 1,
        color: ColorChoice.BLUE,
        deflectTokens: 2,
        evasionTokens: 1,
        id: 5,
        insanityTokens: 3,
        knockedDown: true,
        luckTokens: 1,
        movementTokens: 2,
        notes: 'Test notes',
        priorityTarget: true,
        speedTokens: 1,
        strengthTokens: 2,
        survivalTokens: 1
      })

      expect(result.success).toBe(true)
    })
  })

  describe('Invalid Data', () => {
    it('should fail when id is missing', () => {
      const result = ShowdownSurvivorDetailsSchema.safeParse({
        knockedDown: false
      })

      expect(result.success).toBe(false)
    })

    it('should fail when bleedingTokens is negative', () => {
      const result = ShowdownSurvivorDetailsSchema.safeParse({
        id: 1,
        bleedingTokens: -1
      })

      expect(result.success).toBe(false)
    })
  })
})

describe('ShowdownMonsterSchema', () => {
  describe('Valid Data', () => {
    it('should validate with minimal required fields', () => {
      const result = ShowdownMonsterSchema.safeParse({
        name: 'White Lion',
        type: MonsterType.QUARRY,
        aiDeck: {
          basic: 0,
          advanced: 0,
          legendary: 0
        }
      })

      expect(result.success).toBe(true)
    })

    it('should validate with all fields populated', () => {
      const result = ShowdownMonsterSchema.safeParse({
        accuracy: 2,
        accuracyTokens: 1,
        aiDeck: {
          basic: 3,
          advanced: 2,
          legendary: 2,
          overtone: 1
        },
        aiDeckRemaining: 8,
        damage: 3,
        damageTokens: 2,
        evasion: 1,
        evasionTokens: 1,
        knockedDown: true,
        level: MonsterLevel.LEVEL_3,
        luck: 2,
        luckTokens: 1,
        moods: ['Enraged'],
        movement: 6,
        movementTokens: 2,
        name: 'Phoenix',
        notes: 'Showdown notes',
        speed: 3,
        speedTokens: 1,
        strength: 4,
        strengthTokens: 2,
        toughness: 15,
        traits: ['Flying', 'Terrifying'],
        type: MonsterType.NEMESIS,
        wounds: 8
      })

      expect(result.success).toBe(true)
    })

    it('should validate aiDeck without optional overtone cards', () => {
      const result = ShowdownMonsterSchema.safeParse({
        name: 'White Lion',
        type: MonsterType.QUARRY,
        aiDeck: {
          basic: 2,
          advanced: 3,
          legendary: 2
        }
      })

      expect(result.success).toBe(true)
    })
  })

  describe('Invalid Data', () => {
    it('should fail when name is empty', () => {
      const result = ShowdownMonsterSchema.safeParse({
        name: '',
        type: MonsterType.QUARRY,
        aiDeck: {
          basic: 0,
          advanced: 0,
          legendary: 0
        }
      })

      expect(result.success).toBe(false)
    })

    it('should fail when aiDeck has negative values', () => {
      const result = ShowdownMonsterSchema.safeParse({
        name: 'Test Monster',
        type: MonsterType.QUARRY,
        aiDeck: {
          basic: -1,
          advanced: 0,
          legendary: 0
        }
      })

      expect(result.success).toBe(false)
    })

    it('should fail when aiDeckRemaining is negative', () => {
      const result = ShowdownMonsterSchema.safeParse({
        name: 'Test Monster',
        type: MonsterType.QUARRY,
        aiDeck: {
          basic: 2,
          advanced: 2,
          legendary: 2
        },
        aiDeckRemaining: -1
      })

      expect(result.success).toBe(false)
    })
  })
})

describe('SurvivorTurnStateSchema', () => {
  describe('Valid Data', () => {
    it('should validate with defaults', () => {
      const result = ShowdownSurvivorTurnStateSchema.safeParse({
        id: 1
      })

      expect(result.success).toBe(true)
    })

    it('should validate with all fields set', () => {
      const result = ShowdownSurvivorTurnStateSchema.safeParse({
        activationUsed: true,
        id: 5,
        movementUsed: true
      })

      expect(result.success).toBe(true)
    })
  })

  describe('Invalid Data', () => {
    it('should fail when id is missing', () => {
      const result = ShowdownSurvivorTurnStateSchema.safeParse({
        activationUsed: true
      })

      expect(result.success).toBe(false)
    })
  })
})

describe('ShowdownMonsterTurnStateSchema', () => {
  describe('Valid Data', () => {
    it('should validate with defaults', () => {
      const result = ShowdownMonsterTurnStateSchema.safeParse({})

      expect(result.success).toBe(true)
    })

    it('should validate with aiCardDrawn set to true', () => {
      const result = ShowdownMonsterTurnStateSchema.safeParse({
        aiCardDrawn: true
      })

      expect(result.success).toBe(true)
    })
  })
})

describe('ShowdownTurnSchema', () => {
  describe('Valid Data', () => {
    it('should validate with defaults', () => {
      const result = ShowdownTurnSchema.safeParse({})

      expect(result.success).toBe(true)
    })

    it('should validate with all fields populated', () => {
      const result = ShowdownTurnSchema.safeParse({
        currentTurn: TurnType.SURVIVORS,
        monsterState: {
          aiCardDrawn: true
        },
        survivorStates: [
          { id: 1, activationUsed: true, movementUsed: false },
          { id: 2, activationUsed: false, movementUsed: true }
        ]
      })

      expect(result.success).toBe(true)
    })
  })

  describe('Invalid Data', () => {
    it('should fail when currentTurn has invalid value', () => {
      const result = ShowdownTurnSchema.safeParse({
        currentTurn: 'invalid'
      })

      expect(result.success).toBe(false)
    })
  })
})

describe('ShowdownSchema', () => {
  describe('Valid Data', () => {
    it('should validate with minimal required fields', () => {
      const result = ShowdownSchema.safeParse(basicShowdown)

      expect(result.success).toBe(true)
    })

    it('should validate with all ambush types', () => {
      const ambushTypes = [
        AmbushType.NONE,
        AmbushType.MONSTER,
        AmbushType.SURVIVORS
      ]

      ambushTypes.forEach((ambushType) => {
        const result = ShowdownSchema.safeParse({
          ...basicShowdown,
          ambush: ambushType
        })

        expect(result.success).toBe(true)
      })
    })
  })

  describe('Invalid Data', () => {
    it('should fail when no survivors are selected', () => {
      const result = ShowdownSchema.safeParse({
        ...basicShowdown,
        survivors: []
      })

      expect(result.success).toBe(false)
    })

    it('should fail when more than 4 survivors are selected', () => {
      const result = ShowdownSchema.safeParse({
        ...basicShowdown,
        survivors: [1, 2, 3, 4, 5]
      })

      expect(result.success).toBe(false)
    })

    it('should fail when ambush is missing', () => {
      const result = ShowdownSchema.safeParse({
        ...basicShowdown,
        ambush: undefined
      })

      expect(result.success).toBe(false)
    })
  })
})
