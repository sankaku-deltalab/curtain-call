import { Matrix } from "trans-vector2d";
import { DrawingRepresentation } from "@curtain-call/entity";
import { actorBaseMockClass } from "@curtain-call/entity-mock";
import {
  ActorDrawingUseCase,
  DisplayObject,
  DisplayObjectData,
} from "../../src";

const displayObjectMockClass = jest.fn<DisplayObject, []>(() => ({
  update: jest.fn(),
  calcDrawingRepresentation: jest.fn(),
}));

describe("@curtain-call/ActorDrawingUseCase", () => {
  it("can create initial data", () => {
    const data = new ActorDrawingUseCase().createInitialData();

    expect(data).toEqual({
      visible: true,
      displayObjects: new Set(),
    });
  });

  it("can init display object", () => {
    const uc = new ActorDrawingUseCase();
    const data: DisplayObjectData = {
      visible: true,
      displayObjects: new Set(),
    };

    const obj1 = new displayObjectMockClass();
    const obj2 = new displayObjectMockClass();
    uc.initDisplayObject(data, { displayObjects: [obj1, obj2] });

    expect(data).toEqual({
      visible: true,
      displayObjects: new Set([obj1, obj2]),
    });
  });

  it("can change visibility", () => {
    const uc = new ActorDrawingUseCase();
    const obj = new displayObjectMockClass();
    const data: DisplayObjectData = {
      visible: true,
      displayObjects: new Set([obj]),
    };

    uc.setVisibility(data, false);

    expect(data).toEqual({
      visible: false,
      displayObjects: new Set([obj]),
    });
  });

  it("update contained display objects", () => {
    const uc = new ActorDrawingUseCase();
    const obj = new displayObjectMockClass();
    const data: DisplayObjectData = {
      visible: true,
      displayObjects: new Set([obj]),
    };

    const deltaSec = 12;
    uc.updateDisplayObjects(data, deltaSec);

    expect(obj.update).toBeCalledWith(deltaSec);
  });

  it("calc drawing representations from contained display objects", () => {
    const objRep: DrawingRepresentation = {
      objectId: "uuid4 value",
      style: "test type",
      zIndex: 12,
      props: {},
    };
    const obj = new displayObjectMockClass();
    obj.calcDrawingRepresentation = jest.fn().mockReturnValue([objRep]);
    const data: DisplayObjectData = {
      visible: true,
      displayObjects: new Set([obj]),
    };

    const actorTrans = Matrix.from({ translation: { x: 1, y: 2 } });
    const actor = new actorBaseMockClass({
      transformation: jest.fn().mockReturnValue(actorTrans),
    });

    const uc = new ActorDrawingUseCase();
    const r = uc.calcDrawingRepresentationOfActor(data, actor);
    expect(obj.calcDrawingRepresentation).toBeCalledWith(actorTrans);
    expect(r).toHaveLength(1);
    expect(r[0]).toBe(objRep);
  });
});
