import { Component } from '@angular/core';
import { ApiService } from '../api.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent {
  public messages: { message: string, name: string, timestamp?: Date }[] = [];
  public newMessage: string = '';
  public userName: string = '';
  public userJoined: string[] = [];
  public userLeft: string[] = [];

  constructor(private chatService: ApiService) {}

  ngOnInit() {
    // Listen for incoming messages
    this.chatService.receiveMessage().subscribe((data: { message: string, name: string }) => {
      this.messages.push({ ...data, timestamp: new Date() });
    });

    // Listen for new users joining
    this.chatService.userJoined().subscribe((name: string) => {
      this.messages.push({ message: `${name} has joined the chat`, name: '', timestamp: new Date() });
    });

    // Listen for users leaving
    this.chatService.userLeft().subscribe((name: string) => {
      this.messages.push({ message: `${name} has left the chat`, name: '', timestamp: new Date() });
    });
  }

  // Send message
  public sendMessage() {
    if (this.newMessage.trim()) {
      this.chatService.sendMessage(this.newMessage);
      this.newMessage = '';
    }
  }

  // Join chat
  public joinChat() {
    if (this.userName.trim()) {
      this.chatService.joinChat(this.userName);
    }
  }
}
