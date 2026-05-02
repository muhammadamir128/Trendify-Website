import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="show" class="fixed inset-0 z-[100] flex items-center justify-center px-4 animate-fade-in"
         role="dialog" aria-modal="true">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" (click)="onCancel()"></div>

      <!-- Dialog -->
      <div class="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl animate-scale-in">
        <!-- Accent bar -->
        <div class="h-1.5 w-full" [style.background]="accentGradient"></div>

        <!-- Close button -->
        <button type="button" (click)="onCancel()" aria-label="Close"
                class="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition">
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.25">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>

        <div class="p-6 text-center">
          <!-- Icon -->
          <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-full"
               [style.background]="iconBackground"
               [style.box-shadow]="iconShadow">
            <svg *ngIf="variant === 'danger'" class="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.25">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M10 7V4a1 1 0 011-1h2a1 1 0 011 1v3"/>
            </svg>
            <svg *ngIf="variant === 'warning'" class="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.25">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
            <svg *ngIf="variant === 'info'" class="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.25">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>

          <h3 class="mt-4 text-xl font-bold text-slate-900">{{ title }}</h3>
          <p class="mt-2 text-sm text-slate-600">{{ message }}</p>

          <div *ngIf="itemName" class="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3 text-left">
            <p class="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Item</p>
            <p class="mt-0.5 font-semibold text-slate-900 truncate">{{ itemName }}</p>
          </div>

          <div class="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-center">
            <button type="button" (click)="onCancel()"
                    class="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50">
              {{ cancelLabel }}
            </button>
            <button type="button" (click)="onConfirm()"
                    class="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-white shadow-lg transition hover:opacity-90"
                    [style.background]="accentGradient"
                    [style.box-shadow]="iconShadow">
              <svg *ngIf="variant === 'danger'" class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M10 7V4a1 1 0 011-1h2a1 1 0 011 1v3"/>
              </svg>
              {{ confirmLabel }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ConfirmDialogComponent {
  @Input() show = false;
  @Input() title = 'Are you sure?';
  @Input() message = 'This action cannot be undone.';
  @Input() itemName = '';
  @Input() confirmLabel = 'Delete';
  @Input() cancelLabel = 'Cancel';
  @Input() variant: 'danger' | 'warning' | 'info' = 'danger';

  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  get accentGradient(): string {
    switch (this.variant) {
      case 'warning': return 'linear-gradient(135deg,#f59e0b 0%,#ea580c 100%)';
      case 'info': return 'linear-gradient(135deg,#0ea5e9 0%,#6366f1 100%)';
      default: return 'linear-gradient(135deg,#f43f5e 0%,#db2777 100%)';
    }
  }

  get iconBackground(): string {
    return this.accentGradient;
  }

  get iconShadow(): string {
    switch (this.variant) {
      case 'warning': return '0 12px 30px -8px rgba(245,158,11,0.5)';
      case 'info': return '0 12px 30px -8px rgba(99,102,241,0.5)';
      default: return '0 12px 30px -8px rgba(244,63,94,0.5)';
    }
  }

  onConfirm(): void {
    this.confirmed.emit();
  }

  onCancel(): void {
    this.cancelled.emit();
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.show) this.onCancel();
  }
}
