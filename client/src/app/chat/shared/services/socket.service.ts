import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { Message } from '../model/message';
import { Event } from '../model/event';

import { connect } from 'socket.io-client';


@Injectable()
export class SocketService {
    private socket;

    public initSocket(): void {
        this.socket = connect("http://localhost:8080");
    }

    public send(message: Message): void {
        console.log("Sending message");
        this.socket.emit('message', message);
    }

    public onMessage(): Observable<Message> {
        return new Observable<Message>(observer => {
            console.log("onMessage in observable");
            this.socket.on('message', (data: Message) => observer.next(data));
        });
    }

    public currentMessages(): Observable<Message[]> {
        return new Observable<Message[]>(observer => {
            console.log("currentMessages in observable");
            this.socket.on('currentMessages', (data: Message[]) => observer.next(data));
        });
    }


    public onEvent(event: Event): Observable<any> {
        return new Observable<Event>(observer => {
            this.socket.on(event, () => observer.next());
        });
    }
}
