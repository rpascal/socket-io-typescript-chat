import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { AlertService } from '../../shared/services/alert/alert.service';
import { UserService } from '../../shared/services/user/user.service';
import { User } from '../shared/model/user';
import { ConversationService } from '../shared/services/conversations/conversation.service';

@Component({
  selector: 'tcc-chat-settings',
  templateUrl: './chat-settings.component.html',
  styleUrls: ['./chat-settings.component.scss']
})
export class ChatSettingsComponent implements OnInit {

  public conversationID: number;
  public userID: number;
  public selectedUsers: number[] = [];
  users: Observable<User[]>;


  constructor(public dialogRef: MatDialogRef<ChatSettingsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private conversationService: ConversationService,
    private userService: UserService,
    private router: Router,
    private alertService: AlertService) {

    this.conversationID = data;
    this.userID = this.userService.getLoggedInUser().id;
  }

  ngOnInit() {
    this.users = this.conversationService.getUsersNotInConversation(this.conversationID);
  }


  leaveRoom() {
    this.conversationService.removeUser(this.conversationID, this.userID).subscribe(() => {
      this.alertService.success("Removed from chat room");
      this.router.navigate(['']);
      this.dialogRef.close();
    }, error => {
      this.alertService.error("Error removing from chat room")
    })
  }

  addUsers() {
    this.conversationService.addUsers(this.conversationID, this.selectedUsers).subscribe(() => {
      this.alertService.success("Added users to chat room");
      this.dialogRef.close();
    }, error => {
      this.alertService.error("Error users to chat room")
    })
  }



}
