import { WorldBase } from "@curtain-call/entity";
import { RenderingService } from "../use-cases/rendering-service";
import { Renderer } from "../renderer";

export class RenderingServiceImpl implements RenderingService {
  /**
   * Render actors in world.
   *
   * @param world Rendering world.
   * @param renderer Renderer.
   */
  renderActorsInWorld(world: WorldBase, renderer: Renderer): void {
    const actors = Array.from(world.iterateActors());
    const drawingRepresentations = actors
      .map((ac) => ac.calcDrawingRepresentations())
      .flat();
    renderer.render(drawingRepresentations);
  }
}
