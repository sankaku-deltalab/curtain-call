import { container, Lifecycle } from "@curtain-call/shared-dependencies";
import { injectTokens } from "@curtain-call/ia-collision";
import { ClassObject } from "../class-object";
import { TransformationStorageImpl } from "./temporal-impl";

const tokenAndClass: [string | symbol, ClassObject][] = [
  [injectTokens.MasterTransformationStorage, TransformationStorageImpl],
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
