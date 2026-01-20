import { CampaignType, SurvivorType } from '@/lib/enums'
import { BUTCHER } from '@/lib/monsters/butcher'
import { WHITE_LION } from '@/lib/monsters/white-lion'
import {
  createSettlementFromOptions,
  getMonsterNodeMapping
} from '@/lib/settlements/utils'
import { Campaign } from '@/schemas/campaign'
import { NewSettlementInput } from '@/schemas/new-settlement-input'
import { BaseSettlementSchema } from '@/schemas/settlement'
import { describe, expect, it } from 'vitest'
import { TEST_NEMESIS } from '../../../__fixtures__/monsters/test-nemesis'
import { TEST_QUARRY } from '../../../__fixtures__/monsters/test-quarry'

// Helper function to create a minimal NewSettlementInput with defaults
function createTestOptions(
  overrides: Partial<NewSettlementInput>
): NewSettlementInput {
  return {
    ...BaseSettlementSchema.parse({}),
    ...overrides
  } as NewSettlementInput
}

describe('getMonsterNodeMapping', () => {
  describe('People of the Lantern', () => {
    it('should return correct monster node mapping', () => {
      const mapping = getMonsterNodeMapping(CampaignType.PEOPLE_OF_THE_LANTERN)

      expect(mapping).toHaveProperty('NQ1')
      expect(mapping).toHaveProperty('NQ2')
      expect(mapping).toHaveProperty('NQ3')
      expect(mapping).toHaveProperty('NQ4')
      expect(mapping).toHaveProperty('NN1')
      expect(mapping).toHaveProperty('NN2')
      expect(mapping).toHaveProperty('NN3')
      expect(mapping).toHaveProperty('CO')
      expect(mapping).toHaveProperty('FI')
    })

    it('should have arrays for all node types', () => {
      const mapping = getMonsterNodeMapping(CampaignType.PEOPLE_OF_THE_LANTERN)

      expect(Array.isArray(mapping.NQ1)).toBe(true)
      expect(Array.isArray(mapping.NQ2)).toBe(true)
      expect(Array.isArray(mapping.NQ3)).toBe(true)
      expect(Array.isArray(mapping.NQ4)).toBe(true)
      expect(Array.isArray(mapping.NN1)).toBe(true)
      expect(Array.isArray(mapping.NN2)).toBe(true)
      expect(Array.isArray(mapping.NN3)).toBe(true)
      expect(Array.isArray(mapping.CO)).toBe(true)
      expect(Array.isArray(mapping.FI)).toBe(true)
    })
  })

  describe('People of the Stars', () => {
    it('should return correct monster node mapping', () => {
      const mapping = getMonsterNodeMapping(CampaignType.PEOPLE_OF_THE_STARS)

      expect(mapping).toBeDefined()
      expect(mapping.NQ1).toBeDefined()
      expect(mapping.NN1).toBeDefined()
    })
  })

  describe('People of the Sun', () => {
    it('should return correct monster node mapping', () => {
      const mapping = getMonsterNodeMapping(CampaignType.PEOPLE_OF_THE_SUN)

      expect(mapping).toBeDefined()
      expect(mapping.NQ1).toBeDefined()
      expect(mapping.NN1).toBeDefined()
    })
  })

  describe('People of the Dream Keeper', () => {
    it('should return correct monster node mapping', () => {
      const mapping = getMonsterNodeMapping(
        CampaignType.PEOPLE_OF_THE_DREAM_KEEPER
      )

      expect(mapping).toBeDefined()
      expect(mapping.NQ1).toBeDefined()
      expect(mapping.NN1).toBeDefined()
    })
  })

  describe('Squires of the Citadel', () => {
    it('should return correct monster node mapping', () => {
      const mapping = getMonsterNodeMapping(CampaignType.SQUIRES_OF_THE_CITADEL)

      expect(mapping).toBeDefined()
      expect(mapping.NQ1).toBeDefined()
      expect(mapping.NN1).toBeDefined()
    })
  })

  describe('Custom Campaign', () => {
    it('should return empty arrays for all nodes', () => {
      const mapping = getMonsterNodeMapping(CampaignType.CUSTOM)

      expect(mapping.NQ1).toEqual([])
      expect(mapping.NQ2).toEqual([])
      expect(mapping.NQ3).toEqual([])
      expect(mapping.NQ4).toEqual([])
      expect(mapping.NN1).toEqual([])
      expect(mapping.NN2).toEqual([])
      expect(mapping.NN3).toEqual([])
      expect(mapping.CO).toEqual([])
      expect(mapping.FI).toEqual([])
    })
  })
})

