import {
    Component, Input, OnInit, OnDestroy, AfterViewInit,
    ElementRef, ViewChild, signal, inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../../core/models/product.model';
import { ThreeSceneService } from '../../../core/services/three-scene.service';

@Component({
    selector: 'app-three-scene',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './three-scene.component.html',
    styleUrl: './three-scene.component.scss',
})
export class ThreeSceneComponent implements AfterViewInit, OnDestroy {
    @ViewChild('threeCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;

    @Input({ required: true }) product!: Product;
    @Input() selectedImageIndex = 0;

    private threeService = inject(ThreeSceneService);

    showHint = signal(true);
    activeThumb = signal(0);

    ngAfterViewInit(): void {
        const canvas = this.canvasRef.nativeElement;
        this.threeService.initScene(canvas);
        this.loadImage(this.selectedImageIndex);

        // Fade out hint after 3 seconds
        setTimeout(() => this.showHint.set(false), 3000);
    }

    loadImage(idx: number): void {
        this.activeThumb.set(idx);
        const path = this.product.images[idx];
        if (path) {
            this.threeService.loadImagePlane(path);
        }
    }

    resetView(): void {
        this.threeService.resetView();
    }

    ngOnDestroy(): void {
        this.threeService.dispose();
    }
}
