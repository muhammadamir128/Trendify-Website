import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

import { API_BASE_URL } from '../config/api.config';
import { Brand, Category, Order, Product } from '../models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private productsSubject = new BehaviorSubject<Product[]>([]);
  private categoriesSubject = new BehaviorSubject<Category[]>([]);
  private brandsSubject = new BehaviorSubject<Brand[]>([]);

  products$ = this.productsSubject.asObservable();
  categories$ = this.categoriesSubject.asObservable();
  brands$ = this.brandsSubject.asObservable();

  constructor(private http: HttpClient) {
    this.refreshCatalog();
  }

  refreshCatalog(): void {
    this.refreshProducts();
    this.refreshCategories();
    this.refreshBrands();
  }

  private refreshProducts(): void {
    this.http.get<Product[]>(`${API_BASE_URL}/products`).subscribe({
      next: (products) => this.productsSubject.next(products),
      error: (error) => console.error('Failed to load products', error)
    });
  }

  private refreshCategories(): void {
    this.http.get<Category[]>(`${API_BASE_URL}/categories`).subscribe({
      next: (categories) => this.categoriesSubject.next(categories),
      error: (error) => console.error('Failed to load categories', error)
    });
  }

  private refreshBrands(): void {
    this.http.get<Brand[]>(`${API_BASE_URL}/brands`).subscribe({
      next: (brands) => this.brandsSubject.next(brands),
      error: (error) => console.error('Failed to load brands', error)
    });
  }

  // Categories
  getCategories(): Observable<Category[]> {
    if (this.categoriesSubject.value.length === 0) {
      this.refreshCategories();
    }

    return this.categories$;
  }

  addCategory(category: Omit<Category, 'id' | 'createdAt'>): void {
    this.http.post<Category>(`${API_BASE_URL}/categories`, category).subscribe({
      next: () => this.refreshCategories(),
      error: (error) => console.error('Failed to add category', error)
    });
  }

  updateCategory(id: string, category: Partial<Category>): void {
    this.http.put<Category>(`${API_BASE_URL}/categories/${id}`, category).subscribe({
      next: () => this.refreshCategories(),
      error: (error) => console.error('Failed to update category', error)
    });
  }

  deleteCategory(id: string): void {
    this.http.delete<void>(`${API_BASE_URL}/categories/${id}`).subscribe({
      next: () => this.refreshCategories(),
      error: (error) => console.error('Failed to delete category', error)
    });
  }

  // Brands
  getBrands(): Observable<Brand[]> {
    if (this.brandsSubject.value.length === 0) {
      this.refreshBrands();
    }

    return this.brands$;
  }

  addBrand(brand: Omit<Brand, 'id' | 'createdAt'>): void {
    this.http.post<Brand>(`${API_BASE_URL}/brands`, brand).subscribe({
      next: () => this.refreshBrands(),
      error: (error) => console.error('Failed to add brand', error)
    });
  }

  updateBrand(id: string, brand: Partial<Brand>): void {
    this.http.put<Brand>(`${API_BASE_URL}/brands/${id}`, brand).subscribe({
      next: () => this.refreshBrands(),
      error: (error) => console.error('Failed to update brand', error)
    });
  }

  deleteBrand(id: string): void {
    this.http.delete<void>(`${API_BASE_URL}/brands/${id}`).subscribe({
      next: () => this.refreshBrands(),
      error: (error) => console.error('Failed to delete brand', error)
    });
  }

  // Products
  getProducts(): Observable<Product[]> {
    if (this.productsSubject.value.length === 0) {
      this.refreshProducts();
    }

    return this.products$;
  }

  getProduct(id: string): Product | undefined {
    return this.productsSubject.value.find((product) => product.id === id);
  }

  addProduct(product: Omit<Product, 'id' | 'createdAt'>): void {
    this.http.post<Product>(`${API_BASE_URL}/products`, product).subscribe({
      next: () => this.refreshProducts(),
      error: (error) => console.error('Failed to add product', error)
    });
  }

  updateProduct(id: string, product: Partial<Product>): void {
    this.http.put<Product>(`${API_BASE_URL}/products/${id}`, product).subscribe({
      next: () => this.refreshProducts(),
      error: (error) => console.error('Failed to update product', error)
    });
  }

  deleteProduct(id: string): void {
    this.http.delete<void>(`${API_BASE_URL}/products/${id}`).subscribe({
      next: () => this.refreshProducts(),
      error: (error) => console.error('Failed to delete product', error)
    });
  }

  // Orders
  addOrder(order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Observable<Order> {
    return this.http.post<Order>(`${API_BASE_URL}/orders`, order);
  }

  getMyOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${API_BASE_URL}/orders/my`);
  }

  getAdminOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${API_BASE_URL}/admin/orders`);
  }
}