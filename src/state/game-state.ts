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
    console.log("starting next turn");

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
    console.log("reduce unit cooldowns");

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
    console.log("activation check");

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
    console.log("activating unit " + unit.name);

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
      this.animationManager.addToGroup([
        `${targetUnit.id}-${UnitAnimation.ON_HIT}`,
      ]);
      targetUnit.onHitAnimating = true;
    }

    // Reduce the activation steps count
    unit.activationSteps--;
  }

  postActivationCheck() {
    console.log("post activation check");

    // Occurs after an activation, checks to see if re-activating is necessary
    const leftActiveUnit = this.leftTeam.getActiveUnit();
    const rightActiveUnit = this.rightTeam.getActiveUnit();

    // Reactivate
    if (leftActiveUnit.shouldActivate || rightActiveUnit.shouldActivate) {
      this.activationCheck();
    } else {
      // Reset activation steps and go to next turn
      leftActiveUnit.resetAfterActivation();
      rightActiveUnit.resetAfterActivation();
      this.startNextTurn();
    }
  }

  @action defeatedUnitsCheck() {
    console.log("defeated units check");

    // If nothing is destroyed
    if (
      !this.leftTeam.hasDefeatedUnits() &&
      !this.rightTeam.hasDefeatedUnits()
    ) {
      // Go straight to post-activation check
      this.postActivationCheck();
    }

    // Get ids of all defeated units
    const defeatedUnits: GameUnit[] = [];

    this.leftTeam.units.forEach((leftUnit) => {
      if (leftUnit.defeated) {
        defeatedUnits.push(leftUnit);
      }
    });

    this.rightTeam.units.forEach((rightUnit) => {
      if (rightUnit.defeated) {
        defeatedUnits.push(rightUnit);
      }
    });

    // When all have finished their defeat animation, move units up queue
    const animIds = defeatedUnits.map(
      (unit) => `${unit.id}-${UnitAnimation.DEFEATED}`
    );
    this.animationManager.onGroup(animIds, () =>
      this.destroyUnits(defeatedUnits)
    );

    // Start defeat animations
    for (const defeatedUnit of defeatedUnits) {
      defeatedUnit.defeatAnimating = true;
    }
  }

  destroyUnits(units: GameUnit[]) {
    console.log(
      "destroying units ",
      units.map((u) => u.name)
    );

    units.forEach((unit) => {
      // Not sure which team this unit is in, but it's a no-op if it's the wrong team here
      this.leftTeam.destroyUnit(unit);
      this.rightTeam.destroyUnit(unit);
    });

    // Is this game over?
    if (this.leftTeam.defeated || this.rightTeam.defeated) {
      console.log("game over!!");

      return;
    }

    // Wait until any queue-moving animations stop...

    // Then check if we should re-activate
    this.postActivationCheck();
  }
}
