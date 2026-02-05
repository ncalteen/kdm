'use client'

import { Button } from '@/components/ui/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  CheckIcon,
  ChevronDown,
  PencilIcon,
  PlusIcon,
  Trash2
} from 'lucide-react'
import { ReactElement, useState } from 'react'

/**
 * Locations Data Properties
 */
export interface LocationsDataProps {
  /** Location names */
  locations: string[]
  /** Update locations callback */
  onLocationsChange: (locations: string[]) => void
  /** Initial disabled indexes (for editing existing data) */
  initialDisabledIndexes?: number[]
}

/**
 * Locations Data Component
 *
 * Manages settlement locations for quarry monsters.
 *
 * @param props Locations Data Properties
 * @returns Locations Data Component
 */
export function LocationsData({
  locations,
  onLocationsChange,
  initialDisabledIndexes
}: LocationsDataProps): ReactElement {
  const [isOpen, setIsOpen] = useState(false)
  const [disabledInputs, setDisabledInputs] = useState<{
    [key: number]: boolean
  }>(() => {
    if (!initialDisabledIndexes) return {}
    return initialDisabledIndexes.reduce(
      (acc, idx) => ({ ...acc, [idx]: true }),
      {}
    )
  })
  const [isAddingNew, setIsAddingNew] = useState<boolean>(false)

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Button variant="outline" className="w-full justify-between">
          <span>Settlement Locations</span>
          <ChevronDown
            className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-1 ml-2">
        <div className="space-y-2">
          <div className="flex items-center justify-between h-8">
            <Label>Locations</Label>
            {!isAddingNew && (
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => setIsAddingNew(true)}
                className="border-0 h-8 w-8"
                disabled={
                  isAddingNew ||
                  Object.values(disabledInputs).some((v) => v === false)
                }>
                <PlusIcon className="h-4 w-4" />
              </Button>
            )}
          </div>
          <div className="ml-2">
            {locations.map((location, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="flex-1">
                  {disabledInputs[index] ? (
                    <span className="text-sm">{location}</span>
                  ) : (
                    <Input
                      placeholder="Location name"
                      defaultValue={location}
                      onChange={(e) => {
                        const newLocations = [...locations]
                        newLocations[index] = e.target.value
                        onLocationsChange(newLocations)
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          setDisabledInputs((prev) => ({
                            ...prev,
                            [index]: true
                          }))
                        }
                      }}
                    />
                  )}
                </div>
                <div className="flex items-center gap-1">
                  {disabledInputs[index] ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        setDisabledInputs((prev) => ({
                          ...prev,
                          [index]: false
                        }))
                      }>
                      <PencilIcon className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        setDisabledInputs((prev) => ({
                          ...prev,
                          [index]: true
                        }))
                      }>
                      <CheckIcon className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      const newLocations = locations.filter(
                        (_, i) => i !== index
                      )
                      onLocationsChange(newLocations)
                      const newDisabled = { ...disabledInputs }
                      delete newDisabled[index]
                      Object.keys(newDisabled).forEach((k) => {
                        const num = parseInt(k)
                        if (num > index) {
                          newDisabled[num - 1] = newDisabled[num]
                          delete newDisabled[num]
                        }
                      })
                      setDisabledInputs(newDisabled)
                    }}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            {isAddingNew && (
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <Input
                    id="new-location-name"
                    placeholder="Location name"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        const input = document.getElementById(
                          'new-location-name'
                        ) as HTMLInputElement
                        const name = input?.value ?? ''
                        if (name.trim()) {
                          const newLocations = [...locations, name]
                          onLocationsChange(newLocations)
                          setDisabledInputs((prev) => ({
                            ...prev,
                            [locations.length]: true
                          }))
                          setIsAddingNew(false)
                        }
                      } else if (e.key === 'Escape') {
                        e.preventDefault()
                        setIsAddingNew(false)
                      }
                    }}
                  />
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      const input = document.getElementById(
                        'new-location-name'
                      ) as HTMLInputElement
                      const name = input?.value ?? ''
                      if (name.trim()) {
                        const newLocations = [...locations, name]
                        onLocationsChange(newLocations)
                        setDisabledInputs((prev) => ({
                          ...prev,
                          [locations.length]: true
                        }))
                        setIsAddingNew(false)
                      }
                    }}>
                    <CheckIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsAddingNew(false)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
