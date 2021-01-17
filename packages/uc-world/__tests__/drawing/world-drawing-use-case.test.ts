import {
  ActorBase,
  DrawingObjectId,
  DrawingRepresentation,
} from "@curtain-call/entity";
import {
  actorBaseMockClass,
  worldBaseMockClass,
} from "@curtain-call/entity-mock";
import { WorldDrawingUseCase } from "../../src";

const createActorWithDrawing = (
  objId: DrawingObjectId
): [ActorBase, DrawingRepresentation[]] => {
  const rep: DrawingRepresentation[] = [
    {
      objectId: objId,
      style: "test",
      zIndex: 0,
      props: {},
    },
  ];
  const actor = new actorBaseMockClass({
    calcDrawingRepresentations: jest.fn().mockReturnValue(rep),
  });
  return [actor, rep];
};

describe("@curtain-call/uc-world.WorldDrawingUseCase", () => {
  it("deal drawing representations from actors in world", () => {
    const [actor1, rep1] = createActorWithDrawing("1");
    const [actor2, rep2] = createActorWithDrawing("2");
    const world = new worldBaseMockClass({
      iterateActors: jest.fn().mockReturnValue([actor1, actor2]),
    });
    const uc = new WorldDrawingUseCase();

    const r = uc.calcDrawingRepresentationsFromWorld(world);

    expect(r).toEqual([...rep1, ...rep2]);
  });
});
