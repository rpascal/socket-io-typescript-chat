import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { Message } from '../model/message';
import { Event } from '../model/event';

import * as socketIo from 'socket.io-client';


@Injectable()
export class SocketService {
    private socket;

    public initSocket(): void {

        this.socket = socketIo();
        this.socket.on("error", (err) => {
            console.log('Error on socket', err);
        })
        this.socket.on('connect_error', function (err) {
            console.log('Error connecting to server', err);
        });

        console.log(this.socket);


    }

    public send(message: Message): void {
        this.socket.emit('message', message);
    }

    public onMessage(): Observable<Message> {
        return new Observable<Message>(observer => {
            this.socket.on('message', (data: Message) => observer.next(data));
        });
    }

    public onEvent(event: Event): Observable<any> {
        return new Observable<Event>(observer => {
            this.socket.on(event, () => observer.next());
        });
    }
}
