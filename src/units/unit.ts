export class Unit {
  name = "";
  health = 0;
  attack = 0;
  activationSpeed = 1; // how often this unit activates

  // In-game counters
  activationCooldown = 1; // turns until this unit activates
}
