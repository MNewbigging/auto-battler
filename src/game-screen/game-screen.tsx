import "./game-screen.scss";

import React from "react";
import { Button } from "@blueprintjs/core";
import { Observer, observer } from "mobx-react-lite";
import { runInAction } from "mobx";

import { GameState } from "../state/game-state";
import { UnitCard } from "../unit-card/unit-card";

interface GameScreenProps {
  gameState: GameState;
  onExit: () => void;
}

export const GameScreen: React.FC<GameScreenProps> = observer(
  ({ gameState, onExit }) => {
    const turnClasses = [
      "bp4-heading",
      "turn-timer",
      gameState.turnAnimating ? "active" : "",
    ];

    console.log("gmae-screen render", gameState.turnAnimating);

    return (
      <div className="game-screen">
        <div className="game-navbar">
          <Button icon="arrow-left" onClick={onExit} />
        </div>

        <div className="header">
          <Observer>
            {() => (
              <h1
                className={turnClasses.join(" ")}
                onAnimationEnd={() =>
                  gameState.animationManager.onAnimationEnd("turn-timer")
                }
              >
                Turn {gameState.turn}
              </h1>
            )}
          </Observer>
        </div>

        <div className="left-team-area">
          <h2 className="team-name bp4-heading">{gameState.leftTeam.name}</h2>
          <div className="team-unit-list">
            {gameState.leftTeam.units.map((unit, index) => (
              <UnitCard key={`left-unit-${index}`} unit={unit} />
            ))}
          </div>
        </div>
        <div className="right-team-area">
          <h2 className="team-name bp4-heading">{gameState.rightTeam.name}</h2>
          <div className="team-unit-list">
            {gameState.rightTeam.units.map((unit, index) => (
              <UnitCard key={`right-unit-${index}`} unit={unit} />
            ))}
          </div>
        </div>
      </div>
    );
  }
);
