import { container, Lifecycle } from "@curtain-call/shared-dependencies";
import { injectTokens, RenderUC } from "@curtain-call/uc-rendering";
import {
  DrawingObjectStorageImpl,
  RendererInstanceStorageImpl,
} from "@curtain-call/ia-storage";
import { ClassObject } from "../class-object";

const tokenAndClass: [string | symbol, ClassObject][] = [
  [injectTokens.DrawingObjectStorage, DrawingObjectStorageImpl],
  [injectTokens.RendererInstanceStorage, RendererInstanceStorageImpl],
  [injectTokens.RenderUC, RenderUC],
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
