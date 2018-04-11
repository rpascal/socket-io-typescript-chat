import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'tcc-create-chat-room',
  templateUrl: './create-chat-room.component.html',
  styleUrls: ['./create-chat-room.component.scss']
})
export class CreateChatRoomComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<CreateChatRoomComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
