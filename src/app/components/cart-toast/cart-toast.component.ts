import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { Product } from '../../models/interfaces';
import { CartService } from '../../services/cart.service';
import { DataService } from '../../services/data.service';
import { WishlistService } from '../../services/wishlist.service';

type ToastKind = 'cart-added' | 'cart-removed' | 'wishlist-added' | 'wishlist-removed';

interface Toast {
  id: number;
  kind: ToastKind;
  product: Product | null;
  quantity: number;
  totalQuantity: number;
  removing: boolean;
}

@Component({
  selector: 'app-cart-toast',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="pointer-events-none fixed bottom-24 right-4 z-50 flex w-full max-w-sm flex-col-reverse gap-3 sm:right-6">
      <div *ngFor="let toast of toasts; trackBy: trackId"
           class="pointer-events-auto toast-enter overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
           [class.toast-leave]="toast.removing">
        <!-- Top accent bar -->
        <div class="h-1 w-full" [style.background]="accentBar(toast.kind)"></div>

        <div class="p-4">
          <!-- Header row -->
          <div class="flex items-start gap-3">
            <!-- Icon -->
            <div class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full shadow-md"
                 [style.background]="iconBackground(toast.kind)"
                 [style.box-shadow]="iconShadow(toast.kind)">
              <svg *ngIf="toast.kind === 'cart-added'" class="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
              </svg>
              <svg *ngIf="toast.kind === 'cart-removed'" class="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M10 7V4a1 1 0 011-1h2a1 1 0 011 1v3"/>
              </svg>
              <svg *ngIf="toast.kind === 'wishlist-added'" class="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
              </svg>
              <svg *ngIf="toast.kind === 'wishlist-removed'" class="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0zM4 4l16 16"/>
              </svg>
            </div>
            <div class="flex-1">
              <p class="text-xs font-bold uppercase tracking-wider" [style.color]="labelColor(toast.kind)">
                {{ labelFor(toast.kind) }}
              </p>
              <p class="mt-0.5 text-xs text-slate-500">{{ subtitleFor(toast) }}</p>
            </div>
            <button type="button" (click)="dismiss(toast)" aria-label="Dismiss"
                    class="flex h-7 w-7 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700">
              <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <!-- Product info -->
          <div *ngIf="toast.product" class="mt-3 flex items-center gap-3 rounded-xl bg-slate-50 p-2.5">
            <div class="relative flex-shrink-0 overflow-hidden rounded-lg bg-white shadow-sm">
              <img [src]="toast.product.images[0]" [alt]="toast.product.name"
                   class="h-14 w-14 object-cover toast-zoom">
              <div *ngIf="toast.product.discount > 0"
                   class="absolute left-0 top-0 rounded-br-lg px-1.5 py-0.5 text-[9px] font-bold text-white"
                   style="background: linear-gradient(135deg,#f43f5e 0%,#db2777 100%);">
                -{{ toast.product.discount }}%
              </div>
            </div>
            <div class="min-w-0 flex-1">
              <p class="truncate text-sm font-bold text-slate-900">{{ toast.product.name }}</p>
              <div class="mt-0.5 flex items-center gap-2">
                <span class="text-sm font-extrabold text-primary-600">\${{ toast.product.price }}</span>
                <span *ngIf="toast.product.originalPrice > toast.product.price" class="text-xs text-slate-400 line-through">\${{ toast.product.originalPrice }}</span>
              </div>
              <p *ngIf="toast.kind === 'cart-added'" class="mt-0.5 text-[10px] text-slate-500">
                In cart: <span class="font-bold text-slate-700">{{ toast.totalQuantity }}</span>
              </p>
              <p *ngIf="toast.kind === 'cart-removed'" class="mt-0.5 text-[10px] text-slate-500">
                No longer in cart
              </p>
              <p *ngIf="toast.kind === 'wishlist-added'" class="mt-0.5 text-[10px] text-rose-600 font-semibold">
                ❤️ Saved for later
              </p>
              <p *ngIf="toast.kind === 'wishlist-removed'" class="mt-0.5 text-[10px] text-slate-500">
                No longer in wishlist
              </p>
            </div>
          </div>

          <!-- Actions (differ by kind) -->
          <div class="mt-3 grid grid-cols-2 gap-2">
            <button type="button" (click)="dismiss(toast)"
                    class="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50">
              {{ (toast.kind === 'wishlist-removed' || toast.kind === 'cart-removed') ? 'Dismiss' : 'Keep Shopping' }}
            </button>
            <a *ngIf="toast.kind === 'cart-added' || toast.kind === 'cart-removed'" routerLink="/cart" (click)="dismiss(toast)"
               class="inline-flex items-center justify-center gap-1 rounded-lg px-3 py-2 text-xs font-bold text-white shadow-md transition hover:opacity-90"
               style="background: linear-gradient(135deg,#0ea5e9 0%,#6366f1 100%);">
              View Cart
              <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
            </a>
            <a *ngIf="toast.kind === 'wishlist-added' || toast.kind === 'wishlist-removed'" routerLink="/wishlist" (click)="dismiss(toast)"
               class="inline-flex items-center justify-center gap-1 rounded-lg px-3 py-2 text-xs font-bold text-white shadow-md transition hover:opacity-90"
               style="background: linear-gradient(135deg,#f43f5e 0%,#ec4899 100%);">
              View Wishlist
              <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
            </a>
          </div>

          <!-- Progress bar for auto-dismiss -->
          <div class="mt-3 h-0.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div class="h-full toast-progress" [style.background]="accentBar(toast.kind)"></div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @keyframes toastIn {
      0% { opacity: 0; transform: translateX(120%) scale(0.9); }
      60% { transform: translateX(-8px) scale(1.02); }
      100% { opacity: 1; transform: translateX(0) scale(1); }
    }
    .toast-enter { animation: toastIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1); }

    @keyframes toastOut {
      to { opacity: 0; transform: translateX(120%) scale(0.9); }
    }
    .toast-leave { animation: toastOut 0.3s ease-in forwards; }

    @keyframes toastZoom {
      0% { transform: scale(1.3); }
      100% { transform: scale(1); }
    }
    .toast-zoom { animation: toastZoom 0.4s ease-out; }

    @keyframes toastProgress {
      from { width: 100%; }
      to { width: 0%; }
    }
    .toast-progress { animation: toastProgress 4s linear forwards; }
  `]
})
export class CartToastComponent implements OnInit, OnDestroy {
  toasts: Toast[] = [];
  private products: Product[] = [];
  private nextId = 1;
  private timers = new Map<number, ReturnType<typeof setTimeout>>();
  private destroy$ = new Subject<void>();

  constructor(
    private cartService: CartService,
    private wishlistService: WishlistService,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    this.dataService.getProducts().pipe(takeUntil(this.destroy$)).subscribe(products => {
      this.products = products;
    });

    this.cartService.added$.pipe(takeUntil(this.destroy$)).subscribe(event => {
      this.showToast({
        id: this.nextId++,
        kind: 'cart-added',
        product: this.findProduct(event.productId),
        quantity: event.quantity,
        totalQuantity: event.totalQuantity,
        removing: false
      });
    });

    this.cartService.removed$.pipe(takeUntil(this.destroy$)).subscribe(event => {
      this.showToast({
        id: this.nextId++,
        kind: 'cart-removed',
        product: this.findProduct(event.productId),
        quantity: 1,
        totalQuantity: 0,
        removing: false
      });
    });

    this.wishlistService.changed$.pipe(takeUntil(this.destroy$)).subscribe(event => {
      this.showToast({
        id: this.nextId++,
        kind: event.action === 'added' ? 'wishlist-added' : 'wishlist-removed',
        product: this.findProduct(event.productId),
        quantity: 1,
        totalQuantity: 1,
        removing: false
      });
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.timers.forEach(t => clearTimeout(t));
  }

  trackId = (_: number, t: Toast) => t.id;

  private findProduct(productId: string): Product | null {
    return this.products.find(p => p.id === productId) || null;
  }

  private showToast(toast: Toast): void {
    if (this.toasts.length >= 3) {
      const oldest = this.toasts[0];
      this.dismiss(oldest);
    }
    this.toasts.push(toast);

    const timer = setTimeout(() => this.dismiss(toast), 4000);
    this.timers.set(toast.id, timer);
  }

  dismiss(toast: Toast): void {
    if (toast.removing) return;
    toast.removing = true;
    const timer = this.timers.get(toast.id);
    if (timer) {
      clearTimeout(timer);
      this.timers.delete(toast.id);
    }
    setTimeout(() => {
      this.toasts = this.toasts.filter(t => t.id !== toast.id);
    }, 300);
  }

  // --- Styling helpers per kind ---

  labelFor(kind: ToastKind): string {
    switch (kind) {
      case 'cart-added': return 'Added to Cart';
      case 'cart-removed': return 'Removed from Cart';
      case 'wishlist-added': return 'Added to Wishlist';
      case 'wishlist-removed': return 'Removed from Wishlist';
    }
  }

  subtitleFor(toast: Toast): string {
    switch (toast.kind) {
      case 'cart-added':
        return `Item added successfully · ${toast.quantity > 1 ? '+' + toast.quantity + ' items' : '+1 item'}`;
      case 'cart-removed':
        return 'Item removed from your cart';
      case 'wishlist-added':
        return 'Saved to your wishlist for later';
      case 'wishlist-removed':
        return 'Item removed from your wishlist';
    }
  }

  accentBar(kind: ToastKind): string {
    switch (kind) {
      case 'cart-added': return 'linear-gradient(90deg,#10b981,#0d9488,#0ea5e9)';
      case 'cart-removed': return 'linear-gradient(90deg,#f59e0b,#ea580c,#f43f5e)';
      case 'wishlist-added': return 'linear-gradient(90deg,#f43f5e,#ec4899,#a855f7)';
      case 'wishlist-removed': return 'linear-gradient(90deg,#94a3b8,#64748b,#475569)';
    }
  }

  iconBackground(kind: ToastKind): string {
    switch (kind) {
      case 'cart-added': return 'linear-gradient(135deg,#10b981 0%,#0d9488 100%)';
      case 'cart-removed': return 'linear-gradient(135deg,#f59e0b 0%,#ea580c 100%)';
      case 'wishlist-added': return 'linear-gradient(135deg,#f43f5e 0%,#ec4899 100%)';
      case 'wishlist-removed': return 'linear-gradient(135deg,#94a3b8 0%,#64748b 100%)';
    }
  }

  iconShadow(kind: ToastKind): string {
    switch (kind) {
      case 'cart-added': return '0 8px 18px -4px rgba(16,185,129,0.5)';
      case 'cart-removed': return '0 8px 18px -4px rgba(245,158,11,0.5)';
      case 'wishlist-added': return '0 8px 18px -4px rgba(244,63,94,0.5)';
      case 'wishlist-removed': return '0 8px 18px -4px rgba(100,116,139,0.5)';
    }
  }

  labelColor(kind: ToastKind): string {
    switch (kind) {
      case 'cart-added': return '#047857';
      case 'cart-removed': return '#b45309';
      case 'wishlist-added': return '#be123c';
      case 'wishlist-removed': return '#475569';
    }
  }
}
