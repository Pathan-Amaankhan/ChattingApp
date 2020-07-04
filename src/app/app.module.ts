import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { ChatLogComponent } from './chat-log/chat-log.component';
import { ChatBoxComponent } from './chat-box/chat-box.component';
import {FormsModule} from "@angular/forms";
import { MainComponent } from './main/main.component';
import {HttpClientModule} from "@angular/common/http";

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ChatLogComponent,
    ChatBoxComponent,
    MainComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
