'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { HuntMonster } from '@/schemas/hunt'
import { ShowdownMonster } from '@/schemas/showdown'
import { CheckIcon, PencilIcon, PlusIcon, TrashIcon } from 'lucide-react'
import { KeyboardEvent, ReactElement, useEffect, useRef } from 'react'

/**
 * Monster Traits Moods Component Properties
 */
interface MonsterTraitsMoodsProps {
  /** Disabled Moods */
  disabledMoods: { [key: number]: boolean }
  /** Disabled Traits */
  disabledTraits: { [key: number]: boolean }
  /** Is Adding Mood */
  isAddingMood: boolean
  /** Is Adding Trait */
  isAddingTrait: boolean
  /** Monster data */
  monster: HuntMonster | ShowdownMonster
  /** On Edit Mood */
  onEditMood: (index: number) => void
  /** On Edit Trait */
  onEditTrait: (index: number) => void
  /** On Remove Mood */
  onRemoveMood: (index: number) => void
  /** On Remove Trait */
  onRemoveTrait: (index: number) => void
  /** On Save Mood */
  onSaveMood: (value?: string, index?: number) => void
  /** On Save Trait */
  onSaveTrait: (value?: string, index?: number) => void
  /** Set Is Adding Mood */
  setIsAddingMood: (value: boolean) => void
  /** Set Is Adding Trait */
  setIsAddingTrait: (value: boolean) => void
}

/**
 * Trait Item Component
 */
function TraitItem({
  trait,
  index,
  isDisabled,
  onEdit,
  onRemove,
  onSave
}: {
  trait: string
  index: number
  isDisabled: boolean
  onEdit: (index: number) => void
  onRemove: (index: number) => void
  onSave: (value?: string, index?: number) => void
}): ReactElement {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (inputRef.current) inputRef.current.value = trait
  }, [trait])

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputRef.current) {
      e.preventDefault()
      onSave(inputRef.current.value, index)
    }
  }

  return (
    <div className="flex items-center gap-2">
      {isDisabled ? (
        <div className="flex ml-1">
          <span className="text-sm">{trait}</span>
        </div>
      ) : (
        <Input
          ref={inputRef}
          placeholder="Trait"
          defaultValue={trait}
          disabled={isDisabled}
          onKeyDown={handleKeyDown}
        />
      )}

      <div className="flex items-center gap-1 ml-auto">
        {isDisabled ? (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onEdit(index)}
            title="Edit trait">
            <PencilIcon className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onSave(inputRef.current?.value, index)}
            title="Save trait">
            <CheckIcon className="h-4 w-4" />
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          type="button"
          onClick={() => onRemove(index)}
          title="Remove trait">
          <TrashIcon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

/**
 * New Trait Item Component
 */
function NewTraitItem({
  onCancel,
  onSave
}: {
  onCancel: () => void
  onSave: (value?: string) => void
}): ReactElement {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
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
      <Input
        ref={inputRef}
        placeholder="Trait"
        defaultValue={''}
        onKeyDown={handleKeyDown}
      />

      <div className="flex items-center gap-1 ml-auto">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => onSave(inputRef.current?.value)}
          title="Save trait">
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

/**
 * Mood Item Component
 */
function MoodItem({
  mood,
  index,
  isDisabled,
  onEdit,
  onRemove,
  onSave
}: {
  mood: string
  index: number
  isDisabled: boolean
  onEdit: (index: number) => void
  onRemove: (index: number) => void
  onSave: (value?: string, index?: number) => void
}): ReactElement {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (inputRef.current) inputRef.current.value = mood
  }, [mood])

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputRef.current) {
      e.preventDefault()
      onSave(inputRef.current.value, index)
    }
  }

  return (
    <div className="flex items-center gap-2">
      {isDisabled ? (
        <div className="flex ml-1">
          <span className="text-sm">{mood}</span>
        </div>
      ) : (
        <Input
          ref={inputRef}
          placeholder="Mood"
          defaultValue={mood}
          disabled={isDisabled}
          onKeyDown={handleKeyDown}
        />
      )}

      <div className="flex items-center gap-1 ml-auto">
        {isDisabled ? (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onEdit(index)}
            title="Edit mood">
            <PencilIcon className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onSave(inputRef.current?.value, index)}
            title="Save mood">
            <CheckIcon className="h-4 w-4" />
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          type="button"
          onClick={() => onRemove(index)}
          title="Remove mood">
          <TrashIcon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

/**
 * New Mood Item Component
 */
function NewMoodItem({
  onCancel,
  onSave
}: {
  onCancel: () => void
  onSave: (value?: string) => void
}): ReactElement {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
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
      <Input
        ref={inputRef}
        placeholder="Mood"
        defaultValue={''}
        onKeyDown={handleKeyDown}
      />

      <div className="flex items-center gap-1 ml-auto">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => onSave(inputRef.current?.value)}
          title="Save mood">
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

/**
 * Monster Traits Moods Component
 *
 * Displays and manages the monster's traits and moods using a card-based layout
 * similar to the disorders component.
 *
 * @param props Monster Traits Moods Properties
 * @returns Monster Traits Moods Component
 */
export function MonsterTraitsMoods({
  disabledMoods,
  disabledTraits,
  isAddingMood,
  isAddingTrait,
  monster,
  onEditMood,
  onEditTrait,
  onRemoveMood,
  onRemoveTrait,
  onSaveMood,
  onSaveTrait,
  setIsAddingMood,
  setIsAddingTrait
}: MonsterTraitsMoodsProps): ReactElement {
  return (
    <>
      {/* Traits */}
      <div className="mb-2 lg:mt-2">
        <h3 className="text-sm font-semibold text-muted-foreground text-center">
          Traits
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => setIsAddingTrait(true)}
            className="border-0 h-6 w-6 ml-2 align-middle"
            disabled={
              isAddingTrait ||
              Object.values(disabledTraits).some((v) => v === false)
            }>
            <PlusIcon className="h-4 w-4" />
          </Button>
        </h3>
      </div>

      <div className="flex flex-col">
        <div className="flex-1">
          {monster.traits?.map((trait, index) => (
            <TraitItem
              key={index}
              trait={trait}
              index={index}
              isDisabled={!!disabledTraits[index]}
              onEdit={onEditTrait}
              onRemove={onRemoveTrait}
              onSave={onSaveTrait}
            />
          ))}
          {isAddingTrait && (
            <NewTraitItem
              onSave={onSaveTrait}
              onCancel={() => setIsAddingTrait(false)}
            />
          )}
        </div>
      </div>

      <Separator className="my-2" />

      {/* Moods */}
      <div className="mb-2">
        <h3 className="text-sm font-semibold text-muted-foreground text-center">
          Moods
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => setIsAddingMood(true)}
            className="border-0 h-6 w-6 ml-2 align-middle"
            disabled={
              isAddingMood ||
              Object.values(disabledMoods).some((v) => v === false)
            }>
            <PlusIcon className="h-4 w-4" />
          </Button>
        </h3>
      </div>

      <div className="flex flex-col pb-2">
        <div className="flex-1">
          {monster.moods?.map((mood, index) => (
            <MoodItem
              key={index}
              mood={mood}
              index={index}
              isDisabled={!!disabledMoods[index]}
              onEdit={onEditMood}
              onRemove={onRemoveMood}
              onSave={onSaveMood}
            />
          ))}
          {isAddingMood && (
            <NewMoodItem
              onSave={onSaveMood}
              onCancel={() => setIsAddingMood(false)}
            />
          )}
        </div>
      </div>
    </>
  )
}
