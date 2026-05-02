import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { RouterModule } from '@angular/router';

import {
  Brand,
  Category,
  Product,
} from '../../models/interfaces';
import { CartService } from '../../services/cart.service';
import { DataService } from '../../services/data.service';
import { WishlistService } from '../../services/wishlist.service';

interface HeroSlide {
  tag: string;
  title: string;
  description: string;
  image: string;
  cta: string;
  link: string;
  accent: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="animate-fade-in">
      <!-- Hero Carousel -->
      <section class="relative h-[560px] overflow-hidden bg-slate-900 text-white">
        <!-- Slides track -->
        <div class="flex h-full transition-transform duration-[900ms] ease-in-out will-change-transform"
             [style.transform]="'translateX(-' + activeSlide * 100 + '%)'">
          <div *ngFor="let slide of heroSlides; let i = index"
               class="relative h-full w-full flex-shrink-0">
            <img [src]="slide.image" [alt]="slide.title"
                 class="absolute inset-0 h-full w-full object-cover transition-transform duration-[6000ms] ease-linear"
                 [class.scale-110]="activeSlide === i">
            <div class="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/20"></div>
            <div class="absolute inset-0 flex items-center">
              <div class="container mx-auto px-6 md:px-12">
                <div class="max-w-2xl">
                  <span class="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] backdrop-blur"
                        [style.background]="slide.accent + '33'"
                        [style.border]="'1px solid ' + slide.accent + '66'"
                        [style.color]="slide.accent">
                    <span class="h-1.5 w-1.5 rounded-full animate-pulse" [style.background]="slide.accent"></span>
                    {{ slide.tag }}
                  </span>
                  <h1 class="mt-5 text-4xl md:text-6xl font-extrabold leading-tight drop-shadow-lg"
                      [class.animate-slide-up]="activeSlide === i">
                    {{ slide.title }}
                  </h1>
                  <p class="mt-4 max-w-xl text-lg md:text-xl text-slate-100/90 drop-shadow"
                     [class.animate-slide-up]="activeSlide === i"
                     style="animation-delay: 0.15s">
                    {{ slide.description }}
                  </p>
                  <div class="mt-8 flex flex-wrap gap-3"
                       [class.animate-slide-up]="activeSlide === i"
                       style="animation-delay: 0.3s">
                    <a [routerLink]="slide.link"
                       class="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-base font-semibold text-slate-900 shadow-xl transition hover:scale-105"
                       style="background: white;">
                      {{ slide.cta }}
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                      </svg>
                    </a>
                    <a routerLink="/products"
                       class="inline-flex items-center gap-2 rounded-xl border border-white/40 bg-white/10 px-6 py-3 text-base font-semibold text-white backdrop-blur transition hover:bg-white/20">
                      Browse All
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Prev / Next buttons -->
        <button type="button" (click)="prevSlide()" aria-label="Previous slide"
                class="group absolute left-4 top-1/2 -translate-y-1/2 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur border border-white/20 transition hover:bg-white/20 md:left-8">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 transition group-hover:-translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/>
          </svg>
        </button>
        <button type="button" (click)="nextSlide()" aria-label="Next slide"
                class="group absolute right-4 top-1/2 -translate-y-1/2 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur border border-white/20 transition hover:bg-white/20 md:right-8">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 transition group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
          </svg>
        </button>

        <!-- Dots / Indicators -->
        <div class="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2">
          <button *ngFor="let slide of heroSlides; let i = index"
                  type="button" (click)="goToSlide(i)"
                  [attr.aria-label]="'Go to slide ' + (i + 1)"
                  class="h-2 rounded-full transition-all duration-300"
                  [class]="activeSlide === i ? 'w-10 bg-white' : 'w-2 bg-white/40 hover:bg-white/60'"></button>
        </div>

      </section>

      <!-- Stats Bar -->
      <section class="relative -mt-8 px-4">
        <div class="container mx-auto">
          <div class="rounded-3xl border border-slate-200 bg-white px-6 py-6 shadow-xl sm:px-10">
            <div class="grid grid-cols-2 gap-6 md:grid-cols-4">
              <div class="flex items-center gap-3">
                <div class="flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-md"
                     style="background: linear-gradient(135deg,#0ea5e9 0%,#6366f1 100%);">
                  <svg class="h-6 w-6" fill="none" stroke="white" stroke-width="2.25" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                  </svg>
                </div>
                <div>
                  <p class="text-2xl font-extrabold text-slate-900">50K+</p>
                  <p class="text-xs font-medium text-slate-500">Products</p>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <div class="flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-md"
                     style="background: linear-gradient(135deg,#10b981 0%,#0d9488 100%);">
                  <svg class="h-6 w-6" fill="none" stroke="white" stroke-width="2.25" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                  </svg>
                </div>
                <div>
                  <p class="text-2xl font-extrabold text-slate-900">30K+</p>
                  <p class="text-xs font-medium text-slate-500">Happy Customers</p>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <div class="flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-md"
                     style="background: linear-gradient(135deg,#f59e0b 0%,#ea580c 100%);">
                  <svg class="h-6 w-6" fill="white" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.363 1.118l1.287 3.957c.3.922-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.784.57-1.838-.196-1.54-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.05 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z"/>
                  </svg>
                </div>
                <div>
                  <p class="text-2xl font-extrabold text-slate-900">4.8/5</p>
                  <p class="text-xs font-medium text-slate-500">Average Rating</p>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <div class="flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-md"
                     style="background: linear-gradient(135deg,#a855f7 0%,#ec4899 100%);">
                  <svg class="h-6 w-6" fill="none" stroke="white" stroke-width="2.25" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                  </svg>
                </div>
                <div>
                  <p class="text-2xl font-extrabold text-slate-900">24/7</p>
                  <p class="text-xs font-medium text-slate-500">Fast Support</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Why Choose Trendify -->
      <section class="py-16 bg-gradient-to-b from-white to-slate-50">
        <div class="container mx-auto px-4">
          <div class="mb-12 text-center">
            <span class="text-xs font-semibold uppercase tracking-[0.25em] text-primary-600">The Trendify Promise</span>
            <h2 class="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">Why Choose Trendify?</h2>
            <p class="mx-auto mt-3 max-w-2xl text-sm text-slate-500 sm:text-base">
              We go beyond shopping — experience premium service, lightning-fast delivery, and peace of mind on every order.
            </p>
          </div>

          <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <!-- Card 1 -->
            <div class="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl animate-fade-in">
              <div class="absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-10 blur-2xl transition group-hover:opacity-30" style="background: linear-gradient(135deg,#0ea5e9,#6366f1);"></div>
              <div class="relative flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-md transition group-hover:scale-110"
                   style="background: linear-gradient(135deg,#0ea5e9 0%,#6366f1 100%); box-shadow: 0 8px 20px -4px rgba(99,102,241,0.45);">
                <svg class="h-7 w-7" fill="none" stroke="white" stroke-width="2.25" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0zM13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1"/>
                </svg>
              </div>
              <h3 class="relative mt-4 text-lg font-bold text-slate-900">Free Shipping</h3>
              <p class="relative mt-1 text-sm text-slate-500">Free fast delivery on all orders over $50. Same-day dispatch.</p>
            </div>

