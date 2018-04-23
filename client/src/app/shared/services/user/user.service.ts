import 'rxjs/add/operator/take';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '../../../../environments/environment';
import { User } from '../../../chat/shared/model/user';

@Injectable()
export class UserService {
    constructor(private http: HttpClient) { }

    getLoggedInUser(): User {
        const curUser = localStorage.getItem('currentUser') || "";
        if (curUser.length === 0) {
            return undefined;
        }
        return JSON.parse(curUser) as User;
    }

    getAll(removeCurrent: boolean = true) {
        const user = this.getLoggedInUser();
        return this.http.get<User[]>(environment.apiRoute + '/users').take(1).map(res => {
            return res.filter(item => {
                return item.id !== user.id;
            })
        });
    }

    getById(_id: string) {
        return this.http.get(environment.apiRoute + '/users/' + _id).take(1);
    }

    create(user: User) {
        return this.http.post(environment.apiRoute + '/users/register', user).take(1);
    }

    update(user: User) {
        return this.http.put(environment.apiRoute + '/users/' + user.id, user).take(1);
    }

    delete(_id: string) {
        return this.http.delete(environment.apiRoute + '/users/' + _id).take(1);
    }
}
