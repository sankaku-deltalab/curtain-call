import { EventEmitter } from "eventemitter3";
import * as PIXI from "pixi.js";
import { VectorLike, Vector } from "trans-vector2d";
import { Actor } from "@curtain-call/actor";
import { Camera } from "@curtain-call/camera";
import {
  DisplayObjectManager,
  DisplayObject,
} from "@curtain-call/display-object";
import { PointerInputReceiver } from "@curtain-call/input";
import { OverlapChecker, Collision } from "@curtain-call/collision";
import {
  pixiMatrixToMatrix2d,
  Updatable,
  Transformation,
  RectArea,
  PositionStatusWithArea,
} from "@curtain-call/util";

/**
 * World is root of game world.
 */
export class World {
  /** Event. */
  public readonly event = new EventEmitter<{
    updated: [number];
  }>();

  public readonly backgroundTrans = new Transformation();
  public readonly head: PIXI.Container;
  public readonly tail: PIXI.Container;
  public readonly camera: Camera;
  public readonly pointerInput: PointerInputReceiver;

  private readonly displayObject: DisplayObjectManager;
  private readonly actors = new Set<Actor<this>>();
  private readonly updatable = new Set<Updatable<this>>();
  private readonly overlapChecker = new OverlapChecker();
  private readonly mask = new PIXI.Graphics();
  private readonly coreArea: RectArea;

  /**
   * @param diArgs.head Root of PIXI objects.
   * @param diArgs.tail Tail of PIXI objects.
   * @param diArgs.camera Camera.
   * @param diArgs.displayObject DisplayObjectContainer.
   * @param diArgs.pointerInput PointerInputReceiver.
   * @param diArgs.coreArea Rectangle area for game.
   */
  constructor(diArgs?: {
    readonly head?: PIXI.Container;
    readonly tail?: PIXI.Container;
    readonly camera?: Camera;
    readonly displayObject?: DisplayObjectManager;
    readonly pointerInput?: PointerInputReceiver;
    readonly coreArea?: RectArea;
  }) {
    this.head = diArgs?.head || new PIXI.Container();
    this.tail = diArgs?.tail || new PIXI.Container();
    this.camera = diArgs?.camera || new Camera();
    this.displayObject = diArgs?.displayObject || new DisplayObjectManager();
    this.pointerInput = diArgs?.pointerInput || new PointerInputReceiver();
    this.coreArea = diArgs?.coreArea || new RectArea();

    this.head.mask = this.mask;
    this.head.addChild(this.mask);
    this.head.addChild(this.camera.head);
    this.camera.tail.addChild(this.tail);
    this.tail.addChild(this.displayObject.container);
    this.displayObject = this.displayObject;

    this.pointerInput.setModifier((canvasPos) =>
      this.canvasPosToGamePos(canvasPos)
    );
  }

  /**
   * Set canvas drawing property.
   *
   * @example
   * const gameHeight = 400;
   * const gameWidth = 300;
   * const canvasHeight = engine.canvasHeight();
   * const canvasWidth = engine.canvasWidth();
   * const gameUnitPerPixel = Math.min(canvasHeight / gameHeight, canvasWidth / gameWidth);
   * const world = new World().setDrawArea(
   *   { x: canvasWidth / 2, y: canvasHeight / 2 },
   *   { x: gameWidth / gameUnitPerPixel, y: gameHeight / gameUnitPerPixel },
   *   gameUnitPerPixel
   * );
   * @param drawCenterInCanvas Drawing center.
   * @param drawSizeInCanvas Drawing size.
   * @param gameUnitPerPixel Game unit per pixel.
   * @returns this.
   */
  setDrawArea(
    drawCenterInCanvas: VectorLike,
    drawSizeInCanvas: VectorLike,
    gameUnitPerPixel: number
  ): this {
    const drawSizeInGame = Vector.from(drawSizeInCanvas).mlt(gameUnitPerPixel);
    this.head.position = new PIXI.Point(
      drawCenterInCanvas.x,
      drawCenterInCanvas.y
    );
    this.head.scale = new PIXI.Point(gameUnitPerPixel, gameUnitPerPixel);

    const maskSize = drawSizeInGame;
    const maskNW = maskSize.div(2).mlt(-1);

    this.mask
      .clear()
      .beginFill()
      .drawRect(maskNW.x, maskNW.y, maskSize.x, maskSize.y)
      .endFill();

    const gameVisibleSize = drawSizeInCanvas;
    this.camera.setCameraResolution(gameVisibleSize);

    return this;
  }

