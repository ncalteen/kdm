'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { useSurvivor } from '@/contexts/survivor-context'
import { useSurvivorSave } from '@/hooks/use-survivor-save'
import { Survivor } from '@/schemas/survivor'
import { BookOpenIcon } from 'lucide-react'
import { ReactElement } from 'react'
import { UseFormReturn } from 'react-hook-form'

/**
 * Faces in the Sky Component
 *
 * This component displays the Faces in the Sky table for People of the Stars
 * survivors. The table shows the different aspects of the stars (Witch, Rust,
 * Storm, Reaper) and their relationships with different roles (Gambler,
 * Absolute, Sculptor, Goblin).
 *
 * @param form Form
 * @returns Faces in the Sky Component
 */
export function FacesInTheSky(form: UseFormReturn<Survivor>): ReactElement {
  const { selectedSurvivor } = useSurvivor()
  const { saveSurvivor } = useSurvivorSave(form)

  /**
   * Save to Local Storage
   *
   * @param attrName Attribute name
   * @param value New value
   */
  const saveToLocalStorage = (attrName: keyof Survivor, value: boolean) =>
    saveSurvivor(
      {
        [attrName]: value
      },
      'The stars align. Celestial traits recorded.'
    )

  /**
   * Handles toggling a cell in the table
   *
   * @param property The property to toggle
   * @param currentValue The current value of the property
   */
  const handleToggleCell = (property: keyof Survivor, currentValue: boolean) =>
    saveToLocalStorage(property, !currentValue)

  return (
    <div>
      <div className="text-xs flex flex-row items-center justify-center gap-1">
        If marked traits complete a horizontal or vertical line,
        <BookOpenIcon className="h-4 w-4" />
        <strong>Faces in the Sky.</strong>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="h-8 text-xs text-left font-bold"></TableHead>
            <TableHead className="h-8 text-xs text-left font-bold">
              Witch
            </TableHead>
            <TableHead className="h-8 text-xs text-left font-bold">
              Rust
            </TableHead>
            <TableHead className="h-8 text-xs text-left font-bold">
              Storm
            </TableHead>
            <TableHead className="h-8 text-xs text-left font-bold">
              Reaper
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="divide-y">
          {/* Gambler Row */}
          <TableRow>
            <TableCell className="py-1 text-xs text-center font-bold">
              Gambler
            </TableCell>
            <TableCell
              className={`py-1 text-xs text-left cursor-pointer ${selectedSurvivor?.hasGamblerWitch ? 'bg-gray-200 text-gray-700' : ''}`}
              onClick={() =>
                handleToggleCell(
                  'hasGamblerWitch',
                  selectedSurvivor?.hasGamblerWitch || false
                )
              }>
              9+ UND
            </TableCell>
            <TableCell
              className={`py-1 text-xs text-left cursor-pointer ${selectedSurvivor?.hasGamblerRust ? 'bg-gray-200 text-gray-700' : ''}`}
              onClick={() =>
                handleToggleCell(
                  'hasGamblerRust',
                  selectedSurvivor?.hasGamblerRust || false
                )
              }>
              Destined Disorder
            </TableCell>
            <TableCell
              className={`py-1 text-xs text-left cursor-pointer ${selectedSurvivor?.hasGamblerStorm ? 'bg-gray-200 text-gray-700' : ''}`}
              onClick={() =>
                handleToggleCell(
                  'hasGamblerStorm',
                  selectedSurvivor?.hasGamblerStorm || false
                )
              }>
              Fated Blow FA
            </TableCell>
            <TableCell
              className={`py-1 text-xs text-left cursor-pointer ${selectedSurvivor?.hasGamblerReaper ? 'bg-gray-200 text-gray-700' : ''}`}
              onClick={() =>
                handleToggleCell(
                  'hasGamblerReaper',
                  selectedSurvivor?.hasGamblerReaper || false
                )
              }>
              Pristine Ability
            </TableCell>
          </TableRow>

          {/* Absolute Row */}
          <TableRow>
            <TableCell className="py-1 text-xs text-center font-bold">
              Absolute
            </TableCell>
            <TableCell
              className={`py-1 text-xs text-left cursor-pointer ${selectedSurvivor?.hasAbsoluteWitch ? 'bg-gray-200 text-gray-700' : ''}`}
              onClick={() =>
                handleToggleCell(
                  'hasAbsoluteWitch',
                  selectedSurvivor?.hasAbsoluteWitch || false
                )
              }>
              Reincarnated
            </TableCell>
            <TableCell
              className={`py-1 text-xs text-left cursor-pointer ${selectedSurvivor?.hasAbsoluteRust ? 'bg-gray-200 text-gray-700' : ''}`}
              onClick={() =>
                handleToggleCell(
                  'hasAbsoluteRust',
                  selectedSurvivor?.hasAbsoluteRust || false
                )
              }>
              Frozen Star FA
            </TableCell>
            <TableCell
              className={`py-1 text-xs text-left cursor-pointer ${selectedSurvivor?.hasAbsoluteStorm ? 'bg-gray-200 text-gray-700' : ''}`}
              onClick={() =>
                handleToggleCell(
                  'hasAbsoluteStorm',
                  selectedSurvivor?.hasAbsoluteStorm || false
                )
              }>
              Irid. Hide Abil.
            </TableCell>
            <TableCell
              className={`py-1 text-xs text-left cursor-pointer ${selectedSurvivor?.hasAbsoluteReaper ? 'bg-gray-200 text-gray-700' : ''}`}
              onClick={() =>
                handleToggleCell(
                  'hasAbsoluteReaper',
                  selectedSurvivor?.hasAbsoluteReaper || false
                )
              }>
              Champion&apos;s Rite FA
            </TableCell>
          </TableRow>

          {/* Sculptor Row */}
          <TableRow>
            <TableCell className="py-1 text-xs text-center font-bold">
              Sculptor
            </TableCell>
            <TableCell
              className={`py-1 text-xs text-left cursor-pointer ${selectedSurvivor?.hasSculptorWitch ? 'bg-gray-200 text-gray-700' : ''}`}
              onClick={() =>
                handleToggleCell(
                  'hasSculptorWitch',
                  selectedSurvivor?.hasSculptorWitch || false
                )
              }>
              Scar
            </TableCell>
            <TableCell
              className={`py-1 text-xs text-left cursor-pointer ${selectedSurvivor?.hasSculptorRust ? 'bg-gray-200 text-gray-700' : ''}`}
              onClick={() =>
                handleToggleCell(
                  'hasSculptorRust',
                  selectedSurvivor?.hasSculptorRust || false
                )
              }>
              Noble
            </TableCell>
            <TableCell
              className={`py-1 text-xs text-left cursor-pointer ${selectedSurvivor?.hasSculptorStorm ? 'bg-gray-200 text-gray-700' : ''}`}
              onClick={() =>
                handleToggleCell(
                  'hasSculptorStorm',
                  selectedSurvivor?.hasSculptorStorm || false
                )
              }>
              Weapon Master
            </TableCell>
            <TableCell
              className={`py-1 text-xs text-left cursor-pointer ${selectedSurvivor?.hasSculptorReaper ? 'bg-gray-200 text-gray-700' : ''}`}
              onClick={() =>
                handleToggleCell(
                  'hasSculptorReaper',
                  selectedSurvivor?.hasSculptorReaper || false
                )
              }>
              1+ Base ACC
            </TableCell>
          </TableRow>

          {/* Goblin Row */}
          <TableRow>
            <TableCell className="py-1 text-xs text-center font-bold">
              Goblin
            </TableCell>
            <TableCell
              className={`py-1 text-xs text-left cursor-pointer ${selectedSurvivor?.hasGoblinWitch ? 'bg-gray-200 text-gray-700' : ''}`}
              onClick={() =>
                handleToggleCell(
                  'hasGoblinWitch',
                  selectedSurvivor?.hasGoblinWitch || false
                )
              }>
              Oracle&apos;s Eye
            </TableCell>
            <TableCell
              className={`py-1 text-xs text-left cursor-pointer ${selectedSurvivor?.hasGoblinRust ? 'bg-gray-200 text-gray-700' : ''}`}
              onClick={() =>
                handleToggleCell(
                  'hasGoblinRust',
                  selectedSurvivor?.hasGoblinRust || false
                )
              }>
              Unbreakable FA
            </TableCell>
            <TableCell
              className={`py-1 text-xs text-left cursor-pointer ${selectedSurvivor?.hasGoblinStorm ? 'bg-gray-200 text-gray-700' : ''}`}
              onClick={() =>
                handleToggleCell(
                  'hasGoblinStorm',
                  selectedSurvivor?.hasGoblinStorm || false
                )
              }>
              3+ Base STR
            </TableCell>
            <TableCell
              className={`py-1 text-xs text-left cursor-pointer ${selectedSurvivor?.hasGoblinReaper ? 'bg-gray-200 text-gray-700' : ''}`}
              onClick={() =>
                handleToggleCell(
                  'hasGoblinReaper',
                  selectedSurvivor?.hasGoblinReaper || false
                )
              }>
              9+ COU
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  )
}
