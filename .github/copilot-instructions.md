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
  - ShadCN reusable components can be found in the `src/components/ui`
    directory.
  - Where applicable, components should include `name` and `id` attributes for
    accessibility and testing purposes.

The following component implementation illustrates these standards. This
component displays an editable and draggable list of abilities for a character.

```tsx
// File: src/components/survivor/abilities-and-impairments/abilities-and-impairments-card.tsx
'use client'

import {
  AbilityImpairmentItem,
  NewAbilityImpairmentItem
} from '@/components/survivor/abilities-and-impairments/ability-impairment-item'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { getCampaign } from '@/lib/utils'
import { Survivor, SurvivorSchema } from '@/schemas/survivor'
import {
  DndContext,
  DragEndEvent,
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
import { ReactElement, useEffect, useMemo, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'
import { ZodError } from 'zod'

/**
 * Abilities and Impairments Card Component
 */
export function AbilitiesAndImpairmentsCard({
  ...form
}: UseFormReturn<Survivor>): ReactElement {
  const abilitiesAndImpairments = useMemo(
    () => form.watch('abilitiesAndImpairments') || [],
    [form]
  )

  const [disabledInputs, setDisabledInputs] = useState<{
    [key: number]: boolean
  }>({})
  const [isAddingNew, setIsAddingNew] = useState<boolean>(false)

  useEffect(() => {
    setDisabledInputs((prev) => {
      const next: { [key: number]: boolean } = {}

      abilitiesAndImpairments.forEach((_, i) => {
        next[i] = prev[i] !== undefined ? prev[i] : true
      })

      return next
    })
  }, [abilitiesAndImpairments])

  const [skipNextHuntState, setSkipNextHuntState] = useState<boolean>(
    !!form.getValues('skipNextHunt')
  )

  useEffect(
    () =>
      form.setValue('skipNextHunt', skipNextHuntState, { shouldDirty: true }),
    [skipNextHuntState, form]
  )

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  const addAbility = () => setIsAddingNew(true)

  /**
   * Save abilities/impairments to localStorage for the current survivor, with
   * Zod validation and toast feedback.
   *
   * @param updatedAbilitiesAndImpairments Updated Abilities/Impairments
   * @param successMsg Success Message
   */
  const saveToLocalStorage = (
    updatedAbilitiesAndImpairments: string[],
    successMsg?: string
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
          abilitiesAndImpairments: updatedAbilitiesAndImpairments
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

        campaign.survivors[survivorIndex].abilitiesAndImpairments =
          updatedAbilitiesAndImpairments
        localStorage.setItem('campaign', JSON.stringify(campaign))

        if (successMsg) toast.success(successMsg)
      }
    } catch (error) {
      console.error('Ability/Impairment Save Error:', error)
      toast.error('The darkness swallows your words. Please try again.')
    }
  }

  /**
   * Handles the removal of an ability or impairment.
   *
   * @param index Ability Index
   */
  const onRemove = (index: number) => {
    const currentAbilitiesAndImpairments = [...abilitiesAndImpairments]

    currentAbilitiesAndImpairments.splice(index, 1)
    form.setValue('abilitiesAndImpairments', currentAbilitiesAndImpairments)

    setDisabledInputs((prev) => {
      const next: { [key: number]: boolean } = {}

      Object.keys(prev).forEach((k) => {
        const num = parseInt(k)
        if (num < index) next[num] = prev[num]
        else if (num > index) next[num - 1] = prev[num]
      })

      return next
    })

    saveToLocalStorage(
      currentAbilitiesAndImpairments,
      'The ability/impairment has been removed.'
    )
  }

  /**
   * Handles saving a new ability or impairment.
   *
   * @param value Ability/Impairment Value
   * @param i Ability/Impairment Index (When Updating Only)
   */
  const onSave = (value?: string, i?: number) => {
    if (!value || value.trim() === '')
      return toast.error('A nameless ability/impairment cannot be recorded.')

    try {
      SurvivorSchema.shape.abilitiesAndImpairments.parse([value])
    } catch (error) {
      if (error instanceof ZodError) return toast.error(error.errors[0].message)
      else
        return toast.error(
          'The darkness swallows your words. Please try again.'
        )
    }

    const updatedAbilitiesAndImpairments = [...abilitiesAndImpairments]

    if (i !== undefined) {
      // Updating an existing value
      updatedAbilitiesAndImpairments[i] = value
      form.setValue(`abilitiesAndImpairments.${i}`, value)

      setDisabledInputs((prev) => ({
        ...prev,
        [i]: true
      }))
    } else {
      // Adding a new value
      updatedAbilitiesAndImpairments.push(value)

      form.setValue('abilitiesAndImpairments', updatedAbilitiesAndImpairments)

      setDisabledInputs((prev) => ({
        ...prev,
        [updatedAbilitiesAndImpairments.length - 1]: true
      }))
    }

    saveToLocalStorage(
      updatedAbilitiesAndImpairments,
      i !== undefined
        ? 'The ability/impairment has been updated.'
        : 'The survivor gains a new ability/impairment.'
    )
    setIsAddingNew(false)
  }

  /**
   * Enables editing a value.
   *
   * @param index Ability Index
   */
  const onEdit = (index: number) =>
    setDisabledInputs((prev) => ({ ...prev, [index]: false }))

  /**
   * Handles the end of a drag event for reordering values.
   *
   * @param event Drag End Event
   */
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = parseInt(active.id.toString())
      const newIndex = parseInt(over.id.toString())
      const newOrder = arrayMove(abilitiesAndImpairments, oldIndex, newIndex)

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
    <Card className="p-0 pb-1 mt-1 border-3">
      <CardHeader className="px-2 py-1">
        <div className="flex justify-between items-center">
          {/* Title */}
          <CardTitle className="text-md flex flex-row items-center gap-1 h-8">
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
              Skip Next Hunt
            </Label>
          </div>
        </div>
      </CardHeader>

      {/* Abilities/Impairments List */}
      <CardContent className="p-1 pb-0">
        <div className="space-y-1">
          {abilitiesAndImpairments.length !== 0 && (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}>
              <SortableContext
                items={abilitiesAndImpairments.map((_, index) =>
                  index.toString()
                )}
                strategy={verticalListSortingStrategy}>
                {abilitiesAndImpairments.map((ability, index) => (
                  <AbilityImpairmentItem
                    key={index}
                    id={index.toString()}
                    index={index}
                    form={form}
                    onRemove={onRemove}
                    isDisabled={!!disabledInputs[index]}
                    onSave={(value, i) => onSave(value, i)}
                    onEdit={onEdit}
                  />
                ))}
              </SortableContext>
            </DndContext>
          )}
          {isAddingNew && (
            <NewAbilityImpairmentItem
              onSave={onSave}
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
// File: src/components/survivor/abilities-and-impairments/ability-impairment-item.tsx
'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Survivor } from '@/schemas/survivor'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { CheckIcon, GripVertical, PencilIcon, TrashIcon } from 'lucide-react'
import { KeyboardEvent, ReactElement, useEffect, useRef } from 'react'
import { UseFormReturn } from 'react-hook-form'

/**
 * Ability/Impairment Item Component Properties
 */
export interface AbilityImpairmentItemProps {
  /** Form */
  form: UseFormReturn<Survivor>
  /** Ability ID */
  id: string
  /** Index */
  index: number
  /** Is Disabled */
  isDisabled: boolean
  /** OnEdit Handler */
  onEdit: (index: number) => void
  /** OnRemove Handler */
  onRemove: (index: number) => void
  /** OnSave Handler */
  onSave: (value?: string, index?: number) => void
}

/**
 * New Ability/Impairment Item Component Properties
 */
export interface NewAbilityImpairmentItemProps {
  /** OnCancel Handler */
  onCancel: () => void
  /** OnSave Handler */
  onSave: (value?: string) => void
}

/**
 * Ability/Impairment Item Component
 *
 * @param props Ability/Impairment Item Component Properties
 * @returns Ability/Impairment Item Component
 */
export function AbilityImpairmentItem({
  id,
  index,
  isDisabled,
  form,
  onEdit,
  onRemove,
  onSave
}: AbilityImpairmentItemProps): ReactElement {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id })

  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (inputRef.current)
      inputRef.current.value =
        form.getValues(`abilitiesAndImpairments.${index}`) || ''

    if (!isDisabled && inputRef.current) {
      inputRef.current.focus()

      const val = inputRef.current.value
      inputRef.current.value = ''
      inputRef.current.value = val
    }
  }, [form, isDisabled, index])

  /**
   * Handles the key down event for the input field.
   *
   * If the Enter key is pressed, it calls the onSave function with the current
   * index and value.
   *
   * @param e Key Down Event
   */
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter' && inputRef.current) {
      e.preventDefault()
      onSave(inputRef.current.value, index)
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className="flex items-center gap-2">
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing p-1">
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </div>

      {/* Input Field */}
      {isDisabled ? (
        <div className="flex ml-1">
          <span className="text-sm">
            {form.getValues(`abilitiesAndImpairments.${index}`)}
          </span>
        </div>
      ) : (
        <Input
          ref={inputRef}
          placeholder="Ability or Impairment"
          defaultValue={form.getValues(`abilitiesAndImpairments.${index}`)}
          disabled={isDisabled}
          onKeyDown={handleKeyDown}
          autoFocus
        />
      )}

      <div className="flex items-center gap-1 ml-auto">
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
            onClick={() => onSave(inputRef.current!.value, index)}
            title="Save ability">
            <CheckIcon className="h-4 w-4" />
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          type="button"
          onClick={() => onRemove(index)}>
          <TrashIcon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

/**
 * New Ability/Impairment Item Component
 *
 * @param props New Ability/Impairment Item Component Props
 */
export function NewAbilityImpairmentItem({
  onCancel,
  onSave
}: NewAbilityImpairmentItemProps): ReactElement {
  const inputRef = useRef<HTMLInputElement>(null)

  /**
   * Handles the key down event for the input field.
   *
   * If the Enter key is pressed, calls the onSave function with the current
   * value. If the Escape key is pressed, it calls the onCancel function.
   *
   * @param e Key Down Event
   */
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter' && inputRef.current) {
      e.preventDefault()
      onSave(inputRef.current.value)
    } else if (e.key === 'Escape') {
      e.preventDefault()
      onCancel()
    }
  }

  return (
    <div className="flex items-center gap-2">
      {/* Drag Handle */}
      <div className="p-1">
        <GripVertical className="h-4 w-4 text-muted-foreground opacity-50" />
      </div>

      {/* Input Field */}
      <Input
        ref={inputRef}
        placeholder="Ability or Impairment"
        defaultValue={''}
        onKeyDown={handleKeyDown}
        autoFocus
      />

      <div className="flex items-center gap-1 ml-auto">
        {/* Interaction Buttons */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => onSave(inputRef.current?.value)}
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
