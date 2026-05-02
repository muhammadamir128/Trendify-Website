import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { StorageService } from './storage.service';
import { AuthService } from './auth.service';
import { WishlistItem } from '../models/interfaces';

export interface WishlistChangeEvent {
  productId: string;
  action: 'added' | 'removed';
}

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private wishlistItemsSubject = new BehaviorSubject<WishlistItem[]>([]);
  public wishlistItems$ = this.wishlistItemsSubject.asObservable();

  private changedSubject = new Subject<WishlistChangeEvent>();
  public changed$ = this.changedSubject.asObservable();

  constructor(
    private storage: StorageService,
    private authService: AuthService
  ) {
    this.authService.currentUser$.subscribe(() => {
      this.loadWishlist();
    });
  }

  private getStorageKey(): string {
    const userId = this.authService.currentUserValue?.id;
    return userId ? `wishlist_${userId}` : 'wishlist_guest';
  }

  private loadWishlist(): void {
    const wishlistItems = this.storage.getItem<WishlistItem[]>(this.getStorageKey()) || [];
    this.wishlistItemsSubject.next(wishlistItems);
  }

  private saveWishlist(): void {
    this.storage.setItem(this.getStorageKey(), this.wishlistItemsSubject.value);
  }

  addToWishlist(productId: string): void {
    const userId = this.authService.currentUserValue?.id ?? 'guest';

    const wishlistItems = [...this.wishlistItemsSubject.value];
    const existingItem = wishlistItems.find(item => item.productId === productId);

    if (!existingItem) {
      const newItem: WishlistItem = {
        id: Date.now().toString(),
        productId,
        userId,
        createdAt: new Date().toISOString()
      };
      wishlistItems.push(newItem);
      this.wishlistItemsSubject.next(wishlistItems);
      this.saveWishlist();
      this.changedSubject.next({ productId, action: 'added' });
    }
  }

  removeFromWishlist(productId: string): void {
    const existed = this.wishlistItemsSubject.value.some(item => item.productId === productId);
    const wishlistItems = this.wishlistItemsSubject.value.filter(item => item.productId !== productId);
    this.wishlistItemsSubject.next(wishlistItems);
    this.saveWishlist();
    if (existed) {
      this.changedSubject.next({ productId, action: 'removed' });
    }
  }

  isInWishlist(productId: string): boolean {
    return this.wishlistItemsSubject.value.some(item => item.productId === productId);
  }

  clearWishlist(): void {
    this.wishlistItemsSubject.next([]);
    this.saveWishlist();
  }
}
