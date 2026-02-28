import { Product } from '../models/product.model';

export interface CartItem {
    product: Product;
    selectedFrameColor: { name: string; hex: string };
    selectedLensShade: { name: string; hex: string };
    selectedSize: string;
    quantity: number;
}
