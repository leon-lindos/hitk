// Types for the thinking-orbs engine, as in the local thinking-orbs-vue port (MIT, see THIRD_PARTY_NOTICES.md).
export const ORB_STATES = [
  'working', 'searching', 'solving', 'listening', 'connecting',
  'weaving', 'composing', 'breathing', 'shaping',
] as const
export type OrbState = typeof ORB_STATES[number]
/** The upstream preset tiers: 64 (avatar) and 20 (inline) are hand-tuned, 32 is interpolated upstream. */
export type OrbSize = 64 | 32 | 20
export type OrbTheme = 'auto' | 'light' | 'dark'
export type ModeOpts = Record<string, number | undefined>
export interface OrbDot { x: number; y: number; z: number; r: number; white: number; a?: number }
export interface OrbLine { x1: number; y1: number; x2: number; y2: number; white: number; a?: number; w: number }
export interface OrbFrame { dots: OrbDot[]; lines: OrbLine[] }
export type ModeFrame = (size: number, t: number, opts: ModeOpts) => OrbFrame
