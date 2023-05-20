import React from "react";
import { Button, MenuItem } from "@blueprintjs/core";
import { ItemRenderer, Select2 } from "@blueprintjs/select";

import { Team } from "../state/app-state";

const renderTeam: ItemRenderer<Team> = (
  team,
  { handleClick, handleFocus, modifiers, query }
) => {
  if (!modifiers.matchesPredicate) {
    return null;
  }

  return (
    <MenuItem
      active={modifiers.active}
      disabled={modifiers.disabled}
      key={team.id}
      onClick={handleClick}
      onFocus={handleFocus}
      roleStructure="listoption"
      text={team.name}
    />
  );
};

interface TeamSelectorProps {
  teams: Team[];
  onTeamSelect: (team: Team) => void;
  buttonText?: string;
}

export const TeamSelector: React.FC<TeamSelectorProps> = ({
  teams,
  onTeamSelect,
  buttonText,
}) => {
  return (
    <Select2<Team>
      items={teams}
      itemRenderer={renderTeam}
      onItemSelect={onTeamSelect}
      filterable={false}
      noResults={<span>No teams - go make one!</span>}
    >
      <Button
        text={buttonText ?? "Select a team"}
        rightIcon="double-caret-vertical"
        placeholder="Select a team"
      />
    </Select2>
  );
};
