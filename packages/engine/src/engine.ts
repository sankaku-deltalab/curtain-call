import * as PIXI from "pixi.js";
import { Scene } from "@curtain-call/scene";

/**
 * Engine is root of system.
 *
 * This class create pixi application and use it.
 */
export class Engine {
  private readonly app: PIXI.Application;
  private readonly scenes = new Set<Scene<Engine>>();

  /**
   *
   * @param canvas Rendering canvas.
   * @param sizeElement HTML element determine canvas size.
   */
  constructor(canvas: HTMLCanvasElement, sizeElement: Window | HTMLElement) {
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
      this.scenes.forEach((scene) => scene.update(this, deltaSec));
    });
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
   * Add new scene.
   * Added scene would be updated and rendered.
   *
   * @param scene New Scene.
   * @returns this
   */
  addScene(scene: Scene<Engine>): this {
    if (this.scenes.has(scene)) throw new Error("Scene was already added");
    this.scenes.add(scene);
    this.app.stage.addChild(scene.head);

    return this;
  }

  /**
   * Remove added scene.
   *
   * @param scene Added scene.
   * @returns this
   */
  removeScene(scene: Scene<Engine>): this {
    if (!this.scenes.has(scene)) throw new Error("Scene is not added");
    this.scenes.delete(scene);
    this.app.stage.removeChild(scene.head);

    return this;
  }
}
