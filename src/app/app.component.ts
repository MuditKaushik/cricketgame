import { Component } from '@angular/core';
import { BehaviorSubject, interval } from 'rxjs';
import { timeInterval, switchMap } from 'rxjs/operators';
import { IMatch, IPlayer } from './models/match';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'cricketmatch';
  isStarted: boolean = false;

  batsMan: IPlayer;
  baller: IPlayer;

  match: IMatch = {
    teamA: {
      isBatting: false,
      isPlayed: false,
      overs: 20,
      players: new Array<IPlayer>(5),
      run: 0,
      outs: 0
    },
    teamB: {
      isBatting: false,
      isPlayed: false,
      overs: 20,
      players: new Array<IPlayer>(5),
      run: 0,
      outs: 0
    }
  };

  constructor() {
    this.batsMan = this.defaultBatsMan;
    this.baller = this.defaultBaller;
  }

  protected isMatchStarted: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  protected score = [0, 1, 2, 3, 4, 5, 6, 7, 'wd', 'nb', 'out'];

  overs: number = 20;
  runs: number = 0;
  ballPerOver: number = 6;

  pauseMatch(): void {
    this.isMatchStarted.next(false);
  }
  startMatch(): void {
    this.isMatchStarted.next(true);
    this.started();
  }

  protected started(): void {
    this.assignBattingTeam();
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

  ball(): void {
    let index = this.generateRadomNumber;
    let ball = this.score[index];
    this.runScored(ball);
  }

  runScored(ball: number | string): void {
    switch (ball) {
      case 'wd':
        // TODO: increment ballers wideBalls;
        this.baller.wides += 1;
        this.increaseTeamScoreOnWideBall();
        this.ballPerOver += 1;
        break;
      case 'nb':
        // TODO: increment ballers noBalls;
        this.baller.noBalls += 1;
        this.ballPerOver += 1;
        break;
      case 'out':
        // TODO: increment ballers wicket;
        this.baller.wickets += 1;
        this.ballPerOver -= 1;
        let wicketTaken = this.getTotalWicketsTaken();
        if (this.match.teamA.isBatting) {
          if (wicketTaken === this.match.teamA.players.length) {
            // TODO: switch teams;
            this.switchTeams();
          }
        } else if (this.match.teamB.isBatting) {
          if (wicketTaken === this.match.teamB.players.length) {
            // TODO: switch teams;
            this.switchTeams();
          }
        } else {
          // TODO: chosse next batsman;
          this.batsMan = this.assignNextBatsman(this.pickRandomPlayer());
        }
        break;
      default:
        this.ballPerOver -= 1;
        if (ball !== 0) {
          // TODO: increase batting team runs.
          this.batsMan.run += parseInt(ball.toString());
        }
        break;
    }
    if (this.ballPerOver === 0) {
      this.ballPerOver = 6;
      this.assignNextBaller(this.pickRandomPlayer());
    }
    this.calculateScore();
  }

  protected get generateRadomNumber(): number {
    let start = 0;
    let range = 11;
    let rangeNum = (range - start) + start;
    return Math.floor(Math.random() * rangeNum);
  }
  protected assignBattingTeam(): void {
    if (!this.match.teamA.isBatting) {
      this.match.teamA.isBatting = true;
    } else {
      this.match.teamB.isBatting = true;
    }
  }
  protected assignNextBatsman(nextbatsman: number): IPlayer {
    if (this.match.teamA.isBatting) {
      if (this.match.teamA.players[nextbatsman].isOut) {
        return this.assignNextBatsman(this.pickRandomPlayer());
      } else {
      }
    } else {
      this.batsMan = this.match.teamB.players[nextbatsman];
    }
  }
  protected assignNextBaller(nextballer: number): void {
    if (!this.match.teamA.isBatting) {
      this.baller = this.match.teamA.players[nextballer];
    } else {
      this.baller = this.match.teamB.players[nextballer];
    }
  }
  protected calculateScore(): void {
    if (this.match.teamA.isBatting) {
      this.match.teamA.run = this.match.teamA.players.reduce((initial, player) => {
        return initial + player.run;
      }, 0);
      this.runs = this.match.teamA.run;
    } else {
      this.match.teamA.run = this.match.teamB.players.reduce((initial, player) => {
        return initial + player.run;
      }, 0);
      this.runs = this.match.teamB.run;
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
      return this.match.teamB.players.reduce((initialWickt, player) => {
        return initialWickt + player.wickets;
      }, 0);
    } else {
      return this.match.teamA.players.reduce((initialWickt, player) => {
        return initialWickt + player.wickets;
      }, 0);
    }
  }
  protected switchTeams(): void {
    if (this.isMatchOver()) {
      this.isMatchStarted.next(false);
    } else {
      if (this.match.teamA.isBatting) {
        this.match.teamA.isBatting = false;
        this.match.teamA.isPlayed = true;
        this.match.teamB.isBatting = true;
      } else {
        this.match.teamB.isBatting = false;
        this.match.teamB.isPlayed = true;
        this.match.teamA.isBatting = true;
      }
    }
  }
  protected isMatchOver(): boolean {
    return ((this.match.teamA.isPlayed && this.match.teamA.outs === this.match.teamA.players.length)
      &&
      (this.match.teamB.isPlayed && this.match.teamB.outs === this.match.teamB.players.length));
  }
  protected pickRandomPlayer(): number {
    let playersLength = 6;
    return Math.floor(Math.random() * (playersLength - 0) + 0);
  }

  protected get defaultBatsMan(): IPlayer {
    return {
      name: 'A',
      isOut: false,
      run: 0
    };
  }
  protected get defaultBaller(): IPlayer {
    return {
      name: 'A',
      wides: 0,
      noBalls: 0,
      over: 0,
      wickets: 0
    };
  };
}
