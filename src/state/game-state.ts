import {
  action,
  autorun,
  makeAutoObservable,
  observable,
  runInAction,
} from "mobx";

import { AnimationManager } from "./animation-manager";
import { GameTeam } from "./team";
import { GameUnit } from "./unit";

export class GameState {
  @observable turn = 0;
  @observable turnAnimating = false;

  animationManager = new AnimationManager();

  constructor(public leftTeam: GameTeam, public rightTeam: GameTeam) {
    makeAutoObservable(this);

    this.setup();

    // Start after entry animations have finished
    setTimeout(() => this.increaseTurnTimer(), 2000);
  }

  setup() {
    //
  }

  @action increaseTurnTimer() {
    this.animationManager.scheduleAnimation({
      id: "turn-timer",
      onStart: () =>
        runInAction(() => {
          this.turn++;
          this.turnAnimating = true;
        }),
      onEnd: () =>
        runInAction(() => {
          this.turnAnimating = false;
          this.nextTurn();
        }),
    });
  }

  @action nextTurn() {
    // Increment turn counter
    // this.turn++;
    // this.turnAnimating = true;

    console.log("starting turn" + this.turn);

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

    // Is the game over?
    if (!this.leftTeam.units.length || !this.rightTeam.units.length) {
      console.log("game over!");

      return;
    }

    // Once all animations for this turn have stopped, go to next turn
    autorun(() => {
      if (leftActiveUnit.isAnimating() || rightActiveUnit.isAnimating()) {
        return;
      }

      setTimeout(() => runInAction(() => this.increaseTurnTimer()), 500);
    });
  }

  // reduceUnitCooldowns = (leftActiveUnit: GameUnit, rightActiveUnit: GameUnit) => {
  //   // Schedule this as an animation event
  //   this.animationManager.scheduleAnimation({

  //   });

  //   leftActiveUnit.reduceActivationCooldown();
  //   rightActiveUnit.reduceActivationCooldown();
  // }

  // activationCheck = () => {
  //   // If cooldown is 0, activate the unit
  //   if (leftActiveUnit.activationCooldown <= 0) {
  //     // Activate
  //     leftActiveUnit.activate(this.rightTeam);

  //     // Reset cooldown
  //     leftActiveUnit.activationCooldown = leftActiveUnit.activationSpeed;
  //   }

  //   if (rightActiveUnit.activationCooldown <= 0) {
  //     // Activate
  //     rightActiveUnit.activate(this.leftTeam);

  //     // Reset cooldown
  //     rightActiveUnit.activationCooldown = rightActiveUnit.activationSpeed;
  //   }
  // };
}
