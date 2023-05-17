import "./app.scss";

import React from "react";
import { observer } from "mobx-react-lite";

import { AppPage, AppState } from "./app-state";
import { HomeScreen } from "./home-screen/home-screen";
import { PlayScreen } from "./play-screen/play-screen";
import { RosterScreen } from "./roster-screen/roster-screen";
import { TeamBuilderScreen } from "./team-builder-screen/team-builder-screen";
import { TeamsScreen } from "./teams-screen/teams-screen";

interface AppProps {
  appState: AppState;
}

export const App: React.FC<AppProps> = observer(({ appState }) => {
  let page: JSX.Element;
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
      page = <TeamBuilderScreen appState={appState} />;
      break;
    default:
      page = <HomeScreen appState={appState} />;
      break;
  }

  return <div className="app">{page}</div>;
});
