import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

@Injectable({ providedIn: 'root' })
export class ThreeSceneService {
    private scene!: THREE.Scene;
    private camera!: THREE.PerspectiveCamera;
    private renderer!: THREE.WebGLRenderer;
    private controls!: OrbitControls;
    private animFrameId!: number;
    private currentMesh: THREE.Mesh | null = null;

    initScene(canvas: HTMLCanvasElement): void {
        // Scene
        this.scene = new THREE.Scene();
        this.scene.background = null;

        // Camera
        const aspect = canvas.clientWidth / canvas.clientHeight;
        this.camera = new THREE.PerspectiveCamera(40, aspect, 0.1, 100);
        this.camera.position.set(0, 0, 3.5);

        // Renderer
        this.renderer = new THREE.WebGLRenderer({
            canvas,
            antialias: true,
            alpha: true,
        });
        this.renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.outputColorSpace = THREE.SRGBColorSpace;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.2;

        // Lighting
        this.setupLighting();

        // Controls
        this.controls = new OrbitControls(this.camera, canvas);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.minDistance = 1.5;
        this.controls.maxDistance = 8;
        this.controls.autoRotate = true;
        this.controls.autoRotateSpeed = 0.5;
        this.controls.enablePan = false;

        // Handle resize
        this.handleResize(canvas);

        // Start animation loop
        this.animate();
    }

    private setupLighting(): void {
        // Ambient light — warm, soft fill
        const ambient = new THREE.AmbientLight(0xfff6e0, 0.6);
        this.scene.add(ambient);

        // Key light — sharp directional
        const keyLight = new THREE.DirectionalLight(0xffffff, 1.5);
        keyLight.position.set(3, 4, 3);
        keyLight.castShadow = true;
        this.scene.add(keyLight);

        // Rim light — gold tinted point light
        const rimLight = new THREE.PointLight(0xC9A84C, 1.2, 10);
        rimLight.position.set(-3, 1, -2);
        this.scene.add(rimLight);

        // Fill light
        const fillLight = new THREE.DirectionalLight(0x8090c0, 0.4);
        fillLight.position.set(-2, -1, 2);
        this.scene.add(fillLight);
    }

    loadImagePlane(imagePath: string): void {
        // Remove existing mesh
        if (this.currentMesh) {
            this.scene.remove(this.currentMesh);
            this.currentMesh.geometry.dispose();
            (this.currentMesh.material as THREE.Material).dispose();
        }

        const loader = new THREE.TextureLoader();
        const texture = loader.load(imagePath, (tex) => {
            // Maintain image aspect ratio
            const ratio = tex.image.width / tex.image.height;
            const geometry = new THREE.PlaneGeometry(ratio * 2, 2, 1, 1);

            const material = new THREE.MeshStandardMaterial({
                map: tex,
                transparent: true,
                roughness: 0.15,
                metalness: 0.05,
                side: THREE.DoubleSide,
            });

            this.currentMesh = new THREE.Mesh(geometry, material);
            this.scene.add(this.currentMesh);
        });
    }

    resetView(): void {
        if (this.controls) {
            this.controls.reset();
        }
    }

    private handleResize(canvas: HTMLCanvasElement): void {
        const resizeObserver = new ResizeObserver(() => {
            const width = canvas.clientWidth;
            const height = canvas.clientHeight;
            this.camera.aspect = width / height;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(width, height);
        });
        resizeObserver.observe(canvas.parentElement!);
    }

    private animate(): void {
        this.animFrameId = requestAnimationFrame(() => this.animate());

        if (this.currentMesh && this.controls.autoRotate === false) {
            // gentle bob when not auto-rotating
            this.currentMesh.rotation.y += 0.003;
        }

        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }

    dispose(): void {
        cancelAnimationFrame(this.animFrameId);
        this.controls?.dispose();
        this.renderer?.dispose();

        this.scene?.traverse((obj) => {
            if (obj instanceof THREE.Mesh) {
                obj.geometry.dispose();
                if (Array.isArray(obj.material)) {
                    obj.material.forEach(m => m.dispose());
                } else {
                    obj.material.dispose();
                }
            }
        });
    }
}
