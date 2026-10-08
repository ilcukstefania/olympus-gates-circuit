import {Dimensions} from 'react-native';

export const LOADER_DURATION_MS = 8000; // rule #13 - EXACTLY 8000
export const FADE_MS = 320;

export const ROTATE_SPRING = {tension: 180, friction: 11};
export const PRESS_SPRING = {tension: 300, friction: 12};
export const POP_SPRING = {tension: 120, friction: 6};
export const SHEET_SPRING = {tension: 48, friction: 9};

export const PULSE_MS = 180;
export const CHARGE_LOCK_MS = 700;
export const SHAKE_MS = 320;
export const WIN_DELAY_MS = 450;

export const MAX_OVERLOADS = 3;
export const UNDOS_PER_ISLAND = 3;

export const GRID_COLS = 5;
export const GRID_ROWS = 6;

export const HEADER_H = 72;
export const HEADER_PAD_TOP = 44; // rule #6 - status bar
export const CONTROL_BAR_H = 64;
export const GAME_AREA_BOTTOM_PAD = 96; // reserves room for the floating bar

const {width: SCREEN_W, height: SCREEN_H} = Dimensions.get('window');
export {SCREEN_W, SCREEN_H};

/* ---- Board geometry (rule #4 / #5) ------------------------------------- */
export const BOARD_MAX_W = Math.min(SCREEN_W - 32, 380);
export const BOARD_PAD = 10;
export const BOARD_BORDER = 2;
export const BOARD_FRAME = BOARD_PAD + BOARD_BORDER; // 12

const INNER_W = BOARD_MAX_W - 2 * BOARD_FRAME;
export const HEX_W = Math.floor(INNER_W / (GRID_COLS + 0.5)); // +0.5 pays for the offset row
export const HEX_H = Math.round(HEX_W * 1.1547); // pointy-top: w * 2/sqrt(3)
export const ROW_STEP = Math.round(HEX_H * 0.75);

export const BOARD_W =
  HEX_W * GRID_COLS + Math.floor(HEX_W / 2) + 2 * BOARD_FRAME;
export const BOARD_H = ROW_STEP * (GRID_ROWS - 1) + HEX_H + 2 * BOARD_FRAME;

/** Absolute offset of a cell inside the board's inner area. */
export function cellOffset(row: number, col: number) {
  return {
    left: BOARD_FRAME + col * HEX_W + (row % 2) * Math.floor(HEX_W / 2),
    top: BOARD_FRAME + row * ROW_STEP,
  };
}
