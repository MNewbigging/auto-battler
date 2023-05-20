import "./game-screen.scss";

import React from "react";
import { Button } from "@blueprintjs/core";
import { Observer, observer } from "mobx-react-lite";

import { GameState } from "../game-state";
import { UnitList } from "../unit-list/unit-list";

interface GameScreenProps {
  gameState: GameState;
  onExit: () => void;
}

export const GameScreen: React.FC<GameScreenProps> = observer(
  ({ gameState, onExit }) => {
    return (
      <div className="game-screen">
        <div className="game-navbar">
          <Button icon="arrow-left" onClick={onExit} />
        </div>

        <div className="header">
          <Observer>
            {() => <h1 className="bp4-heading">Turn {gameState.turn}</h1>}
          </Observer>
        </div>

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
