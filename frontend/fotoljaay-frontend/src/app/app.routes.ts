import { Routes } from '@angular/router';
import { Login } from './pages/auth/login/login';
import { Register } from './pages/auth/register/register';
import { List } from './pages/products/list/list';
import { Add } from './pages/products/add/add';
import { Detail } from './pages/products/detail/detail';
import { Profile } from './pages/profile/profile';
import { Moderation } from './pages/moderation/moderation';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/products', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'products', component: List},
  { path: 'product/:id', component: Detail},
  { path: 'add-product', component: Add, canActivate: [AuthGuard] },
  { path: 'profile', component: Profile, canActivate: [AuthGuard] },
  { path: 'moderation', component: Moderation, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '/products' }
];
