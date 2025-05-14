'use client'

import { SelectSettlement } from '@/components/menu/select-settlement'
import { AttributeCard } from '@/components/survivor/attributes/attribute-card'
import { CombatCard } from '@/components/survivor/combat/combat-card'
import { CourageUnderstandingCard } from '@/components/survivor/courage-understanding/courage-understanding-card'
import { DisordersCard } from '@/components/survivor/disorders/disorders-card'
import { FightingArtsCard } from '@/components/survivor/fighting-arts/fighting-arts-card'
import { HuntXPCard } from '@/components/survivor/hunt-xp/hunt-xp-card'
import { NameGenderCard } from '@/components/survivor/name-gender/name-gender-card'
import { SanityCard } from '@/components/survivor/sanity/sanity-card'
import { SurvivalCard } from '@/components/survivor/survival/survival-card'
import { WeaponProficiencyCard } from '@/components/survivor/weapon-proficiency/weapon-proficiency-card'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Form } from '@/components/ui/form'
import { SurvivorType } from '@/lib/enums'
import {
  bornWithUnderstanding,
  canDash,
  canEncourage,
  canEndure,
  canFistPump,
  canSurge,
  getNextSurvivorId,
  getSettlement
} from '@/lib/utils'
import { SettlementSchema } from '@/schemas/settlement'
import { SurvivorSchema } from '@/schemas/survivor'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

/**
 * Creat Survivor Form Component
 *
 * This component is used to create a new survivor in the game.
 */
