import { EventEmitter } from "eventemitter3";
import { Transformation, FiniteResource } from "@curtain-call/util";
import {
  Collision,
  ActorManipulatorForCollisionImpl,
} from "@curtain-call/collision";
import { ActorManipulatorForTimerImpl } from "@curtain-call/timer";
import { ActorManipulatorForMovementImpl } from "@curtain-call/mover";
import { ActorManipulatorForWeaponImpl } from "@curtain-call/weapon";
import {
  Actor,
  DamageType,
  Team,
  ActorRole,
  diContainer,
  ActorExtension,
  ActorExtensionBase,
  PositionInAreaStatus,
  ActorManipulator,
  ActorManipulationCancelerFactoryImpl,
  ActorManipulatorForPositionCheckImpl,
  ActorManipulatorForHealthImpl,
  ActorManipulatorForWorldImpl,
  ActorManipulatorForMiscImpl,
} from "@curtain-call/actor";

diContainer.register("EventEmitter", EventEmitter);
diContainer.register("Transformation", Transformation);
diContainer.register("FiniteResource", FiniteResource);
diContainer.register("Collision", Collision);

diContainer.register(
  "ActorManipulationCancelerFactory",
  ActorManipulationCancelerFactoryImpl
);
diContainer.register("ActorManipulatorForTimer", ActorManipulatorForTimerImpl);
diContainer.register(
  "ActorManipulatorForMovement",
  ActorManipulatorForMovementImpl
);
diContainer.register(
  "ActorManipulatorForCollision",
  ActorManipulatorForCollisionImpl
);
diContainer.register(
  "ActorManipulatorForPositionCheck",
  ActorManipulatorForPositionCheckImpl
);
diContainer.register(
  "ActorManipulatorForWeapon",
  ActorManipulatorForWeaponImpl
);
diContainer.register(
  "ActorManipulatorForHealth",
  ActorManipulatorForHealthImpl
);
diContainer.register("ActorManipulatorForWorld", ActorManipulatorForWorldImpl);
diContainer.register("ActorManipulatorForMisc", ActorManipulatorForMiscImpl);

export {
  Actor,
  DamageType,
  Team,
  ActorRole,
  ActorExtension,
  ActorExtensionBase,
  PositionInAreaStatus,
  ActorManipulator,
};
