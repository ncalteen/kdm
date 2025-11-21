'use client'

import { NumericInput } from '@/components/menu/numeric-input'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useIsMobile } from '@/hooks/use-mobile'
import { ColorChoice, SurvivorCardMode, SurvivorType } from '@/lib/enums'
import {
  SURVIVOR_ACCURACY_UPDATED_MESSAGE,
  SURVIVOR_EVASION_UPDATED_MESSAGE,
  SURVIVOR_LUCK_UPDATED_MESSAGE,
  SURVIVOR_LUMI_UPDATED_MESSAGE,
  SURVIVOR_MOVEMENT_UPDATED_MESSAGE,
  SURVIVOR_SPEED_UPDATED_MESSAGE,
  SURVIVOR_STRENGTH_UPDATED_MESSAGE
} from '@/lib/messages'
import { Hunt } from '@/schemas/hunt'
import { Settlement } from '@/schemas/settlement'
import { Showdown } from '@/schemas/showdown'
import { Survivor } from '@/schemas/survivor'
import { ReactElement, useMemo } from 'react'

/**
 * Attribute Card Properties
 */
interface AttributeCardProps {
  /** Mode */
  mode: SurvivorCardMode
  /** Save Selected Hunt */
  saveSelectedHunt?: (data: Partial<Hunt>, successMsg?: string) => void
  /** Save Selected Showdown */
  saveSelectedShowdown?:
    | ((data: Partial<Showdown>, successMsg?: string) => void)
    | null
  /** Save Selected Survivor */
  saveSelectedSurvivor:
    | ((data: Partial<Survivor>, successMsg?: string) => void)
    | null
  /** Selected Hunt */
  selectedHunt?: Partial<Hunt> | null
  /** Selected Settlemenet */
  selectedSettlement: Partial<Settlement> | null
  /** Selected Showdown */
  selectedShowdown?: Partial<Showdown> | null
  /** Selected Survivor */
  selectedSurvivor: Partial<Survivor> | null
  /** Read Only Mode */
  readOnly: boolean
}

/**
 * Survivor Attribute Card Component
 *
 * This component displays the survivor's core attributes (movement, accuracy,
 * strength, etc.) and allows them to be edited. For Arc survivors, it also
 * shows the Lumi attribute.
 *
 * @param props Attribute Card Properties
 * @returns Attribute Card Component
 */
