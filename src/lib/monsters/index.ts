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
import { RED_WITCHES } from '@/lib/monsters/red-witches'
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
import { MonsterMap } from '@/lib/types'

/**
 * Nemesis Monsters
 */
export const NEMESES: MonsterMap = {
  /** Atnas the Childeater */
  ATNAS,
  /** Black Knight */
  BLACK_KNIGHT,
  /** Butcher */
  BUTCHER: { ...BUTCHER, vignette: KILLENIUM_BUTCHER },
  /** Dying God (Dragon King)  */
  DYING_GOD,
  /** Gambler */
  GAMBLER,
  /** Godhand */
  GODHAND,
  /** Gold Smoke Knight */
  GOLD_SMOKE_KNIGHT,
  /** The Hand */
  HAND,
  /** King's Man */
  KINGS_MAN,
  /** Lion Knight */
  LION_KNIGHT,
  /** Lonely Tree */
  LONELY_TREE,
  /** Manhunter */
  MANHUNTER,
  /** Pariah */
  PARIAH,
  /** Red Witches */
  RED_WITCHES,
  /** Slenderman */
  SLENDERMAN,
  /** The Great Devourer (Sunstalker) */
  GREAT_DEVOURER,
  /** The Tyrant */
  TYRANT,
  /** Watcher */
  WATCHER
}

/**
 * Quarry Monsters
 */
export const QUARRIES: MonsterMap = {
  /** Crimson Crocodile */
  CRIMSON_CROCODILE,
  /** Dragon King */
  DRAGON_KING,
  /** Dung Beetle Knight */
  DUNG_BEETLE_KNIGHT,
  /** Flower Knight */
  FLOWER_KNIGHT,
  /** Frogdog */
  FROGDOG: { ...FROGDOG, alternate: BULLFROGDOG },
  /** Gorm */
  GORM,
  /** King */
  KING,
  /** Lion God */
  LION_GOD,
  /** Phoenix */
  PHOENIX,
  /** Screaming Antelope */
  SCREAMING_ANTELOPE: { ...SCREAMING_ANTELOPE, vignette: SCREAMING_NUKALOPE },
  /** Smog Singers */
  SMOG_SINGERS,
  /** Spidicules */
  SPIDICULES,
  /** Sunstalker */
  SUNSTALKER,
  /** White Lion */
  WHITE_LION: { ...WHITE_LION, vignette: WHITE_GIGALION }
}
