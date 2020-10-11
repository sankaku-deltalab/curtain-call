import { EventEmitter } from "eventemitter3";
import * as PIXI from "pixi.js";
import { VectorLike, Vector } from "trans-vector2d";
import { inject, autoInjectable, container as diContainer } from "tsyringe";
import {
  IActor,
  World as IWorld,
  Engine,
  PositionInAreaStatus,
  PointerInputReceiver,
  Collision,
  DisplayObject,
  Transformation,
  Camera,
} from "@curtain-call/actor";
import {
  DisplayObjectManager,
  CollisionDrawer,
  OverlapChecker,
  RectArea,
} from "./interface";
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
    updatedWhilePaused: [number];
  }>();

  public readonly backgroundTrans: Transformation;
  public readonly pixiHead: PIXI.Container;
  public readonly pixiTail: PIXI.Container;
  public readonly pointerInput: PointerInputReceiver;

  private readonly camera: Camera;
  private readonly displayObjectManager: DisplayObjectManager;
  private readonly collisionDrawer: CollisionDrawer;
  private readonly actors = new Set<IActor>();
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
  private prevDrawAreaUpdater?: (
    canvasSize: Vector
  ) => {
    drawCenterInCanvas: VectorLike;
    drawSizeInCanvas: VectorLike;
    gameUnitPerPixel: number;
  };
  private prevCanvasSize = new Vector(0, 0);
  private readonly pausers = new Set<unknown>();

  constructor(
    @inject("PIXI.Container") pixiHead?: PIXI.Container,
    @inject("PIXI.Container") pixiTail?: PIXI.Container,
    @inject("Camera") camera?: Camera,
    @inject("DisplayObjectManager") displayObjectManager?: DisplayObjectManager,
    @inject("CollisionDrawer") CollisionDrawer?: CollisionDrawer,
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
        CollisionDrawer &&
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
    this.collisionDrawer = CollisionDrawer;
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
    if (
      this.drawAreaUpdater === this.prevDrawAreaUpdater &&
      canvasSize.equals(this.prevCanvasSize)
    )
      return this;

    this.prevDrawAreaUpdater = this.drawAreaUpdater;
    this.prevCanvasSize = canvasSize;

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
   * Update this and contained actors.
   *
   * @param deltaSec Update delta seconds.
   */
  update(engine: Engine, deltaSec: number): void {
    if (this.pausers.size > 0) {
      this.event.emit("updatedWhilePaused", deltaSec);
      return;
    }

    this.removeActorsShouldRemove();

    this.updateDrawArea(engine.canvasSize());

    this.addSubActorsIfNotAdded();

    this.actors.forEach((up) => up.update(this, deltaSec));
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
    if (!this.hasActor(actor)) throw new Error("Actor was not added");
    this.actors.delete(actor);
    actor.notifyRemovedFromWorld(this);

    actor.getSubActors().forEach((sub) => {
      this.removeActor(sub);
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

  /**
   * Enable collision drawing.
   *
   * @param enable Enable
   * @returns this.
   */
  setEnableCollisionDrawing(enable: boolean): this {
    this.collisionDrawer.setEnable(enable);
    return this;
  }

  /**
   * Pause time.
   *
   * @param pauser Pause instigator.
   */
  pause(pauser: unknown): void {
    this.pausers.add(pauser);
  }

  /**
   * Unpause time.
   *
   * @param pauser Paused instigator.
   */
  unpause(pauser: unknown): void {
    this.pausers.delete(pauser);
  }

  private removeActorsShouldRemove(): void {
    const removing = Array.from(this.actors).filter((ac) =>
      ac.shouldBeRemovedFromWorld(this)
    );
    removing.forEach((ac) => {
      this.removeActor(ac);
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

  private updatePixiDisplayObject(): void {
    this.collisionDrawer.updateDrawing(
      Array.from(this.actors).map((ac) => ac.getCollision())
    );

    const displayObjects: DisplayObject[] = [];
    displayObjects.push(this.collisionDrawer);
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
