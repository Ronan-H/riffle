import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ArraySchema } from '@colyseus/schema';
import { Subscription } from 'rxjs';
import { skip, take } from 'rxjs/operators';
import { ColyseusService } from 'src/app/colyseus.service';
import { NavbarService } from 'src/app/navbar/navbar.service';
import { ResourceService } from 'src/app/resource.service';
import { Card, Player, RiffleState } from '../../../../../riffle-server/src/RiffleSchema';
import { SwappingCanvasService } from './swapping-canvas.service';

@Component({
  selector: 'app-swapping',
  templateUrl: './swapping.component.html',
  styleUrls: ['./swapping.component.css']
})
export class SwappingComponent implements OnInit, OnDestroy {
  @Input()
  public state: RiffleState;

  public get selfPlayer(): Player {
    return this.state.players.get(this.colyseus.room.sessionId);
  }

  public get selectedCommonIndex(): number {
    return this.swapService.selectedCommonIndex.getValue();
  }

  public set selectedCommonIndex(index: number) {
    this.swapService.selectedCommonIndex.next(index);
  }

  public get selectedHandIndex(): number {
    return this.swapService.selectedHandIndex.getValue();
  }

  public set selectedHandIndex(index: number) {
    this.swapService.selectedHandIndex.next(index);
  }

  private subs: Subscription;

  constructor(
    public colyseus: ColyseusService,
    public resourceService: ResourceService,
    private navbarService: NavbarService,
    private swapService: SwappingCanvasService,
  ) { }

  ngOnInit(): void {
    this.colyseus.room$.pipe(
      take(1)
    ).subscribe(room => {
      room.onStateChange((state: RiffleState) => {
        this.state = state;
      });

      room.onMessage('common-index-swapped', (commonIndex) => {
        if (this.selectedCommonIndex === commonIndex) {
          // deselect selected common card, since it was swapped out by someone else
          this.selectedCommonIndex = -1;
        }
      });
    });

    this.subs = new Subscription();
    this.subs.add(
      this.swapService.commonCardClicked.pipe(skip(1)).subscribe(({prevIndex, newIndex}) => {
        if (newIndex === prevIndex) {
          this.selectedCommonIndex = -1;
        }
      })
    );
    this.subs.add(
      this.swapService.handCardClicked.pipe(skip(1)).subscribe(() => {
        if (this.selectedCommonIndex === -1) {
          this.sortHand();
        }
        {
          this.swapIfBothSelected();
        }
      })
    );

    this.swapService.deselectAllCards();
    this.navbarService.setMessage(`Round ${this.state.roundNum} of ${this.state.roundOptions.numRounds}`);
  }

  private swapIfBothSelected(): void {
    if (this.selectedCommonIndex !== -1 && this.selectedHandIndex !== -1) {
      // animated common card -> hand card
      this.swapService.triggerCardAnimation();

      this.colyseus.swapCards(this.selectedCommonIndex, this.selectedHandIndex);
      this.swapService.deselectAllCards();
    }
  }

  public sortHand(): void {
    this.colyseus.sortHand();
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

}
