import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  Router,
  RouterModule,
} from '@angular/router';

import {
  CartItem,
  Product,
} from '../../models/interfaces';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { DataService } from '../../services/data.service';
import { WishlistService } from '../../services/wishlist.service';

interface PromoMeta {
  code: string;
  label: string;
  percent: number;
}

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gradient-to-b from-sky-50/40 via-white to-white">
      <div class="container mx-auto px-4 py-8 sm:py-10 animate-fade-in">

        <!-- Hero Header -->
        <section class="relative overflow-hidden rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xl"
                 style="background: linear-gradient(135deg,#0ea5e9 0%,#6366f1 50%,#a855f7 100%);">
          <div class="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/15 blur-3xl"></div>
          <div class="absolute -bottom-20 -left-10 h-72 w-72 rounded-full bg-cyan-300/20 blur-3xl"></div>

          <div class="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div class="text-white">
              <span class="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/15 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.22em] backdrop-blur">
                <span class="h-1.5 w-1.5 rounded-full bg-white animate-pulse"></span>
                Your Cart
              </span>
              <h1 class="mt-3 text-3xl sm:text-4xl lg:text-5xl font-extrabold drop-shadow-sm">
                Almost there! <span class="inline-block">🛒</span>
              </h1>
              <p class="mt-2 max-w-xl text-sm sm:text-base text-white/85">
                {{ cartItems.length === 0
                    ? 'Your cart is empty. Let\\'s find something you\\'ll love.'
                    : (cartItems.length + ' product' + (cartItems.length === 1 ? '' : 's') + ' · ' + getTotalQuantity() + ' item' + (getTotalQuantity() === 1 ? '' : 's') + ' ready to checkout.') }}
              </p>
            </div>

            <div *ngIf="cartItems.length > 0" class="grid grid-cols-3 gap-3 sm:gap-4 lg:flex lg:flex-wrap">
              <div class="rounded-2xl border border-white/25 bg-white/15 p-3 sm:p-4 backdrop-blur-md text-white">
                <p class="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-white/80">Items</p>
                <p class="mt-1 text-xl sm:text-2xl font-extrabold">{{ getTotalQuantity() }}</p>
              </div>
              <div class="rounded-2xl border border-white/25 bg-white/15 p-3 sm:p-4 backdrop-blur-md text-white">
                <p class="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-white/80">Subtotal</p>
                <p class="mt-1 text-xl sm:text-2xl font-extrabold">\${{ getSubtotal() | number: '1.0-0' }}</p>
              </div>
              <div class="rounded-2xl border border-white/25 bg-white/15 p-3 sm:p-4 backdrop-blur-md text-white">
                <p class="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-white/80">You Save</p>
                <p class="mt-1 text-xl sm:text-2xl font-extrabold">\${{ getItemsSavings() | number: '1.0-0' }}</p>
              </div>
            </div>
          </div>
        </section>

        <!-- Toolbar -->
        <div *ngIf="cartItems.length > 0"
             class="mt-6 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div class="flex flex-wrap items-center gap-2">
            <a routerLink="/products"
               class="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs sm:text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition">
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.25">
                <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
              </svg>
              Continue shopping
            </a>
            <button (click)="moveAllToWishlist()"
                    class="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-white px-3 py-2 text-xs sm:text-sm font-semibold text-rose-600 shadow-sm hover:border-rose-500 hover:bg-rose-50 transition">
              <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
              </svg>
              Save all for later
            </button>
            <button (click)="clearCart()"
                    class="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs sm:text-sm font-semibold text-slate-600 shadow-sm hover:border-rose-500 hover:bg-rose-600 hover:text-white transition">
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.25">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M10 7V4a1 1 0 011-1h2a1 1 0 011 1v3"/>
              </svg>
              Clear cart
            </button>
          </div>

          <div class="flex items-center gap-2 text-xs sm:text-sm">
            <span class="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 font-semibold text-emerald-700">
              <svg class="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/></svg>
              {{ getEstimatedDelivery() }}
            </span>
          </div>
        </div>

        <div *ngIf="cartItems.length > 0" class="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">

          <!-- Cart Items Column -->
          <div class="lg:col-span-2 space-y-4">

            <!-- Free shipping progress -->
            <div *ngIf="getSubtotal() < freeShippingThreshold"
                 class="overflow-hidden rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50 p-4 shadow-sm">
              <div class="flex items-center justify-between gap-2">
                <div class="flex items-center gap-2 text-sm font-semibold text-emerald-800">
                  <div class="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-white shadow-sm">
                    <svg class="h-4 w-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.25">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0zM13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1"/>
                    </svg>
                  </div>
                  <span>Add <span class="font-extrabold text-emerald-900">\${{ (freeShippingThreshold - getSubtotal()).toFixed(2) }}</span> more for <span class="font-extrabold">FREE shipping</span></span>
                </div>
                <span class="text-xs font-bold text-emerald-700 whitespace-nowrap">{{ freeShippingPercent.toFixed(0) }}%</span>
              </div>
              <div class="mt-2 h-2.5 overflow-hidden rounded-full bg-white shadow-inner">
                <div class="h-full rounded-full transition-all duration-500"
                     [style.width.%]="freeShippingPercent"
                     style="background: linear-gradient(90deg,#10b981,#0d9488);"></div>
              </div>
            </div>
            <div *ngIf="getSubtotal() >= freeShippingThreshold"
                 class="flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 p-3 text-sm font-semibold text-emerald-800 shadow-sm">
              <div class="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white">
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
                </svg>
              </div>
              You qualified for <span class="font-extrabold">FREE shipping</span>! 🎉
            </div>

            <!-- Items -->
            <div *ngFor="let item of paginatedItems; let i = index"
                 [style.animation-delay]="i * 0.05 + 's'"
                 class="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:border-primary-200 hover:shadow-md animate-fade-in">
              <ng-container *ngIf="getProduct(item.productId) as product">
                <div class="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">

                  <!-- Image -->
                  <a [routerLink]="'/product/' + item.productId"
                     class="relative flex-shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-slate-50 to-slate-100"
                     [class.ring-2]="product.stock === 0"
                     [class.ring-rose-300]="product.stock === 0">
                    <img [src]="product.images[0]" [alt]="product.name"
                         class="h-24 w-24 sm:h-28 sm:w-28 object-cover transition-transform duration-500 group-hover:scale-110">
                    <div *ngIf="product.discount > 0"
                         class="absolute left-1 top-1 rounded-md px-1.5 py-0.5 text-[10px] font-bold text-white shadow-md"
                         style="background: linear-gradient(135deg,#f43f5e 0%,#db2777 100%);">
                      -{{ product.discount }}%
                    </div>
                  </a>

                  <!-- Details -->
                  <div class="min-w-0 flex-1">
                    <div class="flex flex-wrap items-center gap-1.5">
                      <span *ngIf="getCategoryNameFor(product)"
                            class="inline-flex items-center rounded-full bg-sky-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-sky-700">
                        {{ getCategoryNameFor(product) }}
                      </span>
                      <span *ngIf="product.stock === 0"
                            class="inline-flex items-center gap-1 rounded-full bg-rose-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                        <span class="h-1 w-1 rounded-full bg-white"></span>
                        Out of stock
                      </span>
                      <span *ngIf="product.stock > 0 && product.stock <= 5"
                            class="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-800">
                        <span class="h-1 w-1 rounded-full bg-amber-600 animate-pulse"></span>
                        Only {{ product.stock }} left
                      </span>
                      <span *ngIf="product.stock > 5"
                            class="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                        <span class="h-1 w-1 rounded-full bg-emerald-600"></span>
                        In stock
                      </span>
                    </div>
                    <a [routerLink]="'/product/' + item.productId">
                      <h3 class="mt-1 line-clamp-1 text-sm sm:text-base font-bold text-slate-900 transition hover:text-primary-600">
                        {{ product.name }}
                      </h3>
                    </a>
                    <p class="mt-0.5 line-clamp-1 text-xs text-slate-500">{{ product.description }}</p>

                    <!-- Price row -->
                    <div class="mt-2 flex items-baseline gap-2">
                      <span class="text-base font-extrabold text-slate-900">\${{ item.price }}</span>
                      <span *ngIf="product.originalPrice > product.price"
                            class="text-xs text-slate-400 line-through">\${{ product.originalPrice }}</span>
                      <span *ngIf="product.originalPrice > product.price"
                            class="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                        Save \${{ ((product.originalPrice - item.price) * item.quantity).toFixed(2) }}
                      </span>
                    </div>
                  </div>

                  <!-- Controls column -->
                  <div class="flex w-full flex-col items-end gap-2 sm:w-auto">
                    <!-- Quantity stepper -->
                    <div class="flex items-center rounded-xl border border-slate-200 bg-slate-50 shadow-sm">
                      <button type="button" (click)="updateQuantity(item.productId, item.quantity - 1)"
                              [disabled]="item.quantity <= 1"
                              class="flex h-9 w-9 items-center justify-center rounded-l-xl text-slate-600 transition hover:bg-slate-200 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed">
                        <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M20 12H4"/>
                        </svg>
                      </button>
                      <input [ngModel]="item.quantity" (ngModelChange)="onQuantityInput(item, $event)"
                             type="number" [min]="1" [max]="product.stock || 99"
                             class="h-9 w-12 border-x border-slate-200 bg-white text-center text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500/30">
                      <button type="button" (click)="updateQuantity(item.productId, item.quantity + 1)"
                              [disabled]="product.stock > 0 && item.quantity >= product.stock"
                              class="flex h-9 w-9 items-center justify-center rounded-r-xl text-slate-600 transition hover:bg-slate-200 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed">
                        <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/>
                        </svg>
                      </button>
                    </div>

                    <!-- Line total -->
                    <div class="text-right">
                      <div class="text-lg font-extrabold text-slate-900 leading-tight">\${{ (item.price * item.quantity).toFixed(2) }}</div>
                      <div class="text-[11px] text-slate-500">{{ item.quantity }} × \${{ item.price }}</div>
                    </div>

                    <!-- Actions -->
                    <div class="flex items-center gap-1">
                      <button type="button" (click)="moveToWishlist(item)"
                              [class.text-rose-500]="isInWishlist(item.productId)"
                              [class.text-slate-400]="!isInWishlist(item.productId)"
                              class="flex h-8 w-8 items-center justify-center rounded-full transition hover:bg-rose-50 hover:text-rose-600"
                              [attr.aria-label]="isInWishlist(item.productId) ? 'Remove from wishlist' : 'Move to wishlist'">
                        <svg class="h-4 w-4" [attr.fill]="isInWishlist(item.productId) ? 'currentColor' : 'none'" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                        </svg>
                      </button>
                      <button type="button" (click)="removeFromCart(item.productId)"
                              class="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
                              aria-label="Remove">
                        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M10 7V4a1 1 0 011-1h2a1 1 0 011 1v3"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </ng-container>
            </div>

            <!-- Pagination -->
            <div *ngIf="cartItems.length > pageSize"
                 class="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">
              <p class="text-xs sm:text-sm text-slate-600">
                Showing <span class="font-semibold text-slate-900">{{ (currentPage - 1) * pageSize + 1 }}</span>–<span class="font-semibold text-slate-900">{{ Math.min(currentPage * pageSize, cartItems.length) }}</span>
                of <span class="font-semibold text-slate-900">{{ cartItems.length }}</span>
              </p>
              <div class="flex items-center gap-1.5">
                <button type="button" (click)="prevPage()" [disabled]="currentPage === 1"
                        class="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed">
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/></svg>
                </button>
                <button *ngFor="let n of pagesArray" type="button" (click)="goToPage(n)"
                        class="inline-flex h-9 min-w-9 items-center justify-center rounded-lg px-3 text-sm font-semibold transition"
                        [class.text-white]="n === currentPage"
                        [class.shadow-md]="n === currentPage"
                        [style.background]="n === currentPage ? 'linear-gradient(135deg,#0ea5e9 0%,#6366f1 100%)' : ''"
                        [class.bg-white]="n !== currentPage"
                        [class.text-slate-700]="n !== currentPage"
                        [class.border]="n !== currentPage"
                        [class.border-slate-200]="n !== currentPage"
                        [class.hover:bg-slate-50]="n !== currentPage">
                  {{ n }}
                </button>
                <button type="button" (click)="nextPage()" [disabled]="currentPage === totalPages"
                        class="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed">
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Order Summary Column -->
          <div class="lg:col-span-1">
            <div class="sticky top-24 space-y-4">

              <!-- Summary card -->
              <div class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md">
                <div class="h-1.5 w-full" style="background: linear-gradient(90deg,#0ea5e9,#6366f1,#a855f7);"></div>
                <div class="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                  <h3 class="text-base font-bold text-slate-900">Order Summary</h3>
                  <span class="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-700">
                    {{ getTotalQuantity() }} {{ getTotalQuantity() === 1 ? 'item' : 'items' }}
                  </span>
                </div>

                <!-- Promo code -->
                <div class="border-b border-slate-100 p-4">
                  <label class="block text-xs font-semibold uppercase tracking-wide text-slate-600 mb-1.5">Promo Code</label>
                  <div class="flex gap-2">
                    <div class="relative flex-1">
                      <svg class="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
                      </svg>
                      <input [(ngModel)]="promoCode" type="text" placeholder="Enter code"
                             (keyup.enter)="applyPromo()"
                             class="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 py-2 text-sm font-semibold uppercase tracking-wider text-slate-800 placeholder:normal-case placeholder:font-normal placeholder:text-slate-400 focus:border-primary-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20">
                    </div>
                    <button (click)="applyPromo()"
                            class="rounded-xl bg-slate-900 px-4 text-sm font-bold text-white hover:bg-slate-800 transition">Apply</button>
                  </div>

                  <!-- Suggested promos -->
                  <div class="mt-2 flex flex-wrap gap-1.5">
                    <button *ngFor="let p of availablePromos" type="button" (click)="quickApply(p.code)"
                            [disabled]="promoApplied && appliedCode === p.code"
                            class="inline-flex items-center gap-1 rounded-full border border-dashed border-slate-300 bg-white px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-600 transition hover:border-primary-400 hover:bg-primary-50 hover:text-primary-700 disabled:opacity-50 disabled:cursor-default">
                      <svg class="h-2.5 w-2.5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" fill-rule="evenodd"/></svg>
                      {{ p.code }}
                    </button>
                  </div>

                  <p *ngIf="promoMessage" class="mt-2 flex items-center gap-1.5 text-xs font-semibold"
                     [class.text-emerald-600]="promoApplied"
                     [class.text-rose-600]="!promoApplied">
                    <svg *ngIf="promoApplied" class="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>
                    <svg *ngIf="!promoApplied" class="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/></svg>
                    {{ promoMessage }}
                    <button *ngIf="promoApplied" type="button" (click)="removePromo()" class="ml-auto text-[10px] font-bold uppercase text-slate-400 hover:text-rose-600">Remove</button>
                  </p>
                </div>

                <!-- Amounts -->
                <div class="space-y-2 p-5 text-sm">
                  <div class="flex justify-between text-slate-600">
                    <span>Subtotal</span>
                    <span class="font-semibold text-slate-900">\${{ getSubtotal().toFixed(2) }}</span>
                  </div>
                  <div *ngIf="getItemsSavings() > 0" class="flex justify-between text-emerald-600">
                    <span>Item discounts</span>
                    <span class="font-semibold">− \${{ getItemsSavings().toFixed(2) }}</span>
                  </div>
                  <div *ngIf="discount > 0" class="flex justify-between text-emerald-600">
                    <span>Promo ({{ appliedCode }})</span>
                    <span class="font-semibold">− \${{ discount.toFixed(2) }}</span>
                  </div>
                  <div class="flex justify-between text-slate-600">
                    <span>Shipping</span>
                    <span class="font-semibold"
                          [class.text-emerald-600]="getShipping() === 0"
                          [class.text-slate-900]="getShipping() !== 0">
                      {{ getShipping() === 0 ? 'FREE' : '$' + getShipping().toFixed(2) }}
                    </span>
                  </div>
                  <div class="flex justify-between text-slate-600">
                    <span>Tax (8%)</span>
                    <span class="font-semibold text-slate-900">\${{ getTax().toFixed(2) }}</span>
                  </div>
                  <div class="flex items-end justify-between border-t border-slate-200 pt-3">
                    <div>
                      <p class="text-xs font-semibold uppercase tracking-wider text-slate-500">Total</p>
                      <p class="text-2xl font-extrabold text-primary-600">\${{ getTotal().toFixed(2) }}</p>
                    </div>
                    <div *ngIf="getTotalSavings() > 0" class="rounded-lg bg-emerald-50 px-2.5 py-1 text-right">
                      <p class="text-[10px] font-bold uppercase tracking-wider text-emerald-600">You save</p>
                      <p class="text-sm font-extrabold text-emerald-700">\${{ getTotalSavings().toFixed(2) }}</p>
                    </div>
                  </div>
                </div>

                <!-- Checkout CTA -->
                <div class="space-y-3 border-t border-slate-100 bg-slate-50/60 px-5 py-4">
                  <div *ngIf="!isLoggedIn" class="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
                    <svg class="h-4 w-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.25">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                    </svg>
                    <span>Please <a routerLink="/login" class="font-bold underline">log in</a> to complete checkout.</span>
                  </div>
                  <div *ngIf="hasOutOfStockItems()"
                       class="flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800">
                    <svg class="h-4 w-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.25">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                    </svg>
                    <span>Some items are out of stock — remove them to continue.</span>
                  </div>

                  <button (click)="proceedToCheckout()" [disabled]="hasOutOfStockItems()"
                          class="inline-flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-bold text-white shadow-lg transition hover:opacity-90 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                          style="background: linear-gradient(135deg,#0ea5e9 0%,#6366f1 100%); box-shadow: 0 10px 25px -5px rgba(99,102,241,0.5);">
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                    </svg>
                    Secure Checkout · \${{ getTotal().toFixed(2) }}
                  </button>

                  <!-- Payment method icons -->
                  <div>
                    <p class="mb-2 text-center text-[10px] font-semibold uppercase tracking-wider text-slate-500">We Accept</p>
                    <div class="flex items-center justify-center gap-2">
                      <div class="flex h-7 w-11 items-center justify-center rounded-md bg-white border border-slate-200 shadow-sm text-[10px] font-extrabold text-blue-700">VISA</div>
                      <div class="flex h-7 w-11 items-center justify-center rounded-md bg-white border border-slate-200 shadow-sm">
                        <div class="flex items-center gap-0">
                          <span class="h-3 w-3 rounded-full bg-red-500"></span>
                          <span class="h-3 w-3 -ml-1.5 rounded-full bg-amber-400 opacity-90"></span>
                        </div>
                      </div>
                      <div class="flex h-7 w-11 items-center justify-center rounded-md bg-white border border-slate-200 shadow-sm text-[9px] font-extrabold italic text-blue-600">PayPal</div>
                      <div class="flex h-7 w-11 items-center justify-center rounded-md bg-black text-[9px] font-bold text-white">Pay</div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Trust badges -->
              <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div class="grid grid-cols-3 gap-2 text-center">
                  <div class="rounded-xl bg-gradient-to-br from-emerald-50 to-white p-3 border border-emerald-100">
                    <svg class="mx-auto h-5 w-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                    <p class="mt-1 text-[10px] font-bold text-slate-700">SSL Secure</p>
                  </div>
                  <div class="rounded-xl bg-gradient-to-br from-sky-50 to-white p-3 border border-sky-100">
                    <svg class="mx-auto h-5 w-5 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                    <p class="mt-1 text-[10px] font-bold text-slate-700">Fast Ship</p>
                  </div>
                  <div class="rounded-xl bg-gradient-to-br from-rose-50 to-white p-3 border border-rose-100">
                    <svg class="mx-auto h-5 w-5 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
                    <p class="mt-1 text-[10px] font-bold text-slate-700">Easy Returns</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty Cart -->
        <div *ngIf="cartItems.length === 0"
             class="mt-8 flex flex-col items-center justify-center gap-4 rounded-3xl border-2 border-dashed border-sky-200 bg-gradient-to-b from-white to-sky-50/40 px-6 py-16 sm:py-20 text-center">
          <div class="relative">
            <div class="absolute inset-0 animate-ping rounded-full bg-sky-300/30"></div>
            <div class="relative flex h-24 w-24 items-center justify-center rounded-full shadow-lg"
                 style="background: linear-gradient(135deg,#bae6fd 0%,#c7d2fe 100%);">
              <svg class="h-12 w-12 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
              </svg>
            </div>
          </div>
          <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900">Your cart is empty</h2>
          <p class="max-w-md text-sm text-slate-500">Looks like you haven't added anything yet. Explore our catalog and fill it up!</p>
          <div class="mt-2 flex flex-wrap justify-center gap-2">
            <a routerLink="/products"
               class="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700">🛍️ Browse all</a>
            <a routerLink="/wishlist"
               class="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-rose-300 hover:bg-rose-50 hover:text-rose-700">❤️ My Wishlist</a>
            <a routerLink="/orders"
               class="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700">📦 My Orders</a>
          </div>
          <a routerLink="/products"
             class="mt-3 inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:opacity-90 hover:shadow-xl"
             style="background: linear-gradient(135deg,#0ea5e9 0%,#6366f1 100%); box-shadow: 0 10px 25px -5px rgba(99,102,241,0.5);">
            Start Shopping
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
          </a>
        </div>
      </div>
    </div>
  `
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  products: Product[] = [];
  categories: { id: string; name: string }[] = [];
  isLoggedIn = false;
  wishlistIds: Set<string> = new Set();

  readonly pageSize = 5;
  currentPage = 1;
  readonly Math = Math;
  readonly freeShippingThreshold = 50;

  promoCode = '';
  promoApplied = false;
  promoMessage = '';
  appliedCode = '';
  discount = 0;

  readonly availablePromos: PromoMeta[] = [
    { code: 'SAVE10', label: '10% off', percent: 10 },
    { code: 'SAVE20', label: '20% off', percent: 20 },
    { code: 'TRENDY5', label: '5% off', percent: 5 }
  ];

  constructor(
    private cartService: CartService,
    private dataService: DataService,
    private authService: AuthService,
    private wishlistService: WishlistService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
      if (this.currentPage > this.totalPages) {
        this.currentPage = this.totalPages;
      }
      if (this.promoApplied) {
        this.recomputePromoDiscount();
      }
    });

    this.dataService.getProducts().subscribe(products => {
      this.products = products;
    });

    this.dataService.getCategories().subscribe(categories => {
      this.categories = categories as { id: string; name: string }[];
    });

    this.authService.currentUser$.subscribe(user => {
      this.isLoggedIn = !!user;
    });

    this.wishlistService.wishlistItems$.subscribe(items => {
      this.wishlistIds = new Set(items.map(i => i.productId));
    });
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.cartItems.length / this.pageSize));
  }

  get pagesArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  get paginatedItems(): CartItem[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.cartItems.slice(start, start + this.pageSize);
  }

  get freeShippingPercent(): number {
    return Math.min(100, (this.getSubtotal() / this.freeShippingThreshold) * 100);
  }

  prevPage(): void {
    if (this.currentPage > 1) this.currentPage--;
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) this.currentPage++;
  }

  goToPage(n: number): void {
    if (n >= 1 && n <= this.totalPages) this.currentPage = n;
  }

  getProduct(productId: string): Product | undefined {
    return this.products.find(p => p.id === productId);
  }

  getCategoryNameFor(product: Product | undefined): string {
    if (!product) return '';
    return this.categories.find(c => c.id === product.categoryId)?.name || '';
  }

  isInWishlist(productId: string): boolean {
    return this.wishlistIds.has(productId);
  }

  onQuantityInput(item: CartItem, value: number | string): void {
    const n = Math.max(1, Math.floor(Number(value) || 1));
    const product = this.getProduct(item.productId);
    const max = product?.stock && product.stock > 0 ? product.stock : n;
    const capped = Math.min(n, max);
    this.updateQuantity(item.productId, capped);
  }

  updateQuantity(productId: string, quantity: number): void {
    this.cartService.updateQuantity(productId, quantity);
  }

  removeFromCart(productId: string): void {
    this.cartService.removeFromCart(productId);
  }

  moveToWishlist(item: CartItem): void {
    if (!this.isInWishlist(item.productId)) {
      this.wishlistService.addToWishlist(item.productId);
    }
    this.cartService.removeFromCart(item.productId);
  }

  moveAllToWishlist(): void {
    if (this.cartItems.length === 0) return;
    if (!confirm('Move all cart items to your wishlist?')) return;
    const items = [...this.cartItems];
    items.forEach(i => {
      if (!this.isInWishlist(i.productId)) {
        this.wishlistService.addToWishlist(i.productId);
      }
    });
    this.cartService.clearCart();
    this.resetPromo();
  }

  getSubtotal(): number {
    return this.cartItems.reduce((t, i) => t + (i.price * i.quantity), 0);
  }

  getTotalQuantity(): number {
    return this.cartItems.reduce((c, i) => c + i.quantity, 0);
  }

  getItemsSavings(): number {
    return this.cartItems.reduce((sum, item) => {
      const product = this.getProduct(item.productId);
      if (!product || !product.originalPrice || product.originalPrice <= item.price) return sum;
      return sum + (product.originalPrice - item.price) * item.quantity;
    }, 0);
  }

  getShipping(): number {
    return this.getSubtotal() >= this.freeShippingThreshold ? 0 : 9.99;
  }

  getTax(): number {
    return Math.max(0, (this.getSubtotal() - this.discount) * 0.08);
  }

  getTotal(): number {
    return Math.max(0, this.getSubtotal() - this.discount) + this.getShipping() + this.getTax();
  }

  getTotalSavings(): number {
    return this.getItemsSavings() + this.discount + (this.getSubtotal() >= this.freeShippingThreshold ? 9.99 : 0);
  }

  getEstimatedDelivery(): string {
    const now = new Date();
    const min = new Date(now);
    min.setDate(min.getDate() + 3);
    const max = new Date(now);
    max.setDate(max.getDate() + 6);
    const fmt = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return `Est. delivery ${fmt(min)}–${fmt(max)}`;
  }

  hasOutOfStockItems(): boolean {
    return this.cartItems.some(i => {
      const p = this.getProduct(i.productId);
      return p ? p.stock === 0 : false;
    });
  }

  clearCart(): void {
    if (this.cartItems.length === 0) return;
    if (confirm('Remove all items from cart?')) {
      this.cartService.clearCart();
      this.resetPromo();
    }
  }

  quickApply(code: string): void {
    this.promoCode = code;
    this.applyPromo();
  }

  applyPromo(): void {
    const code = this.promoCode.trim().toUpperCase();
    if (!code) {
      this.promoMessage = 'Please enter a promo code';
      this.promoApplied = false;
      this.discount = 0;
      this.appliedCode = '';
      return;
    }
    const match = this.availablePromos.find(p => p.code === code);
    if (match) {
      this.appliedCode = code;
      this.promoApplied = true;
      this.promoMessage = `${code} applied — ${match.percent}% off`;
      this.recomputePromoDiscount();
    } else {
      this.promoApplied = false;
      this.discount = 0;
      this.appliedCode = '';
      this.promoMessage = 'Invalid code. Try SAVE10, SAVE20, or TRENDY5.';
    }
  }

  removePromo(): void {
    this.resetPromo();
    this.promoMessage = 'Promo removed';
    setTimeout(() => {
      if (!this.promoApplied) this.promoMessage = '';
    }, 1800);
  }

  private resetPromo(): void {
    this.promoApplied = false;
    this.discount = 0;
    this.promoCode = '';
    this.appliedCode = '';
    this.promoMessage = '';
  }

  private recomputePromoDiscount(): void {
    if (!this.promoApplied || !this.appliedCode) {
      this.discount = 0;
      return;
    }
    const match = this.availablePromos.find(p => p.code === this.appliedCode);
    this.discount = match ? this.getSubtotal() * (match.percent / 100) : 0;
  }

  proceedToCheckout(): void {
    if (this.hasOutOfStockItems()) return;
    if (!this.isLoggedIn) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: '/checkout' } });
      return;
    }
    this.router.navigate(['/checkout']);
  }
}
