'use client'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { ColorChoice, Gender } from '@/lib/enums'
import {
  SURVIVOR_COLOR_CHANGED_MESSAGE,
  SURVIVOR_DEAD_STATUS_UPDATED_MESSAGE,
  SURVIVOR_GENDER_UPDATED_MESSAGE,
  SURVIVOR_NAME_UPDATED_MESSAGE,
  SURVIVOR_RETIRED_STATUS_UPDATED_MESSAGE
} from '@/lib/messages'
import { getCardColorStyles, getColorStyle } from '@/lib/utils'
import { Survivor } from '@/schemas/survivor'
import { SkullIcon, UserXIcon } from 'lucide-react'
import {
  KeyboardEvent,
  ReactElement,
  useCallback,
  useRef,
  useState
} from 'react'

/**
 * Status Card Props
 */
interface StatusCardProps {
  /** Save Selected Survivor */
  saveSelectedSurvivor: (data: Partial<Survivor>, successMsg?: string) => void
  /** Selected Survivor */
  selectedSurvivor: Survivor | null
}

/**
 * Survivor Name, Gender, and Status Card Component
 *
 * This component allows the user to set the name, gender, and status of a survivor.
 * The form includes a text input for the name, checkboxes for male/female gender
 * selection, and checkboxes for dead/retired status. When a survivor is named,
 * they gain +1 survival.
 *
 * @param props Status Card Properties
 * @returns Status Card Component
 */
