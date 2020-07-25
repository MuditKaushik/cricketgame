import { Component } from '@angular/core';
import { BehaviorSubject, interval } from 'rxjs';
import { timeInterval, switchMap } from 'rxjs/operators';
import { IMatch, IPlayer, getPlayers } from './models/match';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'cricketmatch';
  winnerMessage = '';
  isStarted: boolean = false;
  hasMatchOver: boolean = false;

  match: IMatch;
  batsMan: IPlayer;
  baller: IPlayer;

  overs: number = 0;
  runs: number = 0;
  ballPerOver: number = 6;

  protected isMatchStarted: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  protected score = [0, 1, 2, 3, 4, 5, 6, 7, 'wd', 'nb', 'out'];
  protected overPerMatch = 20;

  constructor() {
    this.match = {
      teamA: {
        name: 'Team A',
        isBatting: false,
        isPlayed: false,
        overs: 20,
        players: getPlayers(),
        run: 0,
        outs: 0
      },
      teamB: {
        name: 'Team B',
        isBatting: false,
        isPlayed: false,
        overs: 20,
        players: getPlayers(),
        run: 0,
        outs: 0
      }
    };
    this.match.teamA.isBatting = true;
  }

  pauseMatch(): void {
    this.isMatchStarted.next(false);
  }

  startMatch(): void {
    this.isMatchStarted.next(true);
    this.started();
  }

  protected get generateRadomNumber(): number {
    let start = 0;
    let range = 11;
    let rangeNum = (range - start) + start;
    return Math.floor(Math.random() * rangeNum);
  }
  protected get getTeamOvers(): number {
    if (!this.match.teamA.isBatting) {
      return this.match.teamA.players.reduce((initOver, player) => {
        return initOver + player.over;
      }, 0);
    } else {
      return this.match.teamB.players.reduce((initOver, player) => {
        return initOver + player.over;
      }, 0);
    }
  }
  protected get pickRandomPlayer(): number {
    let playersLength = 5;
    return Math.floor(Math.random() * Math.floor(playersLength));
  }
  protected started(): void {
    this.assignBattingTeam();
    this.baller = this.assignNextBaller(this.pickRandomPlayer);
    interval(1000).pipe(
      timeInterval(),
      switchMap(_ => this.isMatchStarted),
    ).subscribe((started) => {
      this.isStarted = started;
      if (started) {
        this.ball();
      }
    });
  }
  protected ball(): void {
    let index = this.generateRadomNumber;
    let ball = this.score[index];
    this.runScored(ball);
  }
  protected runScored(ball: number | string): void {
    switch (ball) {
      case 'wd':
        // TODO: increment ballers wideBalls;
        this.baller.wides = this.baller.wides + 1;
        this.ballPerOver = this.ballPerOver + 1;
        this.increaseTeamScoreOnWideBall();
        break;
      case 'nb':
        // TODO: increment ballers noBalls;
        this.baller.noBalls = this.baller.noBalls + 1;
        this.ballPerOver = this.ballPerOver + 1;
        break;
      case 'out':
        // TODO: increment ballers wicket;
        this.baller.wickets = this.baller.wickets + 1;
        this.ballPerOver = this.ballPerOver - 1;
        this.batsMan.isOut = true;
        // TODO: chosse next batsman;
        this.batsMan = this.assignNextBatsman();
        break;
      default:
        this.ballPerOver = this.ballPerOver - 1;
        if (ball !== 0) {
          // TODO: increase batting team runs.
          this.batsMan.run = this.batsMan.run + parseInt(ball.toString());
        }
        break;
    }
    this.calculateBallerOvers();
    this.canSwitchTeam();
  }
  protected assignBattingTeam(): void {
    if (!this.isMatchOver()) {
      this.batsMan = this.assignNextBatsman();
      this.baller = this.assignNextBaller(this.pickRandomPlayer);
    } else {
      this.hasMatchOver = true;
      this.declareWinningTeam();
      this.isMatchStarted.next(false);
    }
  }
  protected assignNextBatsman(): IPlayer {
    if (this.match.teamA.isBatting) {
      for (let player of this.match.teamA.players) {
        if (!player.isOut) {
          return player;
        }
      }
    } else if (this.match.teamB.isBatting) {
      for (let player of this.match.teamB.players) {
        if (!player.isOut) {
          return player;
        }
      }
    }
    return {} as IPlayer;
  }
  protected assignNextBaller(nextballer: number): IPlayer {
    if (!this.match.teamA.isBatting) {
      return this.match.teamA.players[nextballer];
    } else {
      return this.match.teamB.players[nextballer];
    }
  }
  protected increaseTeamScoreOnWideBall(): void {
    if (this.match.teamA.isBatting) {
      this.match.teamA.run += 1;
    } else {
      this.match.teamB.run += 1;
    }
  }
  protected getTotalWicketsTaken(): number {
    if (this.match.teamA.isBatting) {
      return this.match.teamA.players.filter(player => player.isOut).length;
    } else {
      return this.match.teamB.players.filter(player => player.isOut).length;
    }
  }
  protected switchTeams(): void {
    if (this.isMatchOver()) {
      this.hasMatchOver = true;
      this.declareWinningTeam();
      this.isMatchStarted.next(false);
    } else {
      if (this.match.teamA.isBatting) {
        this.match.teamA.isBatting = false;
        this.match.teamA.isPlayed = true;
        this.match.teamB.isBatting = true;
      } else if (this.match.teamB.isBatting) {
        this.match.teamB.isBatting = false;
        this.match.teamB.isPlayed = true;
        this.isMatchStarted.next(false);
      }
      this.overs = 0;
      this.ballPerOver = 6;
    }
  }
  protected isMatchOver(): boolean {
    return (this.match.teamA.isPlayed && this.match.teamB.isPlayed);
  }
  protected calculateBallerOvers(): void {
    if (this.ballPerOver === 0) {
      this.ballPerOver = 6;
      this.baller.over += 1;
      this.baller = this.assignNextBaller(this.pickRandomPlayer);
    }
  }
  protected canSwitchTeam(): void {
    // if match over completed.
    if (this.getTeamOvers === this.overPerMatch) {
      this.switchTeams();
      this.assignBattingTeam()
    } else {
      // Condition all batsman are out.
      let wicketTaken = this.getTotalWicketsTaken();
      if (this.match.teamA.isBatting) {
        if (wicketTaken === this.match.teamA.players.length) {
          // TODO: switch teams;
          this.switchTeams();
          this.assignBattingTeam()
        }
      } else if (this.match.teamB.isBatting) {
        if (wicketTaken === this.match.teamB.players.length) {
          // TODO: switch teams;
          this.switchTeams();
          this.assignBattingTeam()
        }
      }
    }
  }
  protected declareWinningTeam(): void {
    let teamAplayerScores = this.match.teamA.players.reduce((initScore, player) => {
      return initScore + player.run;
    }, 0);
    let teamBplayerScore = this.match.teamB.players.reduce((initScore, player) => {
      return initScore + player.run;
    }, 0);

    let totalTeamAScore = teamAplayerScores + this.match.teamA.run;
    let totalTeamBScore = teamBplayerScore + this.match.teamB.run;

    if (totalTeamAScore > totalTeamBScore) {
      this.winnerMessage = `${this.match.teamA.name} wins this match.`
    } else {
      this.winnerMessage = `${this.match.teamB.name} wins this match.`
    }
  }
}
