import { ColorChoice, MonsterLevel, MonsterType } from '@/lib/enums'
import {
  HuntMonsterSchema,
  HuntSchema,
  SurvivorHuntDetailsSchema
} from '@/schemas/hunt'
import { describe, expect, it } from 'vitest'

describe('SurvivorHuntDetailsSchema', () => {
  describe('Valid Data', () => {
    it('should validate with minimal required fields', () => {
      const result = SurvivorHuntDetailsSchema.safeParse({
        id: 1
      })

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.id).toBe(1)
        expect(result.data.accuracyTokens).toBe(0)
        expect(result.data.color).toBe(ColorChoice.SLATE)
        expect(result.data.notes).toBe('')
      }
    })

    it('should validate with all fields populated', () => {
      const result = SurvivorHuntDetailsSchema.safeParse({
        accuracyTokens: 2,
        color: ColorChoice.RED,
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
      if (result.success) {
        expect(result.data.accuracyTokens).toBe(2)
        expect(result.data.color).toBe(ColorChoice.RED)
        expect(result.data.notes).toBe('Test notes')
      }
    })
  })

  describe('Invalid Data', () => {
    it('should fail when id is missing', () => {
      const result = SurvivorHuntDetailsSchema.safeParse({
        accuracyTokens: 1
      })

      expect(result.success).toBe(false)
    })

    it('should fail when id is negative', () => {
      const result = SurvivorHuntDetailsSchema.safeParse({
        id: -1
      })

      expect(result.success).toBe(false)
    })

    it('should fail when token values are not integers', () => {
      const result = SurvivorHuntDetailsSchema.safeParse({
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
        type: MonsterType.QUARRY,
        aiDeck: {
          basic: 0,
          advanced: 0,
          legendary: 0
        }
      })

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.name).toBe('White Lion')
        expect(result.data.level).toBe(MonsterLevel.LEVEL_1)
        expect(result.data.movement).toBe(1)
        expect(result.data.aiDeck.advanced).toBe(0)
        expect(result.data.aiDeck.basic).toBe(0)
        expect(result.data.aiDeck.legendary).toBe(0)
        expect(result.data.aiDeckRemaining).toBe(0)
      }
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
      if (result.success) {
        expect(result.data.name).toBe('Screaming Antelope')
        expect(result.data.level).toBe(MonsterLevel.LEVEL_2)
        expect(result.data.toughness).toBe(10)
        expect(result.data.aiDeck.advanced).toBe(3)
        expect(result.data.aiDeck.basic).toBe(2)
        expect(result.data.aiDeck.legendary).toBe(2)
        expect(result.data.aiDeck.overtone).toBe(1)
        expect(result.data.aiDeckRemaining).toBe(6)
      }
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
      if (result.success) {
        expect(result.data.aiDeck.advanced).toBe(2)
        expect(result.data.aiDeck.basic).toBe(3)
        expect(result.data.aiDeck.legendary).toBe(2)
        expect(result.data.aiDeck.overtone).toBe(0)
      }
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
      if (result.success) {
        expect(result.data.aiDeck.overtone).toBe(0)
      }
    })
  })

  describe('Invalid Data', () => {
    it('should fail when name is empty', () => {
      const result = HuntMonsterSchema.safeParse({
        name: '',
        type: MonsterType.QUARRY,
        aiDeck: {
          advanced: 0,
          basic: 0,
          legendary: 0
        }
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
        name: 'Test Monster',
        aiDeck: {
          advanced: 0,
          basic: 0,
          legendary: 0
        }
      })

      expect(result.success).toBe(false)
    })

    it('should fail when aiDeck is missing', () => {
      const result = HuntMonsterSchema.safeParse({
        name: 'Test Monster',
        type: MonsterType.QUARRY
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

    it('should fail when negative values are provided for non-negative fields', () => {
      const result = HuntMonsterSchema.safeParse({
        name: 'Test Monster',
        type: MonsterType.QUARRY,
        aiDeck: {
          advanced: 0,
          basic: 0,
          legendary: 0
        },
        toughness: -1
      })

      expect(result.success).toBe(false)
    })
  })
})

describe('HuntSchema', () => {
  describe('Valid Data', () => {
    it('should validate with minimal required fields', () => {
      const result = HuntSchema.safeParse({
        id: 1,
        monster: {
          name: 'White Lion',
          type: MonsterType.QUARRY,
          aiDeck: {
            advanced: 2,
            basic: 3,
            legendary: 2
          }
        },
        monsterPosition: 9,
        settlementId: 1,
        survivors: [1]
      })

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.survivors).toHaveLength(1)
        expect(result.data.survivorPosition).toBe(0)
      }
    })

    it('should validate with maximum survivors', () => {
      const result = HuntSchema.safeParse({
        id: 1,
        monster: {
          name: 'White Lion',
          type: MonsterType.QUARRY,
          aiDeck: {
            advanced: 2,
            basic: 3,
            legendary: 2
          }
        },
        monsterPosition: 5,
        settlementId: 1,
        survivors: [1, 2, 3, 4],
        survivorDetails: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }]
      })

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.survivors).toHaveLength(4)
        expect(result.data.survivorDetails).toHaveLength(4)
      }
    })

    it('should validate with scout field', () => {
      const result = HuntSchema.safeParse({
        id: 1,
        monster: {
          name: 'White Lion',
          type: MonsterType.QUARRY,
          aiDeck: {
            advanced: 2,
            basic: 3,
            legendary: 2
          }
        },
        monsterPosition: 5,
        scout: 2,
        settlementId: 1,
        survivors: [1, 2, 3]
      })

      expect(result.success).toBe(true)
      if (result.success) expect(result.data.scout).toBe(2)
    })
  })

  describe('Invalid Data', () => {
    it('should fail when no survivors are selected', () => {
      const result = HuntSchema.safeParse({
        id: 1,
        monster: {
          name: 'White Lion',
          type: MonsterType.QUARRY,
          aiDeck: {
            advanced: 2,
            basic: 3,
            legendary: 2
          }
        },
        monsterPosition: 5,
        settlementId: 1,
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

    it('should fail when more than 4 survivors are selected', () => {
      const result = HuntSchema.safeParse({
        id: 1,
        monster: {
          name: 'White Lion',
          type: MonsterType.QUARRY,
          aiDeck: {
            advanced: 2,
            basic: 3,
            legendary: 2
          }
        },
        monsterPosition: 5,
        settlementId: 1,
        survivors: [1, 2, 3, 4, 5]
      })

      expect(result.success).toBe(false)
      if (!result.success)
        expect(result.error.issues).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              message: 'No more than four survivors can embark on a hunt.'
            })
          ])
        )
    })

    it('should fail when monsterPosition is out of range', () => {
      const result = HuntSchema.safeParse({
        id: 1,
        monster: {
          name: 'White Lion',
          type: MonsterType.QUARRY,
          aiDeck: {
            advanced: 2,
            basic: 3,
            legendary: 2
          }
        },
        monsterPosition: 13,
        settlementId: 1,
        survivors: [1]
      })

      expect(result.success).toBe(false)
    })

    it('should fail when survivorPosition is out of range', () => {
      const result = HuntSchema.safeParse({
        id: 1,
        monster: {
          name: 'White Lion',
          type: MonsterType.QUARRY,
          aiDeck: {
            advanced: 2,
            basic: 3,
            legendary: 2
          }
        },
        monsterPosition: 5,
        settlementId: 1,
        survivors: [1],
        survivorPosition: 13
      })

      expect(result.success).toBe(false)
    })

    it('should fail when id is negative', () => {
      const result = HuntSchema.safeParse({
        id: -1,
        monster: {
          name: 'White Lion',
          type: MonsterType.QUARRY,
          aiDeck: {
            advanced: 2,
            basic: 3,
            legendary: 2
          }
        },
        monsterPosition: 5,
        settlementId: 1,
        survivors: [1]
      })

      expect(result.success).toBe(false)
    })
  })
})
