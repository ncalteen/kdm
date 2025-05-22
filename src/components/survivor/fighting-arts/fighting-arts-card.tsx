'use client'

import {
  FightingArtItem,
  NewFightingArtItem
} from '@/components/survivor/fighting-arts/fighting-art-item'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Label } from '@/components/ui/label'
import { CampaignType, SurvivorType } from '@/lib/enums'
import { getCampaign } from '@/lib/utils'
import { Settlement } from '@/schemas/settlement'
import { Survivor, SurvivorSchema } from '@/schemas/survivor'
import { PlusIcon } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'
import { ZodError } from 'zod'

// Type for a combined fighting art item with metadata
export interface CombinedFightingArt {
  /** Original Index */
  originalIndex: number
  /** Type */
  type: 'regular' | 'secret'
  /** Value */
  value: string
}

/**
 * Fighting Arts Card Component
 */
export function FightingArtsCard(form: UseFormReturn<Survivor>) {
  const [settlement, setSettlement] = useState<Settlement | undefined>()
  const [survivorType, setSurvivorType] = useState<SurvivorType>(
    SurvivorType.CORE
  )

  // Get the current fighting arts and secret fighting arts
  const fightingArts = useMemo(() => form.watch('fightingArts') || [], [form])
  const secretFightingArts = useMemo(
    () => form.watch('secretFightingArts') || [],
    [form]
  )

  // Get the canUseFightingArtsOrKnowledges value
  const canUseFightingArtsOrKnowledges = useMemo(
    () => form.watch('canUseFightingArtsOrKnowledges'),
    [form]
  )

  // Calculate total arts to check against limits
  const totalArts = fightingArts.length + secretFightingArts.length

  // Track state for input editing
  const [disabledInputs, setDisabledInputs] = useState<{
    [key: string]: boolean
  }>({})

  // Track which type we're currently adding
  const [newArtType, setNewArtType] = useState<'regular' | 'secret'>('regular')
  const [isAddingNew, setIsAddingNew] = useState<boolean>(false)

  // Set the survivor type when the settlement ID changes
  useEffect(() => {
    const settlementId = form.getValues('settlementId')

    if (settlementId) {
      try {
        const campaign = getCampaign()
        const fetchedSettlement = campaign.settlements.find(
          (s) => s.id === settlementId
        )

        if (fetchedSettlement) {
          setSettlement(fetchedSettlement)
          setSurvivorType(fetchedSettlement.survivorType)
        }
      } catch (error) {
        console.error('Settlement Fetch Error:', error)
      }
    }
  }, [form])

  // Initialize disabled inputs for fighting arts
  useEffect(() => {
    setDisabledInputs(() => {
      const next: { [key: string]: boolean } = {}

      fightingArts.forEach((_, index) => {
        const key = `regular-${index}`
        next[key] = true
      })

      secretFightingArts.forEach((_, index) => {
        const key = `secret-${index}`
        next[key] = true
      })

      return next
    })
  }, [fightingArts, secretFightingArts])

  /**
   * Save fighting arts and secret fighting arts to localStorage for the current survivor, with Zod validation and toast feedback.
   *
   * @param updatedFightingArts Updated fighting arts array
   * @param updatedSecretFightingArts Updated secret fighting arts array
   * @param successMsg Success message for toast
   */
  const saveToLocalStorage = (
    updatedFightingArts: string[],
    updatedSecretFightingArts: string[],
    successMsg: string
  ) => {
    try {
      const formValues = form.getValues()
      const campaign = getCampaign()
      const survivorIndex = campaign.survivors.findIndex(
        (s: { id: number }) => s.id === formValues.id
      )

      if (survivorIndex !== -1) {
        const updatedSurvivor = {
          ...campaign.survivors[survivorIndex],
          fightingArts: updatedFightingArts,
          secretFightingArts: updatedSecretFightingArts
        }

        try {
          SurvivorSchema.parse(updatedSurvivor)
        } catch (error) {
          if (error instanceof ZodError && error.errors[0]?.message)
            return toast.error(error.errors[0].message)
          else
            return toast.error(
              'The darkness swallows your words. Please try again.'
            )
        }

        campaign.survivors[survivorIndex].fightingArts = updatedFightingArts
        campaign.survivors[survivorIndex].secretFightingArts =
          updatedSecretFightingArts
        localStorage.setItem('campaign', JSON.stringify(campaign))
        toast.success(successMsg)
      }
    } catch (error) {
      console.error('Fighting Art Save Error:', error)
      toast.error('The darkness swallows your words. Please try again.')
    }
  }

  /**
   * Checks if we've reached the regular fighting arts limit
   *
   * @returns boolean True if at limit, false otherwise
   */
  const isAtRegularFightingArtLimit = () => {
    if (survivorType === SurvivorType.ARC) return fightingArts.length >= 1
    return totalArts >= 3
  }

  /**
   * Checks if we've reached the secret fighting arts limit
   *
   * @returns boolean True if at limit, false otherwise
   */
  const isAtSecretFightingArtLimit = () => {
    if (survivorType === SurvivorType.ARC) return secretFightingArts.length >= 1
    return totalArts >= 3
  }

  /**
   * Checks if any fighting art is currently being edited
   */
  const isAnyBeingEdited = () => {
    return Object.values(disabledInputs).some((v) => v === false)
  }

  /**
   * Handles the removal of a fighting art
   *
   * @param art The art to remove
   */
  const handleRemoveFightingArt = (art: CombinedFightingArt) => {
    if (art.type === 'regular') {
      const currentArts = [...fightingArts]
      currentArts.splice(art.originalIndex, 1)
      saveToLocalStorage(
        currentArts,
        secretFightingArts,
        'The fighting art has been forgotten.'
      )
      form.setValue('fightingArts', currentArts)
    } else {
      const currentArts = [...secretFightingArts]
      currentArts.splice(art.originalIndex, 1)
      saveToLocalStorage(
        fightingArts,
        currentArts,
        'The secret fighting art has been banished from memory.'
      )
      form.setValue('secretFightingArts', currentArts)
    }
  }

  /**
   * Handles the saving of a new fighting art
   */
  const saveNewFightingArt = (value: string) => {
    if (!value || value.trim() === '') {
      return toast.warning('A nameless fighting art cannot be learned.')
    }
    if (newArtType === 'regular') {
      if (isAtRegularFightingArtLimit()) {
        const message =
          survivorType === SurvivorType.ARC
            ? 'Arc survivors can only have 1 Fighting Art.'
            : 'Survivors can only have 3 total Fighting Arts and Secret Fighting Arts combined.'
        return toast.warning(message)
      }
      const newArts = [...fightingArts, value]
      saveToLocalStorage(
        newArts,
        secretFightingArts,
        'A new fighting art has been mastered.'
      )
      form.setValue('fightingArts', newArts)
    } else {
      if (isAtSecretFightingArtLimit()) {
        const message =
          survivorType === SurvivorType.ARC
            ? 'Arc survivors can only have 1 Secret Fighting Art.'
            : 'Survivors can only have 3 total Fighting Arts and Secret Fighting Arts combined.'
        return toast.warning(message)
      }
      const newArts = [...secretFightingArts, value]
      saveToLocalStorage(
        fightingArts,
        newArts,
        'A secret fighting art has been mastered in the darkness.'
      )
      form.setValue('secretFightingArts', newArts)
    }
    setIsAddingNew(false)
  }

  /**
   * Handles editing a fighting art (enables input)
   */
  const editFightingArt = (art: CombinedFightingArt) => {
    const key = `${art.type}-${art.originalIndex}`
    setDisabledInputs((prev) => ({ ...prev, [key]: false }))
  }

  /**
   * Handles saving an edited fighting art
   */
  const saveFightingArt = (art: CombinedFightingArt, value: string) => {
    const key = `${art.type}-${art.originalIndex}`
    if (art.type === 'regular') {
      const updated = [...fightingArts]
      updated[art.originalIndex] = value
      saveToLocalStorage(
        updated,
        secretFightingArts,
        'The fighting art has been perfected.'
      )
      form.setValue(`fightingArts.${art.originalIndex}`, value)
    } else {
      const updated = [...secretFightingArts]
      updated[art.originalIndex] = value
      saveToLocalStorage(
        fightingArts,
        updated,
        'The secret fighting art has been perfected.'
      )
      form.setValue(`secretFightingArts.${art.originalIndex}`, value)
    }
    setDisabledInputs((prev) => ({ ...prev, [key]: true }))
  }

  // Don't show this component for Squires of the Citadel campaign
  if (settlement?.campaignType === CampaignType.SQUIRES_OF_THE_CITADEL)
    return null

  return (
    <Card className="mt-1 border-0">
      <CardHeader className="px-3 py-2 pb-2">
        <div className="flex justify-between items-center">
          {/* Title */}
          <CardTitle className="text-md flex flex-row items-center gap-1 h-4">
            Fighting Arts &amp; Secret Fighting Arts{' '}
            {!isAddingNew && (
              <div className="flex justify-center">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="border-0 h-8 w-8"
                      disabled={isAnyBeingEdited()}>
                      <PlusIcon className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onClick={() => {
                        setNewArtType('regular')
                        setIsAddingNew(true)
                      }}
                      disabled={isAtRegularFightingArtLimit()}>
                      Fighting Art
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        setNewArtType('secret')
                        setIsAddingNew(true)
                      }}
                      disabled={isAtSecretFightingArtLimit()}>
                      Secret Fighting Art
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </CardTitle>

          {/* Cannot Use Fighting Arts */}
          <div className="flex items-center gap-2">
            <Checkbox
              id="canUseFightingArtsOrKnowledges"
              checked={!canUseFightingArtsOrKnowledges}
              onCheckedChange={(checked) => {
                form.setValue('canUseFightingArtsOrKnowledges', !!checked)
              }}
            />
            <Label htmlFor="skipNextHunt" className="text-xs cursor-pointer">
              Cannot use fighting arts
            </Label>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-2">
          {/* Render regular fighting arts */}
          {fightingArts.length !== 0 &&
            fightingArts.map((art, index) => (
              <FightingArtItem
                key={`regular-${index}`}
                form={form}
                arrayName="fightingArts"
                handleRemove={(i) =>
                  handleRemoveFightingArt({
                    value: art,
                    type: 'regular',
                    originalIndex: i
                  })
                }
                id={index.toString()}
                index={index}
                isDisabled={!!disabledInputs[`regular-${index}`]}
                onEdit={(i) =>
                  editFightingArt({
                    value: art,
                    type: 'regular',
                    originalIndex: i
                  })
                }
                onSave={(i, value) =>
                  saveFightingArt(
                    { value: art, type: 'regular', originalIndex: i },
                    value
                  )
                }
                placeholder="Fighting Art"
              />
            ))}
          {/* Render secret fighting arts */}
          {secretFightingArts.length !== 0 &&
            secretFightingArts.map((art, index) => (
              <FightingArtItem
                key={`secret-${index}`}
                form={form}
                arrayName="secretFightingArts"
                handleRemove={(i) =>
                  handleRemoveFightingArt({
                    value: art,
                    type: 'secret',
                    originalIndex: i
                  })
                }
                id={index.toString()}
                index={index}
                isDisabled={!!disabledInputs[`secret-${index}`]}
                onEdit={(i) =>
                  editFightingArt({
                    value: art,
                    type: 'secret',
                    originalIndex: i
                  })
                }
                onSave={(i, value) =>
                  saveFightingArt(
                    { value: art, type: 'secret', originalIndex: i },
                    value
                  )
                }
                placeholder="Secret Fighting Art"
              />
            ))}
          {isAddingNew && (
            <NewFightingArtItem
              onSave={saveNewFightingArt}
              onCancel={() => setIsAddingNew(false)}
              placeholder={
                newArtType === 'regular'
                  ? 'Fighting Art'
                  : 'Secret Fighting Art'
              }
            />
          )}
        </div>
      </CardContent>
    </Card>
  )
}
