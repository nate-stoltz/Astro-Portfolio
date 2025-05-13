import { Sketch } from '../lib/webgl/sketch.js';
import { images } from '../lib/webgl/images.js';

const getOrientation = () =>
	window.innerWidth > window.innerHeight ? 'landscape' : 'portrait';

const container = document.getElementById('webgl-container');
let sketch;

window.WebGLCarousel = {
	init: async () => {
		const orientation = getOrientation();
		const selectedImages = images[orientation].map(i => i.src);

		sketch = new Sketch({
			dom: container,
			images: selectedImages,
			duration: 1.5,
			autoRotate: false,
			rotateInterval: 7000
		});

		await sketch.ready;
	},

	goTo: (index) => {
		if (sketch) sketch.goTo(index);
	},

	setShader: (name) => {
		if (sketch?.setShader) sketch.setShader(name);
	}
};

window.WebGLCarousel.init();

// Optional: reload on orientation change
window.addEventListener('orientationchange', () => {
	location.reload();
});