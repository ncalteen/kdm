import {
  CampaignType,
  MonsterNode,
  Philosophy,
  ResourceCategory,
  ResourceType,
  SurvivorType
} from '@/lib/enums'
import {
  BaseSettlementSchema,
  CollectiveCognitionRewardSchema,
  KnowledgeSchema,
  LocationSchema,
  MilestoneSchema,
  NemesisSchema,
  NewSettlementInputSchema,
  PrincipleSchema,
  QuarrySchema,
  ResourceSchema,
  SettlementSchema,
  SquireSuspicionSchema,
  TimelineYearSchema
} from '@/schemas/settlement'
import { describe, expect, it } from 'vitest'

describe('TimelineYearSchema', () => {
  describe('Valid Data', () => {
    it('should validate with completed year and entries', () => {
      const result = TimelineYearSchema.safeParse({
        completed: true,
        entries: ['Event 1', 'Event 2']
      })

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.completed).toBe(true)
        expect(result.data.entries).toHaveLength(2)
      }
    })

    it('should validate with incomplete year', () => {
      const result = TimelineYearSchema.safeParse({
        completed: false,
        entries: ['Event 1']
      })

      expect(result.success).toBe(true)
    })
  })

  describe('Invalid Data', () => {
    it('should fail when entry is empty string', () => {
      const result = TimelineYearSchema.safeParse({
        completed: true,
        entries: ['']
      })

      expect(result.success).toBe(false)
    })
  })
})

describe('QuarrySchema', () => {
  describe('Valid Data', () => {
    it('should validate with all fields', () => {
      const result = QuarrySchema.safeParse({
        ccLevel1: true,
        ccLevel2: [true, false],
        ccLevel3: [true, false, true],
        ccPrologue: false,
        id: 1,
        node: MonsterNode.NQ1,
        unlocked: true
      })

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.id).toBe(1)
        expect(result.data.ccLevel2).toHaveLength(2)
        expect(result.data.ccLevel3).toHaveLength(3)
      }
    })
  })

  describe('Invalid Data', () => {
    it('should fail when id is negative', () => {
      const result = QuarrySchema.safeParse({
        ccLevel1: false,
        ccLevel2: [false, false],
        ccLevel3: [false, false, false],
        ccPrologue: false,
        id: -1,
        node: MonsterNode.NQ1,
        unlocked: false
      })

      expect(result.success).toBe(false)
    })

    it('should fail when id is missing', () => {
      const result = QuarrySchema.safeParse({
        ccLevel1: false,
        ccLevel2: [false, false],
        ccLevel3: [false, false, false],
        ccPrologue: false,
        node: MonsterNode.NQ1,
        unlocked: false
      })

      expect(result.success).toBe(false)
    })

    it('should fail when ccLevel2 does not have exactly 2 elements', () => {
      const result = QuarrySchema.safeParse({
        ccLevel1: false,
        ccLevel2: [false],
        ccLevel3: [false, false, false],
        ccPrologue: false,
        id: 1,
        node: MonsterNode.NQ1,
        unlocked: false
      })

      expect(result.success).toBe(false)
    })

    it('should fail when ccLevel3 does not have exactly 3 elements', () => {
      const result = QuarrySchema.safeParse({
        ccLevel1: false,
        ccLevel2: [false, false],
        ccLevel3: [false, false],
        ccPrologue: false,
        id: 1,
        node: MonsterNode.NQ1,
        unlocked: false
      })

      expect(result.success).toBe(false)
    })
  })
})

describe('NemesisSchema', () => {
  describe('Valid Data', () => {
    it('should validate with all fields', () => {
      const result = NemesisSchema.safeParse({
        ccLevel1: true,
        ccLevel2: false,
        ccLevel3: false,
        id: 2,
        level1: true,
        level2: false,
        level3: false,
        unlocked: true
      })

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.id).toBe(2)
        expect(result.data.level1).toBe(true)
      }
    })
  })

  describe('Invalid Data', () => {
    it('should fail when id is negative', () => {
      const result = NemesisSchema.safeParse({
        ccLevel1: false,
        ccLevel2: false,
        ccLevel3: false,
        id: -1,
        level1: false,
        level2: false,
        level3: false,
        unlocked: false
      })

      expect(result.success).toBe(false)
    })

    it('should fail when id is missing', () => {
      const result = NemesisSchema.safeParse({
        ccLevel1: false,
        ccLevel2: false,
        ccLevel3: false,
        level1: false,
        level2: false,
        level3: false,
        unlocked: false
      })

      expect(result.success).toBe(false)
    })
  })
})

