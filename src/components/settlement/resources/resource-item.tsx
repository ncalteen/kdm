'use client'

import { NumericInput } from '@/components/menu/numeric-input'
import { ResourceCategoriesCombobox } from '@/components/settlement/resources/resource-categories-combobox'
import { ResourceMonsterCombobox } from '@/components/settlement/resources/resource-monster-combobox'
import { ResourceTypesCombobox } from '@/components/settlement/resources/resource-types-combobox'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useIsMobile } from '@/hooks/use-mobile'
import { MonsterNode, ResourceCategory, ResourceType } from '@/lib/enums'
import { Settlement } from '@/schemas/settlement'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { CheckIcon, GripVertical, PencilIcon, TrashIcon } from 'lucide-react'
import { KeyboardEvent, ReactElement, useRef, useState } from 'react'

/**
 * Resource Item Component Properties
 */
export interface ResourceItemProps {
  /** Resource Item ID */
  id: string
  /** Resource Item Index */
  index: number
  /** Is Disabled */
  isDisabled: boolean
  /** On Amount Change Handler */
  onAmountChange?: (index: number, amount: number) => void
  /** On Edit Handler */
  onEdit: (index: number) => void
  /** On Remove Handler */
  onRemove: (index: number) => void
  /** On Save Handler */
  onSave: (
    index: number,
    name: string,
    category: ResourceCategory,
    types: ResourceType[],
    amount: number,
    monsterName?: string,
    monsterNode?: MonsterNode
  ) => void
  /** Selected Settlement */
  selectedSettlement: Settlement | null
}

/**
 * New Resource Item Component Properties
 */
export interface NewResourceItemProps {
  /** On Cancel Handler */
  onCancel: () => void
  /** On Save Handler */
  onSave: (
    name: string,
    category: ResourceCategory,
    types: ResourceType[],
    amount: number,
    monsterName?: string,
    monsterNode?: MonsterNode
  ) => void
  /** Selected Settlement */
  selectedSettlement: Settlement | null
}

/**
 * Resource Item Component
 *
 * @param props Resource Item Component Properties
 * @returns Resource Item Component
 */
