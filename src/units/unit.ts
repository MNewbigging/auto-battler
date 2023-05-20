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
  health: number;
  attack: number;
  activationSpeed: number;
  activationCooldown: number;

  constructor(private defaultProps: UnitDefaultProps) {
    // Init default values using props
    this.name = defaultProps.name;
    this.health = defaultProps.health;
    this.attack = defaultProps.attack;
    this.activationSpeed = defaultProps.activationSpeed;
    this.activationCooldown = this.activationSpeed;
  }
}
