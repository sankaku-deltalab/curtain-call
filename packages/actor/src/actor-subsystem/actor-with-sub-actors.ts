import { Transformation } from "../interface";
import { Actor as IActor } from "../actor-interface";

export class ActorWithSubActors {
  private subActors = new Set<IActor>();

  constructor(private readonly sharedTrans: Transformation) {}

  /**
   * Add sub actor to this.
   * Sub actor would be attached to this.
   *
   * @param addingSubActor Adding actors.
   * @returns this.
   */
  addSubActor(...addingSubActor: IActor[]): this {
    addingSubActor.forEach((sub) => {
      this.subActors.add(sub);
      this.sharedTrans.attachChild(sub.getTransformation(), false);
    });

    return this;
  }

  /**
   * Remove sub actor from this.
   * Sub actor would be detach from parent.
   *
   * @param removingSubActor Removing actors.
   * @returns this.
   */
  removeSubActor(...removingSubActor: IActor[]): this {
    removingSubActor.forEach((sub) => {
      this.subActors.delete(sub);
      this.sharedTrans.detachChild(sub.getTransformation(), true);
    });

    return this;
  }

  /**
   * Get sub-actors.
   */
  getSubActors(): IActor[] {
    return Array.from(this.subActors);
  }
}
