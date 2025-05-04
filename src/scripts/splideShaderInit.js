import * as THREE from 'three';
import Splide from '@splidejs/splide';

export async function initShaderCarousel() {
    if (typeof window === 'undefined') return; 
  
    window.THREE = THREE;
  
    const Shader = (await import('../lib/splide-extension-shader.min.js')).default;
  
    const thumbnails = new Splide('#thumbnail-carousel', {
      fixedWidth: 100,
      fixedHeight: 60,
      isNavigation: true,
      gap: 10,
      rewind: true,
      pagination: false,
      cover: true,
      focus: 'center',
      breakpoints: {
        640: {
          fixedWidth: 66,
          fixedHeight: 40,
        },
      },
    }).mount();
  
    const main = new Splide('#shader-carousel', {
      type: 'loop',
      heightRatio: 0.5,
      pagination: false,
      arrows: true,
      cover: true,
      extensions: { Shader },
      shader: {
        intensity: 1,
        speed: 1.2,
        texture: true,
      },
    });
  
    main.sync(thumbnails).mount();
  }