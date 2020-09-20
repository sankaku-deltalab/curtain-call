import { EventEmitter } from "eventemitter3";
import * as PIXI from "pixi.js";
import { VectorLike, Vector } from "trans-vector2d";
import { inject, autoInjectable, container as diContainer } from "tsyringe";
import {
  IActor,
  Actor,
  World as IWorld,
  Updatable,
  Engine,
  PositionInAreaStatus,
  PointerInputReceiver,
  Collision,
  DisplayObject,
  Transformation,
  Camera,
} from "@curtain-call/actor";
import { DisplayObjectManager, OverlapChecker, RectArea } from "./interface";
import { pixiMatrixToMatrix2d } from "./matrix-convert";

export { diContainer };

/**
 * World is root of game world.
 */
@autoInjectable()
export class World implements IWorld {
  /** Event. */
  public readonly event = new EventEmitter<{
    updated: [number];
  }>();

  public readonly backgroundTrans: Transformation;
  public readonly pixiHead: PIXI.Container;
  public readonly pixiTail: PIXI.Container;
  public readonly pointerInput: PointerInputReceiver;

  private readonly camera: Camera;
  private readonly displayObjectManager: DisplayObjectManager;
  private readonly actors = new Set<IActor>();
  private readonly updatable = new Set<Updatable>();
  private readonly overlapChecker: OverlapChecker;
  private readonly mask = new PIXI.Graphics();
  private readonly coreArea: RectArea;
  private drawAreaUpdater = (
    canvasSize: Vector
  ): {
    drawCenterInCanvas: VectorLike;
    drawSizeInCanvas: VectorLike;
    gameUnitPerPixel: number;
  } => ({
    drawCenterInCanvas: canvasSize.div(2),
    drawSizeInCanvas: canvasSize,
    gameUnitPerPixel: 1,
  });

  constructor(
    @inject("PIXI.Container") pixiHead?: PIXI.Container,
    @inject("PIXI.Container") pixiTail?: PIXI.Container,
    @inject("Camera") camera?: Camera,
    @inject("DisplayObjectManager") displayObjectManager?: DisplayObjectManager,
    @inject("PointerInputReceiver") pointerInput?: PointerInputReceiver,
    @inject("RectArea") coreArea?: RectArea,
    @inject("OverlapChecker") overlapChecker?: OverlapChecker,
    @inject("Transformation") backgroundTrans?: Transformation
  ) {
    if (
      !(
        pixiHead &&
        pixiTail &&
        camera &&
        displayObjectManager &&
        pointerInput &&
        coreArea &&
        overlapChecker &&
        backgroundTrans
      )
    )
      throw new Error("DI objects is not exists");
    this.pixiHead = pixiHead;
    this.pixiTail = pixiTail;
    this.camera = camera;
    this.displayObjectManager = displayObjectManager;
    this.pointerInput = pointerInput;
    this.coreArea = coreArea;
    this.overlapChecker = overlapChecker;
    this.backgroundTrans = backgroundTrans;

    this.pixiHead.mask = this.mask;
    this.pixiHead.addChild(this.mask);
    this.pixiHead.addChild(this.camera.pixiHead);
    this.camera.pixiTail.addChild(this.pixiTail);
    this.pixiTail.addChild(this.displayObjectManager.container);
    this.displayObjectManager = this.displayObjectManager;

    this.pointerInput.setModifier((canvasPos) =>
      this.canvasPosToGamePos(canvasPos)
    );
  }

  /**
   * Get camera.
   *
   * @returns Camera.
   */
  getCamera(): Camera {
    return this.camera;
  }

  /**
   * Set canvas drawing method.
   *
   * @example
   * const gameSize = new Vector(300, 400);
   * const world = new World().setDrawAreaUpdater((engine) => {
   *   const canvasSize = engine.canvasSize();
   *   const gameUnitPerPixel =
   *     Math.max(gameSize.x / canvasSize.x, gameSize.y / gameSize.y) * 1.25;
   *   const gameSizeInCanvas = gameSize.div(gameUnitPerPixel);
   *   return {
   *     drawCenterInCanvas: { x: canvasSize.x / 2, y: gameSizeInCanvas.y / 2 },
   *     drawSizeInCanvas: gameSizeInCanvas,
   *     gameUnitPerPixel,
   *   };
   * });
   * @param updater Drawing area updater. Called at every pre update.
   * @returns this.
   */
  setDrawAreaUpdater(
    updater: (
      canvasSize: Vector
    ) => {
      drawCenterInCanvas: VectorLike;
      drawSizeInCanvas: VectorLike;
      gameUnitPerPixel: number;
    }
  ): this {
    this.drawAreaUpdater = updater;
    return this;
  }

