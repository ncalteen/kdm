'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Campaign } from '@/schemas/campaign'
import { SettlementPhase } from '@/schemas/settlement-phase'
import { Survivor } from '@/schemas/survivor'
import { ReactElement } from 'react'

/**
 * Settlement Phase Results Card Properties
 */
interface SettlementPhaseCardProps {
  /** Campaign */
  campaign: Campaign
  /** Selected Settlement Phase */
  selectedSettlementPhase: SettlementPhase | null
}

/**
 * Settlement Phase Results Card Component
 *
 * @param props Settlement Phase Results Card Properties
 * @returns Settlement Phase Results Card Component
 */
export function SettlementPhaseResultsCard({
  campaign,
  selectedSettlementPhase
}: SettlementPhaseCardProps): ReactElement {
  const returningSurvivorIds = selectedSettlementPhase
    ? [
        ...selectedSettlementPhase.returningSurvivors,
        ...(selectedSettlementPhase.returningScout !== null
          ? [selectedSettlementPhase.returningScout]
          : [])
      ]
    : []

  const returningSurvivors = campaign.survivors.filter((survivor) =>
    returningSurvivorIds.includes(survivor.id)
  )

  const deadSurvivors = returningSurvivors.filter((survivor) => survivor.dead)
  const survivingSurvivors = returningSurvivors.filter(
    (survivor) => !survivor.dead
  )

  /**
   * Get Survivor Display Name
   *
   * @param survivor Survivor Data
   * @returns Survivor Display Name
   */
  const getSurvivorDisplayName = (survivor: Survivor): string =>
    survivor.name?.trim() || `Survivor #${survivor.id}`

  return (
    <Card className="p-0 border-0 flex items-center">
      <CardContent className="p-1 pb-0 text-xs w-full space-y-2 flex flex-row justify-between">
        <div>
          <p className="font-semibold">
            Fallen Survivors ({deadSurvivors.length})
          </p>
          {deadSurvivors.length === 0 ? (
            <p className="text-muted-foreground">None</p>
          ) : (
            <p className="text-muted-foreground">
              {deadSurvivors.map(getSurvivorDisplayName).join(', ')}
            </p>
          )}
        </div>

        <div>
          <p className="font-semibold">
            Returning Survivors ({survivingSurvivors.length})
          </p>
          {survivingSurvivors.length === 0 ? (
            <p className="text-muted-foreground">None</p>
          ) : (
            <p className="text-muted-foreground">
              {survivingSurvivors.map(getSurvivorDisplayName).join(', ')}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
