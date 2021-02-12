import "reflect-metadata";
import { container } from "@curtain-call/shared-dependencies";
import { ActorFactoryImpl, Actor, injectTokens } from "../../src";

describe("@curtain-call/ia-actor.ActorFactoryImpl", () => {
  it("can create from tsyringe container", () => {
    const subContainer = container.createChildContainer();
    Object.values(injectTokens).forEach((token) => {
      subContainer.register(token, { useValue: jest.fn() });
    });
    subContainer.register(injectTokens.DIContainer, { useValue: subContainer });

    const impl = subContainer.resolve<ActorFactoryImpl>(ActorFactoryImpl);

    expect(impl).toBeInstanceOf(ActorFactoryImpl);
  });

  it("can create Actor", () => {
    const subContainer = container.createChildContainer();
    Object.values(injectTokens).forEach((token) => {
      subContainer.register(token, { useValue: jest.fn() });
    });
    subContainer.register(injectTokens.DIContainer, { useValue: subContainer });
    subContainer.register(injectTokens.Actor, { useClass: Actor });

    const impl = subContainer.resolve(ActorFactoryImpl);

    expect(impl.createActor()).toBeInstanceOf(Actor);
  });
});
