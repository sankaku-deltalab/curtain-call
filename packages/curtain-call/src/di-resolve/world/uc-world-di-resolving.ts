import { WorldCore } from "@curtain-call/entity";
import { container, Lifecycle } from "@curtain-call/shared-dependencies";
import {
  ActorAddingToWorldUC,
  injectTokens,
  RefreshActorsInWorldUC,
  UpdateWorldUC,
} from "@curtain-call/uc-world";
import {
  ActorDestroyingRequesterImpl,
  WorldIdGeneratorImpl,
  ActorDestroyingEnablerForWorldImpl,
  ActorToWorldMappingImpl,
} from "@curtain-call/ia-world";
import { WorldStorageImpl } from "@curtain-call/ia-storage";
import { ClassObject } from "../class-object";

const tokenAndClass: [string | symbol, ClassObject][] = [
  [injectTokens.ActorToWorldMapping, ActorToWorldMappingImpl],
  [
    injectTokens.ActorDestroyingEnablerForWorld,
    ActorDestroyingEnablerForWorldImpl,
  ],
  [injectTokens.ActorDestroyingRequester, ActorDestroyingRequesterImpl],
  [injectTokens.RefreshActorsInWorldUC, RefreshActorsInWorldUC],
  [injectTokens.ActorAddingToWorldUC, ActorAddingToWorldUC],
  [injectTokens.WorldIdGenerator, WorldIdGeneratorImpl],
  [injectTokens.WorldStorage, WorldStorageImpl],
  [injectTokens.WorldCore, WorldCore],
  [injectTokens.UpdateWorldUC, UpdateWorldUC],
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