export function AttributeCard({
  mode,
  saveSelectedHunt,
  saveSelectedShowdown,
  saveSelectedSurvivor,
  selectedHunt,
  selectedSettlement,
  selectedShowdown,
  selectedSurvivor,
  readOnly
}: AttributeCardProps): ReactElement {
  const isMobile = useIsMobile()

  /**
   * Save to Local Storage
   *
   * @param attrName Attribute name
   * @param value New value
   */
  const saveToLocalStorage = (
    attrName:
      | 'movement'
      | 'accuracy'
      | 'strength'
      | 'evasion'
      | 'luck'
      | 'speed'
      | 'lumi',
    value: number
  ) => {
    if (!saveSelectedSurvivor) return

    // Thematic success messages for each attribute
    const attributeMessages: Record<string, () => string> = {
      movement: SURVIVOR_MOVEMENT_UPDATED_MESSAGE,
      accuracy: SURVIVOR_ACCURACY_UPDATED_MESSAGE,
      strength: SURVIVOR_STRENGTH_UPDATED_MESSAGE,
      evasion: SURVIVOR_EVASION_UPDATED_MESSAGE,
      luck: SURVIVOR_LUCK_UPDATED_MESSAGE,
      speed: SURVIVOR_SPEED_UPDATED_MESSAGE,
      lumi: SURVIVOR_LUMI_UPDATED_MESSAGE
    }

    const updateData: Partial<Survivor> = {
      [attrName]: value
    }

    saveSelectedSurvivor(updateData, attributeMessages[attrName]())
  }

  /**
   * Save Tokens
   *
   * Saves to either hunt or showdown based on mode
   *
   * @param tokenName Token attribute name
   * @param value New value
   */
  const saveTokens = (
    tokenName:
      | 'accuracyTokens'
      | 'evasionTokens'
      | 'luckTokens'
      | 'movementTokens'
      | 'speedTokens'
      | 'strengthTokens',
    value: number
  ) => {
    if (!selectedSurvivor?.id) return

    if (mode === SurvivorCardMode.SHOWDOWN_CARD) {
      if (!saveSelectedShowdown || !selectedShowdown) return

      // Get current survivor details or create new one
      const currentDetails = selectedShowdown.survivorDetails || []
      const survivorDetailIndex = currentDetails.findIndex(
        (sd) => sd.id === selectedSurvivor.id
      )

      let updatedDetails
      if (survivorDetailIndex >= 0) {
        // Update existing survivor details
        updatedDetails = [...currentDetails]
        updatedDetails[survivorDetailIndex] = {
          ...updatedDetails[survivorDetailIndex],
          [tokenName]: value
        }
      } else {
        // Create new survivor details entry
        updatedDetails = [
          ...currentDetails,
          {
            accuracyTokens: 0,
            bleedingTokens: 0,
            blockTokens: 0,
            color: ColorChoice.SLATE,
            deflectTokens: 0,
            evasionTokens: 0,
            id: selectedSurvivor.id!,
            insanityTokens: 0,
            knockedDown: false,
            luckTokens: 0,
            movementTokens: 0,
            notes: '',
            priorityTarget: false,
            speedTokens: 0,
            strengthTokens: 0,
            survivalTokens: 0,
            [tokenName]: value
          }
        ]
      }

      saveSelectedShowdown({
        survivorDetails: updatedDetails
      })
    } else if (mode === SurvivorCardMode.HUNT_CARD) {
      if (!saveSelectedHunt || !selectedHunt) return

      // Get current survivor details or create new one
      const currentDetails = selectedHunt.survivorDetails || []
      const survivorDetailIndex = currentDetails.findIndex(
        (sd) => sd.id === selectedSurvivor.id
      )

      let updatedDetails
      if (survivorDetailIndex >= 0) {
        // Update existing survivor details
        updatedDetails = [...currentDetails]
        updatedDetails[survivorDetailIndex] = {
          ...updatedDetails[survivorDetailIndex],
          [tokenName]: value
        }
      } else {
        // Create new survivor details entry
        updatedDetails = [
          ...currentDetails,
          {
            accuracyTokens: 0,
            color: ColorChoice.SLATE,
            evasionTokens: 0,
            id: selectedSurvivor.id!,
            insanityTokens: 0,
            luckTokens: 0,
            movementTokens: 0,
            notes: '',
            speedTokens: 0,
            strengthTokens: 0,
            survivalTokens: 0,
            [tokenName]: value
          }
        ]
      }

      saveSelectedHunt({
        survivorDetails: updatedDetails
      })
    }
  }

  const columnCount = useMemo(() => {
    return selectedSettlement?.survivorType === SurvivorType.ARC
      ? mode === SurvivorCardMode.SHOWDOWN_CARD ||
        mode === SurvivorCardMode.HUNT_CARD
        ? 'grid-cols-8'
        : 'grid-cols-7'
      : mode === SurvivorCardMode.SHOWDOWN_CARD ||
          mode === SurvivorCardMode.HUNT_CARD
        ? 'grid-cols-7'
        : 'grid-cols-6'
  }, [selectedSettlement?.survivorType, mode])

  const survivorDetails = useMemo(
    () =>
      selectedShowdown?.survivorDetails?.find(
        (sd) => sd.id === selectedSurvivor?.id
      ) || {
        accuracyTokens: 0,
        bleedingTokens: 0,
        blockTokens: 0,
        color: ColorChoice.SLATE,
        deflectTokens: 0,
        evasionTokens: 0,
        id: 0,
        insanityTokens: 0,
        knockedDown: false,
        luckTokens: 0,
        movementTokens: 0,
        notes: '',
        priorityTarget: false,
        speedTokens: 0,
        strengthTokens: 0,
        survivalTokens: 0
      },
    [selectedShowdown, selectedSurvivor?.id]
  )

  return (
    <Card className="p-2 border-0">
      <CardContent className={`grid ${columnCount} gap-2 p-0`}>
        {/* Label Row */}
        {(mode === SurvivorCardMode.SHOWDOWN_CARD ||
          mode === SurvivorCardMode.HUNT_CARD) && <div className="max-w-12" />}
        <label className="text-xs text-center">Movement</label>
        <label className="text-xs text-center">Accuracy</label>
        <label className="text-xs text-center">Strength</label>
        <label className="text-xs text-center">Evasion</label>
        <label className="text-xs text-center">Luck</label>
        <label className="text-xs text-center">Speed</label>
        {selectedSettlement?.survivorType === SurvivorType.ARC && (
          <label className="text-xs text-center">Lumi</label>
        )}

        {(mode === SurvivorCardMode.SHOWDOWN_CARD ||
          mode === SurvivorCardMode.HUNT_CARD) && (
          <label className="text-xs flex items-center justify-center max-w-12">
            Base
          </label>
        )}

        {/* Movement */}
        <div className="flex flex-col items-center gap-1">
          <NumericInput
            value={selectedSurvivor?.movement ?? 1}
            min={0}
            label="Movement"
            onChange={(value) => saveToLocalStorage('movement', value)}
            readOnly={readOnly}>
            <Input
              key={`movement-${selectedSurvivor?.id || 'new'}`}
              placeholder="1"
              type="number"
              className="w-12 h-12 text-center no-spinners text-xl sm:text-xl md:text-xl focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
              value={selectedSurvivor?.movement ?? 1}
              readOnly={isMobile || readOnly}
              onChange={
                !isMobile && !readOnly
                  ? (e) =>
                      saveToLocalStorage(
                        'movement',
                        parseInt(e.target.value, 10)
                      )
                  : undefined
              }
              name="movement"
              id="movement"
            />
          </NumericInput>
        </div>

        {/* Accuracy */}
        <div className="flex flex-col items-center gap-1">
          <NumericInput
            value={selectedSurvivor?.accuracy ?? 0}
            label="Accuracy"
            onChange={(value) => saveToLocalStorage('accuracy', value)}
            readOnly={readOnly}>
            <Input
              key={`accuracy-${selectedSurvivor?.id || 'new'}`}
              placeholder="0"
              type="number"
              className="w-12 h-12 text-center no-spinners text-xl sm:text-xl md:text-xl focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
              value={selectedSurvivor?.accuracy ?? 0}
              readOnly={isMobile || readOnly}
              onChange={
                !isMobile && !readOnly
                  ? (e) =>
                      saveToLocalStorage(
                        'accuracy',
                        parseInt(e.target.value, 10)
                      )
                  : undefined
              }
              name="accuracy"
              id="accuracy"
            />
          </NumericInput>
        </div>

        {/* Strength */}
        <div className="flex flex-col items-center gap-1">
          <NumericInput
            value={selectedSurvivor?.strength ?? 0}
            label="Strength"
            onChange={(value) => saveToLocalStorage('strength', value)}
            readOnly={readOnly}>
            <Input
              key={`strength-${selectedSurvivor?.id || 'new'}`}
              placeholder="0"
              type="number"
              className="w-12 h-12 text-center no-spinners text-xl sm:text-xl md:text-xl focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
              value={selectedSurvivor?.strength ?? 0}
              readOnly={isMobile || readOnly}
              onChange={
                !isMobile && !readOnly
                  ? (e) =>
                      saveToLocalStorage(
                        'strength',
                        parseInt(e.target.value, 10)
                      )
                  : undefined
              }
              name="strength"
              id="strength"
            />
          </NumericInput>
        </div>

        {/* Evasion */}
        <div className="flex flex-col items-center gap-1">
          <NumericInput
            value={selectedSurvivor?.evasion ?? 0}
            label="Evasion"
            onChange={(value) => saveToLocalStorage('evasion', value)}
            readOnly={readOnly}>
            <Input
              key={`evasion-${selectedSurvivor?.id || 'new'}`}
              placeholder="0"
              type="number"
              className="w-12 h-12 text-center no-spinners text-xl sm:text-xl md:text-xl focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
              value={selectedSurvivor?.evasion ?? 0}
              readOnly={isMobile || readOnly}
              onChange={
                !isMobile && !readOnly
                  ? (e) =>
                      saveToLocalStorage(
                        'evasion',
                        parseInt(e.target.value, 10)
                      )
                  : undefined
              }
              name="evasion"
              id="evasion"
            />
          </NumericInput>
        </div>

        {/* Luck */}
        <div className="flex flex-col items-center gap-1">
          <NumericInput
            value={selectedSurvivor?.luck ?? 0}
            label="Luck"
            onChange={(value) => saveToLocalStorage('luck', value)}
            readOnly={readOnly}>
            <Input
              key={`luck-${selectedSurvivor?.id || 'new'}`}
              placeholder="0"
              type="number"
              className="w-12 h-12 text-center no-spinners text-xl sm:text-xl md:text-xl focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
              value={selectedSurvivor?.luck ?? 0}
              readOnly={isMobile || readOnly}
              onChange={
                !isMobile && !readOnly
                  ? (e) =>
                      saveToLocalStorage('luck', parseInt(e.target.value, 10))
                  : undefined
              }
              name="luck"
              id="luck"
            />
          </NumericInput>
        </div>

        {/* Speed */}
        <div className="flex flex-col items-center gap-1">
          <NumericInput
            value={selectedSurvivor?.speed ?? 0}
            label="Speed"
            onChange={(value) => saveToLocalStorage('speed', value)}
            readOnly={readOnly}>
            <Input
              key={`speed-${selectedSurvivor?.id || 'new'}`}
              placeholder="0"
              type="number"
              className="w-12 h-12 text-center no-spinners text-xl sm:text-xl md:text-xl focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
              value={selectedSurvivor?.speed ?? 0}
              readOnly={isMobile || readOnly}
              onChange={
                !isMobile && !readOnly
                  ? (e) =>
                      saveToLocalStorage('speed', parseInt(e.target.value, 10))
                  : undefined
              }
              name="speed"
              id="speed"
            />
          </NumericInput>
        </div>

        {/* Lumi (Arc) */}
        {selectedSettlement?.survivorType === SurvivorType.ARC && (
          <div className="flex flex-col items-center gap-1">
            <NumericInput
              value={selectedSurvivor?.lumi ?? 0}
              min={0}
              label="Lumi"
              onChange={(value) => saveToLocalStorage('lumi', value)}
              readOnly={readOnly}>
              <Input
                key={`lumi-${selectedSurvivor?.id || 'new'}`}
                placeholder="0"
                type="number"
                className="w-12 h-12 text-center no-spinners text-xl sm:text-xl md:text-xl focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                value={selectedSurvivor?.lumi ?? 0}
                readOnly={isMobile || readOnly}
                onChange={
                  !isMobile && !readOnly
                    ? (e) =>
                        saveToLocalStorage('lumi', parseInt(e.target.value, 10))
                    : undefined
                }
                name="lumi"
                id="lumi"
              />
            </NumericInput>
          </div>
        )}

        {(mode === SurvivorCardMode.SHOWDOWN_CARD ||
          mode === SurvivorCardMode.HUNT_CARD) && (
          <>
            <label className="text-xs text-center flex items-center justify-center max-w-12">
              Tokens
            </label>

            {/* Movement Tokens */}
            <div className="flex flex-col items-center gap-1">
              <NumericInput
                value={survivorDetails.movementTokens}
                label="Movement Tokens"
                onChange={(value) => saveTokens('movementTokens', value)}
                readOnly={readOnly}>
                <Input
                  key={`movement-tokens-${selectedSurvivor?.id || 'new'}`}
                  placeholder="1"
                  type="number"
                  className="w-12 h-12 text-center no-spinners text-xl sm:text-xl md:text-xl focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-muted!"
                  value={survivorDetails.movementTokens}
                  readOnly={isMobile || readOnly}
                  onChange={
                    !isMobile && !readOnly
                      ? (e) =>
                          saveTokens(
                            'movementTokens',
                            parseInt(e.target.value, 10)
                          )
                      : undefined
                  }
                  name="movement-tokens"
                  id="movement-tokens"
                />
              </NumericInput>
            </div>

            {/* Accuracy Tokens */}
            <div className="flex flex-col items-center gap-1">
              <NumericInput
                value={survivorDetails.accuracyTokens}
                label="Accuracy Tokens"
                onChange={(value) => saveTokens('accuracyTokens', value)}
                readOnly={readOnly}>
                <Input
                  key={`accuracy-tokens-${selectedSurvivor?.id || 'new'}`}
                  placeholder="0"
                  type="number"
                  className="w-12 h-12 text-center no-spinners text-xl sm:text-xl md:text-xl focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-muted!"
                  value={survivorDetails.accuracyTokens}
                  readOnly={isMobile || readOnly}
                  onChange={
                    !isMobile && !readOnly
                      ? (e) =>
                          saveTokens(
                            'accuracyTokens',
                            parseInt(e.target.value, 10)
                          )
                      : undefined
                  }
                  name="accuracy-tokens"
                  id="accuracy-tokens"
                />
              </NumericInput>
            </div>

            {/* Strength Tokens */}
            <div className="flex flex-col items-center gap-1">
              <NumericInput
                value={survivorDetails.strengthTokens}
                label="Strength Tokens"
                onChange={(value) => saveTokens('strengthTokens', value)}
                readOnly={readOnly}>
                <Input
                  key={`strength-tokens-${selectedSurvivor?.id || 'new'}`}
                  placeholder="0"
                  type="number"
                  className="w-12 h-12 text-center no-spinners text-xl sm:text-xl md:text-xl focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-muted!"
                  value={survivorDetails.strengthTokens}
                  readOnly={isMobile || readOnly}
                  onChange={
                    !isMobile && !readOnly
                      ? (e) =>
                          saveTokens(
                            'strengthTokens',
                            parseInt(e.target.value, 10)
                          )
                      : undefined
                  }
                  name="strength-tokens"
                  id="strength-tokens"
                />
              </NumericInput>
            </div>

            {/* Evasion Tokens */}
            <div className="flex flex-col items-center gap-1">
              <NumericInput
                value={survivorDetails.evasionTokens}
                label="Evasion Tokens"
                onChange={(value) => saveTokens('evasionTokens', value)}
                readOnly={readOnly}>
                <Input
                  key={`evasion-tokens-${selectedSurvivor?.id || 'new'}`}
                  placeholder="0"
                  type="number"
                  className="w-12 h-12 text-center no-spinners text-xl sm:text-xl md:text-xl focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-muted!"
                  value={survivorDetails.evasionTokens}
                  readOnly={isMobile || readOnly}
                  onChange={
                    !isMobile && !readOnly
                      ? (e) =>
                          saveTokens(
                            'evasionTokens',
                            parseInt(e.target.value, 10)
                          )
                      : undefined
                  }
                  name="evasion-tokens"
                  id="evasion-tokens"
                />
              </NumericInput>
            </div>

            {/* Luck Tokens */}
            <div className="flex flex-col items-center gap-1">
              <NumericInput
                value={survivorDetails.luckTokens}
                label="Luck Tokens"
                onChange={(value) => saveTokens('luckTokens', value)}
                readOnly={readOnly}>
                <Input
                  key={`luck-tokens-${selectedSurvivor?.id || 'new'}`}
                  placeholder="0"
                  type="number"
                  className="w-12 h-12 text-center no-spinners text-xl sm:text-xl md:text-xl focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-muted!"
                  value={survivorDetails.luckTokens}
                  readOnly={isMobile || readOnly}
                  onChange={
                    !isMobile && !readOnly
                      ? (e) =>
                          saveTokens('luckTokens', parseInt(e.target.value, 10))
                      : undefined
                  }
                  name="luck-tokens"
                  id="luck-tokens"
                />
              </NumericInput>
            </div>

            {/* Speed Tokens */}
            <div className="flex flex-col items-center gap-1">
              <NumericInput
                value={survivorDetails.speedTokens}
                label="Speed Tokens"
                onChange={(value) => saveTokens('speedTokens', value)}
                readOnly={readOnly}>
                <Input
                  key={`speed-tokens-${selectedSurvivor?.id || 'new'}`}
                  placeholder="0"
                  type="number"
                  className="w-12 h-12 text-center no-spinners text-xl sm:text-xl md:text-xl focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-muted!"
                  value={survivorDetails.speedTokens}
                  readOnly={isMobile || readOnly}
                  onChange={
                    !isMobile && !readOnly
                      ? (e) =>
                          saveTokens(
                            'speedTokens',
                            parseInt(e.target.value, 10)
                          )
                      : undefined
                  }
                  name="speed-tokens"
                  id="speed-tokens"
                />
              </NumericInput>
            </div>

            {/* Lumi (Arc) - No Tokens */}
            {selectedSettlement?.survivorType === SurvivorType.ARC && <div />}
          </>
        )}
      </CardContent>
    </Card>
  )
}
