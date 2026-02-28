import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Product, FilterState } from '../models/product.model';
import { PRODUCTS } from '../data/products.data';

@Injectable({ providedIn: 'root' })
export class ProductService {

    getAll(): Observable<Product[]> {
        return of(PRODUCTS);
    }

    getById(id: string): Observable<Product | undefined> {
        return of(PRODUCTS.find(p => p.id === id));
    }

    getFeatured(): Observable<Product[]> {
        return of(PRODUCTS.filter(p => p.isBestseller).slice(0, 4));
    }

    getNew(): Observable<Product[]> {
        return of(PRODUCTS.filter(p => p.isNew).slice(0, 4));
    }

    getFiltered(filters: FilterState): Observable<Product[]> {
        let result = [...PRODUCTS];

        // Category filter
        if (filters.categories.length > 0) {
            result = result.filter(p => filters.categories.includes(p.category));
        }

        // Frame shape filter
        if (filters.frameShapes.length > 0) {
            result = result.filter(p => filters.frameShapes.includes(p.frameShape));
        }

        // Frame color filter (by color name)
        if (filters.frameColors.length > 0) {
            result = result.filter(p =>
                p.frameColors.some(fc => filters.frameColors.includes(fc.name))
            );
        }

        // Lens shade filter
        if (filters.lensShades.length > 0) {
            result = result.filter(p =>
                p.lensShades.some(ls => filters.lensShades.includes(ls.name))
            );
        }

        // Gender filter
        if (filters.genders.length > 0) {
            result = result.filter(p => filters.genders.includes(p.gender));
        }

        // Price range
        result = result.filter(p => p.price >= filters.priceMin && p.price <= filters.priceMax);

        // Sorting
        switch (filters.sortBy) {
            case 'price-asc':
                result.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                result.sort((a, b) => b.price - a.price);
                break;
            case 'newest':
                result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
                break;
            default:
                // featured — bestsellers first
                result.sort((a, b) => (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0));
        }

        return of(result);
    }
}
