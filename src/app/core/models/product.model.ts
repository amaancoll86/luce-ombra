export interface FrameColor {
  name: string;
  hex: string;
}

export interface LensShade {
  name: string;
  hex: string;
}

export interface ProductSpec {
  label: string;
  value: string;
}

export type ProductCategory = 'sunglasses' | 'optical' | 'sports' | 'limited';
export type ProductGender = 'men' | 'women' | 'unisex';
export type ProductSize = 'S' | 'M' | 'L' | 'XL';
export type FrameShape = 'aviator' | 'wayfarer' | 'round' | 'cat-eye' | 'rectangle' | 'oversized';

export interface Product {
  id: string;
  name: string;
  collection: string;
  category: ProductCategory;
  gender: ProductGender;
  frameShape: FrameShape;
  frameColors: FrameColor[];
  lensShades: LensShade[];
  sizes: ProductSize[];
  price: number;
  originalPrice?: number;
  images: string[];
  modelPath?: string;
  video?: string;
  description: string;
  specs: ProductSpec[];
  tags: string[];
  rating: number;
  reviewCount: number;
  isNew?: boolean;
  isBestseller?: boolean;
}

export interface FilterState {
  categories: ProductCategory[];
  frameShapes: FrameShape[];
  frameColors: string[];
  lensShades: string[];
  genders: ProductGender[];
  priceMin: number;
  priceMax: number;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'newest';
  searchQuery: string;
}

export const DEFAULT_FILTER_STATE: FilterState = {
  categories: [],
  frameShapes: [],
  frameColors: [],
  lensShades: [],
  genders: [],
  priceMin: 0,
  priceMax: 50000,
  sortBy: 'featured',
  searchQuery: '',
};
