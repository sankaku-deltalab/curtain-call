/* eslint-disable @typescript-eslint/no-unused-vars */
import { PredefinedPromise } from "predefined-promise";
import { World } from "../interface";
import { Actor as IActor } from "../actor-interface";
import {
  ActorManipulationCanceler,
  ActorManipulatorForMisc,
} from "../actor-manipulator-subsystems";

export class ActorManipulatorForMiscImpl implements ActorManipulatorForMisc {
  /**
   * Wait until is true.
   * Condition was checked when actor was updated.
   *
   * @param canceler
   * @param actor
   * @param condition
   */
  waitUntil(
    canceler: ActorManipulationCanceler,
    actor: IActor,
    condition: (world: World) => boolean
  ): Promise<void> {
    const pp = new PredefinedPromise<void>();

    const onUpdated = (world: World): void => {
      if (!condition(world)) return;
      pp.resolve();
    };

    const cancel = (): void => {
      pp.reject(new Error("Manipulation canceled"));
    };

    actor.event.on("updated", onUpdated);
    canceler.onCanceled(cancel);
    return pp.wait().finally(() => {
      actor.event.off("updated", onUpdated);
      canceler.offCanceled(cancel);
    });
  }
}