            <!-- Card 2 -->
            <div class="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl animate-fade-in" style="animation-delay: 0.1s">
              <div class="absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-10 blur-2xl transition group-hover:opacity-30" style="background: linear-gradient(135deg,#10b981,#0d9488);"></div>
              <div class="relative flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-md transition group-hover:scale-110"
                   style="background: linear-gradient(135deg,#10b981 0%,#0d9488 100%); box-shadow: 0 8px 20px -4px rgba(16,185,129,0.45);">
                <svg class="h-7 w-7" fill="none" stroke="white" stroke-width="2.25" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                </svg>
              </div>
              <h3 class="relative mt-4 text-lg font-bold text-slate-900">Secure Payment</h3>
              <p class="relative mt-1 text-sm text-slate-500">Bank-grade SSL encryption. Pay with card, PayPal, or Apple Pay.</p>
            </div>

            <!-- Card 3 -->
            <div class="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl animate-fade-in" style="animation-delay: 0.2s">
              <div class="absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-10 blur-2xl transition group-hover:opacity-30" style="background: linear-gradient(135deg,#f59e0b,#ea580c);"></div>
              <div class="relative flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-md transition group-hover:scale-110"
                   style="background: linear-gradient(135deg,#f59e0b 0%,#ea580c 100%); box-shadow: 0 8px 20px -4px rgba(245,158,11,0.45);">
                <svg class="h-7 w-7" fill="none" stroke="white" stroke-width="2.25" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                </svg>
              </div>
              <h3 class="relative mt-4 text-lg font-bold text-slate-900">Easy Returns</h3>
              <p class="relative mt-1 text-sm text-slate-500">30-day hassle-free returns. Full refund, no questions asked.</p>
            </div>

            <!-- Card 4 -->
            <div class="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl animate-fade-in" style="animation-delay: 0.3s">
              <div class="absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-10 blur-2xl transition group-hover:opacity-30" style="background: linear-gradient(135deg,#a855f7,#ec4899);"></div>
              <div class="relative flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-md transition group-hover:scale-110"
                   style="background: linear-gradient(135deg,#a855f7 0%,#ec4899 100%); box-shadow: 0 8px 20px -4px rgba(236,72,153,0.45);">
                <svg class="h-7 w-7" fill="none" stroke="white" stroke-width="2.25" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"/>
                </svg>
              </div>
              <h3 class="relative mt-4 text-lg font-bold text-slate-900">24/7 Support</h3>
              <p class="relative mt-1 text-sm text-slate-500">Our team is always here to help — chat, email, or phone.</p>
            </div>
          </div>
        </div>
      </section>    

      <!-- Featured Products Section -->
      <section class="py-16 bg-white">
        <div class="container mx-auto px-4">
          <div class="flex flex-col items-center mb-10 sm:flex-row sm:items-end sm:justify-between">
            <div class="text-center sm:text-left">
              <span class="text-xs font-semibold uppercase tracking-[0.25em] text-primary-600">Handpicked</span>
              <h2 class="mt-2 text-3xl font-bold text-slate-900">Featured Products</h2>
            </div>
            <div class="mt-4 flex items-center gap-3 sm:mt-0">
              <span class="text-sm text-slate-500">
                Page <span class="font-semibold text-slate-800">{{ featuredPage + 1 }}</span> of <span class="font-semibold text-slate-800">{{ featuredTotalPages || 1 }}</span>
              </span>
              <div class="flex items-center gap-2">
                <button type="button" (click)="featuredPrev()" [disabled]="featuredPage === 0"
                        class="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed">
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/>
                  </svg>
                </button>
                <button type="button" (click)="featuredNext()" [disabled]="featuredPage >= featuredTotalPages - 1"
                        class="inline-flex h-10 w-10 items-center justify-center rounded-full text-white shadow-md transition hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
                        style="background: linear-gradient(135deg,#0ea5e9 0%,#6366f1 100%);">
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div *ngFor="let product of paginatedFeatured; let i = index"
                 [style.animation-delay]="i * 0.05 + 's'"
                 class="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:border-transparent animate-fade-in">
              <div class="relative overflow-hidden bg-slate-100">
                <a [routerLink]="'/product/' + product.id" class="block">
                  <img [src]="product.images[0]" [alt]="product.name"
                       class="h-52 w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110">
                </a>
                <div class="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                <div *ngIf="product.discount > 0"
                     class="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold text-white shadow-md"
                     style="background: linear-gradient(135deg,#f43f5e 0%,#db2777 100%);">
                  -{{ product.discount }}%
                </div>
                <div *ngIf="getBrandLogo(product.brandId)" class="absolute left-3 bottom-3 flex h-9 w-9 items-center justify-center rounded-full bg-white p-1 shadow-md ring-2 ring-white">
                  <img [src]="getBrandLogo(product.brandId)" [alt]="getBrandName(product.brandId)" class="h-full w-full rounded-full object-cover">
                </div>
                <button (click)="toggleWishlist(product.id)" type="button"
                        [attr.aria-label]="isInWishlist(product.id) ? 'Remove from wishlist' : 'Add to wishlist'"
                        class="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 shadow-md backdrop-blur transition hover:scale-110 hover:shadow-lg">
                  <span *ngIf="isBursting(product.id)" class="pointer-events-none absolute inset-0 rounded-full bg-rose-400 animate-heart-burst"></span>
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
              </div>

              <div class="flex flex-1 flex-col p-4">
                <div class="mb-2 flex flex-wrap items-center gap-1.5">
                  <span class="inline-flex items-center rounded-full bg-sky-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-sky-700">
                    {{ getCategoryName(product.categoryId) }}
                  </span>
                  <span class="inline-flex items-center rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-indigo-700">
                    {{ getBrandName(product.brandId) }}
                  </span>
                </div>
                <a [routerLink]="'/product/' + product.id" class="block">
                  <h3 class="text-base font-bold text-slate-900 transition group-hover:text-primary-600 line-clamp-1">{{ product.name }}</h3>
                </a>
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
                  <span class="text-slate-400">· {{ product.reviews }}</span>
                </div>
                <div class="mt-3 flex items-end gap-2 border-t border-slate-100 pt-3">
                  <span class="text-xl font-extrabold text-slate-900">\${{ product.price }}</span>
                  <span *ngIf="product.originalPrice > product.price" class="mb-0.5 text-sm text-slate-400 line-through">
                    \${{ product.originalPrice }}
                  </span>
                  <span *ngIf="product.originalPrice > product.price" class="mb-0.5 ml-auto text-xs font-semibold text-emerald-600">
                    Save \${{ (product.originalPrice - product.price).toFixed(2) }}
                  </span>
                </div>
                <button (click)="addToCart(product)"
                        class="mt-3 inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-white shadow-md transition hover:opacity-90"
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
      </section>

