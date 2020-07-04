import {Component, Input, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {newArray} from "@angular/compiler/src/util";
import {last} from "rxjs/operators";

export interface sendingMessagesToUser {
  id: number,
  mssg: string
}

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  messageUrl: string = 'http://localhost:4201/messages';
  usersUrl: string = 'http://localhost:4201/users';
  posOfDisplay: number[];
  visible: number[];
  numberOfPendingMessages: number = 0;
  screenWidth: number;
  pendingMessages: sendingMessagesToUser[] = [];
  usersList;
  messageList;
  lastMessage: string[];

  constructor(private http: HttpClient) {
    this.screenWidth = window.innerWidth;
    const options = {
      headers: {'Content-Type': 'text/plain'},
    };

    this.http.get(this.messageUrl,options).subscribe(res=>{
      this.messageList = res;
    });

    this.http.get(this.usersUrl,options).subscribe(res=>{
      this.usersList = res;
      this.posOfDisplay = newArray<number>(this.usersList.length);
      this.visible = newArray<number>(this.usersList.length);
      this.lastMessage = newArray<string>(this.usersList.length);
      for(let i=0;i<this.posOfDisplay.length;i++){
        this.posOfDisplay[i] = -1;
        this.visible[i] = 0;
        this.lastMessage[i] = '';
      }
    });
  }

  ngOnInit(): void { }

  getWidth(val){
    this.screenWidth = val.target.innerWidth;
    this.buttonPressed();
    for(let i=0;i<this.visible.length;i--){
      if(this.visible[i]==1){
        this.visible[i] = 0;
        return;
      }
    }
    this.isVisible();
  }

  getPendingMsg(event){
    this.pendingMessages.push(event);
  }

  isVisible(){
    let maxPos = 0;
    for(let i=this.posOfDisplay.length-1;i>-1;i--){
      if(this.visible[i]){
        if(maxPos+300<this.screenWidth){
          this.posOfDisplay[i] = maxPos;
          maxPos+=300;
        }
      }
    }
  }

  buttonPressed(){
    for(let i=0;i<this.visible.length;i++){
      if(this.visible[i]==0){
        this.visible[i] = 1;
        break;
      }
    }
    this.isVisible();
  }

  getLastMess(event,userid){
    this.lastMessage[userid] = event;
  }

  getLastMessage(userid: number){
    if(this.lastMessage[userid]=='' || this.lastMessage[userid]==undefined) {
      for (let i = this.messageList.length - 1; i > -1; i--) {
        if (this.messageList[i].user_id == userid) {
          return this.messageList[i].message;
        }
      }
    }
    return this.lastMessage[userid];
  }
}
