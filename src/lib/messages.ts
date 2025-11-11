import { ColorChoice } from '@/lib/enums'

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
 * Save Hunt Notes
 *
 * @returns Save Hunt Notes Message
 */
export const SAVE_HUNT_NOTES_MESSAGE = () =>
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

/**
 * Survivor Not Found
 *
 * @returns Survivor Not Found Message
 */
export const SURVIVOR_NOT_FOUND_MESSAGE = () =>
  'Survivor not found in campaign data.'

/**
 * Survivor Color Changed
 *
 * @param newColor New Color
 * @returns Survivor Color Changed Message
 */
export const SURVIVOR_COLOR_CHANGED_MESSAGE = (newColor: ColorChoice) =>
  `Survivor color changed to ${newColor}.`

/**
 * Survivor Survival Updated
 *
 * @param oldValue Old Value
 * @param newValue New Value
 * @returns Update Message
 */
export const SURVIVOR_SURVIVAL_UPDATED_MESSAGE = (
  oldValue: number,
  newValue: number
) =>
  oldValue < newValue
    ? 'The survivor gains survival.'
    : oldValue > newValue
      ? 'The survivor loses survival.'
      : "The survivor's survival remains unchanged."

/**
 * Survivor Insanity Updated
 *
 * @param oldValue Old Value
 * @param newValue New Value
 * @returns Update Message
 */
export const SURVIVOR_INSANITY_UPDATED_MESSAGE = (
  oldValue: number,
  newValue: number
) =>
  oldValue < newValue
    ? 'The survivor gains insanity.'
    : oldValue > newValue
      ? 'The survivor loses insanity.'
      : "The survivor's insanity remains unchanged."

/**
 * Survivor Can Spend Survival Updated
 *
 * @param value New Value
 * @returns Update Message
 */
export const SURVIVOR_CAN_SPEND_SURVIVAL_UPDATED_MESSAGE = (value: boolean) =>
  value === false
    ? 'The survivor freezes - survival cannot be spent.'
    : 'The survivor can once again spend survival.'

/**
 * Survivor Base Attribute Updated
 *
 * @param attributeName Attribute Name
 * @returns Update Message
 */
export const SURVIVOR_BASE_ATTRIBUTE_UPDATED_MESSAGE = (
  attributeName: string
) => `The survivor's ${attributeName} has been updated.`

/**
 * Survivor Attribute Token Updated
 *
 * @param attributeName Attribute Name
 * @returns Update Message
 */
export const SURVIVOR_ATTRIBUTE_TOKEN_UPDATED_MESSAGE = (
  attributeName: string
) => `The survivor's ${attributeName} tokens have been updated.`

/**
 * Philosophy Deleted
 *
 * @returns Philosophy Deleted Message
 */
export const PHILOSOPHY_DELETED_MESSAGE = () =>
  'The philosophy fades into the void.'

/**
 * Nameless Philosophy Error
 *
 * @returns Nameless Philosophy Error Message
 */
export const NAMELESS_PHILOSOPHY_ERROR = () =>
  'A nameless philosophy cannot be recorded.'

/**
 * Updated Philosophy
 *
 * @returns Updated Philosophy Message
 */
export const UPDATED_PHILOSOPHY_MESSAGE = () => 'Philosophy etched into memory.'

/**
 * New Philosophy
 *
 * @returns New Philosophy Message
 */
export const NEW_PHILOSOPHY_MESSAGE = () => 'A new philosophy emerges.'

/**
 * Knowledge Deleted
 *
 * @returns Knowledge Deleted Message
 */
export const KNOWLEDGE_DELETED_MESSAGE = () => 'Knowledge banished to the void.'

/**
 * Nameless Knowledge Error
 *
 * @returns Nameless Knowledge Error Message
 */
export const NAMELESS_KNOWLEDGE_ERROR = () =>
  'A nameless knowledge cannot be recorded.'

/**
 * Updated Knowledge
 *
 * @returns Updated Knowledge Message
 */
export const UPDATED_KNOWLEDGE_MESSAGE = () => 'Knowledge carved into memory.'

/**
 * New Knowledge
 *
 * @returns New Knowledge Message
 */
export const NEW_KNOWLEDGE_MESSAGE = () =>
  'New knowledge illuminates the settlement.'

