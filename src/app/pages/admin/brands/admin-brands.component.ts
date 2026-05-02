import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AdminPaginationComponent } from '../../../components/admin-pagination/admin-pagination.component';
import { ConfirmDialogComponent } from '../../../components/confirm-dialog/confirm-dialog.component';
import { Brand, Product } from '../../../models/interfaces';
import { DataService } from '../../../services/data.service';

@Component({
  selector: 'app-admin-brands',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminPaginationComponent, ConfirmDialogComponent],
  template: `
    <div class="space-y-6">
      <div class="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div class="flex items-center gap-4">
          <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 text-white shadow-lg shadow-purple-500/30">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M7 7h.01M7 3h5a2 2 0 011.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z"/>
            </svg>
          </div>
          <div>
            <h1 class="text-2xl font-bold text-slate-900 sm:text-3xl">Manage Brands</h1>
            <p class="text-sm text-slate-500">Keep brand information accurate and updated.</p>
          </div>
        </div>
        <button (click)="showAddForm = true" class="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-purple-500/30 hover:from-purple-700 hover:to-pink-700 transition">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
          </svg>
          Add Brand
        </button>
      </div>

      <div *ngIf="showAddForm || editingBrand" class="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg animate-fade-in">
        <!-- Accent bar -->
        <div class="h-1.5 w-full bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500"></div>

        <!-- Form header -->
        <div class="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5">
          <div class="flex items-center gap-4">
            <div class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl text-white shadow-md"
                 [style.background]="editingBrand ? 'linear-gradient(135deg,#f59e0b 0%,#ea580c 100%)' : 'linear-gradient(135deg,#a855f7 0%,#ec4899 100%)'">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="white" stroke-width="2.4">
                <path *ngIf="!editingBrand" stroke-linecap="round" stroke-linejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                <path *ngIf="editingBrand" stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
              </svg>
            </div>
            <div>
              <h2 class="text-xl font-bold text-slate-900">{{ editingBrand ? 'Edit Brand' : 'Add New Brand' }}</h2>
              <p class="text-sm text-slate-500">{{ editingBrand ? 'Update brand information.' : 'Add a new brand partner to your catalog.' }}</p>
            </div>
          </div>
          <button type="button" (click)="cancelEdit()" aria-label="Close form"
                  class="inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <form (ngSubmit)="saveBrand()" class="space-y-6 p-6">
          <!-- Section: Basic Info -->
          <div class="space-y-4">
            <div class="flex items-center gap-2">
              <span class="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-100 text-purple-700">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M7 7h.01M7 3h5a2 2 0 011.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z"/>
                </svg>
              </span>
              <h3 class="text-sm font-bold uppercase tracking-wider text-slate-700">Basic Info</h3>
              <div class="h-px flex-1 bg-slate-200"></div>
            </div>

            <div>
              <label class="block text-xs font-semibold uppercase tracking-wide text-slate-600 mb-1.5">Brand Name <span class="text-rose-500">*</span></label>
              <input [(ngModel)]="brandForm.name" name="name" required class="input-field" placeholder="e.g. TechPro">
            </div>

            <div>
              <label class="block text-xs font-semibold uppercase tracking-wide text-slate-600 mb-1.5">Description</label>
              <textarea [(ngModel)]="brandForm.description" name="description" rows="3" class="input-field resize-none" placeholder="Tell shoppers about this brand…"></textarea>
            </div>
          </div>

          <!-- Section: Logo -->
          <div class="space-y-4">
            <div class="flex items-center gap-2">
              <span class="flex h-7 w-7 items-center justify-center rounded-lg bg-pink-100 text-pink-700">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
              </span>
              <h3 class="text-sm font-bold uppercase tracking-wider text-slate-700">Brand Logo</h3>
              <div class="h-px flex-1 bg-slate-200"></div>
            </div>

            <div class="grid grid-cols-1 gap-4 md:grid-cols-[1fr_auto]">
              <div>
                <label class="block text-xs font-semibold uppercase tracking-wide text-slate-600 mb-1.5">Logo URL</label>
                <input [(ngModel)]="brandForm.logo" name="logo" type="url" class="input-field font-mono text-sm" placeholder="https://example.com/logo.png">
                <p class="mt-1.5 text-xs text-slate-400">Recommended: square format (1:1) on transparent background.</p>
              </div>

              <div class="flex items-end">
                <div class="relative h-24 w-24 overflow-hidden rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-2">
                  <img *ngIf="brandForm.logo" [src]="brandForm.logo" class="h-full w-full object-contain" (error)="onImageError($event)">
                  <div *ngIf="!brandForm.logo" class="absolute inset-0 flex flex-col items-center justify-center gap-1 text-slate-400">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M7 7h.01M7 3h5a2 2 0 011.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z"/>
                    </svg>
                    <span class="text-[10px] font-medium uppercase tracking-wider">Logo</span>
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
                    [style.background]="editingBrand ? 'linear-gradient(135deg,#f59e0b 0%,#ea580c 100%)' : 'linear-gradient(135deg,#a855f7 0%,#ec4899 100%)'"
                    [style.box-shadow]="editingBrand ? '0 10px 20px -5px rgba(245,158,11,0.45)' : '0 10px 20px -5px rgba(236,72,153,0.45)'">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="white" stroke-width="2.5">
                <path *ngIf="!editingBrand" stroke-linecap="round" stroke-linejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                <path *ngIf="editingBrand" stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
              </svg>
              {{ editingBrand ? 'Update Brand' : 'Add Brand' }}
            </button>
          </div>
        </form>
      </div>

      <div *ngIf="brands.length > 0" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <div *ngFor="let brand of paginatedBrands; let i = index"
             [style.animation-delay]="i * 0.05 + 's'"
             class="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-purple-200 animate-fade-in">

          <!-- Decorative gradient top strip -->
          <div class="h-1.5 w-full" style="background: linear-gradient(90deg,#a855f7 0%,#ec4899 100%);"></div>

          <!-- Logo cover area -->
          <div class="relative h-48 w-full overflow-hidden bg-gradient-to-br from-purple-50 via-pink-50 to-slate-50">
            <!-- Blurred background layer (same image, dimmed) -->
            <img [src]="brand.logo" alt="" aria-hidden="true"
                 class="absolute inset-0 h-full w-full object-cover scale-110 blur-2xl opacity-40">

            <!-- Foreground image filling the box -->
            <img [src]="brand.logo" [alt]="brand.name"
                 (error)="onImageError($event)"
                 class="relative z-10 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110">

            <!-- Subtle gradient overlay for badge contrast -->
            <div class="absolute inset-x-0 top-0 z-20 h-20 bg-gradient-to-b from-slate-900/20 to-transparent"></div>

            <!-- Top-right: Product count badge -->
            <div class="absolute right-3 top-3 z-30 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 text-xs font-bold text-slate-800 shadow-md backdrop-blur">
              <svg class="h-3 w-3 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
              </svg>
              {{ getProductCount(brand.id) }}
            </div>
          </div>

          <!-- Content -->
          <div class="flex flex-1 flex-col p-5 text-center">
            <h3 class="text-lg font-extrabold text-slate-900 transition group-hover:text-purple-700 line-clamp-1">{{ brand.name }}</h3>
            <p class="mt-1.5 text-sm text-slate-600 line-clamp-2 min-h-[2.5rem]">
              {{ brand.description || 'No description added yet.' }}
            </p>

            <!-- Meta chips -->
            <div class="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs">
              <span class="inline-flex items-center gap-1 rounded-full bg-purple-50 px-2 py-0.5 font-semibold text-purple-700 ring-1 ring-purple-100">
                <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
                {{ getProductCount(brand.id) }} {{ getProductCount(brand.id) === 1 ? 'product' : 'products' }}
              </span>
              <span *ngIf="brand.createdAt" class="inline-flex items-center gap-1 text-slate-500">
                <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                {{ brand.createdAt | date:'mediumDate' }}
              </span>
            </div>

            <!-- Actions -->
            <div class="mt-4 flex items-center gap-2 border-t border-slate-100 pt-4">
              <button (click)="editBrand(brand)" aria-label="Edit brand"
                      class="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-white px-3 py-2 text-xs font-bold text-slate-700 ring-1 ring-slate-200 shadow-sm transition hover:bg-slate-900 hover:text-white hover:ring-slate-900 hover:shadow-md">
                <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.25">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                </svg>
                Edit
              </button>
              <button (click)="deleteBrand(brand.id)" aria-label="Delete brand"
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
        [totalItems]="brands.length"
        [pageSize]="pageSize"
        [currentPage]="currentPage"
        (pageChange)="onPageChange($event)"
      ></app-admin-pagination>

      <div *ngIf="brands.length === 0" class="admin-surface p-10 text-center">
        <h3 class="text-xl font-semibold text-slate-900 mb-2">No brands found</h3>
        <p class="text-slate-600 mb-6">Add brands to structure your catalog better.</p>
        <button (click)="showAddForm = true" class="btn-primary">Add Brand</button>
      </div>

      <app-confirm-dialog
        [show]="deleteDialog.show"
        title="Delete Brand"
        [message]="'Are you sure you want to delete this brand? Products linked to it will need to be reassigned.'"
        [itemName]="deleteDialog.name"
        confirmLabel="Yes, Delete"
        variant="danger"
        (confirmed)="confirmDelete()"
        (cancelled)="cancelDelete()">
      </app-confirm-dialog>
    </div>
  `
})
export class AdminBrandsComponent implements OnInit {
  brands: Brand[] = [];
  products: Product[] = [];
  showAddForm = false;
  editingBrand: Brand | null = null;
  currentPage = 1;
  readonly pageSize = 6;

