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
    leftActiveUnit.reduceActivationCooldown();
    rightActiveUnit.reduceActivationCooldown();
  }

  @action activationCheck() {
    const leftActiveUnit = this.leftTeam.getActiveUnit();
    const rightActiveUnit = this.rightTeam.getActiveUnit();

    // If nothing should activate, go to the next turn
    if (!leftActiveUnit.shouldActivate && !rightActiveUnit.shouldActivate) {
      this.startNextTurn();
    }

    // Otherwise activate valid units
    if (leftActiveUnit.shouldActivate) {
      this.activateUnit(leftActiveUnit, this.rightTeam);
    }

    if (rightActiveUnit.shouldActivate) {
      this.activateUnit(rightActiveUnit, this.leftTeam);
    }

    // When this activation step is done, check for any more steps this turn
  }

  @action activateUnit(unit: GameUnit, opposingTeam: GameTeam) {
    // Get the targets of this unit's activation
    const targets = unit.getActivationTargets(opposingTeam);

    // Activate against those targets
    unit.activate(targets);

    // After all animations, check for any destroyed units after this attack
    const animIds = [`${unit.id}-activation`];

    // Animate this unit's activation
    unit.activationAnimating = true;

    // Animate the target(s)
    for (const targetUnit of targets) {
      targetUnit.onHitAnimating = true;
    }

    // Reduce the activation steps count
    unit.activationSteps--;
  }

  destroyedUnitsCheck() {}
}
