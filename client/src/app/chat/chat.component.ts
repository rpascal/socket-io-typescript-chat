import { Component, OnInit, ViewChildren, ViewChild, AfterViewInit, QueryList, ElementRef } from '@angular/core';
import { MatDialog, MatDialogRef, MatList, MatListItem } from '@angular/material';

import { Action } from './shared/model/action';
import { Event } from './shared/model/event';
import { Message, MessageExpandedModel } from './shared/model/message';
import { User } from './shared/model/user';
import { SocketService } from './shared/services/socket.service';
import { UserService } from '../shared/services/user/user.service';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'tcc-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, AfterViewInit {
  action = Action;
  user: User;
  messages: MessageExpandedModel[] = [];
  messageContent: string;
  ioConnection: any;


  // getting a reference to the overall list, which is the parent container of the list items
  @ViewChild(MatList, { read: ElementRef }) matList: ElementRef;

  // getting a reference to the items/messages within the list
  @ViewChildren(MatListItem, { read: ElementRef }) matListItems: QueryList<MatListItem>;

  conversationID: number;

  constructor(private socketService: SocketService,
    public dialog: MatDialog,
    private userService: UserService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.user = this.userService.getLoggedInUser();
    this.route.params.take(1).subscribe(params => {
      this.conversationID = params.conversationID;
      this.initIoConnection();
    });
  }

  ngAfterViewInit(): void {
    // subscribing to any changes in the list of items / messages
    this.matListItems.changes.subscribe(elements => {
      this.scrollToBottom();
    });
  }

  // auto-scroll fix: inspired by this stack overflow post
  // https://stackoverflow.com/questions/35232731/angular2-scroll-to-bottom-chat-style
  private scrollToBottom(): void {
    try {
      this.matList.nativeElement.scrollTop = this.matList.nativeElement.scrollHeight;
    } catch (err) {
    }
  }



  private initIoConnection(): void {
    this.socketService.initSocket(this.conversationID).then(() => {

      this.socketService.getOld(this.conversationID).subscribe((data: MessageExpandedModel[]) => {
        this.messages = data;
        console.log("Loaded old messages")
      })

      this.socketService.currentMessages()
        .subscribe((message: MessageExpandedModel[]) => {
          console.log("currentMessages looping", message);
          message.forEach(item => {
            this.messages.push(item);
          })
        });

      this.ioConnection = this.socketService.onMessage()
        .subscribe((message: MessageExpandedModel) => {
          console.log("On Message");
          this.messages.push(message);
        });


      this.socketService.onEvent(Event.CONNECT)
        .subscribe(() => {
          console.log('connected');
        });

      this.socketService.onEvent(Event.DISCONNECT)
        .subscribe(() => {
          console.log('disconnected');
        });

    });

    // this.socketService.onEvent(Event.DataLoaded)
    // .subscribe((message: Message) => {
    //   console.log("On DataLoaded");
    //   this.messages.push(message);
    // });

  }



  public sendMessage(message: string): void {
    if (!message) {
      return;
    }

    const newMessage: MessageExpandedModel = {
      message: message,
      conversation_id: this.conversationID,
      sender_id: this.user.id,
      message_type: 1
    }

    this.socketService.sendNew(newMessage).subscribe(() => {
      console.log("Message sent good")

    }, err => {
      console.log("error sending messgae", err)
    });
    this.messageContent = null;
  }

  // public sendNotification(params: any, action: Action): void {
  //   let message: Message;

  //   if (action === Action.JOINED) {
  //     message = {
  //       from: this.user,
  //       action: action
  //     }
  //   }

  //   this.socketService.send(message);
  // }
}