  brandForm = {
    name: '',
    description: '',
    logo: ''
  };

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.dataService.getBrands().subscribe((brands) => {
      this.brands = brands;
      this.ensureValidPage();
    });
    this.dataService.getProducts().subscribe((products) => {
      this.products = products;
    });
  }

  getProductCount(brandId: string): number {
    return this.products.filter(p => p.brandId === brandId).length;
  }

  get paginatedBrands(): Brand[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.brands.slice(start, start + this.pageSize);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
  }

  private ensureValidPage(): void {
    const totalPages = Math.max(1, Math.ceil(this.brands.length / this.pageSize));
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

  editBrand(brand: Brand): void {
    this.editingBrand = brand;
    this.brandForm = {
      name: brand.name,
      description: brand.description,
      logo: brand.logo
    };
    this.showAddForm = false;
  }

  saveBrand(): void {
    if (this.editingBrand) {
      this.dataService.updateBrand(this.editingBrand.id, this.brandForm);
    } else {
      this.dataService.addBrand(this.brandForm);
    }

    this.cancelEdit();
  }

  deleteDialog = { show: false, id: '', name: '' };

  deleteBrand(id: string): void {
    const brand = this.brands.find(b => b.id === id);
    this.deleteDialog = { show: true, id, name: brand?.name || '' };
  }

  confirmDelete(): void {
    if (this.deleteDialog.id) {
      this.dataService.deleteBrand(this.deleteDialog.id);
    }
    this.cancelDelete();
  }

  cancelDelete(): void {
    this.deleteDialog = { show: false, id: '', name: '' };
  }

  cancelEdit(): void {
    this.showAddForm = false;
    this.editingBrand = null;
    this.brandForm = {
      name: '',
      description: '',
      logo: ''
    };
  }
}