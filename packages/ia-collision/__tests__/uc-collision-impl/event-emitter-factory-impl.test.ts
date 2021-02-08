import "reflect-metadata";
import { container } from "@curtain-call/shared-dependencies";
import { EventEmitterFactoryImpl } from "../../src";

describe("@curtain-call/ia-collision.EventEmitterFactoryImpl", () => {
  it("can be created from tsyringe container", () => {
    const subContainer = container.createChildContainer();

    const factory = subContainer.resolve(EventEmitterFactoryImpl);

    expect(factory).toBeInstanceOf(EventEmitterFactoryImpl);
  });
});
