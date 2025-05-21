# Copilot Instructions

Each of the following sections contains a list of instructions for Copilot to
follow when generating code. The instructions are grouped by category.

## React Components

- When a parent element contains a one or more `Checkbox` components, they
  should be separated from each other (and preceding/following text) using
  `gap-2`.
- All React components should follow the same coding standards.
  - All components should be written in TypeScript.
  - Inputs should be uncontrolled components.
  - JSDoc comments should be used to document all components.
  - Input and return types should be explicitly defined.
  - If a component is used to display an editable list of items, the items
    themselves should be created as separate components.
  - When values are modified and saved, the component should save the values to
    localStorage following the appropriate schema.
  - If the user is creating, editing, or deleting a value, the component should
    provide feedback to the user using toast notifications from the `sonner`
    library.
  - If the input field is a numerical input, it should be saved on change, not
    on blur.
  - If the input field is a text input, it should be saved on Enter key is
    pressed.

The following component implementation illustrates these standards. This
component displays an editable and draggable list of abilities for a character.

```tsx
// File: src/components/survivor/abilities-and-impairments/abilities-and-impai'use client'

import {
  AbilityItem,
  NewAbilityItem
} from '@/components/survivor/abilities-and-impairments/ability-item'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { getCampaign } from '@/lib/utils'
import { Survivor, SurvivorSchema } from '@/schemas/survivor'
import type { DragEndEvent } from '@dnd-kit/core'
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors
} from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy
} from '@dnd-kit/sortable'
import { PlusIcon } from 'lucide-react'
import { ReactElement, useEffect, useRef, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'
import { ZodError } from 'zod'

/**
 * Abilities and Impairments Card Component
 */
export function AbilitiesAndImpairmentsCard({
  ...form
}: UseFormReturn<Survivor>): ReactElement {
  const formValues = form.getValues()

  // Use ref to avoid circular dependencies in effects
  const abilitiesRef = useRef<string[]>(
    formValues.abilitiesAndImpairments || []
  )

  // Watch for changes in the abilities field
  const abilities = form.watch('abilitiesAndImpairments')

  // Update our ref when abilities change
  useEffect(() => {
    if (abilities) abilitiesRef.current = abilities
  }, [abilities])

  // Use a local state to track the checkbox to avoid infinite loop
  const [skipNextHuntState, setSkipNextHuntState] = useState<boolean>(
    !!form.getValues('skipNextHunt')
  )

  // Update form value when skipNextHuntState changes
  useEffect(
    () =>
      form.setValue('skipNextHunt', skipNextHuntState, { shouldDirty: true }),
    [skipNextHuntState, form]
  )

  const [disabledInputs, setDisabledInputs] = useState<{
    [key: number]: boolean
  }>({})
  const [isAddingNew, setIsAddingNew] = useState<boolean>(false)

  useEffect(() => {
    setDisabledInputs((prev) => {
      const next: { [key: number]: boolean } = {}

      abilitiesRef.current.forEach((_, i) => {
        next[i] = prev[i] !== undefined ? prev[i] : true
      })

      return next
    })
  }, [abilities])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  const addAbility = () => setIsAddingNew(true)

  /**
   * Save abilities and impairments to localStorage for the current survivor.
   *
   * @param updatedAbilities Updated Abilities
   */
  const saveToLocalStorage = (updatedAbilities: string[]) => {
    try {
      const formValues = form.getValues()
      const campaign = getCampaign()

      const survivorIndex = campaign.survivors.findIndex(
        (s: { id: number }) => s.id === formValues.id
      )

      if (survivorIndex !== -1) {
        campaign.survivors[survivorIndex].abilitiesAndImpairments =
          updatedAbilities
        localStorage.setItem('campaign', JSON.stringify(campaign))
      }
    } catch (error) {
      console.error('Abilities/Impairments Save Error:', error)
    }
  }

  /**
   * Handles the removal of an ability or impairment.
   *
   * @param index Ability Index
   */
  const handleRemoveAbility = (index: number) => {
    const currentAbilities = [...abilitiesRef.current]

    currentAbilities.splice(index, 1)
    form.setValue('abilitiesAndImpairments', currentAbilities)
    saveToLocalStorage(currentAbilities)

    setDisabledInputs((prev) => {
      const next: { [key: number]: boolean } = {}

      Object.keys(prev).forEach((k) => {
        const num = parseInt(k)
        if (num < index) next[num] = prev[num]
        else if (num > index) next[num - 1] = prev[num]
      })

      return next
    })

    toast.success('The ability or impairment has been removed.')
  }

  /**
   * Handles the saving of a new ability or impairment.
   *
   * @param value Ability Value
   * @param i Ability Index (Updating Only)
   */
  const saveAbility = (value: string, i?: number) => {
    try {
      SurvivorSchema.shape.abilitiesAndImpairments.parse([value])
    } catch (error) {
      if (error instanceof ZodError) return toast.error(error.errors[0].message)
    }

    const abilitiesAndImpairments =
      i !== undefined
        ? [...abilitiesRef.current]
        : [...abilitiesRef.current, value]

    if (i !== undefined) {
      abilitiesAndImpairments[i] = value
      form.setValue(`abilitiesAndImpairments.${i}`, value)
      setDisabledInputs((prev) => ({
        ...prev,
        [i]: true
      }))
    } else {
      form.setValue('abilitiesAndImpairments', abilitiesAndImpairments)
      setDisabledInputs((prev) => ({
        ...prev,
        [abilitiesAndImpairments.length - 1]: true
      }))
    }

    saveToLocalStorage(abilitiesAndImpairments)
    setIsAddingNew(false)

    toast.success('The ability or impairment has been added.')
  }

  /**
   * Enables the input for editing.
   *
   * @param index Ability Index
   */
  const editAbility = (index: number) =>
    setDisabledInputs((prev) => ({ ...prev, [index]: false }))

  /**
   * Handles the end of a drag event for reordering values.
   *
   * @param event Drag Event
   */
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = parseInt(active.id.toString())
      const newIndex = parseInt(over.id.toString())
      const newOrder = arrayMove(abilitiesRef.current, oldIndex, newIndex)

      form.setValue('abilitiesAndImpairments', newOrder)
      saveToLocalStorage(newOrder)

      setDisabledInputs((prev) => {
        const next: { [key: number]: boolean } = {}

        Object.keys(prev).forEach((k) => {
          const num = parseInt(k)
          if (num === oldIndex) next[newIndex] = prev[num]
          else if (num >= newIndex && num < oldIndex) next[num + 1] = prev[num]
          else if (num <= newIndex && num > oldIndex) next[num - 1] = prev[num]
          else next[num] = prev[num]
        })

        return next
      })
    }
  }

  return (
    <Card className="mt-1 border-0">
      <CardHeader className="px-3 py-2 pb-2">
        <div className="flex justify-between items-center">
          {/* Title */}
          <CardTitle className="text-md flex flex-row items-center gap-1 h-4">
            Abilities & Impairments{' '}
            {!isAddingNew && (
              <div className="flex justify-center">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={addAbility}
                  className="border-0 h-8 w-8"
                  disabled={
                    isAddingNew ||
                    Object.values(disabledInputs).some((v) => v === false)
                  }>
                  <PlusIcon className="h-4 w-4" />
                </Button>
              </div>
            )}
          </CardTitle>

          {/* Skip Next Hunt */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="skipNextHunt"
              checked={skipNextHuntState}
              onCheckedChange={(checked) => {
                if (typeof checked === 'boolean') setSkipNextHuntState(checked)
              }}
            />
            <Label htmlFor="skipNextHunt" className="text-xs cursor-pointer">
              Skip next hunt
            </Label>
          </div>
        </div>
      </CardHeader>

      {/* Abilities/Impairments List */}
      <CardContent className="pb-2 pt-1">
        <div className="space-y-2">
          {abilitiesRef.current.length !== 0 && (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}>
              <SortableContext
                items={abilitiesRef.current.map((_, index) => index.toString())}
                strategy={verticalListSortingStrategy}>
                {abilitiesRef.current.map((ability, index) => (
                  <AbilityItem
                    key={index}
                    id={index.toString()}
                    index={index}
                    form={form}
                    handleRemoveAbility={handleRemoveAbility}
                    isDisabled={!!disabledInputs[index]}
                    onSave={(i, value) => saveAbility(value, i)}
                    onEdit={editAbility}
                  />
                ))}
              </SortableContext>
            </DndContext>
          )}
          {isAddingNew && (
            <NewAbilityItem
              onSave={saveAbility}
              onCancel={() => setIsAddingNew(false)}
            />
          )}
        </div>
      </CardContent>
    </Card>
  )
}
```

