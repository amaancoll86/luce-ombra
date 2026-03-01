import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

/**
 * Marks a URL as trusted so Angular's DomSanitizer doesn't block it
 * when used as a <video> or <audio> src (ResourceURL security context).
 *
 * Only use this pipe for URLs you control (local assets, not user input).
 */
@Pipe({
    name: 'safeUrl',
    standalone: true,
})
export class SafeUrlPipe implements PipeTransform {
    constructor(private sanitizer: DomSanitizer) { }

    transform(url: string | undefined | null): SafeResourceUrl {
        return this.sanitizer.bypassSecurityTrustResourceUrl(url ?? '');
    }
}
