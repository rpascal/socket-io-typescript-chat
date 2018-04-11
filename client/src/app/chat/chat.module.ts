import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MaterialModule } from '../shared/material/material.module';

import { ChatComponent } from './chat.component';
import { SocketService } from './shared/services/socket.service';
import { DialogUserComponent } from './dialog-user/dialog-user.component';
import { ChatRoomsComponent } from './chat-rooms/chat-rooms.component';
import { CreateChatRoomComponent } from './chat-rooms/create-chat-room/create-chat-room.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  declarations: [ChatComponent, DialogUserComponent, ChatRoomsComponent, CreateChatRoomComponent],
  providers: [SocketService],
  entryComponents: [DialogUserComponent, CreateChatRoomComponent]
})
export class ChatModule { }
