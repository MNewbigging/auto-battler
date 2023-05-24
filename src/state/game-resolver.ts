import { BuiltTeam, SlimGameTeam } from "./team";
import { SlimGameUnit } from "./unit";

// How to break down events into actions?
export interface GameEvent {
  type: "game";
  property: "turn";
  value: number;
}

export interface UnitEvent {
  type: "unit";
  side: "left" | "right";
  unitId: string; // find the unit
  // Event and value kinda need to be an array, in case multiple change at once
  event: string; // js array-style property lookup (will this trigger observable change?)
  value: number; // change the property to this value
}

export type LogEventType = GameEvent | UnitEvent;

export interface GameEventLog {
  leftTeam: BuiltTeam;
  rightTeam: BuiltTeam;
  log: string[];
  events: LogEventType[][]; // a 'step' has an array of events, once those are done, go to next step
}

// Plays a match between two teams, without any frontend
export class GameResolver {
  turn = 0;
  log: string[] = [];
  events: LogEventType[][] = [];

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

    this.log.push(`Turn ${this.turn} activation count: ${activationCount}`);

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
    this.log.push("Next turn: " + this.turn);

    // Create game event for this step
    const gameEvent: GameEvent = {
      type: "game",
      property: "turn",
      value: this.turn,
    };

    // Add an event step
    this.events.push([gameEvent]);
  }

  private reduceUnitCooldowns(units: SlimGameUnit[]) {
    units.forEach((unit) => {
      unit.activationCooldown--;
      this.log.push(
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

      this.log.push(`${leftActiveUnit.name} activated against ${targetString}`);
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

      this.log.push(
        `${rightActiveUnit.name} activated against ${targetString}`
      );
    }
  }

  private destroyDefeatedUnits() {
    const left = this.leftTeam.getDefeatedUnits();
    if (left.length) {
      let defeatedString = "";
      left.forEach((unit) => (defeatedString += unit.name + ", "));

      this.log.push(`Left team has defeated units: ${defeatedString}`);
    }

    const right = this.rightTeam.getDefeatedUnits();
    if (right.length) {
      let defeatedString = "";
      right.forEach((unit) => (defeatedString += unit.name + ", "));

      this.log.push(`Right team has defeated units: ${defeatedString}`);
    }

    this.leftTeam.destroyDefeatedUnits();
    this.rightTeam.destroyDefeatedUnits();
  }

  private getWinningTeam(): SlimGameTeam | undefined {
    const leftDead = this.leftTeam.units.length === 0;
    const rightDead = this.rightTeam.units.length === 0;

    // Draw?
    if (leftDead && rightDead) {
      console.log("draw - need to account for this");
      return undefined;
    }

    if (leftDead) {
      return this.rightTeam;
    }

    if (rightDead) {
      return this.leftTeam;
    }

    return undefined;
  }

  private gameOver(winningTeam: SlimGameTeam) {
    this.log.push(`Game over! ${winningTeam.name} has won!`);

    // Print out the game events
    this.log.forEach((event) => console.log(event));

    this.onGameOver({
      leftTeam: this.leftTeam.builtTeam,
      rightTeam: this.rightTeam.builtTeam,
      log: this.log,
      events: this.events,
    });
  }
}
