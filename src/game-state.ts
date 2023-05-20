import { action, autorun, makeAutoObservable, observable } from "mobx";

import { Team } from "./units/team";

export class GameState {
  @observable turn = 0;
  @observable turnAnimating = false;

  constructor(public leftTeam: Team, public rightTeam: Team) {
    makeAutoObservable(this);

    this.setup();

    // Start after entry animations have finished
    setTimeout(() => this.nextTurn(), 2000);
  }

  setup() {
    // Right team should reverse its unit order
    this.rightTeam.units = this.rightTeam.units.reverse();
  }

  @action nextTurn() {
    // Increment turn counter
    this.turn++;
    this.turnAnimating = true;

    // Reduce activation times of active units
    const leftActiveUnit = this.leftTeam.getActiveUnit();
    const rightActiveUnit = this.rightTeam.getActiveUnit();

    leftActiveUnit.reduceActivationCooldown();
    rightActiveUnit.reduceActivationCooldown();

    // If cooldown is 0, activate the unit
    if (leftActiveUnit.activationCooldown <= 0) {
      // Activate
      leftActiveUnit.activate(this.rightTeam);

      // Reset cooldown
      leftActiveUnit.activationCooldown = leftActiveUnit.activationSpeed;
    }

    if (rightActiveUnit.activationCooldown <= 0) {
      // Activate
      rightActiveUnit.activate(this.leftTeam);

      // Reset cooldown
      rightActiveUnit.activationCooldown = rightActiveUnit.activationSpeed;
    }

    // After both units are given a chance to activate, clear any defeated units
    if (leftActiveUnit.health <= 0) {
      this.leftTeam.destroyUnit(leftActiveUnit);
    }

    if (rightActiveUnit.health <= 0) {
      this.rightTeam.destroyUnit(rightActiveUnit);
    }

    // Once all animations for this turn have stopped, go to next turn
    autorun(() => {
      if (leftActiveUnit.isAnimating() || rightActiveUnit.isAnimating()) {
        return;
      }

      console.log("neither unit animating");
    });
  }
}
