import { ActorBase, DrawingObject } from "@curtain-call/entity";
import {
  actorBaseMockClass,
  worldBaseMockClass,
} from "@curtain-call/entity-mock";
import { Renderer, RenderingServiceImpl } from "../../src";

export const rendererMockClass = jest.fn<Renderer, [Partial<Renderer>]>(
  (option: Partial<Renderer> = {}) =>
    Object.assign(
      {
        load: jest.fn(),
        unload: jest.fn(),
        render: jest.fn(),
      },
      option
    )
);

const createActorAndDrawingObjects = (
  objectId: string
): [ActorBase, DrawingObject[]] => {
  const drawingObjects: DrawingObject[] = [
    { drawingObjectType: "", objectId, zIndex: 0 },
  ];
  const actor = new actorBaseMockClass({
    calcDrawingObjects: jest.fn().mockReturnValue(drawingObjects),
  });
  return [actor, drawingObjects];
};

describe("@curtain-call/uc-rendering.RenderingServiceImpl", () => {
  it("render actors in world", () => {
    const [actor1, objects1] = createActorAndDrawingObjects("1");
    const [actor2, objects2] = createActorAndDrawingObjects("2");
    const world = new worldBaseMockClass({
      iterateActors: jest.fn().mockReturnValue([actor1, actor2]),
    });
    const renderer = new rendererMockClass({});

    const service = new RenderingServiceImpl();
    service.renderActorsInWorld(world, renderer);
    expect(renderer.render).toBeCalledWith([...objects1, ...objects2]);
  });
});
