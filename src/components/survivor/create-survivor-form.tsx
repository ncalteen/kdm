'use client'

import { SelectSettlement } from '@/components/menu/select-settlement'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Gender, SurvivorType } from '@/lib/enums'
import {
  bornWithUnderstanding,
  canDash,
  canEncourage,
  canEndure,
  canFistPump,
  canSurge,
  getCampaign,
  getNextSurvivorId,
  getSettlement
} from '@/lib/utils'
import { SettlementSchema } from '@/schemas/settlement'
import { SurvivorSchema } from '@/schemas/survivor'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter, useSearchParams } from 'next/navigation'
import { ReactElement, useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

/**
 * Create Survivor Form Component
 *
 * This component is responsible for rendering the form that allows users to
 * name and create a new survivor. It includes fields for selecting the
 * settlement, survivor name, and gender.
 *
 * The chosen settlement will determine the available options and defaults.
 *
 * @returns Create Survivor Form
 */
export function CreateSurvivorForm(): ReactElement {
  const router = useRouter()

  // If present, get the settlementId from the URL.
  const searchParams = useSearchParams()
  const settlementIdParam = searchParams.get('settlementId')

  // Basic survivor defaults
  const [defaultValues, setDefaultValues] = useState<
    Partial<z.infer<typeof SurvivorSchema>>
  >({})

  // Initialize settlementId with the URL param if available
  const [settlementId, setSettlementId] = useState<string>(
    settlementIdParam || ''
  )

  /**
   * Updates the survivor's default values based on the selected settlement
   *
   * @param settlement Selected Settlement
   */
  const updateDefaultValues = useCallback(
    (settlement: z.infer<typeof SettlementSchema>) => {
      setDefaultValues({
        // Settlement-specific attributes.
        canDash: canDash(),
        canFistPump: canFistPump(),
        canEncourage: canEncourage(),
        canEndure: canEndure(),
        canSurge: canSurge(),
        huntXPRankUp:
          settlement.survivorType !== SurvivorType.ARC
            ? [1, 5, 9, 14] // Core
            : [1], // Arc
        id: getNextSurvivorId(),
        settlementId: settlement.id,
        understanding: bornWithUnderstanding() ? 1 : 0,

        // Static defaults.
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
        insanity: 0,
        luck: 0,
        movement: 5,
        oncePerLifetime: [],
        rerollUsed: false,
        retired: false,
        secretFightingArts: [],
        skipNextHunt: false,
        speed: 0,
        strength: 0,
        survival: 1, // Named survivors start with 1 survival
        weaponProficiency: 0,
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
        armBrokenLeft: false,
        armBrokenRight: false,
        armContracture: 0,
        armDismemberedLeft: false,
        armDismemberedRight: false,
        armRupturedMuscle: false,
        bodyBrokenRib: 0,
        bodyDestroyedBack: false,
        bodyGapingChestWound: 0,
        headBlindLeft: false,
        headBlindRight: false,
        headDeaf: false,
        headIntracranialHemorrhage: false,
        headShatteredJaw: false,
        legBrokenLeft: false,
        legBrokenRight: false,
        legDismemberedLeft: false,
        legDismemberedRight: false,
        legHamstrung: false,
        waistBrokenHip: false,
        waistDestroyedGenitals: false,
        waistIntestinalProlapse: false,
        waistWarpedPelvis: 0,
        lumi: 0,
        systemicPressure: 0,
        torment: 0,
        hasAbsoluteReaper: false,
        hasAbsoluteRust: false,
        hasAbsoluteStorm: false,
        hasAbsoluteWitch: false,
        hasGamblerReaper: false,
        hasGamblerRust: false,
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
    },
    [
      // No dependencies on state values that cause re-renders
    ]
  )

  useEffect(() => {
    if (settlementId) {
      const settlement = getSettlement(parseInt(settlementId, 10))
      if (settlement) updateDefaultValues(settlement)
    }
  }, [settlementId, updateDefaultValues])

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
    try {
      // Add required fields that might be missing
      const completeValues: z.infer<typeof SurvivorSchema> = {
        ...values,
        // Ensure all required fields are populated
        canDodge: values.canDodge ?? true,
        canSpendSurvival: values.canSpendSurvival ?? true,
        canUseFightingArtsOrKnowledges:
          values.canUseFightingArtsOrKnowledges ?? true,
        hasAnalyze: values.hasAnalyze ?? false,
        hasExplore: values.hasExplore ?? false,
        hasMatchmaker: values.hasMatchmaker ?? false,
        hasPrepared: values.hasPrepared ?? false,
        hasStalwart: values.hasStalwart ?? false,
        hasTinker: values.hasTinker ?? false,
        rerollUsed: values.rerollUsed ?? false,
        retired: values.retired ?? false,
        secretFightingArts: values.secretFightingArts ?? [],
        skipNextHunt: values.skipNextHunt ?? false,
        weaponProficiency: values.weaponProficiency ?? 0,
        oncePerLifetime: values.oncePerLifetime ?? [],

        // Hunt/Showdown Attributes
        armArmor: values.armArmor ?? 0,
        armLightDamage: values.armLightDamage ?? false,
        armHeavyDamage: values.armHeavyDamage ?? false,
        bodyArmor: values.bodyArmor ?? 0,
        bodyLightDamage: values.bodyLightDamage ?? false,
        bodyHeavyDamage: values.bodyHeavyDamage ?? false,
        brainLightDamage: values.brainLightDamage ?? false,
        headArmor: values.headArmor ?? 0,
        headHeavyDamage: values.headHeavyDamage ?? false,
        legArmor: values.legArmor ?? 0,
        legLightDamage: values.legLightDamage ?? false,
        legHeavyDamage: values.legHeavyDamage ?? false,
        waistArmor: values.waistArmor ?? 0,
        waistLightDamage: values.waistLightDamage ?? false,
        waistHeavyDamage: values.waistHeavyDamage ?? false,

        // Severe Injuries
        armDismemberedLeft: values.armDismemberedLeft ?? false,
        armDismemberedRight: values.armDismemberedRight ?? false,
        armRupturedMuscle: values.armRupturedMuscle ?? false,
        armContracture: values.armContracture ?? 0,
        armBrokenLeft: values.armBrokenLeft ?? false,
        armBrokenRight: values.armBrokenRight ?? false,
        bodyGapingChestWound: values.bodyGapingChestWound ?? 0,
        bodyDestroyedBack: values.bodyDestroyedBack ?? false,
        bodyBrokenRib: values.bodyBrokenRib ?? 0,
        headIntracranialHemorrhage: values.headIntracranialHemorrhage ?? false,
        headDeaf: values.headDeaf ?? false,
        headBlindLeft: values.headBlindLeft ?? false,
        headBlindRight: values.headBlindRight ?? false,
        headShatteredJaw: values.headShatteredJaw ?? false,
        legDismemberedLeft: values.legDismemberedLeft ?? false,
        legDismemberedRight: values.legDismemberedRight ?? false,
        legHamstrung: values.legHamstrung ?? false,
        legBrokenLeft: values.legBrokenLeft ?? false,
        legBrokenRight: values.legBrokenRight ?? false,
        waistIntestinalProlapse: values.waistIntestinalProlapse ?? false,
        waistWarpedPelvis: values.waistWarpedPelvis ?? 0,
        waistDestroyedGenitals: values.waistDestroyedGenitals ?? false,
        waistBrokenHip: values.waistBrokenHip ?? false,

        // Star-related
        hasAbsoluteReaper: values.hasAbsoluteReaper ?? false,
        hasAbsoluteRust: values.hasAbsoluteRust ?? false,
        hasAbsoluteStorm: values.hasAbsoluteStorm ?? false,
        hasAbsoluteWitch: values.hasAbsoluteWitch ?? false,
        hasGamblerReaper: values.hasGamblerReaper ?? false,
        hasGamblerRust: values.hasGamblerRust ?? false,
        hasGamblerStorm: values.hasGamblerStorm ?? false,
        hasGamblerWitch: values.hasGamblerWitch ?? false,
        hasSculptorReaper: values.hasSculptorReaper ?? false,
        hasSculptorRust: values.hasSculptorRust ?? false,
        hasSculptorStorm: values.hasSculptorStorm ?? false,
        hasSculptorWitch: values.hasSculptorWitch ?? false,
        hasGoblinReaper: values.hasGoblinReaper ?? false,
        hasGoblinRust: values.hasGoblinRust ?? false,
        hasGoblinStorm: values.hasGoblinStorm ?? false,
        hasGoblinWitch: values.hasGoblinWitch ?? false
      }

      // Get existing campaign
      const campaign = getCampaign()

      // Add the new survivor
      campaign.survivors.push(completeValues)

      // Save the updated campaign to localStorage
      localStorage.setItem('campaign', JSON.stringify(campaign))

      // Show success message
      toast.success(
        'A lantern approaches. A new survivor emerges from the darkness.'
      )

      // Redirect to the survivor page
      router.push(
        `/survivor?settlementId=${completeValues.settlementId}?survivorId=${completeValues.id}`
      )
    } catch (error) {
      console.error('Survivor Create Error:', error)
      toast.error('The darkness refuses your offering. Please try again.')
    }
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit, () => {
        toast.error(
          'The chronicles remain incomplete - fill in the missing fragments.'
        )
      })}
      className="space-y-6">
      <Form {...form}>
        <Card className="max-w-[800px] min-w-[560px] mx-auto">
          <CardContent className="w-full pt-6 pb-6">
            {/* Settlement */}
            <Card className="mb-2">
              <CardContent className="pt-2 pb-2">
                <div className="flex flex-row justify-between items-center">
                  <FormField
                    control={form.control}
                    name="settlementId"
                    render={() => (
                      <FormItem className="w-full">
                        <div className="flex items-center justify-between">
                          <FormLabel className="text-left pr-2">
                            Settlement
                          </FormLabel>
                          <FormControl>
                            <SelectSettlement
                              onChange={(value) => setSettlementId(value)}
                              value={settlementId}
                            />
                          </FormControl>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Survivor Name */}
            <Card className="mb-2">
              <CardContent className="pt-2 pb-2">
                <div className="flex flex-col justify-between">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <div className="flex items-center justify-between">
                          <FormLabel className="text-left pr-2">Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Survivor name..."
                              className="w-[75%]"
                              {...field}
                              value={field.value ?? ''}
                              onChange={(e) => {
                                form.setValue(field.name, e.target.value)
                              }}
                            />
                          </FormControl>
                        </div>
                      </FormItem>
                    )}
                  />

                  <hr className="mt-2" />

                  <FormDescription className="mt-2 text-xs">
                    When you name your survivor, gain +1{' '}
                    <strong>survival</strong>.
                  </FormDescription>
                </div>
              </CardContent>
            </Card>

            {/* Survivor Gender */}
            <Card className="mb-2">
              <CardContent className="pt-2 pb-2">
                <div className="flex flex-col justify-between">
                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <div className="flex items-center justify-between">
                          <FormLabel className="text-left pr-2 w-[25%]">
                            Gender
                          </FormLabel>
                          <div className="w-[75%] flex items-center space-x-1 justify-start">
                            <div className="flex items-center space-x-1">
                              <label
                                htmlFor="male-checkbox"
                                className="text-sm font-medium leading-none cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                M
                              </label>
                              <Checkbox
                                id="male-checkbox"
                                checked={field.value === Gender.MALE}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    form.setValue('gender', Gender.MALE)
                                  }
                                }}
                              />
                            </div>
                            <div className="flex items-center space-x-1">
                              <label
                                htmlFor="female-checkbox"
                                className="text-sm font-medium leading-none cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                F
                              </label>
                              <Checkbox
                                id="female-checkbox"
                                checked={field.value === Gender.FEMALE}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    form.setValue('gender', Gender.FEMALE)
                                  }
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </Form>

      <Button type="submit" className="mx-auto block">
        Create Survivor
      </Button>
    </form>
  )
}
