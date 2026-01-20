import { TabType } from '@/lib/enums'
import { CampaignSchema } from '@/schemas/campaign'
import { GlobalSettingsSchema } from '@/schemas/global-settings'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ZodError } from 'zod'

describe('GlobalSettingsSchema', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Valid Data', () => {
    it('should validate with disableToasts set to false', () => {
      const result = GlobalSettingsSchema.safeParse({
        disableToasts: false,
        unlockedMonsters: {
          killeniumButcher: false,
          screamingNukalope: false,
          whiteGigalion: false
        }
      })

      expect(result.success).toBe(true)
      if (result.success) expect(result.data.disableToasts).toBe(false)
    })

    it('should validate with disableToasts set to true', () => {
      const result = GlobalSettingsSchema.safeParse({
        disableToasts: true,
        unlockedMonsters: {
          killeniumButcher: true,
          screamingNukalope: true,
          whiteGigalion: true
        }
      })

      expect(result.success).toBe(true)
      if (result.success) expect(result.data.disableToasts).toBe(true)
    })

    it('should default disableToasts to false when not provided', () => {
      const result = GlobalSettingsSchema.safeParse({
        unlockedMonsters: {
          killeniumButcher: false,
          screamingNukalope: false,
          whiteGigalion: false
        }
      })

      expect(result.success).toBe(true)
      if (result.success) expect(result.data.disableToasts).toBe(false)
    })

    it('should validate with all unlocked monsters set to false', () => {
      const result = GlobalSettingsSchema.safeParse({
        disableToasts: false,
        unlockedMonsters: {
          killeniumButcher: false,
          screamingNukalope: false,
          whiteGigalion: false
        }
      })

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.unlockedMonsters.killeniumButcher).toBe(false)
        expect(result.data.unlockedMonsters.screamingNukalope).toBe(false)
        expect(result.data.unlockedMonsters.whiteGigalion).toBe(false)
      }
    })

    it('should validate with all unlocked monsters set to true', () => {
      const result = GlobalSettingsSchema.safeParse({
        disableToasts: false,
        unlockedMonsters: {
          killeniumButcher: true,
          screamingNukalope: true,
          whiteGigalion: true
        }
      })

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.unlockedMonsters.killeniumButcher).toBe(true)
        expect(result.data.unlockedMonsters.screamingNukalope).toBe(true)
        expect(result.data.unlockedMonsters.whiteGigalion).toBe(true)
      }
    })

    it('should default all unlocked monsters to false when not provided', () => {
      const result = GlobalSettingsSchema.safeParse({
        disableToasts: false,
        unlockedMonsters: {}
      })

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.unlockedMonsters.killeniumButcher).toBe(false)
        expect(result.data.unlockedMonsters.screamingNukalope).toBe(false)
        expect(result.data.unlockedMonsters.whiteGigalion).toBe(false)
      }
    })
  })

  describe('Invalid Data', () => {
    it('should fail validation when disableToasts is not a boolean', () => {
      const result = GlobalSettingsSchema.safeParse({
        disableToasts: 'true',
        unlockedMonsters: {
          killeniumButcher: false,
          screamingNukalope: false,
          whiteGigalion: false
        }
      })

      expect(result.success).toBe(false)
      if (!result.success) expect(result.error).toBeInstanceOf(ZodError)
    })

    it('should fail validation when disableToasts is null', () => {
      const result = GlobalSettingsSchema.safeParse({
        disableToasts: null,
        unlockedMonsters: {
          killeniumButcher: false,
          screamingNukalope: false,
          whiteGigalion: false
        }
      })

      expect(result.success).toBe(false)
      if (!result.success) expect(result.error).toBeInstanceOf(ZodError)
    })

    it('should fail validation when killeniumButcher is not a boolean', () => {
      const result = GlobalSettingsSchema.safeParse({
        disableToasts: false,
        unlockedMonsters: {
          killeniumButcher: 'true',
          screamingNukalope: false,
          whiteGigalion: false
        }
      })

      expect(result.success).toBe(false)
      if (!result.success) expect(result.error).toBeInstanceOf(ZodError)
    })

    it('should fail validation when screamingNukalope is not a boolean', () => {
      const result = GlobalSettingsSchema.safeParse({
        disableToasts: false,
        unlockedMonsters: {
          killeniumButcher: false,
          screamingNukalope: 'true',
          whiteGigalion: false
        }
      })

      expect(result.success).toBe(false)
      if (!result.success) expect(result.error).toBeInstanceOf(ZodError)
    })

    it('should fail validation when whiteGigalion is not a boolean', () => {
      const result = GlobalSettingsSchema.safeParse({
        disableToasts: false,
        unlockedMonsters: {
          killeniumButcher: false,
          screamingNukalope: false,
          whiteGigalion: 'true'
        }
      })

      expect(result.success).toBe(false)
      if (!result.success) expect(result.error).toBeInstanceOf(ZodError)
    })

    it('should fail validation when unlockedMonsters is missing', () => {
      const result = GlobalSettingsSchema.safeParse({
        disableToasts: false
      })

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error).toBeInstanceOf(ZodError)
        expect(result.error.issues).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              path: ['unlockedMonsters']
            })
          ])
        )
      }
    })
  })
})

