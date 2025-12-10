import { Gender, Philosophy, WeaponType } from '@/lib/enums'
import { BaseSurvivorSchema, SurvivorSchema } from '@/schemas/survivor'
import { describe, expect, it } from 'vitest'

describe('BaseSurvivorSchema', () => {
  describe('Valid Data', () => {
    it('should validate with all defaults', () => {
      const result = BaseSurvivorSchema.safeParse({})

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.accuracy).toBe(0)
        expect(result.data.canDodge).toBe(true)
        expect(result.data.canSpendSurvival).toBe(true)
        expect(result.data.courage).toBe(0)
        expect(result.data.dead).toBe(false)
        expect(result.data.survival).toBe(1)
      }
    })

    it('should validate with all attributes populated', () => {
      const result = SurvivorSchema.safeParse({
        abilitiesAndImpairments: ['Ambidextrous'],
        accuracy: 5,
        canDash: true,
        canDodge: true,
        canFistPump: true,
        canEncourage: true,
        canSpendSurvival: true,
        canSurge: true,
        canUseFightingArtsOrKnowledges: true,
        courage: 5,
        cursedGear: ['Cursed Sword'],
        dead: false,
        disorders: ['Anxiety'],
        evasion: 3,
        fightingArts: ['Double Dash'],
        hasAnalyze: true,
        hasExplore: true,
        hasMatchmaker: false,
        hasPrepared: true,
        hasStalwart: false,
        hasTinker: true,
        huntXP: 10,
        insanity: 5,
        luck: 2,
        movement: 7,
        nextDeparture: ['+1 Survival'],
        notes: 'Veteran survivor',
        oncePerLifetime: ['Reroll'],
        rerollUsed: true,
        retired: false,
        secretFightingArts: ['Secret Art'],
        skipNextHunt: false,
        speed: 3,
        strength: 4,
        survival: 3,
        understanding: 6,
        weaponProficiency: 5,
        weaponProficiencyType: WeaponType.SWORD,
        armArmor: 2,
        armLightDamage: false,
        armHeavyDamage: false,
        bodyArmor: 3,
        bodyLightDamage: true,
        bodyHeavyDamage: false,
        brainLightDamage: false,
        headArmor: 1,
        headHeavyDamage: false,
        legArmor: 2,
        legLightDamage: false,
        legHeavyDamage: false,
        waistArmor: 2,
        waistLightDamage: false,
        waistHeavyDamage: false,
        armBroken: 0,
        armContracture: 1,
        armDismembered: 0,
        armRupturedMuscle: false,
        bodyBrokenRib: 2,
        bodyDestroyedBack: false,
        bodyGapingChestWound: 1,
        headBlind: 0,
        headDeaf: false,
        headIntracranialHemorrhage: false,
        headShatteredJaw: false,
        legBroken: 1,
        legDismembered: 0,
        legHamstrung: false,
        waistBrokenHip: false,
        waistDestroyedGenitals: false,
        waistIntestinalProlapse: false,
        waistWarpedPelvis: 0,
        canEndure: true,
        knowledge1ObservationRank: 3,
        knowledge2ObservationRank: 2,
        lumi: 5,
        philosophyRank: 4,
        systemicPressure: 2,
        tenetKnowledgeObservationRank: 3,
        torment: 1,
        hasAbsoluteReaper: false,
        hasAbsoluteRust: false,
        hasAbsoluteStorm: true,
        hasAbsoluteWitch: false,
        hasGamblerReaper: false,
        hasGamblerRust: false,
        hasGamblerStorm: false,
        hasGamblerWitch: false,
        hasGoblinReaper: false,
        hasGoblinRust: false,
        hasGoblinStorm: false,
        hasGoblinWitch: false,
        hasSculptorReaper: false,
        hasSculptorRust: false,
        hasSculptorStorm: false,
        hasSculptorWitch: false,
        gender: Gender.MALE,
        huntXPRankUp: [2, 6, 10, 15],
        id: 1,
        name: 'Test Survivor',
        settlementId: 1
      })

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.name).toBe('Test Survivor')
        expect(result.data.courage).toBe(5)
        expect(result.data.understanding).toBe(6)
      }
    })
  })

  describe('Invalid Data', () => {
    it('should fail when courage is negative', () => {
      const result = BaseSurvivorSchema.safeParse({
        courage: -1
      })

      expect(result.success).toBe(false)
      if (!result.success)
        expect(result.error.issues).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              message: 'Courage cannot be negative.'
            })
          ])
        )
    })

    it('should fail when courage exceeds 9', () => {
      const result = BaseSurvivorSchema.safeParse({
        courage: 10
      })

      expect(result.success).toBe(false)
      if (!result.success)
        expect(result.error.issues).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              message: 'Courage may not exceed 9.'
            })
          ])
        )
    })

    it('should fail when understanding is negative', () => {
      const result = BaseSurvivorSchema.safeParse({
        understanding: -1
      })

      expect(result.success).toBe(false)
      if (!result.success)
        expect(result.error.issues).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              message: 'Understanding cannot be negative.'
            })
          ])
        )
    })

    it('should fail when understanding exceeds 9', () => {
      const result = BaseSurvivorSchema.safeParse({
        understanding: 10
      })

      expect(result.success).toBe(false)
      if (!result.success)
        expect(result.error.issues).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              message: 'Understanding cannot exceed 9.'
            })
          ])
        )
    })

    it('should fail when huntXP is negative', () => {
      const result = BaseSurvivorSchema.safeParse({
        huntXP: -1
      })

      expect(result.success).toBe(false)
      if (!result.success)
        expect(result.error.issues).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              message: 'Hunt XP cannot be negative.'
            })
          ])
        )
    })

    it('should fail when huntXP exceeds 16', () => {
      const result = BaseSurvivorSchema.safeParse({
        huntXP: 17
      })

      expect(result.success).toBe(false)
      if (!result.success)
        expect(result.error.issues).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              message: 'Hunt XP cannot exceed 16.'
            })
          ])
        )
    })

    it('should fail when weaponProficiency is negative', () => {
      const result = BaseSurvivorSchema.safeParse({
        weaponProficiency: -1
      })

      expect(result.success).toBe(false)
      if (!result.success)
        expect(result.error.issues).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              message: 'Weapon proficiency cannot be negative.'
            })
          ])
        )
    })

    it('should fail when weaponProficiency exceeds 8', () => {
      const result = BaseSurvivorSchema.safeParse({
        weaponProficiency: 9
      })

      expect(result.success).toBe(false)
      if (!result.success)
        expect(result.error.issues).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              message: 'Weapon proficiency cannot exceed 8.'
            })
          ])
        )
    })

    it('should fail when movement is less than 1', () => {
      const result = BaseSurvivorSchema.safeParse({
        movement: 0
      })

      expect(result.success).toBe(false)
      if (!result.success)
        expect(result.error.issues).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              message: 'Movement cannot be less than 1.'
            })
          ])
        )
    })

    it('should fail when survival is negative', () => {
      const result = BaseSurvivorSchema.safeParse({
        survival: -1
      })

      expect(result.success).toBe(false)
      if (!result.success)
        expect(result.error.issues).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              message: 'Survival cannot be negative.'
            })
          ])
        )
    })

    it('should fail when insanity is negative', () => {
      const result = BaseSurvivorSchema.safeParse({
        insanity: -1
      })

      expect(result.success).toBe(false)
      if (!result.success)
        expect(result.error.issues).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              message: 'Insanity cannot be negative.'
            })
          ])
        )
    })

    it('should fail when disorders exceed 3', () => {
      const result = BaseSurvivorSchema.safeParse({
        disorders: ['Disorder 1', 'Disorder 2', 'Disorder 3', 'Disorder 4']
      })

      expect(result.success).toBe(false)
      if (!result.success)
        expect(result.error.issues).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              message: 'A survivor may not have more than three disorders.'
            })
          ])
        )
    })

    it('should fail when armor values are negative', () => {
      const result = BaseSurvivorSchema.safeParse({
        headArmor: -1
      })

      expect(result.success).toBe(false)
      if (!result.success)
        expect(result.error.issues).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              message: 'Head armor cannot be negative.'
            })
          ])
        )
    })

    it('should fail when severe injury counts exceed maximum', () => {
      const result = BaseSurvivorSchema.safeParse({
        armBroken: 3
      })

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              message: 'Broken arm count cannot exceed 2.'
            })
          ])
        )
      }
    })

    it('should fail when lumi is negative', () => {
      const result = BaseSurvivorSchema.safeParse({
        lumi: -1
      })

      expect(result.success).toBe(false)
      if (!result.success)
        expect(result.error.issues).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              message: 'Lumi cannot be negative.'
            })
          ])
        )
    })

    it('should fail when torment is negative', () => {
      const result = BaseSurvivorSchema.safeParse({
        torment: -1
      })

      expect(result.success).toBe(false)
      if (!result.success)
        expect(result.error.issues).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              message: 'Torment cannot be negative.'
            })
          ])
        )
    })
  })
})