/**
 * Collective Cognition Victory Saved
 *
 * @param victory Victory Status
 * @returns Collective Cognition Victory Saved Message
 */
export const COLLECTIVE_COGNITION_VICTORY_SAVED_MESSAGE = (victory: boolean) =>
  victory
    ? "The settlement's legacy grows stronger."
    : "The settlement's legacy endures despite setbacks."

/**
 * Collective Cognition Reward Saved
 *
 * @param unlocked Unlocked Status
 * @returns Collective Cognition Reward Saved Message
 */
export const COLLECTIVE_COGNITION_REWARD_SAVED_MESSAGE = (unlocked: boolean) =>
  unlocked
    ? 'Reward granted by the darkness.'
    : 'The dark gift recedes into shadow.'

/**
 * Nameless Collective Cognition Reward Error
 *
 * @returns Nameless Collective Cognition Reward Error Message
 */
export const NAMELESS_COLLECTIVE_COGNITION_REWARD_ERROR = () =>
  'A nameless collective cognition reward cannot be recorded.'

/**
 * No Target Collective Cognition Reward Error
 *
 * @returns No Target Collective Cognition Reward Error Message
 */
export const NO_TARGET_COLLECTIVE_COGNITION_REWARD_ERROR = () =>
  'A reward must have a collective cognition target.'

/**
 * Collective Cognition Reward Updated
 *
 * @returns Collective Cognition Reward Updated Message
 */
export const COLLECTIVE_COGNITION_REWARD_UPDATED_MESSAGE = () =>
  "The settlement's culinary knowledge expands."

/**
 * Remove Arrival Bonus
 *
 * @returns Remove Arrival Bonus Message
 */
export const REMOVE_ARRIVAL_BONUS_MESSAGE = () =>
  'A blessing fades into the void.'

/**
 * Nameless Arrival Bonus Error
 *
 * @returns Nameless Arrival Bonus Error Message
 */
export const NAMELESS_ARRIVAL_BONUS_ERROR = () =>
  'A nameless arrival bonus cannot be recorded.'

/**
 * Updated Arrival Bonus
 *
 * @param index Arrival Bonus Index
 * @returns Updated Arrival Bonus Message
 */
export const UPDATE_ARRIVAL_BONUS_MESSAGE = (index?: number) =>
  index === undefined
    ? 'The blessing has been inscribed.'
    : 'A new blessing graces your settlement.'

/**
 * Remove Departing Bonus
 *
 * @returns Remove Departing Bonus Message
 */
export const REMOVE_DEPARTING_BONUS_MESSAGE = () =>
  'A blessing fades into the void.'

/**
 * Nameless Departing Bonus Error
 *
 * @returns Nameless Departing Bonus Error Message
 */
export const NAMELESS_DEPARTING_BONUS_ERROR = () =>
  'A nameless blessing cannot be recorded.'

/**
 * Updated Departing Bonus
 *
 * @param index Departing Bonus Index
 * @returns Updated Departing Bonus Message
 */
export const UPDATE_DEPARTING_BONUS_MESSAGE = (index?: number) =>
  index !== undefined
    ? 'The blessing has been inscribed.'
    : 'A new blessing graces your settlement.'

/**
 * Remove Gear
 *
 * @returns Remove Gear Message
 */
export const REMOVE_GEAR_MESSAGE = () => 'Gear has been archived.'

/**
 * Nameless Gear Error
 *
 * @returns Nameless Gear Error Message
 */
export const NAMELESS_GEAR_ERROR = () => 'Nameless gear cannot be stored.'

/**
 * Updated Gear
 *
 * @param index Gear Index
 * @returns Updated Gear Message
 */
export const UPDATE_GEAR_MESSAGE = (index?: number) =>
  index !== undefined
    ? 'Gear has been modified.'
    : 'New gear added to settlement storage.'

/**
 * Remove Innovation
 *
 * @returns Remove Innovation Message
 */
export const REMOVE_INNOVATION_MESSAGE = () => 'The innovation has been lost.'

/**
 * Nameless Innovation Error
 *
 * @returns Nameless Innovation Error Message
 */
export const NAMELESS_INNOVATION_ERROR = () =>
  'A nameless innovation cannot be recorded.'

