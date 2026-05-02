import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  ActivatedRoute,
  RouterModule,
} from '@angular/router';

import { Order, Product } from '../../../models/interfaces';
import { DataService } from '../../../services/data.service';

@Component({
  selector: 'app-checkout-thank-you',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="relative min-h-[calc(100vh-4rem)] overflow-hidden bg-gradient-to-br from-emerald-50 via-sky-50 to-indigo-50">
      <!-- Confetti canvas -->
      <canvas #confettiCanvas class="pointer-events-none absolute inset-0 h-full w-full"></canvas>

      <!-- Decorative blurs -->
      <div class="pointer-events-none absolute -right-20 -top-20 h-96 w-96 rounded-full bg-emerald-400/20 blur-3xl"></div>
      <div class="pointer-events-none absolute -left-20 -bottom-20 h-96 w-96 rounded-full bg-sky-400/20 blur-3xl"></div>

      <div class="relative container mx-auto px-4 py-10 animate-fade-in">
        <!-- Success card -->
        <div class="mx-auto max-w-3xl overflow-hidden rounded-3xl border border-white bg-white shadow-2xl">
          <!-- Accent bar -->
          <div class="h-2 w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-500"></div>

          <div class="p-8 text-center sm:p-12">
            <!-- Animated check -->
            <div class="mx-auto flex h-24 w-24 items-center justify-center rounded-full check-pop"
                 style="background: linear-gradient(135deg,#10b981 0%,#0d9488 100%); box-shadow: 0 20px 40px -10px rgba(16,185,129,0.5);">
              <svg class="h-14 w-14" viewBox="0 0 52 52">
                <circle class="check-circle" cx="26" cy="26" r="24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round"/>
                <path class="check-mark" fill="none" stroke="white" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" d="M14 27 L22 35 L38 18"/>
              </svg>
            </div>

            <div class="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
              <span class="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Order Confirmed
            </div>

            <h1 class="mt-3 text-3xl font-extrabold text-slate-900 sm:text-4xl">
              Thank you<span *ngIf="firstName">, {{ firstName }}</span>!
            </h1>
            <p class="mx-auto mt-2 max-w-lg text-sm text-slate-500 sm:text-base">
              Your order has been placed successfully. We've sent a confirmation email to
              <span *ngIf="customerEmail" class="font-semibold text-slate-800">{{ customerEmail }}</span>
              <span *ngIf="!customerEmail" class="font-semibold text-slate-800">your inbox</span>.
            </p>

            <!-- Order ID pill -->
            <div *ngIf="orderId" class="mt-5 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2">
              <span class="text-[10px] font-semibold uppercase tracking-widest text-slate-500">Order ID</span>
              <span class="font-mono text-sm font-bold text-slate-900">#{{ orderId }}</span>
              <button type="button" (click)="copyOrderId()" aria-label="Copy order ID"
                      class="ml-1 inline-flex h-6 w-6 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-200 hover:text-slate-900">
                <svg *ngIf="!copied" class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                </svg>
                <svg *ngIf="copied" class="h-3.5 w-3.5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Delivery timeline -->
          <div class="border-t border-slate-100 bg-slate-50/60 px-8 py-8 sm:px-12">
            <h3 class="text-center text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Order Progress</h3>
            <div class="relative mt-6">
              <!-- Progress line -->
              <div class="absolute left-0 right-0 top-5 h-0.5 bg-slate-200"></div>
              <div class="absolute left-0 top-5 h-0.5 transition-all duration-[2000ms] ease-out"
                   [style.width.%]="progressWidth"
                   style="background: linear-gradient(90deg,#10b981,#0d9488);"></div>

              <div class="relative grid grid-cols-4 gap-2">
                <div *ngFor="let step of steps; let i = index" class="flex flex-col items-center text-center">
                  <div class="flex h-10 w-10 items-center justify-center rounded-full border-4 transition-all duration-500"
                       [class.border-white]="i <= activeStep"
                       [class.border-slate-200]="i > activeStep"
                       [style.background]="i <= activeStep ? 'linear-gradient(135deg,#10b981,#0d9488)' : 'white'"
                       [style.box-shadow]="i <= activeStep ? '0 8px 20px -4px rgba(16,185,129,0.5)' : 'none'">
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"
                         [class.text-white]="i <= activeStep"
                         [class.text-slate-400]="i > activeStep">
                      <path *ngIf="i === 0" stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
                      <path *ngIf="i === 1" stroke-linecap="round" stroke-linejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                      <path *ngIf="i === 2" stroke-linecap="round" stroke-linejoin="round" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0zM13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1"/>
                      <path *ngIf="i === 3" stroke-linecap="round" stroke-linejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"/>
                    </svg>
                  </div>
                  <p class="mt-2 text-[11px] font-bold uppercase tracking-wider"
                     [class.text-slate-900]="i <= activeStep"
                     [class.text-slate-400]="i > activeStep">{{ step.title }}</p>
                  <p class="text-[10px] text-slate-500 hidden sm:block">{{ step.date }}</p>
                </div>
              </div>
            </div>
            <p class="mt-6 text-center text-xs text-slate-500">
              Estimated delivery: <span class="font-semibold text-slate-800">{{ estimatedDelivery }}</span>
            </p>
          </div>
        </div>

        <!-- Order summary -->
        <div *ngIf="order" class="mx-auto mt-6 max-w-3xl grid gap-6 lg:grid-cols-[1fr_320px]">
          <div class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div class="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h3 class="text-base font-bold text-slate-900">Order Summary</h3>
              <button type="button" (click)="printReceipt()"
                      class="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition">
                <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
                Print Receipt
              </button>
            </div>
            <div class="divide-y divide-slate-100">
              <div *ngFor="let item of order.items" class="flex items-center gap-3 p-4">
                <img *ngIf="getProduct(item.productId)?.images?.[0]" [src]="getProduct(item.productId)?.images?.[0]"
                     [alt]="getProduct(item.productId)?.name"
                     class="h-14 w-14 flex-shrink-0 rounded-lg object-cover">
                <div class="min-w-0 flex-1">
                  <p class="truncate text-sm font-semibold text-slate-900">{{ getProduct(item.productId)?.name || 'Product' }}</p>
                  <p class="text-xs text-slate-500">Qty {{ item.quantity }} · \${{ item.price }}</p>
                </div>
                <p class="text-sm font-bold text-slate-900">\${{ (item.price * item.quantity).toFixed(2) }}</p>
              </div>
            </div>
            <div class="space-y-1 border-t border-slate-100 bg-slate-50/60 p-4 text-sm">
              <div class="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span class="font-semibold text-slate-900">\${{ subtotal.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between text-slate-600">
                <span>Shipping</span>
                <span class="font-semibold" [class.text-emerald-600]="shippingCost === 0" [class.text-slate-900]="shippingCost !== 0">
                  {{ shippingCost === 0 ? 'FREE' : '$' + shippingCost.toFixed(2) }}
                </span>
              </div>
              <div class="flex justify-between text-slate-600">
                <span>Tax</span>
                <span class="font-semibold text-slate-900">\${{ taxCost.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between border-t border-slate-200 pt-2 mt-2">
                <span class="font-bold text-slate-900">Total Paid</span>
                <span class="text-lg font-extrabold text-emerald-600">\${{ order.total.toFixed(2) }}</span>
              </div>
            </div>
          </div>

          <!-- Side info -->
          <div class="space-y-4">
            <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div class="flex items-center gap-2">
                <svg class="h-4 w-4 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                <h4 class="text-xs font-bold uppercase tracking-wider text-slate-700">Shipping To</h4>
              </div>
              <div class="mt-3 text-sm text-slate-700 space-y-0.5">
                <p class="font-semibold">{{ order.shippingAddress?.street }}</p>
                <p>{{ order.shippingAddress?.city }}, {{ order.shippingAddress?.state }} {{ order.shippingAddress?.zipCode }}</p>
                <p>{{ order.shippingAddress?.country }}</p>
              </div>
            </div>

            <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div class="flex items-center gap-2">
                <svg class="h-4 w-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 10h18M5 6h14a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2z"/></svg>
                <h4 class="text-xs font-bold uppercase tracking-wider text-slate-700">Payment</h4>
              </div>
              <p class="mt-3 text-sm font-semibold capitalize text-slate-800">{{ (order.paymentMethod || '').replace('-', ' ') }}</p>
              <p class="text-xs text-slate-500">Charged securely</p>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="mx-auto mt-6 max-w-3xl flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row">
          <a routerLink="/orders"
             class="inline-flex flex-1 items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-white shadow-lg transition hover:opacity-90"
             style="background: linear-gradient(135deg,#0ea5e9 0%,#6366f1 100%); box-shadow: 0 10px 25px -5px rgba(99,102,241,0.45);">
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
            View My Orders
          </a>
          <a routerLink="/products"
             class="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50 transition">
            Continue Shopping
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
          </a>
        </div>

        <p class="mt-6 text-center text-xs text-slate-500">
          Need help? <a routerLink="/contact" class="font-semibold text-primary-600 hover:text-primary-700">Contact support</a> with your order ID.
        </p>
      </div>
    </div>
  `,
  styles: [`
    /* Animated checkmark */
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
    @keyframes drawCircle {
      to { stroke-dashoffset: 0; }
    }
    @keyframes drawMark {
      to { stroke-dashoffset: 0; }
    }
  `]
})
export class CheckoutThankYouComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('confettiCanvas') confettiCanvas?: ElementRef<HTMLCanvasElement>;

  orderId = '';
  order: Order | null = null;
  products: Product[] = [];
  firstName = '';
  customerEmail = '';
  copied = false;

  activeStep = 0;
  progressWidth = 0;
  subtotal = 0;
  shippingCost = 0;
  taxCost = 0;

  steps = [
    { title: 'Placed', date: 'Today' },
    { title: 'Processing', date: 'Tomorrow' },
    { title: 'Shipped', date: 'In 2-3 days' },
    { title: 'Delivered', date: 'In 5-7 days' }
  ];
  estimatedDelivery = '';

  private animationFrame: number | null = null;
  private progressTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(
    private route: ActivatedRoute,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    this.orderId = this.route.snapshot.queryParamMap.get('orderId') || '';
    this.computeEstimatedDelivery();

    this.dataService.getProducts().subscribe(products => {
      this.products = products;
    });

    if (this.orderId) {
      this.dataService.getMyOrders().subscribe({
        next: (orders) => {
          const match = orders.find(o => o.id === this.orderId);
          if (match) {
            this.order = match;
            this.firstName = match.customer?.firstName || '';
            this.customerEmail = match.customer?.email || '';
            this.computeTotals(match);
          }
        },
        error: () => {}
      });
    }

    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    this.progressTimer = setTimeout(() => {
      this.progressWidth = 25;
    }, 300);
  }

  ngAfterViewInit(): void {
    this.launchConfetti();
  }

  ngOnDestroy(): void {
    if (this.animationFrame !== null) cancelAnimationFrame(this.animationFrame);
    if (this.progressTimer) clearTimeout(this.progressTimer);
  }

  getProduct(productId: string): Product | undefined {
    return this.products.find(p => p.id === productId);
  }

  copyOrderId(): void {
    if (!this.orderId) return;
    const text = `#${this.orderId}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        this.copied = true;
        setTimeout(() => this.copied = false, 2000);
      });
    }
  }

  printReceipt(): void {
    if (typeof window !== 'undefined') window.print();
  }

  private computeEstimatedDelivery(): void {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    this.estimatedDelivery = d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  }

  private computeTotals(order: Order): void {
    this.subtotal = order.items.reduce((s, i) => s + i.price * i.quantity, 0);
    this.shippingCost = this.subtotal >= 50 ? 0 : 9.99;
    this.taxCost = Math.max(0, order.total - this.subtotal - this.shippingCost);
  }

  private launchConfetti(): void {
    const canvas = this.confettiCanvas?.nativeElement;
    if (!canvas || typeof window === 'undefined') return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const colors = ['#10b981', '#0ea5e9', '#6366f1', '#a855f7', '#ec4899', '#f59e0b', '#f43f5e'];
    const count = 140;

    interface Particle {
      x: number;
      y: number;
      size: number;
      speedY: number;
      speedX: number;
      rotation: number;
      rotationSpeed: number;
      color: string;
      opacity: number;
      shape: 'rect' | 'circle';
    }

    const particles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      particles.push({
        x: canvas.width / 2 + (Math.random() - 0.5) * 200,
        y: -20,
        size: Math.random() * 8 + 4,
        speedY: Math.random() * 3 + 2,
        speedX: (Math.random() - 0.5) * 4,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: 1,
        shape: Math.random() > 0.5 ? 'rect' : 'circle'
      });
    }

    let elapsed = 0;
    const maxLife = 4500;
    let startTime: number | null = null;

    const animate = (time: number) => {
      if (startTime === null) startTime = time;
      elapsed = time - startTime;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.speedY += 0.1;
        p.rotation += p.rotationSpeed;
        p.opacity = Math.max(0, 1 - elapsed / maxLife);

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;
        if (p.shape === 'rect') {
          ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      });

      if (elapsed < maxLife) {
        this.animationFrame = requestAnimationFrame(animate);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        window.removeEventListener('resize', resize);
      }
    };

    this.animationFrame = requestAnimationFrame(animate);
  }
}
