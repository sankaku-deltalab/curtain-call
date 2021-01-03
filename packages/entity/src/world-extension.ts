import { WorldBase } from "./world-base";

/**
 * `WorldExtension` would be used for extending `WorldBase` without inheritance.
 */
export interface WorldExtension {
  timeScale?(world: WorldBase): number;
  preUpdate?(world: WorldBase, deltaSec: number): void;
  update?(world: WorldBase, deltaSec: number): void;
  postUpdate?(world: WorldBase, deltaSec: number): void;
}
