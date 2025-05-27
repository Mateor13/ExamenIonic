import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonInput, IonIcon  } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { SupabaseService, ChatMessage } from 'src/app/services/supabase.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButton, IonInput, IonIcon ]
})
export class HomePage implements OnInit {
  email = '';
  messages$: Observable<ChatMessage[]>;
  message = '';
  name = '';
  error = '';

  constructor(private router: Router, private supabaseService: SupabaseService) {
    this.messages$ = this.supabaseService.messages;
  }

  ngOnInit() {
    this.supabaseService.currentUser.subscribe(user => {
      if (!user) {
        this.router.navigate(['/auth']);
      } else {
        this.email = user.email || '';
        this.name = user.email?.split('@')[0] || '';
        this.supabaseService.loadMessages(); // <-- Carga los mensajes aquí
      }
    });
  }

  async sendMessage() {
    if (!this.message.trim()) return;
    try {
      await this.supabaseService.sendMessage(this.name, this.message);
      this.message = '';
    } catch (error: any) {
      this.error = error.message;
    }
  }

  async logout() {
    await this.supabaseService.signOut();
    this.router.navigate(['/auth']);
  }
}