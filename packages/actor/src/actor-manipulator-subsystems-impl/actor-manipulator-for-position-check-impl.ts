/* eslint-disable @typescript-eslint/no-unused-vars */
import { PredefinedPromise } from "predefined-promise";
import { Actor as IActor } from "../actor-interface";
import {
  ActorManipulationCanceler,
  ActorManipulatorForPositionCheck,
} from "../actor-manipulator-subsystems";

export class ActorManipulatorForPositionCheckImpl
  implements ActorManipulatorForPositionCheck {
  /**
   * Wait actor bounds is in given area.
   *
   * @param canceler
   * @param actor
   * @param area
   */
  waitBoundsIsIn(
    canceler: ActorManipulationCanceler,
    actor: IActor,
    area: [number, number, number, number]
  ): Promise<void> {
    throw new Error("Not implemented because actor do not have bounds now");
  }

  /**
   * Wait actor position is in given area.
   *
   * @param canceler
   * @param actor
   * @param area
   */
  waitPositionIsIn(
    canceler: ActorManipulationCanceler,
    actor: IActor,
    area: [number, number, number, number]
  ): Promise<void> {
    const pp = new PredefinedPromise<void>();

    const onUpdated = (): void => {
      const pos = actor.getTransformation().getGlobal().decompose().translation;
      const xInArea = area[0] <= pos.x && pos.x <= area[2];
      const yInArea = area[1] <= pos.y && pos.y <= area[3];
      if (!(xInArea && yInArea)) return;
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
