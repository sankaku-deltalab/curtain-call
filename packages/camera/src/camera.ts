import * as PIXI from "pixi.js";
import { VectorLike, Matrix, Vector } from "trans-vector2d";
import { inject, autoInjectable, container as diContainer } from "tsyringe";
import { RectArea } from "@curtain-call/world";
import {
  Camera as ICamera,
  PositionInAreaStatus,
  Transformation,
} from "@curtain-call/actor";

export { diContainer };

/**
 * Camera transform graphics.
 */
@autoInjectable()
export class Camera implements ICamera {
  public readonly trans: Transformation;
  public readonly pixiHead: PIXI.Container;
  public readonly pixiTail: PIXI.Container;
  private readonly visibleArea: RectArea;

  /**
   * @param tail Pixi container.
   */
  constructor(
    @inject("Transformation") trans?: Transformation,
    @inject("PIXI.Container") pixiHead?: PIXI.Container,
    @inject("PIXI.Container") pixiTail?: PIXI.Container,
    @inject("RectArea") visibleArea?: RectArea
  ) {
    if (!(trans && pixiHead && pixiTail && visibleArea))
      throw new Error("DI objects is not exists");

    this.trans = trans;
    this.pixiHead = pixiHead;
    this.pixiTail = pixiTail;
    this.visibleArea = visibleArea;
    pixiHead.addChild(pixiTail);
    trans.attachChild(visibleArea.trans, false);
  }

  /**
   * Update PIXI drawing.
   */
  update(): void {
    const { translation, rotation, scale } = this.trans.getGlobal().decompose();

    this.pixiTail.position = new PIXI.Point(-translation.x, -translation.y);
    this.pixiHead.scale = new PIXI.Point(1 / scale.x, 1 / scale.y);
    this.pixiHead.rotation = -rotation;
  }

  /**
   * Set camera resolution in game space.
   *
   * @param gameResolution Camera resolution in game space.
   * @returns this.
   */
  setCameraResolution(gameResolution: VectorLike): this {
    const gameResolutionHalf = Vector.from(gameResolution).div(2);
    this.visibleArea.init(gameResolutionHalf.mlt(-1), gameResolutionHalf);
    return this;
  }

  /**
   * Camera move to position.
   *
   * @param pos Move destination.
   * @returns this.
   */
  moveTo(pos: VectorLike): this {
    const { rotation, scale } = this.trans.getLocal().decompose();
    this.trans.setLocal(Matrix.from({ translation: pos, rotation, scale }));
    return this;
  }

  /**
   * Zoom camera.
   *
   * @param scale New scale.
   * @return this.
   */
  zoomTo(scale: number): this {
    const { translation, rotation } = this.trans.getLocal().decompose();
    this.trans.setLocal(
      Matrix.from({
        translation,
        rotation,
        scale: new Vector(1 / scale, 1 / scale),
      })
    );
    return this;
  }

  /**
   * Rotate camera.
   *
   * @param rotation New rotation.
   * @returns this.
   */
  rotateTo(rotation: number): this {
    const { translation, scale } = this.trans.getLocal().decompose();
    this.trans.setLocal(Matrix.from({ translation, rotation, scale }));
    return this;
  }

  /**
   * Calc position status for visible area.
   *
   * @param globalPos Target position in global coordinates.
   * @param radius Target radius.
   * @returns Status.
   */
  calcVisibilityStatus(
    globalPos: VectorLike,
    radius: number
  ): PositionInAreaStatus {
    return this.visibleArea.calcPositionStatus(globalPos, radius);
  }
}
