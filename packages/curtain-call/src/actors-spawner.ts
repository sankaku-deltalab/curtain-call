import { EventEmitter } from "eventemitter3";
import { Transformation, FiniteResource } from "@curtain-call/util";
import { Collision } from "@curtain-call/collision";
import {
  ActorsSpawner,
  ActorsSpawnerManager,
  diContainer,
} from "@curtain-call/actors-spawner";

diContainer.register("EventEmitter", EventEmitter);
diContainer.register("Transformation", Transformation);
diContainer.register("FiniteResource", FiniteResource);
diContainer.register("Collision", Collision);

export { ActorsSpawner, ActorsSpawnerManager };
