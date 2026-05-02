import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { StorageService } from './storage.service';
import { AuthService } from './auth.service';
import { CartItem } from '../models/interfaces';

export interface CartAddedEvent {
  productId: string;
  quantity: number;
  price: number;
  isNew: boolean;
  totalQuantity: number;
}

export interface CartRemovedEvent {
  productId: string;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  public cartItems$ = this.cartItemsSubject.asObservable();

  private addedSubject = new Subject<CartAddedEvent>();
  public added$ = this.addedSubject.asObservable();

  private removedSubject = new Subject<CartRemovedEvent>();
  public removed$ = this.removedSubject.asObservable();

  constructor(
    private storage: StorageService,
    private authService: AuthService
  ) {
    this.authService.currentUser$.subscribe(() => {
      this.loadCart();
    });
  }

  private getStorageKey(): string {
    const userId = this.authService.currentUserValue?.id;
    return userId ? `cart_${userId}` : 'cart_guest';
  }

  private loadCart(): void {
    const cartItems = this.storage.getItem<CartItem[]>(this.getStorageKey()) || [];
    this.cartItemsSubject.next(cartItems);
  }

  private saveCart(): void {
    this.storage.setItem(this.getStorageKey(), this.cartItemsSubject.value);
  }

  addToCart(productId: string, price: number, quantity: number = 1): void {
    const cartItems = [...this.cartItemsSubject.value];
    const existingItem = cartItems.find(item => item.productId === productId);
    const isNew = !existingItem;

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      const newItem: CartItem = {
        id: Date.now().toString(),
        productId,
        quantity,
        price
      };
      cartItems.push(newItem);
    }

    this.cartItemsSubject.next(cartItems);
    this.saveCart();

    const updated = cartItems.find(item => item.productId === productId);
    this.addedSubject.next({
      productId,
      quantity,
      price,
      isNew,
      totalQuantity: updated?.quantity ?? quantity
    });
  }

  removeFromCart(productId: string): void {
    const existed = this.cartItemsSubject.value.some(item => item.productId === productId);
    const cartItems = this.cartItemsSubject.value.filter(item => item.productId !== productId);
    this.cartItemsSubject.next(cartItems);
    this.saveCart();
    if (existed) {
      this.removedSubject.next({ productId });
    }
  }

  updateQuantity(productId: string, quantity: number): void {
    const cartItems = this.cartItemsSubject.value;
    const item = cartItems.find(item => item.productId === productId);
    
    if (item) {
      if (quantity <= 0) {
        this.removeFromCart(productId);
      } else {
        item.quantity = quantity;
        this.cartItemsSubject.next(cartItems);
        this.saveCart();
      }
    }
  }

  clearCart(): void {
    this.cartItemsSubject.next([]);
    this.saveCart();
  }

  getCartTotal(): number {
    return this.cartItemsSubject.value.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  getCartItemCount(): number {
    return this.cartItemsSubject.value.reduce((count, item) => count + item.quantity, 0);
  }
}
