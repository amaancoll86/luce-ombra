import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-order-confirmation',
    standalone: true,
    imports: [RouterLink],
    template: `
    <div class="confirmation">
      <div class="confirmation__card">
        <!-- Animated checkmark -->
        <div class="confirmation__icon-wrap">
          <svg class="confirmation__check" width="80" height="80" viewBox="0 0 100 100"
               fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle class="confirmation__circle" cx="50" cy="50" r="46"
                    stroke="#C9A84C" stroke-width="2"/>
            <polyline class="confirmation__tick" points="30,52 44,66 70,36"
                      stroke="#C9A84C" stroke-width="3"
                      stroke-linecap="round" stroke-linejoin="round"
                      fill="none"/>
          </svg>
        </div>

        <h1 class="confirmation__title">Order Placed</h1>
        <p class="confirmation__order-num">
          Order #LO-{{ orderNumber }}
        </p>
        <p class="confirmation__message">
          Your order has been received. You'll receive a confirmation email shortly.<br>
          Estimated delivery: <strong>3–5 business days.</strong>
        </p>

        <div class="confirmation__divider"></div>

        <div class="confirmation__actions">
          <a routerLink="/shop" class="confirmation__cta">
            Continue Shopping
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </a>
          <a routerLink="/" class="confirmation__home-link">Back to Home</a>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .confirmation {
      min-height: 100vh;
      padding-top: 72px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 72px var(--space-md) var(--space-3xl);
    }

    .confirmation__card {
      text-align: center;
      max-width: 500px;
      width: 100%;
      padding: var(--space-2xl) var(--space-xl);
      border: 1px solid var(--color-border);
      background: var(--color-surface);
      animation: scaleIn 0.6s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .confirmation__icon-wrap {
      display: flex;
      justify-content: center;
      margin-bottom: var(--space-xl);
    }

    .confirmation__circle {
      stroke-dasharray: 290;
      stroke-dashoffset: 290;
      animation: drawCheckmark 0.8s ease 0.2s forwards;
    }

    .confirmation__tick {
      stroke-dasharray: 60;
      stroke-dashoffset: 60;
      animation: drawCheckmark 0.5s ease 0.9s forwards;
    }

    .confirmation__title {
      font-family: var(--font-display);
      font-size: 42px;
      font-weight: 300;
      color: var(--color-white);
      margin-bottom: var(--space-sm);
    }

    .confirmation__order-num {
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: var(--color-gold);
      margin-bottom: var(--space-lg);
    }

    .confirmation__message {
      font-size: 13px;
      color: var(--color-muted-light);
      line-height: 1.8;
      margin-bottom: 0;

      strong { color: var(--color-white); font-weight: 500; }
    }

    .confirmation__divider {
      height: 1px;
      background: var(--color-border);
      margin: var(--space-xl) 0;
    }

    .confirmation__actions {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--space-md);
    }

    .confirmation__cta {
      display: inline-flex;
      align-items: center;
      gap: var(--space-sm);
      padding: var(--space-md) var(--space-xl);
      background: var(--color-gold);
      color: var(--color-bg);
      font-family: var(--font-body);
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      text-decoration: none;
      width: 100%;
      justify-content: center;
      transition: background var(--transition-base);

      &:hover { background: var(--color-gold-light); }
    }

    .confirmation__home-link {
      font-size: 12px;
      color: var(--color-muted);
      text-decoration: none;
      letter-spacing: 0.05em;
      transition: color var(--transition-base);

      &:hover { color: var(--color-white); }
    }
  `],
})
export class OrderConfirmationComponent {
    orderNumber = Math.random().toString(36).substring(2, 8).toUpperCase();
}
