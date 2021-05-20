import { AfterContentChecked, AfterViewChecked, AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { Card, GameConstants, RiffleState, GameView, ShowdownResult, Player } from '../../../../riffle-server/src/RiffleSchema';
import { ColyseusService } from '../colyseus.service';
import { ResourceService } from '../resource.service';

type MouseTouchEvent = MouseEvent & TouchEvent;

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit, AfterViewInit {
  @ViewChild('cardCanvas')
  myCanvas: ElementRef<HTMLCanvasElement>;

  public ctx: CanvasRenderingContext2D;
  private canvas: HTMLCanvasElement;
  private isMobile: boolean;

  // for drawing cards on the canvas, and to detect which card has been clicked on mouse down
  private cardWidth = 100;
  private cardHeight = 135;
  private handStartY = this.cardHeight * 2;

  public gameId: Observable<string>;
  public commonCards: Card[];
  public handCards: Card[];
  public selectedCommonIndex;
  public selectedHandIndex;
  public GameView = GameView;
  public gameView: GameView;

  public GameConstants = GameConstants;
  public roundTimeRemainingMS: number;
  private roundTimeInterval: any;
  private roundTimeDeltaMS = 200;

  public showdownResults: ShowdownResult[];
  public showdownWinner: Player;
  public isNextRoundClicked: boolean;
  public numVotedNextRound: number;
  public nextRoundVotesRequired: number;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private colyseus: ColyseusService,
    public resourceService: ResourceService,
  ) { }

  ngOnInit(): void {
    // from https://stackoverflow.com/a/3540295
    // detect if this is a touch device or not
    if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) 
        || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) { 
        this.isMobile = true;
    }

    if (this.colyseus.room === undefined) {
      // no handle on this game; redirect to the lobby
      this.router.navigate(['lobby']);
    }

    this.gameId = this.route.params.pipe(
      map((params => params['id'])),
    );

    this.colyseus.room$.pipe(take(1)).subscribe(room => {
      room.onStateChange((state: RiffleState) => {
        this.gameView = state.gameView;
        this.commonCards = state.commonCards;
        this.handCards = state.players.get(room.sessionId).cards;

        this.showdownResults = state.showdownResults;
        this.showdownWinner = state.showdownWinner;
        this.numVotedNextRound = state.numVotedNextRound;
        this.nextRoundVotesRequired = state.nextRoundVotesRequired;

        this.drawCards();
      });

      room.onMessage('game-view-changed', (newGameView: GameView) => {
        switch (newGameView) {
          case GameView.Swapping:
            // reset
            this.selectedCommonIndex = -1;
            this.selectedHandIndex = -1;

            // start the round timer
            this.roundTimeRemainingMS = GameConstants.roundTimeMS;

            this.roundTimeInterval = setInterval(() => {
              this.roundTimeRemainingMS -= this.roundTimeDeltaMS;
            }, this.roundTimeDeltaMS);
            break;
          case GameView.Showdown:
            // reset
            this.isNextRoundClicked = false;

            clearInterval(this.roundTimeInterval);
            break;
        }
      });
    });
  }

  ngAfterViewInit() {
    this.initCanvas();
  }

  private initCanvas(): void {
    this.canvas = this.myCanvas.nativeElement;
    this.ctx = this.myCanvas.nativeElement.getContext('2d');

    // register mouse event listeners
    this.canvas.addEventListener('mousedown', e => {
      this.onMouseEvent('mousedown', e as MouseTouchEvent);
    });
    this.canvas.addEventListener('mouseup', e => {
      this.onMouseEvent('mouseup', e as MouseTouchEvent);
    });
    this.canvas.addEventListener('mousemove', e => {
      this.onMouseEvent('mousemove', e as MouseTouchEvent);
    });
    this.canvas.addEventListener('mouseout', e => {
      this.onMouseEvent('mouseout', e as MouseTouchEvent);
    });

    // register event listeners for touch devices
    this.canvas.addEventListener('touchstart', e => {
      this.onMouseEvent('touchstart', e as MouseTouchEvent);
    });
    this.canvas.addEventListener('touchend', e => {
      this.onMouseEvent('touchend', e as MouseTouchEvent);
    });
    this.canvas.addEventListener('touchmove', e => {
      this.onMouseEvent('touchmove', e as MouseTouchEvent);
    });
    this.canvas.addEventListener('touchcancel', e => {
        this.onMouseEvent('touchcancel', e as MouseTouchEvent);
    });
  }

  private onMouseEvent(action, e: MouseTouchEvent): void {
    if (this.isMobile) {
        // prevent back/forward swipes etc. in the browser on mobile devices
        e.preventDefault();
    }
    
    // extract mouse position based on event vars
    // (different on mobile devices)
    // TODO: extract this outside this function
    let cursorX: number;
    let cursorY: number;
    if (this.isMobile) {
      cursorX = e.touches[0].clientX - this.canvas.getBoundingClientRect().left;
      cursorY = e.touches[0].clientY - this.canvas.getBoundingClientRect().top;
    }
    else {
      cursorX = e.clientX - this.canvas.getBoundingClientRect().left;
      cursorY = e.clientY - this.canvas.getBoundingClientRect().top;
    }

    switch (action) {
        case 'mousedown':
        case 'touchstart':
          // card select detection
          const cardIndex = Math.floor(cursorX / this.cardWidth);
          const commonCardClicked = cursorY < this.cardHeight;
          const handCardClicked = cursorY > this.handStartY;
          const anyCardClicked = commonCardClicked || handCardClicked;

          if (anyCardClicked) {
            if (commonCardClicked) {
              this.selectCommonCard(cardIndex);
            }
            else {
              // hand card clicked
              this.selectHandCard(cardIndex);
            }
          }
          else {
            // empty area clicke
            this.deselectAllCards();
          }
          
          // re-draw cards to render the card(s) highlight
          this.drawCards();
          break;
        case 'mouseup':
        case 'touchend':
        case 'mouseout':
            //
            break;
        case 'mousemove':
        case 'touchmove':
            //
            break;
    }
  }

  private drawCards(): void {
    // clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    const spritesheet = this.resourceService.spritesheet;
    this.commonCards.forEach((card, index) => {
      const metadata = this.resourceService.getCardSpritesheetMedata(card);
      const offsetX = this.cardWidth * index;
      const offsetY = 0;
      this.ctx.drawImage(
        spritesheet,
        metadata.x,
        metadata.y,
        metadata.width,
        metadata.height,
        offsetX,
        offsetY,
        this.cardWidth,
        this.cardHeight
      );
    });

    if (this.selectedCommonIndex !== -1) {
      // highlight this card as being selected
      const offsetX = this.cardWidth * this.selectedCommonIndex;
      this.ctx.strokeStyle = '#00BB00';
      this.ctx.lineWidth = 3;
      this.ctx.beginPath();
      this.ctx.rect(offsetX, 0, this.cardWidth, this.cardHeight);
      this.ctx.stroke();
    }

    this.handCards.forEach((card, index) => {
      const metadata = this.resourceService.getCardSpritesheetMedata(card);
      const offsetX = this.cardWidth * index;
      const offsetY = this.handStartY;
      this.ctx.drawImage(
        spritesheet,
        metadata.x,
        metadata.y,
        metadata.width,
        metadata.height,
        offsetX,
        offsetY,
        this.cardWidth,
        this.cardHeight
      );
    });

    if (this.selectedHandIndex !== -1) {
      // highlight this card as being selected
      const offsetX = this.cardWidth * this.selectedHandIndex;
      this.ctx.strokeStyle = '#00BB00';
      this.ctx.lineWidth = 3;
      this.ctx.beginPath();
      this.ctx.rect(offsetX, this.handStartY, this.cardWidth, this.cardHeight);
      this.ctx.stroke();
    }
  }

  public selectCommonCard(index: number): void {
    if (this.selectedCommonIndex === index) {
      this.selectedCommonIndex = -1;
    }
    else {
      this.selectedCommonIndex = index;
      this.swapIfBothSelected();
    }
  }

  public selectHandCard(index: number): void {
    if (this.selectedHandIndex === index) {
      this.selectedHandIndex = -1;
    }
    else {
      this.selectedHandIndex = index;
      this.swapIfBothSelected();
    }
  }

  private deselectAllCards(): void {
    this.selectedCommonIndex = -1;
    this.selectedHandIndex = -1;
  }

  private swapIfBothSelected(): void {
    if (this.selectedCommonIndex !== -1 && this.selectedHandIndex !== -1) {
      this.colyseus.swapCards(this.selectedCommonIndex, this.selectedHandIndex);

      this.selectedCommonIndex = -1;
      this.selectedHandIndex = -1;
    }
  }

  public onNextRoundClicked(): void {
    this.isNextRoundClicked = true;
    this.colyseus.room.send('next-round-vote');
  }
}
