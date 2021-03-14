import { container, Lifecycle } from "@curtain-call/shared-dependencies";
import { injectTokens } from "@curtain-call/ia-actor";
import { ActorAddingToWorldUC } from "@curtain-call/uc-world";
import { CollisionModifyUC } from "@curtain-call/uc-collision";
import { ActorStorageImpl } from "@curtain-call/ia-storage";
import { ClassObject } from "../class-object";

const tokenAndClass: [string | symbol, ClassObject][] = [
  [injectTokens.ActorStorage, ActorStorageImpl],
  [injectTokens.ActorAddingToWorldUC, ActorAddingToWorldUC],
  [injectTokens.CollisionModifyUC, CollisionModifyUC],
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

container.register(injectTokens.DIContainer, { useValue: container });
