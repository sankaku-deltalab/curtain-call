import {
  DisplayObject,
  MultipleDisplayObject,
  ManageDisplayObjectsServiceImpl,
} from "../../src";

export const displayObjectMockClass = jest.fn<
  DisplayObject,
  [Partial<DisplayObject>]
>((option: Partial<DisplayObject> = {}) =>
  Object.assign(
    {
      update: jest.fn(),
      calcDrawingRepresentation: jest.fn(),
    },
    option
  )
);

export const multiDOMockClass = jest.fn<
  MultipleDisplayObject,
  [Partial<MultipleDisplayObject>]
>((option: Partial<MultipleDisplayObject> = {}) =>
  Object.assign(
    {
      add: jest.fn(),
      remove: jest.fn(),
      update: jest.fn(),
      calcDrawingRepresentation: jest.fn(),
    },
    option
  )
);

describe("@curtain-call/uc-rendering.ManageDisplayObjectsService", () => {
  it("add display objects", () => {
    const objects = [
      new displayObjectMockClass({}),
      new displayObjectMockClass({}),
    ];
    const multiDO = new multiDOMockClass({});

    const service = new ManageDisplayObjectsServiceImpl();
    service.addDisplayObjects(objects, multiDO);
    expect(multiDO.add).toBeCalledWith(objects);

    service.removeDisplayObjects(objects, multiDO);
    expect(multiDO.remove).toBeCalledWith(objects);
  });
});
