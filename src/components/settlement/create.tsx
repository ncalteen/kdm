'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Form } from '@/components/ui/form'
import {
  DefaultCcNemesisVictories,
  DefaultCcQuarryVictories,
  EmptyTimeline,
  PotDKMilestones,
  PotLMilestones,
  PotStarsMilestones,
  PotSunMilestones,
  SquiresTimeline
} from '@/lib/common'
import { CampaignType, SurvivorType } from '@/lib/enums'
import { getLostSettlementCount, getNextSettlementId } from '@/lib/utils'
import { SettlementSchema } from '@/schemas/settlement'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { DepartingBonusesCard } from '../ui/settlement/departing-bonuses-card'
import { MilestonesCard } from '../ui/settlement/milestones-card'
import { NemesisCard } from '../ui/settlement/nemesis-card'
import { QuarryCard } from '../ui/settlement/quarry-card'
import { SettlementNameCard } from '../ui/settlement/settlement-name-card'
import { TimelineCard } from '../ui/settlement/timeline-card'

export function CreateSettlementForm() {
  const [defaultValues, setDefaultValues] = useState<
    Partial<z.infer<typeof SettlementSchema>>
  >({})

  const form = useForm<z.infer<typeof SettlementSchema>>({
    resolver: zodResolver(SettlementSchema),
    defaultValues
  })

  const campaignType = form.watch('campaignType')
  const survivorType = form.watch('survivorType')

  useEffect(() => {
    setDefaultValues({
      id: getNextSettlementId(),
      campaignType: CampaignType.PEOPLE_OF_THE_LANTERN, // TODO: Get from a dropdown
      survivorType: SurvivorType.ARC, // TODO: Get from a dropdown
      survivalLimit: 1,
      lostSettlements: getLostSettlementCount(),

      // Timeline
      // TODO: Pre-populate based on the campaign type?
      timeline:
        campaignType !== CampaignType.SQUIRES_OF_THE_CITADEL
          ? EmptyTimeline
          : SquiresTimeline,

      quarries: [],
      nemesis: [],
      milestones:
        campaignType === CampaignType.SQUIRES_OF_THE_CITADEL
          ? []
          : campaignType === CampaignType.PEOPLE_OF_THE_DREAM_KEEPER
            ? PotDKMilestones
            : campaignType === CampaignType.PEOPLE_OF_THE_LANTERN
              ? PotLMilestones
              : campaignType === CampaignType.PEOPLE_OF_THE_STARS
                ? PotStarsMilestones
                : campaignType === CampaignType.PEOPLE_OF_THE_SUN
                  ? PotSunMilestones
                  : [],
      departingBonuses: [],
      deathCount: 0,
      principles: [],
      patterns: [],
      innovations:
        campaignType === CampaignType.PEOPLE_OF_THE_LANTERN
          ? ['Language']
          : campaignType === CampaignType.PEOPLE_OF_THE_STARS
            ? ['Dragon Speech']
            : campaignType === CampaignType.PEOPLE_OF_THE_SUN
              ? ['Sun Language']
              : [],
      locations: [], // TODO: Pre-populate based on the campaign type?
      resources: [],
      gear: [],
      notes: undefined,

      // Arc Survivor Settlements
      ccQuarryVictories:
        survivorType !== SurvivorType.ARC
          ? undefined
          : DefaultCcQuarryVictories,
      ccNemesisVictories:
        survivorType !== SurvivorType.ARC
          ? undefined
          : DefaultCcNemesisVictories,
      ccRewards: survivorType !== SurvivorType.ARC ? undefined : [], // TODO: Pre-populate based on the campaign type?
      philosophies: survivorType !== SurvivorType.ARC ? undefined : [],
      knowledges: survivorType !== SurvivorType.ARC ? undefined : [],

      /**
       * People of the Lantern and People of the Sun
       */
      lanternResearchLevel:
        campaignType === CampaignType.PEOPLE_OF_THE_LANTERN ||
        campaignType === CampaignType.PEOPLE_OF_THE_SUN
          ? 0
          : undefined,
      monsterVolumes:
        campaignType === CampaignType.PEOPLE_OF_THE_LANTERN ||
        campaignType === CampaignType.PEOPLE_OF_THE_SUN
          ? []
          : undefined,

      /**
       * Squires of the Citadel
       */
      suspicions:
        campaignType === CampaignType.SQUIRES_OF_THE_CITADEL
          ? [
              {
                name: 'Cain',
                level1: false,
                level2: false,
                level3: false,
                level4: false
              }
            ]
          : undefined
    })
  }, [campaignType, survivorType])

  // Define a submit handler with the correct schema type
  function onSubmit(values: z.infer<typeof SettlementSchema>) {
    // Do something with the form values.
    console.log(values)
    toast.success('Settlement created successfully!')
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <Form {...form}>
        <Card>
          <CardHeader />
          <CardContent>
            <SettlementNameCard {...form} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
              <TimelineCard {...form} />
              <div className="space-y-4">
                <QuarryCard {...form} />
                <NemesisCard {...form} />
                <MilestonesCard {...form} />
                <DepartingBonusesCard {...form} />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit">Create Settlement</Button>
          </CardFooter>
        </Card>
      </Form>
    </form>
  )
}
