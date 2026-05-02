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
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div *ngIf="product" class="container mx-auto px-4 py-8 animate-fade-in">
      <!-- Breadcrumb -->
      <nav class="mb-6">
        <ol class="flex flex-wrap items-center gap-2 text-sm text-slate-500">
          <li><a routerLink="/" class="hover:text-primary-600 transition">Home</a></li>
          <li class="text-slate-300">/</li>
          <li><a routerLink="/products" class="hover:text-primary-600 transition">Products</a></li>
          <li class="text-slate-300">/</li>
          <li class="font-semibold text-slate-800 truncate max-w-xs">{{ product.name }}</li>
        </ol>
      </nav>

      <div class="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <!-- Product Images -->
        <div class="space-y-4 lg:col-span-2">
          <div class="group relative aspect-square overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 cursor-zoom-in shadow-sm"
               (mousemove)="onZoomMove($event)"
               (mouseenter)="zooming = true"
               (mouseleave)="zooming = false">
            <img [src]="selectedImage" [alt]="product.name"
                 class="h-full w-full object-cover transition-transform duration-200 ease-out select-none"
                 [style.transform-origin]="zoomOrigin"
                 [style.transform]="zooming ? 'scale(2)' : 'scale(1)'"
                 draggable="false">
            <div *ngIf="product.discount > 0"
                 class="absolute left-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-bold text-white shadow-md"
                 style="background: linear-gradient(135deg,#f43f5e 0%,#db2777 100%);">
              -{{ product.discount }}%
            </div>
            <div class="pointer-events-none absolute right-3 top-3 flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-slate-700 shadow-md backdrop-blur transition-opacity"
                 [class.opacity-0]="zooming">
              <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m-3-3h6"/>
              </svg>
              Hover to zoom
            </div>
          </div>
          <div class="flex gap-2 overflow-x-auto pb-1">
            <button *ngFor="let image of product.images"
                    (click)="selectedImage = image"
                    [class.ring-2]="selectedImage === image"
                    [class.ring-primary-500]="selectedImage === image"
                    [class.ring-offset-2]="selectedImage === image"
                    class="flex-shrink-0 h-20 w-20 overflow-hidden rounded-xl border border-slate-200 bg-slate-100 transition hover:border-primary-400">
              <img [src]="image" [alt]="product.name" class="h-full w-full object-cover">
            </button>
          </div>
        </div>

        <!-- Product Details -->
        <div class="space-y-5 lg:col-span-3">
          <div class="flex flex-wrap items-center gap-2">
            <span class="inline-flex items-center rounded-full bg-sky-50 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-sky-700">{{ getCategoryName(product.categoryId) }}</span>
            <span class="inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-indigo-700">{{ getBrandName(product.brandId) }}</span>
          </div>

          <h1 class="text-3xl font-extrabold leading-tight text-slate-900 sm:text-4xl">{{ product.name }}</h1>

          <!-- Rating -->
          <div class="flex items-center gap-3">
            <div class="flex items-center gap-0.5">
              <svg *ngFor="let s of [1,2,3,4,5]" class="h-5 w-5"
                   [class.text-amber-400]="s <= roundedRating(product.rating)"
                   [class.text-slate-200]="s > roundedRating(product.rating)"
                   fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.363 1.118l1.287 3.957c.3.922-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.784.57-1.838-.196-1.54-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.05 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z"/>
              </svg>
            </div>
            <span class="font-bold text-slate-900">{{ product.rating }}</span>
            <span class="text-sm text-slate-500">· {{ product.reviews }} reviews</span>
          </div>

          <p class="text-base leading-relaxed text-slate-600">{{ product.description }}</p>

          <!-- Price card -->
          <div class="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-5">
            <div class="flex flex-wrap items-end gap-3">
              <div>
                <p class="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Price</p>
                <p class="mt-1 text-4xl font-extrabold text-primary-600">{{ displayPrice | currency:'USD':'symbol':'1.2-2' }}</p>
              </div>
              <div *ngIf="displayOriginalPrice > displayPrice" class="pb-2">
                <p class="text-sm text-slate-400 line-through">{{ displayOriginalPrice | currency:'USD':'symbol':'1.2-2' }}</p>
                <p class="mt-1 inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-700">
                  Save {{ (displayOriginalPrice - displayPrice) | currency:'USD':'symbol':'1.2-2' }}
                </p>
              </div>
            </div>
            <div *ngIf="quantity > 1" class="mt-3 text-xs text-slate-500">
              {{ product.price | currency:'USD':'symbol':'1.2-2' }} per unit × {{ quantity }}
            </div>
          </div>

          <!-- Stock badge -->
          <div>
            <span *ngIf="product.stock > 10" class="inline-flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-bold text-emerald-700">
              <span class="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              In Stock · {{ product.stock }} available
            </span>
            <span *ngIf="product.stock > 0 && product.stock <= 10" class="inline-flex items-center gap-2 rounded-full bg-amber-50 border border-amber-200 px-3 py-1 text-xs font-bold text-amber-700">
              <span class="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse"></span>
              Only {{ product.stock }} left — order soon!
            </span>
            <span *ngIf="product.stock === 0" class="inline-flex items-center gap-2 rounded-full bg-rose-50 border border-rose-200 px-3 py-1 text-xs font-bold text-rose-700">
              <span class="h-1.5 w-1.5 rounded-full bg-rose-500"></span>
              Out of Stock
            </span>
          </div>

          <!-- Features -->
          <div *ngIf="product.features.length > 0" class="rounded-2xl border border-slate-200 bg-white p-5">
            <h3 class="mb-3 text-sm font-bold uppercase tracking-wider text-slate-700">Key Features</h3>
            <ul class="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <li *ngFor="let feature of product.features" class="flex items-start gap-2">
                <span class="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                  <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
                  </svg>
                </span>
                <span class="text-sm text-slate-700">{{ feature }}</span>
              </li>
            </ul>
          </div>

          <!-- Quantity + Actions -->
          <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div class="flex flex-wrap items-center gap-4">
              <div>
                <p class="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Quantity</p>
                <div class="flex items-center rounded-xl border border-slate-200 bg-slate-50">
                  <button (click)="decreaseQuantity()" [disabled]="quantity <= 1"
                          class="flex h-11 w-11 items-center justify-center text-slate-600 transition hover:text-slate-900 hover:bg-slate-100 rounded-l-xl disabled:opacity-40 disabled:cursor-not-allowed">
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M20 12H4"/></svg>
                  </button>
                  <input [(ngModel)]="quantity" (ngModelChange)="onQuantityChange($event)"
                         type="number" min="1" [max]="product.stock"
                         class="h-11 w-14 border-none bg-transparent text-center text-base font-bold text-slate-900 focus:outline-none">
                  <button (click)="increaseQuantity()" [disabled]="quantity >= product.stock"
                          class="flex h-11 w-11 items-center justify-center text-slate-600 transition hover:text-slate-900 hover:bg-slate-100 rounded-r-xl disabled:opacity-40 disabled:cursor-not-allowed">
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/></svg>
                  </button>
                </div>
              </div>

              <div class="flex-1 space-y-2 sm:space-y-0 sm:flex sm:gap-2 sm:items-end">
                <button (click)="addToCart()" [disabled]="product.stock === 0"
                        class="inline-flex w-full flex-1 items-center justify-center gap-2 rounded-xl px-5 py-3 text-base font-bold text-white shadow-lg transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                        style="background: linear-gradient(135deg,#0ea5e9 0%,#6366f1 100%); box-shadow: 0 10px 25px -5px rgba(99,102,241,0.5);">
                  <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.25"><path stroke-linecap="round" stroke-linejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
                  Add to Cart
                </button>
                <button (click)="toggleWishlist()"
                        class="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm transition hover:scale-105 hover:shadow-md"
                        [attr.aria-label]="isInWishlist() ? 'Remove from wishlist' : 'Add to wishlist'">
                  <svg class="h-5 w-5 transition-colors"
                       [class.fill-rose-500]="isInWishlist()"
                       [class.text-rose-500]="isInWishlist()"
                       [class.fill-none]="!isInWishlist()"
                       [class.text-slate-400]="!isInWishlist()"
                       stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Perks -->
          <div class="grid grid-cols-3 gap-3">
            <div class="rounded-xl border border-slate-200 bg-white p-3 text-center">
              <svg class="mx-auto h-5 w-5 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0zM13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1"/></svg>
              <p class="mt-1 text-[10px] font-semibold text-slate-700">Free Shipping</p>
              <p class="text-[9px] text-slate-500">On orders over $50</p>
            </div>
            <div class="rounded-xl border border-slate-200 bg-white p-3 text-center">
              <svg class="mx-auto h-5 w-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
              <p class="mt-1 text-[10px] font-semibold text-slate-700">Easy Returns</p>
              <p class="text-[9px] text-slate-500">30-day window</p>
            </div>
            <div class="rounded-xl border border-slate-200 bg-white p-3 text-center">
              <svg class="mx-auto h-5 w-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
              <p class="mt-1 text-[10px] font-semibold text-slate-700">Secure Checkout</p>
              <p class="text-[9px] text-slate-500">SSL encrypted</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Specifications -->
      <div *ngIf="product.specifications && objectKeys(product.specifications).length > 0" class="mt-12">
        <div class="mb-6 flex items-center gap-3">
          <span class="flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-md"
                style="background: linear-gradient(135deg,#6366f1 0%,#a855f7 100%);">
            <svg class="h-5 w-5" fill="none" stroke="white" stroke-width="2.25" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
          </span>
          <h3 class="text-2xl font-bold text-slate-900">Specifications</h3>
        </div>
        <div class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div class="divide-y divide-slate-100">
            <div *ngFor="let spec of objectKeys(product.specifications); let i = index"
                 class="flex items-center justify-between px-6 py-4 transition hover:bg-slate-50">
              <span class="text-sm font-semibold capitalize text-slate-600">{{ spec }}</span>
              <span class="text-sm font-bold text-slate-900">{{ product.specifications[spec] }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Related Products -->
      <div *ngIf="relatedProducts.length > 0" class="mt-12">
        <div class="mb-6 flex items-center gap-3">
          <span class="flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-md"
                style="background: linear-gradient(135deg,#0ea5e9 0%,#6366f1 100%);">
            <svg class="h-5 w-5" fill="none" stroke="white" stroke-width="2.25" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
          </span>
          <h3 class="text-2xl font-bold text-slate-900">You May Also Like</h3>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <a *ngFor="let relatedProduct of relatedProducts" [routerLink]="'/product/' + relatedProduct.id"
             class="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-2xl">
            <div class="relative overflow-hidden bg-slate-100">
              <img [src]="relatedProduct.images[0]" [alt]="relatedProduct.name"
                   class="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-110">
              <div *ngIf="relatedProduct.discount > 0" class="absolute left-3 top-3 rounded-full px-2 py-0.5 text-[10px] font-bold text-white shadow-md"
                   style="background: linear-gradient(135deg,#f43f5e 0%,#db2777 100%);">
                -{{ relatedProduct.discount }}%
              </div>
            </div>
            <div class="flex flex-1 flex-col p-4">
              <h4 class="truncate text-sm font-bold text-slate-900 transition group-hover:text-primary-600">{{ relatedProduct.name }}</h4>
              <div class="mt-2 flex items-center justify-between">
                <span class="text-lg font-extrabold text-primary-600">{{ relatedProduct.price | currency:'USD':'symbol':'1.2-2' }}</span>
                <span class="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700">
                  <svg class="h-3 w-3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.363 1.118l1.287 3.957c.3.922-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.784.57-1.838-.196-1.54-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.05 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z"/></svg>
                  {{ relatedProduct.rating }}
                </span>
              </div>
            </div>
          </a>
        </div>
      </div>
    </div>

    <!-- Product Not Found -->
    <div *ngIf="!product && !loading" class="container mx-auto px-4 py-16 text-center">
      <div class="text-6xl mb-4"><i class="ri-search-line"></i></div>
      <h2 class="text-2xl font-bold mb-4">Product Not Found</h2>
      <p class="text-gray-600 mb-8">The product you're looking for doesn't exist.</p>
      <a routerLink="/products" class="btn-primary">Browse Products</a>
    </div>
  `
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  relatedProducts: Product[] = [];
  categories: Category[] = [];
  brands: Brand[] = [];
  selectedImage = '';
  quantity = 1;
  loading = true;
  displayPrice = 0;
  displayOriginalPrice = 0;
  basePrice = 0;
  baseOriginalPrice = 0;

  zooming = false;
  zoomOrigin = '50% 50%';

  roundedRating(rating: number): number {
    return Math.round(rating);
  }

  onZoomMove(event: MouseEvent): void {
    const el = event.currentTarget as HTMLElement;
    const rect = el.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    this.zoomOrigin = `${x}% ${y}%`;
  }

  constructor(
    private route: ActivatedRoute,
    private dataService: DataService,
    private cartService: CartService,
    private wishlistService: WishlistService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const productId = params['id'];
      this.loadSavedQuantity(productId);
      this.loadProduct(productId);
    });

    this.loadCategories();
    this.loadBrands();
    
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => {
        if (this.product) {
          this.saveProductData(this.product.id);
        }
      });
    }
  }

  loadProduct(id: string): void {
    this.loading = true;
    this.dataService.getProducts().subscribe(products => {
      this.product = products.find(p => p.id === id) || null;
      if (this.product) {
        this.selectedImage = this.product.images[0];
        this.basePrice = this.product.price;
        this.baseOriginalPrice = this.product.originalPrice;        
        this.updatePrices();
        this.loadRelatedProducts();
      }
      this.loading = false;
    });
  }

  loadSavedQuantity(productId: string): void {
    const savedData = this.getSavedProductData(productId);
    if (savedData && savedData.quantity) {
      this.quantity = savedData.quantity;
    }
  }

  saveProductData(productId: string): void {
    const data = {
      quantity: this.quantity,
      displayPrice: this.displayPrice,
      displayOriginalPrice: this.displayOriginalPrice,
      basePrice: this.basePrice,
      baseOriginalPrice: this.baseOriginalPrice,
      timestamp: Date.now(),
      productId: productId
    };
    
    // Multiple storage methods for better persistence
    if (typeof window !== 'undefined') {
      (window as any).productDetailData = (window as any).productDetailData || {};
      (window as any).productDetailData[productId] = data;
      
      (document as any).productCache = (document as any).productCache || {};
      (document as any).productCache[productId] = data;
      
      if (!(window as any).globalProductStore) {
        (window as any).globalProductStore = new Map();
      }
      (window as any).globalProductStore.set(productId, data);
      
      this.saveToUrlHash(data);
    }
  }

  getSavedProductData(productId: string): any {
    if (typeof window === 'undefined') return null;
        
    if ((window as any).productDetailData && (window as any).productDetailData[productId]) {
      return (window as any).productDetailData[productId];
    }
    
    if ((document as any).productCache && (document as any).productCache[productId]) {
      return (document as any).productCache[productId];
    }
    
    if ((window as any).globalProductStore && (window as any).globalProductStore.has(productId)) {
      return (window as any).globalProductStore.get(productId);
    }
    
    const hashData = this.loadFromUrlHash();
    if (hashData && hashData.productId === productId) {
      return hashData;
    }
    
    return null;
  }

  saveToUrlHash(data: any): void {
    try {
      const encodedData = btoa(JSON.stringify(data));
      const currentUrl = new URL(window.location.href);
      currentUrl.hash = `data=${encodedData}`;
      window.history.replaceState(null, '', currentUrl.toString());
    } catch (e) {
    }
  }

  loadFromUrlHash(): any {
    try {
      const hash = window.location.hash;
      if (hash.startsWith('#data=')) {
        const encodedData = hash.substring(6);
        return JSON.parse(atob(encodedData));
      }
    } catch (e) {
    }
    return null;
  }

  restoreProductState(): void {
    if (!this.product) return;
    
    const savedData = this.getSavedProductData(this.product.id);
    if (savedData) {
      this.quantity = savedData.quantity || 1;
      this.displayPrice = savedData.displayPrice || this.basePrice;
      this.displayOriginalPrice = savedData.displayOriginalPrice || this.baseOriginalPrice;
      
      if (this.quantity !== 1) {
        this.updatePrices();
      }
    }
  }

  updatePrices(): void {
    if (this.product) {
      this.displayPrice = this.basePrice * this.quantity;
      this.displayOriginalPrice = this.baseOriginalPrice * this.quantity;
      
      this.saveProductData(this.product.id);
    }
  }

  loadRelatedProducts(): void {
    if (!this.product) return;
    
    this.dataService.getProducts().subscribe(products => {
      this.relatedProducts = products
        .filter(p => p.id !== this.product!.id && p.categoryId === this.product!.categoryId)
        .slice(0, 4);
    });
  }

  loadCategories(): void {
    this.dataService.getCategories().subscribe(categories => {
      this.categories = categories;
    });
  }

  loadBrands(): void {
    this.dataService.getBrands().subscribe(brands => {
      this.brands = brands;
    });
  }

  getCategoryName(categoryId: string): string {
    const category = this.categories.find(c => c.id === categoryId);
    return category ? category.name : '';
  }

  getBrandName(brandId: string): string {
    const brand = this.brands.find(b => b.id === brandId);
    return brand ? brand.name : '';
  }

  increaseQuantity(): void {
    if (this.product && this.quantity < this.product.stock) {
      this.quantity++;
      this.updatePrices();
    }
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
      this.updatePrices();
    }
  }

  onQuantityChange(newQuantity: number): void {
    if (this.product && newQuantity >= 1 && newQuantity <= this.product.stock) {
      this.quantity = newQuantity;
      this.updatePrices();
    } else if (this.product) {
      this.quantity = Math.min(Math.max(1, newQuantity), this.product.stock);
      this.updatePrices();
    }
  }

  addToCart(): void {
    if (this.product) {
      this.cartService.addToCart(this.product.id, this.basePrice, this.quantity);
    }
  }

  toggleWishlist(): void {
    if (this.product) {
      if (this.isInWishlist()) {
        this.wishlistService.removeFromWishlist(this.product.id);
      } else {
        this.wishlistService.addToWishlist(this.product.id);
      }
    }
  }

  isInWishlist(): boolean {
    return this.product ? this.wishlistService.isInWishlist(this.product.id) : false;
  }

  objectKeys(obj: any): string[] {
    return Object.keys(obj);
  }
}