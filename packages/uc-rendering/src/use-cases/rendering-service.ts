import { WorldBase } from "@curtain-call/entity";
import { Renderer } from "../renderer";

export interface RenderingService {
  /**
   * Render actors in world.
   *
   * @param world Rendering world.
   * @param renderer Renderer.
   */
  renderActorsInWorld(world: WorldBase, renderer: Renderer): void;
}
