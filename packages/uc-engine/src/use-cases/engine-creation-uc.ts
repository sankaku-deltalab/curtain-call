import { injectable, inject } from "@curtain-call/shared-dependencies";
import { EngineId } from "@curtain-call/entity";
import { injectTokens } from "../inject-tokens";

export interface EngineStorage {
  create(engine: EngineId): void;
  delete(engine: EngineId): void;
}

@injectable()
export class EngineCreationUC {
  constructor(
    @inject(injectTokens.EngineStorage)
    private readonly engineStorage: EngineStorage
  ) {}

  create(engine: EngineId): void {
    this.engineStorage.create(engine);
  }

  delete(engine: EngineId): void {
    this.engineStorage.delete(engine);
  }
}
