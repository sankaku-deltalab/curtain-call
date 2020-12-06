import "jest";
import { Movement, ActorExtension, Timer } from "@curtain-call/entity";

export const movementMockClass = jest.fn<Movement, [Partial<Movement>]>(
  (option: Partial<Movement>) =>
    Object.assign(
      {
        update: jest.fn(),
      },
      option
    )
);

export const actorExtensionMockClass = jest.fn<
  ActorExtension,
  [Partial<ActorExtension>]
>((option: Partial<ActorExtension>) =>
  Object.assign(
    {
      preUpdate: jest.fn(),
      update: jest.fn(),
      postUpdate: jest.fn(),
    },
    option
  )
);

export const timerMockClass = jest.fn<Timer, [Partial<Timer>]>(
  (option: Partial<Timer>) =>
    Object.assign(
      {
        update: jest.fn(),
        abort: jest.fn(),
      },
      option
    )
);
