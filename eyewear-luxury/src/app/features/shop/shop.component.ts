import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../core/services/product.service';
import { Product, FilterState, DEFAULT_FILTER_STATE, ProductCategory, ProductGender, FrameShape } from '../../core/models/product.model';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';

@Component({
    selector: 'app-shop',
    standalone: true,
    imports: [CommonModule, RouterLink, FormsModule, ProductCardComponent],
    templateUrl: './shop.component.html',
    styleUrl: './shop.component.scss',
})
export class ShopComponent implements OnInit {
    private productService = inject(ProductService);
    private route = inject(ActivatedRoute);

    filters = signal<FilterState>({ ...DEFAULT_FILTER_STATE });
    products = signal<Product[]>([]);
    loading = signal(true);
    filtersOpen = signal(false);
    gridFading = signal(false);

    // Collapsible sections
    collapsedSections = signal<Set<string>>(new Set());

    readonly categories = ['sunglasses', 'optical', 'sports', 'limited'] as const;
    readonly frameShapes = ['aviator', 'wayfarer', 'round', 'cat-eye', 'rectangle', 'oversized'] as const;
    readonly frameColorOptions = [
        { name: 'Black', hex: '#1a1a1a' },
        { name: 'Tortoise', hex: '#6B3F1A' },
        { name: 'Gold', hex: '#C9A84C' },
        { name: 'Silver', hex: '#9a9a9a' },
        { name: 'Clear', hex: '#d0d0d0' },
        { name: 'Brown', hex: '#8B6340' },
    ];
    readonly lensOptions = [
        { name: 'Dark Black', hex: '#111111' },
        { name: 'Brown', hex: '#6B4A2A' },
        { name: 'Green', hex: '#2A4A35' },
        { name: 'Blue', hex: '#4A70A0' },
        { name: 'Yellow', hex: '#D4C070' },
        { name: 'Clear', hex: '#e8e8e8' },
    ];
    readonly genders = ['men', 'women', 'unisex'] as const;
    readonly sortOptions: Array<{ val: FilterState['sortBy']; label: string }> = [
        { val: 'featured', label: 'Featured' },
        { val: 'price-asc', label: 'Price: Low to High' },
        { val: 'price-desc', label: 'Price: High to Low' },
        { val: 'newest', label: 'Newest' },
    ];

    onSortChange(val: string): void {
        this.setSortBy(val as FilterState['sortBy']);
    }


    get activeFilterCount(): number {
        const f = this.filters();
        return f.categories.length + f.frameShapes.length + f.frameColors.length +
            f.lensShades.length + f.genders.length +
            (f.priceMin > 0 ? 1 : 0) + (f.priceMax < 50000 ? 1 : 0);
    }

    ngOnInit(): void {
        // Read query params for preselected category
        this.route.queryParams.subscribe(params => {
            if (params['category']) {
                this.filters.update(f => ({ ...f, categories: [params['category'] as ProductCategory] }));
            }
            this.applyFilters();
        });
    }

    applyFilters(): void {
        this.gridFading.set(true);
        setTimeout(() => {
            this.productService.getFiltered(this.filters()).subscribe(products => {
                this.products.set(products);
                this.loading.set(false);
                this.gridFading.set(false);
            });
        }, 200);
    }

    toggleCategory(cat: ProductCategory): void {
        this.filters.update(f => {
            const cats = f.categories.includes(cat)
                ? f.categories.filter(c => c !== cat)
                : [...f.categories, cat];
            return { ...f, categories: cats };
        });
        this.applyFilters();
    }

    toggleShape(shape: FrameShape): void {
        this.filters.update(f => {
            const shapes = f.frameShapes.includes(shape)
                ? f.frameShapes.filter(s => s !== shape)
                : [...f.frameShapes, shape];
            return { ...f, frameShapes: shapes };
        });
        this.applyFilters();
    }

    toggleFrameColor(name: string): void {
        this.filters.update(f => {
            const colors = f.frameColors.includes(name)
                ? f.frameColors.filter(c => c !== name)
                : [...f.frameColors, name];
            return { ...f, frameColors: colors };
        });
        this.applyFilters();
    }

    toggleLensShade(name: string): void {
        this.filters.update(f => {
            const shades = f.lensShades.includes(name)
                ? f.lensShades.filter(s => s !== name)
                : [...f.lensShades, name];
            return { ...f, lensShades: shades };
        });
        this.applyFilters();
    }

    toggleGender(gender: ProductGender): void {
        this.filters.update(f => {
            const genders = f.genders.includes(gender)
                ? f.genders.filter(g => g !== gender)
                : [...f.genders, gender];
            return { ...f, genders };
        });
        this.applyFilters();
    }

    setSortBy(sortBy: FilterState['sortBy']): void {
        this.filters.update(f => ({ ...f, sortBy }));
        this.applyFilters();
    }

    setPriceMax(val: number): void {
        this.filters.update(f => ({ ...f, priceMax: val }));
        this.applyFilters();
    }

    clearFilters(): void {
        this.filters.set({ ...DEFAULT_FILTER_STATE });
        this.applyFilters();
    }

    removeCategoryFilter(cat: string): void {
        this.filters.update(f => ({ ...f, categories: f.categories.filter(c => c !== cat) }));
        this.applyFilters();
    }

    toggleSection(section: string): void {
        this.collapsedSections.update(set => {
            const s = new Set(set);
            s.has(section) ? s.delete(section) : s.add(section);
            return s;
        });
    }

    isCollapsed(section: string): boolean {
        return this.collapsedSections().has(section);
    }
}