describe('SurvivorSchema', () => {
  describe('Valid Data', () => {
    it('should validate with minimal required fields', () => {
      const result = SurvivorSchema.safeParse({})

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.gender).toBe(Gender.FEMALE)
        expect(result.data.id).toBe(0)
        expect(result.data.settlementId).toBe(0)
        expect(result.data.huntXPRankUp).toEqual([])
      }
    })

    it('should validate with all gender values', () => {
      const genders = [Gender.MALE, Gender.FEMALE]

      genders.forEach((gender) => {
        const result = SurvivorSchema.safeParse({
          gender
        })

        expect(result.success).toBe(true)
        if (result.success) expect(result.data.gender).toBe(gender)
      })
    })

    it('should validate with all weapon types', () => {
      const weaponTypes = [
        WeaponType.AXE,
        WeaponType.BOW,
        WeaponType.CLEAVER,
        WeaponType.CLUB,
        WeaponType.DAGGER,
        WeaponType.FAN,
        WeaponType.FIST_AND_TOOTH,
        WeaponType.GRAND,
        WeaponType.KATANA,
        WeaponType.KATAR,
        WeaponType.LANTERN_ARMOR,
        WeaponType.SCYTHE,
        WeaponType.SHIELD,
        WeaponType.SPEAR,
        WeaponType.SWORD,
        WeaponType.WHIP
      ]

      weaponTypes.forEach((weaponType) => {
        const result = SurvivorSchema.safeParse({
          weaponProficiencyType: weaponType
        })

        expect(result.success).toBe(true)
        if (result.success)
          expect(result.data.weaponProficiencyType).toBe(weaponType)
      })
    })

    it('should validate with all philosophy values', () => {
      const philosophies = [
        Philosophy.AMBITIONISM,
        Philosophy.CHAMPION,
        Philosophy.COLLECTIVISM,
        Philosophy.DEADISM,
        Philosophy.DREAMISM,
        Philosophy.FACEISM,
        Philosophy.GOURMANDISM,
        Philosophy.HOMICIDALISM
      ]

      philosophies.forEach((philosophy) => {
        const result = SurvivorSchema.safeParse({
          philosophy
        })

        expect(result.success).toBe(true)
        if (result.success) expect(result.data.philosophy).toBe(philosophy)
      })
    })
  })

  describe('Edge Cases', () => {
    it('should handle maximum courage value', () => {
      const result = SurvivorSchema.safeParse({
        courage: 9
      })

      expect(result.success).toBe(true)
      if (result.success) expect(result.data.courage).toBe(9)
    })

    it('should handle maximum understanding value', () => {
      const result = SurvivorSchema.safeParse({
        understanding: 9
      })

      expect(result.success).toBe(true)
      if (result.success) expect(result.data.understanding).toBe(9)
    })

    it('should handle maximum weapon proficiency', () => {
      const result = SurvivorSchema.safeParse({
        weaponProficiency: 8
      })

      expect(result.success).toBe(true)
      if (result.success) expect(result.data.weaponProficiency).toBe(8)
    })

    it('should handle exactly 3 disorders', () => {
      const result = SurvivorSchema.safeParse({
        disorders: ['Disorder 1', 'Disorder 2', 'Disorder 3']
      })

      expect(result.success).toBe(true)
      if (result.success) expect(result.data.disorders).toHaveLength(3)
    })

    it('should handle retired survivor', () => {
      const result = SurvivorSchema.safeParse({
        retired: true
      })

      expect(result.success).toBe(true)
      if (result.success) expect(result.data.retired).toBe(true)
    })
  })
})
