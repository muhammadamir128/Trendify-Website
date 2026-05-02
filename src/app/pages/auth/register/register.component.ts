import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  ActivatedRoute,
  Router,
  RouterModule,
} from '@angular/router';

import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      <!-- Left: Image / Marketing -->
      <div class="relative hidden lg:block order-last lg:order-first">
        <img src="https://images.pexels.com/photos/7319310/pexels-photo-7319310.jpeg?auto=compress&cs=tinysrgb&w=1200"
             alt="Shopping"
             class="absolute inset-0 h-full w-full object-cover">
        <div class="absolute inset-0 bg-gradient-to-br from-rose-900/90 via-purple-900/80 to-indigo-900/70"></div>
        <div class="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-pink-500/20 blur-3xl"></div>
        <div class="absolute -left-10 -bottom-10 h-80 w-80 rounded-full bg-purple-500/20 blur-3xl"></div>

        <div class="relative flex h-full flex-col justify-between p-12 text-white">
          <a routerLink="/" class="inline-flex w-fit items-center gap-2 text-sm font-semibold text-white/80 hover:text-white transition">
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
            Back to home
          </a>

          <div>
            <div class="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-pink-100 backdrop-blur">
              <span class="h-1.5 w-1.5 rounded-full bg-pink-300 animate-pulse"></span>
              Join Today
            </div>
            <h3 class="mt-4 text-4xl font-extrabold leading-tight drop-shadow-lg">Start your shopping journey with us.</h3>
            <p class="mt-3 max-w-md text-base text-slate-200 drop-shadow">
              Create a free account to save favourites, track orders, and unlock member-only deals.
            </p>

            <div class="mt-8 space-y-3">
              <div class="flex items-center gap-3 rounded-xl border border-white/20 bg-white/5 p-3 backdrop-blur">
                <span class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-pink-500/30 text-pink-100">
                  <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
                </span>
                <div>
                  <p class="text-sm font-bold">Save your favourites</p>
                  <p class="text-xs text-slate-300">Build wishlists that sync across devices.</p>
                </div>
              </div>
              <div class="flex items-center gap-3 rounded-xl border border-white/20 bg-white/5 p-3 backdrop-blur">
                <span class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-indigo-500/30 text-indigo-100">
                  <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
                </span>
                <div>
                  <p class="text-sm font-bold">Track every order</p>
                  <p class="text-xs text-slate-300">Real-time updates from checkout to delivery.</p>
                </div>
              </div>
              <div class="flex items-center gap-3 rounded-xl border border-white/20 bg-white/5 p-3 backdrop-blur">
                <span class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-500/30 text-emerald-100">
                  <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M7 11l5-5m0 0l5 5m-5-5v12"/></svg>
                </span>
                <div>
                  <p class="text-sm font-bold">Member-only rewards</p>
                  <p class="text-xs text-slate-300">Early access to sales and 10% welcome off.</p>
                </div>
              </div>
            </div>
          </div>

          <p class="text-xs text-slate-400">&copy; {{ currentYear }} Trendify. All rights reserved.</p>
        </div>
      </div>

      <!-- Right: Form -->
      <div class="flex items-center justify-center bg-white px-6 py-10 lg:px-12">
        <div class="w-full max-w-md animate-fade-in">
          <a routerLink="/" class="group mb-8 inline-flex items-center gap-2">
            <span class="flex h-11 w-11 items-center justify-center rounded-xl text-white shadow-lg transition group-hover:scale-105"
                  style="background: linear-gradient(135deg,#ec4899 0%,#a855f7 100%); box-shadow: 0 6px 16px -4px rgba(236,72,153,0.45);">
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="white" stroke-width="2.4">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
              </svg>
            </span>
            <span class="text-2xl font-extrabold tracking-tight"
                  style="background: linear-gradient(135deg,#ec4899 0%,#a855f7 100%); -webkit-background-clip: text; background-clip: text; color: transparent;">
              Trendify
            </span>
          </a>

          <div>
            <span class="inline-flex items-center gap-2 rounded-full bg-pink-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-pink-700">
              <span class="h-1.5 w-1.5 rounded-full bg-pink-500 animate-pulse"></span>
              Create Account
            </span>
            <h2 class="mt-3 text-3xl font-extrabold text-slate-900 sm:text-4xl">Let's get you started</h2>
            <p class="mt-2 text-sm text-slate-500">
              Already a member?
              <a routerLink="/login" class="font-semibold text-pink-600 hover:text-pink-700">Sign in</a>
            </p>
          </div>

          <form (ngSubmit)="register()" class="mt-8 space-y-4">
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-semibold uppercase tracking-wide text-slate-600 mb-1.5">First Name <span class="text-rose-500">*</span></label>
                <input type="text" [(ngModel)]="registerData.firstName" name="firstName" required
                       class="input-field" placeholder="John">
              </div>
              <div>
                <label class="block text-xs font-semibold uppercase tracking-wide text-slate-600 mb-1.5">Last Name <span class="text-rose-500">*</span></label>
                <input type="text" [(ngModel)]="registerData.lastName" name="lastName" required
                       class="input-field" placeholder="Doe">
              </div>
            </div>

            <div>
              <label class="block text-xs font-semibold uppercase tracking-wide text-slate-600 mb-1.5">Email <span class="text-rose-500">*</span></label>
              <div class="relative">
                <svg class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
                <input type="email" [(ngModel)]="registerData.email" name="email" required autocomplete="email"
                       class="input-field pl-9" placeholder="you@example.com">
              </div>
            </div>

            <div>
              <label class="block text-xs font-semibold uppercase tracking-wide text-slate-600 mb-1.5">Password <span class="text-rose-500">*</span></label>
              <div class="relative">
                <svg class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                </svg>
                <input [type]="showPassword ? 'text' : 'password'" [(ngModel)]="registerData.password" name="password" required autocomplete="new-password"
                       class="input-field pl-9 pr-10" placeholder="At least 8 characters">
                <button type="button" (click)="showPassword = !showPassword"
                        class="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-700">
                  <svg *ngIf="!showPassword" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                  <svg *ngIf="showPassword" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.97 9.97 0 011.563-3.029m5.858.908A3 3 0 1115 12m-3-7c4.477 0 8.268 2.943 9.542 7a9.97 9.97 0 01-4.043 5.197M3 3l18 18"/></svg>
                </button>
              </div>

              <!-- Password strength -->
              <div *ngIf="registerData.password" class="mt-2">
                <div class="flex h-1 gap-1">
                  <div class="flex-1 rounded-full transition-all" [class]="passwordStrength >= 1 ? strengthColor : 'bg-slate-200'"></div>
                  <div class="flex-1 rounded-full transition-all" [class]="passwordStrength >= 2 ? strengthColor : 'bg-slate-200'"></div>
                  <div class="flex-1 rounded-full transition-all" [class]="passwordStrength >= 3 ? strengthColor : 'bg-slate-200'"></div>
                  <div class="flex-1 rounded-full transition-all" [class]="passwordStrength >= 4 ? strengthColor : 'bg-slate-200'"></div>
                </div>
                <p class="mt-1 text-xs" [class.text-rose-600]="passwordStrength <= 1" [class.text-amber-600]="passwordStrength === 2" [class.text-emerald-600]="passwordStrength >= 3">
                  {{ passwordStrengthLabel }}
                </p>
              </div>
            </div>

            <div>
              <label class="block text-xs font-semibold uppercase tracking-wide text-slate-600 mb-1.5">Confirm Password <span class="text-rose-500">*</span></label>
              <div class="relative">
                <svg class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                </svg>
                <input [type]="showConfirmPassword ? 'text' : 'password'" [(ngModel)]="confirmPassword" name="confirmPassword" required
                       class="input-field pl-9 pr-10" placeholder="Re-enter password">
                <button type="button" (click)="showConfirmPassword = !showConfirmPassword"
                        class="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-700">
                  <svg *ngIf="!showConfirmPassword" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                  <svg *ngIf="showConfirmPassword" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.97 9.97 0 011.563-3.029m5.858.908A3 3 0 1115 12m-3-7c4.477 0 8.268 2.943 9.542 7a9.97 9.97 0 01-4.043 5.197M3 3l18 18"/></svg>
                </button>
              </div>
            </div>

            <label class="flex items-start gap-2 text-xs text-slate-600">
              <input type="checkbox" [(ngModel)]="agreeTerms" name="agreeTerms" class="mt-0.5 h-4 w-4 rounded text-pink-600">
              I agree to the
              <a href="#" class="font-semibold text-pink-600 hover:text-pink-700">Terms of Service</a>
              and
              <a href="#" class="font-semibold text-pink-600 hover:text-pink-700">Privacy Policy</a>.
            </label>

            <div *ngIf="error" class="flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
              <svg class="h-4 w-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.25"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
              <span>{{ error }}</span>
            </div>

            <button type="submit" [disabled]="loading"
                    class="inline-flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-white shadow-lg transition hover:opacity-90 disabled:opacity-60"
                    style="background: linear-gradient(135deg,#ec4899 0%,#a855f7 100%); box-shadow: 0 10px 25px -5px rgba(236,72,153,0.45);">
              <svg *ngIf="loading" class="h-4 w-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
              {{ loading ? 'Creating account…' : 'Create Account' }}
              <svg *ngIf="!loading" class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  `
})
export class RegisterComponent implements OnInit {
  registerData = {
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  };

  confirmPassword = '';
  error = '';
  loading = false;
  returnUrl = '/';
  showPassword = false;
  showConfirmPassword = false;
  agreeTerms = false;
  readonly currentYear = new Date().getFullYear();

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  get passwordStrength(): number {
    const pw = this.registerData.password;
    if (!pw) return 0;
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
    if (/\d/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    return score;
  }

  get passwordStrengthLabel(): string {
    const labels = ['Very weak', 'Weak', 'Fair', 'Good', 'Strong'];
    return labels[this.passwordStrength];
  }

  get strengthColor(): string {
    if (this.passwordStrength <= 1) return 'bg-rose-500';
    if (this.passwordStrength === 2) return 'bg-amber-500';
    return 'bg-emerald-500';
  }

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/';
    if (this.authService.currentUserValue) {
      this.router.navigateByUrl(this.returnUrl);
    }
  }

  register(): void {
    if (!this.registerData.firstName || !this.registerData.lastName || !this.registerData.email || !this.registerData.password) {
      this.error = 'Please fill in all fields';
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.registerData.email.trim())) {
      this.error = 'Please enter a valid email address';
      return;
    }

    if (this.registerData.password !== this.confirmPassword) {
      this.error = 'Passwords do not match';
      return;
    }

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(this.registerData.password)) {
      this.error = 'Password must be at least 8 characters and include letters and numbers';
      return;
    }

    if (!this.agreeTerms) {
      this.error = 'Please accept the Terms of Service and Privacy Policy';
      return;
    }

    this.loading = true;
    this.error = '';

    this.authService.register(this.registerData).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigateByUrl(this.returnUrl);
      },
      error: (error) => {
        this.loading = false;
        this.error = error?.error?.message || error.message || 'Registration failed';
      }
    });
  }
}
