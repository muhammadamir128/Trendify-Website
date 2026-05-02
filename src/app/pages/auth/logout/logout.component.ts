import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { User } from '../../../models/interfaces';
import { AuthService } from '../../../services/auth.service';

type State = 'confirm' | 'processing' | 'done';

@Component({
  selector: 'app-logout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-sky-900 relative flex items-center justify-center px-4">
      <div class="absolute -right-16 -top-16 h-96 w-96 rounded-full bg-sky-500/20 blur-3xl"></div>
      <div class="absolute -left-16 -bottom-16 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl"></div>
      <svg class="absolute inset-0 h-full w-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="logoutDots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="1" fill="white"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#logoutDots)"/>
      </svg>

      <div class="relative w-full max-w-lg animate-fade-in">
        <div class="overflow-hidden rounded-3xl border border-white/10 bg-white shadow-2xl">
          <!-- Accent bar (color shifts by state) -->
          <div class="h-1.5 w-full transition-all duration-500"
               [style.background]="state === 'done' ? 'linear-gradient(90deg,#10b981,#0d9488,#0ea5e9)' : 'linear-gradient(90deg,#f59e0b,#ea580c,#f43f5e)'"></div>

          <div class="p-8 sm:p-10">
            <!-- STATE: CONFIRM -->
            <div *ngIf="state === 'confirm'" class="text-center animate-fade-in">
              <div class="mx-auto flex h-20 w-20 items-center justify-center rounded-full"
                   style="background: linear-gradient(135deg,#f59e0b 0%,#ea580c 100%); box-shadow: 0 15px 40px -10px rgba(245,158,11,0.5);">
                <svg class="h-10 w-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.25">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                </svg>
              </div>

              <h1 class="mt-6 text-3xl font-extrabold text-slate-900 sm:text-4xl">
                Ready to sign out?
              </h1>
              <p class="mt-3 text-sm text-slate-500 sm:text-base">
                You will need to sign in again to access your account, cart, and order history.
              </p>

              <!-- User card -->
              <div *ngIf="user" class="mt-6 flex items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left">
                <div class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full text-white font-bold"
                     style="background: linear-gradient(135deg,#0ea5e9 0%,#6366f1 100%);">
                  {{ user.firstName.charAt(0).toUpperCase() }}{{ user.lastName.charAt(0).toUpperCase() }}
                </div>
                <div class="min-w-0 flex-1">
                  <p class="text-xs font-semibold uppercase tracking-wider text-slate-500">Signed in as</p>
                  <p class="truncate text-sm font-bold text-slate-900">{{ user.firstName }} {{ user.lastName }}</p>
                  <p class="truncate text-xs text-slate-500">{{ user.email }}</p>
                </div>
                <span class="rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                      [class.bg-amber-100]="user.role === 'admin'"
                      [class.text-amber-800]="user.role === 'admin'"
                      [class.bg-emerald-100]="user.role !== 'admin'"
                      [class.text-emerald-800]="user.role !== 'admin'">
                  {{ user.role }}
                </span>
              </div>

              <div class="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <button type="button" (click)="cancel()"
                        class="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50 transition">
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
                  </svg>
                  Cancel
                </button>
                <button type="button" (click)="confirmLogout()"
                        class="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-white shadow-lg transition hover:opacity-90"
                        style="background: linear-gradient(135deg,#f43f5e 0%,#db2777 100%); box-shadow: 0 10px 25px -5px rgba(244,63,94,0.45);">
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                  </svg>
                  Yes, Sign Out
                </button>
              </div>

              <p class="mt-5 text-xs text-slate-400">
                Tip: Press <kbd class="rounded border border-slate-300 bg-white px-1.5 py-0.5 text-[10px] font-bold">Esc</kbd> to cancel.
              </p>
            </div>

            <!-- STATE: PROCESSING -->
            <div *ngIf="state === 'processing'" class="text-center animate-fade-in">
              <div class="mx-auto flex h-20 w-20 items-center justify-center rounded-full"
                   style="background: linear-gradient(135deg,#0ea5e9 0%,#6366f1 100%); box-shadow: 0 15px 40px -10px rgba(99,102,241,0.5);">
                <svg class="h-10 w-10 animate-spin text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                </svg>
              </div>
              <h1 class="mt-6 text-3xl font-extrabold text-slate-900 sm:text-4xl">Signing you out…</h1>
              <p class="mt-3 text-sm text-slate-500">Please wait while we end your session securely.</p>
            </div>

            <!-- STATE: DONE -->
            <div *ngIf="state === 'done'" class="text-center animate-fade-in">
              <div class="mx-auto flex h-20 w-20 items-center justify-center rounded-full check-pop"
                   style="background: linear-gradient(135deg,#10b981 0%,#0d9488 100%); box-shadow: 0 15px 40px -10px rgba(16,185,129,0.5);">
                <svg class="h-10 w-10" viewBox="0 0 52 52">
                  <circle class="check-circle" cx="26" cy="26" r="24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round"/>
                  <path class="check-mark" fill="none" stroke="white" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" d="M14 27 L22 35 L38 18"/>
                </svg>
              </div>

              <h1 class="mt-6 text-3xl font-extrabold text-slate-900 sm:text-4xl">
                See you soon<span *ngIf="displayName">, {{ displayName }}</span>!
              </h1>
              <p class="mt-3 text-sm text-slate-500 sm:text-base">
                You've been signed out successfully. Thanks for shopping with
                <span class="font-bold text-slate-900">Trendify</span>!
              </p>

              <!-- Session confirmation -->
              <div class="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-left">
                <div class="flex items-start gap-3">
                  <span class="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-500 text-white shadow-sm">
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
                    </svg>
                  </span>
                  <div class="flex-1">
                    <p class="text-sm font-bold text-emerald-900">Session ended securely</p>
                    <ul class="mt-1.5 space-y-0.5 text-xs text-emerald-800">
                      <li class="flex items-center gap-1.5">
                        <svg class="h-3 w-3" fill="currentColor" viewBox="0 0 20 20"><circle cx="10" cy="10" r="3"/></svg>
                        Authentication token cleared
                      </li>
                      <li class="flex items-center gap-1.5">
                        <svg class="h-3 w-3" fill="currentColor" viewBox="0 0 20 20"><circle cx="10" cy="10" r="3"/></svg>
                        Cart &amp; wishlist saved for next visit
                      </li>
                      <li class="flex items-center gap-1.5">
                        <svg class="h-3 w-3" fill="currentColor" viewBox="0 0 20 20"><circle cx="10" cy="10" r="3"/></svg>
                        Logged out at {{ loggedOutAt }}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div class="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <a routerLink="/login"
                   class="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-white shadow-lg transition hover:opacity-90"
                   style="background: linear-gradient(135deg,#0ea5e9 0%,#6366f1 100%); box-shadow: 0 10px 25px -5px rgba(99,102,241,0.45);">
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                  </svg>
                  Sign in again
                </a>
                <a routerLink="/"
                   class="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50">
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                  </svg>
                  Continue browsing
                </a>
              </div>

              <p class="mt-5 text-xs text-slate-400">
                Redirecting to home in <span class="font-bold text-slate-700">{{ countdown }}</span>s…
                <button *ngIf="countdown > 0" (click)="stopCountdown()" class="ml-2 font-semibold text-primary-600 hover:text-primary-700 underline">Stay here</button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .check-pop {
      animation: checkPop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
    }
    @keyframes checkPop {
      0% { transform: scale(0); }
      60% { transform: scale(1.15); }
      100% { transform: scale(1); }
    }
    .check-circle {
      stroke-dasharray: 151;
      stroke-dashoffset: 151;
      animation: drawCircle 0.7s ease-out 0.2s forwards;
    }
    .check-mark {
      stroke-dasharray: 40;
      stroke-dashoffset: 40;
      animation: drawMark 0.4s cubic-bezier(0.65, 0, 0.45, 1) 0.7s forwards;
    }
    @keyframes drawCircle { to { stroke-dashoffset: 0; } }
    @keyframes drawMark { to { stroke-dashoffset: 0; } }
  `]
})
export class LogoutComponent implements OnInit, OnDestroy {
  state: State = 'confirm';
  user: User | null = null;
  displayName = '';
  loggedOutAt = '';
  countdown = 10;
  private timer: ReturnType<typeof setInterval> | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.user = this.authService.currentUserValue;
    if (!this.user) {
      this.state = 'done';
      this.loggedOutAt = this.formatTime();
      this.startRedirectCountdown();
      return;
    }
    this.displayName = this.user.firstName;

    document.addEventListener('keydown', this.onKey);
  }

  ngOnDestroy(): void {
    this.stopCountdown();
    document.removeEventListener('keydown', this.onKey);
  }

  private readonly onKey = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && this.state === 'confirm') {
      this.cancel();
    }
  };

  confirmLogout(): void {
    this.state = 'processing';
    setTimeout(() => {
      this.authService.logout();
      this.loggedOutAt = this.formatTime();
      this.state = 'done';
      this.startRedirectCountdown();
    }, 900);
  }

  cancel(): void {
    this.router.navigate(['/']);
  }

  stopCountdown(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    this.countdown = 0;
  }

  private startRedirectCountdown(): void {
    this.timer = setInterval(() => {
      this.countdown--;
      if (this.countdown <= 0) {
        this.stopCountdown();
        this.router.navigate(['/']);
      }
    }, 1000);
  }

  private formatTime(): string {
    return new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit' });
  }
}
