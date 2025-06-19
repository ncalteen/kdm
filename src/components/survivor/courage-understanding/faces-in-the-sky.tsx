'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { Survivor } from '@/schemas/survivor'
import { BookOpenIcon } from 'lucide-react'
import { ReactElement } from 'react'
import { UseFormReturn } from 'react-hook-form'

/**
 * Faces In The Sky Properties
 */
interface FacesInTheSkyProps {
  /** Survivor Form */
  form: UseFormReturn<Survivor>
  /** Save Selected Survivor */
  saveSelectedSurvivor: (data: Partial<Survivor>, successMsg?: string) => void
}

/**
 * Faces in the Sky Component
 *
 * This component displays the Faces in the Sky table for People of the Stars
 * survivors. The table shows the different aspects of the stars (Witch, Rust,
 * Storm, Reaper) and their relationships with different roles (Gambler,
 * Absolute, Sculptor, Goblin).
 *
 * @param props Faces In The Sky Properties
 * @returns Faces in the Sky Component
 */
export function FacesInTheSky({
  form,
  saveSelectedSurvivor
}: FacesInTheSkyProps): ReactElement {
  /**
   * Handles toggling a cell in the table
   *
   * @param property The property to toggle
   * @param currentValue The current value of the property
   */
  const handleToggleCell = (property: keyof Survivor, currentValue: boolean) =>
    saveSelectedSurvivor(
      {
        [property]: !currentValue
      },
      'The stars align. Celestial traits recorded.'
    )

  const hasGamblerWitch = form.watch('hasGamblerWitch')
  const hasGamblerRust = form.watch('hasGamblerRust')
  const hasGamblerStorm = form.watch('hasGamblerStorm')
  const hasGamblerReaper = form.watch('hasGamblerReaper')
  const hasAbsoluteWitch = form.watch('hasAbsoluteWitch')
  const hasAbsoluteRust = form.watch('hasAbsoluteRust')
  const hasAbsoluteStorm = form.watch('hasAbsoluteStorm')
  const hasAbsoluteReaper = form.watch('hasAbsoluteReaper')
  const hasSculptorWitch = form.watch('hasSculptorWitch')
  const hasSculptorRust = form.watch('hasSculptorRust')
  const hasSculptorStorm = form.watch('hasSculptorStorm')
  const hasSculptorReaper = form.watch('hasSculptorReaper')
  const hasGoblinWitch = form.watch('hasGoblinWitch')
  const hasGoblinRust = form.watch('hasGoblinRust')
  const hasGoblinStorm = form.watch('hasGoblinStorm')
  const hasGoblinReaper = form.watch('hasGoblinReaper')

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
              className={`py-1 text-xs text-left cursor-pointer ${hasGamblerWitch ? 'bg-gray-200 text-gray-700' : ''}`}
              onClick={() =>
                handleToggleCell('hasGamblerWitch', hasGamblerWitch || false)
              }>
              9+ UND
            </TableCell>
            <TableCell
              className={`py-1 text-xs text-left cursor-pointer ${hasGamblerRust ? 'bg-gray-200 text-gray-700' : ''}`}
              onClick={() =>
                handleToggleCell('hasGamblerRust', hasGamblerRust || false)
              }>
              Destined Disorder
            </TableCell>
            <TableCell
              className={`py-1 text-xs text-left cursor-pointer ${hasGamblerStorm ? 'bg-gray-200 text-gray-700' : ''}`}
              onClick={() =>
                handleToggleCell('hasGamblerStorm', hasGamblerStorm || false)
              }>
              Fated Blow FA
            </TableCell>
            <TableCell
              className={`py-1 text-xs text-left cursor-pointer ${hasGamblerReaper ? 'bg-gray-200 text-gray-700' : ''}`}
              onClick={() =>
                handleToggleCell('hasGamblerReaper', hasGamblerReaper || false)
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
              className={`py-1 text-xs text-left cursor-pointer ${hasAbsoluteWitch ? 'bg-gray-200 text-gray-700' : ''}`}
              onClick={() =>
                handleToggleCell('hasAbsoluteWitch', hasAbsoluteWitch || false)
              }>
              Reincarnated
            </TableCell>
            <TableCell
              className={`py-1 text-xs text-left cursor-pointer ${hasAbsoluteRust ? 'bg-gray-200 text-gray-700' : ''}`}
              onClick={() =>
                handleToggleCell('hasAbsoluteRust', hasAbsoluteRust || false)
              }>
              Frozen Star FA
            </TableCell>
            <TableCell
              className={`py-1 text-xs text-left cursor-pointer ${hasAbsoluteStorm ? 'bg-gray-200 text-gray-700' : ''}`}
              onClick={() =>
                handleToggleCell('hasAbsoluteStorm', hasAbsoluteStorm || false)
              }>
              Irid. Hide Abil.
            </TableCell>
            <TableCell
              className={`py-1 text-xs text-left cursor-pointer ${hasAbsoluteReaper ? 'bg-gray-200 text-gray-700' : ''}`}
              onClick={() =>
                handleToggleCell(
                  'hasAbsoluteReaper',
                  hasAbsoluteReaper || false
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
              className={`py-1 text-xs text-left cursor-pointer ${hasSculptorWitch ? 'bg-gray-200 text-gray-700' : ''}`}
              onClick={() =>
                handleToggleCell('hasSculptorWitch', hasSculptorWitch || false)
              }>
              Scar
            </TableCell>
            <TableCell
              className={`py-1 text-xs text-left cursor-pointer ${hasSculptorRust ? 'bg-gray-200 text-gray-700' : ''}`}
              onClick={() =>
                handleToggleCell('hasSculptorRust', hasSculptorRust || false)
              }>
              Noble
            </TableCell>
            <TableCell
              className={`py-1 text-xs text-left cursor-pointer ${hasSculptorStorm ? 'bg-gray-200 text-gray-700' : ''}`}
              onClick={() =>
                handleToggleCell('hasSculptorStorm', hasSculptorStorm || false)
              }>
              Weapon Master
            </TableCell>
            <TableCell
              className={`py-1 text-xs text-left cursor-pointer ${hasSculptorReaper ? 'bg-gray-200 text-gray-700' : ''}`}
              onClick={() =>
                handleToggleCell(
                  'hasSculptorReaper',
                  hasSculptorReaper || false
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
              className={`py-1 text-xs text-left cursor-pointer ${hasGoblinWitch ? 'bg-gray-200 text-gray-700' : ''}`}
              onClick={() =>
                handleToggleCell('hasGoblinWitch', hasGoblinWitch || false)
              }>
              Oracle&apos;s Eye
            </TableCell>
            <TableCell
              className={`py-1 text-xs text-left cursor-pointer ${hasGoblinRust ? 'bg-gray-200 text-gray-700' : ''}`}
              onClick={() =>
                handleToggleCell('hasGoblinRust', hasGoblinRust || false)
              }>
              Unbreakable FA
            </TableCell>
            <TableCell
              className={`py-1 text-xs text-left cursor-pointer ${hasGoblinStorm ? 'bg-gray-200 text-gray-700' : ''}`}
              onClick={() =>
                handleToggleCell('hasGoblinStorm', hasGoblinStorm || false)
              }>
              3+ Base STR
            </TableCell>
            <TableCell
              className={`py-1 text-xs text-left cursor-pointer ${hasGoblinReaper ? 'bg-gray-200 text-gray-700' : ''}`}
              onClick={() =>
                handleToggleCell('hasGoblinReaper', hasGoblinReaper || false)
              }>
              9+ COU
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  )
}
