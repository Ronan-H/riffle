import { AfterViewInit, Component, ElementRef, HostListener, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { take } from 'rxjs/operators';
import { ColyseusService } from 'src/app/colyseus.service';
import { ResourceService } from 'src/app/resource.service';
import { Card, GameConstants, Player, RiffleState } from '../../../../../../riffle-server/src/RiffleSchema';
import { AnimatedCard } from '../../../types/animated-card';
import { ArraySchema } from '@colyseus/schema';
import { SwappingCanvasService } from '../swapping-canvas.service';
import { Subscription } from 'rxjs';

type MouseTouchEvent = MouseEvent & TouchEvent;

@Component({
  selector: 'app-swapping-canvas',
  templateUrl: './swapping-canvas.component.html',
  styleUrls: ['./swapping-canvas.component.css']
})
export class SwappingCanvasComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input()
  public state: RiffleState;

  @ViewChild('cardCanvas')
  cardCanvas: ElementRef<HTMLCanvasElement>;

  public ctx: CanvasRenderingContext2D;
  private canvas: HTMLCanvasElement;
  private isMobile: boolean;

  // for drawing cards on the canvas, and to detect which card has been clicked on mouse down
  private cardRatio = 140 / 90;
  private cardsPerRow = 5;
  private cardGapRatio = 0.15;
  private cardWidth: number;
  private cardHeight: number;
  private cardGapHeight: number;
  private handStartY: number;

  private roundTimeInterval: any;
  private roundTimeDeltaMS = 50;
  private roundStartMS: number;

  private animationInterval: any;

  private animatedCards: AnimatedCard[];
  private animationIntervalMS = 50;
  private cardSwapAnimationTimeMS = 2000;

  private subs: Subscription;

  public get selfPlayer(): Player {
    return this.state.players.get(this.colyseus.room.sessionId);
  }

  public get stateHandCards(): ArraySchema<Card> {
    return this.selfPlayer.cards;
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

  @HostListener('window:resize')
  onResize() {
    this.autoAdjustCanvas();
    this.drawAll();
  }

  constructor(
    public colyseus: ColyseusService,
    public resourceService: ResourceService,
    private swapService: SwappingCanvasService,
  ) { }

  ngOnInit(): void {
    this.colyseus.room$.subscribe(room => {
      this.state = room.state;
      room.onStateChange((state: RiffleState) => {
        this.state = state;
        this.drawAll();
      });
    });

    this.subs = new Subscription();

    this.animatedCards = [];
    // add card animation when triggered by swapping component
    this.subs.add(
      this.swapService.animateCard.subscribe(() => {
        this.animatedCards.push(new AnimatedCard(
          this.state.commonCards[this.selectedCommonIndex],
          this.selectedCommonIndex * this.cardWidth,
          0,
          this.selectedHandIndex * this.cardWidth,
          this.handStartY,
          this.cardSwapAnimationTimeMS / this.animationIntervalMS,
        ));
      })
    );

    this.subs.add(
      this.swapService.selectedCommonIndex.subscribe(this.drawAll)
    );
    this.subs.add(
      this.swapService.selectedHandIndex.subscribe(this.drawAll)
    );
    
    this.isMobile = this.isMobileTest();

    this.roundStartMS = Date.now();
    this.roundTimeInterval = setInterval(() => {
      this.drawRoundProgressBar();
    }, this.roundTimeDeltaMS);

    this.animationInterval = setInterval(() => {
      this.animatedCards.forEach((animatedCard) => {
        animatedCard.update();
      });
      this.animatedCards = this.animatedCards.filter((animatedCard) => !animatedCard.isFinished);

      this.drawAll();
    }, this.animationInterval);
  }

  ngAfterViewInit() {
    this.initCanvas();
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
      // TODO factor in handInfo into this calculation again
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

  private initCanvas(): void {
    this.canvas = this.cardCanvas.nativeElement;
    this.ctx = this.cardCanvas.nativeElement.getContext('2d');

    this.autoAdjustCanvas();

    // register mouse event listeners
    [
      'mousedown',
      'mouseup',
      'mousemove',
      'mouseout',
      // touch devices
      'touchstart',
      'touchend',
      'touchmove',
      'touchcancel',
    ]
      .forEach(event => {
        this.canvas.addEventListener(event, e => {
          this.onMouseEvent(event, e as MouseTouchEvent);
        });
      });
  }

  // extract mouse position based on event vars
  // (different on mobile devices)
  private extractMousePosition(event: MouseTouchEvent) {
    if (this.isMobile) {
      return [
        event.touches[0].clientX - this.canvas.getBoundingClientRect().left,
        event.touches[0].clientY - this.canvas.getBoundingClientRect().top
      ];
    }
    else {
      return [
        event.clientX - this.canvas.getBoundingClientRect().left,
        event.clientY - this.canvas.getBoundingClientRect().top
      ];
    }
  }

  private onMouseEvent(action: string, event: MouseTouchEvent): void {
    // prevent back/forward swipes etc.
    event.preventDefault();
    
    const [cursorX, cursorY] = this.extractMousePosition(event);

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
              // common card clicked
              this.swapService.onCommonCardClicked(cardIndex);
            }
            else {
              // hand card clicked
              this.swapService.onHandCardClicked(cardIndex);
            }
          }
          else {
            // empty area click
            this.selectedCommonIndex = -1;
          }
          
          // re-draw to render the card(s) highlight
          this.drawAll();
          break;
    }
  }

  private drawAll(): void {
    if (!this.ctx) {
      // canvas hasn't been initialised yet
      return;
    }

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawRoundProgressBar();
    this.drawCards(this.state.commonCards, 0);
    this.drawCards(this.stateHandCards, this.handStartY);

    if (this.swapService.selectedCommonIndex.getValue() !== -1) {
      this.drawCommonCardHighlight(this.selectedCommonIndex);
    }

    this.drawCardSwapAnimations();
  }

  private drawCards(cards: ArraySchema<Card>, offsetY: number): void {
    cards.forEach((card, index) => {
      const metadata = this.resourceService.getCardSpritesheetMedata(card);
      const offsetX = this.cardWidth * index;
      this.ctx.drawImage(
        this.resourceService.spritesheet,
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
  }


  private drawCommonCardHighlight(index: number) {
    const offsetX = this.cardWidth * index;
    this.ctx.strokeStyle = '#0000BB';
    this.ctx.lineWidth = 3;
    this.ctx.beginPath();
    this.ctx.rect(offsetX, 0, this.cardWidth, this.cardHeight);
    this.ctx.stroke();
  }

  private drawCardSwapAnimations(): void {
    this.animatedCards.forEach((animatedCard) => {
      const metadata = this.resourceService.getCardSpritesheetMedata(animatedCard.card);
      this.ctx.drawImage(
        this.resourceService.spritesheet,
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
    // 1 = round start,
    // 0 = round end
    const roundProgress = 1 - Math.min(
      (Date.now() - this.roundStartMS) / GameConstants.roundTimeMS,
      1
    );
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

  ngOnDestroy() {
    clearInterval(this.animationInterval);
    clearInterval(this.roundTimeInterval);
    this.subs.unsubscribe();
  }

  // from https://stackoverflow.com/a/3540295
  // detect if this is a touch device or not
  private isMobileTest(): boolean {
    return /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) 
    || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4));
  }

}
