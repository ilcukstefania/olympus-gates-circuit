import { Dimensions } from 'react-native';

const win = Dimensions.get('window');

export const SCREEN_W = win.width;
export const SCREEN_H = win.height;

/**
 * Splash duration. MUST stay at 8000 — shorter values race the automated
 * screenshot window and the loader frame gets captured as the menu.
 */
export const LOADER_DURATION_MS = 8000;

/** Progress-bar fill duration — deliberately NOT the splash timer. A width
 *  tween is JS-driven (useNativeDriver:false); running it for the loader's
 *  whole life keeps the window off idle, so uiautomator never returns a dump
 *  and the capture agent wedges on the first frame. */
export const LOADER_BAR_ANIM_MS = 1200;

/* ----------------------------------------------------------------------- */
/* Board geometry (pointy-top hexes, odd-r offset rows)                      */
/* ----------------------------------------------------------------------- */

export const COLS = 5;
export const ROWS = 6;
export const PAD = 10;
export const BORDER = 2;

/** Frame = parent padding + parent border. Children live inside it. */
export const BOARD_FRAME = PAD + BORDER; // 12

export const BOARD_MAX_W = Math.min(SCREEN_W - 32, 380);

const INNER_W = BOARD_MAX_W - 2 * BOARD_FRAME;

/** Offset rows eat half a cell, hence COLS + 0.5. */
export const HEX_W = Math.floor(INNER_W / (COLS + 0.5));
/** Pointy-top ratio: h = w * 2 / sqrt(3). */
export const HEX_H = Math.round(HEX_W * 1.1547);
/** Vertical packing step for pointy-top rows. */
export const V_STEP = Math.round(HEX_H * 0.75);

export const HALF_STEP = Math.round(HEX_W / 2);

export const BOARD_W = HEX_W * COLS + HALF_STEP + 2 * BOARD_FRAME;
export const BOARD_H = V_STEP * (ROWS - 1) + HEX_H + 2 * BOARD_FRAME;

/** Floating control bar clearance so the board never sits under it. */
export const CONTROL_BAR_H = 72;
export const CONTROL_BAR_BOTTOM = 28;
export const GAME_AREA_BOTTOM_PAD = CONTROL_BAR_H + CONTROL_BAR_BOTTOM + 16;

/* ----------------------------------------------------------------------- */
/* Round rules                                                               */
/* ----------------------------------------------------------------------- */

export const MAX_ISLANDS = 9;
export const MAX_OVERLOADS = 3;

export const ROTATE_MS = 180;
export const TRACE_STEP_MS = 35;
export const OVERLOAD_FLASH_MS = 400;
export const WIN_DELAY_MS = 900;
export const LOSE_DELAY_MS = 700;

export const COACH_AUTOCLOSE_MS = 3500;

/**
 * Menu backstop. The round already ends without input (see IDLE_* below), but
 * the menu used to sit forever when a tap on START CIRCUIT was dropped, so the
 * app never left the first screen. This hands the circuit over by itself once,
 * long enough after mount that the menu is still seen first.
 */
export const MENU_AUTOSTART_MS = 32000;

/* Idle backstop — a round must always end, even with zero player input. */
export const IDLE_MOUNT_FLOOR_MS = 26000;
export const IDLE_INPUT_GAP_MS = 9000;
export const IDLE_HARD_CAP_MS = 40000;
export const AMBIENT_SURGE_MS = 14000;
export const IDLE_TICK_MS = 500;

export function movesForIsland(island: number): number {
  return 20 - Math.min(6, island - 1);
}

export function undosForIsland(island: number): number {
  if (island <= 3) {
    return 3;
  }
  if (island <= 6) {
    return 2;
  }
  return 1;
}
