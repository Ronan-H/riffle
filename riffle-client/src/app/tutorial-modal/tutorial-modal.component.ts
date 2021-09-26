import { AfterViewInit, Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-tutorial-modal',
  templateUrl: './tutorial-modal.component.html',
  styleUrls: ['./tutorial-modal.component.css']
})
export class TutorialModalComponent implements AfterViewInit {

  constructor(
    public modal: NgbActiveModal,
  ) { }

  ngAfterViewInit() {
    setTimeout(() => {
      document.getElementById('tutorial-heading').scrollIntoView()
    }, 50);
  }

}
