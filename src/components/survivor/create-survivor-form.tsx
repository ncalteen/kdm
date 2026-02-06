'use client'

import { SelectWanderer } from '@/components/menu/select-wanderer'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Gender, SurvivorType } from '@/lib/enums'
import { ERROR_MESSAGE, SURVIVOR_CREATED_MESSAGE } from '@/lib/messages'
import {
  bornWithUnderstanding,
  canDash,
  canEncourage,
  canEndure,
  canFistPump,
  canSurge,
  getNextSurvivorId
} from '@/lib/utils'
import { AenasState } from '@/lib/wanderers/aenas'
import { Campaign } from '@/schemas/campaign'
import { Settlement } from '@/schemas/settlement'
import {
  BaseSurvivorSchema,
  Survivor,
  SurvivorSchema
} from '@/schemas/survivor'
import { Wanderer } from '@/schemas/wanderer'
import { zodResolver } from '@hookform/resolvers/zod'
import { ReactElement, useEffect, useMemo, useState } from 'react'
import { Resolver, useForm } from 'react-hook-form'
import { toast } from 'sonner'

/**
 * Create Survivor Form Properties
 */
interface CreateSurvivorFormProps {
  /** Campaign */
  campaign: Campaign
  /** Save Selected Survivor */
  saveSelectedSurvivor: (survivor: Survivor, successMsg?: string) => void
  /** Selected Settlement */
  selectedSettlement: Settlement | null
  /** Set Is Creating New Survivor */
  setIsCreatingNewSurvivor: (isCreating: boolean) => void
  /** Set Selected Survivor */
  setSelectedSurvivor: (survivor: Survivor) => void
  /** Update Campaign */
  updateCampaign: (campaign: Campaign) => void
}

/**
 * Create Survivor Form Component
 *
 * This component is responsible for rendering the form that allows users to
 * name and create a new survivor. It includes fields for selecting the
 * settlement, survivor name, and gender.
 *
 * The chosen settlement will determine the available options and defaults.
 *
 * @param props Create Survivor Form Properties
 * @returns Create Survivor Form
 */
