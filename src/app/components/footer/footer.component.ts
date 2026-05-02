import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <footer class="relative mt-16 overflow-hidden bg-slate-950 text-slate-200">
      <!-- Gradient top border -->
      <div class="h-1 w-full" style="background: linear-gradient(90deg,#0ea5e9 0%,#6366f1 50%,#a855f7 100%);"></div>

      <!-- Decorative blurs -->
      <div class="pointer-events-none absolute -top-24 -right-24 h-80 w-80 rounded-full bg-sky-500/10 blur-3xl"></div>
      <div class="pointer-events-none absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-indigo-500/10 blur-3xl"></div>

      <!-- Newsletter CTA -->
      <div class="relative border-b border-white/10">
        <div class="container mx-auto px-4 py-10">
          <div class="flex flex-col items-start justify-between gap-6 rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-6 backdrop-blur md:flex-row md:items-center md:p-8">
            <div class="flex-1">
              <div class="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">
                <span class="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Newsletter
              </div>
              <h3 class="mt-3 text-2xl font-bold text-white sm:text-3xl">Stay in the loop</h3>
              <p class="mt-1 text-sm text-slate-400">Get exclusive deals, product drops, and 10% off your first order.</p>
            </div>
            <form class="flex w-full max-w-md flex-col gap-2 sm:flex-row" (submit)="subscribe($event)">
              <input [(ngModel)]="emailInput" name="email" type="email" required placeholder="Enter your email"
                     class="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-400 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-400/30 transition">
              <button type="submit"
                      class="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-white shadow-lg transition hover:opacity-90"
                      style="background: linear-gradient(135deg,#0ea5e9 0%,#6366f1 100%);">
                Subscribe
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
              </button>
            </form>
          </div>
          <p *ngIf="subscribed" class="mt-3 text-center text-sm font-semibold text-emerald-300">✓ Thanks for subscribing! Check your inbox for our welcome offer.</p>
        </div>
      </div>

      <!-- Main footer content -->
      <div class="container mx-auto px-4 py-14">
        <div class="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-5">
          <!-- Brand + social -->
          <div class="lg:col-span-2">
            <a routerLink="/" class="inline-flex items-center gap-2.5">
              <span class="relative flex h-11 w-11 items-center justify-center rounded-2xl text-white shadow-lg"
                    style="background: linear-gradient(135deg,#0ea5e9 0%,#6366f1 100%); box-shadow: 0 8px 20px -4px rgba(99,102,241,0.5);">
                <svg class="h-6 w-6" viewBox="0 0 100 100" fill="white">
                  <path d="M24 34h52v11H58v30H42V45H24z"/>
                </svg>
                <span class="absolute -right-1 -top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full border-2 border-slate-950"
                      style="background: #fbbf24;">
                  <span class="h-1 w-1 rounded-full bg-white"></span>
                </span>
              </span>
              <span class="text-2xl font-extrabold tracking-tight text-white leading-none">Trendify</span>
            </a>
            <p class="mt-4 max-w-sm text-sm leading-relaxed text-slate-400">
              Your one-stop destination for quality products at amazing prices — handpicked styles delivered to your door.
            </p>

            <!-- Social -->
            <div class="mt-6">
              <p class="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Follow us</p>
              <div class="flex flex-wrap gap-2">
                <!-- WhatsApp -->
                <a href="https://wa.me/923001234567" target="_blank" rel="noopener" aria-label="WhatsApp"
                   class="group flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 transition hover:border-emerald-400/50 hover:bg-emerald-500/15 hover:text-emerald-300 hover:scale-110">
                  <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 448 512">
                    <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
                  </svg>
                </a>

                <!-- Instagram -->
                <a href="https://instagram.com" target="_blank" rel="noopener" aria-label="Instagram"
                   class="group flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 transition hover:border-pink-400/50 hover:bg-pink-500/15 hover:text-pink-300 hover:scale-110">
                  <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>

                <!-- Facebook -->
                <a href="https://facebook.com" target="_blank" rel="noopener" aria-label="Facebook"
                   class="group flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 transition hover:border-blue-400/50 hover:bg-blue-500/15 hover:text-blue-300 hover:scale-110">
                  <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>

                <!-- LinkedIn -->
                <a href="https://linkedin.com" target="_blank" rel="noopener" aria-label="LinkedIn"
                   class="group flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 transition hover:border-sky-400/50 hover:bg-sky-500/15 hover:text-sky-300 hover:scale-110">
                  <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 448 512">
                    <path d="M416 32H31.9C14.3 32 0 46.5 0 64.3v383.4C0 465.5 14.3 480 31.9 480H416c17.6 0 32-14.5 32-32.3V64.3c0-17.8-14.4-32.3-32-32.3zM135.4 416H69V202.2h66.5V416zm-33.2-243c-21.3 0-38.5-17.3-38.5-38.5S80.9 96 102.2 96c21.2 0 38.5 17.3 38.5 38.5 0 21.3-17.2 38.5-38.5 38.5zm282.1 243h-66.4V312c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9V416h-66.4V202.2h63.7v29.2h.9c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9V416z"/>
                  </svg>
                </a>

                <!-- X (Twitter) -->
                <a href="https://x.com" target="_blank" rel="noopener" aria-label="X"
                   class="group flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 transition hover:border-white/40 hover:bg-white/10 hover:text-white hover:scale-110">
                  <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
              </div>
            </div>

            <!-- Payment methods -->
            <div class="mt-6">
              <p class="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">We accept</p>
              <div class="flex flex-wrap gap-2">
                <span *ngFor="let pm of paymentMethods" class="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] font-bold tracking-wider text-slate-300">
                  {{ pm }}
                </span>
              </div>
            </div>
          </div>

          <!-- Quick Links -->
          <div>
            <h4 class="mb-4 text-sm font-bold uppercase tracking-[0.15em] text-white">Shop</h4>
            <ul class="space-y-2.5 text-sm">
              <li><a routerLink="/" class="group inline-flex items-center gap-1.5 text-slate-400 transition hover:text-white">
                <svg class="h-0 w-0 text-sky-400 transition-all group-hover:h-3 group-hover:w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
                Home
              </a></li>
              <li><a routerLink="/products" class="group inline-flex items-center gap-1.5 text-slate-400 transition hover:text-white">
                <svg class="h-0 w-0 text-sky-400 transition-all group-hover:h-3 group-hover:w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
                Products
              </a></li>
              <li><a routerLink="/cart" class="group inline-flex items-center gap-1.5 text-slate-400 transition hover:text-white">
                <svg class="h-0 w-0 text-sky-400 transition-all group-hover:h-3 group-hover:w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
                Cart
              </a></li>
              <li><a routerLink="/wishlist" class="group inline-flex items-center gap-1.5 text-slate-400 transition hover:text-white">
                <svg class="h-0 w-0 text-sky-400 transition-all group-hover:h-3 group-hover:w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
                Wishlist
              </a></li>
            </ul>
          </div>

          <!-- Customer Service -->
          <div>
            <h4 class="mb-4 text-sm font-bold uppercase tracking-[0.15em] text-white">Support</h4>
            <ul class="space-y-2.5 text-sm">
              <li><a routerLink="/contact" class="group inline-flex items-center gap-1.5 text-slate-400 transition hover:text-white">
                <svg class="h-0 w-0 text-sky-400 transition-all group-hover:h-3 group-hover:w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
                Contact Us
              </a></li>
              <li><a routerLink="/orders" class="group inline-flex items-center gap-1.5 text-slate-400 transition hover:text-white">
                <svg class="h-0 w-0 text-sky-400 transition-all group-hover:h-3 group-hover:w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
                Track Orders
              </a></li>
              <li><a href="#" class="group inline-flex items-center gap-1.5 text-slate-400 transition hover:text-white">
                <svg class="h-0 w-0 text-sky-400 transition-all group-hover:h-3 group-hover:w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
                Shipping Info
              </a></li>
              <li><a href="#" class="group inline-flex items-center gap-1.5 text-slate-400 transition hover:text-white">
                <svg class="h-0 w-0 text-sky-400 transition-all group-hover:h-3 group-hover:w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
                Returns
              </a></li>
              <li><a href="#" class="group inline-flex items-center gap-1.5 text-slate-400 transition hover:text-white">
                <svg class="h-0 w-0 text-sky-400 transition-all group-hover:h-3 group-hover:w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
                FAQ
              </a></li>
            </ul>
          </div>

          <!-- Contact -->
          <div>
            <h4 class="mb-4 text-sm font-bold uppercase tracking-[0.15em] text-white">Contact</h4>
            <ul class="space-y-3 text-sm">
              <li class="flex items-start gap-2">
                <span class="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-sky-500/10 text-sky-400">
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                </span>
                <span class="text-slate-400">Boat Basin, Clifton,<br>Karachi, Pakistan</span>
              </li>
              <li class="flex items-center gap-2">
                <span class="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                </span>
                <a href="mailto:support@trendify.com" class="text-slate-400 hover:text-white transition">support&#64;trendify.com</a>
              </li>
              <li class="flex items-center gap-2">
                <span class="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                </span>
                <a href="tel:+923001234567" class="text-slate-400 hover:text-white transition">+92 300 1234567</a>
              </li>
            </ul>
          </div>
        </div>

        <!-- Bottom bar -->
        <div class="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 md:flex-row">
          <p class="text-xs text-slate-500">
            &copy; {{ currentYear }} Trendify. All rights reserved. Crafted with <span class="text-rose-400">♥</span> in Karachi.
          </p>
          <div class="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs">
            <a href="#" class="text-slate-500 hover:text-white transition">Privacy Policy</a>
            <span class="h-3 w-px bg-white/10"></span>
            <a href="#" class="text-slate-500 hover:text-white transition">Terms of Service</a>
            <span class="h-3 w-px bg-white/10"></span>
            <a href="#" class="text-slate-500 hover:text-white transition">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  `
})
export class FooterComponent {
  emailInput = '';
  subscribed = false;
  readonly currentYear = new Date().getFullYear();

  readonly paymentMethods = ['VISA', 'MASTERCARD', 'AMEX', 'PAYPAL', 'APPLE PAY'];

  readonly socials = [
    {
      name: 'Twitter',
      url: '#',
      svg: `<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>`
    },
    {
      name: 'LinkedIn',
      url: '#',
      svg: `<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 448 512"><path d="M416 32H31.9C14.3 32 0 46.5 0 64.3v383.4C0 465.5 14.3 480 31.9 480H416c17.6 0 32-14.5 32-32.3V64.3c0-17.8-14.4-32.3-32-32.3zM135.4 416H69V202.2h66.5V416zm-33.2-243c-21.3 0-38.5-17.3-38.5-38.5S80.9 96 102.2 96c21.2 0 38.5 17.3 38.5 38.5 0 21.3-17.2 38.5-38.5 38.5zm282.1 243h-66.4V312c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9V416h-66.4V202.2h63.7v29.2h.9c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9V416z"/></svg>`
    },
    {
      name: 'Instagram',
      url: '#',
      svg: `<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>`
    },
    {
      name: 'WhatsApp',
      url: '#',
      svg: `<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 448 512"><path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/></svg>`
    }
  ];

  subscribe(event: Event): void {
    event.preventDefault();
    if (!this.emailInput.trim()) return;
    this.subscribed = true;
    this.emailInput = '';
    setTimeout(() => this.subscribed = false, 4000);
  }
}
