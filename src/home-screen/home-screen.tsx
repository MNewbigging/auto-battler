import "./home-screen.scss";

import React from "react";

import { AppPage, AppState } from "../app-state";

interface HomeScreenProps {
  appState: AppState;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ appState }) => {
  return (
    <div className="home-screen">
      <div
        className="menu-item bp4-text-large"
        onClick={() => appState.setCurrentScreen(AppPage.PLAY)}
      >
        Play
      </div>
      <div
        className="menu-item bp4-text-large"
        onClick={() => appState.setCurrentScreen(AppPage.PLAY)}
      >
        Roster
      </div>
      <div
        className="menu-item bp4-text-large"
        onClick={() => appState.setCurrentScreen(AppPage.PLAY)}
      >
        Team builder
      </div>
    </div>
  );
};
