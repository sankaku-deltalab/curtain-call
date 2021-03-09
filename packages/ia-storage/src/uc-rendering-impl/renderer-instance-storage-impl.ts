import { injectable, inject } from "@curtain-call/shared-dependencies";
import { EngineId } from "@curtain-call/entity";
import {
  RendererInstanceStorage,
  RendererInstance,
} from "@curtain-call/uc-rendering";
import { EngineAllState, EngineAllStorage } from "../engine-all-storage";
import { injectTokens } from "../inject-tokens";

@injectable()
export class RendererInstanceStorageImpl implements RendererInstanceStorage {
  constructor(
    @inject(injectTokens.EngineAllStorage)
    private readonly engineAllStorage: EngineAllStorage
  ) {}

  setRendererInstance(engine: EngineId, instance: RendererInstance): void {
    const oldState = this.engineAllStorage.get(engine);
    if (oldState.renderer) throw new Error("Renderer instance is already set");
    const newState: EngineAllState = {
      ...oldState,
      renderer: instance,
    };
    this.engineAllStorage.set(engine, newState);
  }

  deleteRendererInstance(engine: EngineId): void {
    const oldState = this.engineAllStorage.get(engine);
    if (!oldState.renderer) throw new Error("Renderer instance is not set");
    const newState: EngineAllState = {
      ...oldState,
      renderer: undefined,
    };
    this.engineAllStorage.set(engine, newState);
  }

  getRendererInstance(engine: EngineId): Readonly<RendererInstance> {
    const renderer = this.engineAllStorage.get(engine).renderer;
    if (!renderer) throw new Error("Renderer instance is not set");
    return renderer;
  }
}
