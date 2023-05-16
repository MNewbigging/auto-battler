import "./home-screen.scss";

import React from "react";

export const HomeScreen: React.FC = () => {
  return (
    <div className="home-screen">
      <div className="menu-item bp4-text-large">Play</div>
      <div className="menu-item bp4-text-large">Roster</div>
      <div className="menu-item bp4-text-large">Team builder</div>
    </div>
  );
};
