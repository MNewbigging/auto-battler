import { SlimGameTeam } from "./team";
import { SlimGameUnit } from "./unit";

export interface GameEventLog {
  events: string[];
}

// Plays a match between two teams, without any frontend
export class SlimGameState {
  turn = 0;
  events: string[] = [];

  constructor(
    private leftTeam: SlimGameTeam,
    private rightTeam: SlimGameTeam,
    private onGameOver: (eventLog: GameEventLog) => void
  ) {}

  startGame() {
    this.nextTurn();
  }

  nextTurn() {
    this.incrementTurnCounter();

    // Decrement unit cooldowns
    const leftActiveUnit = this.leftTeam.getActiveUnit();
    const rightActiveUnit = this.rightTeam.getActiveUnit();

    this.reduceUnitCooldowns([leftActiveUnit, rightActiveUnit]);

    // Both active units would activate at once, but the activation phase is run
    // As many times as the highest activationSteps value between left/right active unit
    // This is so that both units are given the chance to activate together
    let activationCount = 0;

    if (leftActiveUnit.shouldActivate) {
      activationCount = leftActiveUnit.activationSteps;
    }

    if (
      rightActiveUnit.shouldActivate &&
      rightActiveUnit.activationSteps > activationCount
    ) {
      activationCount = rightActiveUnit.activationSteps;
    }

    this.events.push(`Turn ${this.turn} activation count: ${activationCount}`);

    // Perform activation phase
    for (let i = 0; i < activationCount; i++) {
      // Both units will activate if they should
      this.activationStep(leftActiveUnit, rightActiveUnit);

      // Then destroy any defeated units for others to move up the queue
      // Those that move up then become potential targets for further activations this turn
      this.destroyDefeatedUnits();

      // Before starting next activation step this turn, check if the game has ended
      const winningTeam = this.getWinningTeam();
      if (winningTeam) {
        // The game is over!
        this.gameOver(winningTeam);

        return;
      }
    }

    // If there were activations this turn, those activated units should reset their values
    if (leftActiveUnit.activatedThisTurn) {
      leftActiveUnit.postActivateReset();
    }
    if (rightActiveUnit.activatedThisTurn) {
      rightActiveUnit.postActivateReset();
    }

    // After any activations, this turn is over - move to next turn
    this.nextTurn();
  }

  private incrementTurnCounter() {
    this.turn++;
    this.events.push("Next turn: " + this.turn);
  }

  private reduceUnitCooldowns(units: SlimGameUnit[]) {
    units.forEach((unit) => {
      unit.activationCooldown--;
      this.events.push(
        `${unit.name} cooldown reduced to ${unit.activationCooldown}`
      );
    });
  }

  private activationStep(
    leftActiveUnit: SlimGameUnit,
    rightActiveUnit: SlimGameUnit
  ) {
    // Check for unit activation
    if (leftActiveUnit.shouldActivate) {
      const targets = leftActiveUnit.getActivationTargets(
        this.leftTeam,
        this.rightTeam
      );
      leftActiveUnit.activate(targets);

      let targetString = "";
      targets.forEach((target) => {
        targetString += target.name + ", health: " + target.health + ". ";
      });

      this.events.push(
        `${leftActiveUnit.name} activated against ${targetString}`
      );
    }

    if (rightActiveUnit.shouldActivate) {
      const targets = rightActiveUnit.getActivationTargets(
        this.rightTeam,
        this.leftTeam
      );
      rightActiveUnit.activate(targets);

      let targetString = "";
      targets.forEach((target) => {
        targetString += target.name + ", health: " + target.health + ". ";
      });

      this.events.push(
        `${rightActiveUnit.name} activated against ${targetString}`
      );
    }
  }

  private destroyDefeatedUnits() {
    const left = this.leftTeam.getDefeatedUnits();
    if (left.length) {
      let defeatedString = "";
      left.forEach((unit) => (defeatedString += unit.name + ", "));

      this.events.push(`Left team has defeated units: ${defeatedString}`);
    }

    const right = this.rightTeam.getDefeatedUnits();
    if (right.length) {
      let defeatedString = "";
      right.forEach((unit) => (defeatedString += unit.name + ", "));

      this.events.push(`Right team has defeated units: ${defeatedString}`);
    }

    this.leftTeam.destroyDefeatedUnits();
    this.rightTeam.destroyDefeatedUnits();
  }

  private getWinningTeam(): SlimGameTeam | undefined {
    if (!this.leftTeam.units.length) {
      return this.rightTeam;
    }

    if (!this.rightTeam.units.length) {
      return this.leftTeam;
    }

    return undefined;
  }

  private gameOver(winningTeam: SlimGameTeam) {
    this.events.push(`Game over! ${winningTeam.name} has won!`);

    // Print out the game events
    this.events.forEach((event) => console.log(event));

    this.onGameOver({ events: this.events });
  }
}
