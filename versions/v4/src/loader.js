import * as THREE from 'https://cdn.skypack.dev/three@0.136.0';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/controls/OrbitControls';
import { CSS2DRenderer } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/renderers/CSS2DRenderer.js';

let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight, 1,2000);
camera.position.set(0.5, 0.5, 1).setLength(14);
let renderer = new THREE.WebGLRenderer({
canvas: document.querySelector('.loader-globe'),
alpha: true,
antialias: true
});
renderer.setSize(innerWidth, innerHeight);
renderer.setClearColor(0x000000, 0);

let loaderRenderer = new CSS2DRenderer();
loaderRenderer.setSize( window.innerWidth, window.innerHeight );
loaderRenderer.domElement.style.position = 'absolute';
loaderRenderer.domElement.style.top = '0';
loaderRenderer.domElement.style.left = '0';
loaderRenderer.domElement.style.zIndex = '999';

window.addEventListener('resize', onWindowResize);

let controls = new OrbitControls(camera, loaderRenderer.domElement);
controls.enablePan = false;
controls.minDistance = 6;
controls.maxDistance = 15;
controls.enableDamping = true;
controls.autoRotate = true;
controls.autoRotateSpeed *= 5;
controls.enableZoom = false;

let globalUniforms = {
time: { value: 0 }
};

// globe /////////////////////////////////////////////////
let counter = 1000;
let rad = .5;
let sph = new THREE.Spherical();

let r = 0;
let dlong = Math.PI * (3 - Math.sqrt(5));
let dz = 2 / counter;
let long = 0;
let z = 1 - dz / 2;

let pts = [];
let clr = [];
let c = new THREE.Color();
let uvs = [];

for (let i = 0; i < counter; i++) {
r = Math.sqrt(1 - z * z);
let p = new THREE.Vector3(
    Math.cos(long) * r,
    z,
    -Math.sin(long) * r
).multiplyScalar(rad);

pts.push(p);
z -= dz;
long += dlong;

c.setHSL(0, 0, Math.random() * 50 + 2);
c.toArray(clr, i * 3);

sph.setFromVector3(p);
uvs.push((sph.theta + Math.PI) / (Math.PI * 2), 1 - sph.phi / Math.PI);
}

let g = new THREE.BufferGeometry().setFromPoints(pts);
g.setAttribute('color', new THREE.Float32BufferAttribute(clr, 3));
g.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));

let m = new THREE.PointsMaterial({
size: 0.1,
vertexColors: true,
onBeforeCompile: (shader) => {
    shader.uniforms.globeTexture = { value: new THREE.TextureLoader().load(imgData) };

    shader.vertexShader = `
    uniform sampler2D globeTexture;
    varying float vVisibility;
    varying vec3 vNormal;
    varying vec3 vMvPosition;
    ${shader.vertexShader}
    `.replace(
    `gl_PointSize = size;`,
    `
    vVisibility = texture(globeTexture, uv).g;
    gl_PointSize = size * (vVisibility < .5 ? 1. : .3);
    vNormal = normalMatrix * normalize(position);
    vMvPosition = -mvPosition.xyz;
    gl_PointSize *= 0.4 + (dot(normalize(vMvPosition), vNormal) * 0.6);
    `
    );

    shader.fragmentShader = `
    varying float vVisibility;
    varying vec3 vNormal;
    varying vec3 vMvPosition;
    ${shader.fragmentShader}
    `.replace(
    `vec4 diffuseColor = vec4( diffuse, opacity );`,
    `
    bool circ = length(gl_PointCoord - .5) > .5;
    bool vis = dot(vMvPosition, vNormal) < 0.;
    if (circ || vis) discard;
    vec3 col = diffuse + (vVisibility > .5 ? .5 : 0.);
    vec4 diffuseColor = vec4( col, opacity );
    `
    );
}
});

let loaderGlobe = new THREE.Points(g, m);
let clock = new THREE.Clock();

renderer.setAnimationLoop(() => {
    let t = clock.getElapsedTime();
    globalUniforms.time.value = t;
    controls.update();
    renderer.render(scene, camera);
    loaderRenderer.render(scene, camera);
});

function onWindowResize() {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(innerWidth, innerHeight);
    loaderRenderer.setSize(innerWidth, innerHeight);
}
scene.add(loaderGlobe);


// progress bar ////////////////////////////////////////////////

document.addEventListener("DOMContentLoaded", () => {
let loaderContainer = document.querySelector(".loader");
let loaderCanva = document.querySelector(".loader-globe");
let loaderBar = document.querySelector(".progress");
let progressBar = document.getElementById("progress-bar");
let loaderLogo = document.querySelector('.loader-logo');

function loadProgress() {
    let progress = 0;
    let interval = setInterval(() => {
        progress += Math.random() * ( Math.random() * .5 ) * 20;
        progressBar.style.width = progress + "%";

        if (progress >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                loaderBar.style.display = 'none';
                loaderCanva.style.display = 'none';
                loaderLogo.style.animation = 'loaderLogo 1.5s cubic-bezier(0.4, 0, 0.2, 1) forwards';
                loaderLogo.style.animationFillMode = 'both';
            }, 700);
        }
    }, 50);
}
// loaderLogo.addEventListener("animationend", () => {
//     setTimeout(() => {
//         loaderContainer.style.display = 'none';
//         liveRender();
//     }, 1000);
// });

loadProgress();
});