Since this component is used to display an editable list of items, the items
themselves are created as separate components, below.

```tsx
'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Survivor } from '@/schemas/survivor'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { CheckIcon, GripVertical, PencilIcon, TrashIcon } from 'lucide-react'
import { ReactElement, useEffect, useRef } from 'react'
import { UseFormReturn } from 'react-hook-form'

/**
 * Ability Item Component Properties
 */
export interface AbilityItemProps {
  /** Form */
  form: UseFormReturn<Survivor>
  /** Remove Ability Handler */
  handleRemoveAbility: (index: number) => void
  /** Ability ID */
  id: string
  /** Index */
  index: number
  /** Is Disabled */
  isDisabled: boolean
  /** OnEdit Handler */
  onEdit: (index: number) => void
  /** OnSave Handler */
  onSave: (index: number, value: string) => void
}

/**
 * New Ability Item Component Properties
 */
export interface NewAbilityItemProps {
  /** OnCancel Handler */
  onCancel: () => void
  /** OnSave Handler */
  onSave: (value: string) => void
}

/**
 * Ability Item Component
 *
 * @param props Ability Item Component Props
 */
export function AbilityItem({
  index,
  form,
  handleRemoveAbility,
  id,
  isDisabled,
  onSave,
  onEdit
}: AbilityItemProps): ReactElement {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id })

  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (inputRef.current)
      inputRef.current.value =
        form.getValues(`abilitiesAndImpairments.${index}`) || ''
  }, [form, isDisabled, index])

  /**
   * Handles the key down event for the input field. If the Enter key is
   * pressed, it prevents the default action and calls the onSave function with
   * the current index and value.
   *
   * @param e Event
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputRef.current) {
      e.preventDefault()
      onSave(index, inputRef.current.value)
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className="flex items-center">
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing p-1">
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </div>

      {/* Input Field */}
      <Input
        ref={inputRef}
        placeholder="Ability or Impairment"
        defaultValue={form.getValues(`abilitiesAndImpairments.${index}`)}
        disabled={isDisabled}
        onKeyDown={handleKeyDown}
        className="flex-1 mr-2"
      />

      {/* Interaction Buttons */}
      {isDisabled ? (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => onEdit(index)}
          title="Edit ability">
          <PencilIcon className="h-4 w-4" />
        </Button>
      ) : (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => {
            if (inputRef.current && inputRef.current.value)
              onSave(index, inputRef.current.value)
          }}
          title="Save ability">
          <CheckIcon className="h-4 w-4" />
        </Button>
      )}
      <Button
        variant="ghost"
        size="icon"
        type="button"
        onClick={() => handleRemoveAbility(index)}>
        <TrashIcon className="h-4 w-4" />
      </Button>
    </div>
  )
}

/**
 * New Ability Item Component
 *
 * @param props New Ability Item Component Props
 */
export function NewAbilityItem({
  onSave,
  onCancel
}: NewAbilityItemProps): ReactElement {
  const inputRef = useRef<HTMLInputElement>(null)

  /**
   * Handles the key down event for the input field.
   *
   * If the Enter key is pressed, it prevents the default action and calls the
   * onSave function with the current value. If the Escape key is pressed, it
   * calls the onCancel function.
   *
   * @param e Event
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputRef.current) {
      e.preventDefault()
      onSave(inputRef.current.value)
    } else if (e.key === 'Escape') onCancel()
  }

  return (
    <div className="flex items-center">
      <div className="p-1">
        <GripVertical className="h-4 w-4 text-muted-foreground opacity-50" />
      </div>
      {/* Input Field */}
      <Input
        ref={inputRef}
        placeholder="Ability or Impairment"
        defaultValue={''}
        onKeyDown={handleKeyDown}
        className="flex-1 mr-2"
        autoFocus
      />

      {/* Interaction Buttons */}
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => {
          if (inputRef.current && inputRef.current.value)
            onSave(inputRef.current.value)
        }}
        title="Save ability">
        <CheckIcon className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={onCancel}
        title="Cancel">
        <TrashIcon className="h-4 w-4" />
      </Button>
    </div>
  )
}
```

