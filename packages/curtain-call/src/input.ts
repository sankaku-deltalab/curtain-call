import { EventEmitter } from "eventemitter3";
import {
  PointerInput,
  PointerInputConnector,
  PointerInputReceiver,
  TapRecognizer,
  diContainer,
} from "@curtain-call/input";

diContainer.register("EventEmitter", EventEmitter);
diContainer.register("Date", { useValue: new Date() });
diContainer.register("TapRecognizer", TapRecognizer);

export {
  PointerInput,
  PointerInputConnector,
  PointerInputReceiver,
  TapRecognizer,
};
