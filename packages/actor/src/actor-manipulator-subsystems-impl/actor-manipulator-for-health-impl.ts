/* eslint-disable @typescript-eslint/no-unused-vars */
import { PredefinedPromise } from "predefined-promise";
import { Actor as IActor } from "../actor-interface";
import {
  ActorManipulationCanceler,
  ActorManipulatorForHealth,
} from "../actor-manipulator-subsystems";

export class ActorManipulatorForHealthImpl
  implements ActorManipulatorForHealth {
  /**
   * Wait actor dead.
   *
   * @param canceler
   * @param actor
   */
  waitDead(canceler: ActorManipulationCanceler, actor: IActor): Promise<void> {
    const pp = new PredefinedPromise<void>();

    const onDead = (): void => {
      pp.resolve();
    };

    const cancel = (): void => {
      pp.reject(new Error("Manipulation canceled"));
    };

    actor.event.on("dead", onDead);
    canceler.onCanceled(cancel);
    return pp.wait().finally(() => {
      actor.event.off("dead", onDead);
      canceler.offCanceled(cancel);
    });
  }
}
