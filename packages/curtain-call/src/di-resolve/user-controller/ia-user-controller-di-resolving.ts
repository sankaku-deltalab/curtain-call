import { container, Lifecycle } from "@curtain-call/shared-dependencies";
import {
  Actor,
  EngineInputImpl,
  injectTokens,
  World,
} from "@curtain-call/ia-user-controller";
import { ActorCreateUC, UpdateActorUC } from "@curtain-call/uc-actor";
import {
  CollisionManipulationUC,
  CollisionModifyUC,
} from "@curtain-call/uc-collision";
import {
  ActorAddingToWorldUC,
  CreateWorldUC,
  UpdateWorldUC,
} from "@curtain-call/uc-world";
import {
  EngineCreationUC,
  WorldUpdatingInEngineUC,
} from "@curtain-call/uc-engine";
import { RegisterRendererUC } from "@curtain-call/uc-rendering";
import { ClassObject } from "../class-object";

const tokenAndClass: [string | symbol, ClassObject][] = [
  [injectTokens.ActorCreateUC, ActorCreateUC],
  [injectTokens.UpdateActorUC, UpdateActorUC],
  [injectTokens.CollisionModifyUC, CollisionModifyUC],
  [injectTokens.CollisionManipulationUC, CollisionManipulationUC],
  [injectTokens.ActorAddingToWorldUC, ActorAddingToWorldUC],
  [injectTokens.UpdateWorldUC, UpdateWorldUC],
  [injectTokens.CreateWorldUC, CreateWorldUC],
  [injectTokens.EngineCreationUC, EngineCreationUC],
  [injectTokens.RegisterRendererUC, RegisterRendererUC],
  [injectTokens.WorldUpdatingInEngineUC, WorldUpdatingInEngineUC],
  [injectTokens.EngineInput, EngineInputImpl],
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
container.register(injectTokens.Actor, { useClass: Actor });
container.register(injectTokens.World, { useClass: World });
