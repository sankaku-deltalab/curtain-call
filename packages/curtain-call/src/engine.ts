import { EventEmitter } from "eventemitter3";
import { PointerInput } from "@curtain-call/input";
import { Engine, diContainer } from "@curtain-call/engine";

diContainer.register("EventEmitter", EventEmitter);
diContainer.register("PointerInput", PointerInput);

export { Engine };
