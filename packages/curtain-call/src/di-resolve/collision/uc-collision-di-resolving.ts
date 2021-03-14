import {
  container,
  Lifecycle,
  EventEmitterFactory,
} from "@curtain-call/shared-dependencies";
import { injectTokens } from "@curtain-call/uc-collision";
import { TransformationStorageImpl } from "@curtain-call/ia-collision";
import { BoxIntersectImpl } from "@curtain-call/fw-collision";
import { CollisionStorageImpl } from "@curtain-call/ia-storage";
import { ClassObject } from "../class-object";

const tokenAndClass: [string | symbol, ClassObject][] = [
  [injectTokens.CollisionStorage, CollisionStorageImpl],
  [injectTokens.TransformationStorage, TransformationStorageImpl],
  [injectTokens.BoxIntersect, BoxIntersectImpl],
  [injectTokens.EventEmitterFactory, EventEmitterFactory],
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
