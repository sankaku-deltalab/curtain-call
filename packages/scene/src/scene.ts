import * as PIXI from "pixi.js";
import { VectorLike, Vector } from "trans-vector2d";
import { Actor } from "@curtain-call/actor";
import { Camera } from "@curtain-call/camera";
import { DisplayObjectManager } from "@curtain-call/display-object";
import { PointerInputReceiver } from "@curtain-call/input";
import { pixiMatrixToMatrix2d } from "@curtain-call/util";

/**
 * Scene is root of game scene.
 */
export class Scene<T> {
  private readonly actors = new Set<Actor<this>>();

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
    private readonly displayObject = new DisplayObjectManager<Scene<T>>(),
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
   * const scene = new Scene().updateDrawBase({
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
   * Update this and contained actor.
   *
   * @param _owner Engine like thing.
   * @param deltaSec Update delta seconds.
   */
  update(_owner: T, deltaSec: number): void {
    this.actors.forEach((actor) => actor.update(this, deltaSec));
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

    actor.displayObjects.forEach((obj) => {
      if (!this.displayObject.has(obj)) return;
      this.displayObject.remove(obj);
    });

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
    const sceneTrans = pixiMatrixToMatrix2d(this.tail.transform.worldTransform);
    return sceneTrans.localizePoint(canvasPos);
  }

  /**
   * Convert game position to canvas position.
   *
   * @param gamePos Game position.
   * @returns Canvas position.
   */
  public gamePosToCanvasPos(gamePos: VectorLike): Vector {
    this.head.updateTransform();
    const sceneTrans = pixiMatrixToMatrix2d(this.tail.transform.worldTransform);
    return sceneTrans.globalizePoint(gamePos);
  }

  private updatePixiDisplayObject(): void {
    this.actors.forEach((actor) => {
      actor.displayObjects.forEach((obj) => {
        if (this.displayObject.has(obj)) return;
        this.displayObject.add(obj);
      });
    });
  }
}
