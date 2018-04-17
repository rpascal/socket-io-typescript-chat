import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MaterialModule } from '../shared/material/material.module';

import { ChatComponent } from './chat.component';
import { ChatService } from './shared/services/chat.service';
import { ChatRoomsComponent } from './chat-rooms/chat-rooms.component';
import { CreateChatRoomComponent } from './chat-rooms/create-chat-room/create-chat-room.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { ConversationService } from './shared/services/conversations/conversation.service';
import { SharedModule } from '../shared/shared.module';
import { ChatSettingsComponent } from './chat-settings/chat-settings.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    NgSelectModule,
    SharedModule
  ],
  declarations: [ChatComponent, ChatRoomsComponent, CreateChatRoomComponent, ChatSettingsComponent],
  providers: [ChatService, ConversationService],
  entryComponents: [ChatComponent, ChatRoomsComponent, CreateChatRoomComponent, ChatSettingsComponent]
})
export class ChatModule { }
