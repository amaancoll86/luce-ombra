import {
    Component, OnInit, AfterViewInit, OnDestroy,
    ElementRef, ViewChild, inject, signal
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../core/services/product.service';
import { Product } from '../../core/models/product.model';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MenuItem, InfiniteMenuComponent } from '../../shared/components/infinite-menu/infinite-menu.component';
import { collections } from '../../core/data/collections.data';

gsap.registerPlugin(ScrollTrigger);

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [RouterLink, CommonModule, ProductCardComponent, InfiniteMenuComponent],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
    private productService = inject(ProductService);
    private host = inject(ElementRef<HTMLElement>);

    bestsellers = signal<Product[]>([]);
    heroVisible = signal(false);

    // Scroll story sections
    @ViewChild('storySection1') storySection1!: ElementRef<HTMLElement>;
    @ViewChild('storySection2') storySection2!: ElementRef<HTMLElement>;

    private scrollTriggers: ScrollTrigger[] = [];

    categories = [
        {
            label: 'Sunglasses',
            tagline: 'See the world in gold',
            image: 'assets/products/riflesso/1/1 Riflesso-1.jpg',
            link: '/shop',
            queryParams: { category: 'sunglasses' }
        },
        {
            label: 'Optical',
            tagline: 'Precision in every frame',
            image: 'assets/products/filo/1/1 Filo-1.jpg',
            link: '/shop',
            queryParams: { category: 'optical' }
        },
        {
            label: 'Limited Edition',
            tagline: 'Rare. Extraordinary.',
            image: 'assets/products/nero-classico/1/1 Nero Classico-1.jpg',
            link: '/shop',
            queryParams: { category: 'limited' }
        },
    ];

    // Story section data
    storySections = [
        {
            image: 'assets/products/quadro/Quadro-1.jpg',
            eyebrow: 'The Craft',
            headline: 'Born from\nItalian Light',
            body: 'Every Luce & Ombra frame begins as a raw block of the finest Italian acetate — hand-selected for its depth, its warmth, and its capacity to carry light. Weeks of artisan work transform it into something approaching sculpture.',
            ctaLabel: 'Our Craftsmanship',
            ctaLink: '/shop',
        },
        {
            image: 'assets/products/lira/1/1 Lira-1.jpg',
            eyebrow: 'The Vision',
            headline: 'Worn by\nThose Who See',
            body: 'A frame is not merely an accessory. It is the first thing the world sees of you, and the last thing removed at night. We design for that intimacy — for the person who chooses deliberately, who refuses to be invisible.',
            ctaLabel: 'The Collection',
            ctaLink: '/shop',
        },
    ];

    public collections: MenuItem[] = collections;

    ngOnInit(): void {
        this.productService.getFeatured().subscribe(products => {
            this.bestsellers.set(products);
        });
        setTimeout(() => this.heroVisible.set(true), 100);
    }

    ngAfterViewInit(): void {
        // Give the DOM a tick to paint before measuring
        setTimeout(() => this.initScrollStory(), 50);
    }

    private initScrollStory(): void {
        const host = this.host.nativeElement;

        // Collect all story sections
        const sections = Array.from(
            host.querySelectorAll('.story-section')
        ) as HTMLElement[];

        sections.forEach((section: HTMLElement) => {
            const textPanel = section.querySelector('.story__text-panel') as HTMLElement | null;
            const overlay = section.querySelector('.story__image-overlay') as HTMLElement | null;

            if (!textPanel) return;

            // ── Set initial state ──────────────────────────────────────
            // Text panel: starts exactly one viewport below the bottom
            // of the pinned section (i.e. fully off-screen below).
            gsap.set(textPanel, { y: '100vh' });

            // ── Build the scrubbed timeline ────────────────────────────
            const tl = gsap.timeline({ paused: true });

            // Text slides up from 100vh to 0 over the full scrub range
            tl.to(textPanel, {
                y: 0,
                ease: 'none',
                duration: 1,
            }, 0);

            // Overlay darkens concurrently (image fades behind text)
            if (overlay) {
                tl.to(overlay, {
                    opacity: 1,
                    ease: 'power1.in',
                    duration: 1,
                }, 0);
            }

            // ── ScrollTrigger: pin the section + scrub the timeline ────
            // pin: true = GSAP fixes the section in place and creates a
            //   spacer div of height `end - start` so the page scroll
            //   position drives the animation. No CSS sticky needed.
            // end: '+=200%' = pin for 2× the viewport height of extra
            //   scrolling, giving 300vh total (100vh section + 200vh pin).
            ScrollTrigger.create({
                trigger: section,
                start: 'top top',
                end: '+=200%',
                pin: true,
                scrub: 1,
                animation: tl,
                // Keep pinned element in its original stacking context
                pinSpacing: true,
            });
        });
    }

    ngOnDestroy(): void {
        this.scrollTriggers.forEach(st => st.kill());
        ScrollTrigger.getAll().forEach(st => st.kill());
    }
}
