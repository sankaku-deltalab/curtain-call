import * as PIXI from "pixi.js";
import { Transformation } from "@curtain-call/util";
import {
  Container,
  DisplayObjectManager,
  MultiAnimatedSprite,
  Sprite,
  animSpriteFrom,
  diContainer,
} from "@curtain-call/display-object";

diContainer.register("PIXI.Container", PIXI.Container);
diContainer.register("Transformation", Transformation);

export {
  Container,
  DisplayObjectManager,
  MultiAnimatedSprite,
  Sprite,
  animSpriteFrom,
};
