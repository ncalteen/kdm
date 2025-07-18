'use client'

import {
  NextButton,
  PrevButton,
  usePrevNextButtons
} from '@/components/showdown/showdown-survivors/nav-buttons'
import { ShowdownSurvivorCard } from '@/components/showdown/showdown-survivors/showdown-survivor-card'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { useSidebar } from '@/components/ui/sidebar'
import { Settlement } from '@/schemas/settlement'
import { Showdown } from '@/schemas/showdown'
import { Survivor } from '@/schemas/survivor'
import useEmblaCarousel from 'embla-carousel-react'
import { ReactElement, useMemo } from 'react'

/**
 * Showdown Survivors Card Properties
 */
interface ShowdownSurvivorsCardProps {
  /** Save Selected Showdown */
  saveSelectedShowdown: (
    updateData: Partial<Showdown>,
    successMsg?: string
  ) => void
  /** Selected Showdown */
  selectedShowdown: Partial<Showdown> | null
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
 * Showdown Survivors Card Component
 *
 * @param props Showdown Survivors Card Properties
 * @returns Showdown Survivors Card Component
 */
export function ShowdownSurvivorsCard({
  saveSelectedShowdown,
  selectedShowdown,
  selectedSettlement,
  selectedSurvivor,
  setSurvivors,
  survivors,
  updateSelectedSurvivor
}: ShowdownSurvivorsCardProps): ReactElement {
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

  const showdownSurvivors = useMemo(() => {
    let s: number[] = []

    if (selectedShowdown?.survivors) s = [...s, ...selectedShowdown.survivors]
    if (selectedShowdown?.scout) s = [...s, selectedShowdown.scout]

    return s
  }, [selectedShowdown?.survivors, selectedShowdown?.scout])

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

  if (showdownSurvivors.length === 0 || !selectedSettlement) return <></>

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
            ?.filter((s) => showdownSurvivors.includes(s.id))
            .map((survivor) => (
              <div className="embla__slide" key={survivor.id}>
                <ShowdownSurvivorCard
                  saveSelectedShowdown={saveSelectedShowdown}
                  selectedShowdown={selectedShowdown}
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
