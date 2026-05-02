import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import {
  Brand,
  Category,
  Product,
  WishlistItem,
} from '../../models/interfaces';
import { CartService } from '../../services/cart.service';
import { DataService } from '../../services/data.service';
import { WishlistService } from '../../services/wishlist.service';

type SortOption = 'recent' | 'price-asc' | 'price-desc' | 'name' | 'discount';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="min-h-screen bg-gradient-to-b from-rose-50/40 via-white to-white">
      <div class="container mx-auto px-4 py-8 sm:py-10 animate-fade-in">
        <!-- Hero Header -->
        <section class="relative overflow-hidden rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xl"
                 style="background: linear-gradient(135deg,#f43f5e 0%,#ec4899 45%,#a855f7 100%);">
          <!-- Decorative glows -->
          <div class="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/15 blur-3xl"></div>
          <div class="absolute -bottom-20 -left-10 h-72 w-72 rounded-full bg-pink-300/25 blur-3xl"></div>

          <div class="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div class="text-white">
              <span class="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/15 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.22em] backdrop-blur">
                <span class="h-1.5 w-1.5 rounded-full bg-white animate-pulse"></span>
                Your Wishlist
              </span>
              <h1 class="mt-3 text-3xl sm:text-4xl lg:text-5xl font-extrabold drop-shadow-sm">
                Saved with love <span class="inline-block animate-heart-pop">♥</span>
              </h1>
              <p class="mt-2 max-w-xl text-sm sm:text-base text-white/85">
                {{ wishlistItems.length === 0
                    ? 'Start adding products you love — we\\'ll keep them safe here.'
                    : wishlistItems.length + ' item' + (wishlistItems.length === 1 ? '' : 's') + ' waiting for the perfect moment to join your cart.' }}
              </p>
            </div>

            <!-- Stat pills -->
            <div *ngIf="wishlistItems.length > 0" class="grid grid-cols-3 gap-3 sm:gap-4 lg:flex lg:flex-wrap lg:gap-3">
              <div class="rounded-2xl border border-white/25 bg-white/15 p-3 sm:p-4 backdrop-blur-md text-white">
                <p class="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-white/80">Items</p>
                <p class="mt-1 text-xl sm:text-2xl font-extrabold">{{ wishlistItems.length }}</p>
              </div>
              <div class="rounded-2xl border border-white/25 bg-white/15 p-3 sm:p-4 backdrop-blur-md text-white">
                <p class="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-white/80">Total</p>
                <p class="mt-1 text-xl sm:text-2xl font-extrabold">\${{ totalValue.toFixed(0) }}</p>
              </div>
              <div class="rounded-2xl border border-white/25 bg-white/15 p-3 sm:p-4 backdrop-blur-md text-white">
                <p class="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-white/80">You Save</p>
                <p class="mt-1 text-xl sm:text-2xl font-extrabold">\${{ totalSavings.toFixed(0) }}</p>
              </div>
            </div>
          </div>
        </section>

        <!-- Toolbar -->
        <div *ngIf="wishlistItems.length > 0"
             class="mt-6 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div class="flex items-center gap-2">
            <button (click)="moveAllToCart()" type="button"
                    class="inline-flex items-center gap-2 rounded-xl px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow-md transition hover:opacity-90"
                    style="background: linear-gradient(135deg,#0ea5e9 0%,#6366f1 100%);">
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
              </svg>
              <span class="hidden xs:inline">Move all to cart</span>
              <span class="xs:hidden">All to cart</span>
            </button>
            <button (click)="clearAll()" type="button"
                    class="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-white px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-rose-600 shadow-sm transition hover:border-rose-600 hover:bg-rose-600 hover:text-white">
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.25">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M10 7V4a1 1 0 011-1h2a1 1 0 011 1v3"/>
              </svg>
              Clear all
            </button>
          </div>

          <div class="flex items-center gap-2">
            <label class="text-xs font-semibold uppercase tracking-wider text-slate-500">Sort</label>
            <div class="relative">
              <select [(ngModel)]="sortBy" (change)="applySort()"
                      class="appearance-none rounded-xl border border-slate-200 bg-slate-50 pl-3 pr-9 py-2 text-xs sm:text-sm font-semibold text-slate-700 focus:border-primary-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition">
                <option value="recent">Recently added</option>
                <option value="price-asc">Price: low to high</option>
                <option value="price-desc">Price: high to low</option>
                <option value="discount">Biggest discount</option>
                <option value="name">Name (A–Z)</option>
              </select>
              <svg class="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.25">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/>
              </svg>
            </div>
            <a routerLink="/products"
               class="hidden sm:inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs sm:text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition">
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.25">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
              </svg>
              Shop more
            </a>
          </div>
        </div>

        <!-- Cards Grid -->
        <div *ngIf="wishlistItems.length > 0; else emptyState"
             class="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
          <div *ngFor="let item of sortedItems; let i = index"
               [style.animation-delay]="i * 0.06 + 's'"
               class="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:border-rose-200 animate-fade-in">
            <ng-container *ngIf="getProduct(item.productId) as product">
              <div class="relative overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100">
                <a [routerLink]="'/product/' + product.id" class="block">
                  <img [src]="product.images[0]" [alt]="product.name"
                       class="h-56 w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110">
                </a>

                <!-- Top-left: discount badge -->
                <div *ngIf="product.discount > 0"
                     class="absolute left-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-bold text-white shadow-md"
                     style="background: linear-gradient(135deg,#f43f5e 0%,#db2777 100%);">
                  -{{ product.discount }}%
                </div>

                <!-- Top-right: remove heart -->
                <button (click)="removeFromWishlist(product.id)" type="button" aria-label="Remove from wishlist"
                        class="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 shadow-md backdrop-blur transition hover:scale-110 hover:shadow-lg">
                  <svg class="h-5 w-5 fill-rose-500 text-rose-500" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                  </svg>
                </button>

                <!-- Bottom-left: brand logo -->
                <div *ngIf="getBrandLogo(product.brandId)"
                     class="absolute left-3 bottom-3 flex h-9 w-9 items-center justify-center rounded-full bg-white p-1 shadow-md ring-2 ring-white">
                  <img [src]="getBrandLogo(product.brandId)" [alt]="getBrandName(product.brandId)" class="h-full w-full rounded-full object-cover">
                </div>

                <!-- Bottom-right: stock badge -->
                <div class="absolute right-3 bottom-3">
                  <span *ngIf="product.stock === 0"
                        class="inline-flex items-center gap-1 rounded-full bg-rose-600 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-md">
                    <span class="h-1.5 w-1.5 rounded-full bg-white"></span>
                    Out of stock
                  </span>
                  <span *ngIf="product.stock > 0 && product.stock <= 5"
                        class="inline-flex items-center gap-1 rounded-full bg-amber-500 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-md">
                    <span class="h-1.5 w-1.5 rounded-full bg-white animate-pulse"></span>
                    Only {{ product.stock }} left
                  </span>
                  <span *ngIf="product.stock > 5"
                        class="inline-flex items-center gap-1 rounded-full bg-emerald-500 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-md">
                    <span class="h-1.5 w-1.5 rounded-full bg-white"></span>
                    In stock
                  </span>
                </div>
              </div>

              <div class="flex flex-1 flex-col p-4">
                <!-- Tags -->
                <div class="mb-2 flex flex-wrap items-center gap-1.5">
                  <span class="inline-flex items-center rounded-full bg-sky-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-sky-700">
                    {{ getCategoryName(product.categoryId) }}
                  </span>
                  <span class="inline-flex items-center rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-indigo-700">
                    {{ getBrandName(product.brandId) }}
                  </span>
                </div>

                <!-- Title -->
                <a [routerLink]="'/product/' + product.id">
                  <h3 class="text-base font-bold text-slate-900 transition group-hover:text-rose-600 line-clamp-1">{{ product.name }}</h3>
                </a>
                <p class="mt-1 text-xs text-slate-500 line-clamp-2 min-h-[2rem]">{{ product.description }}</p>

                <!-- Rating -->
                <div class="mt-2 flex items-center gap-1.5">
                  <div class="flex items-center">
                    <svg *ngFor="let s of stars; let i = index"
                         class="h-3.5 w-3.5"
                         [class.text-amber-400]="i < roundRating(product.rating)"
                         [class.text-slate-200]="i >= roundRating(product.rating)"
                         fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                  </div>
                  <span class="text-xs font-semibold text-slate-700">{{ product.rating.toFixed(1) }}</span>
                  <span class="text-[11px] text-slate-400">({{ product.reviews }})</span>
                </div>

                <!-- Price row -->
                <div class="mt-3 flex items-end gap-2 border-t border-slate-100 pt-3">
                  <span class="text-xl font-extrabold text-slate-900">\${{ product.price }}</span>
                  <span *ngIf="product.originalPrice > product.price" class="mb-0.5 text-sm text-slate-400 line-through">\${{ product.originalPrice }}</span>
                  <span *ngIf="product.originalPrice > product.price"
                        class="mb-0.5 ml-auto inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                    Save \${{ (product.originalPrice - product.price).toFixed(2) }}
                  </span>
                </div>

                <!-- Action buttons -->
                <div class="mt-3 flex gap-2">
                  <button (click)="addToCart(product.id)" [disabled]="product.stock === 0"
                          class="inline-flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-white shadow-md transition hover:opacity-90 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
                          style="background: linear-gradient(135deg,#0ea5e9 0%,#6366f1 100%); box-shadow: 0 6px 16px -4px rgba(99,102,241,0.45);">
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                    </svg>
                    {{ product.stock === 0 ? 'Out of stock' : 'Add to Cart' }}
                  </button>
                  <button (click)="removeFromWishlist(product.id)" type="button"
                          class="inline-flex items-center justify-center rounded-xl border border-rose-200 bg-white px-3 py-2.5 text-sm font-semibold text-rose-600 shadow-sm transition hover:border-rose-600 hover:bg-rose-600 hover:text-white hover:shadow-md"
                          aria-label="Remove">
                    <svg class="h-4 w-4 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M10 7V4a1 1 0 011-1h2a1 1 0 011 1v3"/>
                    </svg>
                  </button>
                </div>
              </div>
            </ng-container>
          </div>
        </div>

        <!-- Empty State -->
        <ng-template #emptyState>
          <div class="mt-8 flex flex-col items-center justify-center gap-4 rounded-3xl border-2 border-dashed border-rose-200 bg-gradient-to-b from-white to-rose-50/40 px-6 py-14 sm:py-20 text-center">
            <div class="relative">
              <div class="absolute inset-0 animate-ping rounded-full bg-rose-300/30"></div>
              <div class="relative flex h-24 w-24 items-center justify-center rounded-full shadow-lg"
                   style="background: linear-gradient(135deg,#fecdd3 0%,#fbcfe8 100%);">
                <svg class="h-12 w-12 text-rose-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                </svg>
              </div>
            </div>
            <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900">Your wishlist is empty</h2>
            <p class="max-w-md text-sm text-slate-500">Tap the heart icon on any product to save it here for later. Your saved items will sync across devices when you sign in.</p>

            <div class="mt-2 flex flex-wrap justify-center gap-2">
              <a routerLink="/products" [queryParams]="{category: 'Electronics'}"
                 class="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-rose-300 hover:bg-rose-50 hover:text-rose-700">
                📱 Electronics
              </a>
              <a routerLink="/products" [queryParams]="{category: 'Fashion'}"
                 class="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-rose-300 hover:bg-rose-50 hover:text-rose-700">
                👗 Fashion
              </a>
              <a routerLink="/products" [queryParams]="{category: 'Home'}"
                 class="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-rose-300 hover:bg-rose-50 hover:text-rose-700">
                🏠 Home & Kitchen
              </a>
            </div>

            <a routerLink="/products"
               class="mt-3 inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:opacity-90 hover:shadow-xl"
               style="background: linear-gradient(135deg,#f43f5e 0%,#a855f7 100%); box-shadow: 0 10px 25px -5px rgba(244,63,94,0.45);">
              Start exploring
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
              </svg>
            </a>
          </div>
        </ng-template>
      </div>
    </div>
  `,
  styles: [`
    @media (min-width: 480px) {
      .xs\\:inline { display: inline; }
      .xs\\:hidden { display: none; }
    }
  `]
})
export class WishlistComponent implements OnInit {
  wishlistItems: WishlistItem[] = [];
  sortedItems: WishlistItem[] = [];
  products: Product[] = [];
  categories: Category[] = [];
  brands: Brand[] = [];
  sortBy: SortOption = 'recent';
  readonly stars = [0, 1, 2, 3, 4];

  constructor(
    private wishlistService: WishlistService,
    private dataService: DataService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.wishlistService.wishlistItems$.subscribe(items => {
      this.wishlistItems = items;
      this.applySort();
    });

    this.dataService.getProducts().subscribe(products => {
      this.products = products;
      this.applySort();
    });

    this.dataService.getCategories().subscribe(categories => {
      this.categories = categories;
    });

    this.dataService.getBrands().subscribe(brands => {
      this.brands = brands;
    });
  }

  get totalValue(): number {
    return this.wishlistItems.reduce((sum, item) => {
      const p = this.getProduct(item.productId);
      return sum + (p?.price ?? 0);
    }, 0);
  }

  get totalSavings(): number {
    return this.wishlistItems.reduce((sum, item) => {
      const p = this.getProduct(item.productId);
      if (!p) return sum;
      const save = (p.originalPrice ?? 0) - (p.price ?? 0);
      return sum + (save > 0 ? save : 0);
    }, 0);
  }

  applySort(): void {
    const items = [...this.wishlistItems];
    switch (this.sortBy) {
      case 'price-asc':
        items.sort((a, b) => (this.getProduct(a.productId)?.price ?? 0) - (this.getProduct(b.productId)?.price ?? 0));
        break;
      case 'price-desc':
        items.sort((a, b) => (this.getProduct(b.productId)?.price ?? 0) - (this.getProduct(a.productId)?.price ?? 0));
        break;
      case 'name':
        items.sort((a, b) => (this.getProduct(a.productId)?.name ?? '').localeCompare(this.getProduct(b.productId)?.name ?? ''));
        break;
      case 'discount':
        items.sort((a, b) => (this.getProduct(b.productId)?.discount ?? 0) - (this.getProduct(a.productId)?.discount ?? 0));
        break;
      case 'recent':
      default:
        // Keep original order (most recent first assumed)
        break;
    }
    this.sortedItems = items;
  }

  roundRating(rating: number): number {
    return Math.round(rating ?? 0);
  }

  getProduct(productId: string): Product | undefined {
    return this.products.find(p => p.id === productId);
  }

  getCategoryName(categoryId: string): string {
    return this.categories.find(c => c.id === categoryId)?.name || '';
  }

  getBrandName(brandId: string): string {
    return this.brands.find(b => b.id === brandId)?.name || '';
  }

  getBrandLogo(brandId: string): string {
    return this.brands.find(b => b.id === brandId)?.logo || '';
  }

  removeFromWishlist(productId: string): void {
    this.wishlistService.removeFromWishlist(productId);
  }

  addToCart(productId: string): void {
    const product = this.getProduct(productId);
    if (product) {
      this.cartService.addToCart(productId, product.price);
    }
  }

  moveAllToCart(): void {
    const items = [...this.wishlistItems];
    items.forEach(item => {
      const product = this.getProduct(item.productId);
      if (product && product.stock > 0) {
        this.cartService.addToCart(product.id, product.price);
        this.wishlistService.removeFromWishlist(product.id);
      }
    });
  }

  clearAll(): void {
    if (this.wishlistItems.length === 0) return;
    if (confirm('Remove all items from your wishlist?')) {
      this.wishlistService.clearWishlist();
    }
  }
}
