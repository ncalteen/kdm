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
 *
 * @returns Hunt Deleted Message
 */
export const HUNT_DELETED_MESSAGE = () =>
  'The hunt ends. Survivors return to the relative safety of the settlement.'

/**
 * Survivors Moved on the Hunt Board
 *
 * @returns Survivors Moved Message
 */
export const SURVIVORS_MOVED_MESSAGE = () => 'Survivors moved.'

/**
 * Monster Moved on the Hunt Board
 *
 * @returns Monster Moved Message
 */
export const MONSTER_MOVED_MESSAGE = () => 'Monster moved.'

/**
 * Settlement Saved
 *
 * @returns Settlement Saved Message
 */
export const SETTLEMENT_SAVED_MESSAGE = () => 'Settlement records preserved!'

/**
 * Settlement Loaded
 *
 * @returns Settlement Loaded Message
 */
export const SETTLEMENT_LOADED_MESSAGE = () => 'Settlement chronicles loaded!'

/**
 * Scout Required for Hunt/Showdown
 *
 * @param type Type of Activity
 * @returns Scout Required Message
 */
export const SCOUT_REQUIRED_MESSAGE = (type: 'hunt' | 'showdown') =>
  `This settlement employs scouts. A scout must be selected to begin the ${type}.`

/**
 * Scout Conflict
 *
 * @returns Scout Conflict Message
 */
export const SCOUT_CONFLICT_MESSAGE = () =>
  'The selected scout cannot also be one of the survivors selected for the hunt.'

/**
 * Hunt Begins
 *
 * @param monsterName Monster Name
 * @returns Hunt Begins Message
 */
export const HUNT_BEGINS_MESSAGE = (monsterName: string) =>
  `The hunt for ${monsterName} begins. Survivors venture into the darkness.`

/**
 * Nameless Trait Error
 *
 * @returns Nameless Trait Error Message
 */
export const NAMELESS_TRAIT_ERROR = () => 'A nameless trait cannot be recorded.'

/**
 * Updated Trait
 *
 * @returns Updated Trait Message
 */
export const UPDATED_TRAIT_MESSAGE = () => 'The trait has been updated.'

/**
 * New Trait
 *
 * @returns New Trait Message
 */
export const NEW_TRAIT_MESSAGE = () => 'A new trait emerges.'

/**
 * Removed Trait
 *
 * @returns Removed Trait Message
 */
export const REMOVED_TRAIT_MESSAGE = () => 'The trait fades from memory.'

/**
 * Removed Mood
 *
 * @returns Removed Mood Message
 */
export const REMOVED_MOOD_MESSAGE = () => 'The mood subsides.'

/**
 * Nameless Mood Error
 *
 * @returns Nameless Mood Error Message
 */
export const NAMELESS_MOOD_ERROR = () => 'A nameless mood cannot be recorded.'

/**
 * Updated Mood
 *
 * @returns Updated Mood Message
 */
export const UPDATED_MOOD_MESSAGE = () => 'The mood has been updated.'

/**
 * New Mood
 *
 * @returns New Mood Message
 */
export const NEW_MOOD_MESSAGE = () => 'A new mood takes hold.'

/**
 * Save Hunt Monster Notes
 *
 * @returns Save Hunt Monster Notes Message
 */
export const SAVE_HUNT_MONSTER_NOTES_MESSAGE = () =>
  'The tales of this hunt are recorded for future generations.'

/**
 * Monster Starts Showdown Knocked Down
 *
 * @param knockedDown Knocked Down Status
 * @returns Monster Starts Showdown Knocked Down Message
 */
export const MONSTER_STARTS_SHOWDOWN_KNOCKED_DOWN_MESSAGE = (
  knockedDown: boolean
) =>
  knockedDown
    ? 'The monster will start the showdown knocked down.'
    : 'The monster will start the showdown standing.'

/**
 * Monster AI Deck Updated
 *
 * @param oldValue Old Value
 * @param newValue New Value
 * @returns Update Message
 */
export const MONSTER_AI_DECK_UPDATED_MESSAGE = (
  oldValue: number,
  newValue: number
) =>
  oldValue < newValue
    ? 'The monster gains AI cards.'
    : oldValue < newValue
      ? 'The monster loses AI cards.'
      : 'The monster AI deck remains unchanged.'

/**
 * Monster Wound Deck Updated
 *
 * @param oldValue Old Value
 * @param newValue New Value
 * @returns Update Message
 */
export const MONSTER_WOUND_DECK_UPDATED_MESSAGE = (
  oldValue: number,
  newValue: number
) =>
  oldValue < newValue
    ? 'The monster heals its wounds.'
    : oldValue < newValue
      ? 'The monster suffers new wounds.'
      : "The monster's wound deck remains unchanged."

/**
 * Monster Toughness Updated
 *
 * @param oldValue Old Value
 * @param newValue New Value
 * @returns Update Message
 */
export const MONSTER_TOUGHNESS_UPDATED_MESSAGE = (
  oldValue: number,
  newValue: number
) =>
  oldValue < newValue
    ? 'The monster becomes tougher.'
    : oldValue > newValue
      ? 'The monster becomes less tough.'
      : "The monster's toughness remains unchanged."

/**
 * Monster Movement Updated
 *
 * @param oldValue Old Value
 * @param newValue New Value
 * @returns Update Message
 */
