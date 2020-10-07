import { EventEmitter } from "eventemitter3";
import { PointerInputReceiver } from "@curtain-call/input";
import {
  EasedRoute,
  LocalConstantMover,
  MoveRoute,
  ParallelMover,
  PointerMover,
  RouteMover,
  SequentialMover,
  diContainer,
} from "@curtain-call/mover";

diContainer.register("EventEmitter", EventEmitter);
diContainer.register("PointerInputReceiver", PointerInputReceiver);

export {
  EasedRoute,
  LocalConstantMover,
  MoveRoute,
  ParallelMover,
  PointerMover,
  RouteMover,
  SequentialMover,
};
