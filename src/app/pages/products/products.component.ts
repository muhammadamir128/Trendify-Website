import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  ActivatedRoute,
  RouterModule,
} from '@angular/router';

import {
  Brand,
  Category,
  Product,
} from '../../models/interfaces';
import { CartService } from '../../services/cart.service';
import { DataService } from '../../services/data.service';
import { WishlistService } from '../../services/wishlist.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="animate-fade-in">
      <!-- Page hero -->
      <section class="relative overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-sky-900 py-12 text-white">
        <div class="absolute -right-16 -top-16 h-72 w-72 rounded-full bg-sky-500/20 blur-3xl"></div>
        <div class="absolute -left-10 -bottom-10 h-56 w-56 rounded-full bg-indigo-500/20 blur-3xl"></div>
        <div class="container relative mx-auto px-4">
          <nav class="mb-4 text-xs">
            <ol class="flex items-center gap-2 text-slate-300">
              <li><a routerLink="/" class="hover:text-white transition">Home</a></li>
              <li class="text-slate-500">/</li>
              <li class="font-semibold text-white">Products</li>
            </ol>
          </nav>
          <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <span class="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-sky-100">
                <span class="h-1.5 w-1.5 rounded-full bg-sky-300 animate-pulse"></span>
                Shop the catalog
              </span>
              <h1 class="mt-3 text-3xl font-extrabold sm:text-4xl">Explore Products</h1>
              <p class="mt-2 max-w-xl text-sm text-slate-200 sm:text-base">
                Browse our full collection — filter by category, brand, and price to find exactly what you need.
              </p>
            </div>
            <div class="flex flex-col items-start gap-2 md:items-end">
              <div class="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur">
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
                {{ products.length }} Total Products
              </div>
            </div>
          </div>
        </div>
      </section>

      <div class="container mx-auto px-4 py-8">
        <!-- Search bar -->
        <div class="relative mx-auto mb-6 max-w-3xl">
          <input type="text" [(ngModel)]="searchQuery" (input)="onSearchChange()"
                 placeholder="Search products, brands, categories..."
                 class="w-full rounded-2xl border border-slate-200 bg-white py-4 pl-14 pr-24 text-base shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition">
          <svg class="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <button *ngIf="searchQuery" (click)="clearSearch()"
                  class="absolute right-4 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition">
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

      <div class="flex flex-col lg:flex-row gap-8">
        <!-- Filters Sidebar -->
        <aside class="lg:w-72 lg:flex-shrink-0">
          <div class="sticky top-24 space-y-4">
            <div class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div class="flex items-center justify-between border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white px-5 py-4">
                <div class="flex items-center gap-2">
                  <svg class="h-5 w-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/>
                  </svg>
                  <h3 class="text-base font-bold text-slate-900">Filters</h3>
                </div>
                <button (click)="clearFilters()" class="text-xs font-semibold text-rose-600 hover:text-rose-700">Clear all</button>
              </div>

              <div class="space-y-6 p-5">
                <!-- Category -->
                <div>
                  <label class="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700">
                    <svg class="h-3.5 w-3.5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.25"><path stroke-linecap="round" stroke-linejoin="round" d="M19 11H5m14-4H5m14 8H5m14 4H5"/></svg>
                    Category
                  </label>
                  <select [(ngModel)]="selectedCategory" (change)="filterProducts()" class="input-field">
                    <option value="">All Categories</option>
                    <option *ngFor="let category of categories" [value]="category.id">{{ category.name }}</option>
                  </select>
                </div>

                <!-- Brand -->
                <div>
                  <label class="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700">
                    <svg class="h-3.5 w-3.5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.25"><path stroke-linecap="round" stroke-linejoin="round" d="M7 7h.01M7 3h5a2 2 0 011.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z"/></svg>
                    Brand
                  </label>
                  <select [(ngModel)]="selectedBrand" (change)="filterProducts()" class="input-field">
                    <option value="">All Brands</option>
                    <option *ngFor="let brand of brands" [value]="brand.id">{{ brand.name }}</option>
                  </select>
                </div>

                <!-- Price -->
                <div>
                  <label class="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700">
                    <svg class="h-3.5 w-3.5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.25"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    Price Range
                  </label>
                  <div class="flex gap-2">
                    <div class="relative flex-1">
                      <span class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">$</span>
                      <input type="number" [(ngModel)]="minPrice" (input)="filterProducts()" placeholder="Min" class="input-field pl-6 text-sm">
                    </div>
                    <span class="flex items-center text-slate-400">–</span>
                    <div class="relative flex-1">
                      <span class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">$</span>
                      <input type="number" [(ngModel)]="maxPrice" (input)="filterProducts()" placeholder="Max" class="input-field pl-6 text-sm">
                    </div>
                  </div>
                  <div class="mt-2 flex flex-wrap gap-1.5">
                    <button *ngFor="let preset of pricePresets" type="button" (click)="applyPricePreset(preset)"
                            class="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-[11px] font-medium text-slate-700 hover:bg-slate-100 transition">
                      {{ preset.label }}
                    </button>
                  </div>
                </div>

                <!-- Rating -->
                <div>
                  <label class="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700">
                    <svg class="h-3.5 w-3.5 text-amber-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.363 1.118l1.287 3.957c.3.922-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.784.57-1.838-.196-1.54-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.05 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z"/></svg>
                    Customer Rating
                  </label>
                  <div class="space-y-1.5">
                    <label *ngFor="let r of ratingOptions" class="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 transition hover:bg-slate-50"
                           [class.bg-amber-50]="minRating === r.value">
                      <input type="radio" name="minRating" [value]="r.value" [(ngModel)]="minRating" (change)="filterProducts()"
                             class="h-4 w-4 text-amber-500 focus:ring-amber-500">
                      <div class="flex items-center gap-0.5">
                        <svg *ngFor="let s of [1,2,3,4,5]" class="h-3.5 w-3.5"
                             [class.text-amber-400]="r.value > 0 && s <= r.value"
                             [class.text-slate-200]="r.value === 0 || s > r.value"
                             fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.363 1.118l1.287 3.957c.3.922-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.784.57-1.838-.196-1.54-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.05 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z"/>
                        </svg>
                      </div>
                      <span class="text-xs font-medium text-slate-700">{{ r.label }}</span>
                    </label>
                  </div>
                </div>

                <!-- Availability -->
                <div>
                  <label class="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700">
                    <svg class="h-3.5 w-3.5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.25"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
                    Availability
                  </label>
                  <div class="space-y-2">
                    <label class="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 transition hover:bg-slate-50">
                      <input type="checkbox" [(ngModel)]="inStockOnly" (change)="filterProducts()"
                             class="h-4 w-4 rounded text-emerald-600 focus:ring-emerald-500">
                      <span class="text-xs font-medium text-slate-700">In stock only</span>
                    </label>
                    <label class="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 transition hover:bg-slate-50">
                      <input type="checkbox" [(ngModel)]="onSaleOnly" (change)="filterProducts()"
                             class="h-4 w-4 rounded text-rose-600 focus:ring-rose-500">
                      <span class="text-xs font-medium text-slate-700">On sale</span>
                    </label>
                  </div>
                </div>

                <!-- Sort -->
                <div>
                  <label class="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700">
                    <svg class="h-3.5 w-3.5 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.25"><path stroke-linecap="round" stroke-linejoin="round" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"/></svg>
                    Sort By
                  </label>
                  <select [(ngModel)]="sortBy" (change)="sortProducts()" class="input-field">
                    <option value="name">Name (A-Z)</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Top Rated</option>
                    <option value="newest">Newest First</option>
                    <option value="discount">Biggest Discount</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Need help card -->
            <div class="rounded-2xl border border-slate-200 bg-gradient-to-br from-sky-50 to-indigo-50 p-5 shadow-sm">
              <div class="flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-md"
                   style="background: linear-gradient(135deg,#0ea5e9 0%,#6366f1 100%);">
                <svg class="h-5 w-5" fill="none" stroke="white" stroke-width="2.25" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              </div>
              <h4 class="mt-3 text-sm font-bold text-slate-900">Need help choosing?</h4>
              <p class="mt-1 text-xs text-slate-600">Our support team is here 24/7.</p>
              <a routerLink="/contact" class="mt-3 inline-flex text-xs font-semibold text-primary-600 hover:text-primary-700">Contact us →</a>
            </div>
          </div>
        </aside>

        <!-- Products Grid -->
        <div class="flex-1">
          <!-- Toolbar -->
          <div class="mb-5 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 class="text-lg font-bold text-slate-900">
                {{ searchQuery ? 'Search Results' : 'All Products' }}
              </h2>
              <p class="text-xs text-slate-500">
                Showing <span class="font-semibold text-slate-700">{{ paginatedProducts.length ? (currentPage - 1) * pageSize + 1 : 0 }}–{{ Math.min(currentPage * pageSize, filteredProducts.length) }}</span>
                of <span class="font-semibold text-slate-700">{{ filteredProducts.length }}</span> products
                <span *ngIf="searchQuery"> for <span class="font-semibold text-primary-600">"{{ searchQuery }}"</span></span>
              </p>
            </div>
            <div class="flex flex-wrap items-center gap-2">
              <!-- Per-page -->
              <div class="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1">
                <span class="text-[11px] font-semibold text-slate-500">Show:</span>
                <select [(ngModel)]="pageSize" (change)="currentPage = 1"
                        class="bg-transparent py-0.5 text-xs font-semibold text-slate-700 focus:outline-none">
                  <option [ngValue]="12">12</option>
                  <option [ngValue]="24">24</option>
                  <option [ngValue]="48">48</option>
                </select>
              </div>

              <!-- View toggle -->
              <div class="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-1">
                <button type="button" (click)="viewMode = 'grid'" [attr.aria-pressed]="viewMode === 'grid'"
                        class="inline-flex h-7 w-7 items-center justify-center rounded-md transition"
                        [class.bg-white]="viewMode === 'grid'"
                        [class.shadow-sm]="viewMode === 'grid'"
                        [class.text-primary-600]="viewMode === 'grid'"
                        [class.text-slate-500]="viewMode !== 'grid'">
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.25"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>
                </button>
                <button type="button" (click)="viewMode = 'list'" [attr.aria-pressed]="viewMode === 'list'"
                        class="inline-flex h-7 w-7 items-center justify-center rounded-md transition"
                        [class.bg-white]="viewMode === 'list'"
                        [class.shadow-sm]="viewMode === 'list'"
                        [class.text-primary-600]="viewMode === 'list'"
                        [class.text-slate-500]="viewMode !== 'list'">
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.25"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"/></svg>
                </button>
              </div>

              <!-- Sort -->
              <select [(ngModel)]="sortBy" (change)="sortProducts()"
                      class="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500/20">
                <option value="name">Name</option>
                <option value="price-low">Price ↑</option>
                <option value="price-high">Price ↓</option>
                <option value="rating">Rating</option>
                <option value="newest">Newest</option>
                <option value="discount">Biggest Discount</option>
              </select>
            </div>
          </div>

          <!-- Active filter chips -->
          <div *ngIf="hasActiveFilters" class="mb-5 flex flex-wrap items-center gap-2">
            <span class="text-xs font-semibold text-slate-500">Active:</span>
            <span *ngIf="selectedCategory"
                  class="inline-flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
              {{ getCategoryName(selectedCategory) }}
              <button (click)="selectedCategory = ''; filterProducts()" class="hover:text-indigo-900">
                <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </span>
            <span *ngIf="selectedBrand"
                  class="inline-flex items-center gap-1.5 rounded-full border border-purple-200 bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700">
              {{ getBrandName(selectedBrand) }}
              <button (click)="selectedBrand = ''; filterProducts()" class="hover:text-purple-900">
                <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </span>
            <span *ngIf="minPrice !== null || maxPrice !== null"
                  class="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              \${{ minPrice ?? 0 }} – \${{ maxPrice ?? '∞' }}
              <button (click)="minPrice = null; maxPrice = null; filterProducts()" class="hover:text-emerald-900">
                <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </span>
            <span *ngIf="searchQuery"
                  class="inline-flex items-center gap-1.5 rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">
              Search: "{{ searchQuery }}"
              <button (click)="clearSearch()" class="hover:text-sky-900">
                <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </span>
            <button (click)="clearFilters()" class="ml-auto text-xs font-semibold text-rose-600 hover:text-rose-700">Clear all</button>
          </div>

          <div [ngClass]="viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'flex flex-col gap-4'">
            <div *ngFor="let product of paginatedProducts; let i = index"
                 [style.animation-delay]="i * 0.05 + 's'"
                 [ngClass]="viewMode === 'grid'
                   ? 'group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:border-transparent animate-fade-in'
                   : 'group relative flex flex-col sm:flex-row overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md animate-fade-in'">
              <!-- Image frame -->
              <div class="relative overflow-hidden bg-slate-100"
                   [class.sm:w-64]="viewMode === 'list'"
                   [class.flex-shrink-0]="viewMode === 'list'">
                <a [routerLink]="'/product/' + product.id" class="block">
                  <img [src]="product.images[0]" [alt]="product.name"
                       class="w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                       [class.h-56]="viewMode === 'grid'"
                       [class.h-full]="viewMode === 'list'"
                       [class.sm:h-full]="viewMode === 'list'">
                </a>

                <!-- Gradient overlay on hover -->
                <div class="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>

                <!-- Discount pill -->
                <div *ngIf="product.discount > 0"
                     class="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold text-white shadow-md"
                     style="background: linear-gradient(135deg,#f43f5e 0%,#db2777 100%);">
                  <svg class="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M7 3a4 4 0 100 8 4 4 0 000-8zM3 7a4 4 0 118 0 4 4 0 01-8 0zm14 10a4 4 0 100 8 4 4 0 000-8zm-4 4a4 4 0 118 0 4 4 0 01-8 0zm8-18L3 21l1.5 1.5L21 5l-1-2z"/>
                  </svg>
                  -{{ product.discount }}%
                </div>

                <!-- Out of stock overlay -->
                <div *ngIf="product.stock === 0" class="absolute inset-0 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm">
                  <span class="rounded-full bg-white px-4 py-1 text-xs font-bold uppercase tracking-wider text-slate-900">Out of Stock</span>
                </div>

                <!-- Wishlist button -->
                <button (click)="toggleWishlist(product.id)" type="button"
                        [attr.aria-label]="isInWishlist(product.id) ? 'Remove from wishlist' : 'Add to wishlist'"
                        class="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 shadow-md backdrop-blur transition hover:scale-110 hover:shadow-lg">
                  <span *ngIf="isBursting(product.id)"
                        class="pointer-events-none absolute inset-0 rounded-full bg-rose-400 animate-heart-burst"></span>
                  <svg class="relative h-5 w-5 transition-colors"
                       [class.fill-rose-500]="isInWishlist(product.id)"
                       [class.text-rose-500]="isInWishlist(product.id)"
                       [class.fill-none]="!isInWishlist(product.id)"
                       [class.text-slate-400]="!isInWishlist(product.id)"
                       [class.animate-heart-pop]="isPopping(product.id)"
                       stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                  </svg>
                </button>

                <!-- Quick actions on hover -->
                <div class="pointer-events-none absolute inset-x-3 bottom-3 flex translate-y-2 justify-center gap-2 opacity-0 transition-all duration-300 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100">
                  <a [routerLink]="'/product/' + product.id"
                     class="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-white/95 px-3 py-2 text-xs font-semibold text-slate-900 shadow-lg backdrop-blur hover:bg-white">
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                    </svg>
                    Quick View
                  </a>
                </div>
              </div>

              <!-- Body -->
              <div class="flex flex-1 flex-col p-4">
                <!-- Category + Brand pills -->
                <div class="mb-2 flex flex-wrap items-center gap-1.5">
                  <span class="inline-flex items-center gap-1 rounded-full bg-sky-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-sky-700">
                    {{ getCategoryName(product.categoryId) }}
                  </span>
                  <span class="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-indigo-700">
                    {{ getBrandName(product.brandId) }}
                  </span>
                </div>

                <!-- Title -->
                <a [routerLink]="'/product/' + product.id" class="block">
                  <h3 class="text-base font-bold text-slate-900 transition group-hover:text-primary-600 line-clamp-1">{{ product.name }}</h3>
                </a>

                <p class="mt-1 text-xs text-slate-500 line-clamp-2 min-h-[2rem]">{{ product.description }}</p>

                <!-- Rating + reviews -->
                <div class="mt-2 flex items-center gap-1.5 text-xs">
                  <div class="flex items-center gap-0.5">
                    <svg *ngFor="let s of [1,2,3,4,5]" class="h-3.5 w-3.5"
                         [class.text-amber-400]="s <= roundedRating(product.rating)"
                         [class.text-slate-200]="s > roundedRating(product.rating)"
                         fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.363 1.118l1.287 3.957c.3.922-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.784.57-1.838-.196-1.54-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.05 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z"/>
                    </svg>
                  </div>
                  <span class="font-semibold text-slate-700">{{ product.rating }}</span>
                  <span class="text-slate-400">· {{ product.reviews }} reviews</span>
                </div>

                <!-- Price row -->
                <div class="mt-3 flex items-end gap-2 border-t border-slate-100 pt-3">
                  <span class="text-xl font-extrabold text-slate-900">\${{ product.price }}</span>
                  <span *ngIf="product.originalPrice > product.price" class="mb-0.5 text-sm text-slate-400 line-through">
                    \${{ product.originalPrice }}
                  </span>
                  <span *ngIf="product.originalPrice > product.price" class="mb-0.5 ml-auto text-xs font-semibold text-emerald-600">
                    Save \${{ (product.originalPrice - product.price).toFixed(2) }}
                  </span>
                </div>

                <!-- Actions -->
                <div class="mt-3">
                  <button (click)="addToCart(product)" [disabled]="product.stock === 0"
                          class="inline-flex w-full items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-white shadow-md transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                          style="background: linear-gradient(135deg,#0ea5e9 0%,#6366f1 100%); box-shadow: 0 6px 16px -4px rgba(99,102,241,0.45);">
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                    </svg>
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Pagination -->
          <div *ngIf="totalPages > 1" class="mt-8 flex flex-col items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm sm:flex-row sm:justify-between">
            <p class="text-xs text-slate-500">
              Page <span class="font-semibold text-slate-900">{{ currentPage }}</span> of <span class="font-semibold text-slate-900">{{ totalPages }}</span>
            </p>
            <div class="flex items-center gap-1.5">
              <button type="button" (click)="prevPage()" [disabled]="currentPage === 1"
                      class="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed">
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/></svg>
              </button>
              <button *ngFor="let n of pageNumbers" type="button" (click)="goToPage(n)"
                      class="inline-flex h-9 min-w-9 items-center justify-center rounded-lg px-3 text-sm font-semibold transition"
                      [class.text-white]="n === currentPage"
                      [class.shadow-md]="n === currentPage"
                      [class.border]="n !== currentPage"
                      [class.border-slate-200]="n !== currentPage"
                      [class.bg-white]="n !== currentPage"
                      [class.text-slate-700]="n !== currentPage"
                      [class.hover:bg-slate-50]="n !== currentPage"
                      [style.background]="n === currentPage ? 'linear-gradient(135deg,#0ea5e9 0%,#6366f1 100%)' : ''">
                {{ n }}
              </button>
              <button type="button" (click)="nextPage()" [disabled]="currentPage === totalPages"
                      class="inline-flex h-9 w-9 items-center justify-center rounded-lg text-white shadow-md transition hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
                      style="background: linear-gradient(135deg,#0ea5e9 0%,#6366f1 100%);">
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
              </button>
            </div>
          </div>

          <!-- No Products Found -->
          <div *ngIf="filteredProducts.length === 0" class="flex flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed border-slate-200 bg-white py-16 text-center">
            <div class="flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
              <svg class="h-10 w-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </div>
            <h3 class="text-xl font-bold text-slate-900">No products found</h3>
            <p class="max-w-md text-sm text-slate-500">
              {{ searchQuery ? 'Try different keywords or adjust your filters to find what you are looking for.' : 'Try adjusting your filters to see more products.' }}
            </p>
            <button (click)="clearFilters()"
                    class="mt-3 inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:opacity-90"
                    style="background: linear-gradient(135deg,#0ea5e9 0%,#6366f1 100%); box-shadow: 0 10px 20px -5px rgba(99,102,241,0.45);">
              Clear All Filters
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
            </button>
          </div>
        </div>
      </div>
      </div>
    </div>
  `
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  categories: Category[] = [];
  brands: Brand[] = [];
  
  searchQuery = '';
  selectedCategory = '';
  selectedBrand = '';
  minPrice: number | null = null;
  maxPrice: number | null = null;
  sortBy = 'name';
  
  showSuggestions = false;
  searchSuggestions: string[] = [];

  minRating = 0;
  inStockOnly = false;
  onSaleOnly = false;

  viewMode: 'grid' | 'list' = 'grid';
  currentPage = 1;
  pageSize = 12;
  readonly Math = Math;

  readonly pricePresets = [
    { label: '< $25', min: null, max: 25 },
    { label: '$25–$50', min: 25, max: 50 },
    { label: '$50–$100', min: 50, max: 100 },
    { label: '$100+', min: 100, max: null }
  ];

  readonly ratingOptions = [
    { label: 'All ratings', value: 0 },
    { label: '4 & up', value: 4 },
    { label: '3 & up', value: 3 },
    { label: '2 & up', value: 2 }
  ];

  private popIds = new Set<string>();
  private burstIds = new Set<string>();

  get hasActiveFilters(): boolean {
    return !!this.selectedCategory || !!this.selectedBrand ||
           this.minPrice !== null || this.maxPrice !== null ||
           !!this.searchQuery || this.minRating > 0 ||
           this.inStockOnly || this.onSaleOnly;
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredProducts.length / this.pageSize));
  }

  get paginatedProducts(): Product[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredProducts.slice(start, start + this.pageSize);
  }

  get pageNumbers(): number[] {
    const total = this.totalPages;
    const max = 5;
    if (total <= max) return Array.from({ length: total }, (_, i) => i + 1);
    const half = Math.floor(max / 2);
    let start = Math.max(1, this.currentPage - half);
    let end = Math.min(total, start + max - 1);
    if (end - start + 1 < max) start = Math.max(1, end - max + 1);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }

  prevPage(): void {
    if (this.currentPage > 1) { this.currentPage--; this.scrollToTop(); }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) { this.currentPage++; this.scrollToTop(); }
  }

  goToPage(n: number): void {
    if (n >= 1 && n <= this.totalPages) { this.currentPage = n; this.scrollToTop(); }
  }

  private scrollToTop(): void {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  applyPricePreset(preset: { min: number | null; max: number | null }): void {
    this.minPrice = preset.min;
    this.maxPrice = preset.max;
    this.filterProducts();
  }

  roundedRating(rating: number): number {
    return Math.round(rating);
  }

  isPopping(productId: string): boolean {
    return this.popIds.has(productId);
  }

  isBursting(productId: string): boolean {
    return this.burstIds.has(productId);
  }

  constructor(
    private dataService: DataService,
    private cartService: CartService,
    private wishlistService: WishlistService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadData();
    
    // Check for category filter from route params
    this.route.queryParams.subscribe(params => {
      if (params['category']) {
        this.selectedCategory = params['category'];
        this.filterProducts();
      }
      if (params['search']) {
        this.searchQuery = params['search'];
        this.filterProducts();
      }
    });
  }

  loadData(): void {
    this.dataService.getProducts().subscribe(products => {
      this.products = products;
      this.filteredProducts = [...products];
      this.sortProducts();
    });

    this.dataService.getCategories().subscribe(categories => {
      this.categories = categories;
    });

    this.dataService.getBrands().subscribe(brands => {
      this.brands = brands;
    });
  }

  onSearchChange(): void {
    this.generateSearchSuggestions();
    this.showSuggestions = this.searchQuery.length > 0;
    this.filterProducts();
  }

  generateSearchSuggestions(): void {
    if (this.searchQuery.length < 2) {
      this.searchSuggestions = [];
      return;
    }

    const suggestions = new Set<string>();
    const query = this.searchQuery.toLowerCase();

    // Add product name suggestions
    this.products.forEach(product => {
      if (product.name.toLowerCase().includes(query)) {
        suggestions.add(product.name);
      }
    });

    // Add category suggestions
    this.categories.forEach(category => {
      if (category.name.toLowerCase().includes(query)) {
        suggestions.add(category.name);
      }
    });

    // Add brand suggestions
    this.brands.forEach(brand => {
      if (brand.name.toLowerCase().includes(query)) {
        suggestions.add(brand.name);
      }
    });

    this.searchSuggestions = Array.from(suggestions).slice(0, 5);
  }

  selectSuggestion(suggestion: string): void {
    this.searchQuery = suggestion;
    this.showSuggestions = false;
    this.filterProducts();
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.showSuggestions = false;
    this.filterProducts();
  }

  filterProducts(): void {
    this.filteredProducts = this.products.filter(product => {
      const matchesSearch = !this.searchQuery ||
        product.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        this.getCategoryName(product.categoryId).toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        this.getBrandName(product.brandId).toLowerCase().includes(this.searchQuery.toLowerCase());

      const matchesCategory = !this.selectedCategory || product.categoryId === this.selectedCategory;
      const matchesBrand = !this.selectedBrand || product.brandId === this.selectedBrand;

      const matchesMinPrice = this.minPrice === null || product.price >= this.minPrice;
      const matchesMaxPrice = this.maxPrice === null || product.price <= this.maxPrice;

      const matchesRating = this.minRating === 0 || product.rating >= this.minRating;
      const matchesStock = !this.inStockOnly || product.stock > 0;
      const matchesSale = !this.onSaleOnly || product.discount > 0;

      return matchesSearch && matchesCategory && matchesBrand &&
             matchesMinPrice && matchesMaxPrice &&
             matchesRating && matchesStock && matchesSale;
    });

    this.currentPage = 1;
    this.sortProducts();
  }

  sortProducts(): void {
    this.filteredProducts.sort((a, b) => {
      switch (this.sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'discount':
          return b.discount - a.discount;
        default:
          return 0;
      }
    });
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.selectedCategory = '';
    this.selectedBrand = '';
    this.minPrice = null;
    this.maxPrice = null;
    this.minRating = 0;
    this.inStockOnly = false;
    this.onSaleOnly = false;
    this.sortBy = 'name';
    this.showSuggestions = false;
    this.currentPage = 1;
    this.filterProducts();
  }

  getCategoryName(categoryId: string): string {
    const category = this.categories.find(c => c.id === categoryId);
    return category ? category.name : '';
  }

  getBrandName(brandId: string): string {
    const brand = this.brands.find(b => b.id === brandId);
    return brand ? brand.name : '';
  }

  addToCart(product: Product): void {
    this.cartService.addToCart(product.id, product.price);
  }

  toggleWishlist(productId: string): void {
    const wasInWishlist = this.isInWishlist(productId);
    if (wasInWishlist) {
      this.wishlistService.removeFromWishlist(productId);
    } else {
      this.wishlistService.addToWishlist(productId);
      this.burstIds.add(productId);
      setTimeout(() => this.burstIds.delete(productId), 600);
    }

    this.popIds.add(productId);
    setTimeout(() => this.popIds.delete(productId), 600);
  }

  isInWishlist(productId: string): boolean {
    return this.wishlistService.isInWishlist(productId);
  }
}