export function CreateSurvivorForm() {
  const [defaultValues, setDefaultValues] = useState<
    Partial<z.infer<typeof SurvivorSchema>>
  >({
    // Initialize the static defaults.
    abilitiesAndImpairments: [],
    accuracy: 0,
    canDodge: true,
    canSpendSurvival: true,
    canUseFightingArtsOrKnowledges: true,
    courage: 0,
    dead: false,
    disorders: [],
    evasion: 0,
    fightingArts: [],
    hasAnalyze: false,
    hasExplore: false,
    hasMatchmaker: false,
    hasPrepared: false,
    hasStalwart: false,
    hasTinker: false,
    huntXP: 0,
    huntXPRankUp: [],
    insanity: 0,
    luck: 0,
    movement: 5,
    nextDeparture: undefined,
    oncePerLifetime: [],
    rerollUsed: false,
    retired: false,
    secretFightingArts: [],
    skipNextHunt: false,
    speed: 0,
    strength: 0,
    survival: 0,
    weaponProficiency: 0,
    weaponProficiencyType: undefined,

    /*
     * Hunt/Showdown Attributes
     */
    armArmor: 0,
    armLightDamage: false,
    armHeavyDamage: false,
    bodyArmor: 0,
    bodyLightDamage: false,
    bodyHeavyDamage: false,
    brainLightDamage: false,
    headArmor: 0,
    headHeavyDamage: false,
    legArmor: 0,
    legLightDamage: false,
    legHeavyDamage: false,
    waistArmor: 0,
    waistLightDamage: false,
    waistHeavyDamage: false,

    /*
     * Severe Injuries
     */

    armDismemberedLeft: false,
    armDismemberedRight: false,
    armRupturedMuscle: false,
    armContracture: 0,
    armBrokenLeft: false,
    armBrokenRight: false,
    bodyGapingChestWound: 0,
    bodyDestroyedBack: false,
    bodyBrokenRib: 0,
    headIntracranialHemorrhage: false,
    headDeaf: false,
    headBlindLeft: false,
    headBlindRight: false,
    headShatteredJaw: false,
    legDismemberedLeft: false,
    legDismemberedRight: false,
    legHamstrung: false,
    legBrokenLeft: false,
    legBrokenRight: false,
    waistIntestinalProlapse: false,
    waistWarpedPelvis: 0,
    waistDestroyedGenitals: false,
    waistBrokenHip: false,

    /*
     * Arc Survivors
     */

    knowledge1: undefined,
    knowledge1ObservationRank: undefined,
    knowledge1Rules: undefined,
    knowledge1ObservationConditions: undefined,
    knowledge1RankUp: undefined,
    knowledge2: undefined,
    knowledge2ObservationRank: undefined,
    knowledge2Rules: undefined,
    knowledge2ObservationConditions: undefined,
    knowledge2RankUp: undefined,
    lumi: 0,
    neurosis: undefined,
    philosophy: undefined,
    systemicPressure: 0,
    tenetKnowledge: undefined,
    tenetKnowledgeObservationRank: 0,
    tenetKnowledgeRules: undefined,
    tenetKnowledgeObservationConditions: undefined,
    tenetKnowledgeRankUp: undefined,
    torment: 0,

    /*
     * People of the Stars Survivors
     */

    hasAbsoluteReaper: false,
    hasAbsoluteRust: false,
    hasAbsoluteStorm: false,
    hasAbsoluteWitch: false,
    hasGamblerRust: false,
    hasGamblerReaper: false,
    hasGamblerStorm: false,
    hasGamblerWitch: false,
    hasSculptorReaper: false,
    hasSculptorRust: false,
    hasSculptorStorm: false,
    hasSculptorWitch: false,
    hasGoblinReaper: false,
    hasGoblinRust: false,
    hasGoblinStorm: false,
    hasGoblinWitch: false
  })

  const searchParams = useSearchParams()
  const settlementIdParam = searchParams.get('settlementId')

  // Initialize selectedSettlement with the URL param if available
  const [selectedSettlement, setSelectedSettlement] = useState<string>(
    settlementIdParam || ''
  )
  const [settlement, setSettlement] = useState<
    z.infer<typeof SettlementSchema> | undefined
  >()

  useEffect(() => {
    if (selectedSettlement) {
      const fetchedSettlement = getSettlement(parseInt(selectedSettlement, 10))
      setSettlement(fetchedSettlement)

      if (fetchedSettlement) updateDefaultValues(fetchedSettlement)
    }
  }, [selectedSettlement])

  /**
   * Updates the form's default values based on the selected settlement
   *
   * @param settlement Selected Settlement
   */
  const updateDefaultValues = (
    settlement: z.infer<typeof SettlementSchema>
  ) => {
    setDefaultValues({
      canEncourage: canEncourage(),
      canSurge: canSurge(),
      canDash: canDash(),
      canFistPump: canFistPump(),
      huntXPRankUp:
        settlement.survivorType !== SurvivorType.ARC
          ? [1, 5, 9, 14] // Core
          : [1], // Arc
      id: getNextSurvivorId(),
      settlementId: settlement.id,
      understanding: bornWithUnderstanding() ? 1 : 0,

      /*
       * Arc Survivors
       */

      canEndure: canEndure()
    })
  }

  const form = useForm<z.infer<typeof SurvivorSchema>>({
    resolver: zodResolver(SurvivorSchema),
    defaultValues
  })

  // Reset form values when defaultValues change (e.g., when settlement changes)
  useEffect(() => form.reset(defaultValues), [defaultValues, form])

  /**
   * Handles form submission
   *
   * @param values Form Values
   */
  function onSubmit(values: z.infer<typeof SurvivorSchema>) {
    // Do something with the form values.
    console.log(values)
    console.log('Settlement:', settlement)

    toast.success(
      'A lantern approaches. A new survivor emerges from the darkness.'
    )
  }

  return (
    <>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Form {...form}>
          <Card className="mb-2">
            <CardContent className="w-full pt-6 pb-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="font-bold text-l whitespace-nowrap">
                    Settlement
                  </div>
                  <SelectSettlement
                    onChange={(value) => setSelectedSettlement(value)}
                    value={selectedSettlement}
                  />
                </div>
                {selectedSettlement && (
                  <Button type="submit">Create Survivor</Button>
                )}
              </div>
              {selectedSettlement && <hr className="mt-2 mb-2" />}
              {selectedSettlement && (
                <>
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                      <NameGenderCard {...form} />
                      <SurvivalCard {...form} />
                      <AttributeCard {...form} />
                      <SanityCard {...form} />
                      <CombatCard {...form} />
                    </div>
                    <div className="flex-1">
                      <HuntXPCard {...form} />
                      <WeaponProficiencyCard {...form} />
                      <CourageUnderstandingCard {...form} />
                      <FightingArtsCard {...form} />
                      <DisordersCard {...form} />
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </Form>
      </form>
    </>
  )
}
