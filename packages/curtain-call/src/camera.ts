import * as PIXI from "pixi.js";
import { Transformation, RectArea } from "@curtain-call/util";
import { Camera, diContainer } from "@curtain-call/camera";

diContainer.register("Transformation", Transformation);
diContainer.register("PIXI.Container", PIXI.Container);
diContainer.register("RectArea", RectArea);

export { Camera };
