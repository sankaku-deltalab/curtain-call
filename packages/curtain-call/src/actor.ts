import { EventEmitter } from "eventemitter3";
import { Transformation, FiniteResource } from "@curtain-call/util";
import { Collision } from "@curtain-call/collision";
import {
  Actor,
  DamageType,
  Team,
  ActorRole,
  diContainer,
  ActorExtension,
  ActorExtensionBase,
  PositionInAreaStatus,
} from "@curtain-call/actor";

diContainer.register("EventEmitter", EventEmitter);
diContainer.register("Transformation", Transformation);
diContainer.register("FiniteResource", FiniteResource);
diContainer.register("Collision", Collision);

export {
  Actor,
  DamageType,
  Team,
  ActorRole,
  ActorExtension,
  ActorExtensionBase,
  PositionInAreaStatus,
};
