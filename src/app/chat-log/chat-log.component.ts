import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-chat-log',
  templateUrl: './chat-log.component.html',
  styleUrls: ['./chat-log.component.css']
})
export class ChatLogComponent implements OnInit {
  @Input('image') img: string;
  @Input('name') name: string;
  @Input('lastMessage') lastMessage: string;
  constructor() { }

  checkLastMessage(){
    if(this.lastMessage.split(' ').length>4){
      this.lastMessage = (this.lastMessage.split(' ').slice(0,4)).join(' ').concat('...');
    }
    return this.lastMessage;
  }

  ngOnInit(): void { }

}
