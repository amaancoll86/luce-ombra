import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';
import { Product, FrameColor, LensShade } from '../../core/models/product.model';
import { CartItem } from '../../core/models/cart-item.model';
// import { ThreeSceneComponent } from '../../shared/components/three-scene/three-scene.component'; // reserved for future 3D use
import { CurrencyFormatPipe } from '../../shared/pipes/currency-format.pipe';
import { SafeUrlPipe } from '../../shared/pipes/safe-url.pipe';

@Component({
    selector: 'app-product-detail',
    standalone: true,
    imports: [CommonModule, RouterLink, CurrencyFormatPipe, SafeUrlPipe],
    templateUrl: './product-detail.component.html',
    styleUrl: './product-detail.component.scss',
})
export class ProductDetailComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private productService = inject(ProductService);
    cartService = inject(CartService);

    product = signal<Product | null>(null);
    selectedColor = signal<FrameColor | null>(null);
    selectedLens = signal<LensShade | null>(null);
    selectedSize = signal<string>('M');
    quantity = signal(1);
    addedToCart = signal(false);
    detailsOpen = signal(true);
    shippingOpen = signal(false);
    activeImage = signal(0); // index of the currently displayed main image

    readonly Math = Math;

    ngOnInit(): void {
        this.route.paramMap.subscribe(params => {
            const id = params.get('id') ?? '';
            this.productService.getById(id).subscribe(product => {
                if (product) {
                    this.product.set(product);
                    this.activeImage.set(0); // reset gallery to first slide
                    this.selectedColor.set(product.frameColors[0]);
                    this.selectedLens.set(product.lensShades[0]);
                    this.selectedSize.set(product.sizes[1] ?? product.sizes[0]);
                }
            });
        });
    }

    get stockStars(): number[] {
        const p = this.product();
        if (!p) return [];
        return Array.from({ length: 5 }, (_, i) => i + 1);
    }

    /** Total slides in the gallery: 1 video (if present) + all images */
    totalSlides(): number {
        const p = this.product();
        if (!p) return 0;
        return (p.video ? 1 : 0) + p.images.length;
    }

    /** Numeric array for dot indicator @for iteration */
    totalSlidesArray(): number[] {
        return Array.from({ length: this.totalSlides() }, (_, i) => i);
    }

    /** Index into p.images for the current slide (offsets past the video slot if present) */
    imgIdx(): number {
        const p = this.product();
        return this.activeImage() - (p?.video ? 1 : 0);
    }

    addToCart(): void {
        const p = this.product();
        if (!p || !this.selectedColor() || !this.selectedLens()) return;

        const item: CartItem = {
            product: p,
            selectedFrameColor: this.selectedColor()!,
            selectedLensShade: this.selectedLens()!,
            selectedSize: this.selectedSize(),
            quantity: this.quantity(),
        };

        this.cartService.addToCart(item);
        this.addedToCart.set(true);
        setTimeout(() => {
            this.addedToCart.set(false);
            this.cartService.openCart();
        }, 800);
    }

    toggleDetails(): void { this.detailsOpen.update(v => !v); }
    toggleShipping(): void { this.shippingOpen.update(v => !v); }

    incrementQty(): void { this.quantity.update(q => Math.min(q + 1, 10)); }
    decrementQty(): void { this.quantity.update(q => Math.max(q - 1, 1)); }
}
