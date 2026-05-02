import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AdminPaginationComponent } from '../../../components/admin-pagination/admin-pagination.component';
import { ConfirmDialogComponent } from '../../../components/confirm-dialog/confirm-dialog.component';
import {
  Brand,
  Category,
  Product,
} from '../../../models/interfaces';
import { DataService } from '../../../services/data.service';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminPaginationComponent, ConfirmDialogComponent],
  template: `
    <div class="space-y-6">
      <div class="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div class="flex items-center gap-4">
          <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-600 text-white shadow-lg shadow-indigo-500/30">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
            </svg>
          </div>
          <div>
            <h1 class="text-2xl font-bold text-slate-900 sm:text-3xl">Manage Products</h1>
            <p class="text-sm text-slate-500">Create, update, and monitor your full product catalog.</p>
          </div>
        </div>
        <button (click)="showAddForm = true" class="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 hover:from-sky-700 hover:to-indigo-700 transition">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
          </svg>
          Add Product
        </button>
      </div>

      <div *ngIf="showAddForm || editingProduct" class="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg animate-fade-in">
        <!-- Accent bar -->
        <div class="h-1.5 w-full bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-500"></div>

        <!-- Form header -->
        <div class="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5">
          <div class="flex items-center gap-4">
            <div class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl text-white shadow-md"
                 [style.background]="editingProduct ? 'linear-gradient(135deg,#f59e0b 0%,#ea580c 100%)' : 'linear-gradient(135deg,#0ea5e9 0%,#6366f1 100%)'">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="white" stroke-width="2.4">
                <path *ngIf="!editingProduct" stroke-linecap="round" stroke-linejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                <path *ngIf="editingProduct" stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
              </svg>
            </div>
            <div>
              <h2 class="text-xl font-bold text-slate-900">{{ editingProduct ? 'Edit Product' : 'Add New Product' }}</h2>
              <p class="text-sm text-slate-500">{{ editingProduct ? 'Update details of the existing product.' : 'Fill in details to add a new product to your catalog.' }}</p>
            </div>
          </div>
          <button type="button" (click)="cancelEdit()" aria-label="Close form"
                  class="inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <form (ngSubmit)="saveProduct()" class="space-y-6 p-6">
          <!-- Section: Basic Info -->
          <div class="space-y-4">
            <div class="flex items-center gap-2">
              <span class="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-100 text-sky-700">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </span>
              <h3 class="text-sm font-bold uppercase tracking-wider text-slate-700">Basic Info</h3>
              <div class="h-px flex-1 bg-slate-200"></div>
            </div>

            <div>
              <label class="block text-xs font-semibold uppercase tracking-wide text-slate-600 mb-1.5">Product Name <span class="text-rose-500">*</span></label>
              <input [(ngModel)]="productForm.name" name="name" required class="input-field" placeholder="e.g. Wireless Headphones">
            </div>

            <div>
              <label class="block text-xs font-semibold uppercase tracking-wide text-slate-600 mb-1.5">Description</label>
              <textarea [(ngModel)]="productForm.description" name="description" rows="3" class="input-field resize-none" placeholder="Briefly describe the product…"></textarea>
            </div>
          </div>

          <!-- Section: Pricing -->
          <div class="space-y-4">
            <div class="flex items-center gap-2">
              <span class="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </span>
              <h3 class="text-sm font-bold uppercase tracking-wider text-slate-700">Pricing</h3>
              <div class="h-px flex-1 bg-slate-200"></div>
            </div>

            <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <label class="block text-xs font-semibold uppercase tracking-wide text-slate-600 mb-1.5">Price <span class="text-rose-500">*</span></label>
                <div class="relative">
                  <span class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">$</span>
                  <input [(ngModel)]="productForm.price" name="price" type="number" step="0.01" required class="input-field pl-7" placeholder="0.00">
                </div>
              </div>
              <div>
                <label class="block text-xs font-semibold uppercase tracking-wide text-slate-600 mb-1.5">Original Price</label>
                <div class="relative">
                  <span class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">$</span>
                  <input [(ngModel)]="productForm.originalPrice" name="originalPrice" type="number" step="0.01" class="input-field pl-7" placeholder="0.00">
                </div>
              </div>
              <div>
                <label class="block text-xs font-semibold uppercase tracking-wide text-slate-600 mb-1.5">Discount</label>
                <div class="relative">
                  <input [(ngModel)]="productForm.discount" name="discount" type="number" class="input-field pr-8" placeholder="0">
                  <span class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">%</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Section: Inventory & Classification -->
          <div class="space-y-4">
            <div class="flex items-center gap-2">
              <span class="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                </svg>
              </span>
              <h3 class="text-sm font-bold uppercase tracking-wider text-slate-700">Inventory & Classification</h3>
              <div class="h-px flex-1 bg-slate-200"></div>
            </div>

            <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <label class="block text-xs font-semibold uppercase tracking-wide text-slate-600 mb-1.5">Stock <span class="text-rose-500">*</span></label>
                <input [(ngModel)]="productForm.stock" name="stock" type="number" required class="input-field" placeholder="0">
              </div>
              <div>
                <label class="block text-xs font-semibold uppercase tracking-wide text-slate-600 mb-1.5">Category <span class="text-rose-500">*</span></label>
                <select [(ngModel)]="productForm.categoryId" name="categoryId" required class="input-field">
                  <option value="">Select category</option>
                  <option *ngFor="let category of categories" [value]="category.id">{{ category.name }}</option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-semibold uppercase tracking-wide text-slate-600 mb-1.5">Brand <span class="text-rose-500">*</span></label>
                <select [(ngModel)]="productForm.brandId" name="brandId" required class="input-field">
                  <option value="">Select brand</option>
                  <option *ngFor="let brand of brands" [value]="brand.id">{{ brand.name }}</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Section: Media -->
          <div class="space-y-4">
            <div class="flex items-center gap-2">
              <span class="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-100 text-purple-700">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
              </span>
              <h3 class="text-sm font-bold uppercase tracking-wider text-slate-700">Product Images</h3>
              <div class="h-px flex-1 bg-slate-200"></div>
            </div>

            <div>
              <label class="block text-xs font-semibold uppercase tracking-wide text-slate-600 mb-1.5">Image URLs <span class="ml-1 font-normal normal-case tracking-normal text-slate-400">(one per line)</span></label>
              <textarea [(ngModel)]="imageUrls" (ngModelChange)="imageUrls = $event" name="imageUrls" rows="3" class="input-field font-mono text-sm resize-none" placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"></textarea>
            </div>

            <div *ngIf="imagePreviewList.length > 0" class="flex flex-wrap gap-3">
              <div *ngFor="let url of imagePreviewList" class="group relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-100 shadow-sm">
                <img [src]="url" class="h-full w-full object-cover" (error)="onImageError($event)">
                <div class="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition"></div>
              </div>
            </div>
          </div>

          <!-- Section: Features -->
          <div class="space-y-4">
            <div class="flex items-center gap-2">
              <span class="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
                </svg>
              </span>
              <h3 class="text-sm font-bold uppercase tracking-wider text-slate-700">Key Features</h3>
              <div class="h-px flex-1 bg-slate-200"></div>
            </div>

            <div>
              <label class="block text-xs font-semibold uppercase tracking-wide text-slate-600 mb-1.5">Features <span class="ml-1 font-normal normal-case tracking-normal text-slate-400">(one per line)</span></label>
              <textarea [(ngModel)]="featuresText" name="featuresText" rows="3" class="input-field resize-none" placeholder="Noise Cancellation&#10;30-hour battery&#10;Quick charge"></textarea>
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
                    [style.background]="editingProduct ? 'linear-gradient(135deg,#f59e0b 0%,#ea580c 100%)' : 'linear-gradient(135deg,#0ea5e9 0%,#6366f1 100%)'"
                    [style.box-shadow]="editingProduct ? '0 10px 20px -5px rgba(245,158,11,0.45)' : '0 10px 20px -5px rgba(99,102,241,0.45)'">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="white" stroke-width="2.5">
                <path *ngIf="!editingProduct" stroke-linecap="round" stroke-linejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                <path *ngIf="editingProduct" stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
              </svg>
              {{ editingProduct ? 'Update Product' : 'Add Product' }}
            </button>
          </div>
        </form>
      </div>

      <!-- Table Toolbar: search + filters -->
      <div class="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div class="relative flex-1 lg:max-w-md">
          <svg class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <input type="text" [(ngModel)]="searchQuery" (ngModelChange)="currentPage = 1"
                 placeholder="Search by name, description…"
                 class="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 py-2.5 text-sm text-slate-700 focus:border-primary-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition">
        </div>

        <div class="flex flex-wrap items-center gap-2">
          <select [(ngModel)]="categoryFilter" (ngModelChange)="currentPage = 1"
                  class="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs sm:text-sm font-semibold text-slate-700 focus:border-primary-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20">
            <option value="">All categories</option>
            <option *ngFor="let cat of categories" [value]="cat.id">{{ cat.name }}</option>
          </select>
          <select [(ngModel)]="stockFilter" (ngModelChange)="currentPage = 1"
                  class="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs sm:text-sm font-semibold text-slate-700 focus:border-primary-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20">
            <option value="all">All stock</option>
            <option value="in-stock">In stock</option>
            <option value="low">Low (≤10)</option>
            <option value="out">Out of stock</option>
          </select>
          <select [(ngModel)]="sortBy"
                  class="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs sm:text-sm font-semibold text-slate-700 focus:border-primary-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20">
            <option value="name">Name A–Z</option>
            <option value="price-asc">Price ↑</option>
            <option value="price-desc">Price ↓</option>
            <option value="stock-asc">Stock ↑</option>
            <option value="stock-desc">Stock ↓</option>
          </select>
          <div class="rounded-xl border border-slate-200 bg-gradient-to-r from-sky-50 to-indigo-50 px-3 py-2 text-xs sm:text-sm font-bold text-indigo-700">
            {{ filteredProducts.length }} {{ filteredProducts.length === 1 ? 'item' : 'items' }}
          </div>
        </div>
      </div>

      <!-- Products Table -->
      <div class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100">
                <th class="px-4 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-slate-600 w-12">#</th>
                <th class="px-4 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-slate-600">Product</th>
                <th class="px-4 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-slate-600 hidden md:table-cell">Category</th>
                <th class="px-4 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-slate-600 hidden md:table-cell">Brand</th>
                <th class="px-4 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-slate-600">Price</th>
                <th class="px-4 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-slate-600">Stock</th>
                <th class="px-4 py-3.5 text-right text-[11px] font-bold uppercase tracking-wider text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 bg-white">
              <tr *ngFor="let product of paginatedProducts; let i = index"
                  [style.animation-delay]="i * 0.03 + 's'"
                  class="group relative transition-all duration-200 hover:bg-slate-50/70 animate-fade-in">
                <!-- # index -->
                <td class="px-4 py-4 align-middle">
                  <span class="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-600 group-hover:bg-indigo-100 group-hover:text-indigo-700 transition">
                    {{ ((currentPage - 1) * pageSize) + i + 1 }}
                  </span>
                </td>

                <!-- Product cell -->
                <td class="px-4 py-4 align-middle">
                  <div class="flex items-center gap-3">
                    <div class="relative flex-shrink-0">
                      <img [src]="product.images[0]" [alt]="product.name"
                           (error)="onImageError($event)"
                           class="h-14 w-14 rounded-xl object-cover ring-1 ring-slate-200 shadow-sm group-hover:ring-indigo-300 group-hover:scale-105 transition-all duration-200">
                      <span *ngIf="product.discount > 0"
                            class="absolute -left-1 -top-1 rounded-md px-1 py-0.5 text-[9px] font-extrabold text-white shadow-md"
                            style="background: linear-gradient(135deg,#f43f5e 0%,#db2777 100%);">
                        -{{ product.discount }}%
                      </span>
                    </div>
                    <div class="min-w-0">
                      <p class="text-sm font-bold text-slate-900 line-clamp-1 group-hover:text-indigo-700 transition">{{ product.name }}</p>
                      <p class="mt-0.5 text-xs text-slate-500 line-clamp-1">{{ product.description }}</p>
                      <!-- mobile-only category/brand chips -->
                      <div class="mt-1 flex flex-wrap gap-1 md:hidden">
                        <span class="inline-flex items-center rounded-full bg-sky-50 px-2 py-0.5 text-[10px] font-semibold text-sky-700">{{ getCategoryName(product.categoryId) }}</span>
                        <span class="inline-flex items-center rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold text-indigo-700">{{ getBrandName(product.brandId) }}</span>
                      </div>
                    </div>
                  </div>
                </td>

                <!-- Category -->
                <td class="px-4 py-4 align-middle hidden md:table-cell">
                  <span class="inline-flex items-center rounded-full bg-sky-50 px-2.5 py-1 text-xs font-semibold text-sky-700 ring-1 ring-sky-100">
                    {{ getCategoryName(product.categoryId) || '—' }}
                  </span>
                </td>

                <!-- Brand -->
                <td class="px-4 py-4 align-middle hidden md:table-cell">
                  <span class="inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700 ring-1 ring-indigo-100">
                    {{ getBrandName(product.brandId) || '—' }}
                  </span>
                </td>

                <!-- Price -->
                <td class="px-4 py-4 align-middle">
                  <div class="flex flex-col">
                    <span class="text-sm font-extrabold text-slate-900">{{ product.price | currency }}</span>
                    <span *ngIf="product.originalPrice > product.price" class="text-[11px] text-slate-400 line-through">
                      {{ product.originalPrice | currency }}
                    </span>
                  </div>
                </td>

                <!-- Stock -->
                <td class="px-4 py-4 align-middle">
                  <span class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ring-1"
                        [class.bg-emerald-50]="product.stock > 10"
                        [class.text-emerald-700]="product.stock > 10"
                        [class.ring-emerald-200]="product.stock > 10"
                        [class.bg-amber-50]="product.stock <= 10 && product.stock > 0"
                        [class.text-amber-700]="product.stock <= 10 && product.stock > 0"
                        [class.ring-amber-200]="product.stock <= 10 && product.stock > 0"
                        [class.bg-rose-50]="product.stock === 0"
                        [class.text-rose-700]="product.stock === 0"
                        [class.ring-rose-200]="product.stock === 0">
                    <span class="h-1.5 w-1.5 rounded-full"
                          [class.bg-emerald-500]="product.stock > 10"
                          [class.bg-amber-500]="product.stock <= 10 && product.stock > 0"
                          [class.bg-rose-500]="product.stock === 0"
                          [class.animate-pulse]="product.stock <= 10 && product.stock > 0"></span>
                    {{ product.stock === 0 ? 'Out' : product.stock }}
                  </span>
                </td>

                <!-- Actions -->
                <td class="px-4 py-4 align-middle">
                  <div class="flex items-center justify-end gap-2">
                    <button (click)="editProduct(product)" aria-label="Edit product"
                            class="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-slate-700 ring-1 ring-slate-200 shadow-sm transition hover:bg-slate-900 hover:text-white hover:ring-slate-900">
                      <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.25">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                      </svg>
                      <span class="hidden sm:inline">Edit</span>
                    </button>
                    <button (click)="deleteProduct(product.id)" aria-label="Delete product"
                            class="inline-flex items-center gap-1.5 rounded-lg bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-700 ring-1 ring-rose-200 shadow-sm transition hover:bg-rose-600 hover:text-white hover:ring-rose-600">
                      <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.25">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M10 7V4a1 1 0 011-1h2a1 1 0 011 1v3"/>
                      </svg>
                      <span class="hidden sm:inline">Delete</span>
                    </button>
                  </div>
                </td>
              </tr>

              <!-- Empty row state -->
              <tr *ngIf="filteredProducts.length === 0">
                <td colspan="7" class="px-4 py-14 text-center">
                  <div class="mx-auto flex max-w-sm flex-col items-center gap-3">
                    <div class="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
                      <svg class="h-8 w-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                      </svg>
                    </div>
                    <p class="text-sm font-bold text-slate-700">No products found</p>
                    <p class="text-xs text-slate-500">Try adjusting your search or filters.</p>
                    <button type="button" (click)="resetFilters()"
                            class="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition">
                      Reset filters
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <app-admin-pagination
        [totalItems]="filteredProducts.length"
        [pageSize]="pageSize"
        [currentPage]="currentPage"
        (pageChange)="onPageChange($event)"
      ></app-admin-pagination>

      <app-confirm-dialog
        [show]="deleteDialog.show"
        title="Delete Product"
        [message]="'Are you sure you want to delete this product? This action cannot be undone.'"
        [itemName]="deleteDialog.name"
        confirmLabel="Yes, Delete"
        variant="danger"
        (confirmed)="confirmDelete()"
        (cancelled)="cancelDelete()">
      </app-confirm-dialog>
    </div>
  `
})
export class AdminProductsComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];
  brands: Brand[] = [];
  showAddForm = false;
  editingProduct: Product | null = null;
  currentPage = 1;
  readonly pageSize = 8;

  searchQuery = '';
  categoryFilter = '';
  stockFilter: 'all' | 'in-stock' | 'low' | 'out' = 'all';
  sortBy: 'name' | 'price-asc' | 'price-desc' | 'stock-asc' | 'stock-desc' = 'name';

  productForm = {
    name: '',
    description: '',
    price: 0,
    originalPrice: 0,
    discount: 0,
    categoryId: '',
    brandId: '',
    stock: 0,
    rating: 0,
    reviews: 0
  };

  imageUrls = '';
  featuresText = '';

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.loadData();
  }

  get filteredProducts(): Product[] {
    const q = this.searchQuery.trim().toLowerCase();
    let list = this.products.filter(p => {
      if (q && !p.name.toLowerCase().includes(q) && !p.description.toLowerCase().includes(q)) return false;
      if (this.categoryFilter && p.categoryId !== this.categoryFilter) return false;
      if (this.stockFilter === 'in-stock' && p.stock <= 0) return false;
      if (this.stockFilter === 'low' && (p.stock === 0 || p.stock > 10)) return false;
      if (this.stockFilter === 'out' && p.stock !== 0) return false;
      return true;
    });

    list = [...list].sort((a, b) => {
      switch (this.sortBy) {
        case 'price-asc': return a.price - b.price;
        case 'price-desc': return b.price - a.price;
        case 'stock-asc': return a.stock - b.stock;
        case 'stock-desc': return b.stock - a.stock;
        default: return a.name.localeCompare(b.name);
      }
    });

    return list;
  }

  get paginatedProducts(): Product[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredProducts.slice(start, start + this.pageSize);
  }

  resetFilters(): void {
    this.searchQuery = '';
    this.categoryFilter = '';
    this.stockFilter = 'all';
    this.sortBy = 'name';
    this.currentPage = 1;
  }

  get imagePreviewList(): string[] {
    return this.imageUrls
      .split('\n')
      .map((u) => u.trim())
      .filter((u) => u.length > 0);
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement | null;
    if (img) {
      img.style.opacity = '0.15';
    }
  }

  loadData(): void {
    this.dataService.getProducts().subscribe((products) => {
      this.products = products;
      this.ensureValidPage();
    });

    this.dataService.getCategories().subscribe((categories) => {
      this.categories = categories;
    });

    this.dataService.getBrands().subscribe((brands) => {
      this.brands = brands;
    });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
  }

  private ensureValidPage(): void {
    const totalPages = Math.max(1, Math.ceil(this.filteredProducts.length / this.pageSize));
    if (this.currentPage > totalPages) {
      this.currentPage = totalPages;
    }
  }

  getCategoryName(categoryId: string): string {
    const category = this.categories.find((c) => c.id === categoryId);
    return category ? category.name : '';
  }

  getBrandName(brandId: string): string {
    const brand = this.brands.find((b) => b.id === brandId);
    return brand ? brand.name : '';
  }

  editProduct(product: Product): void {
    this.editingProduct = product;
    this.productForm = {
      name: product.name,
      description: product.description,
      price: product.price,
      originalPrice: product.originalPrice,
      discount: product.discount,
      categoryId: product.categoryId,
      brandId: product.brandId,
      stock: product.stock,
      rating: product.rating,
      reviews: product.reviews
    };
    this.imageUrls = product.images.join('\n');
    this.featuresText = product.features.join('\n');
    this.showAddForm = false;
  }

  saveProduct(): void {
    const images = this.imageUrls.split('\n').filter((url) => url.trim() !== '');
    const features = this.featuresText.split('\n').filter((feature) => feature.trim() !== '');

    const productData = {
      ...this.productForm,
      images,
      features,
      specifications: {}
    };

    if (this.editingProduct) {
      this.dataService.updateProduct(this.editingProduct.id, productData);
    } else {
      this.dataService.addProduct(productData);
    }

    this.cancelEdit();
  }

  deleteDialog = { show: false, id: '', name: '' };

  deleteProduct(id: string): void {
    const product = this.products.find(p => p.id === id);
    this.deleteDialog = { show: true, id, name: product?.name || '' };
  }

  confirmDelete(): void {
    if (this.deleteDialog.id) {
      this.dataService.deleteProduct(this.deleteDialog.id);
    }
    this.cancelDelete();
  }

  cancelDelete(): void {
    this.deleteDialog = { show: false, id: '', name: '' };
  }

  cancelEdit(): void {
    this.showAddForm = false;
    this.editingProduct = null;
    this.productForm = {
      name: '',
      description: '',
      price: 0,
      originalPrice: 0,
      discount: 0,
      categoryId: '',
      brandId: '',
      stock: 0,
      rating: 0,
      reviews: 0
    };
    this.imageUrls = '';
    this.featuresText = '';
  }
}