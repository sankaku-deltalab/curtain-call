import {
  ActorBase,
  WorldBase,
  ActorEvent,
  CollisionRepresentation,
  CollisionGroup,
} from "@curtain-call/entity";
import {
  ActorCollisionData,
  ActorCollisionUseCase,
  EventEmitter,
  CollisionShape,
} from "@curtain-call/uc-actor";

type ActorHasTrans = Pick<ActorBase, "transformation">;

export class CollisionActor {
  private readonly collisionData: ActorCollisionData = {
    enabled: true,
    shapes: [],
    group: { category: 0, mask: 0 },
    isExcess: false,
  };
  private readonly collisionUseCase: ActorCollisionUseCase;
  private sharedEvent?: EventEmitter<ActorEvent>;
  private actorHasTrans?: ActorHasTrans;

  constructor(collisionUseCase?: ActorCollisionUseCase) {
    if (!collisionUseCase) throw new Error("DI failed");
    this.collisionUseCase = collisionUseCase;
  }

  get event(): EventEmitter<ActorEvent> {
    if (!this.sharedEvent) throw new Error("not initialized");
    return this.sharedEvent;
  }

  get parent(): ActorHasTrans {
    if (!this.actorHasTrans) throw new Error("not initialized");
    return this.actorHasTrans;
  }

  initCollisionActor(parent: ActorBase, event: EventEmitter<ActorEvent>): this {
    this.actorHasTrans = parent;
    this.sharedEvent = event;
    return this;
  }

  /**
   * Calc collision representation of this.
   *
   * @returns Collision Representation.
   */
  calcCollisionRepresentation(): Readonly<CollisionRepresentation> {
    return this.collisionUseCase.calcCollisionRepresentation(
      this.collisionData,
      this.parent.transformation()
    );
  }

  /**
   * Notify overlapped with other actor.
   *
   * @param world Our world.
   * @param others Collided Other actors.
   */
  notifyOverlappedWith(world: WorldBase, others: readonly ActorBase[]): void {
    this.collisionUseCase.emitEventWhenOverlapped(this.event, world, others);
  }

  /**
   * Initialize collision.
   *
   * @param data ActorCollisionData would be modified.
   * @param args.shapes Shapes used for this.
   * @param args.group Group of this.
   * @param args.isExcess This is excess collision.
   */
  initCollision(args: {
    shapes: CollisionShape[];
    group: CollisionGroup;
    isExcess: boolean;
  }): void {
    this.collisionUseCase.initCollision(this.collisionData, args);
  }

  /**
   * Enable collision.
   */
  enableCollision(): void {
    this.collisionUseCase.enable(this.collisionData);
  }

  /**
   * Disable collision.
   */
  disableCollision(): void {
    this.collisionUseCase.disable(this.collisionData);
  }
}
