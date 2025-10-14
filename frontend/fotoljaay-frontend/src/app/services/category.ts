import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Category {
  id: string;
  libelle: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  products?: any[]; // Pour les catégories avec produits
}

export interface CategoryInput {
  libelle: string;
  description?: string;
}

export interface CategoryResponse {
  page: number;
  limit: number;
  count: number;
  data: Category[];
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = 'http://localhost:5080/api';

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    });
  }

  getAllCategories(includeProducts: boolean = false): Observable<CategoryResponse> {
    const params = includeProducts ? new HttpParams().set('includeProducts', 'true') : new HttpParams();

    return this.http.get<CategoryResponse>(`${this.apiUrl}/categories`, {
      headers: this.getHeaders(),
      params
    });
  }

  getCategoryById(id: string, includeProducts: boolean = false): Observable<Category> {
    const params = includeProducts ? new HttpParams().set('includeProducts', 'true') : new HttpParams();

    return this.http.get<Category>(`${this.apiUrl}/categories/${id}`, {
      headers: this.getHeaders(),
      params
    });
  }

  createCategory(category: CategoryInput): Observable<Category> {
    return this.http.post<Category>(`${this.apiUrl}/categories`, category, {
      headers: this.getHeaders()
    });
  }

  updateCategory(id: string, category: Partial<CategoryInput>): Observable<Category> {
    return this.http.put<Category>(`${this.apiUrl}/categories/${id}`, category, {
      headers: this.getHeaders()
    });
  }

  deleteCategory(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/categories/${id}`, {
      headers: this.getHeaders()
    });
  }

  searchCategories(query: string): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/categories/search`, {
      headers: this.getHeaders(),
      params: new HttpParams().set('q', query)
    });
  }
}
