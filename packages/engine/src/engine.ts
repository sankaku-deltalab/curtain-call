import { inject, autoInjectable } from "tsyringe";
import * as PIXI from "pixi.js";
import { Vector } from "trans-vector2d";
import {
  PointerInput,
  World,
  Engine as IEngine,
  EventEmitter,
} from "@curtain-call/actor";

type EngineEvent = EventEmitter<{
  updated: [number];
}>;

/**
 * Engine is root of system.
 *
 * This class create pixi application and use it.
 */
@autoInjectable()
export class Engine implements IEngine {
  /** Event. */
  public readonly event: EngineEvent;

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
    @inject("EventEmitter") event?: EngineEvent,
    @inject("PointerInput") pointerInput?: PointerInput
  ) {
    if (!(event && pointerInput)) throw new Error("DI failed");

    this.event = event;
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
    this.pointerInput.addReceiver(world, world.getPointerInputReceiver());

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