    <!-- Section: 2 Images Side-by-Side -->
      <section class="py-14 bg-gradient-to-br from-slate-50 to-white">
        <div class="container mx-auto px-4">
          <div class="mb-8 text-center">
            <span class="text-xs font-semibold uppercase tracking-[0.25em] text-primary-600">Curated For You</span>
            <h2 class="mt-2 text-3xl font-bold text-slate-900">Featured Collections</h2>
          </div>
          <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
            <!-- Card 1 -->
            <a routerLink="/products" class="group relative block h-80 overflow-hidden rounded-3xl shadow-lg">
              <img src="https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=1200"
                   alt="Electronics"
                   class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110">
              <div class="absolute inset-0 bg-gradient-to-t from-indigo-900/90 via-indigo-900/40 to-transparent"></div>
              <div class="absolute inset-x-0 bottom-0 p-6 text-white">
                <span class="inline-flex items-center gap-1.5 rounded-full bg-sky-400/20 border border-sky-300/40 px-3 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-sky-100 backdrop-blur">Tech</span>
                <h3 class="mt-2 text-2xl font-bold drop-shadow-lg">Smart Electronics</h3>
                <p class="mt-1 text-sm text-slate-200 drop-shadow">Latest gadgets to power your everyday.</p>
                <span class="mt-3 inline-flex items-center gap-1 text-sm font-semibold transition group-hover:gap-2">
                  Shop Now
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                </span>
              </div>
            </a>

            <!-- Card 2 -->
            <a routerLink="/products" class="group relative block h-80 overflow-hidden rounded-3xl shadow-lg">
              <img src="https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=1200"
                   alt="Fashion"
                   class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110">
              <div class="absolute inset-0 bg-gradient-to-t from-rose-900/90 via-rose-900/40 to-transparent"></div>
              <div class="absolute inset-x-0 bottom-0 p-6 text-white">
                <span class="inline-flex items-center gap-1.5 rounded-full bg-pink-400/20 border border-pink-300/40 px-3 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-pink-100 backdrop-blur">Style</span>
                <h3 class="mt-2 text-2xl font-bold drop-shadow-lg">Fashion & Accessories</h3>
                <p class="mt-1 text-sm text-slate-200 drop-shadow">Trendy styles that define you.</p>
                <span class="mt-3 inline-flex items-center gap-1 text-sm font-semibold transition group-hover:gap-2">
                  Shop Now
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                </span>
              </div>
            </a>
          </div>
        </div>
      </section>

      <!-- Sports & Fitness Section -->
      <section class="py-14 bg-gradient-to-br from-sky-50 to-indigo-50">
        <div class="container mx-auto px-4">
          <div class="flex flex-col items-start mb-8 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span class="inline-flex items-center gap-2 rounded-full bg-sky-600/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">
                <span class="h-1.5 w-1.5 rounded-full bg-sky-500"></span>
                Active Life
              </span>
              <h2 class="mt-3 text-3xl font-bold text-slate-900">Sports & Fitness Picks</h2>
              <p class="mt-1 text-sm text-slate-600">Gear up for your next workout with top-rated essentials.</p>
            </div>
            <div class="mt-4 flex items-center gap-3 sm:mt-0">
              <span class="text-sm text-slate-500">
                <span class="font-semibold text-slate-800">{{ sportsPage + 1 }}</span> / <span class="font-semibold text-slate-800">{{ sportsTotalPages || 1 }}</span>
              </span>
              <div class="flex gap-2">
                <button type="button" (click)="sportsPrev()" [disabled]="sportsPage === 0"
                        class="inline-flex h-10 w-10 items-center justify-center rounded-full border border-sky-200 bg-white text-sky-700 shadow-sm transition hover:bg-sky-50 disabled:opacity-40 disabled:cursor-not-allowed">
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/></svg>
                </button>
                <button type="button" (click)="sportsNext()" [disabled]="sportsPage >= sportsTotalPages - 1"
                        class="inline-flex h-10 w-10 items-center justify-center rounded-full text-white shadow-md transition hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
                        style="background: linear-gradient(135deg,#0ea5e9 0%,#6366f1 100%);">
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
                </button>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" *ngIf="paginatedSports.length > 0; else emptySports">
            <div *ngFor="let product of paginatedSports; let i = index"
                 [style.animation-delay]="i * 0.05 + 's'"
                 class="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:border-transparent animate-fade-in">
              <div class="relative overflow-hidden bg-slate-100">
                <a [routerLink]="'/product/' + product.id" class="block">
                  <img [src]="product.images[0]" [alt]="product.name"
                       class="h-52 w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110">
                </a>
                <div class="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                <div *ngIf="product.discount > 0"
                     class="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold text-white shadow-md"
                     style="background: linear-gradient(135deg,#f43f5e 0%,#db2777 100%);">
                  -{{ product.discount }}%
                </div>
                <div *ngIf="getBrandLogo(product.brandId)" class="absolute left-3 bottom-3 flex h-9 w-9 items-center justify-center rounded-full bg-white p-1 shadow-md ring-2 ring-white">
                  <img [src]="getBrandLogo(product.brandId)" [alt]="getBrandName(product.brandId)" class="h-full w-full rounded-full object-cover">
                </div>
                <button (click)="toggleWishlist(product.id)" type="button"
                        class="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 shadow-md backdrop-blur transition hover:scale-110 hover:shadow-lg">
                  <span *ngIf="isBursting(product.id)" class="pointer-events-none absolute inset-0 rounded-full bg-rose-400 animate-heart-burst"></span>
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
              </div>

              <div class="flex flex-1 flex-col p-4">
                <div class="mb-2 flex flex-wrap items-center gap-1.5">
                  <span class="inline-flex items-center rounded-full bg-sky-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-sky-700">
                    {{ getCategoryName(product.categoryId) }}
                  </span>
                  <span class="inline-flex items-center rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-indigo-700">
                    {{ getBrandName(product.brandId) }}
                  </span>
                </div>
                <a [routerLink]="'/product/' + product.id" class="block">
                  <h3 class="text-base font-bold text-slate-900 transition group-hover:text-sky-600 line-clamp-1">{{ product.name }}</h3>
                </a>
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
                  <span class="text-slate-400">· {{ product.reviews }}</span>
                </div>
                <div class="mt-3 flex items-end gap-2 border-t border-slate-100 pt-3">
                  <span class="text-xl font-extrabold text-slate-900">\${{ product.price }}</span>
                  <span *ngIf="product.originalPrice > product.price" class="mb-0.5 text-sm text-slate-400 line-through">\${{ product.originalPrice }}</span>
                  <span *ngIf="product.originalPrice > product.price" class="mb-0.5 ml-auto text-xs font-semibold text-emerald-600">
                    Save \${{ (product.originalPrice - product.price).toFixed(2) }}
                  </span>
                </div>
                <button (click)="addToCart(product)"
                        class="mt-3 inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-white shadow-md transition hover:opacity-90"
                        style="background: linear-gradient(135deg,#0ea5e9 0%,#6366f1 100%); box-shadow: 0 6px 16px -4px rgba(99,102,241,0.45);">
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                  </svg>
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
          <ng-template #emptySports>
            <div class="rounded-2xl border border-dashed border-sky-200 bg-white/60 p-10 text-center text-sm text-slate-500">
              No Sports & Fitness products available yet.
            </div>
          </ng-template>
        </div>
      </section>

