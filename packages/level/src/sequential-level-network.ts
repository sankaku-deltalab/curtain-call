import { Level } from "./level";
import { LevelNetwork } from "./networked-levels";

/**
 * Create sequential level network for `NetworkedLevels`.
 *
 * @param activateDistance
 * @param loadDistance
 * @param levels
 * @returns Network.
 */
export function sequentialLevelNetwork(
  activateDistance: number,
  loadDistance: number,
  levels: ReadonlyArray<Level>
): LevelNetwork {
  const edges: [Level, Level][] = [];
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
