export interface IPlayer {
  name: string;
  run: number;
  isOut: boolean;
  over: number;
  wickets: number;
  zeros: number;
  wides: number;
  noBalls: number;
};

export interface ITeam {
  name: string;
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

export function getPlayers(): Array<IPlayer> {
  let players = new Array<IPlayer>();
  players.push({
    name: 'A',
    isOut: false,
    noBalls: 0,
    over: 0,
    run: 0,
    wickets: 0,
    wides: 0,
    zeros: 0
  });
  players.push({
    name: 'B',
    isOut: false,
    noBalls: 0,
    over: 0,
    run: 0,
    wickets: 0,
    wides: 0,
    zeros: 0
  });
  players.push({
    name: 'C',
    isOut: false,
    noBalls: 0,
    over: 0,
    run: 0,
    wickets: 0,
    wides: 0,
    zeros: 0
  });
  players.push({
    name: 'D',
    isOut: false,
    noBalls: 0,
    over: 0,
    run: 0,
    wickets: 0,
    wides: 0,
    zeros: 0
  });
  players.push({
    name: 'E',
    isOut: false,
    noBalls: 0,
    over: 0,
    run: 0,
    wickets: 0,
    wides: 0,
    zeros: 0
  });
  return players;
};
