import { basicHuntBoard } from '@/lib/common'
import {
  CampaignType,
  HuntEventType,
  MonsterNode,
  MonsterType
} from '@/lib/enums'
import {
  MonsterLevelSchema,
  NemesisMonsterLevelSchema,
  QuarryMonsterLevelSchema
} from '@/schemas/monster-level'
import { NemesisMonsterDataSchema } from '@/schemas/nemesis-monster-data'
import { QuarryMonsterDataSchema } from '@/schemas/quarry-monster-data'
import { describe, expect, it } from 'vitest'

describe('MonsterLevelSchema', () => {
  describe('Valid Data', () => {
    it('should validate with all defaults', () => {
      const result = MonsterLevelSchema.safeParse({
        aiDeck: {
          basic: 0,
          advanced: 0,
          legendary: 0
        }
      })

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.accuracy).toBe(0)
        expect(result.data.movement).toBe(1)
        expect(result.data.toughness).toBe(0)
        expect(result.data.aiDeck.basic).toBe(0)
        expect(result.data.aiDeckRemaining).toBe(0)
      }
    })

    it('should validate with all fields populated', () => {
      const result = MonsterLevelSchema.safeParse({
        accuracy: 3,
        accuracyTokens: 2,
        aiDeck: {
          basic: 3,
          advanced: 2,
          legendary: 2,
          overtone: 1
        },
        aiDeckRemaining: 8,
        damage: 5,
        damageTokens: 3,
        evasion: 2,
        evasionTokens: 1,
        luck: 1,
        luckTokens: 1,
        moods: ['Enraged', 'Agitated'],
        movement: 6,
        movementTokens: 2,
        speed: 4,
        speedTokens: 1,
        strength: 5,
        strengthTokens: 2,
        survivorStatuses: ['Bleeding', 'Knocked Down'],
        toughness: 12,
        toughnessTokens: 3,
        traits: ['Fast', 'Cunning']
      })

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.accuracy).toBe(3)
        expect(result.data.aiDeck.basic).toBe(3)
        expect(result.data.aiDeck.advanced).toBe(2)
        expect(result.data.aiDeck.legendary).toBe(2)
        expect(result.data.aiDeck.overtone).toBe(1)
        expect(result.data.aiDeckRemaining).toBe(8)
        expect(result.data.moods).toHaveLength(2)
        expect(result.data.traits).toHaveLength(2)
      }
    })

    it('should validate aiDeck without optional overtone', () => {
      const result = MonsterLevelSchema.safeParse({
        aiDeck: {
          basic: 3,
          advanced: 2,
          legendary: 2
        }
      })

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.aiDeck.overtone).toBe(0)
      }
    })

    it('should validate with empty arrays', () => {
      const result = MonsterLevelSchema.safeParse({
        aiDeck: {
          basic: 2,
          advanced: 2,
          legendary: 2
        },
        moods: [],
        traits: [],
        survivorStatuses: []
      })

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.moods).toEqual([])
        expect(result.data.traits).toEqual([])
        expect(result.data.survivorStatuses).toEqual([])
      }
    })
  })

  describe('Invalid Data', () => {
    it('should fail when aiDeck basic is negative', () => {
      const result = MonsterLevelSchema.safeParse({
        aiDeck: {
          basic: -1,
          advanced: 0,
          legendary: 0
        }
      })

      expect(result.success).toBe(false)
    })

    it('should fail when aiDeck advanced is negative', () => {
      const result = MonsterLevelSchema.safeParse({
        aiDeck: {
          basic: 0,
          advanced: -1,
          legendary: 0
        }
      })

      expect(result.success).toBe(false)
    })

    it('should fail when aiDeck legendary is negative', () => {
      const result = MonsterLevelSchema.safeParse({
        aiDeck: {
          basic: 0,
          advanced: 0,
          legendary: -1
        }
      })

      expect(result.success).toBe(false)
    })

    it('should fail when aiDeck overtone is negative', () => {
      const result = MonsterLevelSchema.safeParse({
        aiDeck: {
          basic: 0,
          advanced: 0,
          legendary: 0,
          overtone: -1
        }
      })

      expect(result.success).toBe(false)
    })

    it('should fail when aiDeckRemaining is negative', () => {
      const result = MonsterLevelSchema.safeParse({
        aiDeck: {
          basic: 2,
          advanced: 2,
          legendary: 2
        },
        aiDeckRemaining: -1
      })

      expect(result.success).toBe(false)
    })

    it('should fail when toughness is negative', () => {
      const result = MonsterLevelSchema.safeParse({
        aiDeck: {
          basic: 0,
          advanced: 0,
          legendary: 0
        },
        toughness: -1
      })

      expect(result.success).toBe(false)
    })

    it('should fail when aiDeck values are not integers', () => {
      const result = MonsterLevelSchema.safeParse({
        aiDeck: {
          basic: 2.5,
          advanced: 0,
          legendary: 0
        }
      })

      expect(result.success).toBe(false)
    })
  })
})