/**
 * Updated Innovation
 *
 * @param index Innovation Index
 * @returns Updated Innovation Message
 */
export const UPDATE_INNOVATION_MESSAGE = (index?: number) =>
  index !== undefined
    ? 'The innovation has been updated.'
    : 'The settlement has innovated.'

/**
 * Remove Location
 *
 * @returns Remove Location Message
 */
export const REMOVE_LOCATION_MESSAGE = () => 'The location has been destroyed.'

/**
 * Nameless Location Error
 *
 * @returns Nameless Location Error Message
 */
export const NAMELESS_LOCATION_ERROR = () =>
  'A nameless location cannot be recorded.'

/**
 * Updated Location
 *
 * @param index Location Index
 * @returns Updated Location Message
 */
export const UPDATE_LOCATION_MESSAGE = (index?: number) =>
  index !== undefined
    ? 'The location has been updated.'
    : 'A new location illuminates within settlement.'

/**
 * Location Unlocked
 *
 * @param unlocked Location Unlocked State
 * @returns Location Unlocked Message
 */
export const LOCATION_UNLOCKED_MESSAGE = (unlocked: boolean) =>
  unlocked
    ? 'The location has been illuminated.'
    : 'The location fades into darkness.'

/**
 * Remove Milestone
 *
 * @returns Remove Milestone Message
 */
export const REMOVE_MILESTONE_MESSAGE = () =>
  'The milestone fades into the darkness.'

/**
 * Nameless Milestone Error
 *
 * @returns Nameless Milestone Error Message
 */
export const NAMELESS_MILESTONE_ERROR = () =>
  'A nameless milestone cannot be recorded.'

/**
 * Milestone Missing Event Error
 *
 * @returns Milestone Missing Event Error Message
 */
export const MILESTONE_MISSING_EVENT_ERROR = () =>
  'A milestone must include a story event.'

/**
 * Updated Milestone
 *
 * @param index Milestone Index
 * @returns Updated Milestone Message
 */
export const UPDATE_MILESTONE_MESSAGE = (index?: number) =>
  index !== undefined
    ? 'Milestones have been updated.'
    : "A new milestone marks the settlement's destiny."

/**
 * Milestone Complete
 *
 * @param complete Milestone Complete State
 * @returns Milestone Complete Message
 */
export const MILESTONE_COMPLETE_MESSAGE = (complete: boolean) =>
  complete
    ? 'Milestone achieved - the settlement persists through the darkness.'
    : 'Milestone status updated.'

/**
 * Remove Monster Volume
 *
 * @returns Remove Monster Volume Message
 */
export const REMOVE_MONSTER_VOLUME_MESSAGE = () =>
  'The monster volume has been consigned to darkness.'

/**
 * Nameless Monster Volume Error
 *
 * @returns Nameless Monster Volume Error Message
 */
export const NAMELESS_MONSTER_VOLUME_ERROR = () =>
  'A nameless monster volume cannot be recorded.'

/**
 * Updated Monster Volume
 *
 * @param index Monster Volume Index
 * @returns Updated Monster Volume Message
 */
export const UPDATE_MONSTER_VOLUME_MESSAGE = (index?: number) =>
  index !== undefined
    ? 'Monster volume inscribed in blood.'
    : 'New monster volume inscribed in blood.'

/**
 * Remove Nemesis
 *
 * @returns Remove Nemesis Message
 */
export const REMOVE_NEMESIS_MESSAGE = () =>
  'The nemesis has returned to the darkness.'

/**
 * Nameless Nemesis Error
 *
 * @returns Nameless Nemesis Error Message
 */
export const NAMELESS_NEMESIS_ERROR = () =>
  'A nameless nemesis cannot be recorded.'

/**
 * Nameless Horror Error (for new nemesis creation)
 *
 * @returns Nameless Horror Error Message
 */
export const NAMELESS_HORROR_ERROR = () =>
  'A nameless horror cannot be summoned.'

/**
 * Updated Nemesis
 *
 * @param index Nemesis Index
 * @returns Updated Nemesis Message
 */
export const UPDATE_NEMESIS_MESSAGE = (index?: number) =>
  index !== undefined
    ? 'The nemesis waits outside your settlement.'
    : 'A new nemesis emerges.'

