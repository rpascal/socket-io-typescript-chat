import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { User } from '../../shared/model/user';
import { Observable } from "rxjs/Observable";
import { UserService } from '../../../shared/services/user/user.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ConversationService } from '../../shared/services/conversations/conversation.service';
import { ConversationExpandedModel } from '../../shared/model/conversation';
@Component({
  selector: 'tcc-create-chat-room',
  templateUrl: './create-chat-room.component.html',
  styleUrls: ['./create-chat-room.component.scss']
})
export class CreateChatRoomComponent implements OnInit {

  users: Observable<User[]>;
  selectedUser: any;
  form: FormGroup;


  constructor(public dialogRef: MatDialogRef<CreateChatRoomComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private userService: UserService,
    private conversationService: ConversationService) { }

  ngOnInit() {
    this.users = this.userService.getAll();

    this.form = new FormGroup({
      title: new FormControl('', [Validators.required]),
      public: new FormControl(false, Validators.required),
      users: new FormControl([]),
    });

  }

  create() {
    const convoModel = Object.assign({ creator_id: this.userService.getLoggedInUser().id }, this.form.value);
    const model: ConversationExpandedModel = convoModel as ConversationExpandedModel;
    console.log(this.userService.getLoggedInUser())
    // model.creator_id = this.userService.getLoggedInUser().id;

    this.conversationService.create(model).subscribe(() => {
      console.log("CREATED");
    });

    // console.log(this.form.value);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  cancel() {
    this.dialogRef.close();
  }

}
