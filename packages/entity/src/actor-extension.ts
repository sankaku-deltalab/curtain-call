import { ActorBase } from "./actor-base";
import { WorldBase } from "./world-base";

/**
 * `ActorExtension` would be used for extending `ActorBase` without inheritance.
 */
export interface ActorExtension {
  timeScale?(world: WorldBase, actor: ActorBase): number;
  preUpdate?(world: WorldBase, actor: ActorBase, deltaSec: number): void;
  update?(world: WorldBase, actor: ActorBase, deltaSec: number): void;
  postUpdate?(world: WorldBase, actor: ActorBase, deltaSec: number): void;
}
