import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const token = localStorage.getItem('authToken');

  if (token) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });

    return next(cloned).pipe(
      catchError((error) => {
        if (error.status === 401 || error.status === 403) {
          // Token expiré ou invalide
          localStorage.removeItem('authToken');
          router.navigate(['/login']);
        }
        return throwError(error);
      })
    );
  }

  return next(req);
};