export const MONSTER_MOVEMENT_UPDATED_MESSAGE = (
  oldValue: number,
  newValue: number
) =>
  oldValue < newValue
    ? 'The monster moves swifter.'
    : oldValue > newValue
      ? 'The monster moves slower.'
      : "The monster's movement remains unchanged."

/**
 * Monster Movement Tokens Updated
 *
 * @param oldValue Old Value
 * @param newValue New Value
 * @returns Update Message
 */
export const MONSTER_MOVEMENT_TOKENS_UPDATED_MESSAGE = (
  oldValue: number,
  newValue: number
) =>
  oldValue < newValue
    ? 'The monster gains movement tokens.'
    : oldValue > newValue
      ? 'The monster loses movement tokens.'
      : "The monster's movement tokens remain unchanged."

/**
 * Monster Accuracy Updated
 *
 * @param oldValue Old Value
 * @param newValue New Value
 * @returns Update Message
 */
export const MONSTER_ACCURACY_UPDATED_MESSAGE = (
  oldValue: number,
  newValue: number
) =>
  oldValue < newValue
    ? 'The monster strikes more accurately.'
    : oldValue > newValue
      ? 'The monster strikes less accurately.'
      : "The monster's accuracy remains unchanged."

/**
 * Monster Accuracy Tokens Updated
 *
 * @param oldValue Old Value
 * @param newValue New Value
 * @returns Update Message
 */
export const MONSTER_ACCURACY_TOKENS_UPDATED_MESSAGE = (
  oldValue: number,
  newValue: number
) =>
  oldValue < newValue
    ? 'The monster gains accuracy tokens.'
    : oldValue > newValue
      ? 'The monster loses accuracy tokens.'
      : "The monster's accuracy tokens remain unchanged."

/**
 * Monster Strength Updated
 *
 * @param oldValue Old Value
 * @param newValue New Value
 * @returns Update Message
 */
export const MONSTER_STRENGTH_UPDATED_MESSAGE = (
  oldValue: number,
  newValue: number
) =>
  oldValue < newValue
    ? 'The monster strikes more powerfully.'
    : oldValue > newValue
      ? 'The monster strikes less powerfully.'
      : "The monster's strength remains unchanged."

/**
 * Monster Strength Tokens Updated
 *
 * @param oldValue Old Value
 * @param newValue New Value
 * @returns Update Message
 */
export const MONSTER_STRENGTH_TOKENS_UPDATED_MESSAGE = (
  oldValue: number,
  newValue: number
) =>
  oldValue < newValue
    ? 'The monster gains strength tokens.'
    : oldValue > newValue
      ? 'The monster loses strength tokens.'
      : "The monster's strength tokens remain unchanged."

/**
 * Monster Evasion Updated
 *
 * @param oldValue Old Value
 * @param newValue New Value
 * @returns Update Message
 */
export const MONSTER_EVASION_UPDATED_MESSAGE = (
  oldValue: number,
  newValue: number
) =>
  oldValue < newValue
    ? 'The monster evades attacks more effectively.'
    : oldValue > newValue
      ? 'The monster evades attacks less effectively.'
      : "The monster's evasion remains unchanged."

/**
 * Monster Evasion Tokens Updated
 *
 * @param oldValue Old Value
 * @param newValue New Value
 * @returns Update Message
 */
export const MONSTER_EVASION_TOKENS_UPDATED_MESSAGE = (
  oldValue: number,
  newValue: number
) =>
  oldValue < newValue
    ? 'The monster gains evasion tokens.'
    : oldValue > newValue
      ? 'The monster loses evasion tokens.'
      : "The monster's evasion tokens remain unchanged."

/**
 * Monster Luck Updated
 *
 * @param oldValue Old Value
 * @param newValue New Value
 * @returns Update Message
 */
export const MONSTER_LUCK_UPDATED_MESSAGE = (
  oldValue: number,
  newValue: number
) =>
  oldValue < newValue
    ? 'The monster becomes luckier.'
    : oldValue > newValue
      ? 'The monster becomes unluckier.'
      : "The monster's luck remains unchanged."

/**
 * Monster Luck Tokens Updated
 *
 * @param oldValue Old Value
 * @param newValue New Value
 * @returns Update Message
 */
export const MONSTER_LUCK_TOKENS_UPDATED_MESSAGE = (
  oldValue: number,
  newValue: number
) =>
  oldValue < newValue
    ? 'The monster gains luck tokens.'
    : oldValue > newValue
      ? 'The monster loses luck tokens.'
      : "The monster's luck tokens remain unchanged."

/**
 * Monster Speed Updated
 *
 * @param oldValue Old Value
 * @param newValue New Value
 * @returns Update Message
 */
export const MONSTER_SPEED_UPDATED_MESSAGE = (
  oldValue: number,
  newValue: number
) =>
  oldValue < newValue
    ? 'The monster attacks more swiftly.'
    : oldValue > newValue
      ? 'The monster attacks more slowly.'
      : "The monster's attack speed remains unchanged."

/**
 * Monster Speed Tokens Updated
 *
 * @param oldValue Old Value
 * @param newValue New Value
 * @returns Update Message
 */
export const MONSTER_SPEED_TOKENS_UPDATED_MESSAGE = (
  oldValue: number,
  newValue: number
) =>
  oldValue < newValue
    ? 'The monster gains speed tokens.'
    : oldValue > newValue
      ? 'The monster loses speed tokens.'
      : "The monster's speed tokens remain unchanged."
