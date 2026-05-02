import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AdminPaginationComponent } from '../../components/admin-pagination/admin-pagination.component';
import { Order, Product } from '../../models/interfaces';
import { CartService } from '../../services/cart.service';
import { DataService } from '../../services/data.service';

type StatusFilter = 'all' | Order['status'];

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, AdminPaginationComponent],
  template: `
    <div class="container mx-auto px-4 py-8 animate-fade-in">
      <!-- Page header -->
      <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div class="flex items-center gap-4">
          <div class="flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-lg"
               style="background: linear-gradient(135deg,#0ea5e9 0%,#6366f1 100%); box-shadow: 0 10px 25px -5px rgba(99,102,241,0.45);">
            <svg class="h-7 w-7" fill="none" stroke="white" stroke-width="2.25" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
            </svg>
          </div>
          <div>
            <h1 class="text-3xl font-bold text-slate-900">My Orders</h1>
            <p class="text-sm text-slate-500">Track and manage all your past purchases.</p>
          </div>
        </div>

        <a routerLink="/products" class="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition">
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
          New Order
        </a>
      </div>

      <!-- Stats -->
      <div *ngIf="orders.length > 0" class="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div class="flex items-center gap-3">
            <span class="flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-md"
                  style="background: linear-gradient(135deg,#0ea5e9 0%,#6366f1 100%);">
              <svg class="h-5 w-5" fill="none" stroke="white" stroke-width="2.25" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
            </span>
            <div>
              <p class="text-xs font-medium uppercase tracking-wider text-slate-500">Total Orders</p>
              <p class="text-xl font-extrabold text-slate-900">{{ orders.length }}</p>
            </div>
          </div>
        </div>
        <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div class="flex items-center gap-3">
            <span class="flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-md"
                  style="background: linear-gradient(135deg,#10b981 0%,#0d9488 100%);">
              <svg class="h-5 w-5" fill="none" stroke="white" stroke-width="2.25" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </span>
            <div>
              <p class="text-xs font-medium uppercase tracking-wider text-slate-500">Total Spent</p>
              <p class="text-xl font-extrabold text-slate-900">\${{ totalSpent | number:'1.0-0' }}</p>
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
              <p class="text-xs font-medium uppercase tracking-wider text-slate-500">Active</p>
              <p class="text-xl font-extrabold text-slate-900">{{ activeCount }}</p>
            </div>
          </div>
        </div>
        <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div class="flex items-center gap-3">
            <span class="flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-md"
                  style="background: linear-gradient(135deg,#a855f7 0%,#ec4899 100%);">
              <svg class="h-5 w-5" fill="none" stroke="white" stroke-width="2.25" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
            </span>
            <div>
              <p class="text-xs font-medium uppercase tracking-wider text-slate-500">Delivered</p>
              <p class="text-xl font-extrabold text-slate-900">{{ deliveredCount }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Filter tabs + search -->
      <div *ngIf="orders.length > 0" class="mb-5 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div class="flex flex-wrap gap-1.5 overflow-x-auto">
          <button *ngFor="let tab of statusTabs" type="button" (click)="setStatusFilter(tab.value)"
                  class="inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition whitespace-nowrap"
                  [class.bg-primary-600]="statusFilter === tab.value"
                  [class.text-white]="statusFilter === tab.value"
                  [class.shadow-md]="statusFilter === tab.value"
                  [class.text-slate-600]="statusFilter !== tab.value"
                  [class.hover:bg-slate-100]="statusFilter !== tab.value">
            {{ tab.label }}
            <span class="inline-flex min-w-[1.25rem] items-center justify-center rounded-full px-1.5 text-[10px] font-bold"
                  [class.bg-white]="statusFilter === tab.value"
                  [class.text-primary-700]="statusFilter === tab.value"
                  [class.bg-slate-100]="statusFilter !== tab.value"
                  [class.text-slate-600]="statusFilter !== tab.value">
              {{ getCountFor(tab.value) }}
            </span>
          </button>
        </div>

        <div class="flex items-center gap-2">
          <div class="relative flex-1">
            <svg class="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input type="text" [(ngModel)]="searchQuery" (ngModelChange)="currentPage = 1" placeholder="Search order #..."
                   class="w-full rounded-lg border border-slate-200 bg-slate-50 pl-8 pr-3 py-1.5 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500/20">
          </div>
          <select [(ngModel)]="sortBy" (ngModelChange)="currentPage = 1"
                  class="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500/20">
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="total-high">Highest $</option>
            <option value="total-low">Lowest $</option>
          </select>
        </div>
      </div>

      <!-- Loading skeleton -->
      <div *ngIf="loading" class="space-y-4">
        <div *ngFor="let s of [1,2,3]" class="animate-pulse rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div class="flex items-center justify-between">
            <div class="space-y-2">
              <div class="h-4 w-40 rounded bg-slate-200"></div>
              <div class="h-3 w-28 rounded bg-slate-100"></div>
            </div>
            <div class="h-8 w-24 rounded-full bg-slate-100"></div>
          </div>
          <div class="mt-4 flex gap-2">
            <div class="h-14 w-14 rounded-lg bg-slate-100"></div>
            <div class="h-14 w-14 rounded-lg bg-slate-100"></div>
          </div>
        </div>
      </div>

      <!-- Error -->
      <div *ngIf="error" class="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4">
        <svg class="h-5 w-5 flex-shrink-0 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.25"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
        <div>
          <p class="text-sm font-semibold text-rose-800">Failed to load orders</p>
          <p class="text-xs text-rose-700">{{ error }}</p>
        </div>
      </div>

      <!-- Empty state -->
      <div *ngIf="!loading && orders.length === 0 && !error"
           class="flex flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed border-slate-200 bg-white py-16 text-center">
        <div class="flex h-24 w-24 items-center justify-center rounded-full bg-slate-100">
          <svg class="h-12 w-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/>
          </svg>
        </div>
        <h2 class="text-2xl font-bold text-slate-900">No orders yet</h2>
        <p class="max-w-md text-sm text-slate-500">Start exploring our catalog — your orders will appear here once placed.</p>
        <a routerLink="/products"
           class="mt-3 inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:opacity-90"
           style="background: linear-gradient(135deg,#0ea5e9 0%,#6366f1 100%); box-shadow: 0 10px 25px -5px rgba(99,102,241,0.5);">
          Start Shopping
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
        </a>
      </div>

      <!-- Orders list -->
      <div *ngIf="filteredOrders.length > 0" class="space-y-4">
        <div *ngFor="let order of pagedOrders; let i = index"
             [style.animation-delay]="i * 0.05 + 's'"
             class="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md animate-fade-in">
          <!-- Status accent bar -->
          <div class="h-1 w-full" [style.background]="statusBar(order.status)"></div>

          <div class="p-5">
            <!-- Header row -->
            <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div class="flex items-start gap-3 flex-1 min-w-0">
                <div class="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl text-white shadow-md"
                     [style.background]="statusBar(order.status)">
                  <svg class="h-5 w-5" fill="none" stroke="white" stroke-width="2.25" viewBox="0 0 24 24">
                    <path *ngIf="order.status === 'pending'" stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    <path *ngIf="order.status === 'processing'" stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                    <path *ngIf="order.status === 'shipped'" stroke-linecap="round" stroke-linejoin="round" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0zM13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1"/>
                    <path *ngIf="order.status === 'delivered'" stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
                    <path *ngIf="order.status === 'cancelled'" stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </div>
                <div>
                  <div class="flex items-center gap-2">
                    <h3 class="font-bold text-slate-900">Order #{{ order.id }}</h3>
                    <button (click)="copyId(order.id)" class="inline-flex h-5 w-5 items-center justify-center rounded text-slate-400 hover:bg-slate-100 hover:text-slate-700" aria-label="Copy order ID">
                      <svg *ngIf="copiedId !== order.id" class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
                      <svg *ngIf="copiedId === order.id" class="h-3 w-3 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
                    </button>
                  </div>
                  <p class="mt-0.5 flex items-center gap-1.5 text-xs text-slate-500">
                    <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                    Placed {{ order.createdAt | date: 'medium' }}
                  </p>
                </div>
              </div>

              <div class="flex items-center gap-2 self-start sm:self-auto">
                <span class="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider capitalize"
                      [class.bg-amber-100]="order.status === 'pending'"
                      [class.text-amber-800]="order.status === 'pending'"
                      [class.bg-sky-100]="order.status === 'processing'"
                      [class.text-sky-800]="order.status === 'processing'"
                      [class.bg-indigo-100]="order.status === 'shipped'"
                      [class.text-indigo-800]="order.status === 'shipped'"
                      [class.bg-emerald-100]="order.status === 'delivered'"
                      [class.text-emerald-800]="order.status === 'delivered'"
                      [class.bg-rose-100]="order.status === 'cancelled'"
                      [class.text-rose-800]="order.status === 'cancelled'">
                  <span class="h-1.5 w-1.5 rounded-full"
                        [class.bg-amber-500]="order.status === 'pending'"
                        [class.bg-sky-500]="order.status === 'processing'"
                        [class.bg-indigo-500]="order.status === 'shipped'"
                        [class.bg-emerald-500]="order.status === 'delivered'"
                        [class.bg-rose-500]="order.status === 'cancelled'"
                        [class.animate-pulse]="order.status === 'pending' || order.status === 'processing' || order.status === 'shipped'"></span>
                  {{ order.status }}
                </span>

                <!-- Collapse/expand toggle -->
                <button type="button" (click)="toggleCollapse(order.id)"
                        [attr.aria-label]="collapsed[order.id] ? 'Expand order' : 'Collapse order'"
                        [attr.aria-expanded]="!collapsed[order.id]"
                        class="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700">
                  <svg class="h-4 w-4 transition-transform duration-300"
                       [class.rotate-180]="!collapsed[order.id]"
                       fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/>
                  </svg>
                </button>
              </div>
            </div>

            <!-- Collapsible body -->
            <div *ngIf="!collapsed[order.id]" class="animate-fade-in">
            <!-- Product thumbnails -->
            <div class="mt-4 flex flex-wrap items-center gap-2">
              <div *ngFor="let item of order.items.slice(0, 4)" class="group/item relative">
                <a *ngIf="getProduct(item.productId) as product" [routerLink]="'/product/' + product.id"
                   class="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-2 transition hover:border-primary-300 hover:bg-white">
                  <img [src]="product.images[0]" [alt]="product.name" class="h-10 w-10 rounded-lg object-cover">
                  <div class="min-w-0 max-w-[160px]">
                    <p class="truncate text-xs font-semibold text-slate-900">{{ product.name }}</p>
                    <p class="text-[10px] text-slate-500">Qty {{ item.quantity }} · \${{ item.price }}</p>
                  </div>
                </a>
                <span *ngIf="!getProduct(item.productId)" class="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs text-slate-500">
                  Product · Qty {{ item.quantity }}
                </span>
              </div>
              <span *ngIf="order.items.length > 4" class="inline-flex h-14 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 px-3 text-xs font-bold text-slate-500">
                +{{ order.items.length - 4 }} more
              </span>
            </div>

            <!-- Footer row -->
            <div class="mt-4 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
              <div class="flex items-center gap-4 text-xs">
                <div>
                  <p class="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Items</p>
                  <p class="font-bold text-slate-900">{{ totalItems(order) }}</p>
                </div>
                <div class="h-8 w-px bg-slate-200"></div>
                <div>
                  <p class="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Payment</p>
                  <p class="font-bold text-slate-900 capitalize">{{ (order.paymentMethod || '').replace('-', ' ') }}</p>
                </div>
                <div class="h-8 w-px bg-slate-200"></div>
                <div>
                  <p class="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Total</p>
                  <p class="text-lg font-extrabold text-primary-600">\${{ order.total.toFixed(2) }}</p>
                </div>
              </div>

              <div class="flex flex-wrap gap-2">
                <button (click)="toggleExpand(order.id)"
                        class="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition">
                  <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                  {{ expanded[order.id] ? 'Hide' : 'Details' }}
                </button>
                <button *ngIf="order.status === 'delivered' || order.status === 'cancelled'"
                        (click)="reorder(order)"
                        class="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold text-white shadow-md hover:opacity-90 transition"
                        style="background: linear-gradient(135deg,#0ea5e9 0%,#6366f1 100%);">
                  <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.25"><path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
                  Reorder
                </button>
              </div>
            </div>

            <!-- Expanded details -->
            <div *ngIf="expanded[order.id]" class="mt-4 grid grid-cols-1 gap-4 border-t border-slate-100 pt-4 md:grid-cols-2">
              <!-- Items list -->
              <div class="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
                <h4 class="mb-3 text-xs font-bold uppercase tracking-wider text-slate-700">All Items</h4>
                <ul class="space-y-2">
                  <li *ngFor="let item of order.items" class="flex items-center justify-between gap-2 text-sm">
                    <span class="flex-1 truncate text-slate-700">{{ getProduct(item.productId)?.name || 'Product #' + item.productId }}</span>
                    <span class="text-xs text-slate-500">×{{ item.quantity }}</span>
                    <span class="font-bold text-slate-900">\${{ (item.price * item.quantity).toFixed(2) }}</span>
                  </li>
                </ul>
              </div>

              <!-- Shipping address -->
              <div class="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
                <h4 class="mb-3 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700">
                  <svg class="h-3.5 w-3.5 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                  Shipping Address
                </h4>
                <div class="text-sm text-slate-700 space-y-0.5">
                  <p class="font-semibold">{{ order.shippingAddress?.street }}</p>
                  <p>{{ order.shippingAddress?.city }}, {{ order.shippingAddress?.state }} {{ order.shippingAddress?.zipCode }}</p>
                  <p>{{ order.shippingAddress?.country }}</p>
                </div>
              </div>
            </div>
            </div>
            <!-- /Collapsible body -->
          </div>
        </div>

        <!-- Pagination -->
        <app-admin-pagination
          [totalItems]="filteredOrders.length"
          [pageSize]="pageSize"
          [currentPage]="currentPage"
          (pageChange)="onPageChange($event)">
        </app-admin-pagination>
      </div>

      <!-- No matches -->
      <div *ngIf="!loading && orders.length > 0 && filteredOrders.length === 0"
           class="flex flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed border-slate-200 bg-white py-12 text-center">
        <div class="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
          <svg class="h-8 w-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
        </div>
        <p class="text-sm font-semibold text-slate-700">No matching orders</p>
        <p class="text-xs text-slate-500">Try a different filter or search.</p>
      </div>
    </div>
  `
})
export class OrdersComponent implements OnInit {
  orders: Order[] = [];
  products: Product[] = [];
  loading = false;
  error = '';