      <!-- Beauty Essentials Section -->
      <section class="py-14 bg-gradient-to-br from-rose-50 to-purple-50">
        <div class="container mx-auto px-4">
          <div class="flex flex-col items-start mb-8 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span class="inline-flex items-center gap-2 rounded-full bg-rose-600/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-rose-700">
                <span class="h-1.5 w-1.5 rounded-full bg-rose-500"></span>
                Glow Up
              </span>
              <h2 class="mt-3 text-3xl font-bold text-slate-900">Beauty Essentials</h2>
              <p class="mt-1 text-sm text-slate-600">Everyday skincare and makeup must-haves — <span class="font-semibold text-rose-600">hover to pause</span></p>
            </div>
            <div class="mt-4 inline-flex items-center gap-2 rounded-full bg-rose-100 border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-700 sm:mt-0">
              <span class="relative flex h-2 w-2">
                <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75"></span>
                <span class="relative inline-flex h-2 w-2 rounded-full bg-rose-500"></span>
              </span>
              Live scroll · {{ beautyProducts.length }} items
            </div>
          </div>

          <div *ngIf="beautyProducts.length > 0; else emptyBeauty" class="relative">
            <!-- Edge fades -->
            <div class="pointer-events-none absolute left-0 top-0 bottom-0 z-10 w-16 bg-gradient-to-r from-rose-50 to-transparent sm:w-24"></div>
            <div class="pointer-events-none absolute right-0 top-0 bottom-0 z-10 w-16 bg-gradient-to-l from-purple-50 to-transparent sm:w-24"></div>

            <!-- Prev button -->
            <button type="button" (click)="scrollBeauty(-1)" aria-label="Scroll left"
                    class="absolute left-2 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-rose-200 bg-white text-rose-700 shadow-lg transition hover:scale-110 hover:bg-rose-50 sm:left-4">
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/>
              </svg>
            </button>

            <!-- Next button -->
            <button type="button" (click)="scrollBeauty(1)" aria-label="Scroll right"
                    class="absolute right-2 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full text-white shadow-lg transition hover:scale-110 sm:right-4"
                    style="background: linear-gradient(135deg,#ec4899 0%,#a855f7 100%); box-shadow: 0 10px 25px -5px rgba(236,72,153,0.5);">
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
              </svg>
            </button>

            <div #beautyScroll class="no-scrollbar flex gap-5 overflow-x-auto py-2 scroll-smooth"
                 (mouseenter)="beautyPaused = true"
                 (mouseleave)="beautyPaused = false">
              <div *ngFor="let product of marqueeBeauty; let i = index"
                   class="group relative flex w-72 flex-shrink-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:border-transparent">
              <div class="relative overflow-hidden bg-slate-100">
                <a [routerLink]="'/product/' + product.id" class="block">
                  <img [src]="product.images[0]" [alt]="product.name"
                       class="h-52 w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110">
                </a>
                <div class="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                <div *ngIf="product.discount > 0"
                     class="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold text-white shadow-md"
                     style="background: linear-gradient(135deg,#f43f5e 0%,#db2777 100%);">
                  -{{ product.discount }}%
                </div>
                <div *ngIf="getBrandLogo(product.brandId)" class="absolute left-3 bottom-3 flex h-9 w-9 items-center justify-center rounded-full bg-white p-1 shadow-md ring-2 ring-white">
                  <img [src]="getBrandLogo(product.brandId)" [alt]="getBrandName(product.brandId)" class="h-full w-full rounded-full object-cover">
                </div>
                <button (click)="toggleWishlist(product.id)" type="button"
                        class="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 shadow-md backdrop-blur transition hover:scale-110 hover:shadow-lg">
                  <span *ngIf="isBursting(product.id)" class="pointer-events-none absolute inset-0 rounded-full bg-rose-400 animate-heart-burst"></span>
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
              </div>

              <div class="flex flex-1 flex-col p-4">
                <div class="mb-2 flex flex-wrap items-center gap-1.5">
                  <span class="inline-flex items-center rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-rose-700">
                    {{ getCategoryName(product.categoryId) }}
                  </span>
                  <span class="inline-flex items-center rounded-full bg-purple-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-purple-700">
                    {{ getBrandName(product.brandId) }}
                  </span>
                </div>
                <a [routerLink]="'/product/' + product.id" class="block">
                  <h3 class="text-base font-bold text-slate-900 transition group-hover:text-rose-600 line-clamp-1">{{ product.name }}</h3>
                </a>
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
                  <span class="text-slate-400">· {{ product.reviews }}</span>
                </div>
                <div class="mt-3 flex items-end gap-2 border-t border-slate-100 pt-3">
                  <span class="text-xl font-extrabold text-slate-900">\${{ product.price }}</span>
                  <span *ngIf="product.originalPrice > product.price" class="mb-0.5 text-sm text-slate-400 line-through">\${{ product.originalPrice }}</span>
                  <span *ngIf="product.originalPrice > product.price" class="mb-0.5 ml-auto text-xs font-semibold text-emerald-600">
                    Save \${{ (product.originalPrice - product.price).toFixed(2) }}
                  </span>
                </div>
                <button (click)="addToCart(product)"
                        class="mt-3 inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-white shadow-md transition hover:opacity-90"
                        style="background: linear-gradient(135deg,#ec4899 0%,#a855f7 100%); box-shadow: 0 6px 16px -4px rgba(236,72,153,0.45);">
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                  </svg>
                  Add to Cart
                </button>
              </div>
            </div>
            </div>
          </div>
          <ng-template #emptyBeauty>
            <div class="rounded-2xl border border-dashed border-rose-200 bg-white/60 p-10 text-center text-sm text-slate-500">
              No Beauty products available yet.
            </div>
          </ng-template>
        </div>
      </section>

<!-- Section: 3 Images Triple Grid -->
      <section class="py-14 bg-white">
        <div class="container mx-auto px-4">
          <div class="mb-8 flex flex-col items-start gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span class="text-xs font-semibold uppercase tracking-[0.25em] text-primary-600">Explore</span>
              <h2 class="mt-2 text-3xl font-bold text-slate-900">Shop by Lifestyle</h2>
            </div>
            <a routerLink="/products" class="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 hover:text-primary-700">
              View all collections
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
            </a>
          </div>

          <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
            <!-- Card 1: Home & Living -->
            <a routerLink="/products" class="group relative block h-72 overflow-hidden rounded-3xl shadow-lg">
              <img src="https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg?auto=compress&cs=tinysrgb&w=900"
                   alt="Home & Living"
                   class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110">
              <div class="absolute inset-0 bg-gradient-to-t from-emerald-900/90 via-emerald-900/30 to-transparent"></div>
              <div class="absolute top-4 right-4">
                <span class="inline-flex items-center rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white backdrop-blur">New</span>
              </div>
              <div class="absolute inset-x-0 bottom-0 p-5 text-white">
                <h3 class="text-xl font-bold drop-shadow-lg">Home & Living</h3>
                <p class="mt-1 text-xs text-slate-200 drop-shadow">Comfort meets elegance</p>
                <span class="mt-2 inline-flex items-center gap-1 text-xs font-semibold transition group-hover:gap-2">
                  Discover →
                </span>
              </div>
            </a>

