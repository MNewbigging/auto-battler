import { Unit } from "../unit/unit";

export function createUnits() {
  const bludger = new Unit();
  bludger.name = "Bludger boi";
  bludger.health = 4;
  bludger.attack = 3;
  bludger.activationSpeed = 3;

  return [bludger];
}
