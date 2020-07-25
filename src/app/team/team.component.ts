import { Component, Input, OnInit } from '@angular/core';
import { ITeam, IPlayer } from '../models/match';

@Component({
  selector: 'team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss']
})
export class TeamComponent implements OnInit {
  @Input('detail') team: ITeam;
  @Input('matchOver') matchOver: boolean = false;
  position: string;
  constructor() { }
  ngOnInit(): void {
    if (!this.team) {
      this.team = {} as ITeam;
    }
  }

  get getLabel(): string {
    return (this.team.isBatting) ? 'Batting' : 'Balling';
  }

  isOut(player: IPlayer): string {
    return (player.isOut) ? 'Yes' : 'No';
  }

  get getImage(): string {
    let imagepath = '../assets/';
    let imageName = (this.team.isBatting) ? 'cricket-bat.svg' : 'cricket-ball.svg'
    return imagepath.concat(imageName);
  }

  get teamScore(): number {
    let playerScores = this.team.players.reduce((initScore, player) => {
      return initScore + player.run;
    }, 0);
    return playerScores + this.team.run;
  }
}
