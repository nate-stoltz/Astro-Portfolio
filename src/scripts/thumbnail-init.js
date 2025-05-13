import { images } from '../lib/webgl/images.js';

const isMobile = /Mobi|Android|iPhone|iPad|iPod/.test(navigator.userAgent);
const getOrientation = () =>
	!isMobile ? 'landscape' : window.innerWidth > window.innerHeight ? 'landscape' : 'portrait';

let thumbs = [];
let current = 0;
let visibleOffset = 0;
let thumbContainer;

const VISIBLE_COUNT = 3;

const updateActive = (index) => {
	thumbs.forEach((el, i) => {
		el.classList.toggle('active', i === index);
	});
	current = index;
	updateThumbScroll(index);
};

const updateThumbScroll = (index) => {
	const thumbEl = thumbs[0];
	if (!thumbEl) return;

	const thumbStyles = getComputedStyle(thumbEl);
	const thumbWidth = thumbEl.offsetWidth;
	const gap = parseFloat(thumbStyles.marginRight || '0');

	const maxOffset = Math.max(0, thumbs.length - VISIBLE_COUNT);
	const clamped = Math.min(index, maxOffset);
	visibleOffset = clamped;

	const shift = (thumbWidth + gap) * visibleOffset * -1;
	thumbContainer.style.transform = `translateX(${shift}px)`;
};

const renderThumbnails = (set) => {
	thumbContainer = document.getElementById('thumbnails');
	if (!thumbContainer) return;

	thumbContainer.innerHTML = '';
	thumbs = [];

	set.forEach((img, index) => {
		const thumb = document.createElement('img');
		thumb.src = img.src;
		thumb.alt = img.alt;
		thumb.className = 'thumb';
		thumb.loading = 'lazy';
		thumb.dataset.index = index;

		thumb.addEventListener('click', () => {
			if (!window.WebGLCarousel?.isTransitioning) {
				window.WebGLCarousel.goTo(index);
			}
		});

		thumbs.push(thumb);
		thumbContainer.appendChild(thumb);
	});

	updateActive(current);
};

const setupNav = () => {
	document.querySelector('.nav.next')?.addEventListener('click', () => {
		if (window.WebGLCarousel?.isTransitioning) return;
		const next = (current + 1) % thumbs.length;
		window.WebGLCarousel.goTo(next);
	});

	document.querySelector('.nav.prev')?.addEventListener('click', () => {
		if (window.WebGLCarousel?.isTransitioning) return;
		const prev = (current - 1 + thumbs.length) % thumbs.length;
		window.WebGLCarousel.goTo(prev);
	});
};

document.addEventListener('DOMContentLoaded', () => {
	const orientation = getOrientation();
	const set = images[orientation];

	renderThumbnails(set);
	setupNav();
});

window.addEventListener('webglTransitionComplete', (e) => {
	updateActive(e.detail.index);
});

window.addEventListener('orientationchange', () => {
	setTimeout(() => {
		const orientation = getOrientation();
		const set = images[orientation];
		renderThumbnails(set);
	}, 300);
});