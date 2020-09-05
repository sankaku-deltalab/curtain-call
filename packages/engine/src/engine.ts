import { EventEmitter } from "eventemitter3";
import { inject, autoInjectable, container as diContainer } from "tsyringe";
import * as PIXI from "pixi.js";
import { Vector } from "trans-vector2d";
import { PointerInput, World, Engine as IEngine } from "@curtain-call/actor";

export { diContainer };

/**
 * Engine is root of system.
 *
 * This class create pixi application and use it.
 */
@autoInjectable()
export class Engine implements IEngine {
  /** Event. */
  public readonly event = new EventEmitter<{
    updated: [number];
  }>();

  private readonly pointerInput: PointerInput;
  private readonly app: PIXI.Application;
  private readonly worlds = new Set<World>();

  /**
   *
   * @param canvas Rendering canvas.
   * @param sizeElement HTML element determine canvas size.
   * @param pointerInput Pointer input receiver from dom element.
   */
  constructor(
    canvas: HTMLCanvasElement,
    sizeElement: Window | HTMLElement,
    @inject("PointerInput") pointerInput?: PointerInput
  ) {
    if (!pointerInput) throw new Error("DI failed");

    this.pointerInput = pointerInput;

    const resolution = window.devicePixelRatio;
    this.app = new PIXI.Application({
      resolution,
      view: canvas,
      resizeTo: sizeElement,
      antialias: true,
      autoDensity: true,
      backgroundColor: 0xa9a9a9,
    });

    this.app.ticker.add((deltaRate: number): void => {
      const deltaSec = deltaRate / PIXI.settings.TARGET_FPMS / 1000;
      this.worlds.forEach((world) => world.update(this, deltaSec));
      this.event.emit("updated", deltaSec);
    });

    this.pointerInput.apply(canvas, canvas);
  }

  /**
   * Canvas size.
   *
   * @returns Canvas size { x: width, y: height }.
   */
  canvasSize(): Vector {
    return new Vector(
      this.app.view.width / this.app.renderer.resolution,
      this.app.view.height / this.app.renderer.resolution
    );
  }

  /**
   * Add new world.
   * Added world would be updated and rendered.
   *
   * @param world New World.
   * @returns this
   */
  addWorld(world: World): this {
    if (this.worlds.has(world)) throw new Error("World was already added");
    this.worlds.add(world);
    this.app.stage.addChild(world.pixiHead);
    this.pointerInput.addReceiver(world.getPointerInputReceiver());

    return this;
  }

  /**
   * Remove added world.
   *
   * @param world Added world.
   * @returns this
   */
  removeWorld(world: World): this {
    if (!this.worlds.has(world)) throw new Error("World is not added");
    this.worlds.delete(world);
    this.app.stage.removeChild(world.pixiHead);
    this.pointerInput.removeReceiver(world.getPointerInputReceiver());

    return this;
  }

  /**
   * Destroy this.
   * Do not use this after destroyed.
   * But added worlds would be still alive.
   */
  destroy(): void {
    this.app.destroy();
    this.worlds.forEach((w) => this.removeWorld(w));
  }
}
