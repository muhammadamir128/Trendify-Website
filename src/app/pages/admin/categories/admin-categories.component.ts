import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AdminPaginationComponent } from '../../../components/admin-pagination/admin-pagination.component';
import { ConfirmDialogComponent } from '../../../components/confirm-dialog/confirm-dialog.component';
import { Category, Product } from '../../../models/interfaces';
import { DataService } from '../../../services/data.service';

@Component({
  selector: 'app-admin-categories',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminPaginationComponent, ConfirmDialogComponent],
  template: `
    <div class="space-y-6">
      <div class="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div class="flex items-center gap-4">
          <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 11H5m14-4H5m14 8H5m14 4H5"/>
            </svg>
          </div>
          <div>
            <h1 class="text-2xl font-bold text-slate-900 sm:text-3xl">Manage Categories</h1>
            <p class="text-sm text-slate-500">Organize product discovery with clear store categories.</p>
          </div>
        </div>
        <button (click)="showAddForm = true" class="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 hover:from-indigo-700 hover:to-purple-700 transition">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
          </svg>
          Add Category
        </button>
      </div>

      <div *ngIf="showAddForm || editingCategory" class="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg animate-fade-in">
        <!-- Accent bar -->
        <div class="h-1.5 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500"></div>

        <!-- Form header -->
        <div class="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5">
          <div class="flex items-center gap-4">
            <div class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl text-white shadow-md"
                 [style.background]="editingCategory ? 'linear-gradient(135deg,#f59e0b 0%,#ea580c 100%)' : 'linear-gradient(135deg,#6366f1 0%,#a855f7 100%)'">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="white" stroke-width="2.4">
                <path *ngIf="!editingCategory" stroke-linecap="round" stroke-linejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                <path *ngIf="editingCategory" stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
              </svg>
            </div>
            <div>
              <h2 class="text-xl font-bold text-slate-900">{{ editingCategory ? 'Edit Category' : 'Add New Category' }}</h2>
              <p class="text-sm text-slate-500">{{ editingCategory ? 'Update an existing category group.' : 'Create a new category to organize your catalog.' }}</p>
            </div>
          </div>
          <button type="button" (click)="cancelEdit()" aria-label="Close form"
                  class="inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <form (ngSubmit)="saveCategory()" class="space-y-6 p-6">
          <!-- Section: Basic Info -->
          <div class="space-y-4">
            <div class="flex items-center gap-2">
              <span class="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </span>
              <h3 class="text-sm font-bold uppercase tracking-wider text-slate-700">Basic Info</h3>
              <div class="h-px flex-1 bg-slate-200"></div>
            </div>

            <div>
              <label class="block text-xs font-semibold uppercase tracking-wide text-slate-600 mb-1.5">Category Name <span class="text-rose-500">*</span></label>
              <input [(ngModel)]="categoryForm.name" name="name" required class="input-field" placeholder="e.g. Electronics">
            </div>

            <div>
              <label class="block text-xs font-semibold uppercase tracking-wide text-slate-600 mb-1.5">Description</label>
              <textarea [(ngModel)]="categoryForm.description" name="description" rows="3" class="input-field resize-none" placeholder="Briefly describe what this category represents…"></textarea>
            </div>
          </div>

          <!-- Section: Cover Image -->
          <div class="space-y-4">
            <div class="flex items-center gap-2">
              <span class="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-100 text-purple-700">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
              </span>
              <h3 class="text-sm font-bold uppercase tracking-wider text-slate-700">Cover Image</h3>
              <div class="h-px flex-1 bg-slate-200"></div>
            </div>

            <div class="grid grid-cols-1 gap-4 md:grid-cols-[1fr_auto]">
              <div>
                <label class="block text-xs font-semibold uppercase tracking-wide text-slate-600 mb-1.5">Image URL</label>
                <input [(ngModel)]="categoryForm.image" name="image" type="url" class="input-field font-mono text-sm" placeholder="https://example.com/image.jpg">
                <p class="mt-1.5 text-xs text-slate-400">Recommended: 800×600 landscape image.</p>
              </div>

              <div class="flex items-end">
                <div class="relative h-28 w-40 overflow-hidden rounded-xl border-2 border-dashed border-slate-200 bg-slate-50">
                  <img *ngIf="categoryForm.image" [src]="categoryForm.image" class="h-full w-full object-cover" (error)="onImageError($event)">
                  <div *ngIf="!categoryForm.image" class="absolute inset-0 flex flex-col items-center justify-center gap-1 text-slate-400">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                    </svg>
                    <span class="text-[10px] font-medium uppercase tracking-wider">Preview</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-end">
            <button type="button" (click)="cancelEdit()"
                    class="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition">
              Cancel
            </button>
            <button type="submit"
                    class="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:opacity-95"
                    [style.background]="editingCategory ? 'linear-gradient(135deg,#f59e0b 0%,#ea580c 100%)' : 'linear-gradient(135deg,#6366f1 0%,#a855f7 100%)'"
                    [style.box-shadow]="editingCategory ? '0 10px 20px -5px rgba(245,158,11,0.45)' : '0 10px 20px -5px rgba(168,85,247,0.45)'">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="white" stroke-width="2.5">
                <path *ngIf="!editingCategory" stroke-linecap="round" stroke-linejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                <path *ngIf="editingCategory" stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
              </svg>
              {{ editingCategory ? 'Update Category' : 'Add Category' }}
            </button>
          </div>
        </form>
      </div>

      <div *ngIf="categories.length > 0" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <div *ngFor="let category of paginatedCategories; let i = index"
             [style.animation-delay]="i * 0.05 + 's'"
             class="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-indigo-200 animate-fade-in">

          <!-- Image cover -->
          <div class="relative h-52 w-full overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200">
            <img [src]="category.image" [alt]="category.name"
                 (error)="onImageError($event)"
                 class="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110">

            <!-- Gradient overlay -->
            <div class="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/10 to-transparent opacity-80 transition group-hover:opacity-90"></div>

            <!-- Top-right: Product count badge -->
            <div class="absolute right-3 top-3 flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 text-xs font-bold text-slate-800 shadow-md backdrop-blur">
              <svg class="h-3 w-3 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
              </svg>
              {{ getProductCount(category.id) }} {{ getProductCount(category.id) === 1 ? 'product' : 'products' }}
            </div>

            <!-- Top-left: Status dot -->
            <div class="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-500/95 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-md backdrop-blur">
              <span class="h-1.5 w-1.5 rounded-full bg-white animate-pulse"></span>
              Active
            </div>

            <!-- Bottom-left: category title on image -->
            <div class="absolute bottom-0 left-0 right-0 p-4">
              <h3 class="text-xl font-extrabold text-white drop-shadow-md line-clamp-1">{{ category.name }}</h3>
            </div>
          </div>

          <!-- Content -->
          <div class="flex flex-1 flex-col p-5">
            <p class="text-sm text-slate-600 line-clamp-2 min-h-[2.5rem]">
              {{ category.description || 'No description added yet.' }}
            </p>

            <!-- Meta row -->
            <div class="mt-3 flex items-center gap-3 text-xs text-slate-500">
              <span class="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 font-semibold text-slate-600">
                <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/></svg>
                ID #{{ category.id }}
              </span>
              <span *ngIf="category.createdAt" class="inline-flex items-center gap-1">
                <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                {{ category.createdAt | date:'mediumDate' }}
              </span>
            </div>

            <!-- Actions -->
            <div class="mt-4 flex items-center gap-2 border-t border-slate-100 pt-4">
              <button (click)="editCategory(category)" aria-label="Edit category"
                      class="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-white px-3 py-2 text-xs font-bold text-slate-700 ring-1 ring-slate-200 shadow-sm transition hover:bg-slate-900 hover:text-white hover:ring-slate-900 hover:shadow-md">
                <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.25">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                </svg>
                Edit
              </button>
              <button (click)="deleteCategory(category.id)" aria-label="Delete category"
                      class="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-rose-50 px-3 py-2 text-xs font-bold text-rose-700 ring-1 ring-rose-200 shadow-sm transition hover:bg-rose-600 hover:text-white hover:ring-rose-600 hover:shadow-md">
                <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.25">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M10 7V4a1 1 0 011-1h2a1 1 0 011 1v3"/>
                </svg>
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      <app-admin-pagination
        [totalItems]="categories.length"
        [pageSize]="pageSize"
        [currentPage]="currentPage"
        (pageChange)="onPageChange($event)"
      ></app-admin-pagination>

      <div *ngIf="categories.length === 0" class="admin-surface p-10 text-center">
        <h3 class="text-xl font-semibold text-slate-900 mb-2">No categories found</h3>
        <p class="text-slate-600 mb-6">Create your first category to organize your products.</p>
        <button (click)="showAddForm = true" class="btn-primary">Add Category</button>
      </div>

      <app-confirm-dialog
        [show]="deleteDialog.show"
        title="Delete Category"
        [message]="'Are you sure you want to delete this category? Products linked to it will need to be reassigned.'"
        [itemName]="deleteDialog.name"
        confirmLabel="Yes, Delete"
        variant="danger"
        (confirmed)="confirmDelete()"
        (cancelled)="cancelDelete()">
      </app-confirm-dialog>
    </div>
  `
})
export class AdminCategoriesComponent implements OnInit {
  categories: Category[] = [];
  products: Product[] = [];
  showAddForm = false;
  editingCategory: Category | null = null;
  currentPage = 1;
  readonly pageSize = 6;

