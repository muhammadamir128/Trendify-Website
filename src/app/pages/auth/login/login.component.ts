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
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      <!-- Left: Form -->
      <div class="flex items-center justify-center bg-white px-6 py-10 lg:px-12">
        <div class="w-full max-w-md animate-fade-in">
          <!-- Logo -->
          <a routerLink="/" class="group mb-8 inline-flex items-center gap-2">
            <span class="flex h-11 w-11 items-center justify-center rounded-xl text-white shadow-lg transition group-hover:scale-105"
                  style="background: linear-gradient(135deg,#0ea5e9 0%,#6366f1 100%); box-shadow: 0 6px 16px -4px rgba(99,102,241,0.45);">
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="white" stroke-width="2.4">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
              </svg>
            </span>
            <span class="text-2xl font-extrabold tracking-tight"
                  style="background: linear-gradient(135deg,#0ea5e9 0%,#6366f1 100%); -webkit-background-clip: text; background-clip: text; color: transparent;">
              Trendify
            </span>
          </a>

          <div>
            <span class="inline-flex items-center gap-2 rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary-700">
              <span class="h-1.5 w-1.5 rounded-full bg-primary-500 animate-pulse"></span>
              Welcome Back
            </span>
            <h2 class="mt-3 text-3xl font-extrabold text-slate-900 sm:text-4xl">Sign in to your account</h2>
            <p class="mt-2 text-sm text-slate-500">
              Don't have an account?
              <a routerLink="/register" class="font-semibold text-primary-600 hover:text-primary-700">Create one</a>
            </p>
          </div>

          <form (ngSubmit)="login()" class="mt-8 space-y-5">
            <div>
              <label for="email" class="block text-xs font-semibold uppercase tracking-wide text-slate-600 mb-1.5">Email Address</label>
              <div class="relative">
                <svg class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
                <input id="email" type="email" [(ngModel)]="loginData.email" name="email" required autocomplete="email"
                       class="input-field pl-9" placeholder="you@example.com">
              </div>
            </div>

            <div>
              <div class="mb-1.5 flex items-center justify-between">
                <label for="password" class="block text-xs font-semibold uppercase tracking-wide text-slate-600">Password</label>
                <a href="#" class="text-xs font-semibold text-primary-600 hover:text-primary-700">Forgot?</a>
              </div>
              <div class="relative">
                <svg class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                </svg>
                <input id="password" [type]="showPassword ? 'text' : 'password'" [(ngModel)]="loginData.password" name="password" required autocomplete="current-password"
                       class="input-field pl-9 pr-10" placeholder="Enter your password">
                <button type="button" (click)="showPassword = !showPassword"
                        class="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-700"
                        [attr.aria-label]="showPassword ? 'Hide password' : 'Show password'">
                  <svg *ngIf="!showPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                  <svg *ngIf="showPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.97 9.97 0 011.563-3.029m5.858.908A3 3 0 1115 12m-3-7c4.477 0 8.268 2.943 9.542 7a9.97 9.97 0 01-4.043 5.197M3 3l18 18"/>
                  </svg>
                </button>
              </div>
            </div>

            <label class="flex items-center gap-2 text-sm text-slate-600">
              <input type="checkbox" [(ngModel)]="rememberMe" name="rememberMe" class="h-4 w-4 rounded text-primary-600">
              Remember me for 30 days
            </label>

            <div *ngIf="error" class="flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
              <svg class="h-4 w-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.25"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
              <span>{{ error }}</span>
            </div>

            <button type="submit" [disabled]="loading"
                    class="inline-flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-white shadow-lg transition hover:opacity-90 disabled:opacity-60"
                    style="background: linear-gradient(135deg,#0ea5e9 0%,#6366f1 100%); box-shadow: 0 10px 25px -5px rgba(99,102,241,0.45);">
              <svg *ngIf="loading" class="h-4 w-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
              {{ loading ? 'Signing in…' : 'Sign in' }}
              <svg *ngIf="!loading" class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
            </button>

            <!-- Divider -->
            <div class="relative py-2">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-slate-200"></div>
              </div>
              <div class="relative flex justify-center">
                <span class="bg-white px-3 text-xs font-medium text-slate-500">OR CONTINUE WITH</span>
              </div>
            </div>

            <!-- Social buttons -->
            <div class="grid grid-cols-3 gap-2">
              <button type="button" class="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50">
                <svg class="h-4 w-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                Google
              </button>
              <button type="button" class="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50">
                <svg class="h-4 w-4" fill="#1877F2" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                Facebook
              </button>
              <button type="button" class="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50">
                <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
                Apple
              </button>
            </div>
          </form>

          <!-- Demo credentials hint -->
          <div class="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-3">
            <div class="flex items-start justify-between gap-3">
              <div class="min-w-0">
                <p class="text-xs font-bold uppercase tracking-wide text-amber-900">Demo Admin Key</p>
                <p class="mt-1 truncate text-xs text-amber-800">admin&#64;example.com / admin123</p>
              </div>
              <button type="button" (click)="useDemoKey()"
                      class="inline-flex flex-shrink-0 items-center gap-1 rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-bold text-white shadow-sm transition hover:bg-amber-600">
                <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
                Use demo key
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Right: Image / Marketing -->
      <div class="relative hidden lg:block">
        <img src="https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg?auto=compress&cs=tinysrgb&w=1200"
             alt="Shopping"
             class="absolute inset-0 h-full w-full object-cover">
        <div class="absolute inset-0 bg-gradient-to-br from-slate-950/90 via-indigo-950/80 to-sky-900/70"></div>
        <div class="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-sky-500/20 blur-3xl"></div>
        <div class="absolute -left-10 -bottom-10 h-80 w-80 rounded-full bg-indigo-500/20 blur-3xl"></div>

        <div class="relative flex h-full flex-col justify-between p-12 text-white">
          <a routerLink="/" class="inline-flex w-fit items-center gap-2 text-sm font-semibold text-white/80 hover:text-white transition">
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
            Back to home
          </a>

          <div>
            <div class="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-sky-100 backdrop-blur">
              <span class="h-1.5 w-1.5 rounded-full bg-sky-300 animate-pulse"></span>
              Welcome Back
            </div>
            <h3 class="mt-4 text-4xl font-extrabold leading-tight drop-shadow-lg">Shopping made simple and stylish.</h3>
            <p class="mt-3 max-w-md text-base text-slate-200 drop-shadow">
              Discover thousands of curated products, track orders, and enjoy exclusive deals — all from a single dashboard.
            </p>

            <div class="mt-8 grid grid-cols-3 gap-4">
              <div class="rounded-xl border border-white/20 bg-white/10 p-4 backdrop-blur">
                <p class="text-2xl font-extrabold">50K+</p>
                <p class="mt-1 text-[10px] font-semibold uppercase tracking-widest text-slate-300">Products</p>
              </div>
              <div class="rounded-xl border border-white/20 bg-white/10 p-4 backdrop-blur">
                <p class="text-2xl font-extrabold">30K+</p>
                <p class="mt-1 text-[10px] font-semibold uppercase tracking-widest text-slate-300">Customers</p>
              </div>
              <div class="rounded-xl border border-white/20 bg-white/10 p-4 backdrop-blur">
                <p class="text-2xl font-extrabold">4.8★</p>
                <p class="mt-1 text-[10px] font-semibold uppercase tracking-widest text-slate-300">Rated</p>
              </div>
            </div>
          </div>

          <p class="text-xs text-slate-400">&copy; {{ currentYear }} Trendify. All rights reserved.</p>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent implements OnInit {
  loginData = {
    email: '',
    password: ''
  };

  error = '';
  loading = false;
  returnUrl = '/';
  showPassword = false;
  rememberMe = false;
  readonly currentYear = new Date().getFullYear();

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/';

    if (this.authService.currentUserValue) {
      this.redirectAfterLogin(this.authService.currentUserValue.role);
    }
  }

  useDemoKey(): void {
    this.loginData.email = 'admin@example.com';
    this.loginData.password = 'admin123';
    this.error = '';
  }

  login(): void {
    if (!this.loginData.email || !this.loginData.password) {
      this.error = 'Please fill in all fields';
      return;
    }

    this.loading = true;
    this.error = '';

    this.authService.login(this.loginData.email, this.loginData.password).subscribe({
      next: (response) => {
        this.loading = false;
        this.redirectAfterLogin(response.user.role);
      },
      error: (error) => {
        this.loading = false;
        this.error = error?.error?.message || error.message || 'Login failed';
      }
    });
  }

  private redirectAfterLogin(role: 'admin' | 'user'): void {
    if (role === 'admin') {
      this.router.navigate(['/admin']);
      return;
    }

    this.router.navigateByUrl(this.returnUrl);
  }
}
