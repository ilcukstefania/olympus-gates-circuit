/**
 * Re-export of the AI-generated PNGs in assets/ (Step 1.5).
 * Every file listed in assets.json is produced by gen-assets.sh, with a
 * procedural fallback, so these require() calls always resolve.
 */
export const ART = {
  bgLoader: require('../../assets/bg_loader.png'),
  bgMenu: require('../../assets/bg_menu.png'),
  bgGame: require('../../assets/bg_game.png'),
  bgResult: require('../../assets/bg_result.png'),
  spriteRuneHex: require('../../assets/sprite_rune_hex.png'),
  spriteBeacon: require('../../assets/sprite_beacon.png'),
  spriteBolt: require('../../assets/sprite_bolt.png'),
};
