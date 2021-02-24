import { injectable, inject } from "@curtain-call/shared-dependencies";
import { EngineId } from "@curtain-call/entity";
import { EngineStorage } from "@curtain-call/uc-engine";
import { EngineAllStorage } from "../engine-all-storage";
import { injectTokens } from "../inject-tokens";

@injectable()
export class EngineStorageImpl implements EngineStorage {
  constructor(
    @inject(injectTokens.EngineAllStorage)
    private readonly engineAllStorage: EngineAllStorage
  ) {}

  create(engine: EngineId): void {
    this.engineAllStorage.create(engine);
  }

  delete(engine: EngineId): void {
    this.engineAllStorage.delete(engine);
  }
}
