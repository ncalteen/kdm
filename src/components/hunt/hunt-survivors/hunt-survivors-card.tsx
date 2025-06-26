'use client'

import { HuntSurvivorCard } from '@/components/hunt/hunt-survivors/hunt-survivor-card'
import {
  NextButton,
  PrevButton,
  usePrevNextButtons
} from '@/components/hunt/hunt-survivors/nav-buttons'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { useSidebar } from '@/components/ui/sidebar'
import { Hunt } from '@/schemas/hunt'
import { Settlement } from '@/schemas/settlement'
import { Survivor } from '@/schemas/survivor'
import useEmblaCarousel from 'embla-carousel-react'
import { ReactElement, useMemo } from 'react'

/**
 * Hunt Survivors Card Properties
 */
interface HuntSurvivorsCardProps {
  /** Save Selected Hunt */
  saveSelectedHunt: (updateData: Partial<Hunt>, successMsg?: string) => void
  /** Selected Hunt */
  selectedHunt: Partial<Hunt> | null
  /** Selected Settlement */
  selectedSettlement: Partial<Settlement> | null
  /** Selected Survivor */
  selectedSurvivor: Survivor | null
  /** Set Survivors */
  setSurvivors: (survivors: Survivor[]) => void
  /** Survivors */
  survivors: Survivor[] | null
  /** Update Selected Survivor */
  updateSelectedSurvivor: (survivor: Survivor) => void
}

/**
 * Hunt Survivors Card Component
 *
 * @param props Hunt Survivors Card Properties
 * @returns Hunt Survivors Card Component
 */
export function HuntSurvivorsCard({
  saveSelectedHunt,
  selectedHunt,
  selectedSettlement,
  selectedSurvivor,
  setSurvivors,
  survivors,
  updateSelectedSurvivor
}: HuntSurvivorsCardProps): ReactElement {
  const { isMobile, state } = useSidebar()

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true
  })

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick
  } = usePrevNextButtons(emblaApi)

  const huntSurvivors = useMemo(() => {
    let s: number[] = []

    if (selectedHunt?.survivors) s = [...s, ...selectedHunt.survivors]
    if (selectedHunt?.scout) s = [...s, selectedHunt.scout]

    return s
  }, [selectedHunt?.survivors, selectedHunt?.scout])

  // Calculate width based on sidebar state
  const getCardWidth = () => {
    // Full width on mobile (sidebar is overlay) minus gap
    if (isMobile) return '98vw'

    // Full width minus SIDEBAR_WIDTH (16rem) + 1rem (gap)
    if (state === 'expanded') return 'calc(100vw - 17rem)'

    // Full width minus SIDEBAR_WIDTH_ICON (3rem) + 1rem (gap)
    if (state === 'collapsed') return 'calc(100vw - 4rem)'

    return '98.5vw' // Fallback to full width
  }

  if (huntSurvivors.length === 0 || !selectedSettlement) return <></>

  return (
    <Card
      className="embla pt-0 gap-0 min-w-[430px]"
      style={{
        width: getCardWidth()
      }}>
      <CardHeader className="embla__controls">
        <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
        <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
      </CardHeader>

      <CardContent className="overflow-hidden" ref={emblaRef}>
        <div className="embla__container">
          {survivors
            ?.filter((s) => huntSurvivors.includes(s.id))
            .map((survivor) => (
              <div className="embla__slide" key={survivor.id}>
                <HuntSurvivorCard
                  saveSelectedHunt={saveSelectedHunt}
                  selectedHunt={selectedHunt}
                  selectedSettlement={selectedSettlement}
                  selectedSurvivor={selectedSurvivor}
                  setSurvivors={setSurvivors}
                  survivor={survivor}
                  survivors={survivors}
                  updateSelectedSurvivor={updateSelectedSurvivor}
                />
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  )
}
