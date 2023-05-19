import "./game-screen.scss";

import React from "react";
import { observer } from "mobx-react-lite";

import { GameState } from "../game-state";
import { UnitList } from "../unit-list/unit-list";

interface GameScreenProps {
  gameState: GameState;
}

export const GameScreen: React.FC<GameScreenProps> = observer(
  ({ gameState }) => {
    return (
      <div className="game-screen">
        <div className="left-team-area">
          <h2 className="team-name bp4-heading">{gameState.leftTeam.name}</h2>
          <UnitList units={gameState.leftTeam.units} />
        </div>
        <div className="right-team-area">
          <h2 className="team-name bp4-heading">{gameState.rightTeam.name}</h2>
          <UnitList units={gameState.rightTeam.units} />
        </div>
      </div>
    );
  }
);
