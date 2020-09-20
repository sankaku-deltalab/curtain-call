import { Team, ActorRole } from "../actor-interface";

export class ActorWithInfo {
  private team = Team.noSide;
  private role = ActorRole.misc;

  /**
   * Set team joined this.
   *
   * @param team New team.
   * @returns this.
   */
  setTeam(team: Team): this {
    this.team = team;
    return this;
  }

  /**
   * Get team joined this.
   *
   * @returns Team.
   */
  getTeam(): Team {
    return this.team;
  }

  /**
   * Set ActorRole.
   *
   * @param role ActorRole of self.
   * @returns this.
   */
  setRole(role: ActorRole): this {
    this.role = role;
    return this;
  }

  /**
   * Get ActorRole of self.
   *
   * @returns ActorRole of self.
   */
  getRole(): ActorRole {
    return this.role;
  }
}
