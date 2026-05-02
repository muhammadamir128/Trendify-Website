import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';

import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="min-h-screen bg-slate-100">
      <!-- Mobile overlay -->
      <div class="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden" *ngIf="isSidebarOpen" (click)="closeSidebar()"></div>

      <!-- Sidebar -->
      <aside
        class="fixed left-0 top-0 z-50 h-screen w-72 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-slate-100 shadow-2xl transition-all duration-300 lg:translate-x-0"
        [ngClass]="[
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
          isCollapsed ? 'lg:w-20' : 'lg:w-72'
        ]"
      >
        <div class="flex h-full flex-col">
          <!-- Brand -->
          <div class="relative flex items-center gap-3 border-b border-slate-800/80 px-5 py-5 overflow-hidden">
            <div class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 text-lg font-bold shadow-lg shadow-indigo-500/30">
              T
            </div>
            <div *ngIf="!isCollapsed" class="whitespace-nowrap animate-fade-in">
              <p class="text-[10px] uppercase tracking-[0.3em] text-slate-400">Trendify</p>
              <h2 class="text-lg font-bold leading-tight">Admin Panel</h2>
            </div>
          </div>

          <!-- Navigation -->
          <nav class="flex-1 space-y-1 overflow-y-auto px-3 py-4">
            <!-- Dashboard -->
            <a routerLink="/admin" [routerLinkActiveOptions]="{ exact: true }"
               routerLinkActive="!bg-gradient-to-r !from-sky-600/30 !to-indigo-600/10 !text-white !border-sky-500/40"
               (click)="closeSidebar()" [title]="isCollapsed ? 'Dashboard' : ''"
               class="group relative flex items-center gap-3 rounded-xl border border-transparent px-3 py-2.5 text-sm font-medium text-slate-300 hover:bg-slate-800/70 hover:text-white transition">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 7a1 1 0 011-1h5a1 1 0 011 1v5a1 1 0 01-1 1H4a1 1 0 01-1-1V7zM14 7a1 1 0 011-1h5a1 1 0 011 1v2a1 1 0 01-1 1h-5a1 1 0 01-1-1V7zM14 15a1 1 0 011-1h5a1 1 0 011 1v2a1 1 0 01-1 1h-5a1 1 0 01-1-1v-2zM3 17a1 1 0 011-1h5a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2z"/>
              </svg>
              <span *ngIf="!isCollapsed" class="whitespace-nowrap">Dashboard</span>
              <span *ngIf="isCollapsed" class="pointer-events-none absolute left-full ml-3 whitespace-nowrap rounded-md bg-slate-800 px-2.5 py-1 text-xs font-medium text-white opacity-0 shadow-lg group-hover:opacity-100 transition-opacity z-50">Dashboard</span>
            </a>

            <!-- Products -->
            <a routerLink="/admin/products"
               routerLinkActive="!bg-gradient-to-r !from-sky-600/30 !to-indigo-600/10 !text-white !border-sky-500/40"
               (click)="closeSidebar()" [title]="isCollapsed ? 'Products' : ''"
               class="group relative flex items-center gap-3 rounded-xl border border-transparent px-3 py-2.5 text-sm font-medium text-slate-300 hover:bg-slate-800/70 hover:text-white transition">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
              </svg>
              <span *ngIf="!isCollapsed" class="whitespace-nowrap">Products</span>
              <span *ngIf="isCollapsed" class="pointer-events-none absolute left-full ml-3 whitespace-nowrap rounded-md bg-slate-800 px-2.5 py-1 text-xs font-medium text-white opacity-0 shadow-lg group-hover:opacity-100 transition-opacity z-50">Products</span>
            </a>

            <!-- Categories -->
            <a routerLink="/admin/categories"
               routerLinkActive="!bg-gradient-to-r !from-sky-600/30 !to-indigo-600/10 !text-white !border-sky-500/40"
               (click)="closeSidebar()" [title]="isCollapsed ? 'Categories' : ''"
               class="group relative flex items-center gap-3 rounded-xl border border-transparent px-3 py-2.5 text-sm font-medium text-slate-300 hover:bg-slate-800/70 hover:text-white transition">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 11H5m14-4H5m14 8H5m14 4H5"/>
              </svg>
              <span *ngIf="!isCollapsed" class="whitespace-nowrap">Categories</span>
              <span *ngIf="isCollapsed" class="pointer-events-none absolute left-full ml-3 whitespace-nowrap rounded-md bg-slate-800 px-2.5 py-1 text-xs font-medium text-white opacity-0 shadow-lg group-hover:opacity-100 transition-opacity z-50">Categories</span>
            </a>

            <!-- Brands -->
            <a routerLink="/admin/brands"
               routerLinkActive="!bg-gradient-to-r !from-sky-600/30 !to-indigo-600/10 !text-white !border-sky-500/40"
               (click)="closeSidebar()" [title]="isCollapsed ? 'Brands' : ''"
               class="group relative flex items-center gap-3 rounded-xl border border-transparent px-3 py-2.5 text-sm font-medium text-slate-300 hover:bg-slate-800/70 hover:text-white transition">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M7 7h.01M7 3h5a2 2 0 011.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z"/>
              </svg>
              <span *ngIf="!isCollapsed" class="whitespace-nowrap">Brands</span>
              <span *ngIf="isCollapsed" class="pointer-events-none absolute left-full ml-3 whitespace-nowrap rounded-md bg-slate-800 px-2.5 py-1 text-xs font-medium text-white opacity-0 shadow-lg group-hover:opacity-100 transition-opacity z-50">Brands</span>
            </a>

            <!-- Orders -->
            <a routerLink="/admin/orders"
               routerLinkActive="!bg-gradient-to-r !from-sky-600/30 !to-indigo-600/10 !text-white !border-sky-500/40"
               (click)="closeSidebar()" [title]="isCollapsed ? 'Orders' : ''"
               class="group relative flex items-center gap-3 rounded-xl border border-transparent px-3 py-2.5 text-sm font-medium text-slate-300 hover:bg-slate-800/70 hover:text-white transition">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
              </svg>
              <span *ngIf="!isCollapsed" class="whitespace-nowrap">Orders</span>
              <span *ngIf="isCollapsed" class="pointer-events-none absolute left-full ml-3 whitespace-nowrap rounded-md bg-slate-800 px-2.5 py-1 text-xs font-medium text-white opacity-0 shadow-lg group-hover:opacity-100 transition-opacity z-50">Orders</span>
            </a>
          </nav>

          <!-- Footer -->
          <div class="border-t border-slate-800/80 p-3">
            <div *ngIf="!isCollapsed" class="mb-3 flex items-center gap-3 rounded-xl bg-slate-800/60 p-3">
              <div class="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-indigo-600 text-sm font-bold">
                {{ adminInitial }}
              </div>
              <div class="min-w-0">
                <p class="text-[10px] uppercase tracking-widest text-slate-400">Signed in</p>
                <p class="truncate text-sm font-semibold">{{ adminName }}</p>
              </div>
            </div>
            <button (click)="logout()" [title]="isCollapsed ? 'Logout' : ''"
                    class="group relative flex w-full items-center justify-center gap-2 rounded-xl bg-rose-600 px-3 py-2.5 text-sm font-semibold text-white shadow-lg shadow-rose-900/30 hover:bg-rose-700 transition">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
              </svg>
              <span *ngIf="!isCollapsed">Logout</span>
              <span *ngIf="isCollapsed" class="pointer-events-none absolute left-full ml-3 whitespace-nowrap rounded-md bg-slate-800 px-2.5 py-1 text-xs font-medium text-white opacity-0 shadow-lg group-hover:opacity-100 transition-opacity z-50">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      <!-- Content area -->
      <div class="transition-all duration-300" [ngClass]="isCollapsed ? 'lg:pl-20' : 'lg:pl-72'">
        <!-- Header -->
        <header class="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur-md shadow-sm">
          <div class="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-4 sm:px-6 lg:px-8">
            <div class="flex items-center gap-3">
              <!-- Mobile menu -->
              <button type="button" (click)="toggleSidebar()" aria-label="Open sidebar"
                      class="inline-flex h-10 w-10 items-center justify-center rounded-lg text-slate-700 hover:bg-slate-100 lg:hidden transition">
                <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
                </svg>
              </button>

              <!-- Desktop collapse -->
              <button type="button" (click)="toggleCollapse()" [attr.aria-label]="isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'"
                      class="hidden lg:inline-flex h-10 w-10 items-center justify-center rounded-lg text-slate-700 hover:bg-slate-100 transition">
                <svg *ngIf="!isCollapsed" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M11 19l-7-7 7-7m8 14l-7-7 7-7"/>
                </svg>
                <svg *ngIf="isCollapsed" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M13 5l7 7-7 7M5 5l7 7-7 7"/>
                </svg>
              </button>

              <div class="hidden sm:flex items-center gap-3">
                <span class="hidden sm:inline-block h-6 w-px bg-slate-200"></span>
                <div>
                  <p class="text-[10px] uppercase tracking-[0.2em] text-slate-500">Workspace</p>
                  <h1 class="text-base font-semibold text-slate-900 leading-tight">Admin Console</h1>
                </div>
              </div>
            </div>

            <div class="flex items-center gap-2 sm:gap-3">
              <div class="hidden md:flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 border border-emerald-200">
                <span class="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                System Online
              </div>
              <a routerLink="/" class="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 hover:text-slate-900 transition">
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
                </svg>
                <span class="hidden sm:inline">Back to Store</span>
              </a>
            </div>
          </div>
        </header>

        <main class="mx-auto max-w-[1600px] p-4 sm:p-6 lg:p-8">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `
})
export class AdminLayoutComponent implements OnInit {
  isSidebarOpen = false;
  isCollapsed = false;

  private readonly collapseKey = 'admin_sidebar_collapsed';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      this.isCollapsed = window.localStorage.getItem(this.collapseKey) === 'true';
    }
  }

  get adminName(): string {
    const user = this.authService.currentUserValue;
    return user ? `${user.firstName} ${user.lastName}` : 'Admin User';
  }

  get adminInitial(): string {
    const user = this.authService.currentUserValue;
    return (user?.firstName?.charAt(0) || 'A').toUpperCase();
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeSidebar(): void {
    this.isSidebarOpen = false;
  }

  toggleCollapse(): void {
    this.isCollapsed = !this.isCollapsed;
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(this.collapseKey, String(this.isCollapsed));
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
