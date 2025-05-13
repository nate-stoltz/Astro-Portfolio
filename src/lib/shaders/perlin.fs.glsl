#ifdef GL_ES
precision highp float;
#endif

uniform float u_progress;
uniform sampler2D u_texture1;
uniform sampler2D u_texture2;
uniform float scale;       // = 4.0
uniform float smoothness;  // = 0.01
uniform float seed;        // = 12.9898

varying vec2 vUv;

// GLSL noise from Rich Harris
float random(vec2 co) {
    float a = seed;
    float b = 78.233;
    float c = 43758.5453;
    float dt = dot(co.xy, vec2(a, b));
    float sn = mod(dt, 3.14);
    return fract(sin(sn) * c);
}

float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(a, b, u.x) +
           (c - a) * u.y * (1.0 - u.x) +
           (d - b) * u.x * u.y;
}

void main() {
    vec4 from = texture2D(u_texture1, vUv);
    vec4 to = texture2D(u_texture2, vUv);

    float n = noise(vUv * scale);
    float p = mix(-smoothness, 1.0 + smoothness, u_progress);
    float lower = p - smoothness;
    float higher = p + smoothness;
    float q = smoothstep(lower, higher, n);

    gl_FragColor = mix(from, to, 1.0 - q);
}
