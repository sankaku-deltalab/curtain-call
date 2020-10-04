import { Transformation } from "@curtain-call/util";
import {
  Box2d,
  Collision,
  CollisionGroup,
  CollisionGroupPresets,
  CollisionShape,
  OverlapChecker,
  RectCollisionShape,
  diContainer,
} from "@curtain-call/collision";

diContainer.register("Transformation", Transformation);

export {
  Box2d,
  Collision,
  CollisionGroup,
  CollisionGroupPresets,
  CollisionShape,
  OverlapChecker,
  RectCollisionShape,
};
