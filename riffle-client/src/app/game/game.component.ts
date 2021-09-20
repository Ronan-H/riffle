import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { Card, GameConstants, RiffleState, GameView, Player, RoundOptions } from '../../../../riffle-server/src/RiffleSchema';
import { ColyseusService } from '../colyseus.service';
import { NavbarService } from '../navbar/navbar.service';
import { ResourceService } from '../resource.service';
import { AnimtatedCard as AnimatedCard } from '../types/animated-card';

type MouseTouchEvent = MouseEvent & TouchEvent;

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('cardCanvas')
  cardCanvas: ElementRef<HTMLCanvasElement>;

  @ViewChild('handInfo')
  handInfo: ElementRef<HTMLCanvasElement>;

  public ctx: CanvasRenderingContext2D;
  private canvas: HTMLCanvasElement;
  private isMobile: boolean;

  // for drawing cards on the canvas, and to detect which card has been clicked on mouse down
  private cardRatio = 140 / 90;
  private cardsPerRow = 5;
  private cardGapRatio = 0.25;
  private cardWidth: number;
  private cardHeight: number;
  private cardGapHeight: number;
  private handStartY: number;

  public gameId: Observable<string>;
  public selectedCommonIndex;
  public selectedHandIndex;
  public state: RiffleState;
  public GameView = GameView;

  public GameConstants = GameConstants;
  private roundTimeInterval: any;
  private roundTimeDeltaMS = 50;

  public isNextRoundClicked: boolean;

  private removeGameViewChangedListener: Function;
  private animationInterval: any;

  private animatedCards: AnimatedCard[];
  private animationIntervalMS = 50;
  private cardSwapAnimationTimeMS = 2000;

  public optionsForm: FormGroup;

  public get selfPlayer(): Player {
    return this.state.players.get(this.colyseus.room.sessionId);
  }

  public get stateHandCards(): Card[] {
    return this.selfPlayer.cards;
  }

  public get playersAsArray(): Player[] {
    const arr = [];
    this.state.players.forEach((player) => arr.push(player));
    return arr;
  }

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public colyseus: ColyseusService,
    public resourceService: ResourceService,
    private navbarService: NavbarService,
    private fb: FormBuilder,
    ) { }

  public startGame(): void {
    this.colyseus.startGame();
  }

  @HostListener('window:resize')
  onResize() {
    this.autoAdjustCanvas();
    this.drawCards();
  }

  /**
   * Automatically adjust canvas size to fit nicely on the screen
   */
  private autoAdjustCanvas(): void {
    const spritesheetCardWidth = 140;
    const defaultWidth = spritesheetCardWidth * 3;
    const border = 5;

    const availableWidth = window.innerWidth - (border * 2);
    const availableHeight =
      window.innerHeight
      - this.canvas.offsetTop
      - this.handInfo.nativeElement.getBoundingClientRect().height
      - (border * 2);

    let chosenWidth: number;
    let chosenHeight: number;

    // try using all the available width
    chosenWidth = Math.min(availableWidth, defaultWidth);
    this.cardWidth = Math.round(chosenWidth / this.cardsPerRow);
    this.cardHeight = Math.round(this.cardWidth * this.cardRatio);
    this.cardGapHeight = this.cardHeight * this.cardGapRatio;
    chosenHeight = Math.floor((this.cardHeight * 2) + this.cardGapHeight);

    if (chosenHeight > availableHeight) {
      // canvas is too big for the height; scale to fill the height instead
      chosenHeight = availableHeight;
      this.cardHeight = Math.round(chosenHeight / (2 + this.cardGapRatio));
      this.cardWidth = Math.round(this.cardHeight / this.cardRatio);
      chosenWidth = this.cardWidth * this.cardsPerRow;
      this.cardGapHeight = chosenHeight - (this.cardHeight * 2);
    }

    this.handStartY = this.cardHeight + this.cardGapHeight;

    this.canvas.width = chosenWidth;
    this.canvas.height = chosenHeight;
  }

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

    this.optionsForm = this.fb.group({
      numRounds:  [GameConstants.defaultNumRounds],
    });

    this.optionsForm.valueChanges.subscribe((roundOptions: Partial<RoundOptions>) => {
      // enforce min/max round number as 1/100, if out of bounds
      if (roundOptions.numRounds !== null) {
        if (roundOptions.numRounds < 1) {
          this.optionsForm.controls['numRounds'].setValue(1, { emitEvent: false });
          roundOptions.numRounds = 1;
        }
        if (roundOptions.numRounds > 100) {
          this.optionsForm.controls['numRounds'].setValue(100, { emitEvent: false });
          roundOptions.numRounds = 100;
        }

        this.colyseus.updateRoundOptions(roundOptions);
      }
      else {
        this.colyseus.updateRoundOptions({
          numRounds: 1
        });
      }
    });

    this.animatedCards = [];
    this.animationInterval = setInterval(() => {
      this.animatedCards.forEach((animatedCard) => {
        animatedCard.update();
      });
      this.animatedCards = this.animatedCards.filter((animatedCard) => !animatedCard.isFinished);

      this.drawCards();
    }, this.animationInterval);

    // start with default state to prevent undefined errors before the state is downloaded initially
    this.state = new RiffleState();

    this.colyseus.room$.pipe(
      take(1)
    ).subscribe(room => {
      room.onStateChange((state: RiffleState) => {
        this.state = state;

        if (state.gameView === GameView.Swapping) {
          this.drawCards();
        }

        if (!this.selfPlayer.isHost) {
          this.optionsForm.controls['numRounds'].setValue(state.roundOptions.numRounds);
        }
      });

      this.removeGameViewChangedListener = (room.state as RiffleState).listen('gameView', (updatedGameView, prevGameView) => {
        console.log(`Game view changed from ${prevGameView} to ${updatedGameView}`);
        this.onGameViewChanged(updatedGameView);
      });

      room.onMessage('common-index-swapped', (commonIndex) => {
        if (this.selectedCommonIndex === commonIndex) {
          // deselect selected common card, since it was swapped out by someone else
          this.selectedCommonIndex = -1;
        }
      });
    });
  }

  ngOnDestroy() {
    if (this.removeGameViewChangedListener) this.removeGameViewChangedListener();
    clearInterval(this.animationInterval);
  }

  private onGameViewChanged(newGameView: GameView): void {
    switch (newGameView) {
      case GameView.Swapping:
        // reset
        this.selectedCommonIndex = -1;
        this.selectedHandIndex = -1;

        this.roundTimeInterval = setInterval(() => {
          this.state.roundTimeRemainingMS -= this.roundTimeDeltaMS;
          this.drawRoundProgressBar();
        }, this.roundTimeDeltaMS);

        // set navbar message
        this.navbarService.setMessage(`Round ${this.state.roundNum} of ${this.state.roundOptions.numRounds}`);
        break;
      case GameView.Showdown:
        // reset
        this.isNextRoundClicked = false;

        // set navbar message
        this.navbarService.setMessage('Showdown!');

        clearInterval(this.roundTimeInterval);
        break;
    }
  }

  ngAfterViewInit() {
    this.initCanvas();
  }

  private initCanvas(): void {
    this.canvas = this.cardCanvas.nativeElement;
    this.ctx = this.cardCanvas.nativeElement.getContext('2d');

    this.autoAdjustCanvas();

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
              this.onCommonCardClicked(cardIndex);
            }
            else {
              // hand card clicked
              this.onHandCardClicked(cardIndex);
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
    // TODO fix this antipattern
    if (this.state.gameView !== GameView.Swapping) {
      return;
    }

    // clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // redraw round progress bar
    this.drawRoundProgressBar();

    const spritesheet = this.resourceService.spritesheet;
    this.state.commonCards.forEach((card, index) => {
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
      this.ctx.strokeStyle = '#0000BB';
      this.ctx.lineWidth = 3;
      this.ctx.beginPath();
      this.ctx.rect(offsetX, 0, this.cardWidth, this.cardHeight);
      this.ctx.stroke();
    }

    this.stateHandCards.forEach((card, index) => {
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
      this.ctx.strokeStyle = '#0000BB';
      this.ctx.lineWidth = 3;
      this.ctx.beginPath();
      this.ctx.rect(offsetX, this.handStartY, this.cardWidth, this.cardHeight);
      this.ctx.stroke();
    }

    // draw card swap animations (if any)
    this.animatedCards.forEach((animatedCard) => {
      const metadata = this.resourceService.getCardSpritesheetMedata(animatedCard.card);
      this.ctx.drawImage(
        spritesheet,
        metadata.x,
        metadata.y,
        metadata.width,
        metadata.height,
        animatedCard.roundX,
        animatedCard.roundY,
        this.cardWidth,
        this.cardHeight
      );
    });
  }

  private drawRoundProgressBar(): void {
    const roundProgress = this.state.roundTimeRemainingMS / GameConstants.roundTimeMS;
    const barWidth = this.canvas.width * roundProgress;

    // calculate progress bar RGB (changes from green to red over time)
    const compMax = 180;
    const compLimit = 1200;
    const exponent = 12;
    const exponentMax = Math.pow(2, exponent);

    let red = Math.floor(Math.pow(2, (1 - roundProgress) * exponent) / exponentMax * compLimit);

    if (red < 0) red = 0;
    if (red > compMax) red = compMax;

    let green = compMax - red;

    const redString = red < 16 ? '0' + red.toString(16) : red.toString(16);
    const greenString = green < 16 ? '0' + green.toString(16) : green.toString(16);

    this.ctx.fillStyle = `#${redString}${greenString}00`;

    this.ctx.clearRect(0, this.cardHeight, this.canvas.width, this.cardGapHeight);
    this.ctx.fillRect(0, this.cardHeight, barWidth, this.cardGapHeight);
  }

  public onCommonCardClicked(index: number): void {
    if (this.selectedCommonIndex === index) {
      this.selectedCommonIndex = -1;
    }
    else {
      this.selectedCommonIndex = index;
      this.swapIfBothSelected();
    }
  }

  public onHandCardClicked(index: number): void {
    if (this.selectedCommonIndex === -1) {
      this.sortHand();
      return;
    }

    if (this.selectedHandIndex === index) {
      this.selectedHandIndex = -1;
    }
    else {
      this.selectedHandIndex = index;
      this.swapIfBothSelected();
    }
  }

  private swapIfBothSelected(): void {
    if (this.selectedCommonIndex !== -1 && this.selectedHandIndex !== -1) {
      // animated common card -> hand card
      this.animatedCards.push(new AnimatedCard(
        this.state.commonCards[this.selectedCommonIndex],
        this.selectedCommonIndex * this.cardWidth,
        0,
        this.selectedHandIndex * this.cardWidth,
        this.handStartY,
        this.cardSwapAnimationTimeMS / this.animationIntervalMS,
      ));

      this.colyseus.swapCards(this.selectedCommonIndex, this.selectedHandIndex);
      this.deselectAllCards();
    }
  }

  private deselectAllCards(): void {
    this.selectedCommonIndex = -1;
    this.selectedHandIndex = -1;
  }

  public onNextRoundClicked(): void {
    this.isNextRoundClicked = true;
    this.colyseus.room.send('next-round-vote');
  }

  public onReturnToLobbyClicked(): void {
    this.colyseus.leaveGame();
    this.router.navigate(['']);
  }

  public sortHand(): void {
    this.colyseus.sortHand();
  }

  public onOptionsInputFocusOut(): void {
    if (this.optionsForm.controls['numRounds'].value === null) {
      this.optionsForm.controls['numRounds'].setValue(1);
    }
  }
}
