import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

const CHAT_DB = 'chat_messages';

export interface ChatMessage {
  id: number;
  user_id: string;
  name: string;
  message: string;
  created_at: string;
}

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {

  private _messages: BehaviorSubject<ChatMessage[]> = new BehaviorSubject<ChatMessage[]>([]);
  private _currentUser: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
  private supabase: SupabaseClient;

  constructor(private router: Router) {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);

    this.loadUser();
    this.loadMessages();

    this.supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        this._currentUser.next(session.user);
        this.loadMessages();
      } else if (event === 'SIGNED_OUT') {
        this._currentUser.next(null);
        this._messages.next([]);
      }
    });
  }

  async loadUser() {
    const { data } = await this.supabase.auth.getUser();
    if (data?.user) {
      this._currentUser.next(data.user);
    } else {
      this._currentUser.next(null);
    }
  }

  get currentUser(): Observable<User | null> {
    return this._currentUser.asObservable();
  }

  get messages(): Observable<ChatMessage[]> {
    return this._messages.asObservable();
  }

  async loadMessages() {
    const { data, error } = await this.supabase
      .from(CHAT_DB)
      .select('*')
      .order('created_at', { ascending: true });
    if (!error && data) {
      this._messages.next(data);
    }
  }

  async sendMessage(name: string, message: string) {
    const user = this._currentUser.value;
    if (!user) throw new Error('No user logged in');
    const { error } = await this.supabase
      .from(CHAT_DB)
      .insert([{ user_id: user.id, name, message }]);
    if (error) throw error;
    await this.loadMessages();
  }

  async signUp(credentials: { email: string, password: string }) {
    const { error, data } = await this.supabase.auth.signUp(credentials);
    if (error) throw error;
    return data;
  }

  async signIn(credentials: { email: string, password: string }) {
    const { error, data } = await this.supabase.auth.signInWithPassword(credentials);
    if (error) throw error;
    return data;
  }

  async signOut() {
    await this.supabase.auth.signOut();
    this._currentUser.next(null);
    this._messages.next([]);
    this.router.navigateByUrl('/');
  }
}