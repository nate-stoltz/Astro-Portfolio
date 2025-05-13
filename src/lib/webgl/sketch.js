import * as THREE from 'three';
import { gsap } from 'gsap';

import fragmentShader from '../shaders/perlin.fs.glsl';
import vertexShader from '../shaders/default.vs.glsl';

export class Sketch {
	constructor({ images, dom, duration = 1.2, autoRotate = true, rotateInterval = 5000 }) {
		this.images = images;
		this.container = dom;
		this.currentIndex = 0;
		this.clock = new THREE.Clock();
		this.transitionDuration = duration;
		this.rotateInterval = rotateInterval;
		this.autoRotate = autoRotate;
		this.timer = null;
		this._isTransitioning = false;

		Object.defineProperty(this, 'isTransitioning', {
			get: () => this._isTransitioning
		});

		this.ready = this.init();
	}

	async init() {
        this.scene = new THREE.Scene();
        this.width = this.container.offsetWidth;
        this.height = this.container.offsetHeight;
    
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(this.width, this.height);
        this.container.appendChild(this.renderer.domElement);
    
        const aspect = this.width / this.height;
        this.camera = new THREE.OrthographicCamera(-aspect, aspect, 1, -1, 1, 1000);
        this.camera.position.z = 1;
    
        await this.loadTextures();
        this.createPlane();
        this.render();
        this.bindEvents();
        this.startAutoRotate();
    
        // ✅ Defer resize + scale until layout and texture are stable
        requestAnimationFrame(() => {
            this.handleResize();
        });
    
        window.addEventListener('resize', this.handleResize);
        window.addEventListener('orientationchange', this.handleResize);
    }

	async loadTextures() {
		const loader = new THREE.TextureLoader();
		this.textures = [];

		for (const src of this.images) {
			try {
				const texture = await loader.loadAsync(src);
				this.textures.push(texture);
			} catch (err) {
				console.error(`❌ Failed to load image: ${src}`, err);
			}
		}
	}

    createPlane() {
	const img = this.textures[this.currentIndex]?.image;

	// fallback until texture is loaded
	const imageAspect = img ? img.width / img.height : 1;

	const canvasAspect = this.width / this.height;
	let geometry;

	if (imageAspect > canvasAspect) {
		// Image is wider relative to canvas
		const width = 2 * canvasAspect * (imageAspect / canvasAspect);
		geometry = new THREE.PlaneGeometry(width, 2);
	} else {
		// Image is taller relative to canvas
		const height = 2 * (canvasAspect / imageAspect);
		geometry = new THREE.PlaneGeometry(2 * canvasAspect, height);
	}

	this.uniforms = {
		u_progress: { value: 0 },
		u_texture1: { value: this.textures[this.currentIndex] },
		u_texture2: { value: this.textures[this.currentIndex] },
		scale: { value: 4.0 },
		smoothness: { value: 0.01 },
		seed: { value: 12.9898 }
	};

	this.material = new THREE.ShaderMaterial({
		uniforms: this.uniforms,
		fragmentShader,
		vertexShader,
		transparent: true
	});

	this.plane = new THREE.Mesh(geometry, this.material);
	this.scene.add(this.plane);
}
    

	scalePlaneToCover() {
        // const img = this.textures[this.currentIndex]?.image;
        // if (!img) return;
    
        // const imageAspect = img.width / img.height;
        // const canvasAspect = this.width / this.height;
    
        // let scale;
    
        // if (canvasAspect > imageAspect) {
        //     // Canvas is wider → scale based on width, crop height
        //     scale = canvasAspect / imageAspect;
        // } else {
        //     // Canvas is taller → scale based on height, crop width
        //     scale = imageAspect / canvasAspect;
        // }
    
        // this.plane.scale.set(scale, scale, 1);
    
        // console.log('Image aspect:', imageAspect.toFixed(3), 'Canvas aspect:', canvasAspect.toFixed(3));
        // console.log('Final uniform scale:', scale.toFixed(3));
    }

	render = () => {
		this.renderer.render(this.scene, this.camera);
		this.raf = requestAnimationFrame(this.render);
	};

	handleResize = () => {
	this.width = this.container.offsetWidth;
	this.height = this.container.offsetHeight;

	this.renderer.setSize(this.width, this.height);
	this.renderer.setPixelRatio(window.devicePixelRatio);

	// Update camera
	const aspect = this.width / this.height;
	this.camera.left = -aspect;
	this.camera.right = aspect;
	this.camera.top = 1;
	this.camera.bottom = -1;
	this.camera.updateProjectionMatrix();

	// Recreate the plane based on new aspect ratio and current image
	this.scene.remove(this.plane);
	this.createPlane();
};

	goTo(index) {
		if (this._isTransitioning || index === this.currentIndex || !this.textures[index]) return;

		this._isTransitioning = true;

		this.uniforms.u_texture1.value = this.textures[this.currentIndex];
		this.uniforms.u_texture2.value = this.textures[index];
		this.uniforms.u_progress.value = 0;

		this.uniforms.seed.value = Math.random() * 1000;
		this.uniforms.scale.value = 3.5 + Math.random();

		gsap.to(this.uniforms.u_progress, {
			value: 1,
			duration: this.transitionDuration,
			ease: 'power2.out',
			onComplete: () => {
				this.currentIndex = index;
				this._isTransitioning = false;
				this.scalePlaneToCover();

				window.dispatchEvent(new CustomEvent('webglTransitionComplete', {
					detail: { index }
				}));
			}
		});
	}

	next() {
		const nextIndex = (this.currentIndex + 1) % this.textures.length;
		this.goTo(nextIndex);
	}

	prev() {
		const prevIndex = (this.currentIndex - 1 + this.textures.length) % this.textures.length;
		this.goTo(prevIndex);
	}

	startAutoRotate() {
		if (this.autoRotate) {
			this.timer = setInterval(() => this.next(), this.rotateInterval);
		}
	}

	stopAutoRotate() {
		if (this.timer) {
			clearInterval(this.timer);
			this.timer = null;
		}
	}

	bindEvents() {
		let startX = 0;
		let isTouching = false;

		const onStart = (e) => {
			isTouching = true;
			startX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
			this.stopAutoRotate();
		};

		const onEnd = (e) => {
			if (!isTouching) return;
			isTouching = false;

			const endX = e.type.includes('touch') ? e.changedTouches[0].clientX : e.clientX;
			const diff = endX - startX;

			if (Math.abs(diff) > 30) {
				if (diff > 0) {
					this.prev();
				} else {
					this.next();
				}
			}

			this.startAutoRotate();
		};

		this.container.addEventListener('touchstart', onStart);
		this.container.addEventListener('touchend', onEnd);
		this.container.addEventListener('pointerdown', onStart);
		this.container.addEventListener('pointerup', onEnd);
	}

	destroy() {
		cancelAnimationFrame(this.raf);
		this.renderer.dispose();
		window.removeEventListener('resize', this.handleResize);
		window.removeEventListener('orientationchange', this.handleResize);
		if (this.timer) clearInterval(this.timer);
	}
}
