import { WorldId, ActorId, InputConsumer } from "@curtain-call/entity";

export class InputConsumerImpl implements InputConsumer {
  consumeInput(_world: WorldId, _actors: readonly ActorId[]): void {
    // do nothing.
  }
}
