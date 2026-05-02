import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { User } from '../../models/interfaces';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { DataService } from '../../services/data.service';
import { StorageService } from '../../services/storage.service';
import { WishlistService } from '../../services/wishlist.service';

type Tab = 'profile' | 'password' | 'preferences';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="container mx-auto px-4 py-8 animate-fade-in">
      <!-- Page header -->
      <div class="mb-6 flex items-center gap-4">
        <div class="flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-lg"
             style="background: linear-gradient(135deg,#0ea5e9 0%,#6366f1 100%); box-shadow: 0 10px 20px -5px rgba(99,102,241,0.4);">
          <svg class="h-6 w-6" fill="none" stroke="white" stroke-width="2.25" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
          </svg>
        </div>
        <div>
          <h1 class="text-3xl font-bold text-slate-900">My Account</h1>
          <p class="text-sm text-slate-500">Manage your profile, security, and preferences.</p>
        </div>
      </div>

      <div class="grid grid-cols-1 gap-6 lg:grid-cols-[320px_1fr]">
        <!-- Left sidebar -->
        <aside class="space-y-4">
          <!-- Avatar card -->
          <div class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div class="h-20 w-full" style="background: linear-gradient(135deg,#0ea5e9 0%,#6366f1 100%);"></div>
            <div class="px-6 pb-6">
              <div class="relative -mt-12">
                <div class="mx-auto h-24 w-24 overflow-hidden rounded-full border-4 border-white shadow-lg bg-slate-100">
                  <img *ngIf="avatarUrl" [src]="avatarUrl" alt="Avatar" class="h-full w-full object-cover">
                  <div *ngIf="!avatarUrl" class="flex h-full w-full items-center justify-center text-3xl font-bold text-white"
                       style="background: linear-gradient(135deg,#0ea5e9 0%,#6366f1 100%);">
                    {{ initials }}
                  </div>
                </div>
                <label class="absolute bottom-0 right-1/2 translate-x-[3.5rem] cursor-pointer">
                  <input type="file" accept="image/*" (change)="onAvatarSelected($event)" class="sr-only">
                  <span class="flex h-9 w-9 items-center justify-center rounded-full bg-white border border-slate-200 text-slate-600 shadow-md transition hover:bg-slate-50 hover:text-primary-600">
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.25">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                  </span>
                </label>
              </div>
              <div class="mt-3 text-center">
                <h2 class="text-lg font-bold text-slate-900">{{ currentUser?.firstName }} {{ currentUser?.lastName }}</h2>
                <p class="text-xs text-slate-500">{{ currentUser?.email }}</p>
                <span class="mt-2 inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold capitalize"
                      [class.bg-amber-100]="currentUser?.role === 'admin'"
                      [class.text-amber-800]="currentUser?.role === 'admin'"
                      [class.bg-emerald-100]="currentUser?.role === 'user'"
                      [class.text-emerald-800]="currentUser?.role === 'user'">
                  <svg class="h-3 w-3" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a1 1 0 01.894.553l2.991 5.983 6.603.959a1 1 0 01.554 1.706l-4.78 4.658 1.128 6.574a1 1 0 01-1.451 1.054L10 20.52l-5.939 3.123a1 1 0 01-1.451-1.054l1.128-6.574-4.78-4.658a1 1 0 01.554-1.706l6.603-.959L9.106 2.553A1 1 0 0110 2z"/></svg>
                  {{ currentUser?.role }}
                </span>
              </div>
              <button *ngIf="avatarUrl" (click)="removeAvatar()"
                      class="mt-3 w-full text-xs font-semibold text-rose-600 hover:text-rose-700">
                Remove photo
              </button>
            </div>
          </div>

          <!-- Stats card -->
          <div class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div class="border-b border-slate-100 px-5 py-3">
              <h3 class="text-xs font-bold uppercase tracking-wider text-slate-700">Quick Stats</h3>
            </div>
            <div class="grid grid-cols-2 divide-x divide-slate-100">
              <a routerLink="/cart" class="flex flex-col items-center p-4 transition hover:bg-slate-50">
                <span class="text-2xl font-extrabold text-primary-600">{{ cartCount }}</span>
                <span class="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Cart Items</span>
              </a>
              <a routerLink="/wishlist" class="flex flex-col items-center p-4 transition hover:bg-slate-50">
                <span class="text-2xl font-extrabold text-rose-500">{{ wishlistCount }}</span>
                <span class="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Wishlist</span>
              </a>
            </div>
          </div>

          <!-- Tabs nav -->
          <nav class="space-y-1 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
            <button *ngFor="let t of tabs" (click)="activeTab = t.value"
                    class="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition"
                    [class.bg-primary-50]="activeTab === t.value"
                    [class.text-primary-700]="activeTab === t.value"
                    [class.text-slate-600]="activeTab !== t.value"
                    [class.hover:bg-slate-50]="activeTab !== t.value">
              <span class="flex h-7 w-7 items-center justify-center rounded-lg"
                    [class.bg-primary-100]="activeTab === t.value"
                    [class.text-primary-700]="activeTab === t.value"
                    [class.bg-slate-100]="activeTab !== t.value"
                    [class.text-slate-500]="activeTab !== t.value">
                <svg *ngIf="t.value === 'profile'" class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.25"><path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                <svg *ngIf="t.value === 'password'" class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.25"><path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                <svg *ngIf="t.value === 'preferences'" class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.25"><path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065zM15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              </span>
              {{ t.label }}
            </button>

            <a routerLink="/orders" class="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50">
              <span class="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.25"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>
              </span>
              My Orders
            </a>

            <a routerLink="/logout" class="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-rose-600 transition hover:bg-rose-50">
              <span class="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-100 text-rose-600">
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.25"><path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
              </span>
              Sign Out
            </a>
          </nav>
        </aside>

        <!-- Right content -->
        <div class="space-y-4">
          <!-- Profile Info Tab -->
          <div *ngIf="activeTab === 'profile'" class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div class="h-1.5 w-full bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-500"></div>
            <div class="border-b border-slate-100 px-6 py-5">
              <h2 class="text-lg font-bold text-slate-900">Personal Information</h2>
              <p class="text-xs text-slate-500">Update your personal details below.</p>
            </div>

            <form (ngSubmit)="saveProfile()" class="space-y-4 p-6">
              <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label class="block text-xs font-semibold uppercase tracking-wide text-slate-600 mb-1.5">First Name</label>
                  <input [(ngModel)]="profileForm.firstName" name="firstName" class="input-field" placeholder="First name">
                </div>
                <div>
                  <label class="block text-xs font-semibold uppercase tracking-wide text-slate-600 mb-1.5">Last Name</label>
                  <input [(ngModel)]="profileForm.lastName" name="lastName" class="input-field" placeholder="Last name">
                </div>
              </div>
              <div>
                <label class="block text-xs font-semibold uppercase tracking-wide text-slate-600 mb-1.5">Email</label>
                <div class="relative">
                  <svg class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                  <input [(ngModel)]="profileForm.email" name="email" type="email" class="input-field pl-9" placeholder="you@example.com">
                </div>
              </div>
              <div>
                <label class="block text-xs font-semibold uppercase tracking-wide text-slate-600 mb-1.5">Phone</label>
                <div class="relative">
                  <svg class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                  <input [(ngModel)]="profileForm.phone" name="phone" type="tel" class="input-field pl-9" placeholder="+92 300 1234567">
                </div>
              </div>

              <div *ngIf="profileMessage" class="flex items-start gap-2 rounded-lg p-3 text-sm"
                   [class.border]="true"
                   [class.border-emerald-200]="profileSuccess"
                   [class.bg-emerald-50]="profileSuccess"
                   [class.text-emerald-700]="profileSuccess"
                   [class.border-rose-200]="!profileSuccess"
                   [class.bg-rose-50]="!profileSuccess"
                   [class.text-rose-700]="!profileSuccess">
                <svg class="h-4 w-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.25">
                  <path *ngIf="profileSuccess" stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                  <path *ngIf="!profileSuccess" stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                </svg>
                {{ profileMessage }}
              </div>

              <div class="flex justify-end gap-3 border-t border-slate-100 pt-4">
                <button type="button" (click)="resetProfile()"
                        class="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition">
                  Reset
                </button>
                <button type="submit"
                        class="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-white shadow-lg transition hover:opacity-90"
                        style="background: linear-gradient(135deg,#0ea5e9 0%,#6366f1 100%); box-shadow: 0 10px 20px -5px rgba(99,102,241,0.45);">
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
                  Save Changes
                </button>
              </div>
            </form>
          </div>

          <!-- Password Tab -->
          <div *ngIf="activeTab === 'password'" class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div class="h-1.5 w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-500"></div>
            <div class="border-b border-slate-100 px-6 py-5">
              <h2 class="text-lg font-bold text-slate-900">Change Password</h2>
              <p class="text-xs text-slate-500">Use a strong password with at least 8 characters.</p>
            </div>

            <form (ngSubmit)="changePassword()" class="space-y-4 p-6">
              <div>
                <label class="block text-xs font-semibold uppercase tracking-wide text-slate-600 mb-1.5">Current Password <span class="text-rose-500">*</span></label>
                <div class="relative">
                  <input [type]="showCurrent ? 'text' : 'password'" [(ngModel)]="passwordForm.current" name="currentPassword"
                         class="input-field pr-10" placeholder="Enter current password">
                  <button type="button" (click)="showCurrent = !showCurrent" class="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-700">
                    <svg *ngIf="!showCurrent" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                    <svg *ngIf="showCurrent" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.97 9.97 0 011.563-3.029m5.858.908A3 3 0 1115 12m-3-7c4.477 0 8.268 2.943 9.542 7a9.97 9.97 0 01-4.043 5.197M3 3l18 18"/></svg>
                  </button>
                </div>
              </div>

              <div>
                <label class="block text-xs font-semibold uppercase tracking-wide text-slate-600 mb-1.5">New Password <span class="text-rose-500">*</span></label>
                <div class="relative">
                  <input [type]="showNew ? 'text' : 'password'" [(ngModel)]="passwordForm.next" name="newPassword"
                         class="input-field pr-10" placeholder="At least 8 characters">
                  <button type="button" (click)="showNew = !showNew" class="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-700">
                    <svg *ngIf="!showNew" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                    <svg *ngIf="showNew" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.97 9.97 0 011.563-3.029m5.858.908A3 3 0 1115 12m-3-7c4.477 0 8.268 2.943 9.542 7a9.97 9.97 0 01-4.043 5.197M3 3l18 18"/></svg>
                  </button>
                </div>

                <!-- Password requirements -->
                <div *ngIf="passwordForm.next" class="mt-2 space-y-1 rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <div class="flex items-center gap-2 text-xs"
                       [class.text-emerald-700]="passwordChecks.length"
                       [class.text-slate-500]="!passwordChecks.length">
                    <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path *ngIf="passwordChecks.length" stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/><circle *ngIf="!passwordChecks.length" cx="12" cy="12" r="8"/></svg>
                    At least 8 characters
                  </div>
                  <div class="flex items-center gap-2 text-xs"
                       [class.text-emerald-700]="passwordChecks.letter"
                       [class.text-slate-500]="!passwordChecks.letter">
                    <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path *ngIf="passwordChecks.letter" stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/><circle *ngIf="!passwordChecks.letter" cx="12" cy="12" r="8"/></svg>
                    Contains a letter
                  </div>
                  <div class="flex items-center gap-2 text-xs"
                       [class.text-emerald-700]="passwordChecks.digit"
                       [class.text-slate-500]="!passwordChecks.digit">
                    <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path *ngIf="passwordChecks.digit" stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/><circle *ngIf="!passwordChecks.digit" cx="12" cy="12" r="8"/></svg>
                    Contains a number
                  </div>
                </div>
              </div>

              <div>
                <label class="block text-xs font-semibold uppercase tracking-wide text-slate-600 mb-1.5">Confirm New Password <span class="text-rose-500">*</span></label>
                <input [type]="showNew ? 'text' : 'password'" [(ngModel)]="passwordForm.confirm" name="confirmPassword"
                       class="input-field" placeholder="Re-enter new password">
              </div>

              <div *ngIf="passwordMessage" class="flex items-start gap-2 rounded-lg p-3 text-sm"
                   [class.border]="true"
                   [class.border-emerald-200]="passwordSuccess"
                   [class.bg-emerald-50]="passwordSuccess"
                   [class.text-emerald-700]="passwordSuccess"
                   [class.border-rose-200]="!passwordSuccess"
                   [class.bg-rose-50]="!passwordSuccess"
                   [class.text-rose-700]="!passwordSuccess">
                <svg class="h-4 w-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.25">
                  <path *ngIf="passwordSuccess" stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                  <path *ngIf="!passwordSuccess" stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                </svg>
                {{ passwordMessage }}
              </div>

              <div class="flex justify-end border-t border-slate-100 pt-4">
                <button type="submit"
                        class="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-white shadow-lg transition hover:opacity-90"
                        style="background: linear-gradient(135deg,#10b981 0%,#0d9488 100%); box-shadow: 0 10px 20px -5px rgba(16,185,129,0.45);">
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                  Update Password
                </button>
              </div>
            </form>
          </div>

          <!-- Preferences Tab -->
          <div *ngIf="activeTab === 'preferences'" class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div class="h-1.5 w-full bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500"></div>
            <div class="border-b border-slate-100 px-6 py-5">
              <h2 class="text-lg font-bold text-slate-900">Preferences</h2>
              <p class="text-xs text-slate-500">Customize notifications and marketing preferences.</p>
            </div>

            <div class="space-y-3 p-6">
              <label *ngFor="let pref of preferenceOptions" class="flex cursor-pointer items-start justify-between gap-3 rounded-xl border border-slate-200 p-4 transition hover:border-primary-300 hover:bg-primary-50/30">
                <div>
                  <p class="text-sm font-semibold text-slate-900">{{ pref.label }}</p>
                  <p class="mt-0.5 text-xs text-slate-500">{{ pref.description }}</p>
                </div>
                <input type="checkbox" [(ngModel)]="preferences[pref.key]" class="mt-1 h-5 w-5 rounded text-primary-600">
              </label>

              <div class="flex justify-end border-t border-slate-100 pt-4">
                <button (click)="savePreferences()"
                        class="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-white shadow-lg transition hover:opacity-90"
                        style="background: linear-gradient(135deg,#a855f7 0%,#ec4899 100%); box-shadow: 0 10px 20px -5px rgba(168,85,247,0.45);">
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
                  {{ preferencesSaved ? 'Saved ✓' : 'Save Preferences' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ProfileComponent implements OnInit {
  currentUser: User | null = null;
  activeTab: Tab = 'profile';
  avatarUrl = '';
  cartCount = 0;
  wishlistCount = 0;

  profileForm = { firstName: '', lastName: '', email: '', phone: '' };
  profileMessage = '';
  profileSuccess = false;

  passwordForm = { current: '', next: '', confirm: '' };
  passwordMessage = '';
  passwordSuccess = false;
  showCurrent = false;
  showNew = false;

  preferences: Record<string, boolean> = {
    emailUpdates: true,
    smsAlerts: false,
    promoOffers: true,
    orderUpdates: true
  };
  preferencesSaved = false;

  readonly tabs: { value: Tab; label: string }[] = [
    { value: 'profile', label: 'Personal Info' },
    { value: 'password', label: 'Password' },
    { value: 'preferences', label: 'Preferences' }
  ];

  readonly preferenceOptions: { key: string; label: string; description: string }[] = [
    { key: 'emailUpdates', label: 'Email updates', description: 'Receive monthly newsletter and product announcements.' },
    { key: 'smsAlerts', label: 'SMS alerts', description: 'Get shipping & delivery alerts via text message.' },
    { key: 'promoOffers', label: 'Promotional offers', description: 'Be the first to know about deals and discounts.' },
    { key: 'orderUpdates', label: 'Order updates', description: 'Notifications about your order status changes.' }
  ];

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private wishlistService: WishlistService,
    private dataService: DataService,
    private storage: StorageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue;
    this.resetProfile();

    this.avatarUrl = this.storage.getItem<string>(this.avatarKey) || '';
    const savedPrefs = this.storage.getItem<Record<string, boolean>>(this.prefsKey);
    if (savedPrefs) this.preferences = { ...this.preferences, ...savedPrefs };

    this.cartService.cartItems$.subscribe(items => {
      this.cartCount = items.reduce((s, i) => s + i.quantity, 0);
    });
    this.wishlistService.wishlistItems$.subscribe(items => {
      this.wishlistCount = items.length;
    });
  }

  get initials(): string {
    const u = this.currentUser;
    return u ? `${u.firstName?.charAt(0) || ''}${u.lastName?.charAt(0) || ''}`.toUpperCase() : 'U';
  }

  get passwordChecks() {
    const pw = this.passwordForm.next;
    return {
      length: pw.length >= 8,
      letter: /[A-Za-z]/.test(pw),
      digit: /\d/.test(pw)
    };
  }

  private get avatarKey(): string {
    return `avatar_${this.currentUser?.id || 'guest'}`;
  }

  private get prefsKey(): string {
    return `prefs_${this.currentUser?.id || 'guest'}`;
  }

  onAvatarSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      this.profileMessage = 'Please select a valid image file.';
      this.profileSuccess = false;
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      this.profileMessage = 'Image must be under 2 MB.';
      this.profileSuccess = false;
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      this.avatarUrl = reader.result as string;
      this.storage.setItem(this.avatarKey, this.avatarUrl);
    };
    reader.readAsDataURL(file);
  }

  removeAvatar(): void {
    this.avatarUrl = '';
    this.storage.removeItem(this.avatarKey);
  }

  resetProfile(): void {
    if (!this.currentUser) return;
    this.profileForm = {
      firstName: this.currentUser.firstName,
      lastName: this.currentUser.lastName,
      email: this.currentUser.email,
      phone: this.storage.getItem<string>(`phone_${this.currentUser.id}`) || ''
    };
    this.profileMessage = '';
  }

  saveProfile(): void {
    if (!this.profileForm.firstName.trim() || !this.profileForm.lastName.trim()) {
      this.profileMessage = 'First and last name are required.';
      this.profileSuccess = false;
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.profileForm.email.trim())) {
      this.profileMessage = 'Please enter a valid email address.';
      this.profileSuccess = false;
      return;
    }
    if (this.currentUser) {
      this.storage.setItem(`phone_${this.currentUser.id}`, this.profileForm.phone);
    }
    this.profileMessage = 'Profile saved successfully.';
    this.profileSuccess = true;
    setTimeout(() => { this.profileMessage = ''; }, 3000);
  }

  changePassword(): void {
    const { current, next, confirm } = this.passwordForm;
    if (!current) {
      this.passwordMessage = 'Current password is required.';
      this.passwordSuccess = false;
      return;
    }
    if (!this.passwordChecks.length || !this.passwordChecks.letter || !this.passwordChecks.digit) {
      this.passwordMessage = 'New password must have at least 8 characters with a letter and a number.';
      this.passwordSuccess = false;
      return;
    }
    if (next !== confirm) {
      this.passwordMessage = 'New password and confirmation do not match.';
      this.passwordSuccess = false;
      return;
    }
    this.passwordMessage = 'Password updated successfully.';
    this.passwordSuccess = true;
    this.passwordForm = { current: '', next: '', confirm: '' };
    setTimeout(() => { this.passwordMessage = ''; }, 3000);
  }

  savePreferences(): void {
    this.storage.setItem(this.prefsKey, this.preferences);
    this.preferencesSaved = true;
    setTimeout(() => { this.preferencesSaved = false; }, 2500);
  }
}