describe('QuarryMonsterLevelSchema', () => {
  describe('Valid Data', () => {
    it('should validate with all defaults', () => {
      const result = QuarryMonsterLevelSchema.safeParse({
        aiDeck: {
          basic: 0,
          advanced: 0,
          legendary: 0
        }
      })

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.huntPos).toBe(12)
        expect(result.data.survivorHuntPos).toBe(0)
      }
    })

    it('should validate with custom hunt positions', () => {
      const result = QuarryMonsterLevelSchema.safeParse({
        aiDeck: {
          basic: 3,
          advanced: 2,
          legendary: 2
        },
        huntPos: 9,
        survivorHuntPos: 3
      })

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.huntPos).toBe(9)
        expect(result.data.survivorHuntPos).toBe(3)
      }
    })

    it('should inherit all base monster level fields', () => {
      const result = QuarryMonsterLevelSchema.safeParse({
        aiDeck: {
          basic: 2,
          advanced: 3,
          legendary: 2
        },
        accuracy: 2,
        toughness: 8,
        movement: 5
      })

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.accuracy).toBe(2)
        expect(result.data.toughness).toBe(8)
        expect(result.data.movement).toBe(5)
      }
    })
  })

  describe('Invalid Data', () => {
    it('should fail when huntPos is negative', () => {
      const result = QuarryMonsterLevelSchema.safeParse({
        aiDeck: {
          basic: 0,
          advanced: 0,
          legendary: 0
        },
        huntPos: -1
      })

      expect(result.success).toBe(false)
    })

    it('should fail when survivorHuntPos is negative', () => {
      const result = QuarryMonsterLevelSchema.safeParse({
        aiDeck: {
          basic: 0,
          advanced: 0,
          legendary: 0
        },
        survivorHuntPos: -1
      })

      expect(result.success).toBe(false)
    })

    it('should fail when huntPos is not an integer', () => {
      const result = QuarryMonsterLevelSchema.safeParse({
        aiDeck: {
          basic: 0,
          advanced: 0,
          legendary: 0
        },
        huntPos: 9.5
      })

      expect(result.success).toBe(false)
    })
  })
})

