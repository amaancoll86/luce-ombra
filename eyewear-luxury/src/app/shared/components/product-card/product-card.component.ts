import { Component, Input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Product } from '../../../core/models/product.model';
import { CurrencyFormatPipe } from '../../pipes/currency-format.pipe';

@Component({
    selector: 'app-product-card',
    standalone: true,
    imports: [RouterLink, CommonModule, CurrencyFormatPipe],
    templateUrl: './product-card.component.html',
    styleUrl: './product-card.component.scss',
})
export class ProductCardComponent {
    @Input({ required: true }) product!: Product;

    readonly Math = Math;
    isHovered = signal(false);
    isWishlisted = signal(false);

    get displayImage(): string {
        if (this.isHovered() && this.product.images.length > 1) {
            return this.product.images[1];
        }
        return this.product.images[0];
    }

    toggleWishlist(event: Event): void {
        event.preventDefault();
        event.stopPropagation();
        this.isWishlisted.update(v => !v);
    }
}
