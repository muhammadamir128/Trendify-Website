import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import {
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import { bootstrapApplication } from '@angular/platform-browser';
import {
  NavigationEnd,
  provideRouter,
  Router,
  RouterOutlet,
} from '@angular/router';
import { filter } from 'rxjs/operators';

import { routes } from './app/app.routes';
import { CartToastComponent } from './app/components/cart-toast/cart-toast.component';
import { FooterComponent } from './app/components/footer/footer.component';
import { HeaderComponent } from './app/components/header/header.component';
import { InboxComponent } from './app/components/inbox/inbox.component';
import { authInterceptor } from './app/interceptors/auth.interceptor';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent, RouterOutlet, InboxComponent, CartToastComponent],
  template: `
    <div class="min-h-screen flex flex-col">
      <app-header *ngIf="!isAdminRoute && !isAuthRoute"></app-header>
      <main class="flex-1">
        <router-outlet></router-outlet>
      </main>
      <app-footer *ngIf="!isAdminRoute && !isAuthRoute"></app-footer>

      <!-- Inbox / AI assistant (public website only) -->
      <app-inbox *ngIf="!isAdminRoute && !isAuthRoute"></app-inbox>

      <!-- Cart add toast notifications -->
      <app-cart-toast *ngIf="!isAdminRoute && !isAuthRoute"></app-cart-toast>

      <!-- Scroll to top button -->
      <button type="button" (click)="scrollToTop()"
              [class.opacity-0]="!showScrollTop"
              [class.translate-y-4]="!showScrollTop"
              [class.pointer-events-none]="!showScrollTop"
              [class.opacity-100]="showScrollTop"
              aria-label="Scroll to top"
              class="fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full text-white shadow-2xl transition-all duration-300 hover:scale-110"
              style="background: linear-gradient(135deg,#0ea5e9 0%,#6366f1 100%); box-shadow: 0 10px 30px -5px rgba(99,102,241,0.6);">
        <svg class="h-5 w-5 animate-bounce-slow" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7"/>
        </svg>
      </button>
    </div>
  `,
  styles: [`
    @keyframes bounceSlow {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-3px); }
    }
    .animate-bounce-slow { animation: bounceSlow 2s ease-in-out infinite; }
  `]
})
export class App {
  isAdminRoute = false;
  isAuthRoute = false;
  showScrollTop = false;

  constructor(private router: Router) {
    this.updateRouteFlags(this.router.url);

    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => {
        this.updateRouteFlags(event.urlAfterRedirects);
      });
  }

  private updateRouteFlags(url: string): void {
    const clean = url.split('?')[0].split('#')[0];
    this.isAdminRoute = clean.startsWith('/admin');
    this.isAuthRoute = clean === '/login' || clean === '/register' || clean === '/logout';
  }

  @HostListener('window:scroll')
  onScroll(): void {
    this.showScrollTop = window.scrollY > 300;
  }

  scrollToTop(): void {
    const start = window.scrollY;
    if (start <= 0) return;

    const duration = Math.min(800, Math.max(400, start * 0.6));
    const startTime = performance.now();
    const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);

    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      window.scrollTo(0, start * (1 - easeOutCubic(progress)));
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }
}

bootstrapApplication(App, {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor]))
  ]
});
