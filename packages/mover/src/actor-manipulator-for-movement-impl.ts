// TODO: enable eslint after impl methods
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Vector, VectorLike } from "trans-vector2d";
import { PredefinedPromise } from "predefined-promise";
import {
  IActor,
  World,
  ActorManipulatorForMovement,
  Easing,
  Mover,
  ActorManipulationCanceler,
} from "@curtain-call/actor";
import { RouteMover } from "./route-mover";
import { EasedRoute } from "./eased-route";

export class ActorManipulatorForMovementImpl
  implements ActorManipulatorForMovement {
  /**
   * Move actor and wait finish movement.
   *
   * Movement space is local of given actor.
   *
   * @param canceler
   * @param actor
   * @param args
   */
  move(
    canceler: ActorManipulationCanceler,
    actor: IActor,
    args:
      | {
          movement: VectorLike;
          easing: Easing;
          moveDurationSec: number;
        }
      | {
          movement: VectorLike;
          easing: Easing;
          averageSpeed: number;
        }
  ): Promise<void> {
    const pp = new PredefinedPromise<void>();

    const mover = new RouteMover();

    const onMovementFinished = (world: World, finishedMover: Mover): void => {
      if (finishedMover === mover) pp.resolve();
    };
    const cancel = (): void => {
      pp.reject(new Error("Actor was removed from world"));
    };
    actor.event.on("movementFinished", onMovementFinished);
    canceler.onCanceled(cancel);

    const durationSec =
      "moveDurationSec" in args
        ? args.moveDurationSec
        : Vector.from(args.movement).norm() / args.averageSpeed;
    actor.addMover(mover);
    mover.start(new EasedRoute().init(args.movement, durationSec, args.easing));

    return pp
      .wait()
      .catch(() => {
        actor.removeMover(mover);
      })
      .finally(() => {
        actor.event.off("movementFinished", onMovementFinished);
        canceler.offCanceled(cancel);
      });
  }

  /**
   * Move actor and wait finish movement.
   *
   * Movement space is given actor transformation ({x: 1, y: 0} is front of actor).
   *
   * @param actor
   * @param args
   */
  moveLocally(
    canceler: ActorManipulationCanceler,
    actor: IActor,
    args:
      | {
          movement: VectorLike;
          easing: Easing;
          moveDurationSec: number;
        }
      | {
          movement: VectorLike;
          easing: Easing;
          averageSpeed: number;
        }
  ): Promise<void> {
    throw new Error("not implemented");
  }

  /**
   * Rotate actor and wait rotating.
   *
   * @param actor
   * @param args
   */
  rotate(
    canceler: ActorManipulationCanceler,
    actor: IActor,
    args:
      | {
          angleRad: number;
          easing: Easing;
          rotateDurationSec: number;
        }
      | {
          angleRad: number;
          easing: Easing;
          averageSpeed: number;
        }
  ): Promise<void> {
    throw new Error("not implemented");
  }

  /**
   * Rotate actor to given direction and wait rotating.
   *
   * @param canceler
   * @param actor
   * @param args
   */
  rotateTo(
    canceler: ActorManipulationCanceler,
    actor: IActor,
    args:
      | {
          targetAngleRad: number;
          easing: Easing;
          rotateDurationSec: number;
        }
      | {
          targetAngleRad: number;
          easing: Easing;
          averageSpeed: number;
        }
  ): Promise<void> {
    throw new Error("not implemented");
  }

  /**
   * Rotate actor to target and wait rotating.
   *
   * @param canceler
   * @param actor
   * @param args
   */
  rotateToTarget(
    canceler: ActorManipulationCanceler,
    actor: IActor,
    args: {
      tolerance: number;
      speed: number;
    }
  ): Promise<void> {
    throw new Error("not implemented");
  }
}
