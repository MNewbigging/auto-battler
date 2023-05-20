import "./app.scss";

import React from "react";
import { observer } from "mobx-react-lite";

import { AppPage, AppState } from "./state/app-state";
import { GameScreen } from "./game-screen/game-screen";
import { HomeScreen } from "./home-screen/home-screen";
import { PlayScreen } from "./play-screen/play-screen";
import { RosterScreen } from "./roster-screen/roster-screen";
import { TeamBuilderScreen } from "./team-builder-screen/team-builder-screen";
import { TeamsScreen } from "./teams-screen/teams-screen";

interface AppProps {
  appState: AppState;
}

export const App: React.FC<AppProps> = observer(({ appState }) => {
  let page: JSX.Element | null = null;
  switch (appState.currentPage) {
    case AppPage.HOME:
      page = <HomeScreen appState={appState} />;
      break;
    case AppPage.PLAY:
      page = <PlayScreen appState={appState} />;
      break;
    case AppPage.ROSTER:
      page = <RosterScreen appState={appState} />;
      break;
    case AppPage.TEAMS:
      page = <TeamsScreen appState={appState} />;
      break;
    case AppPage.TEAM_BUILDER:
      if (appState.teamBuilderState) {
        page = (
          <TeamBuilderScreen
            builderState={appState.teamBuilderState}
            onSave={appState.saveTeam}
            onCancel={appState.cancelBuildTeam}
          />
        );
      }

      break;
    case AppPage.GAME:
      if (appState.gameState) {
        page = (
          <GameScreen
            gameState={appState.gameState}
            onExit={() => appState.exitGame()}
          />
        );
      }
      break;
    default:
      page = <HomeScreen appState={appState} />;
      break;
  }

  return <div className="app">{page}</div>;
});
