import { DrawingRepresentation } from "@curtain-call/entity";
import { actorBaseMockClass } from "@curtain-call/entity-mock";
import { ActorDrawingUseCase, DisplayObjectData } from "@curtain-call/uc-actor";
import { Matrix } from "trans-vector2d";
import { DrawingActor } from "../../src";

const createDrawingData = (): DisplayObjectData => ({
  visible: true,
  displayObjects: new Set(),
});

const ucMock = jest.fn<ActorDrawingUseCase, []>(() => ({
  createInitialData: jest.fn().mockReturnValueOnce(createDrawingData()),
  initDisplayObject: jest.fn(),
  setVisibility: jest.fn(),
  updateDisplayObjects: jest.fn(),
  calcDrawingRepresentationOfActor: jest.fn(),
}));

const createUc = (): [ActorDrawingUseCase, DisplayObjectData] => {
  const data = createDrawingData();
  const uc = new ucMock();
  uc.createInitialData = jest.fn().mockReturnValue(data);
  return [uc, data];
};

describe("@curtain-call/DrawingActor", () => {
  it("use created initial collision", () => {
    const uc = new ucMock();
    const _drawingActor = new DrawingActor(uc);
    expect(uc.createInitialData).toBeCalled();
  });

  it("can init with actor", () => {
    const uc = new ucMock();
    const drawingActor = new DrawingActor(uc);

    const r = drawingActor.initDrawingActor(new actorBaseMockClass({}));

    expect(r).toBe(drawingActor);
  });

  it("can init collision", () => {
    const [uc, data] = createUc();
    const drawingActor = new DrawingActor(uc);

    const args = {
      displayObjects: [],
    };
    drawingActor.initDisplaying(args);

    expect(uc.initDisplayObject).toBeCalledWith(data, args);
  });

  it.each`
    visibility
    ${true}
    ${false}
  `("can change visibility", ({ visibility }) => {
    const [uc, data] = createUc();
    const drawingActor = new DrawingActor(uc);

    drawingActor.setVisibility(visibility);

    expect(uc.setVisibility).toBeCalledWith(data, visibility);
  });

  it("calculate DrawingRepresentations", () => {
    const [uc, data] = createUc();
    const rep: DrawingRepresentation = {
      objectId: "abc",
      style: "edf",
      zIndex: 123,
      props: {},
    };
    uc.calcDrawingRepresentationOfActor = jest.fn().mockReturnValue([rep]);

    const parentTrans = Matrix.translation({ x: 1, y: 2 });
    const parent = new actorBaseMockClass({
      transformation: jest.fn().mockReturnValue(parentTrans),
    });

    const drawingActor = new DrawingActor(uc).initDrawingActor(parent);

    const r = drawingActor.calcDrawingRepresentations();
    expect(r).toEqual([rep]);
    expect(uc.calcDrawingRepresentationOfActor).toBeCalledWith(data, parent);
  });
});
