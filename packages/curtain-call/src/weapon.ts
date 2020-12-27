import { EventEmitter } from "eventemitter3";
import { Transformation, FiniteResource } from "@curtain-call/util";
import { LocalConstantMover } from "@curtain-call/mover";
import { Collision, RectCollisionShape } from "@curtain-call/collision";
import {
  BulletStyle,
  BulletGenerator,
  SimpleBulletGenerator,
  SimpleBullet,
  NearestTargetProvider,
  NullTargetProvider,
  TargetProvider,
  GuntreeWeapon,
  NullWeapon,
  WeaponAsExtension,
  diContainer,
} from "@curtain-call/weapon";

diContainer.register("EventEmitter", EventEmitter);
diContainer.register("Transformation", Transformation);
diContainer.register("FiniteResource", FiniteResource);
diContainer.register("Collision", Collision);
diContainer.register("LocalConstantMover", LocalConstantMover);
diContainer.register("RectCollisionShape", RectCollisionShape);

export {
  BulletStyle,
  BulletGenerator,
  SimpleBulletGenerator,
  SimpleBullet,
  NearestTargetProvider,
  NullTargetProvider,
  TargetProvider,
  GuntreeWeapon,
  NullWeapon,
  WeaponAsExtension,
};