describe('createSettlementFromOptions', () => {
  const baseCampaign: Campaign = {
    customNemeses: {},
    customQuarries: {},
    hunts: [],
    selectedHuntId: null,
    selectedSettlementId: null,
    selectedShowdownId: null,
    selectedSurvivorId: null,
    selectedTab: null,
    settings: {
      disableToasts: false,
      unlockedMonsters: {
        killeniumButcher: false,
        screamingNukalope: false,
        whiteGigalion: false
      }
    },
    settlements: [],
    showdowns: [],
    survivors: []
  }

  describe('People of the Lantern', () => {
    it('should create a CORE settlement', () => {
      const options = createTestOptions({
        campaignType: CampaignType.PEOPLE_OF_THE_LANTERN,
        name: 'Test Settlement',
        survivorType: SurvivorType.CORE,
        usesScouts: true
      })

      const settlement = createSettlementFromOptions(baseCampaign, options)

      expect(settlement.id).toBe(1)
      expect(settlement.name).toBe('Test Settlement')
      expect(settlement.campaignType).toBe(CampaignType.PEOPLE_OF_THE_LANTERN)
      expect(settlement.survivorType).toBe(SurvivorType.CORE)
      expect(settlement.usesScouts).toBe(true)
      expect(settlement.deathCount).toBe(0)
      expect(settlement.population).toBe(0)
      expect(settlement.survivalLimit).toBe(1)
      expect(settlement.lanternResearchLevel).toBe(0)
      expect(settlement.lostSettlements).toBe(0)
      expect(Array.isArray(settlement.innovations)).toBe(true)
      expect(Array.isArray(settlement.locations)).toBe(true)
      expect(Array.isArray(settlement.milestones)).toBe(true)
      expect(Array.isArray(settlement.nemeses)).toBe(true)
      expect(Array.isArray(settlement.quarries)).toBe(true)
      expect(Array.isArray(settlement.principles)).toBe(true)
      expect(Array.isArray(settlement.timeline)).toBe(true)
    })

    it('should have nemeses from the campaign template', () => {
      const options = createTestOptions({
        campaignType: CampaignType.PEOPLE_OF_THE_LANTERN,
        name: 'Test Settlement',
        survivorType: SurvivorType.CORE,
        usesScouts: true
      })

      const settlement = createSettlementFromOptions(baseCampaign, options)

      expect(settlement.nemeses.length).toBeGreaterThan(0)

      // Check that nemeses have the expected properties
      for (const nemesis of settlement.nemeses) {
        expect(nemesis).toHaveProperty('unlocked')
        expect(nemesis.unlocked).toBe(false)
      }
    })

    it('should have quarries from the campaign template', () => {
      const options = createTestOptions({
        campaignType: CampaignType.PEOPLE_OF_THE_LANTERN,
        name: 'Test Settlement',
        survivorType: SurvivorType.CORE,
        usesScouts: true
      })

      const settlement = createSettlementFromOptions(baseCampaign, options)

      expect(settlement.quarries.length).toBeGreaterThan(0)

      // Check that quarries have the expected properties
      for (const quarry of settlement.quarries) {
        expect(quarry).toHaveProperty('unlocked')
        expect(quarry.unlocked).toBe(false)
      }
    })

    it('should have timeline populated with events', () => {
      const options = createTestOptions({
        campaignType: CampaignType.PEOPLE_OF_THE_LANTERN,
        name: 'Test Settlement',
        survivorType: SurvivorType.CORE,
        usesScouts: true
      })

      const settlement = createSettlementFromOptions(baseCampaign, options)

      expect(settlement.timeline.length).toBeGreaterThan(0)

      // Check timeline structure
      for (const year of settlement.timeline) {
        expect(year).toHaveProperty('completed')
        expect(year).toHaveProperty('entries')
        expect(Array.isArray(year.entries)).toBe(true)
      }

      // At least some years should have events
      const yearsWithEvents = settlement.timeline.filter(
        (y) => y.entries.length > 0
      )
      expect(yearsWithEvents.length).toBeGreaterThan(0)
    })

    it('should have locations sorted alphabetically', () => {
      const options = createTestOptions({
        campaignType: CampaignType.PEOPLE_OF_THE_LANTERN,
        name: 'Test Settlement',
        survivorType: SurvivorType.CORE,
        usesScouts: true
      })

      const settlement = createSettlementFromOptions(baseCampaign, options)

      const sortedLocations = [...settlement.locations].sort((a, b) =>
        a.name.localeCompare(b.name)
      )
      expect(settlement.locations).toEqual(sortedLocations)
    })

    it('should have milestones sorted alphabetically', () => {
      const options = createTestOptions({
        campaignType: CampaignType.PEOPLE_OF_THE_LANTERN,
        name: 'Test Settlement',
        survivorType: SurvivorType.CORE,
        usesScouts: true
      })

      const settlement = createSettlementFromOptions(baseCampaign, options)

      const sortedMilestones = [...settlement.milestones].sort((a, b) =>
        a.name.localeCompare(b.name)
      )
      expect(settlement.milestones).toEqual(sortedMilestones)
    })

    it('should have principles sorted alphabetically', () => {
      const options = createTestOptions({
        campaignType: CampaignType.PEOPLE_OF_THE_LANTERN,
        name: 'Test Settlement',
        survivorType: SurvivorType.CORE,
        usesScouts: true
      })

      const settlement = createSettlementFromOptions(baseCampaign, options)

      const sortedPrinciples = [...settlement.principles].sort((a, b) =>
        a.name.localeCompare(b.name)
      )
      expect(settlement.principles).toEqual(sortedPrinciples)
    })

    it('should have timeline entries sorted alphabetically within each year', () => {
      const options = createTestOptions({
        campaignType: CampaignType.PEOPLE_OF_THE_LANTERN,
        name: 'Test Settlement',
        survivorType: SurvivorType.CORE,
        usesScouts: true
      })

      const settlement = createSettlementFromOptions(baseCampaign, options)

      for (const year of settlement.timeline) {
        const sortedEntries = [...year.entries].sort((a, b) =>
          a.localeCompare(b)
        )
        expect(year.entries).toEqual(sortedEntries)
      }
    })
  })

  describe('Arc Survivors', () => {
    it('should add Arc-specific properties to settlement', () => {
      const options = createTestOptions({
        campaignType: CampaignType.PEOPLE_OF_THE_LANTERN,
        name: 'Arc Settlement',
        survivorType: SurvivorType.ARC,
        usesScouts: true
      })

      const settlement = createSettlementFromOptions(baseCampaign, options)

      expect(settlement.survivorType).toBe(SurvivorType.ARC)
      expect(settlement.ccRewards).toBeDefined()
      expect(settlement.ccValue).toBe(0)
      expect(settlement.knowledges).toEqual([])
      expect(settlement.philosophies).toEqual([])

      // Check that Forum location is added
      const forumLocation = settlement.locations.find(
        (loc) => loc.name === 'Forum'
      )
      expect(forumLocation).toBeDefined()
      expect(forumLocation?.unlocked).toBe(false)
    })

    it('should add Arc-specific properties to nemeses', () => {
      const options = createTestOptions({
        campaignType: CampaignType.PEOPLE_OF_THE_LANTERN,
        name: 'Arc Settlement',
        survivorType: SurvivorType.ARC,
        usesScouts: true
      })

      const settlement = createSettlementFromOptions(baseCampaign, options)

      for (const nemesis of settlement.nemeses) {
        expect(nemesis).toHaveProperty('ccLevel1')
        expect(nemesis).toHaveProperty('ccLevel2')
        expect(nemesis).toHaveProperty('ccLevel3')
        expect(nemesis.ccLevel1).toBe(false)
        expect(nemesis.ccLevel2).toBe(false)
        expect(nemesis.ccLevel3).toBe(false)
      }
    })

    it('should add Arc-specific properties to quarries', () => {
      const options = createTestOptions({
        campaignType: CampaignType.PEOPLE_OF_THE_LANTERN,
        name: 'Arc Settlement',
        survivorType: SurvivorType.ARC,
        usesScouts: true
      })

      const settlement = createSettlementFromOptions(baseCampaign, options)

      for (const quarry of settlement.quarries) {
        expect(quarry).toHaveProperty('ccLevel1')
        expect(quarry.ccLevel1).toBe(false)
        expect(quarry).toHaveProperty('ccLevel2')
        expect(Array.isArray(quarry.ccLevel2)).toBe(true)
        expect(quarry.ccLevel2).toEqual([false, false])
        expect(quarry).toHaveProperty('ccLevel3')
        expect(Array.isArray(quarry.ccLevel3)).toBe(true)
        expect(quarry.ccLevel3).toEqual([false, false, false])
      }
    })

    it('should have ccRewards sorted alphabetically', () => {
      const options = createTestOptions({
        campaignType: CampaignType.PEOPLE_OF_THE_LANTERN,
        name: 'Arc Settlement',
        survivorType: SurvivorType.ARC,
        usesScouts: true
      })

      const settlement = createSettlementFromOptions(baseCampaign, options)

      if (settlement.ccRewards) {
        const sortedRewards = [...settlement.ccRewards].sort((a, b) =>
          a.name.localeCompare(b.name)
        )
        expect(settlement.ccRewards).toEqual(sortedRewards)
      }
    })
  })

  describe('Squires of the Citadel', () => {
    it('should add Squires-specific suspicions to settlement', () => {
      const options = createTestOptions({
        campaignType: CampaignType.SQUIRES_OF_THE_CITADEL,
        name: 'Squires Settlement',
        survivorType: SurvivorType.CORE,
        usesScouts: true
      })

      const settlement = createSettlementFromOptions(baseCampaign, options)

      expect(settlement.suspicions).toBeDefined()
      expect(Array.isArray(settlement.suspicions)).toBe(true)
      expect(settlement.suspicions!.length).toBeGreaterThan(0)

      // Check suspicion structure
      for (const suspicion of settlement.suspicions!) {
        expect(suspicion).toHaveProperty('name')
        expect(suspicion).toHaveProperty('level1')
        expect(suspicion).toHaveProperty('level2')
        expect(suspicion).toHaveProperty('level3')
        expect(suspicion).toHaveProperty('level4')
      }
    })
  })

  describe('Custom Campaign', () => {
    it('should create a settlement with custom monster selections', () => {
      const options = createTestOptions({
        campaignType: CampaignType.CUSTOM,
        name: 'Custom Settlement',
        survivorType: SurvivorType.CORE,
        usesScouts: true,
        monsters: {
          NQ1: [WHITE_LION],
          NQ2: [],
          NQ3: [],
          NQ4: [],
          NN1: [BUTCHER],
          NN2: [],
          NN3: [],
          CO: [],
          FI: []
        }
      })

      const settlement = createSettlementFromOptions(baseCampaign, options)

      expect(settlement.quarries.length).toBe(1)
      expect(settlement.quarries[0].name).toBe('White Lion')
      expect(settlement.nemeses.length).toBe(1)
      expect(settlement.nemeses[0].name).toBe('Butcher')
    })

    it('should handle custom campaign with no monsters', () => {
      const options = createTestOptions({
        campaignType: CampaignType.CUSTOM,
        name: 'Empty Custom Settlement',
        survivorType: SurvivorType.CORE,
        usesScouts: false,
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

      const settlement = createSettlementFromOptions(baseCampaign, options)

      expect(settlement.quarries).toEqual([])
      expect(settlement.nemeses).toEqual([])
    })
  })

  describe('Custom Monsters', () => {
    it('should handle custom nemesis monsters', () => {
      const campaignWithCustomMonsters: Campaign = {
        ...baseCampaign,
        customNemeses: {
          'test-nemesis': TEST_NEMESIS
        }
      }

      const options = createTestOptions({
        campaignType: CampaignType.CUSTOM,
        name: 'Settlement with Custom Nemesis',
        survivorType: SurvivorType.CORE,
        usesScouts: true,
        monsters: {
          NQ1: [],
          NQ2: [],
          NQ3: [],
          NQ4: [],
          NN1: [TEST_NEMESIS],
          NN2: [],
          NN3: [],
          CO: [],
          FI: []
        }
      })

      const settlement = createSettlementFromOptions(
        campaignWithCustomMonsters,
        options
      )

      expect(settlement.nemeses.length).toBe(1)
    })

    it('should handle custom quarry monsters', () => {
      const campaignWithCustomMonsters: Campaign = {
        ...baseCampaign,
        customQuarries: {
          'test-quarry': TEST_QUARRY
        }
      }

      const options = createTestOptions({
        campaignType: CampaignType.CUSTOM,
        name: 'Settlement with Custom Quarry',
        survivorType: SurvivorType.CORE,
        usesScouts: true,
        monsters: {
          NQ1: [TEST_QUARRY],
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

      const settlement = createSettlementFromOptions(
        campaignWithCustomMonsters,
        options
      )

      expect(settlement.quarries.length).toBe(1)
      expect(settlement.quarries[0].unlocked).toBe(false)

      // Check that custom location was added
      const customLocation = settlement.locations.find(
        (loc) => loc.name === 'Test Location'
      )
      expect(customLocation).toBeDefined()
    })

    it('should handle custom monsters with timeline events', () => {
      const campaignWithCustomMonsters: Campaign = {
        ...baseCampaign,
        customNemeses: {
          'test-nemesis': TEST_NEMESIS
        }
      }

      const options = createTestOptions({
        campaignType: CampaignType.CUSTOM,
        name: 'Settlement with Custom Events',
        survivorType: SurvivorType.CORE,
        usesScouts: true,
        monsters: {
          NQ1: [],
          NQ2: [],
          NQ3: [],
          NQ4: [],
          NN1: [TEST_NEMESIS],
          NN2: [],
          NN3: [],
          CO: [],
          FI: []
        }
      })

      const settlement = createSettlementFromOptions(
        campaignWithCustomMonsters,
        options
      )

      // Check that custom events were added to timeline
      expect(settlement.timeline[4].entries).toContain(
        'Nemesis Encounter - Test Nemesis Lvl 1'
      )
    })

    it('should handle custom Arc monsters with CC rewards', () => {
      const campaignWithCustomMonsters: Campaign = {
        ...baseCampaign,
        customQuarries: {
          'test-quarry': TEST_QUARRY
        }
      }

      const options = createTestOptions({
        campaignType: CampaignType.CUSTOM,
        name: 'Arc Settlement with Custom Quarry',
        survivorType: SurvivorType.ARC,
        usesScouts: true,
        monsters: {
          NQ1: [TEST_QUARRY],
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

      const settlement = createSettlementFromOptions(
        campaignWithCustomMonsters,
        options
      )

      expect(settlement.ccRewards).toBeDefined()
      const customReward = settlement.ccRewards!.find(
        (r) => r.name === 'Test Quarry Cuisine'
      )
      expect(customReward).toBeDefined()
      expect(customReward?.cc).toBe(6)
    })
  })

  describe('Settlement ID Generation', () => {
    it('should assign ID 1 to first settlement', () => {
      const options = createTestOptions({
        campaignType: CampaignType.PEOPLE_OF_THE_LANTERN,
        name: 'First Settlement',
        survivorType: SurvivorType.CORE,
        usesScouts: true,
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

      const settlement = createSettlementFromOptions(baseCampaign, options)

      expect(settlement.id).toBe(1)
    })

    it('should assign incrementing IDs to multiple settlements', () => {
      const campaign: Campaign = {
        ...baseCampaign,
        settlements: []
      }

      const options1 = createTestOptions({
        campaignType: CampaignType.PEOPLE_OF_THE_LANTERN,
        name: 'Settlement 1',
        survivorType: SurvivorType.CORE,
        usesScouts: true,
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

      const settlement1 = createSettlementFromOptions(campaign, options1)
      campaign.settlements.push(settlement1)

      const options2 = createTestOptions({
        campaignType: CampaignType.PEOPLE_OF_THE_LANTERN,
        name: 'Settlement 2',
        survivorType: SurvivorType.CORE,
        usesScouts: true,
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

      const settlement2 = createSettlementFromOptions(campaign, options2)

      expect(settlement1.id).toBe(1)
      expect(settlement2.id).toBe(2)
    })
  })

  describe('Mixed CORE and Custom Monsters', () => {
    it('should handle mix of CORE and custom monsters', () => {
      const campaignWithCustomMonsters: Campaign = {
        ...baseCampaign,
        customQuarries: {
          'test-quarry': TEST_QUARRY
        }
      }

      const options = createTestOptions({
        campaignType: CampaignType.CUSTOM,
        name: 'Mixed Settlement',
        survivorType: SurvivorType.CORE,
        usesScouts: true,
        monsters: {
          NQ1: [WHITE_LION],
          NQ2: [TEST_QUARRY],
          NQ3: [],
          NQ4: [],
          NN1: [BUTCHER],
          NN2: [],
          NN3: [],
          CO: [],
          FI: []
        }
      })

      const settlement = createSettlementFromOptions(
        campaignWithCustomMonsters,
        options
      )

      expect(settlement.quarries.length).toBe(2)
      expect(settlement.nemeses.length).toBe(1)

      // Check CORE monsters
      expect(settlement.quarries.some((q) => q.name === 'White Lion')).toBe(
        true
      )
      expect(settlement.nemeses.some((n) => n.name === 'Butcher')).toBe(true) // Butcher

      // Check custom monsters
      expect(settlement.quarries.some((q) => q.name === 'Test Quarry')).toBe(
        true
      )
    })
  })
})
