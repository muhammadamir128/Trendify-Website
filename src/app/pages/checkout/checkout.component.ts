import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  Router,
  RouterModule,
} from '@angular/router';

import {
  CartItem,
  Order,
  Product,
} from '../../models/interfaces';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { DataService } from '../../services/data.service';

type FieldName =
  | 'firstName' | 'lastName' | 'email' | 'phone'
  | 'street' | 'city' | 'state' | 'zipCode' | 'country'
  | 'cardNumber' | 'cardExpiry' | 'cardCvv' | 'cardName'
  | 'paypalEmail' | 'paypalConsent'
  | 'applePayId' | 'applePayAuth';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="container mx-auto px-4 py-8 animate-fade-in">
      <!-- Page header with step indicator -->
      <div class="mb-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div class="flex items-center gap-4">
          <div class="flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-lg"
               style="background: linear-gradient(135deg,#10b981 0%,#0d9488 100%); box-shadow: 0 10px 25px -5px rgba(16,185,129,0.45);">
            <svg class="h-6 w-6" fill="none" stroke="white" stroke-width="2.25" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
            </svg>
          </div>
          <div>
            <h1 class="text-3xl font-bold text-slate-900">Secure Checkout</h1>
            <p class="text-sm text-slate-500">Complete your order in a few simple steps.</p>
          </div>
        </div>

        <div class="flex items-center gap-3 text-xs">
          <div class="flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1.5 font-semibold text-emerald-700">
            <span class="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            SSL Encrypted
          </div>
          <a routerLink="/cart" class="hidden sm:inline-flex items-center gap-1 text-slate-600 hover:text-slate-900 font-semibold">
            <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/></svg>
            Back to cart
          </a>
        </div>
      </div>

      <div *ngIf="cartItems.length > 0" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2 space-y-6">
          <!-- Shipping Section -->
          <div class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div class="h-1.5 w-full bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-500"></div>
            <div class="flex items-center gap-3 border-b border-slate-100 px-6 py-5">
              <span class="flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-md"
                    style="background: linear-gradient(135deg,#0ea5e9 0%,#6366f1 100%);">
                <svg class="h-5 w-5" fill="none" stroke="white" stroke-width="2.25" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
              </span>
              <div>
                <h2 class="text-lg font-bold text-slate-900">Shipping Information</h2>
                <p class="text-xs text-slate-500">Where should we send your order?</p>
              </div>
            </div>

            <div class="space-y-4 p-6">
              <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label class="block text-xs font-semibold uppercase tracking-wide text-slate-600 mb-1.5">First Name <span class="text-rose-500">*</span></label>
                  <input [(ngModel)]="shippingAddress.firstName" name="firstName" (blur)="touch('firstName')"
                         [class.!border-rose-400]="hasError('firstName')"
                         [class.!ring-rose-100]="hasError('firstName')"
                         class="input-field" placeholder="John">
                  <p *ngIf="hasError('firstName')" class="mt-1 flex items-center gap-1 text-xs text-rose-600">
                    <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                    {{ getError('firstName') }}
                  </p>
                </div>
                <div>
                  <label class="block text-xs font-semibold uppercase tracking-wide text-slate-600 mb-1.5">Last Name <span class="text-rose-500">*</span></label>
                  <input [(ngModel)]="shippingAddress.lastName" name="lastName" (blur)="touch('lastName')"
                         [class.!border-rose-400]="hasError('lastName')"
                         [class.!ring-rose-100]="hasError('lastName')"
                         class="input-field" placeholder="Doe">
                  <p *ngIf="hasError('lastName')" class="mt-1 flex items-center gap-1 text-xs text-rose-600">
                    <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                    {{ getError('lastName') }}
                  </p>
                </div>
              </div>

              <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label class="block text-xs font-semibold uppercase tracking-wide text-slate-600 mb-1.5">Email <span class="text-rose-500">*</span></label>
                  <div class="relative">
                    <svg class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                    </svg>
                    <input [(ngModel)]="shippingAddress.email" name="email" type="email" (blur)="touch('email')"
                           [class.!border-rose-400]="hasError('email')"
                           class="input-field pl-9" placeholder="you@example.com">
                  </div>
                  <p *ngIf="hasError('email')" class="mt-1 text-xs text-rose-600">{{ getError('email') }}</p>
                </div>
                <div>
                  <label class="block text-xs font-semibold uppercase tracking-wide text-slate-600 mb-1.5">Phone <span class="text-rose-500">*</span></label>
                  <div class="relative">
                    <svg class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                    </svg>
                    <input [(ngModel)]="shippingAddress.phone" name="phone" type="tel" (blur)="touch('phone')"
                           [class.!border-rose-400]="hasError('phone')"
                           class="input-field pl-9" placeholder="+92 300 1234567">
                  </div>
                  <p *ngIf="hasError('phone')" class="mt-1 text-xs text-rose-600">{{ getError('phone') }}</p>
                </div>
              </div>

              <div>
                <label class="block text-xs font-semibold uppercase tracking-wide text-slate-600 mb-1.5">Street Address <span class="text-rose-500">*</span></label>
                <input [(ngModel)]="shippingAddress.street" name="street" (blur)="touch('street')"
                       [class.!border-rose-400]="hasError('street')"
                       class="input-field" placeholder="House 24, Street 5, Block A">
                <p *ngIf="hasError('street')" class="mt-1 text-xs text-rose-600">{{ getError('street') }}</p>
              </div>

              <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div>
                  <label class="block text-xs font-semibold uppercase tracking-wide text-slate-600 mb-1.5">City <span class="text-rose-500">*</span></label>
                  <input [(ngModel)]="shippingAddress.city" name="city" (blur)="touch('city')"
                         [class.!border-rose-400]="hasError('city')"
                         class="input-field" placeholder="Karachi">
                  <p *ngIf="hasError('city')" class="mt-1 text-xs text-rose-600">{{ getError('city') }}</p>
                </div>
                <div>
                  <label class="block text-xs font-semibold uppercase tracking-wide text-slate-600 mb-1.5">State <span class="text-rose-500">*</span></label>
                  <input [(ngModel)]="shippingAddress.state" name="state" (blur)="touch('state')"
                         [class.!border-rose-400]="hasError('state')"
                         class="input-field" placeholder="Sindh">
                  <p *ngIf="hasError('state')" class="mt-1 text-xs text-rose-600">{{ getError('state') }}</p>
                </div>
                <div>
                  <label class="block text-xs font-semibold uppercase tracking-wide text-slate-600 mb-1.5">ZIP Code <span class="text-rose-500">*</span></label>
                  <input [(ngModel)]="shippingAddress.zipCode" name="zipCode" (blur)="touch('zipCode')"
                         [class.!border-rose-400]="hasError('zipCode')"
                         class="input-field" placeholder="75600">
                  <p *ngIf="hasError('zipCode')" class="mt-1 text-xs text-rose-600">{{ getError('zipCode') }}</p>
                </div>
              </div>

              <div>
                <label class="block text-xs font-semibold uppercase tracking-wide text-slate-600 mb-1.5">Country <span class="text-rose-500">*</span></label>
                <input [(ngModel)]="shippingAddress.country" name="country" (blur)="touch('country')"
                       [class.!border-rose-400]="hasError('country')"
                       class="input-field" placeholder="Pakistan">
                <p *ngIf="hasError('country')" class="mt-1 text-xs text-rose-600">{{ getError('country') }}</p>
              </div>
            </div>
          </div>

          <!-- Payment Section -->
          <div class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div class="h-1.5 w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-500"></div>
            <div class="flex items-center gap-3 border-b border-slate-100 px-6 py-5">
              <span class="flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-md"
                    style="background: linear-gradient(135deg,#10b981 0%,#0d9488 100%);">
                <svg class="h-5 w-5" fill="none" stroke="white" stroke-width="2.25" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3 10h18M5 6h14a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2z"/>
                </svg>
              </span>
              <div>
                <h2 class="text-lg font-bold text-slate-900">Payment Method</h2>
                <p class="text-xs text-slate-500">Choose how you would like to pay.</p>
              </div>
            </div>

            <div class="p-6 space-y-5">
              <div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <label *ngFor="let option of paymentOptions"
                       class="group relative flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 p-4 transition"
                       [class.border-primary-500]="paymentMethod === option.value"
                       [class.bg-primary-50]="paymentMethod === option.value"
                       [class.border-slate-200]="paymentMethod !== option.value"
                       [class.hover:border-slate-300]="paymentMethod !== option.value">
                  <input type="radio" [(ngModel)]="paymentMethod" name="paymentMethod" [value]="option.value" class="sr-only">
                  <span class="flex h-10 w-10 items-center justify-center rounded-xl text-xl" [style.background]="option.bg">
                    {{ option.icon }}
                  </span>
                  <span class="text-sm font-semibold text-slate-900">{{ option.label }}</span>
                  <span *ngIf="paymentMethod === option.value"
                        class="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary-600 text-white">
                    <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
                  </span>
                </label>
              </div>

              <div *ngIf="paymentMethod === 'credit-card'" class="space-y-4 rounded-xl border border-slate-200 bg-slate-50/50 p-5">
                <!-- Card preview -->
                <div class="relative h-44 overflow-hidden rounded-2xl p-5 text-white shadow-lg"
                     style="background: linear-gradient(135deg,#1e293b 0%,#4338ca 50%,#0891b2 100%);">
                  <div class="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10"></div>
                  <div class="absolute -left-6 -bottom-6 h-28 w-28 rounded-full bg-white/5"></div>
                  <div class="relative flex h-full flex-col justify-between">
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-2">
                        <div class="h-8 w-10 rounded bg-gradient-to-br from-amber-300 to-amber-500"></div>
                      </div>
                      <span class="text-xs font-semibold uppercase tracking-widest opacity-80">{{ cardBrand }}</span>
                    </div>
                    <div>
                      <p class="font-mono text-lg tracking-widest">{{ cardDetails.number || '•••• •••• •••• ••••' }}</p>
                      <div class="mt-2 flex items-center justify-between text-xs">
                        <div>
                          <p class="text-[10px] uppercase tracking-widest opacity-60">Name</p>
                          <p class="font-semibold uppercase">{{ cardDetails.name || 'YOUR NAME' }}</p>
                        </div>
                        <div>
                          <p class="text-[10px] uppercase tracking-widest opacity-60">Expires</p>
                          <p class="font-semibold">{{ cardDetails.expiry || 'MM/YY' }}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label class="block text-xs font-semibold uppercase tracking-wide text-slate-600 mb-1.5">Card Number <span class="text-rose-500">*</span></label>
                  <input [ngModel]="cardDetails.number" (ngModelChange)="onCardNumberChange($event)"
                         name="cardNumber" type="text" placeholder="1234 5678 9012 3456" (blur)="touch('cardNumber')"
                         [class.!border-rose-400]="hasError('cardNumber')"
                         class="input-field font-mono tracking-wider" maxlength="19" inputmode="numeric">
                  <p *ngIf="hasError('cardNumber')" class="mt-1 text-xs text-rose-600">{{ getError('cardNumber') }}</p>
                </div>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-xs font-semibold uppercase tracking-wide text-slate-600 mb-1.5">Expiry Date <span class="text-rose-500">*</span></label>
                    <input [ngModel]="cardDetails.expiry" (ngModelChange)="onExpiryChange($event)"
                           name="cardExpiry" type="text" placeholder="MM/YY" (blur)="touch('cardExpiry')"
                           [class.!border-rose-400]="hasError('cardExpiry')"
                           class="input-field font-mono" maxlength="5" inputmode="numeric">
                    <p *ngIf="hasError('cardExpiry')" class="mt-1 text-xs text-rose-600">{{ getError('cardExpiry') }}</p>
                  </div>
                  <div>
                    <label class="block text-xs font-semibold uppercase tracking-wide text-slate-600 mb-1.5">CVV <span class="text-rose-500">*</span></label>
                    <input [(ngModel)]="cardDetails.cvv" name="cardCvv" type="password" placeholder="123" (blur)="touch('cardCvv')"
                           [class.!border-rose-400]="hasError('cardCvv')"
                           class="input-field font-mono" maxlength="4" inputmode="numeric">
                    <p *ngIf="hasError('cardCvv')" class="mt-1 text-xs text-rose-600">{{ getError('cardCvv') }}</p>
                  </div>
                </div>
                <div>
                  <label class="block text-xs font-semibold uppercase tracking-wide text-slate-600 mb-1.5">Cardholder Name <span class="text-rose-500">*</span></label>
                  <input [(ngModel)]="cardDetails.name" name="cardName" type="text" placeholder="JOHN DOE" (blur)="touch('cardName')"
                         [class.!border-rose-400]="hasError('cardName')"
                         class="input-field uppercase">
                  <p *ngIf="hasError('cardName')" class="mt-1 text-xs text-rose-600">{{ getError('cardName') }}</p>
                </div>
              </div>

              <!-- PayPal Form -->
              <div *ngIf="paymentMethod === 'paypal'" class="space-y-4 rounded-xl border border-slate-200 bg-slate-50/50 p-5">
                <div class="relative h-36 overflow-hidden rounded-2xl p-5 text-white shadow-lg"
                     style="background: linear-gradient(135deg,#003087 0%,#009cde 60%,#012169 100%);">
                  <div class="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/10"></div>
                  <div class="relative flex h-full flex-col justify-between">
                    <div class="flex items-center gap-2 text-2xl font-extrabold tracking-tight">
                      <span class="italic" style="font-family: 'Segoe UI', sans-serif;">Pay<span class="text-sky-200">Pal</span></span>
                    </div>
                    <div>
                      <p class="text-[10px] uppercase tracking-widest opacity-70">Paying from</p>
                      <p class="text-sm font-semibold break-all">{{ paypalDetails.email || 'your-email@example.com' }}</p>
                    </div>
                  </div>
                </div>

                <div class="rounded-lg border border-sky-200 bg-sky-50 p-3 text-xs text-sky-800">
                  <div class="flex items-start gap-2">
                    <svg class="h-4 w-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <span>You will be redirected to PayPal to log in and confirm your payment securely.</span>
                  </div>
                </div>

                <div>
                  <label class="block text-xs font-semibold uppercase tracking-wide text-slate-600 mb-1.5">PayPal Email <span class="text-rose-500">*</span></label>
                  <div class="relative">
                    <svg class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                    </svg>
                    <input [(ngModel)]="paypalDetails.email" name="paypalEmail" type="email" (blur)="touch('paypalEmail')"
                           [class.!border-rose-400]="hasError('paypalEmail')"
                           class="input-field pl-9" placeholder="your@paypal.com">
                  </div>
                  <p *ngIf="hasError('paypalEmail')" class="mt-1 text-xs text-rose-600">{{ getError('paypalEmail') }}</p>
                </div>

                <label class="flex items-start gap-3 rounded-lg border border-slate-200 bg-white p-3 cursor-pointer transition hover:border-sky-300">
                  <input type="checkbox" [(ngModel)]="paypalDetails.consent" name="paypalConsent" (change)="touch('paypalConsent')"
                         class="mt-0.5 h-4 w-4 rounded text-primary-600">
                  <div class="flex-1">
                    <p class="text-sm font-medium text-slate-800">Authorize PayPal to charge this payment</p>
                    <p class="text-xs text-slate-500">I agree to PayPal's Buyer Agreement and authorize this transaction.</p>
                  </div>
                </label>
                <p *ngIf="hasError('paypalConsent')" class="-mt-2 text-xs text-rose-600">{{ getError('paypalConsent') }}</p>
              </div>

              <!-- Apple Pay Form -->
              <div *ngIf="paymentMethod === 'apple-pay'" class="space-y-4 rounded-xl border border-slate-200 bg-slate-50/50 p-5">
                <div class="relative h-40 overflow-hidden rounded-2xl p-5 text-white shadow-lg"
                     style="background: linear-gradient(135deg,#000000 0%,#1f2937 60%,#111827 100%);">
                  <div class="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/5"></div>
                  <div class="relative flex h-full flex-col justify-between">
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-2 text-lg font-semibold">
                        <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
                        Pay
                      </div>
                      <span class="text-xs font-semibold uppercase tracking-widest opacity-70">Device Auth</span>
                    </div>
                    <div>
                      <p class="text-[10px] uppercase tracking-widest opacity-60">Apple ID</p>
                      <p class="text-sm font-semibold break-all">{{ applePayDetails.appleId || 'your-apple-id@icloud.com' }}</p>
                      <div class="mt-2 flex items-center gap-2 text-xs">
                        <span class="inline-flex items-center gap-1 rounded-full bg-white/10 px-2 py-0.5">
                          <span class="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                          {{ applePayDetails.auth ? 'Authorized' : 'Awaiting authorization' }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="rounded-lg border border-slate-300 bg-slate-100 p-3 text-xs text-slate-700">
                  <div class="flex items-start gap-2">
                    <svg class="h-4 w-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                    </svg>
                    <span>Apple Pay uses Face ID, Touch ID, or your device passcode. Your card details are never shared with the merchant.</span>
                  </div>
                </div>

                <div>
                  <label class="block text-xs font-semibold uppercase tracking-wide text-slate-600 mb-1.5">Apple ID <span class="text-rose-500">*</span></label>
                  <div class="relative">
                    <svg class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                    </svg>
                    <input [(ngModel)]="applePayDetails.appleId" name="applePayId" type="email" (blur)="touch('applePayId')"
                           [class.!border-rose-400]="hasError('applePayId')"
                           class="input-field pl-9" placeholder="you@icloud.com">
                  </div>
                  <p *ngIf="hasError('applePayId')" class="mt-1 text-xs text-rose-600">{{ getError('applePayId') }}</p>
                </div>

                <div>
                  <label class="block text-xs font-semibold uppercase tracking-wide text-slate-600 mb-1.5">Select Device</label>
                  <select [(ngModel)]="applePayDetails.device" name="applePayDevice" class="input-field">
                    <option value="iphone">📱 iPhone 15 Pro — Face ID</option>
                    <option value="ipad">📱 iPad Pro — Face ID</option>
                    <option value="macbook">💻 MacBook Pro — Touch ID</option>
                    <option value="watch">⌚ Apple Watch — Side button double-click</option>
                  </select>
                </div>

                <label class="flex items-start gap-3 rounded-lg border border-slate-200 bg-white p-3 cursor-pointer transition hover:border-slate-400">
                  <input type="checkbox" [(ngModel)]="applePayDetails.auth" name="applePayAuth" (change)="touch('applePayAuth')"
                         class="mt-0.5 h-4 w-4 rounded text-slate-900">
                  <div class="flex-1">
                    <p class="text-sm font-medium text-slate-800">Authorize with {{ authMethodLabel }}</p>
                    <p class="text-xs text-slate-500">Confirm this payment on your selected device using biometrics.</p>
                  </div>
                </label>
                <p *ngIf="hasError('applePayAuth')" class="-mt-2 text-xs text-rose-600">{{ getError('applePayAuth') }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Order Summary -->
        <div class="lg:col-span-1">
          <div class="sticky top-24 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div class="flex items-center gap-3 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white px-5 py-4">
              <svg class="h-5 w-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6 0a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"/>
              </svg>
              <h3 class="text-base font-bold text-slate-900">Order Summary</h3>
              <span class="ml-auto inline-flex items-center justify-center rounded-full bg-slate-900 px-2.5 py-0.5 text-xs font-semibold text-white">{{ getTotalItems() }}</span>
            </div>

            <div class="max-h-64 space-y-2 overflow-y-auto p-4">
              <div *ngFor="let item of cartItems" class="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-2.5">
                <img [src]="getProduct(item.productId)?.images?.[0]" [alt]="getProduct(item.productId)?.name || ''" class="h-12 w-12 flex-shrink-0 rounded-lg object-cover">
                <div class="min-w-0 flex-1">
                  <p class="truncate text-sm font-semibold text-slate-900">{{ getProduct(item.productId)?.name }}</p>
                  <p class="text-xs text-slate-500">Qty {{ item.quantity }} · \${{ item.price }}</p>
                </div>
                <p class="text-sm font-bold text-slate-900">\${{ (item.price * item.quantity).toFixed(2) }}</p>
              </div>
            </div>

            <div class="space-y-2 border-t border-slate-100 px-5 py-4 text-sm">
              <div class="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span class="font-semibold text-slate-900">\${{ getSubtotal().toFixed(2) }}</span>
              </div>
              <div class="flex justify-between text-slate-600">
                <span>Shipping</span>
                <span class="font-semibold" [class.text-emerald-600]="getShipping() === 0" [class.text-slate-900]="getShipping() !== 0">
                  {{ getShipping() === 0 ? 'FREE' : '$' + getShipping().toFixed(2) }}
                </span>
              </div>
              <div class="flex justify-between text-slate-600">
                <span>Tax (8%)</span>
                <span class="font-semibold text-slate-900">\${{ getTax().toFixed(2) }}</span>
              </div>
              <div class="flex justify-between border-t border-slate-200 pt-3 text-base">
                <span class="font-bold text-slate-900">Total</span>
                <span class="text-xl font-extrabold text-primary-600">\${{ getTotal().toFixed(2) }}</span>
              </div>
            </div>

            <div class="space-y-3 border-t border-slate-100 bg-slate-50/60 px-5 py-4">
              <div *ngIf="orderError" class="flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
                <svg class="h-4 w-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.25"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                <span>{{ orderError }}</span>
              </div>

              <button (click)="placeOrder()" [disabled]="isProcessing"
                      class="inline-flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-white shadow-lg transition hover:opacity-90 disabled:opacity-60"
                      style="background: linear-gradient(135deg,#10b981 0%,#0d9488 100%); box-shadow: 0 10px 25px -5px rgba(16,185,129,0.5);">
                <svg *ngIf="!isProcessing" class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
                </svg>
                <svg *ngIf="isProcessing" class="h-4 w-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                </svg>
                {{ isProcessing ? 'Processing…' : 'Place Order · $' + getTotal().toFixed(2) }}
              </button>

              <div class="flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
                <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                </svg>
                Payments are encrypted with bank-grade security.
              </div>
            </div>
          </div>
        </div>
      </div>

      <div *ngIf="cartItems.length === 0" class="flex flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed border-slate-200 bg-white py-16 text-center">
        <div class="flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
          <svg class="h-10 w-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
          </svg>
        </div>
        <h2 class="text-xl font-bold text-slate-900">Your cart is empty</h2>
        <p class="max-w-md text-sm text-slate-500">Add some products to proceed with checkout.</p>
        <a routerLink="/products"
           class="mt-3 inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:opacity-90"
           style="background: linear-gradient(135deg,#0ea5e9 0%,#6366f1 100%); box-shadow: 0 10px 20px -5px rgba(99,102,241,0.45);">
          Browse Products
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
          </svg>
        </a>
      </div>
    </div>
  `
})
export class CheckoutComponent implements OnInit {
  cartItems: CartItem[] = [];
  products: Product[] = [];
  isProcessing = false;
  orderError = '';

  touchedFields = new Set<FieldName>();
  submitAttempted = false;

  shippingAddress = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  };

  paymentMethod = 'credit-card';
  cardDetails = {
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  };

  paypalDetails = {
    email: '',
    consent: false
  };

  applePayDetails = {
    appleId: '',
    device: 'iphone',
    auth: false
  };

  readonly paymentOptions = [
    { value: 'credit-card', label: 'Credit Card', icon: '💳', bg: 'linear-gradient(135deg,#e0f2fe 0%,#dbeafe 100%)' },
    { value: 'paypal', label: 'PayPal', icon: '🅿️', bg: 'linear-gradient(135deg,#dbeafe 0%,#e0e7ff 100%)' },
    { value: 'apple-pay', label: 'Apple Pay', icon: '🍎', bg: 'linear-gradient(135deg,#f1f5f9 0%,#e2e8f0 100%)' }
  ];

  constructor(
    private cartService: CartService,
    private dataService: DataService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cartService.cartItems$.subscribe((items) => {
      this.cartItems = items;
    });

    this.dataService.getProducts().subscribe((products) => {
      this.products = products;
    });

    const currentUser = this.authService.currentUserValue;
    if (currentUser) {
      this.shippingAddress.firstName = currentUser.firstName;
      this.shippingAddress.lastName = currentUser.lastName;
      this.shippingAddress.email = currentUser.email;
    }
  }

  get authMethodLabel(): string {
    switch (this.applePayDetails.device) {
      case 'iphone':
      case 'ipad': return 'Face ID';
      case 'macbook': return 'Touch ID';
      case 'watch': return 'Apple Watch';
      default: return 'device passcode';
    }
  }

  get cardBrand(): string {
    const digits = this.cardDetails.number.replace(/\s/g, '');
    if (digits.startsWith('4')) return 'VISA';
    if (/^5[1-5]/.test(digits)) return 'MASTERCARD';
    if (/^3[47]/.test(digits)) return 'AMEX';
    if (/^6/.test(digits)) return 'DISCOVER';
    return 'CARD';
  }

  touch(field: FieldName): void {
    this.touchedFields.add(field);
  }

  hasError(field: FieldName): boolean {
    if (!this.touchedFields.has(field) && !this.submitAttempted) return false;
    return !!this.getError(field);
  }

  getError(field: FieldName): string {
    const s = this.shippingAddress;
    const c = this.cardDetails;
    switch (field) {
      case 'firstName':
        if (!s.firstName.trim()) return 'First name is required';
        if (s.firstName.trim().length < 2) return 'First name is too short';
        return '';
      case 'lastName':
        if (!s.lastName.trim()) return 'Last name is required';
        if (s.lastName.trim().length < 2) return 'Last name is too short';
        return '';
      case 'email':
        if (!s.email.trim()) return 'Email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.email.trim())) return 'Please enter a valid email address';
        return '';
      case 'phone': {
        const digits = s.phone.replace(/\D/g, '');
        if (!s.phone.trim()) return 'Phone number is required';
        if (digits.length < 10) return 'Phone number must be at least 10 digits';
        return '';
      }
      case 'street':
        if (!s.street.trim()) return 'Street address is required';
        if (s.street.trim().length < 5) return 'Please enter a complete street address';
        return '';
      case 'city':
        if (!s.city.trim()) return 'City is required';
        return '';
      case 'state':
        if (!s.state.trim()) return 'State is required';
        return '';
      case 'zipCode': {
        const z = s.zipCode.trim();
        if (!z) return 'ZIP code is required';
        if (!/^[A-Za-z0-9\s-]{3,10}$/.test(z)) return 'Enter a valid ZIP or postal code';
        return '';
      }
      case 'country':
        if (!s.country.trim()) return 'Country is required';
        return '';
      case 'cardNumber': {
        if (this.paymentMethod !== 'credit-card') return '';
        const digits = c.number.replace(/\s/g, '');
        if (!digits) return 'Card number is required';
        if (!/^\d{13,19}$/.test(digits)) return 'Card number must be 13–19 digits';
        return '';
      }
      case 'cardExpiry': {
        if (this.paymentMethod !== 'credit-card') return '';
        if (!c.expiry) return 'Expiry date is required';
        if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(c.expiry)) return 'Use MM/YY format';
        const [mm, yy] = c.expiry.split('/').map(Number);
        const now = new Date();
        const expYear = 2000 + yy;
        const expEnd = new Date(expYear, mm, 0, 23, 59, 59);
        if (expEnd < now) return 'Card has expired';
        return '';
      }
      case 'cardCvv':
        if (this.paymentMethod !== 'credit-card') return '';
        if (!c.cvv) return 'CVV is required';
        if (!/^\d{3,4}$/.test(c.cvv)) return 'CVV must be 3 or 4 digits';
        return '';
      case 'cardName':
        if (this.paymentMethod !== 'credit-card') return '';
        if (!c.name.trim()) return 'Cardholder name is required';
        if (c.name.trim().length < 2) return 'Name is too short';
        return '';
      case 'paypalEmail':
        if (this.paymentMethod !== 'paypal') return '';
        if (!this.paypalDetails.email.trim()) return 'PayPal email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.paypalDetails.email.trim())) return 'Enter a valid PayPal email';
        return '';
      case 'paypalConsent':
        if (this.paymentMethod !== 'paypal') return '';
        if (!this.paypalDetails.consent) return 'Please authorize the PayPal payment';
        return '';
      case 'applePayId':
        if (this.paymentMethod !== 'apple-pay') return '';
        if (!this.applePayDetails.appleId.trim()) return 'Apple ID is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.applePayDetails.appleId.trim())) return 'Enter a valid Apple ID email';
        return '';
      case 'applePayAuth':
        if (this.paymentMethod !== 'apple-pay') return '';
        if (!this.applePayDetails.auth) return 'Biometric authorization required';
        return '';
    }
    return '';
  }

  onCardNumberChange(value: string): void {
    const digits = value.replace(/\D/g, '').slice(0, 19);
    const grouped = digits.match(/.{1,4}/g)?.join(' ') ?? '';
    this.cardDetails.number = grouped;
  }

  onExpiryChange(value: string): void {
    const digits = value.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 3) {
      this.cardDetails.expiry = `${digits.slice(0, 2)}/${digits.slice(2)}`;
    } else {
      this.cardDetails.expiry = digits;
    }
  }

  getProduct(productId: string): Product | undefined {
    return this.products.find((p) => p.id === productId);
  }

  getTotalItems(): number {
    return this.cartItems.reduce((count, item) => count + item.quantity, 0);
  }

  getSubtotal(): number {
    return this.cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  }

  getShipping(): number {
    return this.getSubtotal() >= 50 ? 0 : 9.99;
  }

  getTax(): number {
    return this.getSubtotal() * 0.08;
  }

  getTotal(): number {
    return this.getSubtotal() + this.getShipping() + this.getTax();
  }

  private allFields(): FieldName[] {
    const base: FieldName[] = ['firstName', 'lastName', 'email', 'phone', 'street', 'city', 'state', 'zipCode', 'country'];
    if (this.paymentMethod === 'credit-card') {
      return [...base, 'cardNumber', 'cardExpiry', 'cardCvv', 'cardName'];
    }
    if (this.paymentMethod === 'paypal') {
      return [...base, 'paypalEmail', 'paypalConsent'];
    }
    if (this.paymentMethod === 'apple-pay') {
      return [...base, 'applePayId', 'applePayAuth'];
    }
    return base;
  }

  isFormValid(): boolean {
    return this.allFields().every(f => !this.getError(f));
  }

  placeOrder(): void {
    this.submitAttempted = true;
    this.allFields().forEach(f => this.touchedFields.add(f));

    if (!this.isFormValid()) {
      this.orderError = 'Please correct the highlighted fields before placing your order.';
      return;
    }

    const currentUser = this.authService.currentUserValue;
    if (!currentUser) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: '/checkout' } });
      return;
    }

    this.orderError = '';
    this.isProcessing = true;

    const order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'> = {
      userId: currentUser.id,
      items: [...this.cartItems],
      total: this.getTotal(),
      status: 'pending',
      shippingAddress: {
        street: this.shippingAddress.street,
        city: this.shippingAddress.city,
        state: this.shippingAddress.state,
        zipCode: this.shippingAddress.zipCode,
        country: this.shippingAddress.country
      },
      paymentMethod: this.paymentMethod
    };

    this.dataService.addOrder(order).subscribe({
      next: (createdOrder) => {
        this.cartService.clearCart();
        this.isProcessing = false;
        this.router.navigate(['/checkout/thank-you'], {
          queryParams: { orderId: createdOrder.id }
        });
      },
      error: (error) => {
        this.isProcessing = false;
        this.orderError = error?.error?.message || 'Failed to place order. Please try again.';
      }
    });
  }
}