export function ResourceItem({
  id,
  index,
  isDisabled,
  onAmountChange,
  onEdit,
  onRemove,
  onSave,
  selectedSettlement
}: ResourceItemProps): ReactElement {
  const isMobile = useIsMobile()

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id })

  const nameInputRef = useRef<HTMLInputElement>(null)
  const amountInputRef = useRef<HTMLInputElement>(null)

  const [selectedCategory, setSelectedCategory] = useState<ResourceCategory>(
    selectedSettlement?.resources?.[index].category ?? ResourceCategory.BASIC
  )
  const [selectedTypes, setSelectedTypes] = useState<ResourceType[]>(
    selectedSettlement?.resources?.[index].types ?? []
  )
  const [selectedMonsterName, setSelectedMonsterName] = useState<
    string | undefined
  >(selectedSettlement?.resources?.[index].monsterName)
  const [selectedMonsterNode, setSelectedMonsterNode] = useState<
    MonsterNode | undefined
  >(selectedSettlement?.resources?.[index].monsterNode)

  /**
   * Handle Key Down
   *
   * If the Enter key is pressed, it calls the onSave function with the current
   * index and values.
   *
   * @param e Key Down Event
   */
  const handleNameKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && nameInputRef.current && amountInputRef.current) {
      e.preventDefault()
      onSave(
        index,
        nameInputRef.current.value,
        selectedCategory,
        selectedTypes,
        Number(amountInputRef.current.value),
        selectedCategory === ResourceCategory.MONSTER
          ? selectedMonsterName
          : undefined,
        selectedCategory === ResourceCategory.MONSTER
          ? selectedMonsterNode
          : undefined
      )
    }
  }

  /**
   * Handle Monster Selection
   *
   * @param monsterName Monster Name
   * @param monsterNode Monster Node
   */
  const handleMonsterChange = (
    monsterName: string | undefined,
    monsterNode: MonsterNode | undefined
  ) => {
    setSelectedMonsterName(monsterName)
    setSelectedMonsterNode(monsterNode)
  }

  /**
   * Handle Amount Change
   *
   * @param e Change Event
   */
  const handleAmountChange = (value: number) => {
    if (onAmountChange && value >= 0) onAmountChange(index, value)
  }

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className="flex flex-col gap-2">
      <div
        className={`flex gap-2 ${isMobile ? 'items-start' : 'items-center'}`}>
        {/* Drag Handle */}
        <div
          {...attributes}
          {...listeners}
          className={`cursor-grab active:cursor-grabbing p-1 ${isMobile ? 'mt-1' : ''}`}>
          <GripVertical
            className={`h-4 w-4 text-muted-foreground ${isMobile && 'mt-0.5'}`}
          />
        </div>

        <div className="flex-1">
          {isDisabled ? (
            !isMobile ? (
              // Desktop Layout
              <div className="grid grid-cols-12 items-center gap-2">
                <div className="col-span-3 text-sm text-left flex flex-col">
                  <span>{selectedSettlement?.resources?.[index].name}</span>
                  {selectedCategory === ResourceCategory.MONSTER &&
                    selectedMonsterName && (
                      <span className="text-xs text-muted-foreground">
                        {selectedMonsterName} ({selectedMonsterNode})
                      </span>
                    )}
                </div>
                <div className="col-span-2">
                  <Badge variant="default">{selectedCategory}</Badge>
                </div>
                <div className="flex flex-wrap gap-1 col-span-4">
                  {selectedTypes.map((type) => (
                    <Badge key={type} variant="secondary" className="text-xs">
                      {type}
                    </Badge>
                  ))}
                </div>
                <div className="col-span-1">
                  <NumericInput
                    label="Resource Amount"
                    value={selectedSettlement?.resources?.[index].amount ?? 0}
                    onChange={(value) => handleAmountChange(value)}
                    min={0}
                    ref={amountInputRef}
                    className="w-16 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </div>
                <div className="col-span-2 flex justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(index)}
                    title="Edit resource">
                    <PencilIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    type="button"
                    onClick={() => onRemove(index)}>
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              // Mobile Layout
              <div className="space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <div className="text-sm flex-1 min-w-0 flex flex-col">
                    <span>{selectedSettlement?.resources?.[index].name}</span>
                    {selectedCategory === ResourceCategory.MONSTER &&
                      selectedMonsterName && (
                        <span className="text-xs text-muted-foreground">
                          {selectedMonsterName} ({selectedMonsterNode})
                        </span>
                      )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <NumericInput
                      label="Resource Amount"
                      value={selectedSettlement?.resources?.[index].amount ?? 0}
                      onChange={(value) => onAmountChange?.(index, value)}
                      min={0}
                      className="w-16 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                      ref={amountInputRef}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(index)}
                      title="Edit resource">
                      <PencilIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      type="button"
                      onClick={() => onRemove(index)}>
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex justify-start gap-2">
                  <Badge variant="default" className="text-xs">
                    {selectedCategory}
                  </Badge>
                  {selectedTypes.map((type) => (
                    <Badge key={type} variant="secondary" className="text-xs">
                      {type}
                    </Badge>
                  ))}
                </div>
              </div>
            )
          ) : !isMobile ? (
            // Desktop Edit Mode Layout
            <div className="space-y-2">
              <div className="grid grid-cols-12 items-center gap-2">
                <div className="col-span-3">
                  <Input
                    ref={nameInputRef}
                    placeholder="Resource Name"
                    defaultValue={selectedSettlement?.resources?.[index].name}
                    onKeyDown={handleNameKeyDown}
                  />
                </div>
                <div className="col-span-2">
                  <ResourceCategoriesCombobox
                    selectedCategory={selectedCategory}
                    onChange={setSelectedCategory}
                  />
                </div>
                {selectedCategory === ResourceCategory.MONSTER ? (
                  <>
                    <div className="col-span-2">
                      <ResourceTypesCombobox
                        selectedTypes={selectedTypes}
                        onChange={setSelectedTypes}
                      />
                    </div>
                    <div className="col-span-2">
                      <ResourceMonsterCombobox
                        selectedMonsterName={selectedMonsterName}
                        selectedSettlement={selectedSettlement}
                        onChange={handleMonsterChange}
                      />
                    </div>
                  </>
                ) : (
                  <div className="col-span-4">
                    <ResourceTypesCombobox
                      selectedTypes={selectedTypes}
                      onChange={setSelectedTypes}
                    />
                  </div>
                )}
                <div className="col-span-1">
                  <NumericInput
                    label="Resource Amount"
                    value={selectedSettlement?.resources?.[index].amount ?? 0}
                    onChange={(value) => {
                      if (amountInputRef.current)
                        amountInputRef.current.value = value.toString()
                    }}
                    min={0}
                    className="w-16 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                    ref={amountInputRef}
                  />
                </div>
                <div className="col-span-2 flex justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      if (nameInputRef.current && amountInputRef.current) {
                        onSave(
                          index,
                          nameInputRef.current.value,
                          selectedCategory,
                          selectedTypes,
                          Number(amountInputRef.current.value),
                          selectedCategory === ResourceCategory.MONSTER
                            ? selectedMonsterName
                            : undefined,
                          selectedCategory === ResourceCategory.MONSTER
                            ? selectedMonsterNode
                            : undefined
                        )
                      }
                    }}
                    title="Save resource">
                    <CheckIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    type="button"
                    onClick={() => onRemove(index)}>
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            // Mobile Edit Mode Layout
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="flex-1 min-w-0">
                  <Input
                    ref={nameInputRef}
                    placeholder="Resource Name"
                    defaultValue={selectedSettlement?.resources?.[index].name}
                    onKeyDown={handleNameKeyDown}
                    className="w-full"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <NumericInput
                    label="Resource Amount"
                    value={selectedSettlement?.resources?.[index].amount ?? 0}
                    onChange={(value) => {
                      if (amountInputRef.current)
                        amountInputRef.current.value = value.toString()
                    }}
                    min={0}
                    className="w-16 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                    ref={amountInputRef}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      if (nameInputRef.current && amountInputRef.current)
                        onSave(
                          index,
                          nameInputRef.current.value,
                          selectedCategory,
                          selectedTypes,
                          Number(amountInputRef.current.value),
                          selectedCategory === ResourceCategory.MONSTER
                            ? selectedMonsterName
                            : undefined,
                          selectedCategory === ResourceCategory.MONSTER
                            ? selectedMonsterNode
                            : undefined
                        )
                    }}
                    title="Save resource">
                    <CheckIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    type="button"
                    onClick={() => onRemove(index)}
                    title="Delete resource">
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-1">
                <div className="min-w-0">
                  <ResourceCategoriesCombobox
                    selectedCategory={selectedCategory}
                    onChange={setSelectedCategory}
                  />
                </div>
                <div className="min-w-0">
                  <ResourceTypesCombobox
                    selectedTypes={selectedTypes}
                    onChange={setSelectedTypes}
                  />
                </div>
                <div className="min-w-0">
                  {selectedCategory === ResourceCategory.MONSTER ? (
                    <ResourceMonsterCombobox
                      selectedMonsterName={selectedMonsterName}
                      selectedSettlement={selectedSettlement}
                      onChange={handleMonsterChange}
                    />
                  ) : (
                    <div className="h-9" aria-hidden="true" />
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/**
 * New Resource Item Component
 *
 * @param props New Resource Item Component Properties
 * @return New Resource Item Component
 */
export function NewResourceItem({
  onCancel,
  onSave,
  selectedSettlement
}: NewResourceItemProps): ReactElement {
  const isMobile = useIsMobile()

  const nameInputRef = useRef<HTMLInputElement>(null)
  const amountInputRef = useRef<HTMLInputElement>(null)

  const [category, setCategory] = useState<ResourceCategory>(
    ResourceCategory.BASIC
  )
  const [types, setTypes] = useState<ResourceType[]>([ResourceType.BONE])
  const [monsterName, setMonsterName] = useState<string | undefined>(undefined)
  const [monsterNode, setMonsterNode] = useState<MonsterNode | undefined>(
    undefined
  )

  /**
   * Handle Monster Selection
   *
   * @param name Monster Name
   * @param node Monster Node
   */
  const handleMonsterChange = (
    name: string | undefined,
    node: MonsterNode | undefined
  ) => {
    setMonsterName(name)
    setMonsterNode(node)
  }

  /**
   * Handle Key Down Event
   *
   * If the Enter key is pressed, calls the onSave function with the current
   * values. If the Escape key is pressed, it calls the onCancel function.
   *
   * @param e Key Down Event
   */
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && nameInputRef.current && amountInputRef.current) {
      e.preventDefault()
      onSave(
        nameInputRef.current.value,
        category,
        types,
        Number(amountInputRef.current.value),
        category === ResourceCategory.MONSTER ? monsterName : undefined,
        category === ResourceCategory.MONSTER ? monsterNode : undefined
      )
    } else if (e.key === 'Escape') {
      e.preventDefault()
      onCancel()
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div
        className={`flex gap-2 ${isMobile ? 'items-start' : 'items-center'}`}>
        {/* Drag Handle */}
        <div className={`p-1 ${isMobile ? 'mt-1' : ''}`}>
          <GripVertical
            className={`h-4 w-4 text-muted-foreground opacity-50 ${isMobile && 'mt-0.5'}`}
          />
        </div>

        <div className="flex-1">
          {!isMobile ? (
            // Desktop Layout
            <div className="space-y-2">
              <div className="grid grid-cols-12 items-center gap-2">
                <div className="col-span-3 text-sm text-left flex items-center">
                  <Input
                    ref={nameInputRef}
                    placeholder="Add a resource..."
                    defaultValue={''}
                    onKeyDown={handleKeyDown}
                  />
                </div>
                <div className="col-span-2">
                  <ResourceCategoriesCombobox
                    selectedCategory={category}
                    onChange={setCategory}
                  />
                </div>
                <div className="col-span-2">
                  <ResourceTypesCombobox
                    selectedTypes={types}
                    onChange={setTypes}
                  />
                </div>
                <div className="col-span-2">
                  {category === ResourceCategory.MONSTER && (
                    <ResourceMonsterCombobox
                      selectedMonsterName={monsterName}
                      selectedSettlement={selectedSettlement}
                      onChange={handleMonsterChange}
                    />
                  )}
                </div>
                <div className="col-span-1">
                  <Input
                    ref={amountInputRef}
                    type="number"
                    min={0}
                    placeholder="0"
                    disabled={true}
                    defaultValue={''}
                    onKeyDown={handleKeyDown}
                    className="w-16 text-center no-spinners focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </div>
                <div className="col-span-2 flex justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      if (nameInputRef.current && amountInputRef.current)
                        onSave(
                          nameInputRef.current.value,
                          category,
                          types,
                          Number(amountInputRef.current.value),
                          category === ResourceCategory.MONSTER
                            ? monsterName
                            : undefined,
                          category === ResourceCategory.MONSTER
                            ? monsterNode
                            : undefined
                        )
                    }}
                    title="Save resource">
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
            </div>
          ) : (
            // Mobile Layout
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="flex-1 min-w-0">
                  <Input
                    ref={nameInputRef}
                    placeholder="Add a resource..."
                    defaultValue={''}
                    onKeyDown={handleKeyDown}
                    className="w-full"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    ref={amountInputRef}
                    type="number"
                    min={0}
                    placeholder="0"
                    disabled={true}
                    defaultValue={''}
                    onKeyDown={handleKeyDown}
                    className="w-16 text-center no-spinners focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      if (nameInputRef.current && amountInputRef.current)
                        onSave(
                          nameInputRef.current.value,
                          category,
                          types,
                          Number(amountInputRef.current.value),
                          category === ResourceCategory.MONSTER
                            ? monsterName
                            : undefined,
                          category === ResourceCategory.MONSTER
                            ? monsterNode
                            : undefined
                        )
                    }}
                    title="Save resource">
                    <CheckIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={onCancel}
                    title="Cancel">
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-1">
                <div className="min-w-0">
                  <ResourceCategoriesCombobox
                    selectedCategory={category}
                    onChange={setCategory}
                  />
                </div>
                <div className="min-w-0">
                  <ResourceTypesCombobox
                    selectedTypes={types}
                    onChange={setTypes}
                  />
                </div>
                <div className="min-w-0">
                  {category === ResourceCategory.MONSTER ? (
                    <ResourceMonsterCombobox
                      selectedMonsterName={monsterName}
                      selectedSettlement={selectedSettlement}
                      onChange={handleMonsterChange}
                    />
                  ) : (
                    <div className="h-9" aria-hidden="true" />
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
