import "./game-screen-v2.scss";

import React from "react";
import { Button } from "@blueprintjs/core";
import { observer } from "mobx-react-lite";

import { GameRendererState } from "../state/game-renderer-state";

interface GameScreenV2Props {
  gameState: GameRendererState;
  onExit: () => void;
}

export const GameScreenV2: React.FC<GameScreenV2Props> = observer(
  ({ gameState, onExit }) => {
    return (
      <div className="game-screen">
        <div className="topnav">
          <Button icon="arrow-left" text="Back" onClick={onExit} />
        </div>

        <div className="turn-timer"></div>

        <div className="left-side"></div>

        <div className="right-side"></div>
      </div>
    );
  }
);
