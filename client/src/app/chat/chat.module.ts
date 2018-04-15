import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MaterialModule } from '../shared/material/material.module';

import { ChatComponent } from './chat.component';
import { SocketService } from './shared/services/socket.service';
import { DialogUserComponent } from './dialog-user/dialog-user.component';
import { ChatRoomsComponent } from './chat-rooms/chat-rooms.component';
import { CreateChatRoomComponent } from './chat-rooms/create-chat-room/create-chat-room.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { ConversationService } from './shared/services/conversations/conversation.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    NgSelectModule
  ],
  declarations: [ChatComponent, DialogUserComponent, ChatRoomsComponent, CreateChatRoomComponent],
  providers: [SocketService, ConversationService],
  entryComponents: [DialogUserComponent, CreateChatRoomComponent]
})
export class ChatModule { }
