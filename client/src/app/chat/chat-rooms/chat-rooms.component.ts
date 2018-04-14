import { Component, OnInit } from '@angular/core';
import { UserService } from '../../shared/services/user/user.service';
import { MatDialog } from '@angular/material';
import { CreateChatRoomComponent } from './create-chat-room/create-chat-room.component';
import { ConversationService } from '../shared/services/conversations/conversation.service';

@Component({
  selector: 'tcc-chat-rooms',
  templateUrl: './chat-rooms.component.html',
  styleUrls: ['./chat-rooms.component.scss']
})
export class ChatRoomsComponent implements OnInit {

  private conversations;

  constructor(public dialog: MatDialog, private Conversations: ConversationService) { }

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

}
