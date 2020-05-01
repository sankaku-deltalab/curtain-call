import * as PIXI from "pixi.js";
import { Actor } from "@curtain-call/actor";
import { Camera } from "@curtain-call/camera";
import { DisplayObjectManager } from "@curtain-call/display-object";

/**
 * Scene is root of game scene.
 */
export class Scene<T> {
  private readonly actors = new Set<Actor<this>>();

  /**
   * @param head Root of PIXI objects.
   * @param tail Tail of PIXI objects.
   * @param displayObject DisplayObjectContainer.
   * @param camera Camera.
   */
  constructor(
    public readonly head = new PIXI.Container(),
    public readonly tail = new PIXI.Container(),
    public readonly camera = new Camera(),
    private readonly displayObject = new DisplayObjectManager<Scene<T>>()
  ) {
    head.addChild(camera.head);
    camera.tail.addChild(tail);
    tail.addChild(this.displayObject.container);
    this.displayObject = displayObject;
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

  private updatePixiDisplayObject(): void {
    this.actors.forEach((actor) => {
      actor.displayObjects.forEach((obj) => {
        if (this.displayObject.has(obj)) return;
        this.displayObject.add(obj);
      });
    });
  }
}
