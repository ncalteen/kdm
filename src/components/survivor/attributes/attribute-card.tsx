'use client'

import { NumericInput } from '@/components/menu/numeric-input'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useIsMobile } from '@/hooks/use-mobile'
import { SurvivorType } from '@/lib/enums'
import {
  SURVIVOR_ACCURACY_UPDATED_MESSAGE,
  SURVIVOR_EVASION_UPDATED_MESSAGE,
  SURVIVOR_LUCK_UPDATED_MESSAGE,
  SURVIVOR_LUMI_UPDATED_MESSAGE,
  SURVIVOR_MOVEMENT_UPDATED_MESSAGE,
  SURVIVOR_SPEED_UPDATED_MESSAGE,
  SURVIVOR_STRENGTH_UPDATED_MESSAGE
} from '@/lib/messages'
import { Settlement } from '@/schemas/settlement'
import { Survivor } from '@/schemas/survivor'
import { ReactElement } from 'react'

/**
 * Attribute Card Properties
 */
interface AttributeCardProps {
  /** Save Selected Survivor */
  saveSelectedSurvivor:
    | ((data: Partial<Survivor>, successMsg?: string) => void)
    | null
  /** Selected Settlemenet */
  selectedSettlement: Partial<Settlement> | null
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
  saveSelectedSurvivor,
  selectedSettlement,
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

  return (
    <Card className="p-2 border-0">
      <CardContent className="p-0">
        <div className="flex flex-row justify-between">
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
            <label className="text-xs">Movement</label>
          </div>

          <div className="w-px bg-border" />

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
            <label className="text-xs">Accuracy</label>
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
            <label className="text-xs">Strength</label>
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
            <label className="text-xs">Evasion</label>
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
            <label className="text-xs">Luck</label>
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
                        saveToLocalStorage(
                          'speed',
                          parseInt(e.target.value, 10)
                        )
                    : undefined
                }
                name="speed"
                id="speed"
              />
            </NumericInput>
            <label className="text-xs">Speed</label>
          </div>

          {/* Lumi (Arc) */}
          {selectedSettlement?.survivorType === SurvivorType.ARC && (
            <>
              <div className="w-px bg-border" />

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
                            saveToLocalStorage(
                              'lumi',
                              parseInt(e.target.value, 10)
                            )
                        : undefined
                    }
                    name="lumi"
                    id="lumi"
                  />
                </NumericInput>
                <label className="text-xs">Lumi</label>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
