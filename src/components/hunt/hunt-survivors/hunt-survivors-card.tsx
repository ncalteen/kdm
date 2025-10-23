'use client'

import { HuntSurvivorCard } from '@/components/hunt/hunt-survivors/hunt-survivor-card'
import { Button } from '@/components/ui/button'
import { Carousel } from '@/components/ui/carousel'
import { usePrevNextButtons } from '@/components/ui/embla-carousel-arrow-buttons'
import {
  DotButton,
  useDotButton
} from '@/components/ui/embla-carousel-dot-button'
import { ColorChoice } from '@/lib/enums'
import { Hunt } from '@/schemas/hunt'
import { Settlement } from '@/schemas/settlement'
import { Survivor } from '@/schemas/survivor'
import Fade from 'embla-carousel-fade'
import useEmblaCarousel from 'embla-carousel-react'
import { ArrowLeftIcon, ArrowRightIcon } from 'lucide-react'
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
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Fade()])

  const { selectedIndex, scrollSnaps, onDotButtonClick } =
    useDotButton(emblaApi)

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

  /**
   * Get Survivor Color
   */
  const getSurvivorColor = (survivorId: number): ColorChoice => {
    if (!selectedHunt?.survivorColors) return ColorChoice.SLATE

    const survivorColor = selectedHunt.survivorColors.find(
      (sc) => sc.id === survivorId
    )

    return survivorColor?.color || ColorChoice.SLATE
  }

  if (huntSurvivors.length === 0 || !selectedSettlement) return <></>

  // Get filtered survivors for mapping
  const filteredSurvivors = survivors?.filter((s) =>
    huntSurvivors.includes(s.id)
  )

  return (
    <Carousel className="embla p-0 w-full">
      <div className="embla__controls">
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
            const survivor = filteredSurvivors?.[index]
            const survivorColor = survivor
              ? getSurvivorColor(survivor.id)
              : ColorChoice.SLATE
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
      </div>
    </Carousel>
  )
}
