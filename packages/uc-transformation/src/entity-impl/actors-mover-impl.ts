import { inject, injectable, Matrix } from "@curtain-call/shared-dependencies";
import { ActorsMover, ActorId, Seconds } from "@curtain-call/entity";
import { Movement, MovementStorage, TransformationStorage } from "../common";
import { injectTokens } from "../inject-tokens";

@injectable()
export class ActorsMoverImpl implements ActorsMover {
  constructor(
    @inject(injectTokens.MovementStorage)
    private readonly movementStorage: MovementStorage,
    @inject(injectTokens.TransformationStorage)
    private readonly transStorage: TransformationStorage
  ) {}

  update(
    actors: readonly ActorId[],
    deltaSec: ReadonlyMap<ActorId, Seconds>
  ): void {
    actors.forEach((actor) => {
      const delta = deltaSec.get(actor);
      const currentTrans = this.transStorage.getLocalTransformation(actor);
      if (delta === undefined) throw new Error("method argument is wrong");
      const movements = this.movementStorage.getMovements(actor);

      const r = this.updateMovements(actor, delta, currentTrans, movements);

      this.transStorage.setLocalTransformation(actor, r.newTrans);
      this.movementStorage.setMovements(actor, r.unfinishedMovements);
    });
  }

  private updateMovements(
    actor: ActorId,
    deltaSec: Seconds,
    currentTrans: Matrix,
    movements: readonly Movement[]
  ): { unfinishedMovements: Movement[]; newTrans: Matrix } {
    const unfinishedMovements: Movement[] = [];
    let newTrans = currentTrans;
    movements.forEach((mov) => {
      const r = mov.update(actor, deltaSec, newTrans);
      newTrans = r.nextTrans;
      if (!r.done) unfinishedMovements.push(mov);
    });
    return {
      unfinishedMovements,
      newTrans,
    };
  }
}
