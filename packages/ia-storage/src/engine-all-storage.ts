import { injectable } from "@curtain-call/shared-dependencies";
import { EngineId, WorldId } from "@curtain-call/entity";
import { RendererInstance } from "@curtain-call/uc-rendering";

export type EngineAllState = {
  renderer?: RendererInstance;
  containingWorlds: Set<WorldId>;
};

@injectable()
export class EngineAllStorage {
  private readonly storage = new Map<EngineId, EngineAllState>();

  create(engine: EngineId): void {
    if (this.storage.has(engine)) throw new Error("Engine is already created");
    const state: EngineAllState = {
      renderer: undefined,
      containingWorlds: new Set(),
    };
    this.storage.set(engine, state);
  }

  delete(engine: EngineId): void {
    const state = this.storage.get(engine);
    if (!state) throw new Error("Engine is not created");
    this.storage.delete(engine);
  }

  has(engine: EngineId): boolean {
    return this.storage.has(engine);
  }

  get(engine: EngineId): Readonly<EngineAllState> {
    const state = this.storage.get(engine);
    if (!state) throw new Error("Engine is not created");
    return state;
  }

  set(engine: EngineId, state: EngineAllState): void {
    if (!this.storage.has(engine)) throw new Error("Engine is not created");
    this.storage.set(engine, state);
  }
}
