import { VectorLike } from "trans-vector2d";
import { autoInjectable, inject } from "tsyringe";
import { World } from "./interface";
import { Actor as IActor } from "./actor-interface";
import {
  ActorManipulationCancelerFactory,
  ActorManipulatorForTimer,
  ActorManipulatorForMovement,
  ActorManipulatorForCollision,
  ActorManipulatorForPositionCheck,
  ActorManipulatorForWeapon,
  ActorManipulatorForMisc,
  ActorManipulatorForWorld,
  ActorManipulatorForHealth,
  Easing,
  ActorManipulationCanceler,
  Weapon,
} from "./actor-manipulator-subsystems";

@autoInjectable()
export class ActorManipulator {
  private readonly cancelerFactory: ActorManipulationCancelerFactory;
  private readonly amForTimer: ActorManipulatorForTimer;
  private readonly amForMovement: ActorManipulatorForMovement;
  private readonly amForCollision: ActorManipulatorForCollision;
  private readonly amForPositionCheck: ActorManipulatorForPositionCheck;
  private readonly amForWeapon: ActorManipulatorForWeapon;
  private readonly amForHealth: ActorManipulatorForHealth;
  private readonly amForWorld: ActorManipulatorForWorld;
  private readonly amForMisc: ActorManipulatorForMisc;

  constructor(
    @inject("ActorManipulationCancelerFactory")
    cancelerFactory?: ActorManipulationCancelerFactory,
    @inject("ActorManipulatorForTimer")
    amForTimer?: ActorManipulatorForTimer,
    @inject("ActorManipulatorForMovement")
    amForMovement?: ActorManipulatorForMovement,
    @inject("ActorManipulatorForCollision")
    amForCollision?: ActorManipulatorForCollision,
    @inject("ActorManipulatorForPositionCheck")
    amForPositionCheck?: ActorManipulatorForPositionCheck,
    @inject("ActorManipulatorForWeapon")
    amForWeapon?: ActorManipulatorForWeapon,
    @inject("ActorManipulatorForHealth")
    amForHealth?: ActorManipulatorForHealth,
    @inject("ActorManipulatorForWorld")
    amForWorld?: ActorManipulatorForWorld,
    @inject("ActorManipulatorForMisc")
    amForMisc?: ActorManipulatorForMisc
  ) {
    if (
      !(
        cancelerFactory &&
        amForTimer &&
        amForMovement &&
        amForCollision &&
        amForPositionCheck &&
        amForWeapon &&
        amForHealth &&
        amForWorld &&
        amForMisc
      )
    )
      throw new Error("DI failed");
    this.cancelerFactory = cancelerFactory;
    this.amForTimer = amForTimer;
    this.amForMovement = amForMovement;
    this.amForCollision = amForCollision;
    this.amForPositionCheck = amForPositionCheck;
    this.amForWeapon = amForWeapon;
    this.amForHealth = amForHealth;
    this.amForWorld = amForWorld;
    this.amForMisc = amForMisc;
  }

  /**
   * Create canceler.
   *
   * @returns New canceler.
   */
  createCanceler(): ActorManipulationCanceler {
    return this.cancelerFactory.createCanceler();
  }

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
  ): Promise<void> {
    return this.amForTimer.waitTime(canceler, actor, timeSec);
  }

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
    return this.amForMovement.move(canceler, actor, args);
  }

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
  ): Promise<void> {
    return this.amForMovement.moveLocally(canceler, actor, args);
  }

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
  ): Promise<void> {
    return this.amForMovement.rotate(canceler, actor, args);
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
    return this.amForMovement.rotateTo(canceler, actor, args);
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
    return this.amForMovement.rotateToTarget(canceler, actor, args);
  }

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
    return this.amForCollision.waitOverlap(canceler, actor, filter);
  }

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
    return this.amForPositionCheck.waitBoundsIsIn(canceler, actor, area);
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
    return this.amForPositionCheck.waitPositionIsIn(canceler, actor, area);
  }

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
  ): Promise<void> {
    return this.amForWeapon.fireOnce(canceler, weapon, world);
  }

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
  ): Promise<void> {
    return this.amForWeapon.waitFinishFiring(canceler, weapon, world);
  }

  /**
   * Wait actor dead.
   *
   * @param canceler
   * @param actor
   */
  waitDead(canceler: ActorManipulationCanceler, actor: IActor): Promise<void> {
    return this.amForHealth.waitDead(canceler, actor);
  }

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
    return this.amForWorld.waitRemovedFromWorld(canceler, actor);
  }

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
    condition: () => boolean
  ): Promise<void> {
    return this.amForMisc.waitUntil(canceler, actor, condition);
  }
}