export function CreateSurvivorForm({
  campaign,
  saveSelectedSurvivor,
  selectedSettlement,
  setIsCreatingNewSurvivor,
  setSelectedSurvivor,
  updateCampaign
}: CreateSurvivorFormProps): ReactElement {
  const [activeTab, setActiveTab] = useState<'custom' | 'wanderer'>('custom')
  const [selectedWanderer, setSelectedWanderer] = useState<Wanderer | null>(
    null
  )

  const availableWanderers = useMemo(
    () => selectedSettlement?.wanderers ?? [],
    [selectedSettlement?.wanderers]
  )

  const form = useForm<Survivor>({
    // Need to set the type here directly, because the schema includes a lot of
    // fields with default values that are not resolved in the type.
    resolver: zodResolver(SurvivorSchema) as Resolver<Survivor>,
    defaultValues: BaseSurvivorSchema.parse({})
  })

  // Set the form values when the component mounts
  useEffect(() => {
    console.debug('[CreateSurvivorForm] Initializing Form Values')

    if (!selectedSettlement?.id) return

    const updatedValues = {
      settlementId: selectedSettlement.id,
      canDash: canDash(campaign, selectedSettlement.id),
      canFistPump: canFistPump(campaign, selectedSettlement.id),
      canEncourage: canEncourage(campaign, selectedSettlement.id),
      canEndure: canEndure(campaign, selectedSettlement.id),
      canSurge: canSurge(campaign, selectedSettlement.id),
      huntXPRankUp:
        selectedSettlement?.survivorType !== SurvivorType.ARC
          ? [2, 6, 10, 15] // Core
          : [2], // Arc
      id: getNextSurvivorId(campaign),
      understanding: bornWithUnderstanding(campaign, selectedSettlement.id)
        ? 1
        : 0
    }

    // Reset form with updated values while preserving user-entered fields
    form.reset({
      ...form.getValues(),
      ...updatedValues
    })
  }, [campaign, form, selectedSettlement])

  /**
   * Handle Tab Change
   *
   * Resets the form when switching tabs.
   *
   * @param value Tab value
   */
  function handleTabChange(value: string) {
    const tab = value as 'custom' | 'wanderer'
    setActiveTab(tab)

    // Reset form when switching to custom tab
    if (tab === 'custom' && selectedSettlement?.id) {
      setSelectedWanderer(null)
      form.reset({
        ...BaseSurvivorSchema.parse({}),
        settlementId: selectedSettlement.id,
        canDash: canDash(campaign, selectedSettlement.id),
        canFistPump: canFistPump(campaign, selectedSettlement.id),
        canEncourage: canEncourage(campaign, selectedSettlement.id),
        canEndure: canEndure(campaign, selectedSettlement.id),
        canSurge: canSurge(campaign, selectedSettlement.id),
        huntXPRankUp:
          selectedSettlement.survivorType !== SurvivorType.ARC
            ? [2, 6, 10, 15]
            : [2],
        id: getNextSurvivorId(campaign),
        understanding: bornWithUnderstanding(campaign, selectedSettlement.id)
          ? 1
          : 0
      })
    }
  }

  /**
   * Handle Wanderer Selection
   *
   * When a wanderer is selected, their data is used to populate the form.
   *
   * @param wanderer Selected Wanderer
   */
  function handleWandererSelect(wanderer: Wanderer | null) {
    if (!wanderer || !selectedSettlement?.id) return

    setSelectedWanderer(wanderer)

    const newSurvivor = {
      ...BaseSurvivorSchema.parse({}),
      settlementId: selectedSettlement.id,
      id: getNextSurvivorId(campaign),
      canDash: canDash(campaign, selectedSettlement.id),
      canFistPump: canFistPump(campaign, selectedSettlement.id),
      canEncourage: canEncourage(campaign, selectedSettlement.id),
      canEndure: canEndure(campaign, selectedSettlement.id),
      canSurge: canSurge(campaign, selectedSettlement.id),

      // Wanderer-specific data
      abilitiesAndImpairments: wanderer.abilitiesAndImpairments,
      accuracy: wanderer.accuracy,
      courage: wanderer.courage,
      disposition: wanderer.disposition,
      evasion: wanderer.evasion,
      fightingArts: wanderer.fightingArts,
      gender: wanderer.gender,
      huntXP: wanderer.huntXP,
      huntXPRankUp: wanderer.huntXPRankUp,
      insanity: wanderer.insanity,
      luck: wanderer.luck,
      movement: wanderer.movement,
      name: wanderer.name,
      speed: wanderer.speed,
      strength: wanderer.strength,
      survival: wanderer.survival,
      understanding: wanderer.understanding,
      wanderer: true
    }

    // If this is an Arc settlement, set Arc-specific fields
    if (selectedSettlement?.survivorType === SurvivorType.ARC) {
      newSurvivor.lumi = wanderer.lumi
      newSurvivor.systemicPressure = wanderer.systemicPressure
      newSurvivor.torment = wanderer.torment
    }

    // If the wanderer has a permanent injury, set it (currently only Luck).
    // TODO: Expand this to handle other permanent injuries as they are added.
    for (const injury of wanderer.permanentInjuries ?? [])
      if (injury === 'headBlind') newSurvivor.headBlind = 1

    // If the wanderer is Goth and the settlement does **not** have the
    // Cannibalize death principle, gain an additional disposition.
    if (
      wanderer.name === 'Goth' &&
      !selectedSettlement.principles?.some(
        (p) =>
          (p.option1Name === 'Cannibalize' && p.option1Selected) ||
          (p.option2Name === 'Cannibalize' && p.option2Selected)
      )
    )
      newSurvivor.disposition = (newSurvivor.disposition ?? 0) + 1

    // If the wanderer is Aenas, set her initial state (default to Hungry)
    if (wanderer.name === 'Aenas') newSurvivor.state = AenasState.HUNGRY

    // Populate form with wanderer data
    form.reset(newSurvivor)
  }

  /**
   * Handle Form Submission
   *
   * @param values Form Values
   */
  function onSubmit(values: Survivor) {
    if (selectedWanderer && selectedSettlement) {
      // When creating from a wanderer, we need to atomically update both the
      // survivor and settlement to avoid race conditions with stale state.
      const updatedSettlement: Settlement = {
        ...selectedSettlement,
        // Remove the wanderer from the settlement's available wanderers
        wanderers: selectedSettlement.wanderers.filter(
          (w) => w.name !== selectedWanderer.name
        ),
        // Add the wanderer's rare gear to the settlement's gear
        gear: [...selectedSettlement.gear, ...(selectedWanderer.rareGear ?? [])]
      }

      // Perform atomic update of campaign with both survivor and settlement changes
      updateCampaign({
        ...campaign,
        survivors: [...campaign.survivors, values],
        settlements: campaign.settlements.map((s) =>
          s.id === selectedSettlement.id ? updatedSettlement : s
        )
      })

      toast.success(SURVIVOR_CREATED_MESSAGE())
    } else {
      // For custom survivors, use the standard save function
      saveSelectedSurvivor(values, SURVIVOR_CREATED_MESSAGE())
    }

    setSelectedSurvivor(values)
    setIsCreatingNewSurvivor(false)
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit, () => {
        toast.error(ERROR_MESSAGE())
      })}
      className="py-3 space-y-6">
      <Form {...form}>
        <Card className="max-w-[500px] mx-auto">
          <CardContent className="w-full space-y-2">
            {availableWanderers.length > 0 ? (
              <Tabs
                value={activeTab}
                onValueChange={handleTabChange}
                className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="custom">New Survivor</TabsTrigger>
                  <TabsTrigger value="wanderer">Wanderer</TabsTrigger>
                </TabsList>

                <TabsContent value="custom" className="space-y-2 mt-4">
                  {/* Survivor Name */}
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center justify-between">
                          <FormLabel className="text-left whitespace-nowrap min-w-[120px]">
                            Name
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Survivor name..."
                              {...field}
                              value={field.value ?? ''}
                              onChange={(e) => {
                                form.setValue('name', e.target.value)
                              }}
                            />
                          </FormControl>
                        </div>
                      </FormItem>
                    )}
                  />

                  {/* Survivor Gender */}
                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center justify-between">
                          <FormLabel className="text-left whitespace-nowrap min-w-[120px]">
                            Gender
                          </FormLabel>
                          <div className="flex w-[75%] items-center gap-2">
                            <Checkbox
                              id="male-checkbox"
                              checked={field.value === Gender.MALE}
                              onCheckedChange={(checked) => {
                                if (checked)
                                  form.setValue('gender', Gender.MALE)
                              }}
                            />
                            <Label htmlFor="male-checkbox" className="text-sm">
                              M
                            </Label>
                            <Checkbox
                              id="female-checkbox"
                              checked={field.value === Gender.FEMALE}
                              onCheckedChange={(checked) => {
                                if (checked)
                                  form.setValue('gender', Gender.FEMALE)
                              }}
                            />
                            <Label
                              htmlFor="female-checkbox"
                              className="text-sm">
                              F
                            </Label>
                          </div>
                        </div>
                      </FormItem>
                    )}
                  />

                  <hr className="my-2" />

                  <div className="text-xs text-muted-foreground">
                    When you name your survivor, gain +1{' '}
                    <strong>survival</strong>.
                  </div>
                </TabsContent>

                <TabsContent value="wanderer" className="space-y-2 mt-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-left whitespace-nowrap min-w-[120px]">
                      Wanderer
                    </Label>
                    <SelectWanderer
                      wanderers={availableWanderers}
                      value={selectedWanderer?.name}
                      onChange={handleWandererSelect}
                    />
                  </div>

                  {selectedWanderer && (
                    <>
                      <hr className="my-2" />
                      <div className="text-xs text-muted-foreground">
                        <strong>{selectedWanderer.name}</strong> will join your
                        settlement with their unique abilities and stats.
                      </div>
                    </>
                  )}
                </TabsContent>
              </Tabs>
            ) : (
              /* No wanderers available - show standard form */
              <>
                {/* Survivor Name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel className="text-left whitespace-nowrap min-w-[120px]">
                          Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Survivor name..."
                            {...field}
                            value={field.value ?? ''}
                            onChange={(e) => {
                              form.setValue('name', e.target.value)
                            }}
                          />
                        </FormControl>
                      </div>
                    </FormItem>
                  )}
                />

                {/* Survivor Gender */}
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel className="text-left whitespace-nowrap min-w-[120px]">
                          Gender
                        </FormLabel>
                        <div className="flex w-[75%] items-center gap-2">
                          <Checkbox
                            id="male-checkbox-no-wanderer"
                            checked={field.value === Gender.MALE}
                            onCheckedChange={(checked) => {
                              if (checked) form.setValue('gender', Gender.MALE)
                            }}
                          />
                          <Label
                            htmlFor="male-checkbox-no-wanderer"
                            className="text-sm">
                            M
                          </Label>
                          <Checkbox
                            id="female-checkbox-no-wanderer"
                            checked={field.value === Gender.FEMALE}
                            onCheckedChange={(checked) => {
                              if (checked)
                                form.setValue('gender', Gender.FEMALE)
                            }}
                          />
                          <Label
                            htmlFor="female-checkbox-no-wanderer"
                            className="text-sm">
                            F
                          </Label>
                        </div>
                      </div>
                    </FormItem>
                  )}
                />

                <hr className="my-2" />

                <div className="text-xs text-muted-foreground">
                  When you name your survivor, gain +1 <strong>survival</strong>
                  .
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </Form>

      <div className="flex gap-2 justify-center">
        <Button
          type="button"
          variant="outline"
          onClick={() => setIsCreatingNewSurvivor(false)}>
          Cancel
        </Button>
        <Button type="submit">Create Survivor</Button>
      </div>
    </form>
  )
}
