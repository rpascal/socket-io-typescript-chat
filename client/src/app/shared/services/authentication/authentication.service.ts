import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'

import { environment } from '../../../../environments/environment';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/take';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class AuthenticationService {
    constructor(private http: HttpClient) { }


    private logonStatus = new BehaviorSubject<boolean>(false);
    private loggedOff = new BehaviorSubject<boolean>(false);


    login(username: string, password: string) {
        console.log(username, password);
        return this.http.post<any>(environment.apiRoute + '/users/authenticate', { username: username, password: password })
            .take(1)
            .map(user => {
                console.log("Login", user);
                // login successful if there's a jwt token in the response
                if (user && user.token) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    this.logonStatus.next(true);
                }

                return user;
            });
    }

    logout(flagLogOffRedirect = true) {
        console.log("logout function")
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
        this.logonStatus.next(false);
        this.loggedOff.next(flagLogOffRedirect);
    }


    monitorUserState(): Observable<boolean> {
        return this.logonStatus.asObservable();
    }

    monitorLoggedOff(): Observable<boolean> {
        return this.loggedOff.asObservable();
    }

}
