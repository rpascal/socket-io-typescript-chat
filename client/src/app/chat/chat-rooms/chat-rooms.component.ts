import { Component, OnInit } from '@angular/core';
import { UserService } from '../../shared/services/user/user.service';
import { MatDialog } from '@angular/material';
import { CreateChatRoomComponent } from './create-chat-room/create-chat-room.component';

@Component({
  selector: 'tcc-chat-rooms',
  templateUrl: './chat-rooms.component.html',
  styleUrls: ['./chat-rooms.component.scss']
})
export class ChatRoomsComponent implements OnInit {

  constructor(public dialog: MatDialog) { }

  ngOnInit() {
    // this.userService.getAll().subscribe(data => {
    //   console.log("got into user service get", data)
    // })

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
