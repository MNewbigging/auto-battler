import "./game-screen-v2.scss";

import React from "react";
import { Button } from "@blueprintjs/core";
import { motion } from "framer-motion";
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

        <div className="turn-timer">
          Turn
          <motion.span
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ duration: 0.5, times: [0, 0.3, 1] }}
            className="turn-timer"
            key={`turn-${gameState.turn}`}
          >
            {gameState.turn}
          </motion.span>
        </div>

        <div className="left-side"></div>

        <div className="right-side"></div>
      </div>
    );
  }
);
