'use client'

import { SelectCampaignType } from '@/components/menu/select-campaign-type'
import { SelectMonsterNode } from '@/components/menu/select-monster-node'
import { SelectSurvivorType } from '@/components/menu/select-survivor-type'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { CampaignType, MonsterNode, SurvivorType } from '@/lib/enums'
import { ERROR_MESSAGE, SETTLEMENT_CREATED_MESSAGE } from '@/lib/messages'
import {
  createSettlementFromOptions,
  getMonsterNodeMapping
} from '@/lib/settlements/utils'
import { getCampaign, saveCampaignToLocalStorage } from '@/lib/utils'
import {
  BaseSettlementSchema,
  NewSettlementInput,
  NewSettlementInputSchema,
  Settlement
} from '@/schemas/settlement'
import { zodResolver } from '@hookform/resolvers/zod'
import { ReactElement, useEffect, useMemo } from 'react'
import { Resolver, useForm, useWatch } from 'react-hook-form'
import { toast } from 'sonner'

/**
 * Create Settlement Form Properties
 */
interface CreateSettlementFormProps {
  /** Set Selected Settlement */
  setSelectedSettlement: (settlement: Settlement | null) => void
}

/**
 * Create Settlement Form Component
 *
 * This component is responsible for rendering the form that allows users to
 * name and create a settlement. It includes fields for selecting the campaign
 * type, survivor type, and the settlement name.
 *
 * @param props Create Settlement Form Properties
 * @returns Create Settlement Form Component
 */
export function CreateSettlementForm({
  setSelectedSettlement
}: CreateSettlementFormProps): ReactElement {
  const form = useForm<NewSettlementInput>({
    resolver: zodResolver(
      NewSettlementInputSchema
    ) as Resolver<NewSettlementInput>,
    defaultValues: {
      ...BaseSettlementSchema.parse({}),
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
    }
  })

  const watchedCampaignType = useWatch({
    control: form.control,
    name: 'campaignType'
  })
  const watchedSurvivorType = useWatch({
    control: form.control,
    name: 'survivorType'
  })

  const isCustomCampaign = useMemo(
    () => watchedCampaignType === CampaignType.CUSTOM,
    [watchedCampaignType]
  )

  /**
   * Auto-populate monster selections when campaign type changes.
   */
  useEffect(() => {
    if (!watchedCampaignType || isCustomCampaign) return

    const monsterMapping = getMonsterNodeMapping(watchedCampaignType)
    form.setValue('monsters', monsterMapping)
  }, [watchedCampaignType, isCustomCampaign, form])

  function onSubmit(values: NewSettlementInput) {
    try {
      // Get campaign data based on the selected campaign type
      const settlement = createSettlementFromOptions(values)

      // Get existing campaign data from localStorage or initialize new
      const campaign = getCampaign()

      // Add the new settlement to the campaign
      campaign.settlements.push(settlement)

      // Set the newly created settlement as selected
      campaign.selectedSettlementId = settlement.id

      // Save the updated campaign to localStorage
      saveCampaignToLocalStorage(campaign)

      // Update the selected settlement in the context
      setSelectedSettlement(settlement)

      // Show success message
      toast.success(SETTLEMENT_CREATED_MESSAGE())
    } catch (error) {
      console.error('Settlement Create Error:', error)
      toast.error(ERROR_MESSAGE())
    }
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit, (e) => {
        console.error('Create Settlement Form Error:', e)
        toast.error(ERROR_MESSAGE())
      })}
      className="space-y-6">
      <Form {...form}>
        <Card className="max-w-[500px] mt-10 mx-auto">
          <CardContent className="flex flex-col gap-2 w-full">
            {/* Settlement Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel className="text-left whitespace-nowrap min-w-[120px]">
                      Settlement
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Settlement Name"
                        {...field}
                        value={field.value ?? ''}
                        onChange={(e) =>
                          form.setValue(field.name, e.target.value)
                        }
                        className="w-full max-w-[250px]"
                      />
                    </FormControl>
                  </div>
                </FormItem>
              )}
            />

            <hr className="my-0" />

            {/* Campaign Type */}
            <FormField
              control={form.control}
              name="campaignType"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel className="text-left whitespace-nowrap min-w-[120px]">
                      Campaign Type
                    </FormLabel>
                    <FormControl>
                      <SelectCampaignType
                        {...field}
                        value={
                          field.value || CampaignType.PEOPLE_OF_THE_LANTERN
                        }
                      />
                    </FormControl>
                  </div>
                </FormItem>
              )}
            />

            {/* Survivor Type */}
            <FormField
              control={form.control}
              name="survivorType"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel className="text-left whitespace-nowrap min-w-[120px]">
                      Survivor Type
                    </FormLabel>
                    <FormControl>
                      <SelectSurvivorType
                        value={
                          watchedCampaignType ===
                          CampaignType.PEOPLE_OF_THE_DREAM_KEEPER
                            ? SurvivorType.ARC
                            : watchedCampaignType ===
                                CampaignType.SQUIRES_OF_THE_CITADEL
                              ? SurvivorType.CORE
                              : watchedSurvivorType
                        }
                        onChange={field.onChange}
                        disabled={
                          watchedCampaignType ===
                            CampaignType.PEOPLE_OF_THE_DREAM_KEEPER ||
                          watchedCampaignType ===
                            CampaignType.SQUIRES_OF_THE_CITADEL
                        }
                      />
                    </FormControl>
                  </div>
                </FormItem>
              )}
            />

            {/* Uses Scouts */}
            <FormField
              control={form.control}
              name="usesScouts"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel className="text-left whitespace-nowrap min-w-[120px]">
                      Use Scouts
                    </FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </div>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
      </Form>

      <Button type="submit" className="mx-auto block">
        Create Settlement
      </Button>
    </form>
  )
}