  statusFilter: StatusFilter = 'all';
  searchQuery = '';
  sortBy: 'newest' | 'oldest' | 'total-high' | 'total-low' = 'newest';
  expanded: Record<string, boolean> = {};
  collapsed: Record<string, boolean> = {};
  copiedId = '';

  pageSize = 5;
  currentPage = 1;

  readonly statusTabs: { label: string; value: StatusFilter }[] = [
    { label: 'All', value: 'all' },
    { label: 'Pending', value: 'pending' },
    { label: 'Processing', value: 'processing' },
    { label: 'Shipped', value: 'shipped' },
    { label: 'Delivered', value: 'delivered' },
    { label: 'Cancelled', value: 'cancelled' }
  ];

  constructor(
    private dataService: DataService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.dataService.getMyOrders().subscribe({
      next: (orders) => {
        this.orders = orders;
        this.loading = false;
      },
      error: (error) => {
        this.error = error?.error?.message || 'Failed to load orders';
        this.loading = false;
      }
    });

    this.dataService.getProducts().subscribe(products => {
      this.products = products;
    });
  }

  get pagedOrders(): Order[] {
    const all = this.filteredOrders;
    const totalPages = Math.max(1, Math.ceil(all.length / this.pageSize));
    if (this.currentPage > totalPages) this.currentPage = totalPages;
    const start = (this.currentPage - 1) * this.pageSize;
    return all.slice(start, start + this.pageSize);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  setStatusFilter(value: StatusFilter): void {
    this.statusFilter = value;
    this.currentPage = 1;
  }

  toggleCollapse(id: string): void {
    this.collapsed[id] = !this.collapsed[id];
  }

  get filteredOrders(): Order[] {
    const q = this.searchQuery.trim().toLowerCase();
    return this.orders
      .filter(o => this.statusFilter === 'all' || o.status === this.statusFilter)
      .filter(o => !q || o.id.toLowerCase().includes(q))
      .sort((a, b) => {
        switch (this.sortBy) {
          case 'oldest': return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          case 'total-high': return b.total - a.total;
          case 'total-low': return a.total - b.total;
          default: return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
      });
  }

  get totalSpent(): number {
    return this.orders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + o.total, 0);
  }

  get activeCount(): number {
    return this.orders.filter(o => o.status === 'pending' || o.status === 'processing' || o.status === 'shipped').length;
  }

  get deliveredCount(): number {
    return this.orders.filter(o => o.status === 'delivered').length;
  }

  getCountFor(value: StatusFilter): number {
    if (value === 'all') return this.orders.length;
    return this.orders.filter(o => o.status === value).length;
  }

  totalItems(order: Order): number {
    return order.items.reduce((s, i) => s + i.quantity, 0);
  }

  getProduct(productId: string): Product | undefined {
    return this.products.find(p => p.id === productId);
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

  toggleExpand(id: string): void {
    this.expanded[id] = !this.expanded[id];
  }

  copyId(id: string): void {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`#${id}`).then(() => {
        this.copiedId = id;
        setTimeout(() => this.copiedId = '', 1500);
      });
    }
  }

  reorder(order: Order): void {
    order.items.forEach(item => {
      this.cartService.addToCart(item.productId, item.price, item.quantity);
    });
  }
}
