import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AdminPaginationComponent } from '../../../components/admin-pagination/admin-pagination.component';
import { Order } from '../../../models/interfaces';
import { DataService } from '../../../services/data.service';

type StatusFilter = 'all' | Order['status'];

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminPaginationComponent],
  template: `
    <div class="space-y-6">
      <div class="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div class="flex items-center gap-4">
          <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/30">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
            </svg>
          </div>
          <div>
            <h1 class="text-2xl font-bold text-slate-900 sm:text-3xl">All Orders</h1>
            <p class="text-sm text-slate-500">Track order history, customers, and order status.</p>
          </div>
        </div>
        <div *ngIf="orders.length > 0" class="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 border border-emerald-200">
          <span class="h-2 w-2 rounded-full bg-emerald-500"></span>
          {{ orders.length }} Total Orders
        </div>
      </div>

      <!-- Loading -->
      <div *ngIf="loading" class="space-y-3">
        <div *ngFor="let s of [1,2,3]" class="animate-pulse rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div class="flex items-center gap-4">
            <div class="h-10 w-10 rounded-xl bg-slate-200"></div>
            <div class="flex-1 space-y-2">
              <div class="h-3 w-32 rounded bg-slate-200"></div>
              <div class="h-3 w-48 rounded bg-slate-100"></div>
            </div>
            <div class="h-6 w-20 rounded-full bg-slate-100"></div>
          </div>
        </div>
      </div>

      <!-- Error -->
      <div *ngIf="error && !loading" class="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 shadow-sm">
        <svg class="h-5 w-5 flex-shrink-0 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.25"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
        <div>
          <p class="text-sm font-semibold text-rose-800">Failed to load orders</p>
          <p class="text-xs text-rose-700">{{ error }}</p>
        </div>
      </div>

      <!-- Stats bar -->
      <div *ngIf="!loading && !error && orders.length > 0" class="grid grid-cols-2 gap-3 md:grid-cols-4">
        <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div class="flex items-center gap-3">
            <span class="flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-md"
                  style="background: linear-gradient(135deg,#10b981 0%,#0d9488 100%);">
              <svg class="h-5 w-5" fill="none" stroke="white" stroke-width="2.25" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </span>
            <div>
              <p class="text-[10px] font-bold uppercase tracking-wider text-slate-500">Revenue</p>
              <p class="text-lg font-extrabold text-slate-900">\${{ totalRevenue | number:'1.0-0' }}</p>
            </div>
          </div>
        </div>
        <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div class="flex items-center gap-3">
            <span class="flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-md"
                  style="background: linear-gradient(135deg,#f59e0b 0%,#ea580c 100%);">
              <svg class="h-5 w-5" fill="none" stroke="white" stroke-width="2.25" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </span>
            <div>
              <p class="text-[10px] font-bold uppercase tracking-wider text-slate-500">Pending</p>
              <p class="text-lg font-extrabold text-slate-900">{{ statusCount('pending') }}</p>
            </div>
          </div>
        </div>
        <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div class="flex items-center gap-3">
            <span class="flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-md"
                  style="background: linear-gradient(135deg,#6366f1 0%,#a855f7 100%);">
              <svg class="h-5 w-5" fill="none" stroke="white" stroke-width="2.25" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
            </span>
            <div>
              <p class="text-[10px] font-bold uppercase tracking-wider text-slate-500">Active</p>
              <p class="text-lg font-extrabold text-slate-900">{{ activeCount }}</p>
            </div>
          </div>
        </div>
        <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div class="flex items-center gap-3">
            <span class="flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-md"
                  style="background: linear-gradient(135deg,#10b981 0%,#059669 100%);">
              <svg class="h-5 w-5" fill="none" stroke="white" stroke-width="2.25" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
            </span>
            <div>
              <p class="text-[10px] font-bold uppercase tracking-wider text-slate-500">Delivered</p>
              <p class="text-lg font-extrabold text-slate-900">{{ statusCount('delivered') }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Toolbar -->
      <div *ngIf="!loading && !error && orders.length > 0"
           class="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div class="relative flex-1 lg:max-w-md">
          <svg class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <input type="text" [(ngModel)]="searchQuery" (ngModelChange)="currentPage = 1"
                 placeholder="Search by order # or customer…"
                 class="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 py-2.5 text-sm text-slate-700 focus:border-primary-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition">
        </div>
        <div class="flex flex-wrap items-center gap-2">
          <div class="flex flex-wrap gap-1">
            <button *ngFor="let tab of statusTabs" type="button" (click)="setStatus(tab.value)"
                    class="inline-flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-bold transition"
                    [class.bg-primary-600]="status === tab.value"
                    [class.text-white]="status === tab.value"
                    [class.shadow-md]="status === tab.value"
                    [class.bg-slate-50]="status !== tab.value"
                    [class.text-slate-700]="status !== tab.value"
                    [class.hover:bg-slate-100]="status !== tab.value">
              {{ tab.label }}
              <span class="inline-flex min-w-[1.25rem] items-center justify-center rounded-full px-1.5 text-[10px] font-bold"
                    [class.bg-white]="status === tab.value"
                    [class.text-primary-700]="status === tab.value"
                    [class.bg-slate-200]="status !== tab.value"
                    [class.text-slate-600]="status !== tab.value">
                {{ tab.value === 'all' ? orders.length : statusCount(tab.value) }}
              </span>
            </button>
          </div>
          <select [(ngModel)]="sortBy"
                  class="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 focus:border-primary-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20">
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="total-high">Total ↓</option>
            <option value="total-low">Total ↑</option>
          </select>
        </div>
      </div>

      <!-- Orders table -->
      <div *ngIf="!loading && !error && orders.length > 0" class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100">
                <th class="px-4 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-slate-600">Order</th>
                <th class="px-4 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-slate-600">Customer</th>
                <th class="px-4 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-slate-600 hidden md:table-cell">Items</th>
                <th class="px-4 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-slate-600">Status</th>
                <th class="px-4 py-3.5 text-right text-[11px] font-bold uppercase tracking-wider text-slate-600">Total</th>
                <th class="px-4 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-slate-600 hidden lg:table-cell">Date</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 bg-white">
              <tr *ngFor="let order of paginatedOrders; let i = index"
                  [style.animation-delay]="i * 0.03 + 's'"
                  class="group transition-all duration-200 hover:bg-slate-50/70 animate-fade-in">

                <!-- Order # -->
                <td class="px-4 py-4 align-middle">
                  <div class="flex items-center gap-3">
                    <span class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-white shadow-md"
                          [style.background]="statusBar(order.status)">
                      <svg class="h-5 w-5" fill="none" stroke="white" stroke-width="2.25" viewBox="0 0 24 24">
                        <path *ngIf="order.status === 'pending'" stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        <path *ngIf="order.status === 'processing'" stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                        <path *ngIf="order.status === 'shipped'" stroke-linecap="round" stroke-linejoin="round" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0zM13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1"/>
                        <path *ngIf="order.status === 'delivered'" stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
                        <path *ngIf="order.status === 'cancelled'" stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
                      </svg>
                    </span>
                    <div>
                      <p class="text-sm font-extrabold text-slate-900">#{{ order.id }}</p>
                      <p class="text-[11px] text-slate-500 lg:hidden">{{ order.createdAt | date: 'mediumDate' }}</p>
                    </div>
                  </div>
                </td>

                <!-- Customer -->
                <td class="px-4 py-4 align-middle">
                  <div class="flex items-center gap-2">
                    <div class="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-slate-200 to-slate-300 text-xs font-extrabold text-slate-700">
                      {{ customerInitials(order) }}
                    </div>
                    <div class="min-w-0">
                      <p class="text-sm font-bold text-slate-900 line-clamp-1">{{ order.customer?.firstName }} {{ order.customer?.lastName }}</p>
                      <p class="text-xs text-slate-500 line-clamp-1">{{ order.customer?.email }}</p>
                    </div>
                  </div>
                </td>

                <!-- Items -->
                <td class="px-4 py-4 align-middle hidden md:table-cell">
                  <span class="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700">
                    <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
                    {{ itemCount(order) }}
                  </span>
                </td>

                <!-- Status -->
                <td class="px-4 py-4 align-middle">
                  <span class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold uppercase tracking-wider capitalize ring-1"
                        [class.bg-amber-50]="order.status === 'pending'"
                        [class.text-amber-700]="order.status === 'pending'"
                        [class.ring-amber-200]="order.status === 'pending'"
                        [class.bg-sky-50]="order.status === 'processing'"
                        [class.text-sky-700]="order.status === 'processing'"
                        [class.ring-sky-200]="order.status === 'processing'"
                        [class.bg-indigo-50]="order.status === 'shipped'"
                        [class.text-indigo-700]="order.status === 'shipped'"
                        [class.ring-indigo-200]="order.status === 'shipped'"
                        [class.bg-emerald-50]="order.status === 'delivered'"
                        [class.text-emerald-700]="order.status === 'delivered'"
                        [class.ring-emerald-200]="order.status === 'delivered'"
                        [class.bg-rose-50]="order.status === 'cancelled'"
                        [class.text-rose-700]="order.status === 'cancelled'"
                        [class.ring-rose-200]="order.status === 'cancelled'">
                    <span class="h-1.5 w-1.5 rounded-full"
                          [class.bg-amber-500]="order.status === 'pending'"
                          [class.bg-sky-500]="order.status === 'processing'"
                          [class.bg-indigo-500]="order.status === 'shipped'"
                          [class.bg-emerald-500]="order.status === 'delivered'"
                          [class.bg-rose-500]="order.status === 'cancelled'"
                          [class.animate-pulse]="order.status === 'pending' || order.status === 'processing' || order.status === 'shipped'"></span>
                    {{ order.status }}
                  </span>
                </td>

                <!-- Total -->
                <td class="px-4 py-4 align-middle text-right">
                  <p class="text-sm font-extrabold text-slate-900">\${{ order.total.toFixed(2) }}</p>
                  <p class="text-[11px] font-semibold uppercase tracking-wider text-slate-400">{{ (order.paymentMethod || '—') }}</p>
                </td>

                <!-- Date -->
                <td class="px-4 py-4 align-middle hidden lg:table-cell">
                  <p class="text-xs font-semibold text-slate-700">{{ order.createdAt | date: 'MMM d, y' }}</p>
                  <p class="text-[11px] text-slate-500">{{ order.createdAt | date: 'shortTime' }}</p>
                </td>
              </tr>

              <!-- Empty filter row -->
              <tr *ngIf="filteredOrders.length === 0">
                <td colspan="6" class="px-4 py-14 text-center">
                  <div class="mx-auto flex max-w-sm flex-col items-center gap-3">
                    <div class="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
                      <svg class="h-8 w-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                    </div>
                    <p class="text-sm font-bold text-slate-700">No matching orders</p>
                    <p class="text-xs text-slate-500">Try adjusting your search or status filter.</p>
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

      <!-- No orders state -->
      <div *ngIf="!loading && !error && orders.length === 0"
           class="flex flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed border-slate-200 bg-white py-16 text-center">
        <div class="flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
          <svg class="h-10 w-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/>
          </svg>
        </div>
        <h3 class="text-xl font-bold text-slate-900">No orders yet</h3>
        <p class="text-sm text-slate-500">Customer orders will appear here once placed.</p>
      </div>

      <app-admin-pagination
        [totalItems]="filteredOrders.length"
        [pageSize]="pageSize"
        [currentPage]="currentPage"
        (pageChange)="onPageChange($event)"
      ></app-admin-pagination>
    </div>
  `
})
export class AdminOrdersComponent implements OnInit {
  orders: Order[] = [];
  loading = false;
  error = '';
  currentPage = 1;
  readonly pageSize = 10;