  categoryForm = {
    name: '',
    description: '',
    image: ''
  };

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.dataService.getCategories().subscribe((categories) => {
      this.categories = categories;
      this.ensureValidPage();
    });
    this.dataService.getProducts().subscribe((products) => {
      this.products = products;
    });
  }

  getProductCount(categoryId: string): number {
    return this.products.filter(p => p.categoryId === categoryId).length;
  }

  get paginatedCategories(): Category[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.categories.slice(start, start + this.pageSize);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
  }

  private ensureValidPage(): void {
    const totalPages = Math.max(1, Math.ceil(this.categories.length / this.pageSize));
    if (this.currentPage > totalPages) {
      this.currentPage = totalPages;
    }
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement | null;
    if (img) {
      img.style.opacity = '0.15';
    }
  }

  editCategory(category: Category): void {
    this.editingCategory = category;
    this.categoryForm = {
      name: category.name,
      description: category.description,
      image: category.image
    };
    this.showAddForm = false;
  }

  saveCategory(): void {
    if (this.editingCategory) {
      this.dataService.updateCategory(this.editingCategory.id, this.categoryForm);
    } else {
      this.dataService.addCategory(this.categoryForm);
    }

    this.cancelEdit();
  }

  deleteDialog = { show: false, id: '', name: '' };

  deleteCategory(id: string): void {
    const category = this.categories.find(c => c.id === id);
    this.deleteDialog = { show: true, id, name: category?.name || '' };
  }

  confirmDelete(): void {
    if (this.deleteDialog.id) {
      this.dataService.deleteCategory(this.deleteDialog.id);
    }
    this.cancelDelete();
  }

  cancelDelete(): void {
    this.deleteDialog = { show: false, id: '', name: '' };
  }

  cancelEdit(): void {
    this.showAddForm = false;
    this.editingCategory = null;
    this.categoryForm = {
      name: '',
      description: '',
      image: ''
    };
  }
}