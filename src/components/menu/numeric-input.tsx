'use client'

import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from '@/components/ui/drawer'
import { Input } from '@/components/ui/input'
import { useIsMobile } from '@/hooks/use-mobile'
import { Minus, Plus } from 'lucide-react'
import { ReactElement } from 'react'

/**
 * Numeric Input Properties
 */
interface NumericInputProps {
  /** Current Value */
  value: number
  /** Minimum Allowed Value (undefined for no minimum) */
  min?: number
  /** Maximum Allowed Value (undefined for no maximum) */
  max?: number
  /** Step Increment/Decrement */
  step?: number
  /** Label */
  label: string
  /** On Change Function */
  onChange: (value: number) => void
  /** Child Element */
  children: React.ReactNode
  /** Read Only Mode */
  readOnly: boolean
}

/**
 * Numeric Input Component
 *
 * A reusable input component for desktop/mobile devices. On desktop, it
 * functions as a standard numeric input field. On mobile, it provides
 * increment/ decrement buttons for better touch interaction.
 *
 * @param props Numeric Input Properties
 * @returns Numeric Input Component
 */
export function NumericInput({
  value,
  min,
  max,
  step = 1,
  label,
  onChange,
  children,
  readOnly
}: NumericInputProps): ReactElement {
  const isMobile = useIsMobile()

  /**
   * Handle Increment
   */
  const handleIncrement = () => {
    const newValue = value + step

    if (max === undefined || newValue <= max) onChange(newValue)
  }

  /**
   * Handle Decrement
   */
  const handleDecrement = () => {
    const newValue = value - step

    if (min === undefined || newValue >= min) onChange(newValue)
  }

  return isMobile ? (
    <Drawer>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-center">
          <DrawerTitle>{label}</DrawerTitle>
        </DrawerHeader>

        <div className="px-4 pb-4">
          <div className="flex items-center justify-center gap-4">
            {/* Decrement Button */}
            <Button
              variant="outline"
              size="icon"
              onClick={handleDecrement}
              disabled={readOnly || (min !== undefined && value <= min)}
              className="h-12 w-12 rounded-full"
              name="decrement"
              id="decrement-button">
              <Minus className="h-6 w-6" />
            </Button>

            {/* Current Value Display */}
            <div className="flex flex-col items-center gap-2">
              <Input
                type="number"
                value={value}
                readOnly
                className="w-20 h-12 text-center text-xl font-semibold focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                name={`${label.toLowerCase().replace(/\s+/g, '-')}-value`}
                id={`${label.toLowerCase().replace(/\s+/g, '-')}-value`}
              />
            </div>

            {/* Increment Button */}
            <Button
              variant="outline"
              size="icon"
              onClick={handleIncrement}
              disabled={readOnly || (max !== undefined && value >= max)}
              className="h-12 w-12 rounded-full"
              name="increment"
              id="increment-button">
              <Plus className="h-6 w-6" />
            </Button>
          </div>
        </div>

        <DrawerFooter className="flex justify-center w-full items-center">
          <DrawerClose asChild>
            <Button
              variant="outline"
              className="w-[150px]"
              name="close-drawer"
              id="close-drawer-button">
              Go Back
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ) : (
    <>{children}</>
  )
}
