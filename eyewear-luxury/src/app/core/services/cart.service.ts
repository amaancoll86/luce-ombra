import { Injectable, signal, computed } from '@angular/core';
import { CartItem } from '../models/cart-item.model';

@Injectable({ providedIn: 'root' })
export class CartService {
    // Signal-based state
    readonly cartItems = signal<CartItem[]>([]);

    // Computed signals
    readonly cartCount = computed(() =>
        this.cartItems().reduce((total, item) => total + item.quantity, 0)
    );

    readonly cartTotal = computed(() =>
        this.cartItems().reduce((total, item) => total + item.product.price * item.quantity, 0)
    );

    readonly cartOpen = signal(false);

    addToCart(item: CartItem): void {
        const current = this.cartItems();
        const existingIdx = current.findIndex(
            ci =>
                ci.product.id === item.product.id &&
                ci.selectedFrameColor.name === item.selectedFrameColor.name &&
                ci.selectedLensShade.name === item.selectedLensShade.name &&
                ci.selectedSize === item.selectedSize
        );

        if (existingIdx >= 0) {
            const updated = [...current];
            updated[existingIdx] = {
                ...updated[existingIdx],
                quantity: updated[existingIdx].quantity + item.quantity,
            };
            this.cartItems.set(updated);
        } else {
            this.cartItems.set([...current, item]);
        }
    }

    removeFromCart(productId: string, size: string, colorName: string): void {
        this.cartItems.update(items =>
            items.filter(
                item =>
                    !(item.product.id === productId &&
                        item.selectedSize === size &&
                        item.selectedFrameColor.name === colorName)
            )
        );
    }

    updateQuantity(productId: string, size: string, colorName: string, qty: number): void {
        if (qty <= 0) {
            this.removeFromCart(productId, size, colorName);
            return;
        }
        this.cartItems.update(items =>
            items.map(item =>
                item.product.id === productId &&
                    item.selectedSize === size &&
                    item.selectedFrameColor.name === colorName
                    ? { ...item, quantity: qty }
                    : item
            )
        );
    }

    clearCart(): void {
        this.cartItems.set([]);
    }

    openCart(): void {
        this.cartOpen.set(true);
    }

    closeCart(): void {
        this.cartOpen.set(false);
    }

    toggleCart(): void {
        this.cartOpen.update(v => !v);
    }
}
