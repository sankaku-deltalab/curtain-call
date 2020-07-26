import { EventEmitter } from "eventemitter3";
import * as PIXI from "pixi.js";
import { World } from "@curtain-call/world";
import { PointerInput, PointerInputConnector } from "@curtain-call/input";

/**
 * Engine is root of system.
 *
 * This class create pixi application and use it.
 */
export class Engine {
  /** Event. */
  public readonly event = new EventEmitter<{
    updated: [number];
  }>();

  private readonly app: PIXI.Application;
  private readonly worlds = new Set<World>();
  private readonly pointerInputConnectors = new Map<
    World,
    PointerInputConnector<World>
  >();

  /**
   *
   * @param canvas Rendering canvas.
   * @param sizeElement HTML element determine canvas size.
   * @param pointerInput Pointer input receiver from dom element.
   */
  constructor(
    canvas: HTMLCanvasElement,
    sizeElement: Window | HTMLElement,
    private readonly pointerInput = new PointerInput()
  ) {
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
      this.worlds.forEach((world) => world.update(deltaSec));
      this.event.emit("updated", deltaSec);
    });

    this.pointerInput.apply(canvas, canvas);
  }

  /**
   * Canvas width.
   *
   * @returns Canvas width.
   */
  canvasWidth(): number {
    return this.app.view.width / this.app.renderer.resolution;
  }

  /**
   * Canvas height.
   *
   * @returns Canvas height.
   */
  canvasHeight(): number {
    return this.app.view.height / this.app.renderer.resolution;
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
    this.app.stage.addChild(world.head);
    this.pointerInputConnectors.set(
      world,
      new PointerInputConnector(world, this.pointerInput, world.pointerInput)
    );

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

    this.app.stage.removeChild(world.head);

    const inputConnector = this.pointerInputConnectors.get(world);
    this.pointerInputConnectors.delete(world);
    if (!inputConnector) throw new Error();
    inputConnector.destroy(this.pointerInput);

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
