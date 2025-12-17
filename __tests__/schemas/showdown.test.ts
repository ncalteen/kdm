import {
  AmbushType,
  ColorChoice,
  MonsterLevel,
  MonsterType,
  TurnType
} from '@/lib/enums'
import {
  MonsterTurnStateSchema,
  ShowdownMonsterSchema,
  ShowdownSchema,
  SurvivorShowdownDetailsSchema,
  SurvivorTurnStateSchema,
  TurnSchema
} from '@/schemas/showdown'
import { describe, expect, it } from 'vitest'

describe('SurvivorShowdownDetailsSchema', () => {
  describe('Valid Data', () => {
    it('should validate with minimal required fields', () => {
      const result = SurvivorShowdownDetailsSchema.safeParse({
        id: 1
      })

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.id).toBe(1)
        expect(result.data.color).toBe(ColorChoice.SLATE)
        expect(result.data.knockedDown).toBe(false)
        expect(result.data.bleedingTokens).toBe(0)
      }
    })

    it('should validate with all fields populated', () => {
      const result = SurvivorShowdownDetailsSchema.safeParse({
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
      if (result.success) {
        expect(result.data.knockedDown).toBe(true)
        expect(result.data.priorityTarget).toBe(true)
        expect(result.data.bleedingTokens).toBe(3)
      }
    })
  })

  describe('Invalid Data', () => {
    it('should fail when id is missing', () => {
      const result = SurvivorShowdownDetailsSchema.safeParse({
        knockedDown: false
      })

      expect(result.success).toBe(false)
    })

    it('should fail when bleedingTokens is negative', () => {
      const result = SurvivorShowdownDetailsSchema.safeParse({
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
      if (result.success) {
        expect(result.data.name).toBe('White Lion')
        expect(result.data.knockedDown).toBe(false)
        expect(result.data.aiDeck.basic).toBe(0)
        expect(result.data.aiDeckRemaining).toBe(0)
      }
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
      if (result.success) {
        expect(result.data.knockedDown).toBe(true)
        expect(result.data.level).toBe(MonsterLevel.LEVEL_3)
        expect(result.data.aiDeck.basic).toBe(3)
        expect(result.data.aiDeck.advanced).toBe(2)
        expect(result.data.aiDeck.legendary).toBe(2)
        expect(result.data.aiDeck.overtone).toBe(1)
        expect(result.data.aiDeckRemaining).toBe(8)
      }
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
      if (result.success) {
        expect(result.data.aiDeck.basic).toBe(2)
        expect(result.data.aiDeck.advanced).toBe(3)
        expect(result.data.aiDeck.legendary).toBe(2)
        expect(result.data.aiDeck.overtone).toBe(0)
      }
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

    it('should fail when aiDeck is missing', () => {
      const result = ShowdownMonsterSchema.safeParse({
        name: 'Test Monster',
        type: MonsterType.QUARRY
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
      const result = SurvivorTurnStateSchema.safeParse({
        id: 1
      })

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.activationUsed).toBe(false)
        expect(result.data.movementUsed).toBe(false)
      }
    })

    it('should validate with all fields set', () => {
      const result = SurvivorTurnStateSchema.safeParse({
        activationUsed: true,
        id: 5,
        movementUsed: true
      })

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.activationUsed).toBe(true)
        expect(result.data.movementUsed).toBe(true)
      }
    })
  })

  describe('Invalid Data', () => {
    it('should fail when id is missing', () => {
      const result = SurvivorTurnStateSchema.safeParse({
        activationUsed: true
      })

      expect(result.success).toBe(false)
    })
  })
})

describe('MonsterTurnStateSchema', () => {
  describe('Valid Data', () => {
    it('should validate with defaults', () => {
      const result = MonsterTurnStateSchema.safeParse({})

      expect(result.success).toBe(true)
      if (result.success) expect(result.data.aiCardDrawn).toBe(false)
    })

    it('should validate with aiCardDrawn set to true', () => {
      const result = MonsterTurnStateSchema.safeParse({
        aiCardDrawn: true
      })

      expect(result.success).toBe(true)
      if (result.success) expect(result.data.aiCardDrawn).toBe(true)
    })
  })
})

describe('TurnSchema', () => {
  describe('Valid Data', () => {
    it('should validate with defaults', () => {
      const result = TurnSchema.safeParse({})

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.currentTurn).toBe(TurnType.MONSTER)
        expect(result.data.monsterState.aiCardDrawn).toBe(false)
        expect(result.data.survivorStates).toEqual([])
      }
    })

    it('should validate with all fields populated', () => {
      const result = TurnSchema.safeParse({
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
      if (result.success) {
        expect(result.data.currentTurn).toBe(TurnType.SURVIVORS)
        expect(result.data.survivorStates).toHaveLength(2)
      }
    })
  })

  describe('Invalid Data', () => {
    it('should fail when currentTurn has invalid value', () => {
      const result = TurnSchema.safeParse({
        currentTurn: 'invalid'
      })

      expect(result.success).toBe(false)
    })
  })
})

describe('ShowdownSchema', () => {
  describe('Valid Data', () => {
    it('should validate with minimal required fields', () => {
      const result = ShowdownSchema.safeParse({
        ambush: AmbushType.NONE,
        id: 1,
        monster: {
          name: 'White Lion',
          type: MonsterType.QUARRY,
          aiDeck: {
            basic: 2,
            advanced: 3,
            legendary: 2
          }
        },
        settlementId: 1,
        survivors: [1],
        turn: {}
      })

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.ambush).toBe(AmbushType.NONE)
        expect(result.data.survivors).toHaveLength(1)
      }
    })

    it('should validate with all ambush types', () => {
      const ambushTypes = [
        AmbushType.NONE,
        AmbushType.MONSTER,
        AmbushType.SURVIVORS
      ]

      ambushTypes.forEach((ambushType) => {
        const result = ShowdownSchema.safeParse({
          ambush: ambushType,
          id: 1,
          monster: {
            name: 'White Lion',
            type: MonsterType.QUARRY,
            aiDeck: {
              basic: 2,
              advanced: 3,
              legendary: 2
            }
          },
          settlementId: 1,
          survivors: [1],
          turn: {}
        })

        expect(result.success).toBe(true)
      })
    })

    it('should validate with scout field', () => {
      const result = ShowdownSchema.safeParse({
        ambush: AmbushType.NONE,
        id: 1,
        monster: {
          name: 'White Lion',
          type: MonsterType.QUARRY,
          aiDeck: {
            basic: 2,
            advanced: 3,
            legendary: 2
          }
        },
        scout: 3,
        settlementId: 1,
        survivors: [1, 2, 3],
        turn: {}
      })

      expect(result.success).toBe(true)
      if (result.success) expect(result.data.scout).toBe(3)
    })
  })

  describe('Invalid Data', () => {
    it('should fail when no survivors are selected', () => {
      const result = ShowdownSchema.safeParse({
        ambush: AmbushType.NONE,
        id: 1,
        monster: {
          name: 'White Lion',
          type: MonsterType.QUARRY,
          aiDeck: {
            basic: 2,
            advanced: 3,
            legendary: 2
          }
        },
        settlementId: 1,
        survivors: [],
        turn: {}
      })

      expect(result.success).toBe(false)
    })

    it('should fail when more than 4 survivors are selected', () => {
      const result = ShowdownSchema.safeParse({
        ambush: AmbushType.NONE,
        id: 1,
        monster: {
          name: 'White Lion',
          type: MonsterType.QUARRY,
          aiDeck: {
            basic: 2,
            advanced: 3,
            legendary: 2
          }
        },
        settlementId: 1,
        survivors: [1, 2, 3, 4, 5],
        turn: {}
      })

      expect(result.success).toBe(false)
    })

    it('should fail when ambush is missing', () => {
      const result = ShowdownSchema.safeParse({
        id: 1,
        monster: {
          name: 'White Lion',
          type: MonsterType.QUARRY,
          aiDeck: {
            basic: 2,
            advanced: 3,
            legendary: 2
          }
        },
        settlementId: 1,
        survivors: [1],
        turn: {}
      })

      expect(result.success).toBe(false)
    })
  })
})
