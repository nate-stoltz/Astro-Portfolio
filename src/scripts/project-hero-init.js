import { SketchSingle } from '../lib/webgl/sketch-single.js';

const canvas = document.getElementById('projectHero');
if (!canvas) throw new Error('Canvas not found');

const imageSrc = canvas.dataset.src;
if (!imageSrc) throw new Error('Image source not found');

const sketch = new SketchSingle({
	image: imageSrc,
	dom: canvas,
});

sketch.ready.then(() => {
	const start = canvas.offsetTop;
	const end = start + window.innerHeight;

	const container = document.querySelector('.main__section--projectHero');
	const heroCopy = document.querySelector('.main__article--projectHero');

	function updateProgress() {
		const scrollY = window.scrollY;
		const rawProgress = (scrollY - start) / (end - start);
		const clamped = Math.max(0, Math.min(rawProgress, 1));
		const opacity = 1 - clamped;

		// WebGL shader fade
		sketch.uniforms.u_progress.value = opacity;

		// Optional: fade out any DOM content (e.g. text), if desired
		if (heroCopy) {
			const fastFade = Math.max(0, 1 - clamped * 2);
			heroCopy.style.opacity = fastFade;
			heroCopy.style.transition = 'opacity 0.3s ease-out';
		}

		// Z-index toggle for parent container — no fading
		if (container) {
			if (clamped === 1) {
				container.style.zIndex = '-1';
				container.style.pointerEvents = 'none';
			} else {
				container.style.zIndex = '1'; // or your default stack order
				container.style.pointerEvents = 'auto';
			}
		}
	}

	updateProgress();
	window.addEventListener('scroll', updateProgress);
});
