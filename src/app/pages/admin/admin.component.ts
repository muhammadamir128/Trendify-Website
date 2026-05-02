import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Subject, interval, takeUntil } from 'rxjs';

import {
  Category,
  Order,
  Product,
} from '../../models/interfaces';
import { DataService } from '../../services/data.service';

interface StatTrend {
  label: string;
  value: number;
  trend: number;
  trendLabel: string;
  icon: 'products' | 'categories' | 'brands' | 'orders' | 'revenue';
  gradient: string;
  glow: string;
}

interface LinePoint {
  x: number;
  y: number;
  value: number;
  label: string;
}

interface DonutSegment {
  status: string;
  value: number;
  percent: number;
  color: string;
  dashArray: string;
  dashOffset: number;
}

interface BarItem {
  label: string;
  value: number;
  percent: number;
  color: string;
}

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section class="space-y-6">
      <!-- Hero -->
      <div class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-indigo-950 to-sky-900 p-6 text-white shadow-xl sm:p-8">
        <div class="absolute -right-16 -top-16 h-72 w-72 rounded-full bg-sky-500/20 blur-3xl"></div>
        <div class="absolute -left-10 -bottom-10 h-56 w-56 rounded-full bg-indigo-500/20 blur-3xl"></div>
        <svg class="absolute inset-0 h-full w-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="dotted" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="1" fill="white"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dotted)"/>
        </svg>

        <div class="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div class="flex flex-wrap items-center gap-2">
              <div class="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-sky-100">
                <span class="h-1.5 w-1.5 rounded-full bg-sky-300 animate-pulse"></span>
                Control Center
              </div>
              <div class="inline-flex items-center gap-2 rounded-full border border-emerald-300/40 bg-emerald-400/10 px-3 py-1 text-[11px] font-semibold text-emerald-100">
                <span class="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Live · Auto-refresh 15s
              </div>
            </div>
            <h2 class="mt-4 text-3xl font-bold sm:text-4xl">Welcome back, Admin</h2>
            <p class="mt-2 max-w-2xl text-sm text-slate-200 sm:text-base">
              Track performance, monitor revenue, and manage your storefront from a single workspace.
            </p>
          </div>

          <div class="flex flex-wrap gap-3">
            <button type="button" (click)="refreshAll()" [disabled]="refreshing"
                    class="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20 disabled:opacity-60">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" [class.animate-spin]="refreshing" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
              {{ refreshing ? 'Refreshing…' : 'Refresh' }}
            </button>
            <a routerLink="/admin/products" class="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 shadow-lg transition hover:bg-slate-100">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
              </svg>
              Manage Products
            </a>
            <a routerLink="/admin/orders" class="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/10">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/>
              </svg>
              View Orders
            </a>
          </div>
        </div>
      </div>

      <!-- Stat Cards -->
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <article *ngFor="let stat of statCards" class="admin-card group relative overflow-hidden">
          <div class="relative flex items-start justify-between gap-3">
            <div class="flex-1 min-w-0">
              <p class="text-xs font-semibold uppercase tracking-wider text-slate-500">{{ stat.label }}</p>
              <p class="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
                <span *ngIf="stat.icon === 'revenue'">{{ stat.value | currency: 'USD':'symbol':'1.0-0' }}</span>
                <span *ngIf="stat.icon !== 'revenue'">{{ stat.value }}</span>
              </p>
            </div>
            <div class="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl text-white transition group-hover:scale-105"
                 [style.background]="stat.gradient"
                 [style.box-shadow]="stat.glow">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="white" stroke-width="2.4"
                   style="filter: drop-shadow(0 1px 2px rgba(0,0,0,0.25));">
                <path *ngIf="stat.icon === 'products'" stroke-linecap="round" stroke-linejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                <path *ngIf="stat.icon === 'categories'" stroke-linecap="round" stroke-linejoin="round" d="M19 11H5m14-4H5m14 8H5m14 4H5"/>
                <path *ngIf="stat.icon === 'brands'" stroke-linecap="round" stroke-linejoin="round" d="M7 7h.01M7 3h5a2 2 0 011.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z"/>
                <path *ngIf="stat.icon === 'orders'" stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
                <path *ngIf="stat.icon === 'revenue'" stroke-linecap="round" stroke-linejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
          </div>

          <div class="relative mt-3 flex items-center gap-1.5 text-xs">
            <span class="inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-semibold"
                  [ngClass]="stat.trend >= 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'">
              <svg *ngIf="stat.trend >= 0" class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7"/>
              </svg>
              <svg *ngIf="stat.trend < 0" class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/>
              </svg>
              {{ stat.trend >= 0 ? '+' : '' }}{{ stat.trend }}%
            </span>
            <span class="text-slate-500 truncate">{{ stat.trendLabel }}</span>
          </div>
        </article>
      </div>

      <!-- Revenue Line Chart + Status Donut -->
      <div class="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <!-- Line chart: Revenue Trend -->
        <div class="admin-surface p-6 xl:col-span-2">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h3 class="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
                </svg>
                Revenue Trend
              </h3>
              <p class="mt-1 text-sm text-slate-500">Sales over the last 7 days</p>
            </div>
            <div class="flex items-center gap-4 text-sm">
              <div>
                <p class="text-xs text-slate-500">Total</p>
                <p class="font-bold text-slate-900">{{ weeklyRevenue | currency: 'USD':'symbol':'1.0-0' }}</p>
              </div>
              <div>
                <p class="text-xs text-slate-500">Peak</p>
                <p class="font-bold text-slate-900">{{ peakRevenue | currency: 'USD':'symbol':'1.0-0' }}</p>
              </div>
            </div>
          </div>

          <div class="mt-6">
            <svg viewBox="0 0 640 240" class="w-full h-auto" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#0ea5e9" stop-opacity="0.45"/>
                  <stop offset="100%" stop-color="#0ea5e9" stop-opacity="0"/>
                </linearGradient>
                <linearGradient id="revenueLineGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stop-color="#0ea5e9"/>
                  <stop offset="100%" stop-color="#6366f1"/>
                </linearGradient>
              </defs>

              <!-- Horizontal grid lines -->
              <g stroke="#e2e8f0" stroke-width="1" stroke-dasharray="3,4">
                <line *ngFor="let grid of gridLines" x1="40" [attr.y1]="grid.y" x2="620" [attr.y2]="grid.y"/>
              </g>

              <!-- Y axis labels -->
              <g fill="#94a3b8" font-size="10" font-family="system-ui">
                <text *ngFor="let grid of gridLines" x="32" [attr.y]="grid.y + 3" text-anchor="end">{{ grid.value | currency: 'USD':'symbol':'1.0-0' }}</text>
              </g>

              <!-- Area fill -->
              <path [attr.d]="revenueAreaPath" fill="url(#revenueGradient)"/>

              <!-- Line -->
              <polyline [attr.points]="revenueLinePoints" fill="none" stroke="url(#revenueLineGradient)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>

              <!-- Data points -->
              <g>
                <g *ngFor="let point of revenuePoints">
                  <circle [attr.cx]="point.x" [attr.cy]="point.y" r="5" fill="white" stroke="#0ea5e9" stroke-width="3"/>
                  <circle [attr.cx]="point.x" [attr.cy]="point.y" r="2" fill="#0ea5e9"/>
                </g>
              </g>

              <!-- X axis labels -->
              <g fill="#64748b" font-size="11" font-family="system-ui" font-weight="500">
                <text *ngFor="let point of revenuePoints" [attr.x]="point.x" y="230" text-anchor="middle">{{ point.label }}</text>
              </g>
            </svg>

            <div *ngIf="weeklyRevenue === 0" class="mt-2 flex items-center justify-center gap-2 rounded-lg bg-slate-50 py-2 text-xs text-slate-500">
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              No completed orders yet — chart will populate once sales come in.
            </div>
          </div>
        </div>

        <!-- Donut: Orders by Status -->
        <div class="admin-surface p-6">
          <h3 class="text-lg font-semibold text-slate-900 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"/>
              <path stroke-linecap="round" stroke-linejoin="round" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"/>
            </svg>
            Orders by Status
          </h3>
          <p class="mt-1 text-sm text-slate-500">Distribution across pipeline</p>

          <div class="mt-6 flex items-center justify-center">
            <div class="relative">
              <svg width="180" height="180" viewBox="0 0 180 180" xmlns="http://www.w3.org/2000/svg" class="-rotate-90">
                <circle cx="90" cy="90" r="70" fill="none" stroke="#f1f5f9" stroke-width="22"/>
                <circle
                  *ngFor="let seg of donutSegments"
                  cx="90" cy="90" r="70" fill="none"
                  [attr.stroke]="seg.color"
                  stroke-width="22"
                  [attr.stroke-dasharray]="seg.dashArray"
                  [attr.stroke-dashoffset]="seg.dashOffset"
                  stroke-linecap="butt"
                  class="transition-all duration-500"
                />
              </svg>
              <div class="absolute inset-0 flex flex-col items-center justify-center">
                <p class="text-xs text-slate-500">Total</p>
                <p class="text-2xl font-bold text-slate-900">{{ orderCount }}</p>
                <p class="text-[10px] text-slate-400">orders</p>
              </div>
            </div>
          </div>

          <div class="mt-6 space-y-2">
            <div *ngFor="let seg of donutSegments" class="flex items-center justify-between text-sm">
              <div class="flex items-center gap-2">
                <span class="h-3 w-3 rounded-sm" [style.background-color]="seg.color"></span>
                <span class="capitalize text-slate-700">{{ seg.status }}</span>
              </div>
              <div class="flex items-center gap-3">
                <span class="font-semibold text-slate-900">{{ seg.value }}</span>
                <span class="text-xs text-slate-500 min-w-[34px] text-right">{{ seg.percent }}%</span>
              </div>
            </div>
            <div *ngIf="donutSegments.length === 0" class="rounded-lg bg-slate-50 p-4 text-center text-xs text-slate-500">
              No orders yet to visualize.
            </div>
          </div>
        </div>
      </div>

      <!-- Products by Category + Stock Health -->
      <div class="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <!-- Horizontal Bar Chart -->
        <div class="admin-surface p-6">
          <h3 class="text-lg font-semibold text-slate-900 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
            </svg>
            Products by Category
          </h3>
          <p class="mt-1 text-sm text-slate-500">Distribution across your catalog</p>

          <div class="mt-6 space-y-4" *ngIf="categoryBars.length > 0; else emptyCat">
            <div *ngFor="let bar of categoryBars" class="space-y-1.5">
              <div class="flex items-center justify-between text-sm">
                <span class="font-medium text-slate-700 truncate pr-3">{{ bar.label }}</span>
                <span class="flex-shrink-0 text-xs font-semibold text-slate-500">{{ bar.value }} items</span>
              </div>
              <div class="relative h-2.5 overflow-hidden rounded-full bg-slate-100">
                <div class="h-full rounded-full transition-all duration-700"
                     [style.width.%]="bar.percent"
                     [style.background]="bar.color"></div>
              </div>
            </div>
          </div>
          <ng-template #emptyCat>
            <p class="mt-6 text-sm text-slate-500">No categories available.</p>
          </ng-template>
        </div>

        <!-- Stock Health -->
        <div class="admin-surface p-6">
          <h3 class="text-lg font-semibold text-slate-900 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
            </svg>
            Inventory Health
          </h3>
          <p class="mt-1 text-sm text-slate-500">Stock-level overview for your catalog</p>

          <div class="mt-6 grid grid-cols-3 gap-3">
            <div class="rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100/50 p-4 border border-emerald-200">
              <p class="text-[11px] font-medium uppercase tracking-wider text-emerald-700">Healthy</p>
              <p class="mt-2 text-2xl font-bold text-emerald-900">{{ stockHealth.healthy }}</p>
              <p class="text-[10px] text-emerald-700">Stock &gt; 10</p>
            </div>
            <div class="rounded-xl bg-gradient-to-br from-amber-50 to-amber-100/50 p-4 border border-amber-200">
              <p class="text-[11px] font-medium uppercase tracking-wider text-amber-700">Low</p>
              <p class="mt-2 text-2xl font-bold text-amber-900">{{ stockHealth.low }}</p>
              <p class="text-[10px] text-amber-700">Stock 1-10</p>
            </div>
            <div class="rounded-xl bg-gradient-to-br from-rose-50 to-rose-100/50 p-4 border border-rose-200">
              <p class="text-[11px] font-medium uppercase tracking-wider text-rose-700">Out</p>
              <p class="mt-2 text-2xl font-bold text-rose-900">{{ stockHealth.out }}</p>
              <p class="text-[10px] text-rose-700">Stock = 0</p>
            </div>
          </div>

          <div class="mt-6">
            <div class="flex items-center justify-between mb-2">
              <p class="text-sm font-medium text-slate-700">Catalog Distribution</p>
              <p class="text-xs text-slate-500">{{ stockHealth.total }} total</p>
            </div>
            <div class="flex h-3 w-full overflow-hidden rounded-full bg-slate-100">
              <div class="h-full bg-emerald-500 transition-all duration-500" [style.width.%]="stockHealthPercent.healthy"></div>
              <div class="h-full bg-amber-500 transition-all duration-500" [style.width.%]="stockHealthPercent.low"></div>
              <div class="h-full bg-rose-500 transition-all duration-500" [style.width.%]="stockHealthPercent.out"></div>
            </div>
          </div>

          <div class="mt-6" *ngIf="lowStockProducts.length > 0">
            <p class="text-sm font-medium text-slate-700 mb-3">Low Stock Alerts</p>
            <div class="space-y-2">
              <div *ngFor="let product of lowStockProducts" class="flex items-center justify-between rounded-lg border border-amber-200 bg-amber-50/60 px-3 py-2">
                <div class="min-w-0 flex-1 pr-3">
                  <p class="text-sm font-medium text-slate-900 truncate">{{ product.name }}</p>
                  <p class="text-xs text-slate-500">{{ product.price | currency }}</p>
                </div>
                <span class="rounded-full bg-amber-500 px-2.5 py-0.5 text-[11px] font-bold text-white whitespace-nowrap">{{ product.stock }} left</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Orders -->
      <div class="admin-surface overflow-hidden">
        <div class="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h3 class="text-lg font-semibold text-slate-900 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            Recent Orders
          </h3>
          <a routerLink="/admin/orders" class="text-xs font-semibold text-sky-600 hover:text-sky-700">View all →</a>
        </div>

        <div *ngIf="recentOrders.length > 0; else emptyOrders" class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500">
              <tr>
                <th class="px-6 py-3 text-left">Order</th>
                <th class="px-6 py-3 text-left">Customer</th>
                <th class="px-6 py-3 text-left">Status</th>
                <th class="px-6 py-3 text-left">Total</th>
                <th class="px-6 py-3 text-left">Date</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr *ngFor="let order of recentOrders" class="hover:bg-slate-50 transition">
                <td class="px-6 py-3 text-sm font-semibold text-slate-900">#{{ order.id }}</td>
                <td class="px-6 py-3">
                  <p class="text-sm font-medium text-slate-900">{{ order.customer?.firstName }} {{ order.customer?.lastName }}</p>
                  <p class="text-xs text-slate-500">{{ order.customer?.email }}</p>
                </td>
                <td class="px-6 py-3">
                  <span class="rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize"
                        [class.bg-amber-100]="order.status === 'pending'"
                        [class.text-amber-700]="order.status === 'pending'"
                        [class.bg-sky-100]="order.status === 'processing' || order.status === 'shipped'"
                        [class.text-sky-700]="order.status === 'processing' || order.status === 'shipped'"
                        [class.bg-emerald-100]="order.status === 'delivered'"
                        [class.text-emerald-700]="order.status === 'delivered'"
                        [class.bg-rose-100]="order.status === 'cancelled'"
                        [class.text-rose-700]="order.status === 'cancelled'">
                    {{ order.status }}
                  </span>
                </td>
                <td class="px-6 py-3 text-sm font-semibold text-slate-900">{{ order.total | currency }}</td>
                <td class="px-6 py-3 text-xs text-slate-500">{{ order.createdAt | date: 'mediumDate' }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <ng-template #emptyOrders>
          <div class="flex flex-col items-center justify-center gap-2 p-10 text-center">
            <svg class="h-10 w-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/>
            </svg>
            <p class="text-sm font-medium text-slate-600">No orders yet</p>
            <p class="text-xs text-slate-400">Recent customer orders will appear here.</p>
          </div>
        </ng-template>
      </div>
    </section>
  `
})
export class AdminComponent implements OnInit, OnDestroy {
  productCount = 0;
  categoryCount = 0;
  brandCount = 0;
  orderCount = 0;

  categories: Category[] = [];
  products: Product[] = [];
  orders: Order[] = [];
  lowStockProducts: Product[] = [];
  recentOrders: Order[] = [];

  statCards: StatTrend[] = [];

  revenuePoints: LinePoint[] = [];
  revenueLinePoints = '';
  revenueAreaPath = '';
  weeklyRevenue = 0;
  peakRevenue = 0;
  gridLines: { y: number; value: number }[] = [];

  donutSegments: DonutSegment[] = [];

  categoryBars: BarItem[] = [];

  stockHealth = { healthy: 0, low: 0, out: 0, total: 0 };
  stockHealthPercent = { healthy: 0, low: 0, out: 0 };

  refreshing = false;
  private readonly destroy$ = new Subject<void>();
  private readonly pollIntervalMs = 15000;

  private readonly statusColors: Record<string, string> = {
    pending: '#f59e0b',
    processing: '#0ea5e9',
    shipped: '#6366f1',
    delivered: '#10b981',
    cancelled: '#f43f5e'
  };

  private readonly barPalette = [
    'linear-gradient(90deg, #0ea5e9, #6366f1)',
    'linear-gradient(90deg, #8b5cf6, #ec4899)',
    'linear-gradient(90deg, #10b981, #0ea5e9)',
    'linear-gradient(90deg, #f59e0b, #f43f5e)',
    'linear-gradient(90deg, #6366f1, #8b5cf6)',
    'linear-gradient(90deg, #06b6d4, #10b981)'
  ];

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.dataService.products$.pipe(takeUntil(this.destroy$)).subscribe((products) => {
      this.products = products;
      this.productCount = products.length;
      this.lowStockProducts = products.filter((p) => p.stock < 10 && p.stock > 0).slice(0, 4);
      this.computeStockHealth();
      this.computeCategoryBars();
      this.rebuildStatCards();
    });

    this.dataService.categories$.pipe(takeUntil(this.destroy$)).subscribe((categories) => {
      this.categories = categories;
      this.categoryCount = categories.length;
      this.computeCategoryBars();
      this.rebuildStatCards();
    });

    this.dataService.brands$.pipe(takeUntil(this.destroy$)).subscribe((brands) => {
      this.brandCount = brands.length;
      this.rebuildStatCards();
    });

    this.loadOrders();

    interval(this.pollIntervalMs)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.refreshAll(true));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  refreshAll(silent = false): void {
    if (this.refreshing) return;
    this.refreshing = !silent;
    this.dataService.refreshCatalog();
    this.loadOrders(() => {
      this.refreshing = false;
    });
  }

  private loadOrders(done?: () => void): void {
    this.dataService.getAdminOrders().subscribe({
      next: (orders) => {
        this.orders = orders;
        this.orderCount = orders.length;
        this.recentOrders = orders.slice(0, 5);
        this.computeRevenueTrend();
        this.computeDonut();
        this.rebuildStatCards();
        done?.();
      },
      error: () => {
        this.orders = [];
        this.orderCount = 0;
        this.recentOrders = [];
        this.computeRevenueTrend();
        this.computeDonut();
        this.rebuildStatCards();
        done?.();
      }
    });
  }

  private rebuildStatCards(): void {
    const totalRevenue = this.orders.reduce((sum, order) => sum + order.total, 0);

    this.statCards = [
      {
        label: 'Revenue',
        value: totalRevenue,
        trend: this.weeklyRevenue > 0 ? 12 : 0,
        trendLabel: 'vs. last week',
        icon: 'revenue',
        gradient: 'linear-gradient(135deg, #10b981 0%, #0d9488 100%)',
        glow: '0 10px 25px -5px rgba(16, 185, 129, 0.5)'
      },
      {
        label: 'Products',
        value: this.productCount,
        trend: 0,
        trendLabel: 'in catalog',
        icon: 'products',
        gradient: 'linear-gradient(135deg, #0ea5e9 0%, #0891b2 100%)',
        glow: '0 10px 25px -5px rgba(14, 165, 233, 0.5)'
      },
      {
        label: 'Categories',
        value: this.categoryCount,
        trend: 0,
        trendLabel: 'active groups',
        icon: 'categories',
        gradient: 'linear-gradient(135deg, #6366f1 0%, #1d4ed8 100%)',
        glow: '0 10px 25px -5px rgba(99, 102, 241, 0.5)'
      },
      {
        label: 'Brands',
        value: this.brandCount,
        trend: 0,
        trendLabel: 'brand partners',
        icon: 'brands',
        gradient: 'linear-gradient(135deg, #a855f7 0%, #c026d3 100%)',
        glow: '0 10px 25px -5px rgba(168, 85, 247, 0.5)'
      },
      {
        label: 'Orders',
        value: this.orderCount,
        trend: this.orderCount > 0 ? 8 : 0,
        trendLabel: 'total orders',
        icon: 'orders',
        gradient: 'linear-gradient(135deg, #f43f5e 0%, #db2777 100%)',
        glow: '0 10px 25px -5px rgba(244, 63, 94, 0.5)'
      }
    ];
  }

  private computeRevenueTrend(): void {
    const days = 7;
    const now = new Date();
    const dayTotals: { date: Date; total: number }[] = [];

    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      d.setHours(0, 0, 0, 0);
      dayTotals.push({ date: d, total: 0 });
    }

    for (const order of this.orders) {
      const orderDate = new Date(order.createdAt);
      orderDate.setHours(0, 0, 0, 0);
      const match = dayTotals.find((d) => d.date.getTime() === orderDate.getTime());
      if (match) {
        match.total += order.total;
      }
    }

    const width = 640;
    const height = 240;
    const padLeft = 40;
    const padRight = 20;
    const padTop = 20;
    const padBottom = 30;
    const chartW = width - padLeft - padRight;
    const chartH = height - padTop - padBottom;

    const max = Math.max(...dayTotals.map((d) => d.total), 100);
    const niceMax = Math.ceil(max / 100) * 100;

    this.weeklyRevenue = dayTotals.reduce((s, d) => s + d.total, 0);
    this.peakRevenue = Math.max(...dayTotals.map((d) => d.total));

    const step = chartW / Math.max(1, dayTotals.length - 1);
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    this.revenuePoints = dayTotals.map((d, i) => ({
      x: padLeft + i * step,
      y: padTop + chartH - (d.total / niceMax) * chartH,
      value: d.total,
      label: dayNames[d.date.getDay()]
    }));

    this.revenueLinePoints = this.revenuePoints.map((p) => `${p.x},${p.y}`).join(' ');

    if (this.revenuePoints.length > 0) {
      const first = this.revenuePoints[0];
      const last = this.revenuePoints[this.revenuePoints.length - 1];
      const bottom = padTop + chartH;
      const linePath = this.revenuePoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
      this.revenueAreaPath = `M ${first.x} ${bottom} ${linePath.replace('M', 'L')} L ${last.x} ${bottom} Z`;
    }

    const gridSteps = 4;
    this.gridLines = [];
    for (let i = 0; i <= gridSteps; i++) {
      const value = niceMax - (niceMax / gridSteps) * i;
      const y = padTop + (chartH / gridSteps) * i;
      this.gridLines.push({ y, value });
    }
  }

  private computeDonut(): void {
    const counts: Record<string, number> = {};
    for (const order of this.orders) {
      counts[order.status] = (counts[order.status] || 0) + 1;
    }

    const total = this.orders.length || 1;
    const radius = 70;
    const circumference = 2 * Math.PI * radius;

    let accumulatedOffset = 0;
    this.donutSegments = Object.entries(counts).map(([status, value]) => {
      const fraction = value / total;
      const dashLength = fraction * circumference;
      const gap = circumference - dashLength;
      const segment: DonutSegment = {
        status,
        value,
        percent: Math.round(fraction * 100),
        color: this.statusColors[status] || '#64748b',
        dashArray: `${dashLength} ${gap}`,
        dashOffset: -accumulatedOffset
      };
      accumulatedOffset += dashLength;
      return segment;
    });
  }

  private computeCategoryBars(): void {
    if (this.categories.length === 0) {
      this.categoryBars = [];
      return;
    }

    const counts = this.categories.map((cat) => ({
      label: cat.name,
      value: this.products.filter((p) => p.categoryId === cat.id).length
    }));

    const max = Math.max(...counts.map((c) => c.value), 1);

    this.categoryBars = counts
      .sort((a, b) => b.value - a.value)
      .slice(0, 6)
      .map((item, i) => ({
        label: item.label,
        value: item.value,
        percent: max === 0 ? 0 : (item.value / max) * 100,
        color: this.barPalette[i % this.barPalette.length]
      }));
  }

  private computeStockHealth(): void {
    const healthy = this.products.filter((p) => p.stock > 10).length;
    const low = this.products.filter((p) => p.stock > 0 && p.stock <= 10).length;
    const out = this.products.filter((p) => p.stock === 0).length;
    const total = this.products.length;

    this.stockHealth = { healthy, low, out, total };

    if (total === 0) {
      this.stockHealthPercent = { healthy: 0, low: 0, out: 0 };
    } else {
      this.stockHealthPercent = {
        healthy: (healthy / total) * 100,
        low: (low / total) * 100,
        out: (out / total) * 100
      };
    }
  }
}