describe('CampaignSchema', () => {
  describe('Valid Data', () => {
    it('should validate a minimal valid campaign', () => {
      const result = CampaignSchema.safeParse({
        hunts: null,
        selectedHuntId: null,
        selectedShowdownId: null,
        selectedSettlementId: null,
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
        showdowns: null,
        survivors: []
      })

      expect(result.success).toBe(true)
    })

    it('should validate a campaign with all fields populated', () => {
      const result = CampaignSchema.safeParse({
        hunts: [],
        selectedHuntId: 1,
        selectedShowdownId: 1,
        selectedSettlementId: 1,
        selectedSurvivorId: 1,
        selectedTab: TabType.TIMELINE,
        settings: {
          disableToasts: true,
          unlockedMonsters: {
            killeniumButcher: true,
            screamingNukalope: true,
            whiteGigalion: true
          }
        },
        settlements: [],
        showdowns: [],
        survivors: []
      })

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.selectedHuntId).toBe(1)
        expect(result.data.selectedShowdownId).toBe(1)
        expect(result.data.selectedSettlementId).toBe(1)
        expect(result.data.selectedSurvivorId).toBe(1)
        expect(result.data.selectedTab).toBe(TabType.TIMELINE)
        expect(result.data.settings.disableToasts).toBe(true)
        expect(result.data.settings.unlockedMonsters.killeniumButcher).toBe(
          true
        )
        expect(result.data.settings.unlockedMonsters.screamingNukalope).toBe(
          true
        )
        expect(result.data.settings.unlockedMonsters.whiteGigalion).toBe(true)
      }
    })

    it('should validate with optional fields omitted', () => {
      const result = CampaignSchema.safeParse({
        settings: {
          disableToasts: false,
          unlockedMonsters: {
            killeniumButcher: false,
            screamingNukalope: false,
            whiteGigalion: false
          }
        },
        settlements: [],
        survivors: []
      })

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.hunts).toBeUndefined()
        expect(result.data.selectedHuntId).toBeUndefined()
        expect(result.data.selectedShowdownId).toBeUndefined()
        expect(result.data.selectedSettlementId).toBeUndefined()
        expect(result.data.selectedSurvivorId).toBeUndefined()
        expect(result.data.selectedTab).toBeUndefined()
        expect(result.data.showdowns).toBeUndefined()
      }
    })

    it('should validate each valid TabType enum value', () => {
      const tabTypes = [
        TabType.ARC,
        TabType.CRAFTING,
        TabType.HUNT,
        TabType.MONSTERS,
        TabType.NOTES,
        TabType.SETTINGS,
        TabType.SETTLEMENT,
        TabType.SHOWDOWN,
        TabType.SOCIETY,
        TabType.SQUIRES,
        TabType.SURVIVORS,
        TabType.TIMELINE
      ]

      tabTypes.forEach((tabType) => {
        const result = CampaignSchema.safeParse({
          selectedTab: tabType,
          settings: {
            disableToasts: false,
            unlockedMonsters: {
              killeniumButcher: false,
              screamingNukalope: false,
              whiteGigalion: false
            }
          },
          settlements: [],
          survivors: []
        })

        expect(result.success).toBe(true)
        if (result.success) expect(result.data.selectedTab).toBe(tabType)
      })
    })
  })

  describe('Invalid Data', () => {
    it('should fail validation when settings is missing', () => {
      const result = CampaignSchema.safeParse({
        settlements: [],
        survivors: []
      })

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error).toBeInstanceOf(ZodError)
        expect(result.error.issues).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              path: ['settings']
            })
          ])
        )
      }
    })

    it('should fail validation when settlements is missing', () => {
      const result = CampaignSchema.safeParse({
        settings: {
          disableToasts: false
        },
        survivors: []
      })

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error).toBeInstanceOf(ZodError)
        expect(result.error.issues).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              path: ['settlements']
            })
          ])
        )
      }
    })

    it('should fail validation when survivors is missing', () => {
      const result = CampaignSchema.safeParse({
        settings: {
          disableToasts: false
        },
        settlements: []
      })

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error).toBeInstanceOf(ZodError)
        expect(result.error.issues).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              path: ['survivors']
            })
          ])
        )
      }
    })

    it('should fail validation when selectedTab has invalid value', () => {
      const result = CampaignSchema.safeParse({
        selectedTab: 'invalid-tab',
        settings: {
          disableToasts: false,
          unlockedMonsters: {
            killeniumButcher: false,
            screamingNukalope: false,
            whiteGigalion: false
          }
        },
        settlements: [],
        survivors: []
      })

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error).toBeInstanceOf(ZodError)
        expect(result.error.issues).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              path: ['selectedTab']
            })
          ])
        )
      }
    })

    it('should fail validation when selectedHuntId is not a number', () => {
      const result = CampaignSchema.safeParse({
        selectedHuntId: 'not-a-number',
        settings: {
          disableToasts: false,
          unlockedMonsters: {
            killeniumButcher: false,
            screamingNukalope: false,
            whiteGigalion: false
          }
        },
        settlements: [],
        survivors: []
      })

      expect(result.success).toBe(false)
      if (!result.success) expect(result.error).toBeInstanceOf(ZodError)
    })

    it('should fail validation when selectedShowdownId is not a number', () => {
      const result = CampaignSchema.safeParse({
        selectedShowdownId: 'not-a-number',
        settings: {
          disableToasts: false,
          unlockedMonsters: {
            killeniumButcher: false,
            screamingNukalope: false,
            whiteGigalion: false
          }
        },
        settlements: [],
        survivors: []
      })

      expect(result.success).toBe(false)
      if (!result.success) expect(result.error).toBeInstanceOf(ZodError)
    })

    it('should fail validation when selectedSettlementId is not a number', () => {
      const result = CampaignSchema.safeParse({
        selectedSettlementId: 'not-a-number',
        settings: {
          disableToasts: false,
          unlockedMonsters: {
            killeniumButcher: false,
            screamingNukalope: false,
            whiteGigalion: false
          }
        },
        settlements: [],
        survivors: []
      })

      expect(result.success).toBe(false)
      if (!result.success) expect(result.error).toBeInstanceOf(ZodError)
    })

    it('should fail validation when selectedSurvivorId is not a number', () => {
      const result = CampaignSchema.safeParse({
        selectedSurvivorId: 'not-a-number',
        settings: {
          disableToasts: false,
          unlockedMonsters: {
            killeniumButcher: false,
            screamingNukalope: false,
            whiteGigalion: false
          }
        },
        settlements: [],
        survivors: []
      })

      expect(result.success).toBe(false)
      if (!result.success) expect(result.error).toBeInstanceOf(ZodError)
    })

    it('should fail validation when settlements is not an array', () => {
      const result = CampaignSchema.safeParse({
        settings: {
          disableToasts: false,
          unlockedMonsters: {
            killeniumButcher: false,
            screamingNukalope: false,
            whiteGigalion: false
          }
        },
        settlements: 'not-an-array',
        survivors: []
      })

      expect(result.success).toBe(false)
      if (!result.success) expect(result.error).toBeInstanceOf(ZodError)
    })

    it('should fail validation when survivors is not an array', () => {
      const result = CampaignSchema.safeParse({
        settings: {
          disableToasts: false,
          unlockedMonsters: {
            killeniumButcher: false,
            screamingNukalope: false,
            whiteGigalion: false
          }
        },
        settlements: [],
        survivors: 'not-an-array'
      })

      expect(result.success).toBe(false)
      if (!result.success) expect(result.error).toBeInstanceOf(ZodError)
    })

    it('should fail validation when hunts is not an array or null', () => {
      const result = CampaignSchema.safeParse({
        hunts: 'not-an-array',
        settings: {
          disableToasts: false,
          unlockedMonsters: {
            killeniumButcher: false,
            screamingNukalope: false,
            whiteGigalion: false
          }
        },
        settlements: [],
        survivors: []
      })

      expect(result.success).toBe(false)
      if (!result.success) expect(result.error).toBeInstanceOf(ZodError)
    })

    it('should fail validation when showdowns is not an array or null', () => {
      const result = CampaignSchema.safeParse({
        showdowns: 'not-an-array',
        settings: {
          disableToasts: false,
          unlockedMonsters: {
            killeniumButcher: false,
            screamingNukalope: false,
            whiteGigalion: false
          }
        },
        settlements: [],
        survivors: []
      })

      expect(result.success).toBe(false)
      if (!result.success) expect(result.error).toBeInstanceOf(ZodError)
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty arrays for all array fields', () => {
      const result = CampaignSchema.safeParse({
        hunts: [],
        showdowns: [],
        settings: {
          disableToasts: false,
          unlockedMonsters: {
            killeniumButcher: false,
            screamingNukalope: false,
            whiteGigalion: false
          }
        },
        settlements: [],
        survivors: []
      })

      expect(result.success).toBe(true)
    })

    it('should handle null values for nullable fields', () => {
      const result = CampaignSchema.safeParse({
        hunts: null,
        selectedHuntId: null,
        selectedShowdownId: null,
        selectedSettlementId: null,
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
        showdowns: null,
        survivors: []
      })

      expect(result.success).toBe(true)
    })

    it('should handle zero values for ID fields', () => {
      const result = CampaignSchema.safeParse({
        selectedHuntId: 0,
        selectedShowdownId: 0,
        selectedSettlementId: 0,
        selectedSurvivorId: 0,
        settings: {
          disableToasts: false,
          unlockedMonsters: {
            killeniumButcher: false,
            screamingNukalope: false,
            whiteGigalion: false
          }
        },
        settlements: [],
        survivors: []
      })

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.selectedHuntId).toBe(0)
        expect(result.data.selectedShowdownId).toBe(0)
        expect(result.data.selectedSettlementId).toBe(0)
        expect(result.data.selectedSurvivorId).toBe(0)
      }
    })

    it('should handle negative values for ID fields', () => {
      const result = CampaignSchema.safeParse({
        selectedHuntId: -1,
        selectedShowdownId: -1,
        selectedSettlementId: -1,
        selectedSurvivorId: -1,
        settings: {
          disableToasts: false,
          unlockedMonsters: {
            killeniumButcher: false,
            screamingNukalope: false,
            whiteGigalion: false
          }
        },
        settlements: [],
        survivors: []
      })

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.selectedHuntId).toBe(-1)
        expect(result.data.selectedShowdownId).toBe(-1)
        expect(result.data.selectedSettlementId).toBe(-1)
        expect(result.data.selectedSurvivorId).toBe(-1)
      }
    })
  })
})
