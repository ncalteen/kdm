'use client'

import { SurvivorSchema } from '@/schemas/survivor'
import { BookOpenIcon } from 'lucide-react'
import { UseFormReturn } from 'react-hook-form'
import { z } from 'zod'

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
export function FacesInTheSky(
  form: UseFormReturn<z.infer<typeof SurvivorSchema>>
) {
  // Watch the props from the form
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

  /**
   * Handles toggling a cell in the table
   *
   * @param property The property to toggle
   * @param currentValue The current value of the property
   */
  const handleToggleCell = (
    property: keyof z.infer<typeof SurvivorSchema>,
    currentValue: boolean
  ) => form.setValue(property, !currentValue)

  return (
    <div className="w-full">
      <div className="text-xs mb-2 flex flex-row items-center justify-center gap-1">
        If marked traits complete a horizontal or vertical line,{' '}
        <BookOpenIcon className="h-4 w-4" /> <strong>Faces in the Sky.</strong>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-300 border">
          <thead>
            <tr>
              <th className="px-2 py-1 text-xs text-left border"></th>
              <th className="px-2 py-1 text-xs text-left border">Witch</th>
              <th className="px-2 py-1 text-xs text-left border">Rust</th>
              <th className="px-2 py-1 text-xs text-left border">Storm</th>
              <th className="px-2 py-1 text-xs text-left border">Reaper</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {/* Gambler Row */}
            <tr>
              <td className="px-2 py-1 text-xs text-center border">Gambler</td>
              <td
                className={`px-2 py-1 text-xs text-left border cursor-pointer ${hasGamblerWitch ? 'bg-gray-200' : ''}`}
                onClick={() =>
                  handleToggleCell('hasGamblerWitch', hasGamblerWitch)
                }>
                9+ UND
              </td>
              <td
                className={`px-2 py-1 text-xs text-left border cursor-pointer ${hasGamblerRust ? 'bg-gray-200' : ''}`}
                onClick={() =>
                  handleToggleCell('hasGamblerRust', hasGamblerRust)
                }>
                Destined Disorder
              </td>
              <td
                className={`px-2 py-1 text-xs text-left border cursor-pointer ${hasGamblerStorm ? 'bg-gray-200' : ''}`}
                onClick={() =>
                  handleToggleCell('hasGamblerStorm', hasGamblerStorm)
                }>
                Fated Blow FA
              </td>
              <td
                className={`px-2 py-1 text-xs text-left border cursor-pointer ${hasGamblerReaper ? 'bg-gray-200' : ''}`}
                onClick={() =>
                  handleToggleCell('hasGamblerReaper', hasGamblerReaper)
                }>
                Pristine Ability
              </td>
            </tr>

            {/* Absolute Row */}
            <tr>
              <td className="px-2 py-1 text-xs text-center border">Absolute</td>
              <td
                className={`px-2 py-1 text-xs text-left border cursor-pointer ${hasAbsoluteWitch ? 'bg-gray-200' : ''}`}
                onClick={() =>
                  handleToggleCell('hasAbsoluteWitch', hasAbsoluteWitch)
                }>
                Reincarnated
              </td>
              <td
                className={`px-2 py-1 text-xs text-left border cursor-pointer ${hasAbsoluteRust ? 'bg-gray-200' : ''}`}
                onClick={() =>
                  handleToggleCell('hasAbsoluteRust', hasAbsoluteRust)
                }>
                Frozen Star FA
              </td>
              <td
                className={`px-2 py-1 text-xs text-left border cursor-pointer ${hasAbsoluteStorm ? 'bg-gray-200' : ''}`}
                onClick={() =>
                  handleToggleCell('hasAbsoluteStorm', hasAbsoluteStorm)
                }>
                Irid. Hide Abil.
              </td>
              <td
                className={`px-2 py-1 text-xs text-left border cursor-pointer ${hasAbsoluteReaper ? 'bg-gray-200' : ''}`}
                onClick={() =>
                  handleToggleCell('hasAbsoluteReaper', hasAbsoluteReaper)
                }>
                Champion&apos;s Rite FA
              </td>
            </tr>

            {/* Sculptor Row */}
            <tr>
              <td className="px-2 py-1 text-xs text-center border">Sculptor</td>
              <td
                className={`px-2 py-1 text-xs text-left border cursor-pointer ${hasSculptorWitch ? 'bg-gray-200' : ''}`}
                onClick={() =>
                  handleToggleCell('hasSculptorWitch', hasSculptorWitch)
                }>
                Scar
              </td>
              <td
                className={`px-2 py-1 text-xs text-left border cursor-pointer ${hasSculptorRust ? 'bg-gray-200' : ''}`}
                onClick={() =>
                  handleToggleCell('hasSculptorRust', hasSculptorRust)
                }>
                Noble
              </td>
              <td
                className={`px-2 py-1 text-xs text-left border cursor-pointer ${hasSculptorStorm ? 'bg-gray-200' : ''}`}
                onClick={() =>
                  handleToggleCell('hasSculptorStorm', hasSculptorStorm)
                }>
                Weapon Master
              </td>
              <td
                className={`px-2 py-1 text-xs text-left border cursor-pointer ${hasSculptorReaper ? 'bg-gray-200' : ''}`}
                onClick={() =>
                  handleToggleCell('hasSculptorReaper', hasSculptorReaper)
                }>
                1+ Base ACC
              </td>
            </tr>

            {/* Goblin Row */}
            <tr>
              <td className="px-2 py-1 text-xs text-center border">Goblin</td>
              <td
                className={`px-2 py-1 text-xs text-left border cursor-pointer ${hasGoblinWitch ? 'bg-gray-200' : ''}`}
                onClick={() =>
                  handleToggleCell('hasGoblinWitch', hasGoblinWitch)
                }>
                Oracle&apos;s Eye
              </td>
              <td
                className={`px-2 py-1 text-xs text-left border cursor-pointer ${hasGoblinRust ? 'bg-gray-200' : ''}`}
                onClick={() =>
                  handleToggleCell('hasGoblinRust', hasGoblinRust)
                }>
                Unbreakable FA
              </td>
              <td
                className={`px-2 py-1 text-xs text-left border cursor-pointer ${hasGoblinStorm ? 'bg-gray-200' : ''}`}
                onClick={() =>
                  handleToggleCell('hasGoblinStorm', hasGoblinStorm)
                }>
                3+ Base STR
              </td>
              <td
                className={`px-2 py-1 text-xs text-left border cursor-pointer ${hasGoblinReaper ? 'bg-gray-200' : ''}`}
                onClick={() =>
                  handleToggleCell('hasGoblinReaper', hasGoblinReaper)
                }>
                9+ COU
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
