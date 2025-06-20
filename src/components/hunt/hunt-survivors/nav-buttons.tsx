import { EmblaCarouselType } from 'embla-carousel'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import {
  ComponentPropsWithRef,
  FC,
  useCallback,
  useEffect,
  useState
} from 'react'

/**
 * Navigation Buttons Hook
 *
 * This hook manages the state and behavior of previous and next buttons for an
 * Embla Carousel instance. It provides functionality to enable or disable the
 * buttons based on the carousel's scroll state, and handles button click events
 * to navigate through the carousel items.
 *
 * @param emblaApi Embla Carousel API Instance
 * @returns Navigation Button States and Handlers
 */
export const usePrevNextButtons = (
  emblaApi: EmblaCarouselType | undefined
): {
  /** Previous Button Disabled */
  prevBtnDisabled: boolean
  /** Next Button Disabled */
  nextBtnDisabled: boolean
  /** Previous Button Click Handler */
  onPrevButtonClick: () => void
  /** Next Button Click Handler */
  onNextButtonClick: () => void
} => {
  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true)
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true)

  const onPrevButtonClick = useCallback(() => {
    if (!emblaApi) return
    emblaApi.scrollPrev()
  }, [emblaApi])

  const onNextButtonClick = useCallback(() => {
    if (!emblaApi) return
    emblaApi.scrollNext()
  }, [emblaApi])

  const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
    setPrevBtnDisabled(!emblaApi.canScrollPrev())
    setNextBtnDisabled(!emblaApi.canScrollNext())
  }, [])

  useEffect(() => {
    if (!emblaApi) return

    onSelect(emblaApi)
    emblaApi.on('reInit', onSelect).on('select', onSelect)
  }, [emblaApi, onSelect])

  return {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick
  }
}

/**
 * Previous Button Component
 *
 * @param props Previous Button Properties
 * @returns Previous Button Component
 */
export const PrevButton: FC<ComponentPropsWithRef<'button'>> = (props) => {
  const { children, ...restProps } = props

  return (
    <button
      className="embla__button embla__button--prev"
      type="button"
      {...restProps}>
      <ChevronLeftIcon className="h-8 w-8" />
      {children}
    </button>
  )
}

/**
 * Next Button Component
 *
 * @param props Next Button Properties
 * @returns Next Button Component
 */
export const NextButton: FC<ComponentPropsWithRef<'button'>> = (props) => {
  const { children, ...restProps } = props

  return (
    <button
      className="embla__button embla__button--next"
      type="button"
      {...restProps}>
      <ChevronRightIcon className="h-8 w-8" />
      {children}
    </button>
  )
}
