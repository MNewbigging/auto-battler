import "./home-screen.scss";

import React from "react";
import { motion } from "framer-motion";

import { AppPage, AppState } from "../state/app-state";

interface HomeScreenProps {
  appState: AppState;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ appState }) => {
  return (
    <div className="home-screen">
      <h2 className="bp4-heading">Home</h2>

      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 1 }}
        className="menu-item bp4-text-large"
        onClick={() => appState.setCurrentScreen(AppPage.PLAY)}
      >
        Play
      </motion.div>
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 1 }}
        className="menu-item bp4-text-large"
        onClick={() => appState.setCurrentScreen(AppPage.ROSTER)}
      >
        Roster
      </motion.div>
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 1 }}
        className="menu-item bp4-text-large"
        onClick={() => appState.setCurrentScreen(AppPage.TEAMS)}
      >
        Teams
      </motion.div>
    </div>
  );
};