## Object Schemas

- All object schemas should be created using the `zod` library.
- All object schemas should be created in the `src/schemas` directory.
- All object schemas should be created in a file named after the object schema.
  For example, the `Survivor` schema should be created in
  `src/schemas/survivor.ts`.
- All object schemas should be created using the `z.object` function.
- Validation and parsing should be done using the `zod` library.
- All refinements should include appropriate error messages.

## User Messaging

- All user messaging should be done using the `sonner` library.
- All messages should be displayed using the `toast` function.
- If an error occurs while parsing an input value against the Zod schema, the
  error message from the raised `ZodError` should be used in the toast
  notification. If no error message is provided, the following message should be
  displayed using the `toast.error` function.

  ```plain
  The darkness swallows your words. Please try again.
  ```

- If an error occurs, the following message should be displayed using the
  `toast.error` function.

  ```plain
  The darkness swallows your words. Please try again.
  ```

- If an error occurs, it should be logged to the console with appropriate
  leading information to identify it. For example,
  `console.error('Attribute Save Error:', error)`.

## Theme

Use the following text as thematic inspiration for any user-facing notifications
and text.

```plain
Kingdom Death's world is immensely deep and brutally challenging. It will
captivate the imagination and stoke the fires of obsession.

In a place of stone faces, nameless survivors stand together. They have nothing.
Only a lantern to light their struggle.
```

Other terms and phrases that can be used to describe the game include:

- Lanterns as a source of light and hope.
- Darkness as a source of fear and despair.
- Overwhelming odds.
- Struggle for survival.
- Victory rarely achieved, and at great cost.
