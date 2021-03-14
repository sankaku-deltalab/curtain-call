import {
  container,
  Lifecycle,
  EventEmitterFactory,
} from "@curtain-call/shared-dependencies";
import { injectTokens } from "@curtain-call/ia-storage";
import {
  ActorAllStorage,
  WorldAllStorage,
  EngineAllStorage,
} from "@curtain-call/ia-storage";
import { ClassObject } from "../class-object";

const tokenAndClass: [string | symbol, ClassObject][] = [
  [injectTokens.EventEmitterFactory, EventEmitterFactory],
  [injectTokens.ActorAllStorage, ActorAllStorage],
  [injectTokens.WorldAllStorage, WorldAllStorage],
  [injectTokens.EngineAllStorage, EngineAllStorage],
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
