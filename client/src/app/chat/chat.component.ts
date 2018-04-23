import { AfterViewInit, Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatDialog, MatList, MatListItem } from '@angular/material';
import { ActivatedRoute } from '@angular/router';

import { UserService } from '../shared/services/user/user.service';
import { ChatSettingsComponent } from './chat-settings/chat-settings.component';
import { Action } from './shared/model/action';
import { MessageExpandedModel } from './shared/model/message';
import { User } from './shared/model/user';
import { ChatService } from './shared/services/chat.service';


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
  loading = false;


  // getting a reference to the overall list, which is the parent container of the list items
  @ViewChild(MatList, { read: ElementRef }) matList: ElementRef;

  // getting a reference to the items/messages within the list
  @ViewChildren(MatListItem, { read: ElementRef }) matListItems: QueryList<MatListItem>;

  conversationID: number;

  constructor(private chatService: ChatService,
    public dialog: MatDialog,
    private userService: UserService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.loading = true;
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
    this.chatService.initSocket(this.conversationID).then(() => {

      this.chatService.getOld(this.conversationID).subscribe((data: MessageExpandedModel[]) => {
        this.messages = data;
        this.loading = false;
        console.log("Loaded old messages", data)
      })

      this.chatService.onMessage()
        .subscribe((message: MessageExpandedModel) => {
          this.messages.push(message);
        });

    });

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

    this.chatService.sendNew(newMessage).subscribe(() => {
      console.log("Message sent good")

    }, err => {
      console.log("error sending messgae", err)
    });
    this.messageContent = null;
  }


  openSettings() {

    const dialogRef = this.dialog.open(ChatSettingsComponent, {
      width: "500px",
      height: "500px",
      data: this.conversationID
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
    });

    // alert("open settings")
  }

}
