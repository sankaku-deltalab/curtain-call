import { PredefinedPromise } from "predefined-promise";
import {
  IActor,
  World,
  ActorManipulatorForCollision,
  ActorManipulationCanceler,
} from "@curtain-call/actor";

export class ActorManipulatorForCollisionImpl
  implements ActorManipulatorForCollision {
  /**
   * Wait actor overlap with filtered other actor.
   *
   * @param canceler
   * @param actor
   * @param filter
   * @return Filtered overlapped actors.
   */
  waitOverlap(
    canceler: ActorManipulationCanceler,
    actor: IActor,
    filter: (other: IActor) => boolean
  ): Promise<ReadonlySet<IActor>> {
    const pp = new PredefinedPromise<ReadonlySet<IActor>>();

    const onOverlapped = (world: World, others: ReadonlySet<IActor>): void => {
      const filteredOthers = Array.from(others).filter(filter);
      if (filteredOthers.length === 0) return;
      pp.resolve(new Set(filteredOthers));
    };

    const cancel = (): void => {
      pp.reject(new Error("Manipulation canceled"));
    };

    actor.event.on("overlapped", onOverlapped);
    canceler.onCanceled(cancel);
    return pp.wait().finally(() => {
      actor.event.off("overlapped", onOverlapped);
      canceler.offCanceled(cancel);
    });
  }
}
