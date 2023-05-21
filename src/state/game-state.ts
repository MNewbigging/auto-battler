import {
  action,
  autorun,
  makeAutoObservable,
  observable,
  runInAction,
} from "mobx";

import { AnimationManager } from "./animation-manager";
import { GameTeam } from "./team";
import { GameUnit, UnitAnimation } from "./unit";

export class GameState {
  @observable turn = 0;
  @observable turnAnimating = false;

  animationManager = new AnimationManager();

  constructor(public leftTeam: GameTeam, public rightTeam: GameTeam) {
    makeAutoObservable(this);

    // Start after entry animations have finished
    setTimeout(() => this.startNextTurn(), 1500);
  }

  startNextTurn() {
    // When turn timer animation has finished
    this.animationManager.onOnce("turn-timer", () =>
      runInAction(() => {
        this.turnAnimating = false;
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

    // When units' cooldown animation has finished
    this.animationManager.onGroup(
      [
        `${leftActiveUnit.id}-${UnitAnimation.ACTIVATION_COOLDOWN}`,
        `${rightActiveUnit.id}-${UnitAnimation.ACTIVATION_COOLDOWN}`,
      ],
      () => {
        // Go to next step
        this.activationCheck();
      }
    );

    // Reduce unit cooldowns and start their animations
    leftActiveUnit.activationCooldown--;
    rightActiveUnit.activationCooldown--;

    leftActiveUnit.activationCooldownAnimating = true;
    rightActiveUnit.activationCooldownAnimating = true;
  }

  @action activationCheck() {
    const leftActiveUnit = this.leftTeam.getActiveUnit();
    const rightActiveUnit = this.rightTeam.getActiveUnit();

    // If nothing should activate, go to the next turn
    if (!leftActiveUnit.shouldActivate && !rightActiveUnit.shouldActivate) {
      // Timeout 0 here so this block exits fully before next turn beings
      setTimeout(() => this.startNextTurn(), 0);

      return;
    }

    // After both units' activation animations are done, check for defeated units
    this.animationManager.onGroupEnd = () => this.defeatedUnitsCheck();

    // Activate valid units
    if (leftActiveUnit.shouldActivate) {
      this.activateUnit(leftActiveUnit, this.rightTeam);
    }

    if (rightActiveUnit.shouldActivate) {
      this.activateUnit(rightActiveUnit, this.leftTeam);
    }
  }

  @action activateUnit(unit: GameUnit, opposingTeam: GameTeam) {
    // Get the targets of this unit's activation
    const targets = unit.getActivationTargets(opposingTeam);

    // Activate against those targets
    unit.activate(targets);

    // Animate this unit's activation
    this.animationManager.addToGroup([
      `${unit.id}-${UnitAnimation.ACTIVATION}`,
    ]);
    unit.activationAnimating = true;

    // Animate the target(s)
    for (const targetUnit of targets) {
      this.animationManager.addToGroup([`${unit.id}-${UnitAnimation.ON_HIT}`]);
      targetUnit.onHitAnimating = true;
    }

    // Reduce the activation steps count
    unit.activationSteps--;
  }

  @action defeatedUnitsCheck() {
    const leftActiveUnit = this.leftTeam.getActiveUnit();
    const rightActiveUnit = this.rightTeam.getActiveUnit();

    // If a unit is destroyed, it animates out & then is removed from the team
    if (leftActiveUnit.health <= 0) {
      leftActiveUnit.defeatAnimating = true;
    }

    if (rightActiveUnit.health <= 0) {
      rightActiveUnit.defeatAnimating = true;
    }
  }

  postActivateCheck() {
    // Check if any unit still has activation steps, re-run activate step if so
    // Otherwise, reset values and head to next turn
  }
}