describe('MilestoneSchema', () => {
  describe('Valid Data', () => {
    it('should validate milestone', () => {
      const result = MilestoneSchema.safeParse({
        complete: true,
        event: 'Principle: New Life',
        name: 'First child is born'
      })

      expect(result.success).toBe(true)
    })
  })

  describe('Invalid Data', () => {
    it('should fail when name is empty', () => {
      const result = MilestoneSchema.safeParse({
        complete: false,
        event: 'Some event',
        name: ''
      })

      expect(result.success).toBe(false)
    })
  })
})

describe('LocationSchema', () => {
  describe('Valid Data', () => {
    it('should validate location', () => {
      const result = LocationSchema.safeParse({
        name: 'Lantern Hoard',
        unlocked: true
      })

      expect(result.success).toBe(true)
    })
  })

  describe('Invalid Data', () => {
    it('should fail when name is empty', () => {
      const result = LocationSchema.safeParse({
        name: '',
        unlocked: false
      })

      expect(result.success).toBe(false)
    })
  })
})

describe('PrincipleSchema', () => {
  describe('Valid Data', () => {
    it('should validate principle with one option selected', () => {
      const result = PrincipleSchema.safeParse({
        name: 'Conviction',
        option1Name: 'Survival of the Fittest',
        option1Selected: true,
        option2Name: 'Protect the Young',
        option2Selected: false
      })

      expect(result.success).toBe(true)
    })

    it('should validate principle with both options unselected', () => {
      const result = PrincipleSchema.safeParse({
        name: 'Society',
        option1Name: 'Collective Toil',
        option1Selected: false,
        option2Name: 'Accept Darkness',
        option2Selected: false
      })

      expect(result.success).toBe(true)
    })
  })

  describe('Invalid Data', () => {
    it('should fail when name is empty', () => {
      const result = PrincipleSchema.safeParse({
        name: '',
        option1Name: 'Option 1',
        option1Selected: false,
        option2Name: 'Option 2',
        option2Selected: false
      })

      expect(result.success).toBe(false)
    })
  })
})

describe('ResourceSchema', () => {
  describe('Valid Data', () => {
    it('should validate resource', () => {
      const result = ResourceSchema.safeParse({
        amount: 5,
        category: ResourceCategory.MONSTER,
        name: 'White Lion Fur',
        types: [ResourceType.HIDE]
      })

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.amount).toBe(5)
        expect(result.data.types).toHaveLength(1)
      }
    })

    it('should validate resource with multiple types', () => {
      const result = ResourceSchema.safeParse({
        amount: 2,
        category: ResourceCategory.BASIC,
        name: 'Mixed Resource',
        types: [ResourceType.BONE, ResourceType.HIDE, ResourceType.ORGAN]
      })

      expect(result.success).toBe(true)
      if (result.success) expect(result.data.types).toHaveLength(3)
    })
  })

  describe('Invalid Data', () => {
    it('should fail when amount is negative', () => {
      const result = ResourceSchema.safeParse({
        amount: -1,
        category: ResourceCategory.BASIC,
        name: 'Test Resource',
        types: [ResourceType.BONE]
      })

      expect(result.success).toBe(false)
    })

    it('should fail when types array is empty', () => {
      const result = ResourceSchema.safeParse({
        amount: 1,
        category: ResourceCategory.BASIC,
        name: 'Test Resource',
        types: []
      })

      expect(result.success).toBe(false)
    })
  })
})

