import { basicHuntBoard } from '@/lib/common'
import { MonsterLevel, MonsterType } from '@/lib/enums'
import { HuntSchema } from '@/schemas/hunt'
import { HuntMonsterSchema } from '@/schemas/hunt-monster'
import { HuntSurvivorDetailsSchema } from '@/schemas/hunt-survivor-details'
import { describe, expect, it } from 'vitest'

const basicHunt = {
  huntBoard: basicHuntBoard,
  id: 1,
  level: MonsterLevel.LEVEL_1,
  monsters: [
    {
      ...HuntMonsterSchema.parse({
        name: 'White Lion',
        type: MonsterType.QUARRY
      })
    }
  ],
  monsterPosition: 5,
  scout: 4,
  settlementId: 1,
  survivorDetails: [
    {
      ...HuntSurvivorDetailsSchema.parse({ id: 1 })
    },
    {
      ...HuntSurvivorDetailsSchema.parse({ id: 2 })
    },
    {
      ...HuntSurvivorDetailsSchema.parse({ id: 3 })
    },
    {
      ...HuntSurvivorDetailsSchema.parse({ id: 4 })
    }
  ],
  survivorPosition: 3,
  survivors: [1, 2, 3]
}

describe('HuntSurvivorDetailsSchema', () => {
  describe('Valid Data', () => {
    it('should validate with minimal required fields', () => {
      const result = HuntSurvivorDetailsSchema.safeParse({
        id: 1
      })

      expect(result.success).toBe(true)
    })

    it('should validate with all fields populated', () => {
      const result = HuntSurvivorDetailsSchema.safeParse({
        accuracyTokens: 2,
        evasionTokens: 1,
        id: 5,
        insanityTokens: 3,
        luckTokens: 1,
        movementTokens: 2,
        notes: 'Test notes',
        speedTokens: 1,
        strengthTokens: 2,
        survivalTokens: 1
      })

      expect(result.success).toBe(true)
    })
  })

  describe('Invalid Data', () => {
    it('should fail when id is missing', () => {
      const result = HuntSurvivorDetailsSchema.safeParse({
        accuracyTokens: 1
      })

      expect(result.success).toBe(false)
    })

    it('should fail when id is negative', () => {
      const result = HuntSurvivorDetailsSchema.safeParse({
        id: -1
      })

      expect(result.success).toBe(false)
    })

    it('should fail when token values are not integers', () => {
      const result = HuntSurvivorDetailsSchema.safeParse({
        id: 1,
        accuracyTokens: 1.5
      })

      expect(result.success).toBe(false)
    })
  })
})

