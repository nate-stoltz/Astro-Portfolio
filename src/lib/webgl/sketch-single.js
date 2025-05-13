import * as THREE from 'three';
import fragmentShader from '../shaders/perlin2.fs.glsl';
import vertexShader from '../shaders/default.vs.glsl';

export class SketchSingle {
	constructor({ image, dom }) {
		this.image = image;
		this.container = dom;
		this.clock = new THREE.Clock();

		this.uniforms = {
			u_progress: { value: 0 },
			u_texture1: { value: null },
			u_texture2: { value: null },
			scale: { value: 4.0 },
			smoothness: { value: 0.01 },
			seed: { value: 12.9898 }
		};

		this.ready = this.init();
	}

	async init() {
		this.scene = new THREE.Scene();
		this.width = this.container.offsetWidth;
		this.height = this.container.offsetHeight;

		this.renderer = new THREE.WebGLRenderer({ canvas: this.container, alpha: true });
		this.renderer.setPixelRatio(window.devicePixelRatio);
		this.renderer.setSize(this.width, this.height);

		const aspect = this.width / this.height;
		this.camera = new THREE.OrthographicCamera(-aspect, aspect, 1, -1, 1, 1000);
		this.camera.position.z = 1;

		await this.loadTexture();
		this.uniforms.seed.value = Math.random() * 1000; 
		this.createPlane();
		this.render();

		this.handleResize();

		window.addEventListener('resize', this.handleResize);
		window.addEventListener('orientationchange', this.handleResize);
	}

	async loadTexture() {
		const loader = new THREE.TextureLoader();

		this.uniforms.u_texture1.value = await new Promise((resolve, reject) => {
			loader.load(
				this.image,
				(texture) => {
					const img = texture.image;
					if (img?.complete && img.naturalWidth > 0) {
						resolve(texture);
					} else {
						img.onload = () => {
							if (img.naturalWidth > 0) {
								resolve(texture);
							} else {
								reject(new Error('Image failed to load dimensions.'));
							}
						};
					}
				},
				undefined,
				reject
			);
		});

		this.uniforms.u_texture2.value = this.uniforms.u_texture1.value;
	}


	createPlane() {
		const img = this.uniforms.u_texture1.value.image;

		if (!img || !img.width || !img.height) {
			console.warn('⚠️ Image dimensions are not ready:', img);
			return;
		}

		const imageAspect = img.width / img.height;
		const canvasAspect = this.width / this.height;

		let geometry;
		if (imageAspect > canvasAspect) {
			const width = 2 * canvasAspect * (imageAspect / canvasAspect);
			geometry = new THREE.PlaneGeometry(width, 2);
		} else {
			const height = 2 * (canvasAspect / imageAspect);
			geometry = new THREE.PlaneGeometry(2 * canvasAspect, height);
		}

		this.material = new THREE.ShaderMaterial({
			uniforms: this.uniforms,
			fragmentShader,
			vertexShader,
			transparent: true,
		});

		this.plane = new THREE.Mesh(geometry, this.material);
		this.scene.add(this.plane);
	}


	handleResize = () => {
	this.width = this.container.offsetWidth;
	this.height = this.container.offsetHeight;

	// ✅ Resize renderer
	this.renderer.setSize(this.width, this.height);
	this.renderer.setPixelRatio(window.devicePixelRatio);

	// ✅ Update orthographic camera bounds
	const aspect = this.width / this.height;
	this.camera.left = -aspect;
	this.camera.right = aspect;
	this.camera.top = 1;
	this.camera.bottom = -1;
	this.camera.updateProjectionMatrix();

	if (this.plane) {
		this.scene.remove(this.plane);

		if (this.plane.geometry) {
			this.plane.geometry.dispose();
		}

		if (this.plane.material) {
			this.plane.material.dispose();
		}

		this.plane = null;
	}

	this.createPlane();
};


	render = () => {
		this.renderer.render(this.scene, this.camera);
		this.raf = requestAnimationFrame(this.render);
	};

	destroy() {
		cancelAnimationFrame(this.raf);
		this.renderer.dispose();
		window.removeEventListener('resize', this.handleResize);
		window.removeEventListener('orientationchange', this.handleResize);
	}
}
