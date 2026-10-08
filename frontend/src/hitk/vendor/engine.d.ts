// Minimal Vue-independent types for the unmodified upstream engine.js.
import type { OrbState, OrbSize, ModeOpts, OrbFrame, ModeFrame } from '../types';
type ModeKey = 'orbits' | 'globe' | 'rubik' | 'wave' | 'web' | 'braid' | 'ribbon' | 'ring' | 'morph';
interface Resolved { mode: ModeKey; speed: number; opts: ModeOpts }
interface Tint { r: number; g: number; b: number }
export function resolvePreset(state: OrbState, size: OrbSize): Resolved;
export const MODE_FRAMES: Record<ModeKey, ModeFrame>;
export const MODE_DRAWS: Record<ModeKey, (ctx: CanvasRenderingContext2D, size: number, t: number, dark: boolean, opts: ModeOpts) => void>;
export function paintFrame(ctx: CanvasRenderingContext2D, frame: OrbFrame, dark: boolean, tint?: Tint): void;
