import * as PIXI from "pixi.js";
import { VectorLike, Vector } from "trans-vector2d";
import { Actor } from "@curtain-call/actor";
import { Camera } from "@curtain-call/camera";
import { DisplayObjectManager } from "@curtain-call/display-object";
import { PointerInputReceiver } from "@curtain-call/input";
import { OverlapChecker } from "@curtain-call/collision";
import {
  pixiMatrixToMatrix2d,
  Updatable,
  Transformation,
} from "@curtain-call/util";

/**
 * World is root of game world.
 */
export class World {
  public readonly backgroundTrans = new Transformation();
  private readonly actors = new Set<Actor<this>>();
  private readonly updatable = new Set<Updatable<this>>();
  private readonly overlapChecker = new OverlapChecker<this, Actor<this>>();

  /**
   * @param head Root of PIXI objects.
   * @param tail Tail of PIXI objects.
   * @param camera Camera.
   * @param displayObject DisplayObjectContainer.
   * @param pointerInput PointerInputReceiver.
   */
  constructor(
    public readonly head = new PIXI.Container(),
    public readonly tail = new PIXI.Container(),
    public readonly camera = new Camera(),
    private readonly displayObject = new DisplayObjectManager<World>(),
    public readonly pointerInput = new PointerInputReceiver()
  ) {
    head.addChild(camera.head);
    camera.tail.addChild(tail);
    tail.addChild(this.displayObject.container);
    this.displayObject = displayObject;
  }

  /**
   * Update drawing base.
   *
   * @example
   * const gameHeight = 400;
   * const gameWidth = 300;
   * const canvasHeight = window.innerHeight;
   * const canvasWidth = window.innerWidth;
   *
   * const world = new World().updateDrawBase({
   *   center: { x: canvasWidth / 2, y: canvasHeight / 2 },
   *   scale: Math.min(canvasHeight / gameHeight, canvasWidth / gameWidth),
   * });
   * @param base
   * @returns this.
   */
  updateDrawBase(base: {
    center?: VectorLike;
    rotation?: number;
    scale?: number;
  }): this {
    if (base.center)
      this.head.position = new PIXI.Point(base.center.x, base.center.y);
    if (base.rotation) this.head.rotation = base.rotation;
    if (base.scale) this.head.scale = new PIXI.Point(base.scale, base.scale);
    return this;
  }

  /**
   * Update this and contained Updatable object.
   *
   * @param deltaSec Update delta seconds.
   */
  update(deltaSec: number): void {
    this.removeDeadUpdatable();

    this.updatable.forEach((up) => up.update(this, deltaSec));
    this.checkCollision();
    this.displayObject.update(this, deltaSec);
    this.updatePixiDisplayObject();
  }

  /**
   * Add actor to this.
   *
   * @param actor Adding actor.
   * @returns this.
   */
  addActor(actor: Actor<this>): this {
    if (this.actors.has(actor)) throw new Error("Actor was already added");
    this.actors.add(actor);
    this.addUpdatableInternal(actor);
    actor.notifyAddedToWorld(this);
    return this;
  }

  /**
   * Remove added actor from this.
   *
   * @param actor Removing actor.
   * @returns this.
   */
  removeActor(actor: Actor<this>): this {
    const removed = this.actors.delete(actor);
    if (!removed) throw new Error("Actor was not added");

    this.removeUpdatableInternal(actor);
    actor.displayObjects.forEach((obj) => {
      if (!this.displayObject.has(obj)) return;
      this.displayObject.remove(obj);
    });
    actor.notifyRemovedFromWorld(this);

    return this;
  }

  /**
   * Return this has given actor.
   *
   * @param actor Checking actor.
   * @returns This has given actor.
   */
  hasActor(actor: Actor<this>): boolean {
    return this.actors.has(actor);
  }

  /**
   * Iterate added actors.
   *
   * @returns Added actors iterator.
   */
  iterateActors(): IterableIterator<Actor<this>> {
    return this.actors.values();
  }

  /**
   * Add Updatable object.
   *
   * @warn Do not add `Actor`. Use `addActor` instead.
   * @param updatable Adding Updatable object.
   * @returns this.
   */
  addUpdatable(updatable: Updatable<this>): this {
    if (updatable instanceof Actor)
      throw new Error("Do not add Actor as Updatable");
    this.updatable.add(updatable);
    return this;
  }

  /**
   * Remove Updatable object.
   *
   * @warn Do not remove `Actor`. Use `removeActor` instead.
   * @param updatable Removing Updatable object.
   * @returns this.
   */
  removeUpdatable(updatable: Updatable<this>): this {
    if (updatable instanceof Actor)
      throw new Error("Do not remove Actor as Updatable");
    this.updatable.delete(updatable);
    return this;
  }

  /**
   * Add pointer input receiver.
   *
   * @param receiver
   * @returns this.
   */
  addPointerInputReceiver(receiver: PointerInputReceiver): this {
    this.pointerInput.addChild(receiver, (canvasPos) =>
      this.canvasPosToGamePos(canvasPos)
    );
    return this;
  }

  /**
   * Remove pointer input receiver.
   *
   * @param receiver
   * @returns this.
   */
  removePointerInputReceiver(receiver: PointerInputReceiver): this {
    this.pointerInput.removeChild(receiver);
    return this;
  }

  /**
   * Convert canvas position to game position.
   *
   * @param canvasPos Canvas position.
   * @returns Game position.
   */
  public canvasPosToGamePos(canvasPos: VectorLike): Vector {
    this.head.updateTransform();
    const worldTrans = pixiMatrixToMatrix2d(this.tail.transform.worldTransform);
    return worldTrans.localizePoint(canvasPos);
  }

  /**
   * Convert game position to canvas position.
   *
   * @param gamePos Game position.
   * @returns Canvas position.
   */
  public gamePosToCanvasPos(gamePos: VectorLike): Vector {
    this.head.updateTransform();
    const worldTrans = pixiMatrixToMatrix2d(this.tail.transform.worldTransform);
    return worldTrans.globalizePoint(gamePos);
  }

  private removeDeadUpdatable(): void {
    this.updatable.forEach((up) => {
      if (!up.shouldRemoveSelfFromWorld()) return;
      if (up instanceof Actor) {
        this.removeActor(up);
      } else {
        this.removeUpdatable(up);
      }
    });
  }

  private addUpdatableInternal(updatable: Updatable<this>): this {
    this.updatable.add(updatable);
    return this;
  }

  private removeUpdatableInternal(updatable: Updatable<this>): this {
    this.updatable.delete(updatable);
    return this;
  }

  private updatePixiDisplayObject(): void {
    this.actors.forEach((actor) => {
      actor.displayObjects.forEach((obj) => {
        if (this.displayObject.has(obj)) return;
        this.displayObject.add(obj);
      });
    });
  }

  private checkCollision(): void {
    const collisions = Array.from(this.actors).map((ac) => ac.collision);
    this.overlapChecker.checkOverlap(this, collisions);
  }
}
