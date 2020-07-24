export interface IPlayer {
  name: string;
  run?: number;
  isOut?: boolean;
  over?: number;
  wickets?: number;
  zeros?: number;
  wides?: number;
  noBalls?: number;
};

export interface ITeam {
  players: Array<IPlayer>;
  outs: number;
  run: number;
  overs: number;
  isBatting: boolean;
  isPlayed: boolean;
};

export interface IMatch {
  teamA: ITeam;
  teamB: ITeam;
};