/**
 * Nemesis Unlocked
 *
 * @param name Nemesis Name
 * @param unlocked Nemesis Unlocked State
 * @returns Nemesis Unlocked Message
 */
export const NEMESIS_UNLOCKED_MESSAGE = (name: string, unlocked: boolean) =>
  `${name} ${unlocked ? 'emerges, ready to accept your challenge.' : 'retreats into the darkness, beyond your reach.'}`

/**
 * Survival Limit Minimum Error
 *
 * @returns Survival Limit Minimum Error Message
 */
export const SURVIVAL_LIMIT_MINIMUM_ERROR = () =>
  'Survival limit cannot be reduced below 1.'

/**
 * Lantern Research Level Minimum Error
 *
 * @returns Lantern Research Level Minimum Error Message
 */
export const LANTERN_RESEARCH_LEVEL_MINIMUM_ERROR = () =>
  'Lantern research level cannot be reduced below 0.'

/**
 * Remove Pattern
 *
 * @returns Remove Pattern Message
 */
export const REMOVE_PATTERN_MESSAGE = () => 'The pattern has been lost.'

/**
 * Nameless Pattern Error
 *
 * @returns Nameless Pattern Error Message
 */
export const NAMELESS_PATTERN_ERROR = () =>
  'A nameless pattern cannot be preserved.'

/**
 * Updated Pattern
 *
 * @param index Pattern Index
 * @returns Updated Pattern Message
 */
export const UPDATE_PATTERN_MESSAGE = (index?: number) =>
  index !== undefined
    ? 'The pattern has been updated.'
    : 'A new pattern emerges.'

/**
 * Remove Seed Pattern
 *
 * @returns Remove Seed Pattern Message
 */
export const REMOVE_SEED_PATTERN_MESSAGE = () =>
  'The seed pattern has been consumed by darkness.'

/**
 * Nameless Seed Pattern Error
 *
 * @returns Nameless Seed Pattern Error Message
 */
export const NAMELESS_SEED_PATTERN_ERROR = () =>
  'A nameless seed pattern cannot be preserved.'

/**
 * Updated Seed Pattern
 *
 * @param index Seed Pattern Index
 * @returns Updated Seed Pattern Message
 */
export const UPDATE_SEED_PATTERN_MESSAGE = (index?: number) =>
  index !== undefined
    ? 'The seed pattern has been updated.'
    : 'A new seed pattern has taken root.'

/**
 * Remove Principle
 *
 * @returns Remove Principle Message
 */
export const REMOVE_PRINCIPLE_MESSAGE = () => 'The principle fades into memory.'

/**
 * Nameless Principle Error
 *
 * @returns Nameless Principle Error Message
 */
export const NAMELESS_PRINCIPLE_ERROR = () =>
  'A nameless principle cannot be recorded.'

/**
 * Updated Principle
 *
 * @param isNew Is New Principle
 * @returns Updated Principle Message
 */
export const UPDATE_PRINCIPLE_MESSAGE = (isNew: boolean) =>
  isNew
    ? 'A new principle guides your settlement.'
    : 'The principle has been inscribed.'

/**
 * Principle Option Selected
 *
 * @param optionName Name of the selected option
 * @returns Principle Option Selected Message
 */
export const PRINCIPLE_OPTION_SELECTED_MESSAGE = (optionName: string) =>
  `The settlement has chosen ${optionName}.`

/**
 * Remove Quarry
 *
 * @returns Remove Quarry Message
 */
export const REMOVE_QUARRY_MESSAGE = () => 'The quarry has vanished.'

/**
 * Nameless Quarry Error
 *
 * @returns Nameless Quarry Error Message
 */
export const NAMELESS_QUARRY_ERROR = () =>
  'A nameless quarry cannot be recorded.'

/**
 * Updated Quarry
 *
 * @param index Quarry Index
 * @returns Updated Quarry Message
 */
export const UPDATE_QUARRY_MESSAGE = (index?: number) =>
  index !== undefined
    ? 'The quarry has been tracked.'
    : 'A new quarry has been discovered.'

/**
 * Quarry Unlocked
 *
 * @param quarryName Name of the quarry
 * @param unlocked Quarry Unlocked State
 * @returns Quarry Unlocked Message
 */
