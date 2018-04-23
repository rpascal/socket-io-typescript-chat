import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';

import { ConversationModel } from '../shared/model/conversation';
import { ConversationService } from '../shared/services/conversations/conversation.service';
import { CreateChatRoomComponent } from './create-chat-room/create-chat-room.component';


@Component({
  selector: 'tcc-chat-rooms',
  templateUrl: './chat-rooms.component.html',
  styleUrls: ['./chat-rooms.component.scss']
})
export class ChatRoomsComponent implements OnInit {

  public conversations;

  constructor(public dialog: MatDialog,
    private Conversations: ConversationService,
    private router: Router) { }

  ngOnInit() {
    this.conversations = this.Conversations.monitorConversations();
    this.Conversations.init();
  }

  createRoom(): void {
    const dialogRef = this.dialog.open(CreateChatRoomComponent, {
      width: "500px",
      height: "500px"
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
    });
  }

  enterChat(convo: ConversationModel) {
    this.router.navigate(['chat', convo.id]);
    console.log(convo)
  }

}
