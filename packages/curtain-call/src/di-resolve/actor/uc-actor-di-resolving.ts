import { container, Lifecycle } from "@curtain-call/shared-dependencies";
import { injectTokens, UpdateActorUC } from "@curtain-call/uc-actor";
import {
  ActorIdGeneratorImpl,
  ActorComponentDestroyerImpl,
} from "@curtain-call/ia-actor";
import { ActorStorageImpl } from "@curtain-call/ia-storage";
import { ClassObject } from "../class-object";

const tokenAndClass: [string | symbol, ClassObject][] = [
  [injectTokens.ActorIdGenerator, ActorIdGeneratorImpl],
  [injectTokens.ActorStorage, ActorStorageImpl],
  [injectTokens.ActorComponentDestroyer, ActorComponentDestroyerImpl],
  [injectTokens.UpdateActorUC, UpdateActorUC],
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
