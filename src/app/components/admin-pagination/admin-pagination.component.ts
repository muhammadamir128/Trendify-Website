import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

@Component({
  selector: 'app-admin-pagination',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="totalItems > 0 && totalPages > 1" class="mt-6 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <p class="text-sm text-slate-600">
        Showing <span class="font-semibold text-slate-800">{{ startIndex }}</span>
        to <span class="font-semibold text-slate-800">{{ endIndex }}</span>
        of <span class="font-semibold text-slate-800">{{ totalItems }}</span>
      </p>

      <div class="flex items-center gap-1 sm:gap-2">
        <button
          type="button"
          class="pagination-btn"
          [disabled]="currentPage <= 1"
          (click)="goToPage(currentPage - 1)"
        >
          Prev
        </button>

        <button
          type="button"
          *ngFor="let page of visiblePages"
          class="pagination-btn"
          [class.pagination-btn-active]="page === currentPage"
          (click)="goToPage(page)"
        >
          {{ page }}
        </button>

        <button
          type="button"
          class="pagination-btn"
          [disabled]="currentPage >= totalPages"
          (click)="goToPage(currentPage + 1)"
        >
          Next
        </button>
      </div>
    </div>
  `
})
export class AdminPaginationComponent {
  @Input() totalItems = 0;
  @Input() pageSize = 10;
  @Input() currentPage = 1;

  @Output() pageChange = new EventEmitter<number>();

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.totalItems / this.pageSize));
  }

  get startIndex(): number {
    if (this.totalItems === 0) return 0;
    return (this.currentPage - 1) * this.pageSize + 1;
  }

  get endIndex(): number {
    return Math.min(this.currentPage * this.pageSize, this.totalItems);
  }

  get visiblePages(): number[] {
    const pages: number[] = [];
    const maxVisible = 5;

    if (this.totalPages <= maxVisible) {
      for (let page = 1; page <= this.totalPages; page += 1) {
        pages.push(page);
      }
      return pages;
    }

    let start = Math.max(1, this.currentPage - 2);
    let end = Math.min(this.totalPages, start + maxVisible - 1);

    start = Math.max(1, end - maxVisible + 1);

    for (let page = start; page <= end; page += 1) {
      pages.push(page);
    }

    return pages;
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages || page === this.currentPage) {
      return;
    }

    this.pageChange.emit(page);
  }
}