describe('NemesisMonsterLevelSchema', () => {
  describe('Valid Data', () => {
    it('should validate with all defaults', () => {
      const result = NemesisMonsterLevelSchema.safeParse({
        aiDeck: {
          basic: 0,
          advanced: 0,
          legendary: 0
        }
      })

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.life).toBeUndefined()
      }
    })

    it('should validate with life field', () => {
      const result = NemesisMonsterLevelSchema.safeParse({
        aiDeck: {
          basic: 3,
          advanced: 2,
          legendary: 2
        },
        life: 10
      })

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.life).toBe(10)
      }
    })

    it('should inherit all base monster level fields', () => {
      const result = NemesisMonsterLevelSchema.safeParse({
        aiDeck: {
          basic: 2,
          advanced: 3,
          legendary: 2
        },
        accuracy: 3,
        toughness: 15,
        movement: 4,
        life: 12
      })

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.accuracy).toBe(3)
        expect(result.data.toughness).toBe(15)
        expect(result.data.movement).toBe(4)
        expect(result.data.life).toBe(12)
      }
    })
  })

  describe('Invalid Data', () => {
    it('should fail when life is less than 1', () => {
      const result = NemesisMonsterLevelSchema.safeParse({
        aiDeck: {
          basic: 0,
          advanced: 0,
          legendary: 0
        },
        life: 0
      })

      expect(result.success).toBe(false)
    })

    it('should fail when life is negative', () => {
      const result = NemesisMonsterLevelSchema.safeParse({
        aiDeck: {
          basic: 0,
          advanced: 0,
          legendary: 0
        },
        life: -1
      })

      expect(result.success).toBe(false)
    })

    it('should fail when life is not an integer', () => {
      const result = NemesisMonsterLevelSchema.safeParse({
        aiDeck: {
          basic: 0,
          advanced: 0,
          legendary: 0
        },
        life: 10.5
      })

      expect(result.success).toBe(false)
    })
  })
})

describe('NemesisMonsterDataSchema', () => {
  describe('Valid Data', () => {
    it('should validate with minimal required fields', () => {
      const result = NemesisMonsterDataSchema.safeParse({
        name: 'Butcher',
        node: MonsterNode.NN1,
        timeline: {},
        type: MonsterType.NEMESIS
      })

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.name).toBe('Butcher')
        expect(result.data.node).toBe(MonsterNode.NN1)
        expect(result.data.type).toBe(MonsterType.NEMESIS)
      }
    })

    it('should validate timeline with campaign-specific entries', () => {
      const result = NemesisMonsterDataSchema.safeParse({
        name: 'Butcher',
        node: MonsterNode.NN1,
        timeline: {
          '1': [
            'Story Event',
            {
              title: 'Campaign Specific Event',
              campaigns: [CampaignType.PEOPLE_OF_THE_LANTERN]
            }
          ]
        },
        type: MonsterType.NEMESIS
      })

      expect(result.success).toBe(true)
      if (result.success) {
        const timeline = result.data.timeline as Record<
          number,
          Array<string | { title: string; campaigns: CampaignType[] }>
        >
        expect(timeline[1]).toHaveLength(2)
        expect(timeline[1][0]).toBe('Story Event')
        expect(typeof timeline[1][1]).toBe('object')
      }
    })

    it('should validate with all nemesis nodes', () => {
      const nodes = [MonsterNode.NN1, MonsterNode.NN2, MonsterNode.NN3]

      nodes.forEach((node) => {
        const result = NemesisMonsterDataSchema.safeParse({
          name: 'Test Nemesis',
          node,
          timeline: {},
          type: MonsterType.NEMESIS
        })

        expect(result.success).toBe(true)
        if (result.success) expect(result.data.node).toBe(node)
      })
    })
  })

  describe('Invalid Data', () => {
    it('should fail when name is empty', () => {
      const result = NemesisMonsterDataSchema.safeParse({
        name: '',
        node: MonsterNode.NN1,
        timeline: {},
        type: MonsterType.NEMESIS
      })

      expect(result.success).toBe(false)
      if (!result.success)
        expect(result.error.issues).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              message: 'A nameless monster cannot be recorded.'
            })
          ])
        )
    })

    it('should fail when name is missing', () => {
      const result = NemesisMonsterDataSchema.safeParse({
        node: MonsterNode.NN1,
        timeline: {},
        type: MonsterType.NEMESIS
      })

      expect(result.success).toBe(false)
    })

    it('should fail when node is missing', () => {
      const result = NemesisMonsterDataSchema.safeParse({
        name: 'Butcher',
        timeline: {},
        type: MonsterType.NEMESIS
      })

      expect(result.success).toBe(false)
    })

    it('should fail when type is not NEMESIS', () => {
      const result = NemesisMonsterDataSchema.safeParse({
        name: 'Butcher',
        node: MonsterNode.NN1,
        timeline: {},
        type: MonsterType.QUARRY
      })

      expect(result.success).toBe(false)
    })

    it('should fail when timeline is missing', () => {
      const result = NemesisMonsterDataSchema.safeParse({
        name: 'Butcher',
        node: MonsterNode.NN1,
        type: MonsterType.NEMESIS
      })

      expect(result.success).toBe(false)
    })

    it('should fail when timeline entry has empty title', () => {
      const result = NemesisMonsterDataSchema.safeParse({
        name: 'Butcher',
        node: MonsterNode.NN1,
        timeline: {
          '1': [
            {
              title: '',
              campaigns: []
            }
          ]
        },
        type: MonsterType.NEMESIS
      })

      expect(result.success).toBe(false)
    })
  })
})

