import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ColyseusService } from 'src/app/colyseus.service';
import { NavbarService } from 'src/app/navbar/navbar.service';
import { ResourceService } from 'src/app/resource.service';
import { GameConstants, Player, RiffleState } from '../../../../../riffle-server/src/RiffleSchema';

@Component({
  selector: 'app-showdown',
  templateUrl: './showdown.component.html',
  styleUrls: ['./showdown.component.css']
})
export class ShowdownComponent implements OnInit {
  public GameConstants = GameConstants;

  public isNextRoundClicked: boolean;

  public get selfPlayer(): Player {
    return this.colyseus.state.players.get(this.colyseus.room.sessionId);
  }

  constructor(
    private router: Router,
    public colyseus: ColyseusService,
    public resourceService: ResourceService,
    private navbarService: NavbarService,
  ) { }

  ngOnInit(): void {
    this.isNextRoundClicked = false;
  }

  public onNextRoundClicked(): void {
    this.isNextRoundClicked = true;
    this.colyseus.room.send('next-round-vote');
  }

  public onReturnToLobbyClicked(): void {
    this.colyseus.leaveGame();
    this.router.navigate(['']);
  }
}
