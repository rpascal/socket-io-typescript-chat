import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../../environments/environment';
import { User } from '../../../chat/shared/model/user';
import { take } from "rxjs/operators/take"
import 'rxjs/add/operator/take';

@Injectable()
export class UserService {
    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<User[]>(environment.apiRoute + '/users').take(1);
    }

    getById(_id: string) {
        return this.http.get(environment.apiRoute + '/users/' + _id).take(1);
    }

    create(user: User) {
        return this.http.post(environment.apiRoute + '/users/register', user).take(1);
    }

    update(user: User) {
        return this.http.put(environment.apiRoute + '/users/' + user.ID, user).take(1);
    }

    delete(_id: string) {
        return this.http.delete(environment.apiRoute + '/users/' + _id).take(1);
    }
}
