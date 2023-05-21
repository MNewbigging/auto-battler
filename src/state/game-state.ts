import {
  action,
  autorun,
  makeAutoObservable,
  observable,
  runInAction,
} from "mobx";

import { AnimationEvent, AnimationManager } from "./animation-manager";
import { AnimationManagerV2 } from "./animation-manager-v2";
import { GameTeam } from "./team";
import { GameUnit } from "./unit";

export class GameState {
  @observable turn = 0;
  @observable turnAnimating = false;

  animationManager = new AnimationManagerV2();

  constructor(public leftTeam: GameTeam, public rightTeam: GameTeam) {
    makeAutoObservable(this);

    // Start after entry animations have finished
    setTimeout(() => this.startNextTurn(), 2000);
  }

  startNextTurn() {
    // Register the turn timer anim to be notified when it ends
    this.animationManager.registerAnimationIds(["turn-timer"], () =>
      runInAction(() => {
        // No longer animating
        this.turnAnimating = false;

        // Go to next step
        this.reduceUnitCooldowns();
      })
    );

    // Increment turn timer and start its animation
    this.turn++;
    this.turnAnimating = true;
  }

  reduceUnitCooldowns() {
    const leftActiveUnit = this.leftTeam.getActiveUnit();
    const rightActiveUnit = this.rightTeam.getActiveUnit();

    // Register ids for cooldown anims and provide onEnd for next step
    this.animationManager.registerAnimationIds(
      [`${leftActiveUnit.id}-cooldown`, `${rightActiveUnit.id}-cooldown`],
      () => {
        // No longer animating
        leftActiveUnit.onActivationCooldownAnimEnd();
        rightActiveUnit.onActivationCooldownAnimEnd();

        // Go to next step
        this.activationCheck();
      }
    );

    // Reduce unit cooldowns and start their animations
    leftActiveUnit.reduceActivationCooldown();
    rightActiveUnit.reduceActivationCooldown();
  }

  @action activationCheck() {
    const leftActiveUnit = this.leftTeam.getActiveUnit();
    const rightActiveUnit = this.rightTeam.getActiveUnit();

    // Start any activation animations
    if (leftActiveUnit.shouldActivate) {
      leftActiveUnit.activationAnimating = true;
    }

    if (rightActiveUnit.shouldActivate) {
      rightActiveUnit.activationAnimating = true;
    }

    // Nothing activates
    if (!leftActiveUnit.shouldActivate && !rightActiveUnit.shouldActivate) {
      // Next turn
      this.startNextTurn();
    }
  }

  @action nextTurn() {
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

      setTimeout(() => runInAction(() => this.startNextTurn()), 500);
    });
  }

  private incTurnTimer() {
    // On the next turn
    this.turn++;

    // Animate the increase in turn
    this.turnAnimating = true;
  }

  private onTurnTimerAnimEnd = () => {
    // No longer animating
    this.turnAnimating = false;

    // Ready for next step now that anim is done
    this.reduceActiveUnitCooldowns();
  };

  private reduceActiveUnitCooldowns() {
    const left = this.leftTeam.getActiveUnit();
    const right = this.rightTeam.getActiveUnit();

    left.activationCooldown--;
    right.activationCooldown--;

    // Both units animate at the same time
    left.activationCooldownAnimating = true;
    right.activationCooldownAnimating = true;
  }

  /*
  @action nextTurn() {
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
*/
}
