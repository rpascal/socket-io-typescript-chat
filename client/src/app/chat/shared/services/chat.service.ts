import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs/Observable';
import { connect } from 'socket.io-client';

import { MessageExpandedModel } from '../model/message';


@Injectable()
export class ChatService {
    private socket: SocketIOClient.Socket;

    constructor(private http: HttpClient) {
    }

    public initSocket(conversationID: number): Promise<void> {
        return new Promise<void>(resolve => {
            this.socket = connect(environment.socketioConnection);
            // this.socket.nsp = conversationID.toString();
            this.socket.emit('room', conversationID.toString());
            this.socket.on("joinedRoom", () => {
                resolve();
            });

        })

    }

    public getOld(conversation_id: number) {
        return this.http.get<MessageExpandedModel[]>(environment.apiRoute + `/messages/${conversation_id}`).take(1);
    }

    sendNew(message: MessageExpandedModel) {
        return this.http.post(environment.apiRoute + `/messages/${message.conversation_id}`, message).take(1);
    }

    // public send(message: MessageExpandedModel): void {
    //     console.log("Sending message");
    //     this.socket.emit('message', message);
    // }

    public onMessage(): Observable<MessageExpandedModel> {
        return new Observable<MessageExpandedModel>(observer => {
            // console.log("onMessage in observable");
            this.socket.on('message', (data: MessageExpandedModel) => observer.next(data));
        });
    }

    // public currentMessages(): Observable<MessageExpandedModel[]> {
    //     return new Observable<MessageExpandedModel[]>(observer => {
    //         console.log("currentMessages in observable");
    //         this.socket.on('currentMessages', (data: MessageExpandedModel[]) => observer.next(data));
    //     });
    // }


    // public onEvent(event: Event): Observable<any> {
    //     return new Observable<Event>(observer => {
    //         this.socket.on(event, () => observer.next());
    //     });
    // }
}
