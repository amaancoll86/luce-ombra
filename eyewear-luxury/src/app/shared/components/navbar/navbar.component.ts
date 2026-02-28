import { Component, inject, signal, HostListener } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from '../../../core/services/cart.service';
import { CartDrawerComponent } from '../cart-drawer/cart-drawer.component';

@Component({
    selector: 'app-navbar',
    standalone: true,
    imports: [RouterLink, RouterLinkActive, CommonModule, CartDrawerComponent],
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
    cartService = inject(CartService);
    mobileMenuOpen = signal(false);
    isScrolled = signal(false);

    @HostListener('window:scroll')
    onScroll() {
        this.isScrolled.set(window.scrollY > 40);
    }

    toggleMobile() {
        this.mobileMenuOpen.update(v => !v);
    }

    closeMobile() {
        this.mobileMenuOpen.set(false);
    }
}