describe('CollectiveCognitionRewardSchema', () => {
  describe('Valid Data', () => {
    it('should validate reward', () => {
      const result = CollectiveCognitionRewardSchema.safeParse({
        cc: 5,
        name: 'Special Reward',
        unlocked: true
      })

      expect(result.success).toBe(true)
    })
  })

  describe('Invalid Data', () => {
    it('should fail when cc is negative', () => {
      const result = CollectiveCognitionRewardSchema.safeParse({
        cc: -1,
        name: 'Reward',
        unlocked: false
      })

      expect(result.success).toBe(false)
    })
  })
})

describe('KnowledgeSchema', () => {
  describe('Valid Data', () => {
    it('should validate knowledge with philosophy', () => {
      const result = KnowledgeSchema.safeParse({
        name: 'Test Knowledge',
        philosophy: Philosophy.AMBITIONISM
      })

      expect(result.success).toBe(true)
    })

    it('should validate knowledge without philosophy', () => {
      const result = KnowledgeSchema.safeParse({
        name: 'Test Knowledge'
      })

      expect(result.success).toBe(true)
    })
  })

  describe('Invalid Data', () => {
    it('should fail when name is empty', () => {
      const result = KnowledgeSchema.safeParse({
        name: ''
      })

      expect(result.success).toBe(false)
    })
  })
})

describe('SquireSuspicionSchema', () => {
  describe('Valid Data', () => {
    it('should validate suspicion', () => {
      const result = SquireSuspicionSchema.safeParse({
        level1: true,
        level2: false,
        level3: false,
        level4: false,
        name: 'Test Survivor'
      })

      expect(result.success).toBe(true)
    })
  })

  describe('Invalid Data', () => {
    it('should fail when name is empty', () => {
      const result = SquireSuspicionSchema.safeParse({
        level1: false,
        level2: false,
        level3: false,
        level4: false,
        name: ''
      })

      expect(result.success).toBe(false)
    })
  })
})

describe('BaseSettlementSchema', () => {
  describe('Valid Data', () => {
    it('should validate with all defaults', () => {
      const result = BaseSettlementSchema.safeParse({})

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.campaignType).toBe(
          CampaignType.PEOPLE_OF_THE_LANTERN
        )
        expect(result.data.population).toBe(0)
        expect(result.data.survivalLimit).toBe(1)
        expect(result.data.survivorType).toBe(SurvivorType.CORE)
      }
    })

    it('should validate with all campaign types', () => {
      const campaignTypes = [
        CampaignType.PEOPLE_OF_THE_LANTERN,
        CampaignType.PEOPLE_OF_THE_STARS,
        CampaignType.PEOPLE_OF_THE_SUN,
        CampaignType.PEOPLE_OF_THE_DREAM_KEEPER,
        CampaignType.SQUIRES_OF_THE_CITADEL,
        CampaignType.CUSTOM
      ]

      campaignTypes.forEach((campaignType) => {
        const result = BaseSettlementSchema.safeParse({
          campaignType
        })

        expect(result.success).toBe(true)
      })
    })

    it('should validate with all survivor types', () => {
      const survivorTypes = [SurvivorType.CORE, SurvivorType.ARC]

      survivorTypes.forEach((survivorType) => {
        const result = BaseSettlementSchema.safeParse({
          survivorType
        })

        expect(result.success).toBe(true)
      })
    })
  })

  describe('Invalid Data', () => {
    it('should fail when population is negative', () => {
      const result = BaseSettlementSchema.safeParse({
        population: -1
      })

      expect(result.success).toBe(false)
    })

    it('should fail when deathCount is negative', () => {
      const result = BaseSettlementSchema.safeParse({
        deathCount: -1
      })

      expect(result.success).toBe(false)
    })

    it('should fail when survivalLimit is less than 1', () => {
      const result = BaseSettlementSchema.safeParse({
        survivalLimit: 0
      })

      expect(result.success).toBe(false)
    })

    it('should fail when lostSettlements is negative', () => {
      const result = BaseSettlementSchema.safeParse({
        lostSettlements: -1
      })

      expect(result.success).toBe(false)
    })

    it('should fail when ccValue is negative', () => {
      const result = BaseSettlementSchema.safeParse({
        ccValue: -1
      })

      expect(result.success).toBe(false)
    })

    it('should fail when lanternResearchLevel is negative', () => {
      const result = BaseSettlementSchema.safeParse({
        lanternResearchLevel: -1
      })

      expect(result.success).toBe(false)
    })
  })
})

