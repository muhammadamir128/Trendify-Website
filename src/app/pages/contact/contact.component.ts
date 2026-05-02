import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="animate-fade-in">
      <!-- Hero -->
      <section class="relative overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-sky-900 pt-16 pb-10 text-white">
        <div class="absolute -right-16 -top-16 h-72 w-72 rounded-full bg-sky-500/20 blur-3xl"></div>
        <div class="absolute -left-10 -bottom-10 h-56 w-56 rounded-full bg-indigo-500/20 blur-3xl"></div>
        <div class="container relative mx-auto px-4 text-center">
          <span class="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-sky-100">
            <span class="h-1.5 w-1.5 rounded-full bg-sky-300 animate-pulse"></span>
            Get in touch
          </span>
          <h1 class="mt-4 text-4xl font-extrabold sm:text-5xl">We would love to hear from you</h1>
          <p class="mx-auto mt-3 max-w-2xl text-base text-slate-200 sm:text-lg">
            Questions about an order, looking for a bulk deal, or just saying hi — our team usually responds within 24 hours.
          </p>
        </div>
      </section>

      <!-- Contact Info Cards -->
      <section class="relative bg-gray-50 px-4 py-10">
        <div class="container mx-auto grid max-w-6xl grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-md">
            <div class="flex h-11 w-11 items-center justify-center rounded-xl text-white shadow-md"
                 style="background: linear-gradient(135deg,#0ea5e9 0%,#0891b2 100%);">
              <svg class="h-5 w-5" fill="none" stroke="white" stroke-width="2.25" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
            </div>
            <p class="mt-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Visit us</p>
            <p class="mt-1 text-sm font-semibold text-slate-900">Trendify HQ</p>
            <p class="text-sm text-slate-600">Boat Basin, Clifton,<br>Karachi, Pakistan</p>
          </div>

          <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-md">
            <div class="flex h-11 w-11 items-center justify-center rounded-xl text-white shadow-md"
                 style="background: linear-gradient(135deg,#6366f1 0%,#1d4ed8 100%);">
              <svg class="h-5 w-5" fill="none" stroke="white" stroke-width="2.25" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
            </div>
            <p class="mt-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Email</p>
            <p class="mt-1 text-sm font-semibold text-slate-900">support&#64;trendify.com</p>
            <p class="text-sm text-slate-600">We reply within 24h</p>
          </div>

          <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-md">
            <div class="flex h-11 w-11 items-center justify-center rounded-xl text-white shadow-md"
                 style="background: linear-gradient(135deg,#10b981 0%,#0d9488 100%);">
              <svg class="h-5 w-5" fill="none" stroke="white" stroke-width="2.25" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
              </svg>
            </div>
            <p class="mt-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Phone</p>
            <p class="mt-1 text-sm font-semibold text-slate-900">+92 300 1234567</p>
            <p class="text-sm text-slate-600">Mon-Sat · 9am-7pm</p>
          </div>

          <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-md">
            <div class="flex h-11 w-11 items-center justify-center rounded-xl text-white shadow-md"
                 style="background: linear-gradient(135deg,#f43f5e 0%,#db2777 100%);">
              <svg class="h-5 w-5" fill="none" stroke="white" stroke-width="2.25" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <p class="mt-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Business Hours</p>
            <p class="mt-1 text-sm font-semibold text-slate-900">Mon - Sat</p>
            <p class="text-sm text-slate-600">9:00 AM – 7:00 PM</p>
          </div>
        </div>
      </section>

      <!-- Form + Map -->
      <section class="container mx-auto px-4 pb-14 pt-4">
        <div class="grid gap-8 lg:grid-cols-2">
          <!-- Form -->
          <div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div class="mb-6 flex items-center gap-3">
              <span class="flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-md"
                    style="background: linear-gradient(135deg,#0ea5e9 0%,#6366f1 100%);">
                <svg class="h-5 w-5" fill="none" stroke="white" stroke-width="2.25" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/>
                </svg>
              </span>
              <div>
                <h2 class="text-xl font-bold text-slate-900">Send us a message</h2>
                <p class="text-sm text-slate-500">We will get back to you as soon as we can.</p>
              </div>
            </div>

            <div *ngIf="submitted" class="mb-5 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
              <svg class="h-5 w-5 flex-shrink-0 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <div>
                <p class="text-sm font-semibold text-emerald-800">Message sent successfully</p>
                <p class="text-xs text-emerald-700">Thanks for reaching out, {{ form.name }}. We'll respond to {{ form.email }} shortly.</p>
              </div>
            </div>

            <form (ngSubmit)="submit()" class="space-y-4">
              <div class="grid gap-4 sm:grid-cols-2">
                <div>
                  <label class="block text-xs font-semibold uppercase tracking-wide text-slate-600 mb-1.5">Your Name <span class="text-rose-500">*</span></label>
                  <input [(ngModel)]="form.name" name="name" required class="input-field" placeholder="Your full name">
                </div>
                <div>
                  <label class="block text-xs font-semibold uppercase tracking-wide text-slate-600 mb-1.5">Email <span class="text-rose-500">*</span></label>
                  <input [(ngModel)]="form.email" name="email" type="email" required class="input-field" placeholder="you@example.com">
                </div>
              </div>

              <div>
                <label class="block text-xs font-semibold uppercase tracking-wide text-slate-600 mb-1.5">Subject</label>
                <input [(ngModel)]="form.subject" name="subject" class="input-field" placeholder="What is it about?">
              </div>

              <div>
                <label class="block text-xs font-semibold uppercase tracking-wide text-slate-600 mb-1.5">Message <span class="text-rose-500">*</span></label>
                <textarea [(ngModel)]="form.message" name="message" required rows="5" class="input-field resize-none" placeholder="Tell us a little more…"></textarea>
              </div>

              <div *ngIf="error" class="rounded-lg bg-rose-50 border border-rose-200 px-4 py-2 text-sm text-rose-700">
                {{ error }}
              </div>

              <button type="submit" [disabled]="loading"
                      class="inline-flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:opacity-90 disabled:opacity-60"
                      style="background: linear-gradient(135deg,#0ea5e9 0%,#6366f1 100%); box-shadow: 0 10px 20px -5px rgba(99,102,241,0.45);">
                <svg class="h-4 w-4" [class.animate-spin]="loading" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                  <path *ngIf="!loading" stroke-linecap="round" stroke-linejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
                  <path *ngIf="loading" stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                </svg>
                {{ loading ? 'Sending…' : 'Send Message' }}
              </button>
            </form>
          </div>

          <!-- Map + Side Info -->
          <div class="space-y-4">
            <div class="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div class="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                <div class="flex items-center gap-3">
                  <span class="flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-md"
                        style="background: linear-gradient(135deg,#10b981 0%,#0d9488 100%);">
                    <svg class="h-5 w-5" fill="none" stroke="white" stroke-width="2.25" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                  </span>
                  <div>
                    <h3 class="text-base font-bold text-slate-900">Find us on the map</h3>
                    <p class="text-xs text-slate-500">Boat Basin, Clifton, Karachi</p>
                  </div>
                </div>
                <a [href]="directionsUrl" target="_blank" rel="noopener"
                   class="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition">
                  Directions
                  <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                  </svg>
                </a>
              </div>
              <iframe
                [src]="mapUrl"
                class="h-80 w-full"
                style="border:0;"
                loading="lazy"
                referrerpolicy="no-referrer-when-downgrade"
                title="Trendify HQ location"></iframe>
            </div>

            <!-- Social / FAQ -->
            <div class="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-6 shadow-sm">
              <h3 class="text-base font-bold text-slate-900">Prefer self-service?</h3>
              <p class="mt-1 text-sm text-slate-500">Browse our product catalog or check order status from your account.</p>
              <div class="mt-4 grid grid-cols-2 gap-3">
                <a routerLink="/products" class="group rounded-xl border border-slate-200 bg-white p-4 transition hover:border-sky-300 hover:shadow-md">
                  <p class="text-xs font-semibold uppercase tracking-wider text-sky-600">Shop</p>
                  <p class="mt-1 text-sm font-semibold text-slate-900 group-hover:text-sky-700">Browse Products →</p>
                </a>
                <a routerLink="/orders" class="group rounded-xl border border-slate-200 bg-white p-4 transition hover:border-indigo-300 hover:shadow-md">
                  <p class="text-xs font-semibold uppercase tracking-wider text-indigo-600">Orders</p>
                  <p class="mt-1 text-sm font-semibold text-slate-900 group-hover:text-indigo-700">Track Orders →</p>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  `
})
export class ContactComponent {
  form = {
    name: '',
    email: '',
    subject: '',
    message: ''
  };

  loading = false;
  submitted = false;
  error = '';

  mapUrl: SafeResourceUrl;
  readonly directionsUrl = 'https://www.google.com/maps/dir/?api=1&destination=24.8146,67.0303';

  constructor(private sanitizer: DomSanitizer) {
    const bbox = '67.0203,24.8096,67.0403,24.8196';
    const marker = '24.8146,67.0303';
    const raw = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${marker}`;
    this.mapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(raw);
  }

  submit(): void {
    this.error = '';
    if (!this.form.name.trim() || !this.form.email.trim() || !this.form.message.trim()) {
      this.error = 'Please fill in your name, email, and message.';
      return;
    }
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.form.email.trim());
    if (!emailOk) {
      this.error = 'Please enter a valid email address.';
      return;
    }

    this.loading = true;
    setTimeout(() => {
      this.loading = false;
      this.submitted = true;
      this.form = { name: this.form.name, email: this.form.email, subject: '', message: '' };
    }, 800);
  }
}
