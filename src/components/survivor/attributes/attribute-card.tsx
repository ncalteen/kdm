'use client'

import { NumericInput } from '@/components/menu/numeric-input'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { SurvivorType } from '@/lib/enums'
import { Settlement } from '@/schemas/settlement'
import { Survivor } from '@/schemas/survivor'
import { ReactElement } from 'react'

/**
 * Attribute Card Properties
 */
interface AttributeCardProps {
  /** Save Selected Survivor */
  saveSelectedSurvivor: (data: Partial<Survivor>, successMsg?: string) => void
  /** Selected Settlemenet */
  selectedSettlement: Partial<Settlement> | null
  /** Selected Survivor */
  selectedSurvivor: Partial<Survivor> | null
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
  selectedSurvivor
}: AttributeCardProps): ReactElement {
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
    // Thematic success messages for each attribute
    const attributeMessages: Record<string, string> = {
      movement: 'Strides through darkness grow more confident.',
      accuracy: "The survivor's aim pierces through shadow.",
      strength: 'Muscles forged in adversity grow stronger.',
      evasion: 'Grace in the face of death improves.',
      luck: 'Fortune favors the desperate soul.',
      speed: 'Swift as shadows, the survivor advances.',
      lumi: 'Arc energy courses through enlightened veins.'
    }

    const updateData: Partial<Survivor> = {
      [attrName]: value
    }

    saveSelectedSurvivor(
      updateData,
      attributeMessages[attrName] || "The survivor's potential grows."
    )
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
              onChange={(value) => saveToLocalStorage('movement', value)}>
              <Input
                key={`movement-${selectedSurvivor?.id || 'new'}`}
                placeholder="1"
                type="number"
                className="w-12 h-12 text-center no-spinners text-xl sm:text-xl md:text-xl focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                value={selectedSurvivor?.movement ?? 1}
                readOnly
                name="movement-mobile"
                id="movement-mobile"
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
              onChange={(value) => saveToLocalStorage('accuracy', value)}>
              <Input
                key={`accuracy-${selectedSurvivor?.id || 'new'}`}
                placeholder="0"
                type="number"
                className="w-12 h-12 text-center no-spinners text-xl sm:text-xl md:text-xl focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                value={selectedSurvivor?.accuracy ?? 0}
                readOnly
                name="accuracy-mobile"
                id="accuracy-mobile"
              />
            </NumericInput>
            <label className="text-xs">Accuracy</label>
          </div>

          {/* Strength */}
          <div className="flex flex-col items-center gap-1">
            <NumericInput
              value={selectedSurvivor?.strength ?? 0}
              label="Strength"
              onChange={(value) => saveToLocalStorage('strength', value)}>
              <Input
                key={`strength-${selectedSurvivor?.id || 'new'}`}
                placeholder="0"
                type="number"
                className="w-12 h-12 text-center no-spinners text-xl sm:text-xl md:text-xl focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                value={selectedSurvivor?.strength ?? 0}
                readOnly
                name="strength-mobile"
                id="strength-mobile"
              />
            </NumericInput>
            <label className="text-xs">Strength</label>
          </div>

          {/* Evasion */}
          <div className="flex flex-col items-center gap-1">
            <NumericInput
              value={selectedSurvivor?.evasion ?? 0}
              label="Evasion"
              onChange={(value) => saveToLocalStorage('evasion', value)}>
              <Input
                key={`evasion-${selectedSurvivor?.id || 'new'}`}
                placeholder="0"
                type="number"
                className="w-12 h-12 text-center no-spinners text-xl sm:text-xl md:text-xl focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                value={selectedSurvivor?.evasion ?? 0}
                readOnly
                name="evasion-mobile"
                id="evasion-mobile"
              />
            </NumericInput>
            <label className="text-xs">Evasion</label>
          </div>

          {/* Luck */}
          <div className="flex flex-col items-center gap-1">
            <NumericInput
              value={selectedSurvivor?.luck ?? 0}
              label="Luck"
              onChange={(value) => saveToLocalStorage('luck', value)}>
              <Input
                key={`luck-${selectedSurvivor?.id || 'new'}`}
                placeholder="0"
                type="number"
                className="w-12 h-12 text-center no-spinners text-xl sm:text-xl md:text-xl focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                value={selectedSurvivor?.luck ?? 0}
                readOnly
                name="luck-mobile"
                id="luck-mobile"
              />
            </NumericInput>
            <label className="text-xs">Luck</label>
          </div>

          {/* Speed */}
          <div className="flex flex-col items-center gap-1">
            <NumericInput
              value={selectedSurvivor?.speed ?? 0}
              label="Speed"
              onChange={(value) => saveToLocalStorage('speed', value)}>
              <Input
                key={`speed-${selectedSurvivor?.id || 'new'}`}
                placeholder="0"
                type="number"
                className="w-12 h-12 text-center no-spinners text-xl sm:text-xl md:text-xl focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                value={selectedSurvivor?.speed ?? 0}
                readOnly
                name="speed-mobile"
                id="speed-mobile"
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
                  onChange={(value) => saveToLocalStorage('lumi', value)}>
                  <Input
                    key={`lumi-${selectedSurvivor?.id || 'new'}`}
                    placeholder="0"
                    type="number"
                    className="w-12 h-12 text-center no-spinners text-xl sm:text-xl md:text-xl focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                    value={selectedSurvivor?.lumi ?? 0}
                    readOnly
                    name="lumi-mobile"
                    id="lumi-mobile"
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