describe('SettlementSchema', () => {
  describe('Valid Data', () => {
    it('should validate with minimal required fields', () => {
      const result = SettlementSchema.safeParse({
        id: 1,
        name: 'Test Settlement'
      })

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.name).toBe('Test Settlement')
        expect(result.data.id).toBe(1)
      }
    })

    it('should validate with complete settlement data', () => {
      const result = SettlementSchema.safeParse({
        arrivalBonuses: ['+1 Survival'],
        campaignType: CampaignType.PEOPLE_OF_THE_LANTERN,
        deathCount: 5,
        departingBonuses: ['+1 Courage'],
        gear: ['Founding Stone'],
        innovations: ['Language', 'Ammonia'],
        locations: [
          { name: 'Lantern Hoard', unlocked: true },
          { name: 'Bone Smith', unlocked: true }
        ],
        lostSettlements: 0,
        milestones: [],
        nemeses: [],
        notes: 'Settlement notes',
        patterns: ['Founding Stone'],
        population: 15,
        principles: [],
        quarries: [],
        resources: [],
        seedPatterns: [],
        survivalLimit: 3,
        survivorType: SurvivorType.CORE,
        usesScouts: false,
        timeline: [],
        ccValue: 0,
        knowledges: [],
        philosophies: [],
        lanternResearchLevel: 2,
        monsterVolumes: ['White Lion'],
        id: 1,
        name: 'Test Settlement'
      })

      expect(result.success).toBe(true)
    })
  })

  describe('Invalid Data', () => {
    it('should fail when name is missing', () => {
      const result = SettlementSchema.safeParse({
        id: 1
      })

      expect(result.success).toBe(false)
    })

    it('should fail when name is empty', () => {
      const result = SettlementSchema.safeParse({
        id: 1,
        name: ''
      })

      expect(result.success).toBe(false)
      if (!result.success)
        expect(result.error.issues).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              message: 'A nameless settlement cannot be recorded.'
            })
          ])
        )
    })

    it('should fail when id is missing', () => {
      const result = SettlementSchema.safeParse({
        name: 'Test'
      })

      expect(result.success).toBe(false)
    })
  })

  describe('Edge Cases', () => {
    it('should handle zero population', () => {
      const result = SettlementSchema.safeParse({
        id: 1,
        name: 'Empty Settlement',
        population: 0
      })

      expect(result.success).toBe(true)
      if (result.success) expect(result.data.population).toBe(0)
    })

    it('should handle multiple philosophies', () => {
      const result = SettlementSchema.safeParse({
        id: 1,
        name: 'Test',
        philosophies: [Philosophy.AMBITIONISM, Philosophy.COLLECTIVISM]
      })

      expect(result.success).toBe(true)
      if (result.success) expect(result.data.philosophies).toHaveLength(2)
    })

    it('should handle Arc survivor type', () => {
      const result = SettlementSchema.safeParse({
        id: 1,
        name: 'Test',
        survivorType: SurvivorType.ARC,
        ccValue: 10,
        knowledges: [{ name: 'Test Knowledge' }]
      })

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.survivorType).toBe(SurvivorType.ARC)
        expect(result.data.ccValue).toBe(10)
      }
    })

    it('should handle Squires campaign with suspicions', () => {
      const result = SettlementSchema.safeParse({
        id: 1,
        name: 'Test',
        campaignType: CampaignType.SQUIRES_OF_THE_CITADEL,
        suspicions: [
          {
            level1: true,
            level2: false,
            level3: false,
            level4: false,
            name: 'Survivor 1'
          }
        ]
      })

      expect(result.success).toBe(true)
      if (result.success) expect(result.data.suspicions).toHaveLength(1)
    })
  })
})

