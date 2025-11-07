/**
 * Error Message
 *
 * @returns Error Message
 */
export const ERROR_MESSAGE = () =>
  'The darkness swallows your words. Please try again.'

/**
 * Ambush Message
 *
 * @param ambushType Ambush Type
 * @returns Ambush Message
 */
export const AMBUSH_MESSAGE = (ambushType: number): string => {
  switch (ambushType) {
    case 0:
      return 'The survivors ambush their quarry! The showdown begins.'
    case 1:
      return 'The monster ambushes the survivors! The showdown begins.'
    case 2:
      return 'The hunt reaches its epic climax. The showdown begins.'
    default:
      return 'The showdown begins.'
  }
}

/**
 * Hunt Deleted
 */
export const HUNT_DELETED_MESSAGE = () =>
  'The hunt ends. Survivors return to the relative safety of the settlement.'

/**
 * Survivors Moved on the Hunt Board
 */
export const SURVIVORS_MOVED_MESSAGE = () => 'Survivors moved.'

/**
 * Monster Moved on the Hunt Board
 */
export const MONSTER_MOVED_MESSAGE = () => 'Monster moved.'
