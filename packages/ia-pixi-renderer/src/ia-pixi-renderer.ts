import * as PIXI from "pixi.js";
import { DrawingObject } from "@curtain-call/entity";
import {
  Renderer,
  DrawingObjectSprite,
  isDrawingObjectSprite,
} from "@curtain-call/uc-rendering";

/**
 * Rendering with pixi.
 */
export class RendererPixi implements Renderer {
  private rendererPixi?: PIXI.Renderer;
  private readonly loader = new PIXI.Loader();
  private readonly images = new Map<string, string>();
  private unusedSprites = new Map<string, PIXI.Sprite>();
  private usedSprites = new Map<string, PIXI.Sprite>();

  /**
   * Init renderer.
   *
   * @param pixiRenderer Rendering target.
   * @returns this.
   */
  init(pixiRenderer: PIXI.Renderer): this {
    this.rendererPixi = pixiRenderer;
    return this;
  }

  /**
   * Load images.
   *
   * @param asset Image ids and image url.
   */
  load(asset: Map<string, string>): Promise<void> {
    return new Promise((resolve) => {
      this.loader.add(Array.from(asset)).load(() => resolve());
    });
  }

  /**
   * Unload images.
   *
   * @param imageIds Unloading image ids.
   */
  unload(imageIds: Set<string>): void {
    imageIds.forEach((imageId) => {
      PIXI.BaseTexture.from(imageId).destroy();
    });
  }

  /**
   * Render drawing objects.
   *
   * @param objects
   */
  render(objects: readonly DrawingObject[]): void {
    if (!this.rendererPixi) return;

    const root = new PIXI.Container();
    this.unusedSprites = this.usedSprites;
    this.usedSprites = new Map();

    objects.forEach((obj) => {
      if (isDrawingObjectSprite(obj)) this.renderSprite(obj, root);
    });

    this.rendererPixi.render(root);

    this.unusedSprites.forEach((sp) => sp.destroy());
    this.unusedSprites.clear();
  }

  private renderSprite(obj: DrawingObjectSprite, parent: PIXI.Container): void {
    const sprite = this.popSprite(obj.objectId, obj.imageId);
    sprite.setTransform(...obj.transform.asArray());
    sprite.zIndex = obj.zIndex;

    if (sprite.parent !== parent) parent.addChild(sprite);
  }

  private popSprite(objectId: string, imageId: string): PIXI.Sprite {
    const textureUrl = this.images.get(imageId);
    if (textureUrl === undefined) throw new Error("Unknown imageId");

    const sprite = this.unusedSprites.get(objectId) || new PIXI.Sprite();
    const texture = PIXI.Texture.from(textureUrl);
    if (sprite.texture !== texture) sprite.texture = texture;

    this.usedSprites.set(objectId, sprite);
    return sprite;
  }
}
