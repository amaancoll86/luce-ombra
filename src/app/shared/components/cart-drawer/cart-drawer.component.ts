import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';
import { CurrencyFormatPipe } from '../../pipes/currency-format.pipe';

@Component({
    selector: 'app-cart-drawer',
    standalone: true,
    imports: [CommonModule, RouterLink, CurrencyFormatPipe],
    templateUrl: './cart-drawer.component.html',
    styleUrl: './cart-drawer.component.scss',
})
export class CartDrawerComponent {
    cartService = inject(CartService);

    close() {
        this.cartService.closeCart();
    }

    increment(productId: string, size: string, colorName: string, qty: number) {
        this.cartService.updateQuantity(productId, size, colorName, qty + 1);
    }

    decrement(productId: string, size: string, colorName: string, qty: number) {
        this.cartService.updateQuantity(productId, size, colorName, qty - 1);
    }

    remove(productId: string, size: string, colorName: string) {
        this.cartService.removeFromCart(productId, size, colorName);
    }
}