            <!-- Card 2: Sports & Fitness -->
            <a routerLink="/products" class="group relative block h-72 overflow-hidden rounded-3xl shadow-lg">
              <img src="https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?auto=compress&cs=tinysrgb&w=900"
                   alt="Sports & Fitness"
                   class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110">
              <div class="absolute inset-0 bg-gradient-to-t from-sky-900/90 via-sky-900/30 to-transparent"></div>
              <div class="absolute top-4 right-4">
                <span class="inline-flex items-center rounded-full bg-rose-500 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white">Hot</span>
              </div>
              <div class="absolute inset-x-0 bottom-0 p-5 text-white">
                <h3 class="text-xl font-bold drop-shadow-lg">Sports & Fitness</h3>
                <p class="mt-1 text-xs text-slate-200 drop-shadow">Gear up for greatness</p>
                <span class="mt-2 inline-flex items-center gap-1 text-xs font-semibold transition group-hover:gap-2">
                  Discover →
                </span>
              </div>
            </a>

            <!-- Card 3: Beauty -->
            <a routerLink="/products" class="group relative block h-72 overflow-hidden rounded-3xl shadow-lg">
              <img src="https://images.pexels.com/photos/2536965/pexels-photo-2536965.jpeg?auto=compress&cs=tinysrgb&w=900"
                   alt="Beauty"
                   class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110">
              <div class="absolute inset-0 bg-gradient-to-t from-purple-900/90 via-purple-900/30 to-transparent"></div>
              <div class="absolute top-4 right-4">
                <span class="inline-flex items-center rounded-full bg-amber-400 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-slate-900">Trending</span>
              </div>
              <div class="absolute inset-x-0 bottom-0 p-5 text-white">
                <h3 class="text-xl font-bold drop-shadow-lg">Beauty & Personal Care</h3>
                <p class="mt-1 text-xs text-slate-200 drop-shadow">Your daily glow-up routine</p>
                <span class="mt-2 inline-flex items-center gap-1 text-xs font-semibold transition group-hover:gap-2">
                  Discover →
                </span>
              </div>
            </a>
          </div>
        </div>
      </section>

      <!-- Electronics Spotlight -->
      <section class="py-14 bg-slate-50">
        <div class="container mx-auto px-4">
          <div class="flex items-center justify-between mb-10">
            <div>
              <h2 class="text-3xl font-bold text-slate-900">Electronics Spotlight</h2>
              <p class="text-slate-600 mt-2">Top tech picks curated for performance and value.</p>
            </div>
            <a
              *ngIf="electronicsCategoryId"
              routerLink="/products"
              [queryParams]="{ category: electronicsCategoryId }"
              class="btn-secondary"
            >
              View All
            </a>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div *ngFor="let product of electronicsPicks"
                 class="card hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div class="relative">
                <img [src]="product.images[0]" [alt]="product.name" class="w-full h-48 object-cover">
                <div *ngIf="product.discount > 0" class="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-semibold">
                  -{{ product.discount }}%
                </div>
              </div>
              <div class="p-4">
                <h3 class="text-lg font-semibold mb-2 truncate">{{ product.name }}</h3>
                <div class="flex items-center justify-between mb-3">
                  <span class="text-xl font-bold text-primary-600">\${{ product.price }}</span>
                  <span class="text-sm text-slate-600">★ {{ product.rating }}</span>
                </div>
                <a routerLink="/product/{{ product.id }}" class="btn-primary w-full">View Details</a>
              </div>
            </div>
          </div>
        </div>
      </section>

     <!-- Categories Section -->
      <section class="py-14 bg-gray-50">
        <div class="container mx-auto px-4">
          <div class="flex flex-col items-center mb-10 sm:flex-row sm:items-end sm:justify-between">
            <div class="text-center sm:text-left">
              <span class="text-xs font-semibold uppercase tracking-[0.25em] text-indigo-600">Browse</span>
              <h2 class="mt-2 text-3xl font-bold text-slate-900">Shop by Category</h2>
            </div>
            <div class="mt-4 flex items-center gap-3 sm:mt-0">
              <span class="text-sm text-slate-500">
                <span class="font-semibold text-slate-800">{{ categoryPage + 1 }}</span> / <span class="font-semibold text-slate-800">{{ categoryTotalPages || 1 }}</span>
              </span>
              <div class="flex gap-2">
                <button type="button" (click)="categoryPrev()" [disabled]="categoryPage === 0"
                        class="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed">
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/></svg>
                </button>
                <button type="button" (click)="categoryNext()" [disabled]="categoryPage >= categoryTotalPages - 1"
                        class="inline-flex h-10 w-10 items-center justify-center rounded-full text-white shadow-md transition hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
                        style="background: linear-gradient(135deg,#6366f1 0%,#a855f7 100%);">
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
                </button>
              </div>
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div *ngFor="let category of paginatedCategories; let i = index"
                 [style.animation-delay]="i * 0.1 + 's'"
                 class="card hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 animate-scale-in">
              <img [src]="category.image" [alt]="category.name" class="w-full h-48 object-cover">
              <div class="p-6">
                <h3 class="text-xl font-semibold mb-2">{{ category.name }}</h3>
                <p class="text-gray-600 mb-4">{{ category.description }}</p>
                <a routerLink="/products" [queryParams]="{category: category.id}"
                   class="btn-primary">Browse {{ category.name }}</a>
              </div>
            </div>
          </div>
        </div>
      </section>

  <!-- Section: 1 Full-Width Banner Image -->
      <section class="py-14 bg-white">
        <div class="container mx-auto px-4">
          <a routerLink="/products" class="group relative block overflow-hidden rounded-3xl shadow-xl">
            <img src="https://images.pexels.com/photos/5650026/pexels-photo-5650026.jpeg?auto=compress&cs=tinysrgb&w=1600"
                 alt="Mega Sale"
                 class="h-[320px] w-full object-cover transition-transform duration-700 group-hover:scale-105 md:h-[400px]">
            <div class="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-900/50 to-transparent"></div>
            <div class="absolute inset-0 flex items-center">
              <div class="container mx-auto px-8 md:px-14">
                <div class="max-w-xl text-white">
                  <span class="inline-flex items-center gap-2 rounded-full border border-rose-300/30 bg-rose-500/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-rose-100 backdrop-blur">
                    <span class="h-1.5 w-1.5 rounded-full bg-rose-300 animate-pulse"></span>
                    Limited Time
                  </span>
                  <h2 class="mt-4 text-3xl font-extrabold leading-tight drop-shadow-lg sm:text-5xl">The Season's Biggest Sale</h2>
                  <p class="mt-3 max-w-md text-base text-slate-200 drop-shadow sm:text-lg">Up to 70% off on top picks across every category. Shop the sale before it's gone.</p>
                  <span class="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-slate-900 shadow-xl transition group-hover:gap-3">
                    Explore Deals
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                  </span>
                </div>
              </div>
            </div>
          </a>
        </div>
      </section>

      <!-- Fashion Favourites -->
      <section class="relative overflow-hidden py-16 bg-gradient-to-b from-rose-50/30 via-white to-white">
        <!-- Decorative background accents -->
        <div class="pointer-events-none absolute -top-24 -right-24 h-80 w-80 rounded-full bg-rose-200/30 blur-3xl"></div>
        <div class="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-pink-200/30 blur-3xl"></div>

