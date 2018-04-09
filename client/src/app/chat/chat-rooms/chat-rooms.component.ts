import { Component, OnInit } from '@angular/core';
import { UserService } from '../../shared/services/user/user.service';

@Component({
  selector: 'tcc-chat-rooms',
  templateUrl: './chat-rooms.component.html',
  styleUrls: ['./chat-rooms.component.scss']
})
export class ChatRoomsComponent implements OnInit {

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.userService.getAll().subscribe(data => {
      console.log("got into user service get", data)
    })
  }

}
