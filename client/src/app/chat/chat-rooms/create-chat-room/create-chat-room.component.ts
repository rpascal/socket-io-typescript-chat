import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Observable } from 'rxjs/Observable';

import { AlertService } from '../../../shared/services/alert/alert.service';
import { UserService } from '../../../shared/services/user/user.service';
import { ConversationExpandedModel } from '../../shared/model/conversation';
import { User } from '../../shared/model/user';
import { ConversationService } from '../../shared/services/conversations/conversation.service';

@Component({
  selector: 'tcc-create-chat-room',
  templateUrl: './create-chat-room.component.html',
  styleUrls: ['./create-chat-room.component.scss']
})
export class CreateChatRoomComponent implements OnInit {

  users: Observable<User[]>;
  selectedUser: any;
  form: FormGroup;
  loading = false;

  constructor(public dialogRef: MatDialogRef<CreateChatRoomComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private userService: UserService,
    private conversationService: ConversationService,
    private alertService: AlertService) { }

  ngOnInit() {
    this.users = this.userService.getAll();

    this.form = new FormGroup({
      title: new FormControl('', [Validators.required]),
      public: new FormControl(false, Validators.required),
      users: new FormControl([]),
    });

  }

  create() {
    this.loading = true;
    const convoModel = Object.assign({ creator_id: this.userService.getLoggedInUser().id }, this.form.value);
    const model: ConversationExpandedModel = convoModel as ConversationExpandedModel;
    this.conversationService.create(model).subscribe(() => {
      this.alertService.success('Room Created');
      this.loading = false;
      this.dialogRef.close();
    }, error => {
      this.alertService.error(error);
      this.loading = false;
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  cancel() {
    this.dialogRef.close();
  }

}