export function StatusCard({
  saveSelectedSurvivor,
  selectedSurvivor
}: StatusCardProps): ReactElement {
  const survivorIdRef = useRef<number | undefined>(undefined)

  const [survivorName, setSurvivorName] = useState(selectedSurvivor?.name ?? '')
  const [survivorColor, setSurvivorColor] = useState(
    selectedSurvivor?.color ?? ColorChoice.SLATE
  )
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false)

  if (survivorIdRef.current !== selectedSurvivor?.id) {
    survivorIdRef.current = selectedSurvivor?.id

    setSurvivorName(selectedSurvivor?.name ?? '')
    setSurvivorColor(selectedSurvivor?.color ?? ColorChoice.SLATE)
  }

  /**
   * Handle Name Input Changes
   *
   * Saves on Enter key press.
   *
   * @param e Keyboard Event
   * @param value Current Input Value
   */
  const handleNameKeyDown = (
    e: KeyboardEvent<HTMLInputElement>,
    value: string
  ) => {
    if (e.key === 'Enter') {
      e.preventDefault()

      saveSelectedSurvivor(
        { name: value },
        value.trim() ? SURVIVOR_NAME_UPDATED_MESSAGE() : undefined
      )
    }
  }

  /**
   * Handle Gender Selection Changes
   *
   * @param gender Selected Gender
   */
  const handleGenderChange = useCallback(
    (gender: Gender) =>
      saveSelectedSurvivor({ gender }, SURVIVOR_GENDER_UPDATED_MESSAGE()),
    [saveSelectedSurvivor]
  )

  /**
   * Handle Dead Toggle
   *
   * @param checked Checked State
   */
  const handleDeadToggle = useCallback(
    (checked: boolean) =>
      saveSelectedSurvivor(
        { dead: checked },
        SURVIVOR_DEAD_STATUS_UPDATED_MESSAGE(checked)
      ),
    [saveSelectedSurvivor]
  )

  /**
   * Handle Retired Toggle
   *
   * @param checked Checked State
   */
  const handleRetiredToggle = useCallback(
    (checked: boolean) =>
      saveSelectedSurvivor(
        { retired: checked },
        SURVIVOR_RETIRED_STATUS_UPDATED_MESSAGE(checked)
      ),
    [saveSelectedSurvivor]
  )

  return (
    <Card
      className="p-2 border-0"
      style={{
        ...getCardColorStyles(selectedSurvivor?.color ?? ColorChoice.SLATE),
        borderColor: 'var(--card-border-color)'
      }}>
      <CardContent className="p-0">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <Popover
              open={isColorPickerOpen}
              onOpenChange={setIsColorPickerOpen}>
              <PopoverTrigger asChild>
                <Avatar
                  className={`h-8 w-8 ${getColorStyle(survivorColor, 'bg')} items-center justify-center cursor-pointer`}
                  onClick={() => setIsColorPickerOpen(true)}
                  onContextMenu={(e) => {
                    e.preventDefault() // Prevent default right-click menu
                    setIsColorPickerOpen(true)
                  }}>
                  <AvatarFallback className="bg-transparent">
                    {(selectedSurvivor?.dead && (
                      <SkullIcon className="h-4 w-4" />
                    )) ||
                      (selectedSurvivor?.retired && !selectedSurvivor?.dead && (
                        <UserXIcon className="h-4 w-4" />
                      ))}
                  </AvatarFallback>
                </Avatar>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-2">
                <div className="grid grid-cols-6 gap-1">
                  {Object.values(ColorChoice).map((color) => {
                    const isSelected = survivorColor === color
                    return (
                      <button
                        key={color}
                        className={`h-8 w-8 rounded-full border-2 ${getColorStyle(color, 'bg')} ${
                          isSelected
                            ? 'border-white ring-2 ring-black'
                            : 'border-gray-300 hover:border-white'
                        } transition-all duration-200`}
                        onClick={() => {
                          setSurvivorColor(color)
                          setIsColorPickerOpen(false)
                          saveSelectedSurvivor(
                            { color },
                            SURVIVOR_COLOR_CHANGED_MESSAGE(color)
                          )
                        }}
                        title={color.charAt(0).toUpperCase() + color.slice(1)}
                      />
                    )
                  })}
                </div>
              </PopoverContent>
            </Popover>
            {/* Survivor Name */}
            <div className="flex-1 flex items-center gap-2">
              <Label className="font-bold text-left">Name</Label>
              <Input
                placeholder="Survivor name..."
                value={survivorName}
                onChange={(e) => setSurvivorName(e.target.value)}
                onKeyDown={(e) => handleNameKeyDown(e, e.currentTarget.value)}
              />
            </div>

            {/* Gender */}
            <div className="ml-4 flex items-center gap-2">
              <div className="flex items-center space-x-2">
                <Label htmlFor="male-checkbox" className="text-xs">
                  M
                </Label>
                <Checkbox
                  id="male-checkbox"
                  checked={selectedSurvivor?.gender === Gender.MALE}
                  onCheckedChange={(checked) => {
                    if (checked) handleGenderChange(Gender.MALE)
                  }}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Label htmlFor="female-checkbox" className="text-xs">
                  F
                </Label>
                <Checkbox
                  id="female-checkbox"
                  checked={selectedSurvivor?.gender === Gender.FEMALE}
                  onCheckedChange={(checked) => {
                    if (checked) handleGenderChange(Gender.FEMALE)
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <hr className="my-2" />

        {/* Status Section */}
        <div className="flex justify-between items-center">
          <p className="text-[10px] lg:text-xs text-muted-foreground">
            When you name your survivor, gain +1 <strong>survival</strong>.
          </p>

          <div className="flex items-center gap-2">
            {/* Dead Status */}
            <div className="flex flex-row items-center gap-1 space-y-0">
              <Checkbox
                id={`dead-checkbox-${selectedSurvivor?.id}`}
                checked={selectedSurvivor?.dead}
                onCheckedChange={handleDeadToggle}
                className="h-4 w-4 rounded-sm"
              />
              <SkullIcon className="h-3 w-3 text-muted-foreground" />
              <Label
                className="text-xs text-muted-foreground cursor-pointer"
                htmlFor={`dead-checkbox-${selectedSurvivor?.id}`}>
                Dead
              </Label>
            </div>

            {/* Retired Status */}
            <div className="flex flex-row items-center gap-1 space-y-0">
              <Checkbox
                id={`retired-checkbox-${selectedSurvivor?.id}`}
                checked={selectedSurvivor?.retired}
                onCheckedChange={handleRetiredToggle}
                className="h-4 w-4 rounded-sm"
              />
              <UserXIcon className="h-3 w-3 text-muted-foreground" />
              <Label
                className="text-xs text-muted-foreground cursor-pointer"
                htmlFor={`retired-checkbox-${selectedSurvivor?.id}`}>
                Retired
              </Label>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