  searchQuery = '';
  status: StatusFilter = 'all';
  sortBy: 'newest' | 'oldest' | 'total-high' | 'total-low' = 'newest';

  readonly statusTabs: { label: string; value: StatusFilter }[] = [
    { label: 'All', value: 'all' },
    { label: 'Pending', value: 'pending' },
    { label: 'Processing', value: 'processing' },
    { label: 'Shipped', value: 'shipped' },
    { label: 'Delivered', value: 'delivered' },
    { label: 'Cancelled', value: 'cancelled' }
  ];

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.loading = true;
    this.dataService.getAdminOrders().subscribe({
      next: (orders) => {
        this.orders = orders;
        this.ensureValidPage();
        this.loading = false;
      },
      error: (error) => {
        this.error = error?.error?.message || 'Failed to load admin orders';
        this.loading = false;
      }
    });
  }

  get filteredOrders(): Order[] {
    const q = this.searchQuery.trim().toLowerCase();
    let list = this.orders.filter(o => {
      if (this.status !== 'all' && o.status !== this.status) return false;
      if (!q) return true;
      const name = `${o.customer?.firstName ?? ''} ${o.customer?.lastName ?? ''}`.toLowerCase();
      const email = (o.customer?.email ?? '').toLowerCase();
      return o.id.toLowerCase().includes(q) || name.includes(q) || email.includes(q);
    });

    list = [...list].sort((a, b) => {
      switch (this.sortBy) {
        case 'oldest': return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'total-high': return b.total - a.total;
        case 'total-low': return a.total - b.total;
        default: return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });
    return list;
  }

  get paginatedOrders(): Order[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredOrders.slice(start, start + this.pageSize);
  }

  get totalRevenue(): number {
    return this.orders
      .filter(o => o.status !== 'cancelled')
      .reduce((sum, o) => sum + o.total, 0);
  }

  get activeCount(): number {
    return this.orders.filter(o => o.status === 'pending' || o.status === 'processing' || o.status === 'shipped').length;
  }

  statusCount(status: Order['status']): number {
    return this.orders.filter(o => o.status === status).length;
  }

  itemCount(order: Order): number {
    return (order.items ?? []).reduce((s, i) => s + i.quantity, 0);
  }

  customerInitials(order: Order): string {
    const first = order.customer?.firstName?.[0] ?? '';
    const last = order.customer?.lastName?.[0] ?? '';
    const initials = `${first}${last}`.toUpperCase();
    return initials || '?';
  }

  statusBar(status: Order['status']): string {
    switch (status) {
      case 'pending': return 'linear-gradient(135deg,#f59e0b 0%,#ea580c 100%)';
      case 'processing': return 'linear-gradient(135deg,#0ea5e9 0%,#0891b2 100%)';
      case 'shipped': return 'linear-gradient(135deg,#6366f1 0%,#a855f7 100%)';
      case 'delivered': return 'linear-gradient(135deg,#10b981 0%,#0d9488 100%)';
      case 'cancelled': return 'linear-gradient(135deg,#f43f5e 0%,#db2777 100%)';
    }
  }

  setStatus(value: StatusFilter): void {
    this.status = value;
    this.currentPage = 1;
  }

  resetFilters(): void {
    this.searchQuery = '';
    this.status = 'all';
    this.sortBy = 'newest';
    this.currentPage = 1;
  }

  onPageChange(page: number): void {
    this.currentPage = page;
  }

  private ensureValidPage(): void {
    const totalPages = Math.max(1, Math.ceil(this.filteredOrders.length / this.pageSize));
    if (this.currentPage > totalPages) {
      this.currentPage = totalPages;
    }
  }
}