describe('QuarryMonsterDataSchema', () => {
  describe('Valid Data', () => {
    it('should validate with minimal required fields', () => {
      const result = QuarryMonsterDataSchema.safeParse({
        huntBoard: {},
        name: 'White Lion',
        node: MonsterNode.NQ1,
        timeline: {},
        type: MonsterType.QUARRY
      })

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.name).toBe('White Lion')
        expect(result.data.node).toBe(MonsterNode.NQ1)
        expect(result.data.type).toBe(MonsterType.QUARRY)
        expect(result.data.ccRewards).toEqual([])
        expect(result.data.locations).toEqual([])
      }
    })

    it('should validate with hunt board configuration', () => {
      const result = QuarryMonsterDataSchema.safeParse({
        huntBoard: {
          '1': HuntEventType.BASIC,
          '3': HuntEventType.MONSTER,
          '5': HuntEventType.BASIC,
          '9': HuntEventType.MONSTER,
          '11': HuntEventType.MONSTER
        },
        name: 'White Lion',
        node: MonsterNode.NQ1,
        timeline: {},
        type: MonsterType.QUARRY
      })

      expect(result.success).toBe(true)
      if (result.success) {
        const huntBoard = result.data.huntBoard as Record<
          number,
          HuntEventType.BASIC | HuntEventType.MONSTER | undefined
        >
        expect(huntBoard[1]).toBe(HuntEventType.BASIC)
        expect(huntBoard[3]).toBe(HuntEventType.MONSTER)
        expect(huntBoard[5]).toBe(HuntEventType.BASIC)
        expect(huntBoard[9]).toBe(HuntEventType.MONSTER)
        expect(huntBoard[11]).toBe(HuntEventType.MONSTER)
      }
    })

    it('should validate with locations', () => {
      const result = QuarryMonsterDataSchema.safeParse({
        huntBoard: {},
        name: 'White Lion',
        node: MonsterNode.NQ1,
        locations: [
          { name: 'Bone Smith', unlocked: false },
          { name: 'Organ Grinder', unlocked: false }
        ],
        timeline: {},
        type: MonsterType.QUARRY
      })

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.locations).toHaveLength(2)
        expect(result.data.locations[0].name).toBe('Bone Smith')
      }
    })

    it('should validate with collective cognition rewards', () => {
      const result = QuarryMonsterDataSchema.safeParse({
        ccRewards: [
          { cc: 5, name: 'Special Reward', unlocked: false },
          { cc: 10, name: 'Elite Reward', unlocked: false }
        ],
        huntBoard: {},
        name: 'White Lion',
        node: MonsterNode.NQ1,
        timeline: {},
        type: MonsterType.QUARRY
      })

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.ccRewards).toHaveLength(2)
        expect(result.data.ccRewards[0].cc).toBe(5)
      }
    })

    it('should validate with all quarry nodes', () => {
      const nodes = [
        MonsterNode.NQ1,
        MonsterNode.NQ2,
        MonsterNode.NQ3,
        MonsterNode.NQ4
      ]

      nodes.forEach((node) => {
        const result = QuarryMonsterDataSchema.safeParse({
          huntBoard: {},
          name: 'Test Quarry',
          node,
          timeline: {},
          type: MonsterType.QUARRY
        })

        expect(result.success).toBe(true)
        if (result.success) expect(result.data.node).toBe(node)
      })
    })

    it('should validate timeline with campaign-specific entries', () => {
      const result = QuarryMonsterDataSchema.safeParse({
        huntBoard: {},
        name: 'White Lion',
        node: MonsterNode.NQ1,
        timeline: {
          '2': [
            'First Story Event',
            {
              title: 'Campaign Specific',
              campaigns: [
                CampaignType.PEOPLE_OF_THE_LANTERN,
                CampaignType.PEOPLE_OF_THE_SUN
              ]
            }
          ],
          '6': ['Second Story Event']
        },
        type: MonsterType.QUARRY
      })

      expect(result.success).toBe(true)
      if (result.success) {
        const timeline = result.data.timeline as Record<
          number,
          Array<string | { title: string; campaigns: CampaignType[] }>
        >
        expect(timeline[2]).toHaveLength(2)
        expect(timeline[6]).toHaveLength(1)
      }
    })
  })

  describe('Invalid Data', () => {
    it('should fail when name is empty', () => {
      const result = QuarryMonsterDataSchema.safeParse({
        huntBoard: {},
        name: '',
        node: MonsterNode.NQ1,
        timeline: {},
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

    it('should fail when name is missing', () => {
      const result = QuarryMonsterDataSchema.safeParse({
        huntBoard: {},
        node: MonsterNode.NQ1,
        timeline: {},
        type: MonsterType.QUARRY
      })

      expect(result.success).toBe(false)
    })

    it('should fail when node is missing', () => {
      const result = QuarryMonsterDataSchema.safeParse({
        huntBoard: {},
        name: 'White Lion',
        timeline: {},
        type: MonsterType.QUARRY
      })

      expect(result.success).toBe(false)
    })

    it('should fail when type is not QUARRY', () => {
      const result = QuarryMonsterDataSchema.safeParse({
        huntBoard: {},
        name: 'White Lion',
        node: MonsterNode.NQ1,
        timeline: {},
        type: MonsterType.NEMESIS
      })

      expect(result.success).toBe(false)
    })

    it('should fail when huntBoard is missing', () => {
      const result = QuarryMonsterDataSchema.safeParse({
        name: 'White Lion',
        node: MonsterNode.NQ1,
        timeline: {},
        type: MonsterType.QUARRY
      })

      expect(result.success).toBe(false)
    })

    it('should fail when timeline is missing', () => {
      const result = QuarryMonsterDataSchema.safeParse({
        huntBoard: {},
        name: 'White Lion',
        node: MonsterNode.NQ1,
        type: MonsterType.QUARRY
      })

      expect(result.success).toBe(false)
    })

    it('should fail when timeline entry has empty title', () => {
      const result = QuarryMonsterDataSchema.safeParse({
        huntBoard: {},
        name: 'White Lion',
        node: MonsterNode.NQ1,
        timeline: {
          '2': [
            {
              title: '',
              campaigns: []
            }
          ]
        },
        type: MonsterType.QUARRY
      })

      expect(result.success).toBe(false)
    })

    it('should fail when location has empty name', () => {
      const result = QuarryMonsterDataSchema.safeParse({
        huntBoard: {},
        name: 'White Lion',
        node: MonsterNode.NQ1,
        locations: [{ name: '', unlocked: false }],
        timeline: {},
        type: MonsterType.QUARRY
      })

      expect(result.success).toBe(false)
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty arrays for defaults', () => {
      const result = QuarryMonsterDataSchema.safeParse({
        ccRewards: [],
        huntBoard: {},
        locations: [],
        name: 'White Lion',
        node: MonsterNode.NQ1,
        timeline: {},
        type: MonsterType.QUARRY
      })

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.ccRewards).toEqual([])
        expect(result.data.locations).toEqual([])
      }
    })

    it('should transform timeline string keys to numbers', () => {
      const result = QuarryMonsterDataSchema.safeParse({
        huntBoard: {},
        name: 'White Lion',
        node: MonsterNode.NQ1,
        timeline: {
          '0': ['Early Event'],
          '5': ['Mid Event'],
          '10': ['Late Event']
        },
        type: MonsterType.QUARRY
      })

      expect(result.success).toBe(true)
      if (result.success) {
        const timeline = result.data.timeline as Record<number, string[]>
        expect(timeline[0]).toBeDefined()
        expect(timeline[5]).toBeDefined()
        expect(timeline[10]).toBeDefined()
      }
    })

    it('should filter out negative timeline keys', () => {
      const result = QuarryMonsterDataSchema.safeParse({
        huntBoard: basicHuntBoard,
        name: 'White Lion',
        node: MonsterNode.NQ1,
        timeline: {
          '-1': ['Invalid Event'],
          '0': ['Valid Event'],
          '5': ['Another Valid Event']
        },
        type: MonsterType.QUARRY
      })

      expect(result.success).toBe(true)
      if (result.success) {
        const timeline = result.data.timeline as Record<number, string[]>
        expect(timeline[-1]).toBeUndefined()
        expect(timeline[0]).toBeDefined()
        expect(timeline[5]).toBeDefined()
      }
    })

    it('should filter out invalid timeline keys', () => {
      const result = QuarryMonsterDataSchema.safeParse({
        huntBoard: {},
        name: 'White Lion',
        node: MonsterNode.NQ1,
        timeline: {
          abc: ['Invalid Event'],
          '5': ['Valid Event']
        },
        type: MonsterType.QUARRY
      })

      expect(result.success).toBe(true)
      if (result.success) {
        const timeline = result.data.timeline as Record<number, string[]>
        expect(Object.keys(timeline)).not.toContain('abc')
        expect(timeline[5]).toBeDefined()
      }
    })

    it('should transform huntBoard string keys to numbers', () => {
      const result = QuarryMonsterDataSchema.safeParse({
        huntBoard: {
          '1': HuntEventType.BASIC,
          '7': HuntEventType.MONSTER,
          '11': HuntEventType.MONSTER
        },
        name: 'White Lion',
        node: MonsterNode.NQ1,
        timeline: {},
        type: MonsterType.QUARRY
      })

      expect(result.success).toBe(true)
      if (result.success) {
        const huntBoard = result.data.huntBoard as Record<
          number,
          HuntEventType.BASIC | HuntEventType.MONSTER | undefined
        >
        expect(huntBoard[1]).toBe(HuntEventType.BASIC)
        expect(huntBoard[7]).toBe(HuntEventType.MONSTER)
        expect(huntBoard[11]).toBe(HuntEventType.MONSTER)
      }
    })

    it('should filter out negative huntBoard keys', () => {
      const result = QuarryMonsterDataSchema.safeParse({
        huntBoard: {
          '-1': HuntEventType.BASIC,
          '1': HuntEventType.BASIC,
          '7': HuntEventType.MONSTER
        },
        name: 'White Lion',
        node: MonsterNode.NQ1,
        timeline: {},
        type: MonsterType.QUARRY
      })

      expect(result.success).toBe(true)
      if (result.success) {
        const huntBoard = result.data.huntBoard as Record<
          number,
          HuntEventType.BASIC | HuntEventType.MONSTER | undefined
        >
        expect(huntBoard[-1]).toBeUndefined()
        expect(huntBoard[1]).toBe(HuntEventType.BASIC)
        expect(huntBoard[7]).toBe(HuntEventType.MONSTER)
      }
    })

    it('should filter out invalid huntBoard keys', () => {
      const result = QuarryMonsterDataSchema.safeParse({
        huntBoard: {
          abc: HuntEventType.BASIC,
          '7': HuntEventType.MONSTER
        },
        name: 'White Lion',
        node: MonsterNode.NQ1,
        timeline: {},
        type: MonsterType.QUARRY
      })

      expect(result.success).toBe(true)
      if (result.success) {
        const huntBoard = result.data.huntBoard as Record<
          number,
          HuntEventType.BASIC | HuntEventType.MONSTER | undefined
        >
        expect(Object.keys(huntBoard)).not.toContain('abc')
        expect(huntBoard[7]).toBe(HuntEventType.MONSTER)
      }
    })
  })
})