export const QUARRY_UNLOCKED_MESSAGE = (
  quarryName: string,
  unlocked: boolean
) =>
  `${quarryName} ${unlocked ? 'emerges, ready to be hunted.' : 'retreats into the darkness, beyond your reach.'}`

/**
 * Remove Resource
 *
 * @returns Remove Resource Message
 */
export const REMOVE_RESOURCE_MESSAGE = () => 'The resource has been consumed.'

/**
 * Nameless Resource Error
 *
 * @returns Nameless Resource Error Message
 */
export const NAMELESS_RESOURCE_ERROR = () =>
  'A nameless resource cannot be recorded.'

/**
 * Updated Resource
 *
 * @param index Resource Index
 * @returns Updated Resource Message
 */
export const UPDATE_RESOURCE_MESSAGE = (index?: number) =>
  index !== undefined
    ? 'The resource has been cataloged.'
    : 'A new resource has been gathered.'

/**
 * Showdown Deleted
 *
 * @returns Showdown Deleted Message
 */
export const SHOWDOWN_DELETED_MESSAGE = () =>
  'The showdown ends. Survivors catch their breath.'

/**
 * Settlement Deleted
 *
 * @param settlementName Name of the settlement
 * @returns Settlement Deleted Message
 */
export const SETTLEMENT_DELETED_MESSAGE = (settlementName: string) =>
  `A wave of darkness washes over ${settlementName}. Voices cried out, and were silenced.`

/**
 * Survivor On Hunt Error
 *
 * @returns Survivor On Hunt Error Message
 */
export const SURVIVOR_ON_HUNT_ERROR = () =>
  'The survivor cannot be erased while on a hunt.'

/**
 * Survivor On Showdown Error
 *
 * @returns Survivor On Showdown Error Message
 */
export const SURVIVOR_ON_SHOWDOWN_ERROR = () =>
  'The survivor cannot be erased while in a showdown.'

/**
 * Survivor Deleted
 *
 * @param survivorName Name of the survivor
 * @returns Survivor Deleted Message
 */
export const SURVIVOR_DELETED_MESSAGE = (survivorName: string) =>
  `Darkness overtook ${survivorName}. A voice cried out, and was suddenly silenced.`

/**
 * Squire Suspicion Updated
 *
 * @param squireName Squire Name
 * @returns Squire Suspicion Updated Message
 */
export const SQUIRE_SUSPICION_UPDATED_MESSAGE = (squireName: string) =>
  `${squireName}'s doubt grows deeper.`

/**
 * Settlement Notes Saved
 *
 * @returns Settlement Notes Saved Message
 */
export const SETTLEMENT_NOTES_SAVED_MESSAGE = () =>
  'As stories are shared amongst survivors, they are etched into the history of your settlement.'

/**
 * Timeline Event Removed
 *
 * @returns Timeline Event Removed Message
 */
export const TIMELINE_EVENT_REMOVED_MESSAGE = () =>
  'The chronicle is altered - a memory fades into darkness.'

/**
 * Timeline Event Saved
 *
 * @returns Timeline Event Saved Message
 */
export const TIMELINE_EVENT_SAVED_MESSAGE = () =>
  'The chronicles remember - a memory is etched in stone.'

/**
 * Timeline Year Completed
 *
 * @param completed Year Completion Status
 * @returns Timeline Year Completed Message
 */
export const TIMELINE_YEAR_COMPLETED_MESSAGE = (completed: boolean) =>
  completed ? 'The year concludes in triumph.' : 'The year remains unfinished.'

/**
 * Timeline Year Added
 *
 * @returns Timeline Year Added Message
 */
export const TIMELINE_YEAR_ADDED_MESSAGE = () =>
  'A new lantern year is added - the chronicles expand.'

/**
 * Timeline Event Empty Warning
 *
 * @returns Timeline Event Empty Warning Message
 */
export const TIMELINE_EVENT_EMPTY_WARNING = () =>
  'Finish editing the current event before adding another.'

/**
 * Timeline Event Empty Error
 *
 * @returns Timeline Event Empty Error Message
 */
export const TIMELINE_EVENT_EMPTY_ERROR = () => 'Cannot save an empty event!'

/**
 * Settlement Created
 *
 * @returns Settlement Created Message
 */
export const SETTLEMENT_CREATED_MESSAGE = () =>
  'A lantern pierces the darkness. A new settlement is born.'
