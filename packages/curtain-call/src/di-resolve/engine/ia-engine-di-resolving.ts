import { container, Lifecycle } from "@curtain-call/shared-dependencies";
import { injectTokens } from "@curtain-call/ia-engine";
import { ClassObject } from "../class-object";
import { UpdateWorldUC } from "@curtain-call/uc-world";

const tokenAndClass: [string | symbol, ClassObject][] = [
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
