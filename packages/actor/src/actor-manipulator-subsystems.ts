import { VectorLike } from "trans-vector2d";
import { World } from "./interface";
import { Actor as IActor } from "./actor-interface";

export type Easing = (v: number) => number;

export interface ActorManipulationCanceler {
  cancel(): void;
  onCanceled(callback: () => void): void;
  offCanceled(callback: () => void): void;
}

export interface ActorManipulationCancelerFactory {
  /**
   * Create canceler.
   *
   * @returns New canceler.
   */
  createCanceler(): ActorManipulationCanceler;
}

export interface ActorManipulatorForTimer {
  /**
   * Wait time.
   *
   * @param canceler
   * @param actor
   * @param timeSec
   */
  waitTime(
    canceler: ActorManipulationCanceler,
    actor: IActor,
    timeSec: number
  ): Promise<void>;
}

export interface ActorManipulatorForMovement {
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
  ): Promise<void>;

  /**
   * Move actor and wait finish movement.
   *
   * Movement space is given actor transformation ({x: 1, y: 0} is front of actor).
   *
   * @param canceler
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
  ): Promise<void>;

  /**
   * Rotate actor and wait rotating.
   *
   * @param canceler
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
  ): Promise<void>;

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
  ): Promise<void>;

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
  ): Promise<void>;
}

export interface ActorManipulatorForCollision {
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
  ): Promise<ReadonlySet<IActor>>;
}

export interface ActorManipulatorForPositionCheck {
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
  ): Promise<void>;

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
  ): Promise<void>;
}

export interface Weapon {
  /**
   * Start firing.
   *
   * @param world World.
   */
  startFire(world: World): void;

  /**
   * Is firing now.
   *
   * @returns Is firing.
   */
  isFiring(): boolean;

  /**
   * Request stop firing.
   */
  stopFire(): void;

  /**
   * Stop firing process immediately.
   */
  forceStopFire(): void;
}

export interface ActorManipulatorForWeapon {
  /**
   * Fire and wait finish firing.
   *
   * @param canceler
   * @param weapon
   * @param world
   */
  fireOnce(
    canceler: ActorManipulationCanceler,
    weapon: Weapon,
    world: World
  ): Promise<void>;

  /**
   * Wait finish firing.
   *
   * @param canceler
   * @param weapon
   * @param world
   */
  waitFinishFiring(
    canceler: ActorManipulationCanceler,
    weapon: Weapon,
    world: World
  ): Promise<void>;
}

export interface ActorManipulatorForHealth {
  /**
   * Wait actor dead.
   *
   * @param canceler
   * @param actor
   */
  waitDead(canceler: ActorManipulationCanceler, actor: IActor): Promise<void>;
}

export interface ActorManipulatorForWorld {
  /**
   * Wait actor was removed from world.
   *
   * @param canceler
   * @param actor
   */
  waitRemovedFromWorld(
    canceler: ActorManipulationCanceler,
    actor: IActor
  ): Promise<void>;
}

export interface ActorManipulatorForMisc {
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
  ): Promise<void>;
}
