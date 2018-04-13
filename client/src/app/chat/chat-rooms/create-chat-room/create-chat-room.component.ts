import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { User } from '../../shared/model/user';
import { Observable } from "rxjs/Observable";
import { UserService } from '../../../shared/services/user/user.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
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
    private userService: UserService) { }

  ngOnInit() {
    this.users = this.userService.getAll();

    this.form = new FormGroup({
      title: new FormControl('', [Validators.required]),
      public: new FormControl(false, Validators.required),
      users: new FormControl([]),
    });

  }

  create() {
    console.log(this.form.value);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  cancel() {
    this.dialogRef.close();
  }

}
