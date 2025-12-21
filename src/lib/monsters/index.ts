import { ATNAS } from '@/lib/monsters/atnas'
import { BLACK_KNIGHT } from '@/lib/monsters/black-knight'
import { BUTCHER, KILLENIUM_BUTCHER } from '@/lib/monsters/butcher'
import { CRIMSON_CROCODILE } from '@/lib/monsters/crimson-crocodile'
import { DRAGON_KING, DYING_GOD } from '@/lib/monsters/dragon-king'
import { DUNG_BEETLE_KNIGHT } from '@/lib/monsters/dung-beetle-knight'
import { FLOWER_KNIGHT } from '@/lib/monsters/flower-knight'
import { BULLFROGDOG, FROGDOG } from '@/lib/monsters/frogdog'
import { GAMBLER } from '@/lib/monsters/gambler'
import { GODHAND } from '@/lib/monsters/godhand'
import { GOLD_SMOKE_KNIGHT } from '@/lib/monsters/gold-smoke-knight'
import { GORM } from '@/lib/monsters/gorm'
import { HAND } from '@/lib/monsters/hand'
import { KING } from '@/lib/monsters/king'
import { KINGS_MAN } from '@/lib/monsters/kings-man'
import { LION_GOD } from '@/lib/monsters/lion-god'
import { LION_KNIGHT } from '@/lib/monsters/lion-knight'
import { LONELY_TREE } from '@/lib/monsters/lonely-tree'
import { MANHUNTER } from '@/lib/monsters/manhunter'
import { PARIAH } from '@/lib/monsters/pariah'
import { PHOENIX } from '@/lib/monsters/phoenix'
import {
  RED_WITCHES,
  RED_WITCHES_BRAAL,
  RED_WITCHES_NICO,
  RED_WITCHES_SEER
} from '@/lib/monsters/red-witches'
import {
  SCREAMING_ANTELOPE,
  SCREAMING_NUKALOPE
} from '@/lib/monsters/screaming-antelope'
import { SLENDERMAN } from '@/lib/monsters/slenderman'
import { SMOG_SINGERS } from '@/lib/monsters/smog-singers'
import { SPIDICULES } from '@/lib/monsters/spidicules'
import { GREAT_DEVOURER, SUNSTALKER } from '@/lib/monsters/sunstalker'
import { TYRANT } from '@/lib/monsters/tyrant'
import { WATCHER } from '@/lib/monsters/watcher'
import { WHITE_GIGALION, WHITE_LION } from '@/lib/monsters/white-lion'

/**
 * Nemesis Monsters by ID
 */
export const NEMESES = {
  /** Atnas the Childeater */
  1: { main: ATNAS },
  /** Black Knight */
  2: { main: BLACK_KNIGHT },
  /** Butcher */
  3: {
    main: BUTCHER,
    vignette: KILLENIUM_BUTCHER
  },
  /** Dying God (Dragon King)  */
  4: { main: DYING_GOD },
  /** Gambler */
  5: { main: GAMBLER },
  /** Godhand */
  6: { main: GODHAND },
  /** Gold Smoke Knight */
  7: { main: GOLD_SMOKE_KNIGHT },
  /** The Hand */
  8: { main: HAND },
  /** King's Man */
  9: { main: KINGS_MAN },
  /** Lion Knight */
  10: { main: LION_KNIGHT },
  /** Lonely Tree */
  11: { main: LONELY_TREE },
  /** Manhunter */
  12: { main: MANHUNTER },
  /** Pariah */
  13: { main: PARIAH },
  /** Red Witches */
  14: {
    main: RED_WITCHES,
    level1: [RED_WITCHES_BRAAL],
    level2: [RED_WITCHES_BRAAL, RED_WITCHES_NICO],
    level3: [RED_WITCHES_BRAAL, RED_WITCHES_NICO, RED_WITCHES_SEER]
  },
  /** Slenderman */
  15: { main: SLENDERMAN },
  /** The Great Devourer (Sunstalker) */
  16: { main: GREAT_DEVOURER },
  /** The Tyrant */
  18: { main: TYRANT },
  /** Watcher */
  19: { main: WATCHER }
}

/**
 * Quarry Monsters by ID
 */
export const QUARRIES = {
  /** Crimson Crocodile */
  1: { main: CRIMSON_CROCODILE },
  /** Dragon King */
  2: { main: DRAGON_KING },
  /** Dung Beetle Knight */
  3: { main: DUNG_BEETLE_KNIGHT },
  /** Flower Knight */
  4: { main: FLOWER_KNIGHT },
  /** Frogdog */
  5: {
    main: FROGDOG,
    alternate: BULLFROGDOG
  },
  /** Gorm */
  6: { main: GORM },
  /** King */
  7: { main: KING },
  /** Lion God */
  8: { main: LION_GOD },
  /** Phoenix */
  9: { main: PHOENIX },
  /** Screaming Antelope */
  10: {
    main: SCREAMING_ANTELOPE,
    vignette: SCREAMING_NUKALOPE
  },
  /** Smog Singers */
  11: { main: SMOG_SINGERS },
  /** Spidicules */
  12: { main: SPIDICULES },
  /** Sunstalker */
  13: { main: SUNSTALKER },
  /** White Lion */
  14: {
    main: WHITE_LION,
    vignette: WHITE_GIGALION
  }
}