        <div class="relative container mx-auto px-4">
          <div class="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span class="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.22em] text-rose-700">
                <span class="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse"></span>
                Trending Styles
              </span>
              <h2 class="mt-3 text-3xl sm:text-4xl font-extrabold text-slate-900">
                Fashion <span style="background: linear-gradient(135deg,#f43f5e 0%,#a855f7 100%); -webkit-background-clip: text; background-clip: text; color: transparent;">Favourites</span>
              </h2>
              <p class="mt-2 max-w-xl text-sm sm:text-base text-slate-600">Latest fashion picks — hand-selected for style, fit and comfort.</p>
            </div>
            <a
              *ngIf="fashionCategoryId"
              routerLink="/products"
              [queryParams]="{ category: fashionCategoryId }"
              class="group inline-flex items-center gap-2 self-start rounded-xl px-5 py-2.5 text-sm font-bold text-white shadow-lg transition hover:opacity-90 hover:shadow-xl sm:self-auto"
              style="background: linear-gradient(135deg,#f43f5e 0%,#a855f7 100%); box-shadow: 0 10px 25px -5px rgba(244,63,94,0.45);">
              View All
              <svg class="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
              </svg>
            </a>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            <div *ngFor="let product of fashionPicks; let i = index"
                 [style.animation-delay]="i * 0.08 + 's'"
                 class="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:border-rose-200 animate-fade-in">

              <!-- Image area -->
              <div class="relative overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100">
                <a [routerLink]="'/product/' + product.id" class="block">
                  <img [src]="product.images[0]" [alt]="product.name"
                       class="h-60 w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110">
                </a>

                <!-- Discount badge -->
                <div *ngIf="product.discount > 0"
                     class="absolute left-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-extrabold text-white shadow-md"
                     style="background: linear-gradient(135deg,#f43f5e 0%,#db2777 100%);">
                  -{{ product.discount }}%
                </div>

                <!-- Wishlist heart -->
                <button type="button" (click)="toggleWishlist(product.id)"
                        [attr.aria-label]="isInWishlist(product.id) ? 'Remove from wishlist' : 'Add to wishlist'"
                        class="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 shadow-md backdrop-blur transition hover:scale-110 hover:shadow-lg">
                  <svg class="h-5 w-5 transition"
                       [class.animate-heart-pop]="isPopping(product.id)"
                       [attr.fill]="isInWishlist(product.id) ? '#f43f5e' : 'none'"
                       [attr.stroke]="isInWishlist(product.id) ? '#f43f5e' : '#64748b'"
                       viewBox="0 0 24 24" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                  </svg>
                </button>

                <!-- Stock chip (bottom-left) -->
                <div class="absolute bottom-3 left-3">
                  <span *ngIf="product.stock === 0"
                        class="inline-flex items-center gap-1 rounded-full bg-rose-600 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-md">
                    Out of stock
                  </span>
                  <span *ngIf="product.stock > 0 && product.stock <= 5"
                        class="inline-flex items-center gap-1 rounded-full bg-amber-500 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-md">
                    <span class="h-1.5 w-1.5 rounded-full bg-white animate-pulse"></span>
                    Only {{ product.stock }} left
                  </span>
                </div>

                <!-- Quick View overlay on hover -->
                <a [routerLink]="'/product/' + product.id"
                   class="absolute inset-x-3 bottom-3 flex translate-y-12 items-center justify-center gap-2 rounded-xl bg-slate-900/90 px-3 py-2 text-xs font-bold text-white shadow-lg backdrop-blur opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                  </svg>
                  Quick View
                </a>
              </div>

              <!-- Content -->
              <div class="flex flex-1 flex-col p-4">
                <!-- Tags -->
                <div class="mb-2 flex flex-wrap items-center gap-1.5">
                  <span class="inline-flex items-center rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-rose-700">Fashion</span>
                  <div class="ml-auto flex items-center gap-1 text-xs">
                    <svg class="h-3.5 w-3.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.363 1.118l1.287 3.957c.3.922-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.784.57-1.838-.196-1.54-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.05 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z"/>
                    </svg>
                    <span class="font-bold text-slate-700">{{ product.rating }}</span>
                    <span class="text-slate-400">({{ product.reviews }})</span>
                  </div>
                </div>

                <!-- Title -->
                <a [routerLink]="'/product/' + product.id">
                  <h3 class="line-clamp-1 text-base font-bold text-slate-900 transition group-hover:text-rose-600">{{ product.name }}</h3>
                </a>
                <p class="mt-1 line-clamp-2 text-xs text-slate-500 min-h-[2rem]">{{ product.description }}</p>

                <!-- Price row -->
                <div class="mt-3 flex items-end gap-2 border-t border-slate-100 pt-3">
                  <span class="text-xl font-extrabold text-slate-900">\${{ product.price }}</span>
                  <span *ngIf="product.originalPrice > product.price" class="mb-0.5 text-sm text-slate-400 line-through">
                    \${{ product.originalPrice }}
                  </span>
                  <span *ngIf="product.originalPrice > product.price"
                        class="mb-0.5 ml-auto inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                    Save \${{ (product.originalPrice - product.price).toFixed(2) }}
                  </span>
                </div>

                <!-- Actions -->
                <div class="mt-3 flex gap-2">
                  <button (click)="addToCart(product)" [disabled]="product.stock === 0"
                          class="inline-flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-bold text-white shadow-md transition hover:opacity-90 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
                          style="background: linear-gradient(135deg,#f43f5e 0%,#a855f7 100%); box-shadow: 0 6px 16px -4px rgba(244,63,94,0.45);">
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                    </svg>
                    {{ product.stock === 0 ? 'Out' : 'Add' }}
                  </button>
                  <a [routerLink]="'/product/' + product.id" aria-label="View details"
                     class="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition hover:border-rose-300 hover:bg-rose-50 hover:text-rose-700">
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.25">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

       <!-- Testimonials -->
      <section class="py-14 bg-white">
        <div class="container mx-auto px-4">
          <div class="mb-10 text-center">
            <span class="text-xs font-semibold uppercase tracking-[0.25em] text-primary-600">Loved by thousands</span>
            <h2 class="mt-2 text-3xl font-bold text-slate-900">What our customers say</h2>
          </div>

          <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div class="relative rounded-2xl border border-slate-200 bg-gradient-to-br from-sky-50 to-white p-6 shadow-sm">
              <svg class="absolute right-6 top-6 h-8 w-8 text-sky-200" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9.983 3v7.391c0 5.704-3.731 9.57-8.983 10.609l-.995-2.151c2.432-.917 3.995-3.638 3.995-5.849h-4v-10h9.983zm14.017 0v7.391c0 5.704-3.748 9.571-9 10.609l-.996-2.151c2.433-.917 3.996-3.638 3.996-5.849h-3.983v-10h9.983z"/>
              </svg>
              <div class="flex items-center gap-0.5 text-amber-400">
                <svg *ngFor="let s of [1,2,3,4,5]" class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.363 1.118l1.287 3.957c.3.922-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.784.57-1.838-.196-1.54-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.05 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z"/></svg>
              </div>
              <p class="mt-3 text-sm leading-relaxed text-slate-700">"Amazing quality and fast delivery. The packaging was premium and the product exceeded expectations. Will definitely shop again!"</p>
              <div class="mt-5 flex items-center gap-3">
                <div class="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white"
                     style="background: linear-gradient(135deg,#0ea5e9,#6366f1);">SA</div>
                <div>
                  <p class="text-sm font-bold text-slate-900">Sarah Ahmed</p>
                  <p class="text-xs text-slate-500">Verified Customer · Karachi</p>
                </div>
              </div>
            </div>

            <div class="relative rounded-2xl border border-slate-200 bg-gradient-to-br from-emerald-50 to-white p-6 shadow-sm">
              <svg class="absolute right-6 top-6 h-8 w-8 text-emerald-200" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9.983 3v7.391c0 5.704-3.731 9.57-8.983 10.609l-.995-2.151c2.432-.917 3.995-3.638 3.995-5.849h-4v-10h9.983zm14.017 0v7.391c0 5.704-3.748 9.571-9 10.609l-.996-2.151c2.433-.917 3.996-3.638 3.996-5.849h-3.983v-10h9.983z"/>
              </svg>
              <div class="flex items-center gap-0.5 text-amber-400">
                <svg *ngFor="let s of [1,2,3,4,5]" class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.363 1.118l1.287 3.957c.3.922-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.784.57-1.838-.196-1.54-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.05 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z"/></svg>
              </div>
              <p class="mt-3 text-sm leading-relaxed text-slate-700">"Best online shopping experience in Pakistan. Great prices, genuine products, and super responsive customer service team."</p>
              <div class="mt-5 flex items-center gap-3">
                <div class="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white"
                     style="background: linear-gradient(135deg,#10b981,#0d9488);">BK</div>
                <div>
                  <p class="text-sm font-bold text-slate-900">Bilal Khan</p>
                  <p class="text-xs text-slate-500">Verified Customer · Lahore</p>
                </div>
              </div>
            </div>

            <div class="relative rounded-2xl border border-slate-200 bg-gradient-to-br from-rose-50 to-white p-6 shadow-sm">
              <svg class="absolute right-6 top-6 h-8 w-8 text-rose-200" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9.983 3v7.391c0 5.704-3.731 9.57-8.983 10.609l-.995-2.151c2.432-.917 3.995-3.638 3.995-5.849h-4v-10h9.983zm14.017 0v7.391c0 5.704-3.748 9.571-9 10.609l-.996-2.151c2.433-.917 3.996-3.638 3.996-5.849h-3.983v-10h9.983z"/>
              </svg>
              <div class="flex items-center gap-0.5 text-amber-400">
                <svg *ngFor="let s of [1,2,3,4,5]" class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.363 1.118l1.287 3.957c.3.922-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.784.57-1.838-.196-1.54-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.05 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z"/></svg>
              </div>
              <p class="mt-3 text-sm leading-relaxed text-slate-700">"I love the variety and the clean checkout experience. My orders always arrive on time and the wishlist feature is super handy."</p>
              <div class="mt-5 flex items-center gap-3">
                <div class="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white"
                     style="background: linear-gradient(135deg,#f43f5e,#ec4899);">FR</div>
                <div>
                  <p class="text-sm font-bold text-slate-900">Fatima Rizvi</p>
                  <p class="text-xs text-slate-500">Verified Customer · Islamabad</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  `
})
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('beautyScroll') beautyScroll?: ElementRef<HTMLDivElement>;

  beautyPaused = false;
  private beautyRafId: number | null = null;
  categories: Category[] = [];
  brands: Brand[] = [];
  allProducts: Product[] = [];
  featuredProducts: Product[] = [];
  electronicsPicks: Product[] = [];
  fashionPicks: Product[] = [];
  sportsProducts: Product[] = [];
  beautyProducts: Product[] = [];
  electronicsCategoryId = '';
  fashionCategoryId = '';

  readonly featuredPageSize = 8;
  readonly smallPageSize = 4;
  readonly categoryPageSize = 6;
  featuredPage = 0;
  sportsPage = 0;
  beautyPage = 0;
  categoryPage = 0;

  activeSlide = 0;
  progressPercent = 0;
  private slideTimer: ReturnType<typeof setInterval> | null = null;
  private progressTimer: ReturnType<typeof setInterval> | null = null;
  private readonly slideDurationMs = 5000;
  private readonly progressStepMs = 50;

  heroSlides: HeroSlide[] = [
    {
      tag: 'New Collection',
      title: 'Welcome to Trendify',
      description: 'Discover thousands of amazing products at unbeatable prices — handpicked styles delivered to your door.',
      image: 'https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg?auto=compress&cs=tinysrgb&w=1600',
      cta: 'Shop Now',
      link: '/products',
      accent: '#38bdf8'
    },
    {
      tag: 'Electronics',
      title: 'Smart Tech, Smarter Prices',
      description: 'From wireless headphones to powerful smartwatches — upgrade your digital lifestyle with the latest gadgets.',
      image: 'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=1600',
      cta: 'Shop Electronics',
      link: '/products',
      accent: '#a78bfa'
    },
    {
      tag: 'Fashion',
      title: 'Wear What Defines You',
      description: 'Trendy clothing and accessories crafted for every season — express your unique style with confidence.',
      image: 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=1600',
      cta: 'Shop Fashion',
      link: '/products',
      accent: '#f472b6'
    },
    {
      tag: 'Home & Living',
      title: 'Transform Your Space',
      description: 'Beautifully curated home essentials and kitchen must-haves to turn every room into a sanctuary.',
      image: 'https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg?auto=compress&cs=tinysrgb&w=1600',
      cta: 'Explore Home',
      link: '/products',
      accent: '#34d399'
    },
    {
      tag: 'Mega Sale',
      title: 'Up to 70% Off Bestsellers',
      description: 'Limited-time deals across every category — shop curated picks before they are gone this season.',
      image: 'https://images.pexels.com/photos/7319310/pexels-photo-7319310.jpeg?auto=compress&cs=tinysrgb&w=1600',
      cta: 'Grab Deals',
      link: '/products',
      accent: '#fb923c'
    }
  ];

  private popIds = new Set<string>();
  private burstIds = new Set<string>();

  constructor(
    private dataService: DataService,
    private cartService: CartService,
    private wishlistService: WishlistService
  ) { }

  ngOnInit(): void {
    this.dataService.getCategories().subscribe(categories => {
      this.categories = categories;
      this.buildHomeSections();
    });

    this.dataService.getBrands().subscribe(brands => {
      this.brands = brands;
    });

    this.dataService.getProducts().subscribe(products => {
      this.allProducts = products;
      this.featuredProducts = products;
      this.buildHomeSections();
    });

    this.startAutoSlide();
  }

  get paginatedFeatured(): Product[] {
    const start = this.featuredPage * this.featuredPageSize;
    return this.featuredProducts.slice(start, start + this.featuredPageSize);
  }

  get featuredTotalPages(): number {
    return Math.max(1, Math.ceil(this.featuredProducts.length / this.featuredPageSize));
  }

  featuredPrev(): void {
    if (this.featuredPage > 0) this.featuredPage--;
  }

  featuredNext(): void {
    if (this.featuredPage < this.featuredTotalPages - 1) this.featuredPage++;
  }

  get paginatedSports(): Product[] {
    const start = this.sportsPage * this.smallPageSize;
    return this.sportsProducts.slice(start, start + this.smallPageSize);
  }

  get sportsTotalPages(): number {
    return Math.max(1, Math.ceil(this.sportsProducts.length / this.smallPageSize));
  }

  sportsPrev(): void {
    if (this.sportsPage > 0) this.sportsPage--;
  }

  sportsNext(): void {
    if (this.sportsPage < this.sportsTotalPages - 1) this.sportsPage++;
  }

  get paginatedBeauty(): Product[] {
    const start = this.beautyPage * this.smallPageSize;
    return this.beautyProducts.slice(start, start + this.smallPageSize);
  }

  get marqueeBeauty(): Product[] {
    if (this.beautyProducts.length === 0) return [];
    // Duplicate the list for seamless infinite loop
    return [...this.beautyProducts, ...this.beautyProducts];
  }

  get beautyTotalPages(): number {
    return Math.max(1, Math.ceil(this.beautyProducts.length / this.smallPageSize));
  }

  beautyPrev(): void {
    if (this.beautyPage > 0) this.beautyPage--;
  }

  beautyNext(): void {
    if (this.beautyPage < this.beautyTotalPages - 1) this.beautyPage++;
  }

  get paginatedCategories(): Category[] {
    const start = this.categoryPage * this.categoryPageSize;
    return this.categories.slice(start, start + this.categoryPageSize);
  }

  get categoryTotalPages(): number {
    return Math.max(1, Math.ceil(this.categories.length / this.categoryPageSize));
  }

  categoryPrev(): void {
    if (this.categoryPage > 0) this.categoryPage--;
  }

  categoryNext(): void {
    if (this.categoryPage < this.categoryTotalPages - 1) this.categoryPage++;
  }

  getBrandLogo(brandId: string): string {
    return this.brands.find(b => b.id === brandId)?.logo || '';
  }

  getBrandName(brandId: string): string {
    return this.brands.find(b => b.id === brandId)?.name || '';
  }

  getCategoryName(categoryId: string): string {
    return this.categories.find(c => c.id === categoryId)?.name || '';
  }

  roundedRating(rating: number): number {
    return Math.round(rating);
  }

  isInWishlist(productId: string): boolean {
    return this.wishlistService.isInWishlist(productId);
  }

  isPopping(productId: string): boolean {
    return this.popIds.has(productId);
  }

  isBursting(productId: string): boolean {
    return this.burstIds.has(productId);
  }

  addToCart(product: Product): void {
    this.cartService.addToCart(product.id, product.price);
  }

  toggleWishlist(productId: string): void {
    const was = this.isInWishlist(productId);
    if (was) {
      this.wishlistService.removeFromWishlist(productId);
    } else {
      this.wishlistService.addToWishlist(productId);
      this.burstIds.add(productId);
      setTimeout(() => this.burstIds.delete(productId), 600);
    }
    this.popIds.add(productId);
    setTimeout(() => this.popIds.delete(productId), 600);
  }

  ngOnDestroy(): void {
    this.stopAutoSlide();
    if (this.beautyRafId !== null) cancelAnimationFrame(this.beautyRafId);
  }

  ngAfterViewInit(): void {
    // Start immediately; tick itself handles the case when scrollWidth isn't ready yet
    this.tickBeautyScroll();
  }

  private beautyInitialized = false;

  private tickBeautyScroll = (): void => {
    const el = this.beautyScroll?.nativeElement;
    if (el) {
      const half = el.scrollWidth / 2;

      // Wait until items are laid out (duplicated list → scrollWidth > clientWidth)
      if (el.scrollWidth > el.clientWidth) {
        // First time ready: seed scrollLeft at the halfway mark
        if (!this.beautyInitialized) {
          el.scrollLeft = half;
          this.beautyInitialized = true;
        } else if (!this.beautyPaused) {
          // Continuous leftward decrement → cards visually move left-to-right
          el.scrollLeft -= 0.6;
          if (el.scrollLeft <= 0) {
            el.scrollLeft = half;
          }
        }
      }
    }
    this.beautyRafId = requestAnimationFrame(this.tickBeautyScroll);
  };

  scrollBeauty(direction: 1 | -1): void {
    const el = this.beautyScroll?.nativeElement;
    if (!el) return;
    const cardWidth = 288 + 20; // w-72 card + gap-5
    el.scrollBy({ left: direction * cardWidth * 2, behavior: 'smooth' });
  }

  goToSlide(index: number): void {
    this.activeSlide = index;
    this.resetProgress();
  }

  nextSlide(): void {
    this.activeSlide = (this.activeSlide + 1) % this.heroSlides.length;
    this.resetProgress();
  }

  prevSlide(): void {
    this.activeSlide = (this.activeSlide - 1 + this.heroSlides.length) % this.heroSlides.length;
    this.resetProgress();
  }

  private startAutoSlide(): void {
    this.resetProgress();
    this.slideTimer = setInterval(() => {
      this.activeSlide = (this.activeSlide + 1) % this.heroSlides.length;
      this.resetProgress();
    }, this.slideDurationMs);
  }

  private stopAutoSlide(): void {
    if (this.slideTimer) {
      clearInterval(this.slideTimer);
      this.slideTimer = null;
    }
    if (this.progressTimer) {
      clearInterval(this.progressTimer);
      this.progressTimer = null;
    }
  }

  private resetProgress(): void {
    if (this.progressTimer) clearInterval(this.progressTimer);
    this.progressPercent = 0;
    const increment = (100 * this.progressStepMs) / this.slideDurationMs;
    this.progressTimer = setInterval(() => {
      this.progressPercent = Math.min(100, this.progressPercent + increment);
    }, this.progressStepMs);
  }

  private buildHomeSections(): void {
    if (!this.allProducts.length) {
      this.electronicsPicks = [];
      this.fashionPicks = [];
      this.sportsProducts = [];
      this.beautyProducts = [];
      return;
    }

    const electronicsCategory = this.categories.find(category =>
      category.name.toLowerCase().includes('electronic')
    );
    const fashionCategory = this.categories.find(category =>
      category.name.toLowerCase().includes('fashion')
    );
    const sportsCategory = this.categories.find(category =>
      category.name.toLowerCase().includes('sport') ||
      category.name.toLowerCase().includes('fitness')
    );
    const beautyCategory = this.categories.find(category =>
      category.name.toLowerCase().includes('beauty') ||
      category.name.toLowerCase().includes('personal care')
    );

    this.electronicsCategoryId = electronicsCategory?.id || '';
    this.fashionCategoryId = fashionCategory?.id || '';

    const electronics = electronicsCategory
      ? this.allProducts.filter(product => product.categoryId === electronicsCategory.id)
      : [];

    const fashion = fashionCategory
      ? this.allProducts.filter(product => product.categoryId === fashionCategory.id)
      : [];

    this.electronicsPicks = (electronics.length ? electronics : this.allProducts).slice(0, 4);
    this.fashionPicks = (fashion.length ? fashion : this.allProducts.slice(1)).slice(0, 4);

    this.sportsProducts = sportsCategory
      ? this.allProducts.filter(product => product.categoryId === sportsCategory.id)
      : [];
    this.beautyProducts = beautyCategory
      ? this.allProducts.filter(product => product.categoryId === beautyCategory.id)
      : [];

    if (this.featuredPage >= this.featuredTotalPages) this.featuredPage = 0;
    if (this.sportsPage >= this.sportsTotalPages) this.sportsPage = 0;
    if (this.beautyPage >= this.beautyTotalPages) this.beautyPage = 0;
    if (this.categoryPage >= this.categoryTotalPages) this.categoryPage = 0;
  }
}
