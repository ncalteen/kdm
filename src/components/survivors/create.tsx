'use client'

import { Button } from '@/components/ui/button'

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Form } from '@/components/ui/form'
import { CampaignType } from '@/lib/enums'
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
import { SurvivorSchema } from '@/schemas/survivor'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { AttributeCard } from '../ui/survivors/attribute-card'
import { NameGenderCard } from '../ui/survivors/name-gender-card'
import { SanityCard } from '../ui/survivors/sanity-card'
import { SurvivalCard } from '../ui/survivors/survival-card'

export function CreateSurvivorForm() {
  const [defaultValues, setDefaultValues] = useState<
    Partial<z.infer<typeof SurvivorSchema>>
  >({
    // Hunt XP
    huntXP: 0,

    // Survival
    survival: 1, // Survivor starts with 1 when named
    canSpendSurvival: true,
    canDodge: true,
    systemicPressure: 0, // Arc

    // Attributes
    movement: 5,
    accuracy: 0,
    strength: 0,
    evasion: 0,
    luck: 0,
    speed: 0,
    lumi: 0, // Arc

    // Sanity
    insanity: 0,
    brainLightDamage: false,
    torment: 0, // Arc

    // Head
    headArmor: 0,
    headIntracranialHemorrhage: false,
    headDeaf: false,
    headBlindLeft: false,
    headBlindRight: false,
    headShatteredJaw: false,
    headHeavyDamage: false,

    // Arms
    armArmor: 0,
    armDismemberedLeft: false,
    armDismemberedRight: false,
    armRupturedMuscle: false,
    armContracture: 0,
    armBrokenLeft: false,
    armBrokenRight: false,
    armLightDamage: false,
    armHeavyDamage: false,

    // Body
    bodyArmor: 0,
    bodyGapingChestWound: 0,
    bodyDestroyedBack: false,
    bodyBrokenRib: 0,
    bodyLightDamage: false,
    bodyHeavyDamage: false,

    // Waist
    waistArmor: 0,
    waistIntestinalProlapse: false,
    waistWarpedPelvis: 0,
    waistDestroyedGenitals: false,
    waistBrokenHip: false,
    waistLightDamage: false,
    waistHeavyDamage: false,

    // Legs
    legArmor: 0,
    legDismemberedLeft: false,
    legDismemberedRight: false,
    legHamstrung: false,
    legBrokenLeft: false,
    legBrokenRight: false,
    legLightDamage: false,
    legHeavyDamage: false,

    // Weapon Proficiency
    weaponProficiencyType: undefined,
    weaponProficiency: 0,

    // Courage
    courage: 0,
    hasStalwart: false,
    hasPrepared: false,
    hasMatchmaker: false,

    // Understanding
    hasAnalyze: false,
    hasExplore: false,
    hasTinker: false,

    // Next Departure
    nextDeparture: undefined,

    // Fighting Arts
    canUseFightingArtsOrKnowledges: true,
    fightingArts: [],
    secretFightingArts: [],

    // Disorders
    disorders: [],

    // Abilities and Impairments
    abilitiesAndImpairments: [],
    skipNextHunt: false,

    // Once Per Lifetime
    oncePerLifetime: [],
    rerollUsed: false,

    /**
     * Arc Survivors
     */

    // Philosophy
    philosophy: undefined,
    neurosis: undefined,
    tenetKnowledge: undefined,
    tenetKnowledgeObservationRank: 0,
    tenetKnowledgeRules: undefined,
    tenetKnowledgeObservationConditions: undefined,
    tenetKnowledgeRankUp: undefined,

    // Knowledge
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

    /**
     * People of the Stars Survivors
     */

    // Gambler
    hasGamblerWitch: false,
    hasGamblerRust: false,
    hasGamblerStorm: false,
    hasGamblerReaper: false,

    // Absolute
    hasAbsoluteWitch: false,
    hasAbsoluteRust: false,
    hasAbsoluteStorm: false,
    hasAbsoluteReaper: false,

    // Sculptor
    hasSculptorWitch: false,
    hasSculptorRust: false,
    hasSculptorStorm: false,
    hasSculptorReaper: false,

    // Goblin
    hasGoblinWitch: false,
    hasGoblinRust: false,
    hasGoblinStorm: false,
    hasGoblinReaper: false
  })

  useEffect(() => {
    // Get the current settlement from localStorage.
    // TODO: The settlement ID is in the URL path (/kdm/settlement/[settlementId]).
    const settlement = getSettlement()

    console.log('Settlement:', settlement)

    if (!settlement) {
      // TODO: If no settlement is found, show an error message and block the
      //       user from creating a survivor.
      toast.error('No settlement found. Did you create one?')
    }

    setDefaultValues({
      // Main
      id: getNextSurvivorId(),

      // Hunt XP
      huntXPRankUp: [
        CampaignType.PEOPLE_OF_THE_LANTERN,
        CampaignType.PEOPLE_OF_THE_STARS
      ].includes(settlement.campaignType)
        ? [1, 5, 9, 14] // Core and PotStars
        : [], // Arc

      // Survival
      canEncourage: canEncourage(),
      canSurge: canSurge(),
      canDash: canDash(),
      canFistPump: canFistPump(),
      canEndure: canEndure(), // Arc

      // Understanding
      understanding: bornWithUnderstanding() ? 1 : 0
    })
  }, [])

  const form = useForm<z.infer<typeof SurvivorSchema>>({
    resolver: zodResolver(SurvivorSchema),
    defaultValues
  })

  // Define a submit handler with the correct schema type
  function onSubmit(values: z.infer<typeof SurvivorSchema>) {
    // Do something with the form values.
    console.log(values)
    toast.success('Survivor created successfully!')
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <Form {...form}>
        <Card>
          <CardHeader />
          <CardContent>
            <NameGenderCard {...form} />
            <SurvivalCard {...form} />
            <AttributeCard {...form} />
            <SanityCard {...form} />
          </CardContent>
          <CardFooter>
            <Button type="submit">Submit</Button>
          </CardFooter>
        </Card>
      </Form>
    </form>
  )
}
