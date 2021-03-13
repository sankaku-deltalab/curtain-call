import { EngineId, WorldId } from "@curtain-call/entity";

export interface EngineWorldMapping {
  addWorldToEngine(engine: EngineId, world: WorldId): void;
  removeWorldFromEngine(engine: EngineId, world: WorldId): void;
  getWorldsFromEngine(engine: EngineId): readonly WorldId[];
}