describe('HuntMonsterSchema', () => {
  describe('Valid Data', () => {
    it('should validate with minimal required fields', () => {
      const result = HuntMonsterSchema.safeParse({
        name: 'White Lion',
        type: MonsterType.QUARRY
      })

      expect(result.success).toBe(true)
    })

    it('should validate with all fields populated', () => {
      const result = HuntMonsterSchema.safeParse({
        accuracy: 2,
        accuracyTokens: 1,
        aiDeck: {
          advanced: 3,
          basic: 2,
          legendary: 2,
          overtone: 1
        },
        aiDeckRemaining: 6,
        damage: 3,
        damageTokens: 2,
        evasion: 1,
        evasionTokens: 1,
        knockedDown: true,
        level: MonsterLevel.LEVEL_2,
        luck: 2,
        luckTokens: 1,
        moods: ['Agitated', 'Stalking'],
        movement: 6,
        movementTokens: 2,
        name: 'Screaming Antelope',
        notes: 'Monster notes',
        speed: 3,
        speedTokens: 1,
        strength: 4,
        strengthTokens: 2,
        toughness: 10,
        traits: ['Fast', 'Cunning'],
        type: MonsterType.QUARRY,
        wounds: 5
      })

      expect(result.success).toBe(true)
    })

    it('should validate aiDeck without optional O cards', () => {
      const result = HuntMonsterSchema.safeParse({
        name: 'White Lion',
        type: MonsterType.QUARRY,
        aiDeck: {
          advanced: 2,
          basic: 3,
          legendary: 2
        }
      })

      expect(result.success).toBe(true)
    })

    it('should validate aiDeck with O cards set to 0', () => {
      const result = HuntMonsterSchema.safeParse({
        name: 'White Lion',
        type: MonsterType.QUARRY,
        aiDeck: {
          advanced: 2,
          basic: 3,
          legendary: 2,
          overtone: 0
        }
      })

      expect(result.success).toBe(true)
    })
  })

  describe('Invalid Data', () => {
    it('should fail when name is empty', () => {
      const result = HuntMonsterSchema.safeParse({
        name: '',
        type: MonsterType.QUARRY
      })

      expect(result.success).toBe(false)
      if (!result.success)
        expect(result.error.issues).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              message: 'Monster name is required.'
            })
          ])
        )
    })

    it('should fail when type is missing', () => {
      const result = HuntMonsterSchema.safeParse({
        name: 'Test Monster'
      })

      expect(result.success).toBe(false)
    })

    it('should fail when aiDeck has negative values', () => {
      const result = HuntMonsterSchema.safeParse({
        name: 'Test Monster',
        type: MonsterType.QUARRY,
        aiDeck: {
          advanced: -1,
          basic: 0,
          legendary: 0
        }
      })

      expect(result.success).toBe(false)
    })

    it('should fail when aiDeck has non-integer values', () => {
      const result = HuntMonsterSchema.safeParse({
        name: 'Test Monster',
        type: MonsterType.QUARRY,
        aiDeck: {
          advanced: 1.5,
          basic: 0,
          legendary: 0
        }
      })

      expect(result.success).toBe(false)
    })

    it('should fail when aiDeckRemaining is negative', () => {
      const result = HuntMonsterSchema.safeParse({
        name: 'Test Monster',
        type: MonsterType.QUARRY,
        aiDeck: {
          advanced: 2,
          basic: 2,
          legendary: 2
        },
        aiDeckRemaining: -1
      })

      expect(result.success).toBe(false)
    })

    it('should fail when movement is less than 1', () => {
      const result = HuntMonsterSchema.safeParse({
        name: 'Test Monster',
        type: MonsterType.QUARRY,
        aiDeck: {
          advanced: 0,
          basic: 0,
          legendary: 0
        },
        movement: 0
      })

      expect(result.success).toBe(false)
    })
  })
})

describe('HuntSchema', () => {
  describe('Valid Data', () => {
    it('should validate with minimal required fields', () => {
      const result = HuntSchema.safeParse(basicHunt)

      expect(result.success).toBe(true)
    })

    it('should validate with maximum survivors', () => {
      const result = HuntSchema.safeParse({
        ...basicHunt,
        survivors: [1, 2, 3, 4]
      })

      expect(result.success).toBe(true)
    })
  })

  describe('Invalid Data', () => {
    it('should fail when no survivors are selected', () => {
      const result = HuntSchema.safeParse({
        ...basicHunt,
        survivors: []
      })

      expect(result.success).toBe(false)
      if (!result.success)
        expect(result.error.issues).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              message: 'At least one survivor must be selected for the hunt.'
            })
          ])
        )
    })

    it('should fail when monsterPosition is out of range', () => {
      const result = HuntSchema.safeParse({
        ...basicHunt,
        monsterPosition: 13
      })

      expect(result.success).toBe(false)
    })

    it('should fail when survivorPosition is out of range', () => {
      const result = HuntSchema.safeParse({
        ...basicHunt,
        survivorPosition: 13
      })

      expect(result.success).toBe(false)
    })

    it('should fail when id is negative', () => {
      const result = HuntSchema.safeParse({
        ...basicHunt,
        id: -1
      })

      expect(result.success).toBe(false)
    })
  })
})
