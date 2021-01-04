import { ActorBase, DrawingRepresentation } from "@curtain-call/entity";
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

const createActorAndDrawingRepresentations = (
  objectId: string
): [ActorBase, DrawingRepresentation[]] => {
  const drawingRepresentations: DrawingRepresentation[] = [
    { drawingRepresentationType: "", objectId, zIndex: 0 },
  ];
  const actor = new actorBaseMockClass({
    calcDrawingRepresentations: jest
      .fn()
      .mockReturnValue(drawingRepresentations),
  });
  return [actor, drawingRepresentations];
};

describe("@curtain-call/uc-rendering.RenderingServiceImpl", () => {
  it("render actors in world", () => {
    const [actor1, objects1] = createActorAndDrawingRepresentations("1");
    const [actor2, objects2] = createActorAndDrawingRepresentations("2");
    const world = new worldBaseMockClass({
      iterateActors: jest.fn().mockReturnValue([actor1, actor2]),
    });
    const renderer = new rendererMockClass({});

    const service = new RenderingServiceImpl();
    service.renderActorsInWorld(world, renderer);
    expect(renderer.render).toBeCalledWith([...objects1, ...objects2]);
  });
});
