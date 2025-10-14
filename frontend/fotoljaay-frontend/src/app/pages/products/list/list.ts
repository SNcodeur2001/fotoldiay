import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ProductService, Product, ProductResponse } from '../../../services/product';
import { CategoryService, Category } from '../../../services/category';
import { AuthService } from '../../../services/auth';

@Component({
  selector: 'app-list',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './list.html',
  styleUrl: './list.css'
})
export class List implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];
  isLoading = false;
  errorMessage = '';

  // Filters
  selectedCategory = '';
  selectedStatus = '';
  searchTerm = '';

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
    this.loadProducts();
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

  loadProducts() {
    this.isLoading = true;
    this.errorMessage = '';

    const params: any = {
      page: this.currentPage,
      limit: 12
    };

    if (this.selectedCategory) params.categoryId = this.selectedCategory;

    // Pour les visiteurs non connectés, forcer le filtre sur les produits validés uniquement
    if (!this.isAuthenticated()) {
      params.status = 'VALIDE';
    } else if (this.selectedStatus) {
      params.status = this.selectedStatus;
    }

    if (this.searchTerm) params.search = this.searchTerm;

    this.productService.getAllProducts(params).subscribe({
      next: (response: ProductResponse) => {
        this.products = response.data;
        this.totalCount = response.count;
        this.totalPages = Math.ceil(response.count / 12);
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = 'Erreur lors du chargement des produits';
        console.error('Erreur chargement produits:', error);
      }
    });
  }

  onCategoryChange() {
    this.currentPage = 1;
    this.loadProducts();
  }

  onStatusChange() {
    this.currentPage = 1;
    this.loadProducts();
  }

  onSearch() {
    this.currentPage = 1;
    this.loadProducts();
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadProducts();
    }
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'VALIDE':
        return 'bg-green-100 text-green-800';
      case 'EN_ATTENTE':
        return 'bg-yellow-100 text-yellow-800';
      case 'EXPIRE':
        return 'bg-red-100 text-red-800';
      case 'SUPPRIME':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'VALIDE':
        return 'Validé';
      case 'EN_ATTENTE':
        return 'En attente';
      case 'EXPIRE':
        return 'Expiré';
      case 'SUPPRIME':
        return 'Supprimé';
      default:
        return status;
    }
  }

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  isSeller(): boolean {
    return this.authService.isSeller();
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

  approveProduct(product: Product) {
    if (confirm(`Êtes-vous sûr de vouloir approuver le produit "${product.title}" ?`)) {
      this.productService.approveProduct(product.id).subscribe({
        next: (updatedProduct) => {
          // Mettre à jour le produit dans la liste
          const index = this.products.findIndex(p => p.id === product.id);
          if (index !== -1) {
            this.products[index] = updatedProduct;
          }
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
          // Mettre à jour le produit dans la liste
          const index = this.products.findIndex(p => p.id === product.id);
          if (index !== -1) {
            this.products[index] = updatedProduct;
          }
          alert('Produit rejeté avec succès !');
        },
        error: (error) => {
          console.error('Erreur lors du rejet:', error);
          alert('Erreur lors du rejet du produit');
        }
      });
    }
  }
}
