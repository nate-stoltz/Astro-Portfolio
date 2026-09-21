const base = import.meta.env.BASE_URL.replace(/\/$/, '');
const img = (path) => `${base}${path}`;

export const images = {
	landscape: [
		{ src: img('/images/carousel/landscape/xfinity-img-1.jpg'), alt: 'Xfinity' },
		{ src: img('/images/carousel/landscape/humana-img-1.jpg'), alt: 'Humana' },
		{ src: img('/images/carousel/landscape/lenz-img-1.jpg'), alt: 'Lenz' },
		{ src: img('/images/carousel/landscape/tkc-img-1.jpg'), alt: 'True Story' },
		{ src: img('/images/carousel/landscape/xfinity-img-2.jpg'), alt: 'Xfinity' },
	],
	portrait: [
		{ src: img('/images/carousel/landscape/xfinity-img-1.jpg'), alt: 'Xfinity' },
		{ src: img('/images/carousel/portrait/humana-img-1.jpg'), alt: 'Humana' },
		{ src: img('/images/carousel/portrait/lenz-img-1.jpg'), alt: 'Lenz' },
		{ src: img('/images/carousel/portrait/tkc-img-1.jpg'), alt: 'True Story' },
		{ src: img('/images/carousel/portrait/xfinity-img-2.jpg'), alt: 'Xfinity' },
	]
};
