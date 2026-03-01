import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { injectSpeedInsights } from '@vercel/speed-insights';

/**
 * Service to inject Vercel Speed Insights tracking script.
 * This service should be initialized once in the app lifecycle.
 */
@Injectable({
  providedIn: 'root'
})
export class SpeedInsightsService {
  private platformId = inject(PLATFORM_ID);
  private initialized = false;

  /**
   * Initializes Speed Insights tracking.
   * Should only be called once, and only runs in the browser.
   */
  init(): void {
    // Only inject in browser environment and if not already initialized
    if (isPlatformBrowser(this.platformId) && !this.initialized) {
      injectSpeedInsights();
      this.initialized = true;
    }
  }
}
