import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @Input('numberOfPendingMessages') numberOfPendingMessages: number;

  pressed: number = -1;

  @Output('pressedTimes') numberOfTimesButtonPressed: EventEmitter<any> = new EventEmitter();

  constructor() {
    this.numberOfTimesButtonPressed.emit(this.pressed);
  }

  ngOnInit(): void {
  }

  buttonPressed(){
    this.pressed+=1;
    this.numberOfTimesButtonPressed.emit(this.pressed);
  }

}
