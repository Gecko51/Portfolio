// Shaders du fond Hero — quad full-screen, fbm noise 2D + dégradé ember vertical + vignettage.
// Inline strings : évite la configuration loader GLSL et reste portable Turbopack/Webpack.
// Le commentaire /* glsl */ active le syntax highlighting de l'extension VS Code "WebGL GLSL Editor".

export const emberVert = /* glsl */ `
  // Vertex shader minimal — passe l'UV au fragment.
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const emberFrag = /* glsl */ `
  // Fragment shader — fbm noise animé, gradient ember (#0A0A0A → #FF5B1F * 0.6), vignettage.
  precision highp float;

  uniform float uTime;
  varying vec2 vUv;

  // Hash 2D — pseudo-random à partir d'un vec2.
  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  // Noise 2D bilineaire interpolé.
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
      f.y
    );
  }

  // FBM 5 octaves — turbulence douce.
  float fbm(vec2 p) {
    float sum = 0.0;
    float amp = 0.5;
    for (int i = 0; i < 5; i++) {
      sum += amp * noise(p);
      p *= 2.0;
      amp *= 0.5;
    }
    return sum;
  }

  void main() {
    vec2 uv = vUv;

    // Noise animé — drift vertical lent pour éviter l'effet "screen-saver".
    float n = fbm(uv * 3.0 + vec2(0.0, uTime * 0.05));

    // Couleurs tokens projet : bg #0A0A0A et accent #FF5B1F.
    vec3 bgColor = vec3(0.039, 0.039, 0.039);
    vec3 emberColor = vec3(1.0, 0.357, 0.122);

    // Gradient vertical : sombre en bas, légèrement ember en haut.
    float gradient = pow(uv.y, 1.8);
    vec3 color = mix(bgColor, emberColor * 0.6, gradient * 0.5);

    // Modulation noise dans la moitié haute, atténuée par le gradient.
    color += emberColor * n * gradient * 0.3;

    // Vignettage doux — assombrit les coins, met le focus au centre/haut.
    float vignette = 1.0 - length(uv - 0.5) * 0.8;
    color *= clamp(vignette, 0.3, 1.0);

    gl_FragColor = vec4(color, 1.0);
  }
`;
