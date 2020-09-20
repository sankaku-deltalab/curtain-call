import { ActorWithInfo, Team, ActorRole } from "../../src";

describe("@curtain-call/actor.ActorWithInfo", () => {
  it("can set team", () => {
    const actor = new ActorWithInfo();

    actor.setTeam(Team.playerSide);

    expect(actor.getTeam()).toBe(Team.playerSide);
  });

  it("is in no side team at default", () => {
    const actor = new ActorWithInfo();

    expect(actor.getTeam()).toBe(Team.noSide);
  });

  it("can set role", () => {
    const actor = new ActorWithInfo();

    actor.setRole(ActorRole.character);

    expect(actor.getRole()).toBe(ActorRole.character);
  });

  it("is misc role at default", () => {
    const actor = new ActorWithInfo();

    expect(actor.getRole()).toBe(ActorRole.misc);
  });
});
