import { MonsterNode, TabType } from '@/lib/enums'
import { NEMESES, QUARRIES } from '@/lib/monsters'
import { Campaign } from '@/schemas/campaign'
import { migrateCampaign } from '@/schemas/migrate'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import * as packageInfo from '../../package.json'

// Mock console.log to avoid cluttering test output
beforeEach(() => {
  vi.spyOn(console, 'log').mockImplementation(() => {})
})

describe('migrateCampaign', () => {
  describe('Version Detection', () => {
    it('should migrate campaign with undefined version', () => {
      const campaign: Campaign = {
        customMonsters: {},
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

      const result = migrateCampaign(campaign)

      expect(result.version).toBe(packageInfo.version)
    })

    it('should migrate campaign with version 0.12.0', () => {
      const campaign: Campaign = {
        customMonsters: {},
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
        survivors: [],
        version: '0.12.0'
      }

      const result = migrateCampaign(campaign)

      expect(result.version).toBe(packageInfo.version)
    })

    it('should log migration message with correct versions', () => {
      const campaign: Campaign = {
        customMonsters: {},
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
        survivors: [],
        version: '0.12.0'
      }

      migrateCampaign(campaign)

      expect(console.log).toHaveBeenCalledWith(
        `Migrating Campaign (0.12.0 -> ${packageInfo.version})`
      )
      expect(console.log).toHaveBeenCalledWith('Migrating to 0.13.0')
    })

    it('should default to version 0.12.0 when version is undefined', () => {
      const campaign: Campaign = {
        customMonsters: {},
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

      migrateCampaign(campaign)

      expect(console.log).toHaveBeenCalledWith(
        `Migrating Campaign (0.12.0 -> ${packageInfo.version})`
      )
    })

    it('should not migrate when version is already 0.13.0', () => {
      const campaign: Campaign = {
        customMonsters: {},
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
        survivors: [],
        version: '0.13.0'
      }

      const result = migrateCampaign(campaign)

      expect(result.version).toBe(packageInfo.version)
    })

    it('should not migrate when version is newer than current', () => {
      const campaign: Campaign = {
        customMonsters: {},
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
        survivors: [],
        version: '0.14.0'
      }

      const result = migrateCampaign(campaign)

      expect(result.version).toBe('0.14.0')
      expect(console.log).not.toHaveBeenCalledWith('Migrating to 0.13.0')
    })
  })

  describe('Custom Monsters Migration', () => {
    it('should add empty customMonsters object when missing', () => {
      const campaign: Campaign = {
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
      } as Campaign

      const result = migrateCampaign(campaign)

      expect(result.customMonsters).toEqual({})
    })

    it('should preserve existing customMonsters', () => {
      const customMonsters = {
        'uuid-1': {
          main: {
            name: 'Custom Monster',
            node: MonsterNode.NQ1
          }
        }
      }

      const campaign = {
        customMonsters,
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
      } as unknown as Campaign

      const result = migrateCampaign(campaign)

      expect(result.customMonsters).toEqual(customMonsters)
    })
  })

  describe('Selection Fields Migration', () => {
    it('should preserve existing selection IDs', () => {
      const campaign: Campaign = {
        customMonsters: {},
        hunts: [],
        selectedHuntId: 5,
        selectedSettlementId: 3,
        selectedShowdownId: 7,
        selectedSurvivorId: 2,
        selectedTab: TabType.SETTLEMENT,
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
        survivors: [],
        version: '0.12.0'
      }

      const result = migrateCampaign(campaign)

      expect(result.selectedHuntId).toBe(5)
      expect(result.selectedSettlementId).toBe(3)
      expect(result.selectedShowdownId).toBe(7)
      expect(result.selectedSurvivorId).toBe(2)
      expect(result.selectedTab).toBe('settlement')
    })

    it('should set null for missing selection fields', () => {
      const campaign = {
        customMonsters: {},
        hunts: [],
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
      } as unknown as Campaign

      const result = migrateCampaign(campaign)

      expect(result.selectedHuntId).toBeNull()
      expect(result.selectedSettlementId).toBeNull()
      expect(result.selectedShowdownId).toBeNull()
      expect(result.selectedSurvivorId).toBeNull()
      expect(result.selectedTab).toBeNull()
    })
  })

  describe('Settings Migration', () => {
    it('should preserve existing settings', () => {
      const campaign: Campaign = {
        customMonsters: {},
        hunts: [],
        selectedHuntId: null,
        selectedSettlementId: null,
        selectedShowdownId: null,
        selectedSurvivorId: null,
        selectedTab: null,
        settings: {
          disableToasts: true,
          unlockedMonsters: {
            killeniumButcher: true,
            screamingNukalope: true,
            whiteGigalion: false
          }
        },
        settlements: [],
        showdowns: [],
        survivors: [],
        version: '0.12.0'
      }

      const result = migrateCampaign(campaign)

      expect(result.settings.disableToasts).toBe(true)
      expect(result.settings.unlockedMonsters.killeniumButcher).toBe(true)
      expect(result.settings.unlockedMonsters.screamingNukalope).toBe(true)
      expect(result.settings.unlockedMonsters.whiteGigalion).toBe(false)
    })

    it('should set default settings when missing', () => {
      const campaign = {
        customMonsters: {},
        hunts: [],
        selectedHuntId: null,
        selectedSettlementId: null,
        selectedShowdownId: null,
        selectedSurvivorId: null,
        selectedTab: null,
        settlements: [],
        showdowns: [],
        survivors: []
      } as unknown as Campaign

      const result = migrateCampaign(campaign)

      expect(result.settings.disableToasts).toBe(false)
      expect(result.settings.unlockedMonsters.killeniumButcher).toBe(false)
      expect(result.settings.unlockedMonsters.screamingNukalope).toBe(false)
      expect(result.settings.unlockedMonsters.whiteGigalion).toBe(false)
    })
  })

  describe('Survivors Migration', () => {
    it('should preserve existing survivors', () => {
      const survivors = [
        { id: 1, name: 'Survivor 1' },
        { id: 2, name: 'Survivor 2' }
      ]

      const campaign: Campaign = {
        customMonsters: {},
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
        survivors
      } as unknown as Campaign

      const result = migrateCampaign(campaign)

      expect(result.survivors).toEqual(survivors)
    })

    it('should set empty array when survivors is missing', () => {
      const campaign = {
        customMonsters: {},
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
        showdowns: []
      } as unknown as Campaign

      const result = migrateCampaign(campaign)

      expect(result.survivors).toEqual([])
    })
  })

  describe('Hunts AI Deck Migration', () => {
    it('should migrate hunt with aiDeckSize to new aiDeck structure', () => {
      const campaign: Campaign = {
        customMonsters: {},
        hunts: [
          {
            id: 1,
            monster: {
              accuracy: 0,
              accuracyTokens: 1,
              aiDeckSize: 8,
              damage: 0,
              damageTokens: 1,
              evasion: 0,
              evasionTokens: 1,
              knockedDown: false,
              level: '1',
              luck: 0,
              luckTokens: 1,
              moods: [],
              movement: 5,
              movementTokens: 1,
              name: 'Test Monster',
              notes: '',
              speed: 1,
              speedTokens: 1,
              strength: 0,
              strengthTokens: 1,
              toughness: 8,
              traits: [],
              type: 'Quarry',
              wounds: 0
            },
            monsterPosition: 5,
            scout: 1,
            settlementId: 1,
            survivorDetails: []
          }
        ],
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
      } as unknown as Campaign

      const result = migrateCampaign(campaign)

      expect(result.hunts![0].monster.aiDeck).toEqual({
        basic: 8,
        advanced: 0,
        legendary: 0
      })
      expect(result.hunts![0].monster.aiDeckRemaining).toBe(8)
    })

    it('should handle hunt with missing aiDeckSize', () => {
      const campaign: Campaign = {
        customMonsters: {},
        hunts: [
          {
            id: 1,
            monster: {
              accuracy: 0,
              accuracyTokens: 1,
              damage: 0,
              damageTokens: 1,
              evasion: 0,
              evasionTokens: 1,
              knockedDown: false,
              level: '1',
              luck: 0,
              luckTokens: 1,
              moods: [],
              movement: 5,
              movementTokens: 1,
              name: 'Test Monster',
              notes: '',
              speed: 1,
              speedTokens: 1,
              strength: 0,
              strengthTokens: 1,
              toughness: 8,
              traits: [],
              type: 'Quarry',
              wounds: 0
            },
            monsterPosition: 5,
            scout: 1,
            settlementId: 1,
            survivorDetails: []
          }
        ],
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
      } as unknown as Campaign

      const result = migrateCampaign(campaign)

      expect(result.hunts![0].monster.aiDeck).toEqual({
        basic: 0,
        advanced: 0,
        legendary: 0
      })
      expect(result.hunts![0].monster.aiDeckRemaining).toBe(0)
    })

    it('should migrate multiple hunts', () => {
      const campaign: Campaign = {
        customMonsters: {},
        hunts: [
          {
            id: 1,
            monster: {
              accuracy: 0,
              accuracyTokens: 1,
              aiDeckSize: 5,
              damage: 0,
              damageTokens: 1,
              evasion: 0,
              evasionTokens: 1,
              knockedDown: false,
              level: '1',
              luck: 0,
              luckTokens: 1,
              moods: [],
              movement: 5,
              movementTokens: 1,
              name: 'Monster 1',
              notes: '',
              speed: 1,
              speedTokens: 1,
              strength: 0,
              strengthTokens: 1,
              toughness: 8,
              traits: [],
              type: 'Quarry',
              wounds: 0
            },
            monsterPosition: 5,
            scout: 1,
            settlementId: 1,
            survivorDetails: []
          },
          {
            id: 2,
            monster: {
              accuracy: 0,
              accuracyTokens: 1,
              aiDeckSize: 10,
              damage: 0,
              damageTokens: 1,
              evasion: 0,
              evasionTokens: 1,
              knockedDown: false,
              level: '2',
              luck: 0,
              luckTokens: 1,
              moods: [],
              movement: 6,
              movementTokens: 1,
              name: 'Monster 2',
              notes: '',
              speed: 2,
              speedTokens: 1,
              strength: 0,
              strengthTokens: 1,
              toughness: 10,
              traits: [],
              type: 'Nemesis',
              wounds: 0
            },
            monsterPosition: 7,
            scout: 2,
            settlementId: 1,
            survivorDetails: []
          }
        ],
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
      } as unknown as Campaign

      const result = migrateCampaign(campaign)

      expect(result.hunts).toHaveLength(2)
      expect(result.hunts![0].monster.aiDeck).toEqual({
        basic: 5,
        advanced: 0,
        legendary: 0
      })
      expect(result.hunts![1].monster.aiDeck).toEqual({
        basic: 10,
        advanced: 0,
        legendary: 0
      })
    })
  })

  describe('Showdowns AI Deck Migration', () => {
    it('should migrate showdown with aiDeckSize to new aiDeck structure', () => {
      const campaign: Campaign = {
        customMonsters: {},
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
        showdowns: [
          {
            id: 1,
            monster: {
              accuracy: 0,
              accuracyTokens: 1,
              aiDeckSize: 12,
              damage: 0,
              damageTokens: 1,
              evasion: 0,
              evasionTokens: 1,
              knockedDown: false,
              level: '2',
              luck: 0,
              luckTokens: 1,
              moods: [],
              movement: 6,
              movementTokens: 1,
              name: 'Boss Monster',
              notes: '',
              speed: 2,
              speedTokens: 1,
              strength: 0,
              strengthTokens: 1,
              toughness: 15,
              traits: [],
              type: 'Nemesis',
              wounds: 0
            },
            settlementId: 1,
            survivorDetails: []
          }
        ],
        survivors: []
      } as unknown as Campaign

      const result = migrateCampaign(campaign)

      expect(result.showdowns![0].monster.aiDeck).toEqual({
        basic: 12,
        advanced: 0,
        legendary: 0
      })
      expect(result.showdowns![0].monster.aiDeckRemaining).toBe(12)
    })

    it('should migrate multiple showdowns', () => {
      const campaign: Campaign = {
        customMonsters: {},
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
        showdowns: [
          {
            id: 1,
            monster: {
              accuracy: 0,
              accuracyTokens: 1,
              aiDeckSize: 8,
              damage: 0,
              damageTokens: 1,
              evasion: 0,
              evasionTokens: 1,
              knockedDown: false,
              level: '1',
              luck: 0,
              luckTokens: 1,
              moods: [],
              movement: 5,
              movementTokens: 1,
              name: 'Showdown 1',
              notes: '',
              speed: 1,
              speedTokens: 1,
              strength: 0,
              strengthTokens: 1,
              toughness: 10,
              traits: [],
              type: 'Quarry',
              wounds: 0
            },
            settlementId: 1,
            survivorDetails: []
          },
          {
            id: 2,
            monster: {
              accuracy: 0,
              accuracyTokens: 1,
              aiDeckSize: 15,
              damage: 0,
              damageTokens: 1,
              evasion: 0,
              evasionTokens: 1,
              knockedDown: false,
              level: '3',
              luck: 0,
              luckTokens: 1,
              moods: [],
              movement: 7,
              movementTokens: 1,
              name: 'Showdown 2',
              notes: '',
              speed: 2,
              speedTokens: 1,
              strength: 0,
              strengthTokens: 1,
              toughness: 20,
              traits: [],
              type: 'Nemesis',
              wounds: 0
            },
            settlementId: 1,
            survivorDetails: []
          }
        ],
        survivors: []
      } as unknown as Campaign

      const result = migrateCampaign(campaign)

      expect(result.showdowns).toHaveLength(2)
      expect(result.showdowns![0].monster.aiDeck.basic).toBe(8)
      expect(result.showdowns![1].monster.aiDeck.basic).toBe(15)
    })
  })

  describe('Settlement Nemeses Migration', () => {
    it('should migrate nemesis from name to ID', () => {
      const firstNemesisId = parseInt(Object.keys(NEMESES)[0])
      const firstNemesisName =
        NEMESES[firstNemesisId as keyof typeof NEMESES].main.name

      const campaign: Campaign = {
        customMonsters: {},
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
        settlements: [
          {
            id: 1,
            name: 'Test Settlement',
            nemeses: [
              {
                ccLevel1: true,
                ccLevel2: false,
                ccLevel3: false,
                name: firstNemesisName,
                level1: true,
                level2: false,
                level3: false,
                unlocked: true
              }
            ]
          }
        ],
        showdowns: [],
        survivors: []
      } as unknown as Campaign

      const result = migrateCampaign(campaign)

      expect(result.settlements[0].nemeses[0].id).toBe(firstNemesisId)
      expect(result.settlements[0].nemeses[0].level1).toBe(true)
      expect(result.settlements[0].nemeses[0].unlocked).toBe(true)
    })

    it('should handle nemesis with missing level fields', () => {
      const firstNemesisId = parseInt(Object.keys(NEMESES)[0])
      const firstNemesisName =
        NEMESES[firstNemesisId as keyof typeof NEMESES].main.name

      const campaign: Campaign = {
        customMonsters: {},
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
        settlements: [
          {
            id: 1,
            name: 'Test Settlement',
            nemeses: [
              {
                name: firstNemesisName,
                unlocked: true
              }
            ]
          }
        ],
        showdowns: [],
        survivors: []
      } as unknown as Campaign

      const result = migrateCampaign(campaign)

      expect(result.settlements[0].nemeses[0].level1).toBe(false)
      expect(result.settlements[0].nemeses[0].level2).toBe(false)
      expect(result.settlements[0].nemeses[0].level3).toBe(false)
    })

    it('should handle nemesis with missing unlocked field', () => {
      const firstNemesisId = parseInt(Object.keys(NEMESES)[0])
      const firstNemesisName =
        NEMESES[firstNemesisId as keyof typeof NEMESES].main.name

      const campaign: Campaign = {
        customMonsters: {},
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
        settlements: [
          {
            id: 1,
            name: 'Test Settlement',
            nemeses: [
              {
                name: firstNemesisName,
                level1: true,
                level2: false,
                level3: false
              }
            ]
          }
        ],
        showdowns: [],
        survivors: []
      } as unknown as Campaign

      const result = migrateCampaign(campaign)

      expect(result.settlements[0].nemeses[0].unlocked).toBe(false)
    })

    it('should set nemesis ID to -1 when name not found', () => {
      const campaign: Campaign = {
        customMonsters: {},
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
        settlements: [
          {
            id: 1,
            name: 'Test Settlement',
            nemeses: [
              {
                name: 'Unknown Nemesis',
                level1: false,
                level2: false,
                level3: false,
                unlocked: false
              }
            ]
          }
        ],
        showdowns: [],
        survivors: []
      } as unknown as Campaign

      const result = migrateCampaign(campaign)

      expect(result.settlements[0].nemeses[0].id).toBe(-1)
    })
  })

  describe('Settlement Quarries Migration', () => {
    it('should migrate quarry from name to ID', () => {
      const firstQuarryId = parseInt(Object.keys(QUARRIES)[0])
      const firstQuarryName =
        QUARRIES[firstQuarryId as keyof typeof QUARRIES].main.name

      const campaign: Campaign = {
        customMonsters: {},
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
        settlements: [
          {
            id: 1,
            name: 'Test Settlement',
            quarries: [
              {
                ccLevel1: true,
                ccLevel2: [true, false],
                ccLevel3: [true, false, true],
                ccPrologue: false,
                name: firstQuarryName,
                unlocked: true
              }
            ]
          }
        ],
        showdowns: [],
        survivors: []
      } as unknown as Campaign

      const result = migrateCampaign(campaign)

      expect(result.settlements[0].quarries[0].id).toBe(firstQuarryId)
      expect(result.settlements[0].quarries[0].unlocked).toBe(true)
    })

    it('should preserve node field from monster data', () => {
      const firstQuarryId = parseInt(Object.keys(QUARRIES)[0])
      const firstQuarryName =
        QUARRIES[firstQuarryId as keyof typeof QUARRIES].main.name
      const expectedNode =
        QUARRIES[firstQuarryId as keyof typeof QUARRIES].main.node

      const campaign: Campaign = {
        customMonsters: {},
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
        settlements: [
          {
            id: 1,
            name: 'Test Settlement',
            quarries: [
              {
                name: firstQuarryName,
                unlocked: true
              }
            ]
          }
        ],
        showdowns: [],
        survivors: []
      } as unknown as Campaign

      const result = migrateCampaign(campaign as Campaign)

      // Note: node is added by migration logic, not in schema
      expect(
        (
          result.settlements?.[0]?.quarries?.[0] as unknown as {
            node: MonsterNode
          }
        )?.node
      ).toBe(expectedNode)
    })

    it('should handle quarry with missing unlocked field', () => {
      const firstQuarryId = parseInt(Object.keys(QUARRIES)[0])
      const firstQuarryName =
        QUARRIES[firstQuarryId as keyof typeof QUARRIES].main.name

      const campaign: Campaign = {
        customMonsters: {},
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
        settlements: [
          {
            id: 1,
            name: 'Test Settlement',
            quarries: [
              {
                name: firstQuarryName
              }
            ]
          }
        ],
        showdowns: [],
        survivors: []
      } as unknown as Campaign

      const result = migrateCampaign(campaign)

      expect(result.settlements[0].quarries[0].unlocked).toBe(false)
    })

    it('should set quarry ID to -1 and node to NQ1 when name not found', () => {
      const campaign: Campaign = {
        customMonsters: {},
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
        settlements: [
          {
            id: 1,
            name: 'Test Settlement',
            quarries: [
              {
                name: 'Unknown Quarry',
                unlocked: false
              }
            ]
          }
        ],
        showdowns: [],
        survivors: []
      } as unknown as Campaign

      const result = migrateCampaign(campaign as Campaign)

      expect(result.settlements?.[0]?.quarries?.[0]?.id).toBe(-1)
      // Note: node is added by migration logic, not in schema
      expect(
        (
          result.settlements?.[0]?.quarries?.[0] as unknown as {
            node: MonsterNode
          }
        )?.node
      ).toBe(MonsterNode.NQ1)
    })

    it('should migrate multiple quarries', () => {
      const quarryIds = Object.keys(QUARRIES).slice(0, 2).map(Number)
      const quarryNames = quarryIds.map(
        (id) => QUARRIES[id as keyof typeof QUARRIES].main.name
      )

      const campaign: Campaign = {
        customMonsters: {},
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
        settlements: [
          {
            id: 1,
            name: 'Test Settlement',
            quarries: [
              {
                name: quarryNames[0],
                unlocked: true
              },
              {
                name: quarryNames[1],
                unlocked: false
              }
            ]
          }
        ],
        showdowns: [],
        survivors: []
      } as unknown as Campaign

      const result = migrateCampaign(campaign)

      expect(result.settlements[0].quarries).toHaveLength(2)
      expect(result.settlements[0].quarries[0].id).toBe(quarryIds[0])
      expect(result.settlements[0].quarries[1].id).toBe(quarryIds[1])
    })
  })

  describe('Multiple Settlements Migration', () => {
    it('should migrate multiple settlements', () => {
      const firstNemesisId = parseInt(Object.keys(NEMESES)[0])
      const firstNemesisName =
        NEMESES[firstNemesisId as keyof typeof NEMESES].main.name
      const firstQuarryId = parseInt(Object.keys(QUARRIES)[0])
      const firstQuarryName =
        QUARRIES[firstQuarryId as keyof typeof QUARRIES].main.name

      const campaign: Campaign = {
        customMonsters: {},
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
        settlements: [
          {
            id: 1,
            name: 'Settlement 1',
            nemeses: [
              {
                name: firstNemesisName,
                level1: true,
                level2: false,
                level3: false,
                unlocked: true
              }
            ],
            quarries: [
              {
                name: firstQuarryName,
                unlocked: true
              }
            ]
          },
          {
            id: 2,
            name: 'Settlement 2',
            nemeses: [],
            quarries: []
          }
        ],
        showdowns: [],
        survivors: []
      } as unknown as Campaign

      const result = migrateCampaign(campaign)

      expect(result.settlements).toHaveLength(2)
      expect(result.settlements[0].name).toBe('Settlement 1')
      expect(result.settlements[1].name).toBe('Settlement 2')
      expect(result.settlements[0].nemeses[0].id).toBe(firstNemesisId)
      expect(result.settlements[0].quarries[0].id).toBe(firstQuarryId)
    })

    it('should handle settlement with missing nemeses and quarries', () => {
      const campaign: Campaign = {
        customMonsters: {},
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
        settlements: [
          {
            id: 1,
            name: 'Empty Settlement'
          }
        ],
        showdowns: [],
        survivors: []
      } as unknown as Campaign

      const result = migrateCampaign(campaign)

      expect(result.settlements[0].nemeses).toEqual([])
      expect(result.settlements[0].quarries).toEqual([])
    })
  })

  describe('Complete Migration', () => {
    it('should handle empty campaign data', () => {
      const campaign: Campaign = {
        customMonsters: {},
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

      const result = migrateCampaign(campaign)

      expect(result.version).toBe(packageInfo.version)
      expect(result.customMonsters).toEqual({})
      expect(result.hunts).toEqual([])
      expect(result.settlements).toEqual([])
      expect(result.showdowns).toEqual([])
      expect(result.survivors).toEqual([])
    })

    it('should return the same campaign object', () => {
      const campaign: Campaign = {
        customMonsters: {},
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

      const result = migrateCampaign(campaign)

      expect(result).toBe(campaign)
    })
  })
})
