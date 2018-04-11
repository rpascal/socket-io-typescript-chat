import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { User } from '../../shared/model/user';
import { Observable } from "rxjs/Observable";
import { UserService } from '../../../shared/services/user/user.service';
@Component({
  selector: 'tcc-create-chat-room',
  templateUrl: './create-chat-room.component.html',
  styleUrls: ['./create-chat-room.component.scss']
})
export class CreateChatRoomComponent implements OnInit {

  users: Observable<User[]>;
  selectedUser: any;



  defaultBindingsList = [
    { value: 1, label: 'Vilnius' },
    { value: 2, label: 'Kaunas' },
    { value: 3, label: 'Pavilnys', disabled: true },
    { value: 4, label: 'Vilnius' },
    { value: 5, label: 'Kaunas' },
    { value: 6, label: 'Pavilnys', disabled: true },
    { value: 7, label: 'Vilnius' },
    { value: 8, label: 'Kaunas' },
    { value: 9, label: 'Pavilnys', disabled: true },
    { value: 10, label: 'Vilnius' },
    { value: 20, label: 'Kaunas' },
    { value: 30, label: 'Pavilnys', disabled: true },
  ];
  selectedCity = null;

  constructor(public dialogRef: MatDialogRef<CreateChatRoomComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private userService: UserService) { }

  ngOnInit() {
    this.users = this.userService.getAll();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
