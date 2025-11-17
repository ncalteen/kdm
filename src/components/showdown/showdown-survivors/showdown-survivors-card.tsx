'use client'

import { ShowdownSurvivorCard } from '@/components/showdown/showdown-survivors/showdown-survivor-card'
import { Button } from '@/components/ui/button'
import { Carousel } from '@/components/ui/carousel'
import { usePrevNextButtons } from '@/components/ui/embla-carousel-arrow-buttons'
import {
  DotButton,
  useDotButton
} from '@/components/ui/embla-carousel-dot-button'
import { useSidebar } from '@/components/ui/sidebar'
import { getCarouselWidth, getSurvivorColorChoice } from '@/lib/utils'
import { Settlement } from '@/schemas/settlement'
import { Showdown } from '@/schemas/showdown'
import { Survivor } from '@/schemas/survivor'
import Fade from 'embla-carousel-fade'
import useEmblaCarousel from 'embla-carousel-react'
import { ArrowLeftIcon, ArrowRightIcon } from 'lucide-react'
import { ReactElement, useEffect, useMemo } from 'react'

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
  /** Set Selected Survivor */
  setSelectedSurvivor: (survivor: Survivor | null) => void
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
  setSelectedSurvivor,
  setSurvivors,
  survivors,
  updateSelectedSurvivor
}: ShowdownSurvivorsCardProps): ReactElement {
  const { isMobile, state } = useSidebar()

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Fade()])

  const { selectedIndex, scrollSnaps, onDotButtonClick } =
    useDotButton(emblaApi)

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

  // Get filtered survivors for mapping
  const filteredSurvivors = survivors?.filter((s) =>
    showdownSurvivors.includes(s.id)
  )

  // Sync active survivor with carousel index
  useEffect(() => {
    if (filteredSurvivors && filteredSurvivors[selectedIndex])
      setActiveSurvivor(filteredSurvivors[selectedIndex])
  }, [selectedIndex, setActiveSurvivor, filteredSurvivors])

  if (showdownSurvivors.length === 0 || !selectedSettlement) return <></>

  return (
    <Carousel
      className="embla p-0 max-w-full overflow-hidden"
      style={{
        width: getCarouselWidth(isMobile, state)
      }}>
      <div className="embla__controls min-w-[430px]">
        <div className="embla__buttons">
          <Button
            className="h-12 w-12"
            variant="ghost"
            size="icon"
            onClick={onPrevButtonClick}
            disabled={prevBtnDisabled}>
            <ArrowLeftIcon className="size-8" />
          </Button>

          <Button
            className="h-12 w-12"
            variant="ghost"
            size="icon"
            onClick={onNextButtonClick}
            disabled={nextBtnDisabled}>
            <ArrowRightIcon className="size-8" />
          </Button>
        </div>

        <div className="embla__dots">
          {scrollSnaps.map((_, index) => {
            const survivorColor = getSurvivorColorChoice(
              selectedShowdown,
              filteredSurvivors?.[index]?.id
            )
            const isSelected = index === selectedIndex

            return (
              <DotButton
                key={index}
                onClick={() => onDotButtonClick(index)}
                className={`embla__dot${isSelected ? ' embla__dot--selected' : ''}`}
                style={{
                  ['--dot-color' as string]: isSelected
                    ? 'hsl(var(--foreground))'
                    : 'transparent',
                  ['--dot-bg' as string]: `var(--color-${survivorColor.toLowerCase()}-500)`
                }}
              />
            )
          })}
        </div>
      </div>

      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container">
          {filteredSurvivors?.map((survivor) => (
            <div className="embla__slide" key={survivor.id}>
              <ShowdownSurvivorCard
                saveSelectedShowdown={saveSelectedShowdown}
                selectedSettlement={selectedSettlement}
                selectedShowdown={selectedShowdown}
                selectedSurvivor={selectedSurvivor}
                setSurvivors={setSurvivors}
                survivor={survivor}
                survivors={survivors}
                updateSelectedSurvivor={updateSelectedSurvivor}
              />
            </div>
          ))}
        </div>
      </div>
    </Carousel>
  )
}