  private updateDrawArea(canvasSize: Vector): this {
    const {
      drawCenterInCanvas,
      drawSizeInCanvas,
      gameUnitPerPixel,
    } = this.drawAreaUpdater(canvasSize);

    const drawSizeInGame = Vector.from(drawSizeInCanvas).mlt(gameUnitPerPixel);
    this.pixiHead.position = new PIXI.Point(
      drawCenterInCanvas.x,
      drawCenterInCanvas.y
    );
    this.pixiHead.scale = new PIXI.Point(
      1 / gameUnitPerPixel,
      1 / gameUnitPerPixel
    );

    const maskSize = drawSizeInGame;
    const maskNW = maskSize.div(2).mlt(-1);

    this.mask
      .clear()
      .beginFill()
      .drawRect(maskNW.x, maskNW.y, maskSize.x, maskSize.y)
      .endFill();

    this.camera.setCameraResolution(drawSizeInGame);

    return this;
  }

  /**
   * Update this and contained Updatable object.
   *
   * @param deltaSec Update delta seconds.
   */
  update(engine: Engine, deltaSec: number): void {
    this.removeDeadUpdatable();

    this.updateDrawArea(engine.canvasSize());

    this.addSubActorsIfNotAdded();

    this.updatable.forEach((up) => up.update(this, deltaSec));
    this.checkCollision();
    this.updatePixiDisplayObject();
    this.camera.update(deltaSec);

    this.event.emit("updated", deltaSec);
  }

  /**
   * Add actor to this.
   *
   * @param actor Adding actor.
   * @returns this.
   */
  addActor(actor: IActor): this {
    if (this.hasActor(actor)) throw new Error("Actor was already added");

    this.actors.add(actor);
    this.addUpdatableInternal(actor);
    actor.notifyAddedToWorld(this);

    actor.getSubActors().forEach((sub) => {
      this.addActor(sub);
    });

    return this;
  }

  /**
   * Remove added actor from this.
   *
   * @param actor Removing actor.
   * @returns this.
   */
  removeActor(actor: IActor): this {
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
  hasActor(actor: IActor): boolean {
    return this.actors.has(actor);
  }

  /**
   * Iterate added actors.
   *
   * @returns Added actors iterator.
   */
  iterateActors(): IterableIterator<IActor> {
    return this.actors.values();
  }

  /**
   * Add Updatable object.
   *
   * @warn Do not add `Actor`. Use `addActor` instead.
   * @param updatable Adding Updatable object.
   * @returns this.
   */
  addUpdatable(updatable: Updatable): this {
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
  removeUpdatable(updatable: Updatable): this {
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
   * get pointer input receiver.
   *
   * @returns Receiver.
   */
  getPointerInputReceiver(): PointerInputReceiver {
    return this.pointerInput;
  }

  /**
   * Convert canvas position to game position.
   *
   * @param canvasPos Canvas position.
   * @returns Game position.
   */
  canvasPosToGamePos(canvasPos: VectorLike): Vector {
    this.pixiHead.updateTransform();
    const worldTrans = pixiMatrixToMatrix2d(
      this.pixiTail.transform.worldTransform
    );
    return worldTrans.localizePoint(canvasPos);
  }

  /**
   * Convert game position to canvas position.
   *
   * @param gamePos Game position.
   * @returns Canvas position.
   */
  gamePosToCanvasPos(gamePos: VectorLike): Vector {
    this.pixiHead.updateTransform();
    const worldTrans = pixiMatrixToMatrix2d(
      this.pixiTail.transform.worldTransform
    );
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
  ): PositionInAreaStatus {
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

  private addUpdatableInternal(updatable: Updatable): this {
    this.updatable.add(updatable);
    return this;
  }

  private removeUpdatableInternal(updatable: Updatable): this {
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

    this.displayObjectManager.updatePixiObjects(displayObjects);
  }

  private checkCollision(): void {
    const collisionToActor = new Map(
      Array.from(this.actors).map((ac) => [ac.getCollision(), ac])
    );
    const getActor = (col: Collision): IActor => {
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
