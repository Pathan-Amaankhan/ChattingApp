import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-chat-box',
  templateUrl: './chat-box.component.html',
  styleUrls: ['./chat-box.component.css']
})
export class ChatBoxComponent implements OnInit {
  @Input('positionOfDisplay') posOfDisplay: number;
  @Input('nameOfBot') nameOfBot: string;
  @Input('id') id: number;
  @Input('pendingMessages') pendingMessages;
  @Input('MainURL') MainUrl: string;

  sendMessageUrl = `${this.MainUrl}/sendMessage`;
  getUserMessageUrl = `${this.MainUrl}/messageOfUser?id=`;
  getUserImageUrl = `${this.MainUrl}/getImage?id=`;
  messageList: any = [];
  userList: any = [];

  @Output('pendingMsg') pendingMsg: EventEmitter<any> = new EventEmitter<any>();
  @Output('isClosed') isClosed: EventEmitter<number> = new EventEmitter<number>();
  @Output('isSend') isSend: EventEmitter<boolean> = new EventEmitter<boolean>(false);
  @Output('numberOfMessagesUnsent') numberOfMessagesUnsent: EventEmitter<number>  = new EventEmitter<number>();
  @Output('lastMessage') lastMessage: EventEmitter<string> = new EventEmitter<string>();

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
      for(let i=0;i<this.pendingMessages.length;i++){
        if(this.id==this.pendingMessages[i].id){
          this.sendMessage(this.pendingMessages[i].mssg);
        }
      }

      this.http.get(this.getUserMessageUrl.concat(String(this.id))).subscribe(res => {
        this.messageList = res;
        this.messageList = this.messageList.slice(this.messageList.length-10,this.messageList.length);
        this.lastMessage.emit(this.messageList[this.messageList.length-1].message);
      }, error =>{
        console.log('Server Not Found');
      });

      this.http.get(this.getUserImageUrl.concat(String(this.id))).subscribe(res => {
        this.userList = res;
      }, error => {
        console.log('Server Not Found');
      });
  }

  parseISOString(s) {
    try{
      let b = s.split(/\D+/);
      return new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5], b[6]));
    } catch (e) {
      console.log('No Database');
      return 'No Database';
    }
  }

  getDateInHumanReadableFormat(inpDate) {
    if (inpDate != 'No Database') {
      let diffInMinutes = (((new Date()).getTime() - inpDate.getTime()) / 60000);
      if (diffInMinutes < 1) {
        return '* a moment ago';
      }
      if (diffInMinutes < 10) {
        return '* few minutes ago';
      }
      if (diffInMinutes < 60) {
        return '* half an hour ago';
      }
      if (diffInMinutes < 1440) {
        return '* few hours ago';
      }
      if (diffInMinutes < 2880) {
        return '* a day ago';
      }
      if (diffInMinutes < 43800) {
        return '* few days ago';
      }
      if (diffInMinutes < 87600) {
        return '* a month ago';
      }
      return '* few months ago';
    }
    return '* will be added latter';
  }


  closeMe(){
    this.isClosed.emit(0);
  }

  getUserImage(){
    try{
      return this.userList[0].image;
    } catch (e) {
      return 'none';
    }
  }

  sendMessage(msg: string, msgBox?){
    const options = {
      headers: {'Content-Type': 'application/json'},
      reportProgress: true
    };

    const data = { id: this.id, message: msg };

    if(msg.length > 0){
      let response;
      this.http.post(this.sendMessageUrl, JSON.stringify(data), options).subscribe(res => {
        response = res;
        response = response.slice(response.length-10,response.length);
      }, error => {
        let flag = true;
        for(let i=0;i<this.pendingMessages.length;i++){
          if(this.pendingMessages[i].id==this.id && this.pendingMessages[i].mssg==msg){
            flag = false;
            break;
          }
        }
        if(flag){
          this.pendingMsg.emit({id: this.id, mssg: msg});
          this.numberOfMessagesUnsent.emit(this.pendingMessages.length);
        }
        this.messageList.push({userid:this.id, message: msg});
        try{
          msgBox.value = '';
        } catch (e) {
          console.log('no Input Found');
        }
        this.lastMessage.emit(this.messageList[this.messageList.length-1].message);
      }, () => {
        this.isSend.emit(true);
        this.messageList = response;
        try{
          msgBox.value = '';
        } catch (e) {
          for(let i=0;i<this.pendingMessages.length;i++){
            if(this.pendingMessages[i].id==this.id && this.pendingMessages[i].mssg==msg){
              this.pendingMessages.splice(i,1);
              this.numberOfMessagesUnsent.emit(this.pendingMessages.length);
              break;
            }
          }
        }
        this.lastMessage.emit(this.messageList[this.messageList.length-1].message);
      });
    }
  }
}






