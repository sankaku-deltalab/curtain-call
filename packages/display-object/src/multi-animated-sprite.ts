import * as PIXI from "pixi.js";
import { Transformation, matrix2dToPixiMatrix } from "@curtain-call/util";
import { DisplayObject } from "./display-object";

export const animSpriteFrom = (
  textures: PIXI.Texture[] | PIXI.AnimatedSprite.FrameObject[]
): PIXI.AnimatedSprite => {
  return new PIXI.AnimatedSprite(textures);
};

/**
 * MultiAnimatedSprite play one animation from multiple state or animation.
 *
 * @example
 * const sprite = new MultiAnimatedSprite({
 *   initialState: "standing",
 *   state: {
 *     standing: animSpriteFrom([...]),
 *     dash: animSpriteFrom([...]),
 *   },
 *   anim: {
 *     punch: animSpriteFrom([]),
 *     kick: animSpriteFrom([]),
 *   },
 * });
 *
 * sprite.changeState("dash"); // sprite play dash animation
 * sprite.playAnim("kick"); // sprite play kick animation and replay dash when complete kick animation
 * sprite.update(world, 0.01); // update animation
 */
export class MultiAnimatedSprite<
  TState extends { [key: string]: PIXI.AnimatedSprite },
  TAnim extends { [key: string]: PIXI.AnimatedSprite }
> implements DisplayObject {
  /** Root container. */
  public readonly pixiObj = new PIXI.Container();

  /** Transformation. */
  public readonly trans = new Transformation();

  private currentState: keyof TState;
  private playingAnim?: keyof TAnim;
  private readonly states: ReadonlyMap<keyof TState, PIXI.AnimatedSprite>;
  private readonly animations: ReadonlyMap<keyof TAnim, PIXI.AnimatedSprite>;

  /**
   * @param args.initialState Initial state name.
   * @param args.state States.
   * @param args.anim Animations.
   */
  constructor(args: {
    readonly initialState: keyof TState;
    readonly state: TState;
    readonly anim: TAnim;
  }) {
    const state = new Map<keyof TState, PIXI.AnimatedSprite>();
    for (const [key, sprite] of Object.entries(args.state)) {
      sprite.visible = false;
      sprite.autoUpdate = false;
      sprite.loop = true;
      sprite.anchor = new PIXI.Point(0.5, 0.5);
      this.pixiObj.addChild(sprite);
      state.set(key, sprite);
    }
    this.states = state;

    const animations = new Map<keyof TAnim, PIXI.AnimatedSprite>();
    for (const [key, sprite] of Object.entries(args.anim)) {
      sprite.visible = false;
      sprite.autoUpdate = false;
      sprite.loop = false;
      sprite.anchor = new PIXI.Point(0.5, 0.5);
      this.pixiObj.addChild(sprite);
      animations.set(key, sprite);
    }
    this.animations = animations;

    this.currentState = args.initialState;
    this.startCurrentState();
  }

  /**
   * Update self.
   *
   * @param deltaSec Delta seconds.
   */
  updatePixiObject(deltaSec: number): void {
    this.pixiObj.transform.setFromMatrix(
      matrix2dToPixiMatrix(this.trans.getGlobal())
    );

    const deltaMS = deltaSec * 1000;
    this.states.forEach((sprite) => {
      sprite.update(deltaMS);
    });
    this.animations.forEach((sprite) => {
      sprite.update(deltaMS);
    });
  }

  /**
   * Change state.
   *
   * @param nextState Next state name.
   * @returns this.
   */
  changeState(nextState: keyof TState): this {
    if (nextState === this.currentState) return this;
    this.currentState = nextState;

    if (!this.playingAnim) {
      this.startCurrentState();
    }
    return this;
  }

  /**
   * Play anim.
   *
   * @param anim Animation name would be played.
   * @returns this.
   */
  playAnim(anim: keyof TAnim): this {
    const animSprite = this.animations.get(anim);
    if (!animSprite) throw new Error();

    this.playingAnim = anim;
    this.playCurrentAnim();
    return this;
  }

  private animCompleted(): void {
    if (!this.playingAnim)
      throw new Error("Anim completed but any anim is not playing now");
    const animSprite = this.animations.get(this.playingAnim);
    if (!animSprite) throw new Error();

    this.playingAnim = undefined;
    this.disableAnim(animSprite);
    this.startCurrentState();
  }

  private startCurrentState(): void {
    const stateSprite = this.states.get(this.currentState);
    if (!stateSprite) throw new Error();

    this.states.forEach((sprite) => {
      sprite.gotoAndPlay(0);
      sprite.visible = sprite === stateSprite;
    });
  }

  private playCurrentAnim(): void {
    if (!this.playingAnim) throw new Error();
    const playing = this.animations.get(this.playingAnim);
    if (!playing) throw new Error();

    this.states.forEach((sprite) => {
      sprite.visible = false;
    });

    this.animations.forEach((sprite) => {
      this.disableAnim(sprite);
    });

    playing.onComplete = (): void => {
      this.animCompleted();
    };
    playing.visible = true;
    playing.gotoAndPlay(0);
  }

  private disableAnim(sprite: PIXI.AnimatedSprite): void {
    sprite.onComplete = (): void => {
      /** do nothing */
    };
    sprite.visible = false;
    sprite.stop();
  }
}
