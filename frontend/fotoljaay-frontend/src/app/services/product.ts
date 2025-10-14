import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Product {
  id: string;
  title: string;
  description?: string;
  price: number;
  imageUrl?: string;
  status: 'EN_ATTENTE' | 'VALIDE' | 'EXPIRE' | 'SUPPRIME';
  dateExpiration?: string;
  viewCount: number;
  isVip: boolean;
  userId: string;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
  category?: {
    id: string;
    libelle: string;
  };
}

export interface ProductInput {
  title: string;
  description?: string;
  price: number;
  imageUrl?: string;
  status?: 'EN_ATTENTE' | 'VALIDE' | 'EXPIRE';
  dateExpiration?: string;
  userId: string;
  categoryId: string;
}

export interface ProductResponse {
  page: number;
  limit: number;
  total: number;
  data: Product[];
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:5080/api';

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    });
  }

  getAllProducts(params?: {
    status?: string;
    categoryId?: string;
    userId?: string;
    page?: number;
    limit?: number;
  }): Observable<ProductResponse> {
    let httpParams = new HttpParams();

    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key as keyof typeof params] !== undefined) {
          httpParams = httpParams.set(key, params[key as keyof typeof params] as string);
        }
      });
    }

    return this.http.get<ProductResponse>(`${this.apiUrl}/products`, {
      headers: this.getHeaders(),
      params: httpParams
    });
  }

  getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/products/${id}`, {
      headers: this.getHeaders()
    });
  }

  createProduct(product: ProductInput): Observable<Product> {
    return this.http.post<Product>(`${this.apiUrl}/products`, product, {
      headers: this.getHeaders()
    });
  }

  updateProduct(id: string, product: Partial<ProductInput>): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/products/${id}`, product, {
      headers: this.getHeaders()
    });
  }

  deleteProduct(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/products/${id}`, {
      headers: this.getHeaders()
    });
  }

  getProductsByUser(userId: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products/user/${userId}`, {
      headers: this.getHeaders()
    });
  }

  getProductsByCategory(categoryId: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products/category/${categoryId}`, {
      headers: this.getHeaders()
    });
  }

  approveProduct(id: string): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/products/${id}/approve`, {}, {
      headers: this.getHeaders()
    });
  }

  rejectProduct(id: string): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/products/${id}/reject`, {}, {
      headers: this.getHeaders()
    });
  }

  setVipStatus(id: string, isVip: boolean): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/products/${id}/vip`, { isVip }, {
      headers: this.getHeaders()
    });
  }
}
