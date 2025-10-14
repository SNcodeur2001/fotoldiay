import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService, Product, ProductResponse } from '../../services/product';
import { CategoryService, Category } from '../../services/category';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-moderation',
  imports: [CommonModule, RouterModule],
  templateUrl: './moderation.html',
  styleUrl: './moderation.css'
})
export class Moderation implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];
  isLoading = false;
  errorMessage = '';

  // Pagination
  currentPage = 1;
  totalPages = 1;
  totalCount = 0;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadCategories();
    this.loadPendingProducts();
  }

  loadCategories() {
    this.categoryService.getAllCategories().subscribe({
      next: (categories) => {
        this.categories = categories.data;
      },
      error: (error) => {
        console.error('Erreur chargement catégories:', error);
      }
    });
  }

  loadPendingProducts() {
    this.isLoading = true;
    this.errorMessage = '';

    const params: any = {
      page: this.currentPage,
      limit: 12,
      status: 'EN_ATTENTE' // Uniquement les produits en attente
    };

    this.productService.getAllProducts(params).subscribe({
      next: (response: ProductResponse) => {
        this.products = response.data;
        this.totalCount = response.count;
        this.totalPages = Math.ceil(response.count / 12);
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = 'Erreur lors du chargement des produits en attente';
        console.error('Erreur chargement produits:', error);
      }
    });
  }

  approveProduct(product: Product) {
    if (confirm(`Êtes-vous sûr de vouloir approuver le produit "${product.title}" ?`)) {
      this.productService.approveProduct(product.id).subscribe({
        next: (updatedProduct) => {
          // Retirer le produit de la liste
          this.products = this.products.filter(p => p.id !== product.id);
          alert('Produit approuvé avec succès !');
        },
        error: (error) => {
          console.error('Erreur lors de l\'approbation:', error);
          alert('Erreur lors de l\'approbation du produit');
        }
      });
    }
  }

  rejectProduct(product: Product) {
    if (confirm(`Êtes-vous sûr de vouloir rejeter le produit "${product.title}" ?`)) {
      this.productService.rejectProduct(product.id).subscribe({
        next: (updatedProduct) => {
          // Retirer le produit de la liste
          this.products = this.products.filter(p => p.id !== product.id);
          alert('Produit rejeté avec succès !');
        },
        error: (error) => {
          console.error('Erreur lors du rejet:', error);
          alert('Erreur lors du rejet du produit');
        }
      });
    }
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadPendingProducts();
    }
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'EN_ATTENTE':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'EN_ATTENTE':
        return 'En attente de modération';
      default:
        return status;
    }
  }

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  isManager(): boolean {
    return this.authService.isManager();
  }

  getMin(a: number, b: number): number {
    return Math.min(a, b);
  }

  getPagesArray(): number[] {
    const maxPages = Math.min(this.totalPages, 5);
    return Array.from({ length: maxPages }, (_, i) => i + 1);
  }

  trackByProductId(index: number, product: Product): string {
    return product.id;
  }
}
