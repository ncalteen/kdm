'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { CampaignType, SurvivorType } from '@/lib/enums'
import { getCampaign } from '@/lib/utils'
import { SettlementSchema } from '@/schemas/settlement'
import { SurvivorSchema } from '@/schemas/survivor'
import {
  CheckIcon,
  ChevronDownIcon,
  PencilIcon,
  PlusCircleIcon,
  TrashIcon
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

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
export function FightingArtsCard(
  form: UseFormReturn<z.infer<typeof SurvivorSchema>>
) {
  const [settlement, setSettlement] = useState<
    z.infer<typeof SettlementSchema> | undefined
  >()
  const [survivorType, setSurvivorType] = useState<SurvivorType>(
    SurvivorType.CORE
  )

  // Get the current fighting arts and secret fighting arts
  const fightingArts = useMemo(() => form.watch('fightingArts') || [], [form])
  const secretFightingArts = useMemo(
    () => form.watch('secretFightingArts') || [],
    [form]
  )

  // Combine fighting arts for the unified view
  const combinedArts = useMemo(() => {
    const regular = fightingArts.map((art, index) => ({
      value: art,
      type: 'regular' as const,
      originalIndex: index
    }))

    const secret = secretFightingArts.map((art, index) => ({
      value: art,
      type: 'secret' as const,
      originalIndex: index
    }))

    return [...regular, ...secret]
  }, [fightingArts, secretFightingArts])

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

  // Track local values for editing
  const [editValues, setEditValues] = useState<{
    [key: string]: string
  }>({})

  // Track when we're adding new arts
  const [isAddingNew, setIsAddingNew] = useState(false)

  // Track which type we're currently adding
  const [newArtType, setNewArtType] = useState<'regular' | 'secret'>('regular')
  const [newArtValue, setNewArtValue] = useState('')

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

  // Initialize disabled inputs and edit values for combined arts
  useEffect(() => {
    setDisabledInputs(() => {
      const next: { [key: string]: boolean } = {}

      combinedArts.forEach((art) => {
        const key = `${art.type}-${art.originalIndex}`
        next[key] = true
      })

      return next
    })

    setEditValues(() => {
      const next: { [key: string]: string } = {}

      combinedArts.forEach((art) => {
        const key = `${art.type}-${art.originalIndex}`
        next[key] = art.value
      })

      return next
    })
  }, [combinedArts])

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
   * Start adding a new fighting art
   *
   * @param type Type of art to add ('regular' or 'secret')
   */
  const startAddingArt = (type: 'regular' | 'secret') => {
    const isAtLimit =
      type === 'regular'
        ? isAtRegularFightingArtLimit()
        : isAtSecretFightingArtLimit()

    if (isAtLimit) {
      const message =
        survivorType === SurvivorType.ARC
          ? `Arc survivors can only have 1 ${type === 'regular' ? 'Fighting Art' : 'Secret Fighting Art'}.`
          : 'Survivors can only have 3 total Fighting Arts and Secret Fighting Arts combined.'

      return toast.warning(message)
    }

    setNewArtType(type)
    setNewArtValue('')
    setIsAddingNew(true)
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
      form.setValue('fightingArts', currentArts)
      toast.success('The fighting art has been forgotten.')
    } else {
      const currentArts = [...secretFightingArts]
      currentArts.splice(art.originalIndex, 1)
      form.setValue('secretFightingArts', currentArts)
      toast.success('The secret fighting art has been banished from memory.')
    }
  }

  /**
   * Handles the saving of a new fighting art
   */
  const saveNewFightingArt = () => {
    if (!newArtValue || newArtValue.trim() === '') {
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

      const newArts = [...fightingArts, newArtValue]
      form.setValue('fightingArts', newArts)
      toast.success('A new fighting art has been mastered.')
    } else {
      if (isAtSecretFightingArtLimit()) {
        const message =
          survivorType === SurvivorType.ARC
            ? 'Arc survivors can only have 1 Secret Fighting Art.'
            : 'Survivors can only have 3 total Fighting Arts and Secret Fighting Arts combined.'

        return toast.warning(message)
      }

      const newArts = [...secretFightingArts, newArtValue]
      form.setValue('secretFightingArts', newArts)
      toast.success('A secret fighting art has been mastered in the darkness.')
    }

    setIsAddingNew(false)
    setNewArtValue('')
  }

  /**
   * Enter edit mode for a fighting art
   *
   * @param art The art to edit
   */
  const editFightingArt = (art: CombinedFightingArt) => {
    const key = `${art.type}-${art.originalIndex}`
    setDisabledInputs((prev) => ({ ...prev, [key]: false }))
  }

  /**
   * Save an edited fighting art
   *
   * @param art The art being edited
   */
  const saveFightingArt = (art: CombinedFightingArt) => {
    const key = `${art.type}-${art.originalIndex}`
    const value = editValues[key]

    if (!value || value.trim() === '') {
      return toast.warning('A nameless fighting art cannot be preserved.')
    }

    if (art.type === 'regular') {
      form.setValue(`fightingArts.${art.originalIndex}`, value)
      toast.success('The fighting art has been perfected.')
    } else {
      form.setValue(`secretFightingArts.${art.originalIndex}`, value)
      toast.success('The secret fighting art has been perfected.')
    }

    setDisabledInputs((prev) => ({ ...prev, [key]: true }))
  }

  // Don't show this component for Squires of the Citadel campaign
  if (settlement?.campaignType === CampaignType.SQUIRES_OF_THE_CITADEL) {
    return null
  }

  return (
    <Card className="mt-2">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-md flex items-center gap-1">
            Fighting Arts &amp; Secret Fighting Arts
          </CardTitle>
          <div className="flex items-center gap-2">
            <Checkbox
              id="canUseFightingArtsOrKnowledges"
              checked={canUseFightingArtsOrKnowledges}
              onCheckedChange={(checked) => {
                form.setValue('canUseFightingArtsOrKnowledges', !!checked)
              }}
            />
            <label
              htmlFor="canUseFightingArtsOrKnowledges"
              className="text-sm cursor-pointer">
              Can use fighting arts
            </label>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0 pb-2">
        <div className="space-y-4">
          {/* Combined Fighting Arts List */}
          <div className="space-y-2">
            {combinedArts.length === 0 && !isAddingNew ? (
              <div className="text-center text-sm text-muted-foreground py-4">
                No fighting arts mastered yet.
              </div>
            ) : (
              combinedArts.map((art) => {
                const key = `${art.type}-${art.originalIndex}`
                const isDisabled = disabledInputs[key] !== false

                return (
                  <div key={key} className="flex items-center gap-2">
                    <Badge
                      variant={art.type === 'regular' ? 'default' : 'secondary'}
                      className="shrink-0 w-16 flex justify-center">
                      {art.type === 'regular' ? 'Fighting' : 'Secret'}
                    </Badge>
                    <Input
                      placeholder={
                        art.type === 'regular'
                          ? 'Fighting Art'
                          : 'Secret Fighting Art'
                      }
                      value={editValues[key] || art.value}
                      disabled={isDisabled}
                      onChange={(e) =>
                        !isDisabled &&
                        setEditValues((prev) => ({
                          ...prev,
                          [key]: e.target.value
                        }))
                      }
                      className="flex-1"
                    />
                    {isDisabled ? (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => editFightingArt(art)}
                        title={`Edit ${art.type === 'regular' ? 'fighting' : 'secret fighting'} art`}>
                        <PencilIcon className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => saveFightingArt(art)}
                        title={`Save ${art.type === 'regular' ? 'fighting' : 'secret fighting'} art`}>
                        <CheckIcon className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      type="button"
                      className="h-8 w-8 p-0 ml-2"
                      onClick={() => handleRemoveFightingArt(art)}
                      title={`Remove ${art.type === 'regular' ? 'fighting' : 'secret fighting'} art`}>
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </div>
                )
              })
            )}
            {isAddingNew && (
              <div className="flex items-center gap-2">
                <Badge
                  variant={newArtType === 'regular' ? 'default' : 'secondary'}
                  className="shrink-0 w-16 flex justify-center">
                  {newArtType === 'regular' ? 'Fighting' : 'Secret'}
                </Badge>
                <Input
                  placeholder={
                    newArtType === 'regular'
                      ? 'Fighting Art'
                      : 'Secret Fighting Art'
                  }
                  value={newArtValue}
                  onChange={(e) => setNewArtValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      saveNewFightingArt()
                    } else if (e.key === 'Escape') {
                      setIsAddingNew(false)
                      setNewArtValue('')
                    }
                  }}
                  className="flex-1"
                  autoFocus
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={saveNewFightingArt}
                  title={`Save ${newArtType === 'regular' ? 'fighting' : 'secret fighting'} art`}>
                  <CheckIcon className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsAddingNew(false)}
                  title="Cancel">
                  <TrashIcon className="h-4 w-4" />
                </Button>
              </div>
            )}
            {!isAddingNew && (
              <div className="pt-2 flex justify-center">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      disabled={isAnyBeingEdited()}>
                      <PlusCircleIcon className="h-4 w-4 mr-1" />
                      Add Fighting Art
                      <ChevronDownIcon className="h-4 w-4 ml-1" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onClick={() => startAddingArt('regular')}
                      disabled={isAtRegularFightingArtLimit()}>
                      Fighting Art
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => startAddingArt('secret')}
                      disabled={isAtSecretFightingArtLimit()}>
                      Secret Fighting Art
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
