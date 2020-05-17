import { Level } from "./level";
import { LevelNetwork } from "./networked-level";

/**
 * Create sequential level network for `NetworkedLevels`.
 *
 * @param activateDistance
 * @param loadDistance
 * @param levels
 * @returns Network.
 */
export function sequentialLevelNetwork<T>(
  activateDistance: number,
  loadDistance: number,
  levels: ReadonlyArray<Level<T>>
): LevelNetwork<T> {
  const edges: [Level<T>, Level<T>][] = [];
  levels.reduce((prev, curr) => {
    edges.push([prev, curr]);
    return curr;
  });
  return {
    initialLevel: levels[0],
    levels,
    edges,
    activateDistance,
    loadDistance,
  };
}
