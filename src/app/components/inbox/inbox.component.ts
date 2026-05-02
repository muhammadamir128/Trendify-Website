import { CommonModule } from '@angular/common';
import {
  AfterViewChecked,
  Component,
  ElementRef,
  HostListener,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

interface ChatMessage {
  role: 'bot' | 'user';
  text: string;
  time: string;
  chips?: { label: string; action: string }[];
}

@Component({
  selector: 'app-inbox',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <!-- Mobile backdrop (only visible when chat is open on small screens) -->
    <div *ngIf="isOpen" (click)="close()"
         class="fixed inset-0 z-[55] bg-slate-900/40 backdrop-blur-sm sm:hidden animate-fade-in"
         aria-hidden="true"></div>

    <!-- Floating trigger -->
    <button type="button" (click)="toggle()" [attr.aria-label]="isOpen ? 'Close chat' : 'Open chat'"
            class="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-[70] flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full text-white shadow-2xl transition-all duration-300 hover:scale-110"
            [class.rotate-90]="isOpen"
            style="background: linear-gradient(135deg,#6366f1 0%,#a855f7 100%); box-shadow: 0 15px 35px -5px rgba(99,102,241,0.55);">
      <svg *ngIf="!isOpen" class="h-5 w-5 sm:h-6 sm:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.25">
        <path stroke-linecap="round" stroke-linejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/>
      </svg>
      <svg *ngIf="isOpen" class="h-5 w-5 sm:h-6 sm:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.25">
        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
      </svg>
      <span *ngIf="!isOpen && !hasInteracted"
            class="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white ring-2 ring-white">
        <span class="absolute h-full w-full animate-ping rounded-full bg-rose-400"></span>
        <span class="relative">1</span>
      </span>
    </button>

    <!-- Chat panel -->
    <div *ngIf="isOpen"
         class="chat-panel fixed z-[60] animate-chat-in
                inset-x-3 bottom-[calc(4rem+env(safe-area-inset-bottom))]
                sm:inset-x-auto sm:left-6 sm:right-auto sm:bottom-24 sm:w-[380px]"
         role="dialog" aria-labelledby="inboxTitle">
      <div class="chat-panel-inner flex flex-col overflow-hidden rounded-3xl border border-white bg-white shadow-2xl">
        <!-- Header -->
        <div class="relative overflow-hidden" style="background: linear-gradient(135deg,#6366f1 0%,#a855f7 100%);">
          <div class="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-2xl"></div>
          <div class="relative flex items-center justify-between gap-3 p-4 text-white">
            <div class="flex items-center gap-3">
              <div class="relative flex h-11 w-11 items-center justify-center rounded-full bg-white/15 backdrop-blur">
                <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.25">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                </svg>
                <span class="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full border-2 border-white"
                      style="background: #10b981;">
                  <span class="h-1.5 w-1.5 rounded-full bg-white animate-pulse"></span>
                </span>
              </div>
              <div>
                <h3 id="inboxTitle" class="text-sm font-bold">Trendify Assistant</h3>
                <p class="text-[11px] text-purple-100 flex items-center gap-1">
                  <span class="h-1.5 w-1.5 rounded-full bg-emerald-300 animate-pulse"></span>
                  Online · Typically replies in seconds
                </p>
              </div>
            </div>
            <div class="flex items-center gap-1">
              <button type="button" (click)="resetChat()" aria-label="Reset chat"
                      class="flex h-8 w-8 items-center justify-center rounded-full text-white/80 hover:bg-white/20 hover:text-white transition">
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.25">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                </svg>
              </button>
              <button type="button" (click)="close()" aria-label="Close chat"
                      class="flex h-8 w-8 items-center justify-center rounded-full text-white/80 hover:bg-white/20 hover:text-white transition">
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.25">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Messages -->
        <div #messagesBox class="flex-1 space-y-3 overflow-y-auto bg-gradient-to-b from-slate-50 to-white p-4">
          <div *ngFor="let msg of messages; let i = index"
               [class.justify-end]="msg.role === 'user'"
               class="flex gap-2 animate-fade-in"
               [style.animation-delay]="i < messages.length - 2 ? '0s' : '0.1s'">
            <!-- Bot avatar -->
            <div *ngIf="msg.role === 'bot'"
                 class="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-white"
                 style="background: linear-gradient(135deg,#6366f1 0%,#a855f7 100%);">
              <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
              </svg>
            </div>

            <div class="max-w-[78%]">
              <div class="rounded-2xl px-3.5 py-2 text-sm leading-relaxed shadow-sm"
                   [class.bg-white]="msg.role === 'bot'"
                   [class.text-slate-800]="msg.role === 'bot'"
                   [class.rounded-tl-sm]="msg.role === 'bot'"
                   [class.text-white]="msg.role === 'user'"
                   [class.rounded-tr-sm]="msg.role === 'user'"
                   [class.ml-auto]="msg.role === 'user'"
                   [style.background]="msg.role === 'user' ? 'linear-gradient(135deg,#6366f1 0%,#a855f7 100%)' : ''"
                   [style.border]="msg.role === 'bot' ? '1px solid #e2e8f0' : 'none'"
                   [innerHTML]="msg.text"></div>

              <!-- Suggested chips -->
              <div *ngIf="msg.chips && msg.chips.length > 0" class="mt-2 flex flex-wrap gap-1.5">
                <button *ngFor="let chip of msg.chips" type="button" (click)="handleChip(chip)"
                        class="rounded-full border border-primary-200 bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700 transition hover:bg-primary-100">
                  {{ chip.label }}
                </button>
              </div>

              <p class="mt-1 text-[10px] text-slate-400"
                 [class.text-right]="msg.role === 'user'">{{ msg.time }}</p>
            </div>

            <!-- User avatar -->
            <div *ngIf="msg.role === 'user'"
                 class="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-slate-200 text-xs font-bold text-slate-700">
              You
            </div>
          </div>

          <!-- Typing indicator -->
          <div *ngIf="typing" class="flex gap-2 animate-fade-in">
            <div class="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-white"
                 style="background: linear-gradient(135deg,#6366f1 0%,#a855f7 100%);">
              <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
              </svg>
            </div>
            <div class="rounded-2xl rounded-tl-sm border border-slate-200 bg-white px-3.5 py-2.5 shadow-sm">
              <div class="flex items-center gap-1">
                <span class="h-2 w-2 rounded-full bg-slate-400 animate-typing" style="animation-delay: 0s"></span>
                <span class="h-2 w-2 rounded-full bg-slate-400 animate-typing" style="animation-delay: 0.15s"></span>
                <span class="h-2 w-2 rounded-full bg-slate-400 animate-typing" style="animation-delay: 0.3s"></span>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick chips (when no conversation) -->
        <div *ngIf="messages.length <= 1 && !typing" class="border-t border-slate-100 bg-white px-4 py-3">
          <p class="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">Popular questions</p>
          <div class="flex flex-wrap gap-1.5">
            <button *ngFor="let topic of quickTopics" type="button" (click)="ask(topic.question)"
                    class="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700 transition hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700">
              {{ topic.label }}
            </button>
          </div>
        </div>

        <!-- Input -->
        <form (ngSubmit)="send()" class="flex gap-2 border-t border-slate-100 bg-white p-3">
          <input [(ngModel)]="userInput" name="chatInput" type="text" autocomplete="off"
                 placeholder="Ask about shipping, returns, products…"
                 class="flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:border-primary-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition"
                 [disabled]="typing">
          <button type="submit" [disabled]="!userInput.trim() || typing"
                  aria-label="Send message"
                  class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-white shadow-lg transition hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  style="background: linear-gradient(135deg,#6366f1 0%,#a855f7 100%);">
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
            </svg>
          </button>
        </form>
      </div>
    </div>
  `,
  styles: [`
    @keyframes chatIn {
      from { opacity: 0; transform: translateY(20px) scale(0.95); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
    .animate-chat-in { animation: chatIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }

    @keyframes typing {
      0%, 60%, 100% { opacity: 0.3; transform: translateY(0); }
      30% { opacity: 1; transform: translateY(-3px); }
    }
    .animate-typing { animation: typing 1.2s ease-in-out infinite; }

    /* Responsive chat panel sizing — scales with viewport so it never overflows */
    .chat-panel-inner {
      height: calc(100dvh - 6rem - env(safe-area-inset-bottom));
      max-height: 580px;
      min-height: 360px;
    }
    @supports not (height: 100dvh) {
      .chat-panel-inner {
        height: calc(100vh - 6rem);
      }
    }
    @media (min-width: 640px) {
      .chat-panel-inner {
        height: min(580px, calc(100dvh - 8rem));
        max-height: 640px;
      }
    }
    /* Very short screens (landscape phones) — tighten further */
    @media (max-height: 560px) {
      .chat-panel-inner {
        min-height: 0;
        height: calc(100dvh - 5rem);
      }
    }
  `]
})
export class InboxComponent implements AfterViewChecked {
  @ViewChild('messagesBox') messagesBox?: ElementRef<HTMLDivElement>;

  isOpen = false;
  hasInteracted = false;
  userInput = '';
  typing = false;
  private shouldScroll = false;

  messages: ChatMessage[] = [];

  readonly quickTopics = [
    { label: '📦 Shipping', question: 'How does shipping work?' },
    { label: '↩️ Returns', question: 'What is your return policy?' },
    { label: '💳 Payment', question: 'What payment methods do you accept?' },
    { label: '📋 Track order', question: 'How can I track my order?' },
    { label: '🎁 Promo codes', question: 'Any discount codes available?' },
    { label: '📞 Contact', question: 'How can I contact support?' }
  ];

  constructor() {
    this.addWelcome();
  }

  ngAfterViewChecked(): void {
    if (this.shouldScroll && this.messagesBox) {
      const el = this.messagesBox.nativeElement;
      el.scrollTop = el.scrollHeight;
      this.shouldScroll = false;
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.isOpen) this.close();
  }

  toggle(): void {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.hasInteracted = true;
      this.shouldScroll = true;
      this.lockBodyScroll(true);
    } else {
      this.lockBodyScroll(false);
    }
  }

  close(): void {
    this.isOpen = false;
    this.lockBodyScroll(false);
  }

  private lockBodyScroll(lock: boolean): void {
    if (typeof document === 'undefined') return;
    if (window.matchMedia('(min-width: 640px)').matches) return;
    document.body.style.overflow = lock ? 'hidden' : '';
  }

  resetChat(): void {
    this.messages = [];
    this.addWelcome();
    this.shouldScroll = true;
  }

  ask(question: string): void {
    this.userInput = question;
    this.send();
  }

  handleChip(chip: { label: string; action: string }): void {
    if (chip.action.startsWith('http') || chip.action.startsWith('/')) {
      window.location.href = chip.action;
    } else {
      this.ask(chip.action);
    }
  }

  send(): void {
    const text = this.userInput.trim();
    if (!text || this.typing) return;

    this.messages.push({ role: 'user', text: this.escape(text), time: this.now() });
    this.userInput = '';
    this.shouldScroll = true;

    this.typing = true;
    setTimeout(() => {
      const reply = this.getReply(text);
      this.messages.push({
        role: 'bot',
        text: reply.text,
        time: this.now(),
        chips: reply.chips
      });
      this.typing = false;
      this.shouldScroll = true;
    }, 600 + Math.random() * 400);
  }

  private addWelcome(): void {
    this.messages.push({
      role: 'bot',
      text: `Hi there! 👋 I'm your <b>Trendify Assistant</b>.<br>Ask me anything about shopping with us — shipping, returns, payment, product info, or how to track your order.`,
      time: this.now()
    });
  }

  private now(): string {
    return new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  }

  private escape(s: string): string {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  private getReply(q: string): { text: string; chips?: { label: string; action: string }[] } {
    const text = q.toLowerCase();

    if (/\b(hi|hello|hey|salaam|assalam|good\s*(morning|afternoon|evening))\b/.test(text)) {
      return {
        text: 'Hello! 😊 Happy to help you today. What would you like to know about Trendify?',
        chips: [
          { label: '📦 Shipping', action: 'How does shipping work?' },
          { label: '↩️ Returns', action: 'What is your return policy?' },
          { label: '🛍️ Browse products', action: '/products' }
        ]
      };
    }

    if (/\b(ship|shipping|deliver|delivery|arrive|when.*get|how.*long)\b/.test(text)) {
      return {
        text: '🚚 <b>Shipping Info</b><br>• Free shipping on orders over <b>$50</b><br>• Standard: 5–7 business days<br>• Express: 2–3 days (extra charges)<br>• Same-day dispatch on orders placed before 4pm',
        chips: [
          { label: 'Track my order', action: 'How can I track my order?' },
          { label: 'Shop now', action: '/products' }
        ]
      };
    }

    if (/\b(return|refund|exchange|money\s*back)\b/.test(text)) {
      return {
        text: '↩️ <b>30-Day Return Policy</b><br>• Return any item within 30 days for a full refund<br>• Item must be in original condition with tags<br>• Free return shipping for defective items<br>• Refunds processed within 5–7 business days',
        chips: [
          { label: 'Contact support', action: '/contact' }
        ]
      };
    }

    if (/\b(pay|payment|card|visa|master|paypal|apple\s*pay|cod|cash)\b/.test(text)) {
      return {
        text: '💳 <b>Accepted Payment Methods</b><br>• Visa, Mastercard, American Express<br>• PayPal<br>• Apple Pay<br>• All payments are SSL encrypted — your data is safe!',
        chips: [
          { label: 'View cart', action: '/cart' }
        ]
      };
    }

    if (/\b(track|where.*order|order.*status|my\s*order)\b/.test(text)) {
      return {
        text: `📋 <b>Track Your Order</b><br>Head to <b>My Orders</b> to see live status, estimated delivery, and shipping details for every order you've placed. You'll also get email updates at each step.`,
        chips: [
          { label: 'Go to My Orders', action: '/orders' }
        ]
      };
    }

    if (/\b(discount|promo|coupon|code|sale|deal|offer)\b/.test(text)) {
      return {
        text: '🎁 <b>Active Promo Codes</b><br>• <code>SAVE10</code> — 10% off your order<br>• <code>SAVE20</code> — 20% off your order<br>• <code>TRENDY5</code> — 5% off new customers<br>Apply at checkout! Sale section has up to <b>70% off</b> right now.',
        chips: [
          { label: 'Shop sale', action: '/products' },
          { label: 'Open cart', action: '/cart' }
        ]
      };
    }

    if (/\b(contact|support|help|call|phone|email|reach)\b/.test(text)) {
      return {
        text: '📞 <b>Get in Touch</b><br>• Email: <b>support&#64;trendify.com</b><br>• Phone: <b>+92 300 1234567</b><br>• Hours: Mon–Sat, 9am–7pm<br>• Or visit our Contact page for the full form + map',
        chips: [
          { label: 'Contact page', action: '/contact' }
        ]
      };
    }

    if (/\b(product|catalog|browse|shop|buy|categ|brand)\b/.test(text)) {
      return {
        text: '🛍️ <b>Our Catalog</b><br>We stock <b>50,000+ products</b> across categories:<br>• Electronics · Fashion · Home & Kitchen<br>• Sports & Fitness · Beauty · Toys · Books<br>Use filters on Products page to narrow by category, brand, price, and rating.',
        chips: [
          { label: 'Browse all', action: '/products' }
        ]
      };
    }

    if (/\b(account|sign\s*up|register|login|profile|password)\b/.test(text)) {
      return {
        text: '👤 <b>Your Account</b><br>Create a free account to save wishlists, track orders, and unlock member-only deals. You can manage profile, change password, and upload an avatar from your Profile page.',
        chips: [
          { label: 'Sign in', action: '/login' },
          { label: 'Register', action: '/register' },
          { label: 'My Profile', action: '/profile' }
        ]
      };
    }

    if (/\b(cart|basket|bag)\b/.test(text)) {
      return {
        text: '🛒 <b>Your Cart</b><br>Items you add stay in your cart across sessions. Add items worth <b>$50+</b> to qualify for free shipping. You can also apply promo codes from the cart page.',
        chips: [
          { label: 'View cart', action: '/cart' },
          { label: 'Keep shopping', action: '/products' }
        ]
      };
    }

    if (/\b(wish|favourite|favorite|like|save)\b/.test(text)) {
      return {
        text: '❤️ <b>Wishlist</b><br>Tap the heart icon on any product to save it for later. Your wishlist syncs across devices when you sign in.',
        chips: [
          { label: 'My Wishlist', action: '/wishlist' }
        ]
      };
    }

    if (/\b(thanks|thank\s*you|thx|appreciate)\b/.test(text)) {
      return {
        text: `You're welcome! 🌟 Anything else I can help with? I'm right here whenever you need me.`,
        chips: [
          { label: 'Shop now', action: '/products' },
          { label: 'Track order', action: '/orders' }
        ]
      };
    }

    if (/\b(bye|goodbye|see\s*you|later)\b/.test(text)) {
      return {
        text: `Thanks for chatting! 👋 Happy shopping at Trendify — we're always here if you need us.`
      };
    }

    // Fallback
    return {
      text: `I'm not quite sure about that one, but I can help with:<br>• Shipping & delivery<br>• Returns & refunds<br>• Payment methods<br>• Order tracking<br>• Promo codes<br>• Product browsing<br>Or reach our team on the Contact page.`,
      chips: [
        { label: '📦 Shipping', action: 'How does shipping work?' },
        { label: '↩️ Returns', action: 'What is your return policy?' },
        { label: '📞 Contact', action: '/contact' }
      ]
    };
  }
}
