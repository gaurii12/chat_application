import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import io from 'socket.io-client';


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private socket: any;
  private readonly SERVER_URL = 'http://localhost:3000';

  constructor() {
    this.socket = io(this.SERVER_URL);
  }

  // Emit events
  joinChat(name: string): void {
    console.log('hello world');
    this.socket.emit('new-user-joined', name);
  }

  sendMessage(message: string): void {
    console.log('hello world');
    this.socket.emit('send', message);
  }

  // Listen for events
  receiveMessage(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('receive', (data: any) => {
        observer.next(data);
      });
    });
  }

  userJoined(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('user-joined', (name: string) => {
        observer.next(name);
      });
    });
  }
  

  userLeft(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('user-left', (name: string) => {
        observer.next(name);
      });
    });
  }

}
