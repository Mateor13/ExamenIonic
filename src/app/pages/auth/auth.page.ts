import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonInput, IonIcon } from '@ionic/angular/standalone';
import { SupabaseService } from 'src/app/services/supabase.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButton, IonInput, IonIcon]
})
export class AuthPage {
  email = '';
  password = '';
  error = '';

  constructor(private router: Router, private supabaseService: SupabaseService) { }

  async login() {
    try {
      await this.supabaseService.signIn({
        email: this.email,
        password: this.password
      })
      this.router.navigate(['/home']);
    } catch (error: any) {
      this.error = error.message;
    }

  }

  async register() {
    try {
      await this.supabaseService.signUp({
        email: this.email,
        password: this.password
      });
      alert('Registration successful! Please check your email for confirmation.');
    } catch (error: any) {
      this.error = error.message;
    }
  }
}
