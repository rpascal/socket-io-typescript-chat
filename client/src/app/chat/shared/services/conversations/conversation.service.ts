import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { take } from "rxjs/operators/take"
import 'rxjs/add/operator/take';
import { ConversationExpandedModel } from '../../model/conversation';
import { UserService } from '../../../../shared/services/user/user.service';
import { environment } from 'environments/environment';

@Injectable()
export class ConversationService {
    constructor(private http: HttpClient, private userService: UserService) { }

    getUserConversations() {
        return this.http.get<ConversationExpandedModel[]>(environment.apiRoute + `/${this.userService.getLoggedInUser().id}`).take(1);
    }

    create(convo: ConversationExpandedModel) {
        return this.http.post(environment.apiRoute + '/conversations/create', convo).take(1);
    }

}
