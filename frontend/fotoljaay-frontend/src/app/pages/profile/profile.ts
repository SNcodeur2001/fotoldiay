import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService, User } from '../../services/auth';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile implements OnInit {
  user: User | null = null;
  isLoading = false;
  isEditing = false;
  errorMessage = '';

  editData = {
    name: '',
    email: '',
    telephone: '',
    adresse: ''
  };

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.loadUserProfile();
  }

  loadUserProfile() {
    this.isLoading = true;
    this.authService.getCurrentUser().subscribe({
      next: (user) => {
        this.user = user;
        this.editData = {
          name: user.name,
          email: user.email,
          telephone: user.telephone || '',
          adresse: user.adresse || ''
        };
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = 'Erreur lors du chargement du profil';
        console.error('Erreur chargement profil:', error);
      }
    });
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
    if (!this.isEditing) {
      // Reset edit data
      if (this.user) {
        this.editData = {
          name: this.user.name,
          email: this.user.email,
          telephone: this.user.telephone || '',
          adresse: this.user.adresse || ''
        };
      }
    }
  }

  saveProfile() {
    // TODO: Implement update profile
    this.isEditing = false;
  }

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  isSeller(): boolean {
    return this.authService.isSeller();
  }
}
