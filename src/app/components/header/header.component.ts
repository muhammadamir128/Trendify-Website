import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  NavigationEnd,
  Router,
  RouterModule,
} from '@angular/router';
import { filter } from 'rxjs/operators';

import { Product, User } from '../../models/interfaces';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { DataService } from '../../services/data.service';
import { WishlistService } from '../../services/wishlist.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <header class="sticky top-0 z-50 border-b border-slate-200/70 bg-white/90 backdrop-blur-md shadow-sm">
      <div class="container mx-auto px-4 py-3">
        <div class="flex items-center justify-between gap-4">
          <!-- Logo + page name -->
          <div class="flex items-center gap-3">
            <a routerLink="/" class="group flex items-center gap-2.5 transition">
              <span class="relative flex h-11 w-11 items-center justify-center rounded-2xl text-white shadow-lg transition group-hover:rotate-[-3deg] group-hover:scale-105"
                    style="background: linear-gradient(135deg,#0ea5e9 0%,#6366f1 100%); box-shadow: 0 8px 20px -4px rgba(99,102,241,0.5);">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 100 100" fill="white">
                  <path d="M24 34h52v11H58v30H42V45H24z"/>
                </svg>
                <span class="absolute -right-1 -top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full border-2 border-white"
                      style="background: #fbbf24;">
                  <span class="h-1 w-1 rounded-full bg-white"></span>
                </span>
              </span>
              <span class="text-2xl font-extrabold tracking-tight leading-none"
                    style="background: linear-gradient(135deg,#0ea5e9 0%,#6366f1 100%); -webkit-background-clip: text; background-clip: text; color: transparent;">
                Trendify
              </span>
            </a>

            <div *ngIf="pageName" class="hidden md:flex items-center gap-2">
              <span class="h-6 w-px bg-slate-200"></span>
              <span class="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                <span class="h-1.5 w-1.5 rounded-full bg-primary-500"></span>
                {{ pageName }}
              </span>
            </div>
          </div>

          <!-- Search Bar (Desktop) -->
          <div class="hidden md:flex flex-1 max-w-xl">
            <div class="relative w-full">
              <input type="text" [(ngModel)]="searchQuery" (keyup.enter)="performSearch()"
                     placeholder="Search products, brands, categories..."
                     class="w-full pl-11 pr-24 py-2.5 border border-slate-200 bg-slate-50 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white transition">
              <svg class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              <button (click)="performSearch()"
                      class="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full px-4 py-1.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
                      style="background: linear-gradient(135deg,#0ea5e9 0%,#6366f1 100%);">
                Search
              </button>
            </div>
          </div>

          <!-- Navigation -->
          <nav class="hidden md:flex items-center space-x-1">
            <a routerLink="/" routerLinkActive="text-primary-600 !bg-primary-50" [routerLinkActiveOptions]="{ exact: true }"
               class="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-primary-600 transition">Home</a>
            <a routerLink="/products" routerLinkActive="text-primary-600 !bg-primary-50"
               class="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-primary-600 transition">Products</a>
            <a routerLink="/contact" routerLinkActive="text-primary-600 !bg-primary-50"
               class="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-primary-600 transition">Contact</a>
          </nav>

          <!-- User Actions -->
          <div class="flex items-center space-x-4">
            <!-- Cart -->
            <a routerLink="/cart" class="relative p-2 text-gray-700 hover:text-primary-600 transition-colors" aria-label="Cart">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.1 5.2A2 2 0 0 0 7.8 21h8.4a2 2 0 0 0 1.9-2.8L16 13m-4.5 6.5h.01M10.5 19.5h.01"></path>
              </svg>
              <span *ngIf="cartItemCount > 0" class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                {{ cartItemCount }}
              </span>
            </a>

            <!-- Wishlist -->
            <a routerLink="/wishlist" class="relative p-2 text-gray-700 hover:text-primary-600 transition-colors" aria-label="Wishlist">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
              </svg>
              <span *ngIf="wishlistItemCount > 0" class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                {{ wishlistItemCount }}
              </span>
            </a>

            <!-- User Menu -->
            <div class="relative" *ngIf="currentUser; else loginButton">
              <button (click)="toggleUserMenu()" class="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-colors">
                <div class="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {{ currentUser.firstName.charAt(0).toUpperCase() }}
                </div>
                <span class="hidden md:block">{{ currentUser.firstName }}</span>
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>

              <!-- User Dropdown -->
              <div *ngIf="showUserMenu" class="absolute right-0 mt-2 w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl py-2 z-20">
                <!-- User header -->
                <div class="flex items-center gap-3 px-4 py-3 border-b border-slate-100">
                  <div class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-white font-bold"
                       style="background: linear-gradient(135deg,#0ea5e9 0%,#6366f1 100%);">
                    {{ currentUser.firstName.charAt(0).toUpperCase() }}{{ currentUser.lastName.charAt(0).toUpperCase() }}
                  </div>
                  <div class="min-w-0">
                    <p class="truncate text-sm font-bold text-slate-900">{{ currentUser.firstName }} {{ currentUser.lastName }}</p>
                    <p class="truncate text-xs text-slate-500">{{ currentUser.email }}</p>
                    <span class="mt-1 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize"
                          [class.bg-amber-100]="currentUser.role === 'admin'"
                          [class.text-amber-800]="currentUser.role === 'admin'"
                          [class.bg-emerald-100]="currentUser.role !== 'admin'"
                          [class.text-emerald-800]="currentUser.role !== 'admin'">
                      {{ currentUser.role }}
                    </span>
                  </div>
                </div>

                <!-- Links -->
                <a routerLink="/profile" (click)="showUserMenu = false" class="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition">
                  <svg class="h-4 w-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                  <span class="font-medium">My Profile</span>
                </a>

                <a *ngIf="currentUser.role === 'admin'" routerLink="/admin" (click)="showUserMenu = false" class="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition">
                  <svg class="h-4 w-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 7a1 1 0 011-1h5a1 1 0 011 1v5a1 1 0 01-1 1H4a1 1 0 01-1-1V7zM14 7a1 1 0 011-1h5a1 1 0 011 1v2a1 1 0 01-1 1h-5a1 1 0 01-1-1V7zM14 15a1 1 0 011-1h5a1 1 0 011 1v2a1 1 0 01-1 1h-5a1 1 0 01-1-1v-2zM3 17a1 1 0 011-1h5a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2z"/></svg>
                  <span class="font-medium">Admin Dashboard</span>
                </a>

                <a routerLink="/orders" (click)="showUserMenu = false" class="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition">
                  <svg class="h-4 w-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
                  <span class="font-medium">My Orders</span>
                </a>

                <a routerLink="/wishlist" (click)="showUserMenu = false" class="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition">
                  <svg class="h-4 w-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
                  <span class="font-medium">Wishlist</span>
                </a>

                <div class="my-1 border-t border-slate-100"></div>

                <a routerLink="/logout" (click)="showUserMenu = false" class="flex items-center gap-3 px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 transition">
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
                  <span class="font-semibold">Sign Out</span>
                </a>
              </div>
            </div>

            <ng-template #loginButton>
              <a routerLink="/login" class="btn-primary">Login</a>
            </ng-template>

            <!-- Mobile Menu Button -->
            <button (click)="toggleMobileMenu()" class="md:hidden p-2 text-gray-700">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </div>
        </div>

        <!-- Mobile Search -->
        <div *ngIf="showMobileSearch" class="md:hidden mt-4">
          <div class="relative">
            <input type="text" [(ngModel)]="searchQuery" (keyup.enter)="performSearch()" 
                   placeholder="Search products, brands, categories..." 
                   class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent">
            <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
            <button (click)="performSearch()" class="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary-600 text-white px-3 py-1 rounded-full text-sm">
              Search
            </button>
          </div>
        </div>

        <!-- Mobile Navigation -->
        <nav *ngIf="showMobileMenu" class="md:hidden mt-4 space-y-2">
          <button (click)="toggleMobileSearch()" class="block w-full text-left py-2 text-gray-700 hover:text-primary-600 transition-colors">
            <i class="ri-search-line mr-2"></i>Search
          </button>
          <a routerLink="/" class="block py-2 text-gray-700 hover:text-primary-600 transition-colors">Home</a>
          <a routerLink="/products" class="block py-2 text-gray-700 hover:text-primary-600 transition-colors">Products</a>
          <a routerLink="/contact" class="block py-2 text-gray-700 hover:text-primary-600 transition-colors">Contact</a>
        </nav>
      </div>
    </header>
  `
})
export class HeaderComponent implements OnInit {
  currentUser: User | null = null;
  cartItemCount = 0;
  wishlistItemCount = 0;
  showUserMenu = false;
  showMobileMenu = false;
  showMobileSearch = false;
  searchQuery = '';
  pageName = '';

  private products: Product[] = [];

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private wishlistService: WishlistService,
    private dataService: DataService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    this.cartService.cartItems$.subscribe(items => {
      this.cartItemCount = items.reduce((count, item) => count + item.quantity, 0);
    });

    this.wishlistService.wishlistItems$.subscribe(items => {
      this.wishlistItemCount = items.length;
    });

    this.dataService.products$.subscribe(products => {
      this.products = products;
      this.pageName = this.resolvePageName(this.router.url);
    });

    this.pageName = this.resolvePageName(this.router.url);
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe(event => {
        this.pageName = this.resolvePageName(event.urlAfterRedirects);
      });
  }

  private resolvePageName(url: string): string {
    const clean = url.split('?')[0].split('#')[0];
    if (clean === '/' || clean === '') return 'Home';
    if (clean.startsWith('/products')) return 'Products';
    if (clean.startsWith('/product/')) {
      const id = clean.split('/')[2];
      const match = this.products.find(p => p.id === id);
      return match ? match.name : 'Product Details';
    }
    if (clean.startsWith('/cart')) return 'Cart';
    if (clean.startsWith('/wishlist')) return 'Wishlist';
    if (clean.startsWith('/checkout/thank-you')) return 'Order Confirmed';
    if (clean.startsWith('/checkout')) return 'Checkout';
    if (clean.startsWith('/profile')) return 'Profile';
    if (clean.startsWith('/orders')) return 'My Orders';
    if (clean.startsWith('/login')) return 'Sign In';
    if (clean.startsWith('/register')) return 'Register';
    if (clean.startsWith('/contact')) return 'Contact';
    if (clean.startsWith('/admin')) return 'Admin';
    return '';
  }

  performSearch(): void {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/products'], { queryParams: { search: this.searchQuery.trim() } });
      this.showMobileMenu = false;
      this.showMobileSearch = false;
    }
  }

  toggleUserMenu(): void {
    this.showUserMenu = !this.showUserMenu;
  }

  toggleMobileMenu(): void {
    this.showMobileMenu = !this.showMobileMenu;
    this.showMobileSearch = false;
  }

  toggleMobileSearch(): void {
    this.showMobileSearch = !this.showMobileSearch;
  }

  logout(): void {
    this.authService.logout();
    this.showUserMenu = false;
    this.router.navigate(['/login']);
  }
}
