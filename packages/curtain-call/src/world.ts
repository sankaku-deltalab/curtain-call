import * as PIXI from "pixi.js";
import { Transformation, RectArea } from "@curtain-call/util";
import { Camera } from "@curtain-call/camera";
import { OverlapChecker } from "@curtain-call/collision";
import { DisplayObjectManager } from "@curtain-call/display-object";
import { PointerInputReceiver } from "@curtain-call/input";

import { World, diContainer } from "@curtain-call/world";

diContainer.register("PIXI.Container", PIXI.Container);
diContainer.register("Camera", Camera);
diContainer.register("DisplayObjectManager", DisplayObjectManager);
diContainer.register("PointerInputReceiver", PointerInputReceiver);
diContainer.register("RectArea", RectArea);
diContainer.register("OverlapChecker", OverlapChecker);
diContainer.register("Transformation", Transformation);

export { World };
