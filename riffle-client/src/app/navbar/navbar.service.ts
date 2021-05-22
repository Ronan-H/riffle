import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavbarService {
  public navbarMessage: BehaviorSubject<string>;

  constructor() {
    this.navbarMessage = new BehaviorSubject('');
  }

  public setMessage(message: string): void {
    this.navbarMessage.next(` - ${message}`);
  }

  public clearMessage(): void {
    this.navbarMessage.next('');
  }
}
