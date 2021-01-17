import { WorldBase, DrawingRepresentation } from "@curtain-call/entity";

export class WorldDrawingUseCase {
  /**
   * For renderer, world deal drawing representations.
   * Drawing representations would be dealt from actors.
   *
   * @param world
   */
  calcDrawingRepresentationsFromWorld(
    world: WorldBase
  ): readonly DrawingRepresentation[] {
    const representations: DrawingRepresentation[] = [];
    for (const ac of world.iterateActors()) {
      representations.push(...ac.calcDrawingRepresentations());
    }
    return representations;
  }
}
