import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from '../../core/services/cart.service';
import { CurrencyFormatPipe } from '../../shared/pipes/currency-format.pipe';

@Component({
    selector: 'app-checkout',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink, CurrencyFormatPipe],
    templateUrl: './checkout.component.html',
    styleUrl: './checkout.component.scss',
})
export class CheckoutComponent implements OnInit {
    private fb = inject(FormBuilder);
    private router = inject(Router);
    cartService = inject(CartService);

    form!: FormGroup;
    paymentMethod = signal<'card' | 'upi' | 'netbanking' | 'cod'>('card');
    submitting = signal(false);
    submitted = signal(false);

    readonly paymentOptions: Array<{ val: 'card' | 'upi' | 'netbanking' | 'cod'; label: string }> = [
        { val: 'card', label: 'Credit / Debit Card' },
        { val: 'upi', label: 'UPI' },
        { val: 'netbanking', label: 'Net Banking' },
        { val: 'cod', label: 'Cash on Delivery' },
    ];

    setPaymentMethod(val: 'card' | 'upi' | 'netbanking' | 'cod'): void {
        this.paymentMethod.set(val);
    }


    get subtotal() { return this.cartService.cartTotal(); }
    get shipping() { return this.subtotal >= 2999 ? 0 : 199; }
    get tax() { return Math.round(this.subtotal * 0.18); }
    get total() { return this.subtotal + this.shipping + this.tax; }

    ngOnInit(): void {
        this.form = this.fb.group({
            fullName: ['', [Validators.required, Validators.minLength(2)]],
            email: ['', [Validators.required, Validators.email]],
            phone: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
            address1: ['', Validators.required],
            address2: [''],
            city: ['', Validators.required],
            state: ['', Validators.required],
            pinCode: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
            country: ['India', Validators.required],
            cardNumber: [''],
            upiId: [''],
        });
    }

    isInvalid(field: string): boolean {
        const c = this.form.get(field);
        return !!(c?.invalid && (c.dirty || c.touched || this.submitted()));
    }

    getError(field: string): string {
        const c = this.form.get(field);
        if (!c?.errors) return '';
        if (c.errors['required']) return 'This field is required.';
        if (c.errors['email']) return 'Enter a valid email address.';
        if (c.errors['minlength']) return 'Too short.';
        if (c.errors['pattern']) {
            if (field === 'phone') return 'Enter a valid 10-digit Indian mobile number.';
            if (field === 'pinCode') return 'Enter a valid 6-digit PIN code.';
        }
        return 'Invalid value.';
    }

    placeOrder(): void {
        this.submitted.set(true);
        if (this.form.invalid) return;

        this.submitting.set(true);
        setTimeout(() => {
            this.cartService.clearCart();
            this.router.navigate(['/order-confirmation']);
        }, 1200);
    }
}
