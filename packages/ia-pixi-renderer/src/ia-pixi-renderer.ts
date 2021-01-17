import * as PIXI from "pixi.js";
import { DrawingRepresentation, DrawingObjectId } from "@curtain-call/entity";
import {
  Renderer,
  DrawingRepresentationSprite,
  isDrawingRepresentationSprite,
} from "@curtain-call/uc-rendering";

/**
 * Rendering with pixi.
 */
export class RendererPixi implements Renderer {
  private rendererPixi?: PIXI.Renderer;
  private readonly loader = new PIXI.Loader();
  private readonly images = new Map<DrawingObjectId, string>();
  private unusedSprites = new Map<DrawingObjectId, PIXI.Sprite>();
  private usedSprites = new Map<DrawingObjectId, PIXI.Sprite>();

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
  render(objects: readonly DrawingRepresentation[]): void {
    if (!this.rendererPixi) return;

    const root = new PIXI.Container();
    this.unusedSprites = this.usedSprites;
    this.usedSprites = new Map();

    objects.forEach((obj) => {
      if (isDrawingRepresentationSprite(obj)) this.renderSprite(obj, root);
    });

    this.rendererPixi.render(root);

    this.unusedSprites.forEach((sp) => sp.destroy());
    this.unusedSprites.clear();
  }

  private renderSprite(
    obj: DrawingRepresentationSprite,
    parent: PIXI.Container
  ): void {
    const sprite = this.popSprite(obj.objectId, obj.imageId);
    sprite.setTransform(...obj.transform.asArray());
    sprite.zIndex = obj.zIndex;

    if (sprite.parent !== parent) parent.addChild(sprite);
  }

  private popSprite(objectId: DrawingObjectId, imageId: string): PIXI.Sprite {
    const textureUrl = this.images.get(imageId);
    if (textureUrl === undefined) throw new Error("Unknown imageId");

    const sprite = this.unusedSprites.get(objectId) || new PIXI.Sprite();
    const texture = PIXI.Texture.from(textureUrl);
    if (sprite.texture !== texture) sprite.texture = texture;

    this.usedSprites.set(objectId, sprite);
    return sprite;
  }
}
