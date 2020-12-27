/* eslint-disable @typescript-eslint/no-unused-vars */
import { PredefinedPromise } from "predefined-promise";
import { Actor as IActor } from "../actor-interface";
import {
  ActorManipulationCanceler,
  ActorManipulatorForWorld,
} from "../actor-manipulator-subsystems";

export class ActorManipulatorForWorldImpl implements ActorManipulatorForWorld {
  /**
   * Wait actor was removed from world.
   *
   * @param canceler
   * @param actor
   */
  waitRemovedFromWorld(
    canceler: ActorManipulationCanceler,
    actor: IActor
  ): Promise<void> {
    const pp = new PredefinedPromise<void>();

    const onRemovedFromWorld = (): void => {
      pp.resolve();
    };

    const cancel = (): void => {
      pp.reject(new Error("Manipulation canceled"));
    };

    actor.event.on("removedFromWorld", onRemovedFromWorld);
    canceler.onCanceled(cancel);
    return pp.wait().finally(() => {
      actor.event.off("removedFromWorld", onRemovedFromWorld);
      canceler.offCanceled(cancel);
    });
  }
}
