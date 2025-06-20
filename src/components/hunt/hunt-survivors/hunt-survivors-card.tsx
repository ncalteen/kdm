'use client'

import { HuntSurvivorCard } from '@/components/hunt/hunt-survivors/hunt-survivor-card'
import {
  NextButton,
  PrevButton,
  usePrevNextButtons
} from '@/components/hunt/hunt-survivors/nav-buttons'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger
} from '@/components/ui/menubar'
import { Hunt } from '@/schemas/hunt'
import { Settlement } from '@/schemas/settlement'
import { Survivor } from '@/schemas/survivor'
import useEmblaCarousel from 'embla-carousel-react'
import { ReactElement, useMemo } from 'react'

/**
 * Hunt Survivors Card Properties
 */
interface HuntSurvivorsCardProps {
  /** On Cancel Hunt */
  onCancelHunt: () => void
  /** On Showdown */
  onShowdown: () => void
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
  onCancelHunt,
  onShowdown,
  saveSelectedHunt,
  selectedHunt,
  selectedSettlement,
  selectedSurvivor,
  setSurvivors,
  survivors,
  updateSelectedSurvivor
}: HuntSurvivorsCardProps): ReactElement {
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

  if (huntSurvivors.length === 0 || !selectedSettlement) return <></>

  return (
    <Card className="embla pt-0 gap-0">
      <CardHeader className="embla__controls">
        <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
        {/* Menu Bar */}
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger>Actions</MenubarTrigger>
            <MenubarContent>
              <MenubarItem onClick={onShowdown}>
                (Combing Soon) Proceed to Showdown
              </MenubarItem>
              <MenubarItem variant="destructive" onClick={onCancelHunt}>
                Cancel Hunt
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
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
