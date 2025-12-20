'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { SURVIVOR_FACES_IN_THE_SKY_TRAIT_UPDATED_MESSAGE } from '@/lib/messages'
import { Survivor } from '@/schemas/survivor'
import { BookOpenIcon } from 'lucide-react'
import { ReactElement } from 'react'

/**
 * Faces In The Sky Properties
 */
interface FacesInTheSkyProps {
  /** Save Selected Survivor */
  saveSelectedSurvivor: (data: Partial<Survivor>, successMsg?: string) => void
  /** Selected Survivor */
  selectedSurvivor: Survivor | null
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
  saveSelectedSurvivor,
  selectedSurvivor
}: FacesInTheSkyProps): ReactElement {
  return (
    <div>
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
                saveSelectedSurvivor(
                  {
                    hasGamblerWitch: !selectedSurvivor?.hasGamblerWitch || false
                  },
                  SURVIVOR_FACES_IN_THE_SKY_TRAIT_UPDATED_MESSAGE()
                )
              }>
              9+ UND
            </TableCell>
            <TableCell
              className={`py-1 text-xs text-left cursor-pointer ${selectedSurvivor?.hasGamblerRust ? 'bg-gray-200 text-gray-700' : ''}`}
              onClick={() =>
                saveSelectedSurvivor(
                  {
                    hasGamblerRust: !selectedSurvivor?.hasGamblerRust || false
                  },
                  SURVIVOR_FACES_IN_THE_SKY_TRAIT_UPDATED_MESSAGE()
                )
              }>
              Destined Disorder
            </TableCell>
            <TableCell
              className={`py-1 text-xs text-left cursor-pointer ${selectedSurvivor?.hasGamblerStorm ? 'bg-gray-200 text-gray-700' : ''}`}
              onClick={() =>
                saveSelectedSurvivor(
                  {
                    hasGamblerStorm: !selectedSurvivor?.hasGamblerStorm || false
                  },
                  SURVIVOR_FACES_IN_THE_SKY_TRAIT_UPDATED_MESSAGE()
                )
              }>
              Fated Blow FA
            </TableCell>
            <TableCell
              className={`py-1 text-xs text-left cursor-pointer ${selectedSurvivor?.hasGamblerReaper ? 'bg-gray-200 text-gray-700' : ''}`}
              onClick={() =>
                saveSelectedSurvivor(
                  {
                    hasGamblerReaper:
                      !selectedSurvivor?.hasGamblerReaper || false
                  },
                  SURVIVOR_FACES_IN_THE_SKY_TRAIT_UPDATED_MESSAGE()
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
                saveSelectedSurvivor(
                  {
                    hasAbsoluteWitch:
                      !selectedSurvivor?.hasAbsoluteWitch || false
                  },
                  SURVIVOR_FACES_IN_THE_SKY_TRAIT_UPDATED_MESSAGE()
                )
              }>
              Reincarnated
            </TableCell>
            <TableCell
              className={`py-1 text-xs text-left cursor-pointer ${selectedSurvivor?.hasAbsoluteRust ? 'bg-gray-200 text-gray-700' : ''}`}
              onClick={() =>
                saveSelectedSurvivor(
                  {
                    hasAbsoluteRust: !selectedSurvivor?.hasAbsoluteRust || false
                  },
                  SURVIVOR_FACES_IN_THE_SKY_TRAIT_UPDATED_MESSAGE()
                )
              }>
              Frozen Star FA
            </TableCell>
            <TableCell
              className={`py-1 text-xs text-left cursor-pointer ${selectedSurvivor?.hasAbsoluteStorm ? 'bg-gray-200 text-gray-700' : ''}`}
              onClick={() =>
                saveSelectedSurvivor(
                  {
                    hasAbsoluteStorm:
                      !selectedSurvivor?.hasAbsoluteStorm || false
                  },
                  SURVIVOR_FACES_IN_THE_SKY_TRAIT_UPDATED_MESSAGE()
                )
              }>
              Irid. Hide Abil.
            </TableCell>
            <TableCell
              className={`py-1 text-xs text-left cursor-pointer ${selectedSurvivor?.hasAbsoluteReaper ? 'bg-gray-200 text-gray-700' : ''}`}
              onClick={() =>
                saveSelectedSurvivor(
                  {
                    hasAbsoluteReaper:
                      !selectedSurvivor?.hasAbsoluteReaper || false
                  },
                  SURVIVOR_FACES_IN_THE_SKY_TRAIT_UPDATED_MESSAGE()
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
                saveSelectedSurvivor(
                  {
                    hasSculptorWitch:
                      !selectedSurvivor?.hasSculptorWitch || false
                  },
                  SURVIVOR_FACES_IN_THE_SKY_TRAIT_UPDATED_MESSAGE()
                )
              }>
              Scar
            </TableCell>
            <TableCell
              className={`py-1 text-xs text-left cursor-pointer ${selectedSurvivor?.hasSculptorRust ? 'bg-gray-200 text-gray-700' : ''}`}
              onClick={() =>
                saveSelectedSurvivor(
                  {
                    hasSculptorRust: !selectedSurvivor?.hasSculptorRust || false
                  },
                  SURVIVOR_FACES_IN_THE_SKY_TRAIT_UPDATED_MESSAGE()
                )
              }>
              Noble
            </TableCell>
            <TableCell
              className={`py-1 text-xs text-left cursor-pointer ${selectedSurvivor?.hasSculptorStorm ? 'bg-gray-200 text-gray-700' : ''}`}
              onClick={() =>
                saveSelectedSurvivor(
                  {
                    hasSculptorStorm:
                      !selectedSurvivor?.hasSculptorStorm || false
                  },
                  SURVIVOR_FACES_IN_THE_SKY_TRAIT_UPDATED_MESSAGE()
                )
              }>
              Weapon Master
            </TableCell>
            <TableCell
              className={`py-1 text-xs text-left cursor-pointer ${selectedSurvivor?.hasSculptorReaper ? 'bg-gray-200 text-gray-700' : ''}`}
              onClick={() =>
                saveSelectedSurvivor(
                  {
                    hasSculptorReaper:
                      !selectedSurvivor?.hasSculptorReaper || false
                  },
                  SURVIVOR_FACES_IN_THE_SKY_TRAIT_UPDATED_MESSAGE()
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
                saveSelectedSurvivor(
                  {
                    hasGoblinWitch: !selectedSurvivor?.hasGoblinWitch || false
                  },
                  SURVIVOR_FACES_IN_THE_SKY_TRAIT_UPDATED_MESSAGE()
                )
              }>
              Oracle&apos;s Eye
            </TableCell>
            <TableCell
              className={`py-1 text-xs text-left cursor-pointer ${selectedSurvivor?.hasGoblinRust ? 'bg-gray-200 text-gray-700' : ''}`}
              onClick={() =>
                saveSelectedSurvivor(
                  {
                    hasGoblinRust: !selectedSurvivor?.hasGoblinRust || false
                  },
                  SURVIVOR_FACES_IN_THE_SKY_TRAIT_UPDATED_MESSAGE()
                )
              }>
              Unbreakable FA
            </TableCell>
            <TableCell
              className={`py-1 text-xs text-left cursor-pointer ${selectedSurvivor?.hasGoblinStorm ? 'bg-gray-200 text-gray-700' : ''}`}
              onClick={() =>
                saveSelectedSurvivor(
                  {
                    hasGoblinStorm: !selectedSurvivor?.hasGoblinStorm || false
                  },
                  SURVIVOR_FACES_IN_THE_SKY_TRAIT_UPDATED_MESSAGE()
                )
              }>
              3+ Base STR
            </TableCell>
            <TableCell
              className={`py-1 text-xs text-left cursor-pointer ${selectedSurvivor?.hasGoblinReaper ? 'bg-gray-200 text-gray-700' : ''}`}
              onClick={() =>
                saveSelectedSurvivor(
                  {
                    hasGoblinReaper: !selectedSurvivor?.hasGoblinReaper || false
                  },
                  SURVIVOR_FACES_IN_THE_SKY_TRAIT_UPDATED_MESSAGE()
                )
              }>
              9+ COU
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <div className="text-xs text-muted-foreground flex flex-row items-center justify-center gap-1 pt-2">
        If marked traits complete a horizontal or vertical line,
        <BookOpenIcon className="h-4 w-4" />
        <strong>Faces in the Sky.</strong>
      </div>
    </div>
  )
}