  /**
   * Update this and contained Updatable object.
   *
   * @param deltaSec Update delta seconds.
   */
  update(deltaSec: number): void {
    this.removeDeadUpdatable();

    this.addSubActorsIfNotAdded();

    this.updatable.forEach((up) => up.update(this, deltaSec));
    this.checkCollision();
    this.updatePixiDisplayObject();
    this.camera.update();

    this.event.emit("updated", deltaSec);
  }

  /**
   * Add actor to this.
   *
   * @param actor Adding actor.
   * @returns this.
   */
  addActor(actor: Actor<this>): this {
    const adding = [actor, ...actor.getSubActors()];

    if (adding.some((ac) => this.hasActor(ac)))
      throw new Error("Actor was already added");

    adding.forEach((ac) => {
      this.actors.add(ac);
      this.addUpdatableInternal(ac);
      ac.notifyAddedToWorld(this);
    });

    return this;
  }

  /**
   * Remove added actor from this.
   *
   * @param actor Removing actor.
   * @returns this.
   */
  removeActor(actor: Actor<this>): this {
    const removing = [actor, ...actor.getSubActors()];

    if (removing.some((ac) => !this.hasActor(ac)))
      throw new Error("Actor was not added");

    removing.forEach((ac) => {
      this.actors.delete(ac);
      this.removeUpdatableInternal(ac);
      ac.notifyRemovedFromWorld(this);
    });

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
    this.pointerInput.addChild(receiver);
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

  /**
   * Set core area.
   *
   * @param nw NW point on this.trans.
   * @param se SE point on this.trans.
   * @returns this.
   */
  setCoreArea(nw: VectorLike, se: VectorLike): this {
    this.coreArea.init(nw, se);
    return this;
  }

  /**
   * Calc position status for core area.
   *
   * @param globalPos Target position in global coordinates.
   * @param radius Target radius.
   * @returns Status.
   */
  calcPositionStatusWithCoreArea(
    globalPos: VectorLike,
    radius: number
  ): PositionStatusWithArea {
    return this.coreArea.calcPositionStatus(globalPos, radius);
  }

  private removeDeadUpdatable(): void {
    this.updatable.forEach((up) => {
      if (!up.shouldRemoveSelfFromWorld(this)) return;
      if (up instanceof Actor) {
        this.removeActor(up);
      } else {
        this.removeUpdatable(up);
      }
    });
  }

  private addSubActorsIfNotAdded(): void {
    this.actors.forEach((owner) => {
      owner.getSubActors().forEach((sub) => {
        if (this.hasActor(sub)) return;
        this.addActor(sub);
      });
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
    const displayObjects: DisplayObject[] = [];
    this.actors.forEach((actor) => {
      actor.iterateDisplayObject((obj) => {
        displayObjects.push(obj);
      });
    });

    this.displayObject.updatePixiObjects(displayObjects);
  }

  private checkCollision(): void {
    const collisionToActor = new Map(
      Array.from(this.actors).map((ac) => [ac.getCollision(), ac])
    );
    const getActor = (col: Collision): Actor<this> => {
      const ac = collisionToActor.get(col);
      if (!ac) throw new Error();
      return ac;
    };
    const collisions = Array.from(collisionToActor.keys());
    const r = this.overlapChecker.checkOverlap(collisions);
    r.forEach((others, col) => {
      const ac = getActor(col);
      const othersActor = new Set(Array.from(others).map((c) => getActor(c)));
      ac.notifyOverlappedWith(this, othersActor);
    });
  }
}
