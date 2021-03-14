import { container, Lifecycle } from "@curtain-call/shared-dependencies";
import { injectTokens } from "@curtain-call/uc-transformation";
import { ClassObject } from "../class-object";
import {
  MovementStorageImpl,
  TransformationStorageImpl,
} from "./temporal-impl";

const tokenAndClass: [string | symbol, ClassObject][] = [
  [injectTokens.MovementStorage, MovementStorageImpl],
  [injectTokens.TransformationStorage, TransformationStorageImpl],
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
