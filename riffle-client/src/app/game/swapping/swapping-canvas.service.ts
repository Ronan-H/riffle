import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CardClickEvent } from 'src/app/types/card-click-event';

@Injectable({
  providedIn: 'root'
})
export class SwappingCanvasService {
  public selectedCommonIndex: BehaviorSubject<number>;
  public selectedHandIndex: BehaviorSubject<number>;

  public commonCardClicked: BehaviorSubject<CardClickEvent>;
  public handCardClicked: BehaviorSubject<CardClickEvent>;

  public animateCard: EventEmitter<void>;

  constructor() {
    this.selectedCommonIndex = new BehaviorSubject(-1);
    this.selectedHandIndex = new BehaviorSubject(-1);

    this.commonCardClicked = new BehaviorSubject({
      prevIndex: -1,
      newIndex: -1,
    });
    this.handCardClicked = new BehaviorSubject({
      prevIndex: -1,
      newIndex: -1,
    });

    this.animateCard = new EventEmitter();
  }

  public onCommonCardClicked(index: number) {
    const oldIndex = this.selectedCommonIndex.getValue();
    this.selectedCommonIndex.next(index);

    this.commonCardClicked.next({
      prevIndex: oldIndex,
      newIndex: index,
    });
  }

  public onHandCardClicked(index: number) {
    const oldIndex = this.selectedHandIndex.getValue();
    this.selectedHandIndex.next(index);

    this.handCardClicked.next({
      prevIndex: oldIndex,
      newIndex: index,
    });
  }

  public deselectAllCards() {
    this.selectedCommonIndex.next(-1);
    this.selectedHandIndex.next(-1);
  }

  public triggerCardAnimation() {
    this.animateCard.emit();
  }

}
