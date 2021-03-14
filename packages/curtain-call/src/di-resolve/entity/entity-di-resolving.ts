import { container, Lifecycle } from "@curtain-call/shared-dependencies";
import { injectTokens } from "@curtain-call/entity";
import { ClassObject } from "../class-object";
import {
  ActorsContainerImpl,
  WorldsUpdateEventEmitterImpl,
} from "@curtain-call/uc-world";
import { ActorsMoverImpl } from "@curtain-call/uc-transformation";
import { ActorsOverlapCheckerImpl } from "@curtain-call/uc-collision";
import { RendererImpl } from "@curtain-call/uc-rendering";
import { ActorsUpdateEventEmitterImpl } from "@curtain-call/uc-actor";
import {
  WorldsTimeScaleImpl,
  ActorsTimeScaleImpl,
  WorldsExtensionUpdaterImpl,
  ActorsExtensionUpdaterImpl,
  WorldsTimerUpdaterImpl,
  ActorsTimerUpdaterImpl,
  InputConsumerImpl,
} from "./temporal-impl";

const tokenAndClass: [string | symbol, ClassObject][] = [
  [injectTokens.WorldsTimeScale, WorldsTimeScaleImpl],
  [injectTokens.ActorsContainer, ActorsContainerImpl],
  [injectTokens.ActorsTimeScale, ActorsTimeScaleImpl],
  [injectTokens.ActorsMover, ActorsMoverImpl],
  [injectTokens.ActorsOverlapChecker, ActorsOverlapCheckerImpl],
  [injectTokens.Renderer, RendererImpl],
  [injectTokens.WorldsExtensionUpdater, WorldsExtensionUpdaterImpl],
  [injectTokens.ActorsExtensionUpdater, ActorsExtensionUpdaterImpl],
  [injectTokens.WorldsTimerUpdater, WorldsTimerUpdaterImpl],
  [injectTokens.ActorsTimerUpdater, ActorsTimerUpdaterImpl],
  [injectTokens.InputConsumer, InputConsumerImpl],
  [injectTokens.WorldsUpdateEventEmitter, WorldsUpdateEventEmitterImpl],
  [injectTokens.ActorsUpdateEventEmitter, ActorsUpdateEventEmitterImpl],
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
