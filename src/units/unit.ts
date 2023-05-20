import { action, makeAutoObservable, observable } from "mobx";

import { Team } from "./team";

// These appear on the card, are always these values
export interface UnitDefaultProps {
  name: string;
  health: number;
  attack: number;
  activationSpeed: number;
}

export class Unit implements UnitDefaultProps {
  // Set from the default props
  name: string;
  @observable health: number;
  @observable attack: number;
  @observable activationSpeed: number;
  @observable activationCooldown: number;

  constructor(private defaultProps: UnitDefaultProps) {
    makeAutoObservable(this);

    // Init default values using props
    this.name = defaultProps.name;
    this.health = defaultProps.health;
    this.attack = defaultProps.attack;
    this.activationSpeed = defaultProps.activationSpeed;
    this.activationCooldown = this.activationSpeed;
  }

  @action activate(opponentTeam: Team) {
    // Perform basic attack
    const activeTarget = opponentTeam.getActiveUnit();

    activeTarget.health -= this.attack;
  }
}
