import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { take } from "rxjs/operators/take"
import 'rxjs/add/operator/take';
import { ConversationExpandedModel } from '../../model/conversation';
import { UserService } from '../../../../shared/services/user/user.service';
import { environment } from 'environments/environment';
import { connect } from 'socket.io-client';
import { Observable } from "rxjs/Observable";

import * as _ from "lodash"
import { Subject } from 'rxjs/Subject';
import { User } from '../../model/user';

@Injectable()
export class ConversationService {
    private socket;
    private monitorConvos: Subject<ConversationExpandedModel[]> = new Subject();

    constructor(private http: HttpClient, private userService: UserService) { }


    public init(): void {


        this.getUserConversations().subscribe((convos) => {
            this.monitorConvos.next(convos);
        })

        this.socket = connect(environment.socketioConnection);
        const userID = this.userService.getLoggedInUser().id;
        this.socket.on('conversationAdded', (data: number[]) => {
            const exists = _.some(data, (item) => {
                return item === userID;
            })
            if (exists) {
                this.getUserConversations().subscribe((convos) => {
                    this.monitorConvos.next(convos);
                })
            }
        });
    }

    getUserConversations() {
        return this.http.get<ConversationExpandedModel[]>(environment.apiRoute + `/conversations/${this.userService.getLoggedInUser().id}`).take(1);
    }

    create(convo: ConversationExpandedModel) {
        return this.http.post(environment.apiRoute + '/conversations/create', convo).take(1);
    }

    addUsers(conversationID: number, userIDs: number[]) {
        return this.http.post(environment.apiRoute + '/conversations/addUsers', {
            conversationID: conversationID,
            userIDs: userIDs
        }).take(1);
    }

    getUsersNotInConversation(conversationID: number) {
        return this.http.get<User[]>(environment.apiRoute + `/conversations/getUsersNotInConversation/${conversationID}`).take(1);
    }

    removeUser(conversationID: number, userID: number) {
        return this.http.post(environment.apiRoute + '/conversations/removeUser', {
            conversationID: conversationID,
            userID: userID
        }).take(1);
    }

    public monitorConversations() {
        return this.monitorConvos;
    }

}
