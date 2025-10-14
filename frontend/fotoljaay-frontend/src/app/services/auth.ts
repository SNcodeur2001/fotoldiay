import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

export interface User {
  id: string;
  name: string;
  email: string;
  telephone?: string;
  adresse?: string;
  role: 'VISITEUR' | 'VENDEUR' | 'GESTIONNAIRE';
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  login: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  telephone?: string;
  adresse?: string;
  role?: 'VISITEUR' | 'VENDEUR' | 'GESTIONNAIRE';
}

export interface AuthResponse {
  user: User;
  token: string;
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:5080/api';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.initializeAuthState();
  }

  private initializeAuthState() {
    const token = localStorage.getItem('authToken');
    if (token) {
      // Vérifier si le token est valide en appelant /me
      this.getCurrentUser().subscribe({
        next: (user) => {
          this.currentUserSubject.next(user);
        },
        error: () => {
          // Token expiré ou invalide
          localStorage.removeItem('authToken');
          this.currentUserSubject.next(null);
        },
      });
    } else {
      this.currentUserSubject.next(null);
    }
  }

  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, credentials).pipe(
      tap((response) => {
        localStorage.setItem('authToken', response.token);
        this.currentUserSubject.next(response.user);
      })
    );
  }

  register(userData: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/register`, userData).pipe(
      tap((response) => {
        localStorage.setItem('authToken', response.token);
        this.currentUserSubject.next(response.user);
      })
    );
  }

  getCurrentUser(): Observable<User> {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('No token available');
    }
    return this.http
      .get<User>(`${this.apiUrl}/auth/me`)
      .pipe(tap((user) => this.currentUserSubject.next(user)));
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/logout`, {}, { headers: this.getHeaders() }).pipe(
      tap(() => {
        localStorage.removeItem('authToken');
        this.currentUserSubject.next(null);
      })
    );
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('authToken');
    return !!token;
  }

  hasRole(role: string): boolean {
    return this.currentUser?.role === role;
  }

  isSeller(): boolean {
    return this.hasRole('VENDEUR');
  }

  isManager(): boolean {
    return this.hasRole('GESTIONNAIRE');
  }
}
