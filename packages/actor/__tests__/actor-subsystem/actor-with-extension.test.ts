import {
  extensionMockClass,
  actorInterfaceMockClass,
  worldMock,
} from "../mocks";
import { ActorWithExtension } from "../../src";
import { ActorExtension } from "../../src";

describe("@curtain-call/actor.ActorWithExtension", () => {
  it("can add extension and notify it to extension", () => {
    const extensions = [new extensionMockClass(), new extensionMockClass()];
    const actor = new ActorWithExtension();
    const parent = new actorInterfaceMockClass();

    actor
      .addExtension(extensions[0], parent)
      .addExtension(extensions[1], parent);

    expect(extensions[0].notifyAddedToActor).toBeCalledWith(parent);
    expect(extensions[1].notifyAddedToActor).toBeCalledWith(parent);
    expect(actor.getExtensions()).toEqual(extensions);
  });

  describe("can get one extension filtered by user-defined-type-guard", () => {
    interface TestExtension extends ActorExtension {
      readonly isTestExtension: true;
    }

    const isTestExtension = (ext: ActorExtension): ext is TestExtension => {
      return (ext as TestExtension).isTestExtension === true;
    };

    const testExtensionMockClass = jest.fn<ActorExtension, []>(() => ({
      isTestExtension: true,
      notifyAddedToActor: jest.fn(),
      update: jest.fn(),
      shouldBeRemovedFromWorld: jest.fn(),
    }));

    it("when has only one extension filtered by guard", () => {
      const testExtension = new testExtensionMockClass();
      const extensions = [testExtension, new extensionMockClass()];
      const actor = new ActorWithExtension();
      const parent = new actorInterfaceMockClass();

      actor
        .addExtension(extensions[0], parent)
        .addExtension(extensions[1], parent);

      expect(actor.getOneExtension(isTestExtension)).toBe(testExtension);
    });

    it("but can not get extension when actor has multiple extension filtered by guard", () => {
      const extensions = [
        new testExtensionMockClass(),
        new testExtensionMockClass(),
      ];
      const actor = new ActorWithExtension();
      const parent = new actorInterfaceMockClass();

      actor
        .addExtension(extensions[0], parent)
        .addExtension(extensions[1], parent);

      expect(actor.getOneExtension(isTestExtension)).toBe(undefined);
    });
  });

  it("update extensions", () => {
    const extension = new extensionMockClass();
    const actor = new ActorWithExtension();
    const parent = new actorInterfaceMockClass();
    actor.addExtension(extension, parent);

    const world = new worldMock();
    const deltaSec = 0.125;
    actor.update(world, parent, deltaSec);

    expect(extension.update).toBeCalledWith(world, parent, deltaSec);
  });

  it("should be remove if some extension should be removed", () => {
    const extensions = [new extensionMockClass(), new extensionMockClass()];
    jest.spyOn(extensions[0], "shouldBeRemovedFromWorld").mockReturnValue(true);
    jest
      .spyOn(extensions[1], "shouldBeRemovedFromWorld")
      .mockReturnValue(false);
    const actor = new ActorWithExtension();
    const parent = new actorInterfaceMockClass();
    actor
      .addExtension(extensions[0], parent)
      .addExtension(extensions[1], parent);

    const world = new worldMock();
    const deltaSec = 0.125;
    actor.update(world, parent, deltaSec);

    const shouldRemoveActor = actor.shouldBeRemovedFromWorld(world, parent);
    expect(shouldRemoveActor).toBe(true);
  });
});
