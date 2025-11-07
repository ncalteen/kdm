'use client'

/** Campaign Type */
export enum CampaignType {
  /** People of the Dream Keeper */
  PEOPLE_OF_THE_DREAM_KEEPER = 'People of the Dream Keeper',
  /** People of the Lantern */
  PEOPLE_OF_THE_LANTERN = 'People of the Lantern',
  /** People of the Stars */
  PEOPLE_OF_THE_STARS = 'People of the Stars',
  /** People of the Sun */
  PEOPLE_OF_THE_SUN = 'People of the Sun',
  /** Squires of the Citadel */
  SQUIRES_OF_THE_CITADEL = 'Squires of the Citadel',
  /** Custom */
  CUSTOM = 'Custom'
}

/** Survivor Type */
export enum SurvivorType {
  /** Arc */
  ARC = 'Arc',
  /** Core */
  CORE = 'Core'
}

export enum TabType {
  /** Arc Survivors */
  ARC = 'arc',
  /** Crafting */
  CRAFTING = 'crafting',
  /** Hunt */
  HUNT = 'hunt',
  /** Monsters */
  MONSTERS = 'monsters',
  /** Notes */
  NOTES = 'notes',
  /** Settings */
  SETTINGS = 'settings',
  /** Settlement */
  SETTLEMENT = 'settlement',
  /** Showdown */
  SHOWDOWN = 'showdown',
  /** Society */
  SOCIETY = 'society',
  /** Squires */
  SQUIRES = 'squires',
  /** Survivors */
  SURVIVORS = 'survivors',
  /** Timeline */
  TIMELINE = 'timeline'
}

/** Philosophies */
export enum Philosophy {
  /** Ambitionism */
  AMBITIONISM = 'Ambitionism',
  /** Champion */
  CHAMPION = 'Champion',
  /** Collectivism */
  COLLECTIVISM = 'Collectivism',
  /** Deadism */
  DEADISM = 'Deadism',
  /** Dreamism */
  DREAMISM = 'Dreamism',
  /** Faceism */
  FACEISM = 'Faceism',
  /** Gourmandism */
  GOURMANDISM = 'Gourmandism',
  /** Homicidalism */
  HOMICIDALISM = 'Homicidalism',
  /** Impermanism */
  IMPERMANISM = 'Impermanism',
  /** Lanternism */
  LANTERNISM = 'Lanternism',
  /** Marrowism */
  MARROWISM = 'Marrowism',
  /** Monster */
  MONSTER = 'Monster',
  /** Optimism */
  OPTIMISM = 'Optimism',
  /** Regalism */
  REGALISM = 'Regalism',
  /** Romanticism */
  ROMANTICISM = 'Romanticism',
  /** Survivalism */
  SURVIVALISM = 'Survivalism',
  /** Verminism */
  VERMINISM = 'Verminism'
}

/** Survivor Gender */
export enum Gender {
  /** Female */
  FEMALE = 'F',
  /** Male */
  MALE = 'M'
}

/** Weapon Types */
export enum WeaponType {
  /** Axe */
  AXE = 'Axe',
  /** Bow */
  BOW = 'Bow',
  /** Cleaver */
  CLEAVER = 'Cleaver',
  /** Club */
  CLUB = 'Club',
  /** Dagger */
  DAGGER = 'Dagger',
  /** Fan */
  FAN = 'Fan',
  /** Fist and Tooth */
  FIST_AND_TOOTH = 'Fist and Tooth',
  /** Grand */
  GRAND = 'Grand',
  /** Katana */
  KATANA = 'Katana',
  /** Katar */
  KATAR = 'Katar',
  /** Lantern Armor */
  LANTERN_ARMOR = 'Lantern Armor',
  /** Scythe */
  SCYTHE = 'Scythe',
  /** Shield */
  SHIELD = 'Shield',
  /** Spear */
  SPEAR = 'Spear',
  /** Sword */
  SWORD = 'Sword',
  /** Whip */
  WHIP = 'Whip'
}

export enum ResourceCategory {
  /** Basic */
  BASIC = 'Basic',
  /** Monster */
  MONSTER = 'Monster',
  /** Strange */
  STRANGE = 'Strange',
  /** Vermin */
  VERMIN = 'Vermin'
}

/** Resource Types */
export enum ResourceType {
  /** Bone */
  BONE = 'Bone',
  /** Hide */
  HIDE = 'Hide',
  /** Organ */
  ORGAN = 'Organ',
  /** Scrap */
  SCRAP = 'Scrap',
  /** Herb */
  HERB = 'Herb',
  /** Vermin */
  VERMIN = 'Vermin'
}

/** Monster Level */
export enum MonsterLevel {
  /** Level 1 */
  LEVEL_1 = '1',
  /** Level 2 */
  LEVEL_2 = '2',
  /** Level 3 */
  LEVEL_3 = '3',
  /** Level 4 */
  LEVEL_4 = '4'
}

/** Monster Type */
export enum MonsterType {
  /** Nemesis */
  NEMESIS = 'Nemesis',
  /** Quarry */
  QUARRY = 'Quarry'
}

/** Node Level */
export enum NodeLevel {
  /** Node 1 */
  NODE_1 = 'Node 1',
  /** Node 2 */
  NODE_2 = 'Node 2',
  /** Node 3 */
  NODE_3 = 'Node 3',
  /** Node 4 */
  NODE_4 = 'Node 4'
}

/** Color Choices */
export enum ColorChoice {
  /** Neutral */
  NEUTRAL = 'neutral',
  /** Stone */
  STONE = 'stone',
  /** Zinc */
  ZINC = 'zinc',
  /** Slate */
  SLATE = 'slate',
  /** Gray */
  GRAY = 'gray',
  /** Red */
  RED = 'red',
  /** Orange */
  ORANGE = 'orange',
  /** Amber */
  AMBER = 'amber',
  /** Yellow */
  YELLOW = 'yellow',
  /** Lime */
  LIME = 'lime',
  /** Green */
  GREEN = 'green',
  /** Emerald */
  EMERALD = 'emerald',
  /** Teal */
  TEAL = 'teal',
  /** Cyan */
  CYAN = 'cyan',
  /** Sky */
  SKY = 'sky',
  /** Blue */
  BLUE = 'blue',
  /** Indigo */
  INDIGO = 'indigo',
  /** Violet */
  VIOLET = 'violet',
  /** Purple */
  PURPLE = 'purple',
  /** Fuchsia */
  FUCHSIA = 'fuchsia',
  /** Pink */
  PINK = 'pink',
  /** Rose */
  ROSE = 'rose'
}

export enum AmbushType {
  /** Survivors Ambush Monster */
  SURVIVORS = 'survivors',
  /** Monster Ambush Survivors */
  MONSTER = 'monster',
  /** No Ambush */
  NONE = 'none'
}

export enum TurnType {
  /** Survivors Turn */
  SURVIVORS = 'survivors',
  /** Monsters Turn */
  MONSTER = 'monster'
}

export enum MonsterName {
  FLOWER_KNIGHT = 'Flower Knight'
}
