import { injectable, inject } from "@curtain-call/shared-dependencies";
import {
  EngineId,
  WorldId,
  ActorId,
  Seconds,
  Renderer,
} from "@curtain-call/entity";
import { RenderUC } from "../use-cases";
import { injectTokens } from "../inject-tokens";

@injectable()
export class RendererImpl implements Renderer {
  constructor(
    @inject(injectTokens.RenderUC) private readonly renderUC: RenderUC
  ) {}

  update(
    _actors: readonly ActorId[],
    _deltaSec: ReadonlyMap<ActorId, Seconds>
  ): void {
    // do nothing.
  }

  render(engine: EngineId, world: WorldId, actors: readonly ActorId[]): void {
    this.renderUC.render(engine, actors);
  }
}