describe('NemesisMonsterDataSchema Timeline Transform', () => {
  it('should transform timeline string keys to numbers for nemesis', () => {
    const result = NemesisMonsterDataSchema.safeParse({
      name: 'Butcher',
      node: MonsterNode.NN1,
      timeline: {
        '1': ['Level 1 Event'],
        '6': ['Level 2 Event'],
        '12': ['Level 3 Event']
      },
      type: MonsterType.NEMESIS
    })

    expect(result.success).toBe(true)
    if (result.success) {
      const timeline = result.data.timeline as Record<number, string[]>
      expect(timeline[1]).toBeDefined()
      expect(timeline[6]).toBeDefined()
      expect(timeline[12]).toBeDefined()
    }
  })

  it('should filter out zero and negative timeline keys for nemesis', () => {
    const result = NemesisMonsterDataSchema.safeParse({
      name: 'Butcher',
      node: MonsterNode.NN1,
      timeline: {
        '-1': ['Invalid Event'],
        '0': ['Zero Event'],
        '1': ['Valid Event'],
        '6': ['Another Valid Event']
      },
      type: MonsterType.NEMESIS
    })

    expect(result.success).toBe(true)
    if (result.success) {
      const timeline = result.data.timeline as Record<number, string[]>
      expect(timeline[-1]).toBeUndefined()
      expect(timeline[1]).toBeDefined()
      expect(timeline[6]).toBeDefined()
    }
  })

  it('should filter out invalid timeline keys for nemesis', () => {
    const result = NemesisMonsterDataSchema.safeParse({
      name: 'Butcher',
      node: MonsterNode.NN1,
      timeline: {
        abc: ['Invalid Event'],
        notANumber: ['Another Invalid'],
        '1': ['Valid Event']
      },
      type: MonsterType.NEMESIS
    })

    expect(result.success).toBe(true)
    if (result.success) {
      const timeline = result.data.timeline as Record<number, string[]>
      expect(Object.keys(timeline)).not.toContain('abc')
      expect(Object.keys(timeline)).not.toContain('notANumber')
      expect(timeline[1]).toBeDefined()
    }
  })

  it('should handle mixed valid and invalid timeline entries for nemesis', () => {
    const result = NemesisMonsterDataSchema.safeParse({
      name: 'Butcher',
      node: MonsterNode.NN1,
      timeline: {
        invalid: ['Should be filtered - not a number'],
        '-1': ['Should be filtered - negative'],
        '1': ['Valid - lantern year 1'],
        '2': ['Valid - lantern year 2'],
        '5': ['Valid - lantern year 5']
      },
      type: MonsterType.NEMESIS
    })

    expect(result.success).toBe(true)
    if (result.success) {
      const timeline = result.data.timeline as Record<number, string[]>
      const keys = Object.keys(timeline).map(Number)
      expect(keys).toContain(1)
      expect(keys).toContain(2)
      expect(keys).toContain(5)
      expect(keys).not.toContain(-1)
      expect(keys.length).toBe(3)
    }
  })
})
