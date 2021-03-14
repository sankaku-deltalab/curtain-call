import { container, Lifecycle } from "@curtain-call/shared-dependencies";
import { injectTokens } from "@curtain-call/uc-engine";
import {
  EngineStorageImpl,
  EngineWorldMappingImpl,
} from "@curtain-call/ia-storage";
import { ClassObject } from "../class-object";
import { WorldUpdaterImpl } from "@curtain-call/ia-engine";

const tokenAndClass: [string | symbol, ClassObject][] = [
  [injectTokens.EngineStorage, EngineStorageImpl],
  [injectTokens.EngineWorldMapping, EngineWorldMappingImpl],
  [injectTokens.WorldUpdater, WorldUpdaterImpl],
];

tokenAndClass.forEach(([token, cls]) => {
  container.register(
    token,
    {
      useClass: cls,
    },
    { lifecycle: Lifecycle.Singleton }
  );
});
