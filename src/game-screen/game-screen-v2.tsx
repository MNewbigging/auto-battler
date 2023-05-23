import "./game-screen-v2.scss";

import React from "react";
import { Button } from "@blueprintjs/core";
import { Observer, observer } from "mobx-react-lite";
import { motion } from "framer-motion";

import { GameRendererState } from "../state/game-renderer-state";
import { Pulser } from "../pulser/pulser";
import { UnitCardV2 } from "../unit-card/unit-card-v2";

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
          <Observer>
            {() => (
              <Pulser
                value={gameState.turn}
                keyName={`turn-${gameState.turn}`}
                className="turn-timer"
              />
            )}
          </Observer>
        </div>

        <div className="left-side">
          <div className="team-name">{gameState.leftTeam.name}</div>
          <div className="team-list">
            {gameState.leftTeam.units.map((unit, index) => (
              <motion.div
                key={`left-unit-${index}`}
                initial={{ x: -500 }}
                animate={{ x: 0 }}
                transition={{ delay: index * 0.3 }}
                layout
              >
                <UnitCardV2 unit={unit} />
              </motion.div>
            ))}
          </div>
        </div>

        <div className="right-side">
          <div className="team-name">{gameState.rightTeam.name}</div>

          <div className="team-list">
            {gameState.rightTeam.units.map((unit, index) => (
              <motion.div
                key={`right-unit-${index}`}
                initial={{ x: 500 }}
                animate={{ x: 0 }}
                transition={{ delay: index * 0.3 }}
                layout
              >
                <UnitCardV2 unit={unit} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  }
);