describe('NewSettlementInputSchema', () => {
  describe('Valid Data', () => {
    it('should validate custom campaign with monster selection', () => {
      const result = NewSettlementInputSchema.safeParse({
        name: 'Test Settlement',
        campaignType: CampaignType.CUSTOM,
        monsters: {
          NQ1: [1, 2],
          NQ2: [3],
          NQ3: [],
          NQ4: [],
          NN1: [4],
          NN2: [],
          NN3: [],
          CO: [5, 6],
          FI: [7]
        }
      })

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.name).toBe('Test Settlement')
        expect(result.data.campaignType).toBe(CampaignType.CUSTOM)
        expect(result.data.monsters).toBeDefined()
        expect(result.data.monsters?.NQ1).toEqual([1, 2])
      }
    })

    it('should validate non-custom campaign without monster selection', () => {
      const result = NewSettlementInputSchema.safeParse({
        name: 'Test Settlement',
        campaignType: CampaignType.PEOPLE_OF_THE_LANTERN
      })

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.campaignType).toBe(
          CampaignType.PEOPLE_OF_THE_LANTERN
        )
        expect(result.data.monsters).toBeUndefined()
      }
    })

    it('should validate with minimum required fields', () => {
      const result = NewSettlementInputSchema.safeParse({
        name: 'Minimal',
        campaignType: CampaignType.PEOPLE_OF_THE_STARS
      })

      expect(result.success).toBe(true)
    })

    it('should validate custom campaign with empty monster arrays', () => {
      const result = NewSettlementInputSchema.safeParse({
        name: 'Test',
        campaignType: CampaignType.CUSTOM,
        monsters: {
          NQ1: [],
          NQ2: [],
          NQ3: [],
          NQ4: [],
          NN1: [],
          NN2: [],
          NN3: [],
          CO: [],
          FI: []
        }
      })

      expect(result.success).toBe(true)
    })
  })

  describe('Invalid Data', () => {
    it('should fail with missing name', () => {
      const result = NewSettlementInputSchema.safeParse({
        campaignType: CampaignType.CUSTOM
      })

      expect(result.success).toBe(false)
      if (!result.success) {
        const issues = result.error.issues
        expect(issues.some((i) => i.path.includes('name'))).toBe(true)
      }
    })

    it('should fail with invalid monster ID (zero)', () => {
      const result = NewSettlementInputSchema.safeParse({
        name: 'Test',
        campaignType: CampaignType.CUSTOM,
        monsters: {
          NQ1: [0],
          NQ2: [],
          NQ3: [],
          NQ4: [],
          NN1: [],
          NN2: [],
          NN3: [],
          CO: [],
          FI: []
        }
      })

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('NQ1')
      }
    })

    it('should fail with negative monster ID', () => {
      const result = NewSettlementInputSchema.safeParse({
        name: 'Test',
        campaignType: CampaignType.CUSTOM,
        monsters: {
          NQ1: [-1],
          NQ2: [],
          NQ3: [],
          NQ4: [],
          NN1: [],
          NN2: [],
          NN3: [],
          CO: [],
          FI: []
        }
      })

      expect(result.success).toBe(false)
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty name string', () => {
      const result = NewSettlementInputSchema.safeParse({
        name: '',
        campaignType: CampaignType.CUSTOM
      })

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('name')
      }
    })

    it('should handle all campaign types', () => {
      const campaignTypes = [
        CampaignType.PEOPLE_OF_THE_DREAM_KEEPER,
        CampaignType.PEOPLE_OF_THE_LANTERN,
        CampaignType.PEOPLE_OF_THE_STARS,
        CampaignType.PEOPLE_OF_THE_SUN,
        CampaignType.SQUIRES_OF_THE_CITADEL,
        CampaignType.CUSTOM
      ]

      campaignTypes.forEach((type) => {
        const result = NewSettlementInputSchema.safeParse({
          name: 'Test',
          campaignType: type
        })

        expect(result.success).toBe(true)
      })
    })

    it('should handle large monster ID numbers', () => {
      const result = NewSettlementInputSchema.safeParse({
        name: 'Test',
        campaignType: CampaignType.CUSTOM,
        monsters: {
          NQ1: [999999],
          NQ2: [],
          NQ3: [],
          NQ4: [],
          NN1: [],
          NN2: [],
          NN3: [],
          CO: [],
          FI: []
        }
      })

      expect(result.success).toBe(true)
    })
  })
})
